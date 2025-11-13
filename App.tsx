import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { AIRPORTS_BY_COUNTRY, SENSOR_DEFINITIONS, MAP_BOUNDS, GRID_WIDTH, GRID_HEIGHT, GRID_CELL_SIZE_KM, MAP_ID, ALTITUDE_LEVELS_FT } from './constants';
import { Sensor, Airport, CoverageGrid, CoverageStatus, SensorType, Aircraft, FlightPhase, SuggestedSensorLocation } from './types';
import { calculateCoverageGrids, latLonToXY, xyToLatLon, createCountryGrid, haversineDistance } from './services/coverageService';
import { SimulationEngine } from './simulation';

// Type definitions for Google Maps API to ensure type safety
declare global {
  interface Window {
    google: any;
  }
  namespace google.maps {
      class Map {
          constructor(element: HTMLElement, opts: any);
          addListener(eventName: string, handler: (...args: any[]) => void): any;
          setCenter(latLng: any): void;
          setZoom(zoom: number): void;
          getBounds(): any;
          getCenter(): any;
          getZoom(): number;
      }
      class InfoWindow {
          constructor(opts?: any);
          open(map?: Map): void;
          close(): void;
          setContent(content: Node): void;
          setPosition(position: any): void;
          getPosition(): any;
          addListener(eventName: string, handler: (e?: any) => void): void;
      }
      namespace marker {
          class AdvancedMarkerElement {
              constructor(options: any);
              position: any;
              content: HTMLElement;
              map: Map | null;
          }
      }
      class OverlayView {
          constructor(opts?: any);
          static OVERLAY_MOUSE_TARGET: any;
          setMap(map: Map | null): void;
          getPanes(): any;
          getProjection(): any;
          onAdd(): void;
          onRemove(): void;
          draw(): void;
      }
      class LatLng {
          constructor(lat: number, lng: number);
          lat(): number;
          lng(): number;
      }
      class LatLngBounds {
        constructor(sw?: any, ne?: any);
        getSouthWest(): any;
        getNorthEast(): any;
      }
      class event {
        static removeListener(listener: any): void;
      }
  }
}


const ALL_AIRPORTS = Object.values(AIRPORTS_BY_COUNTRY).flat();
const ALL_COUNTRIES = Object.keys(AIRPORTS_BY_COUNTRY).sort();

// --- Main App Component ---
const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('googleMapsApiKey'));
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(!apiKey);

    const handleApiKeySubmit = (key: string) => {
        if (key.trim()) {
            localStorage.setItem('googleMapsApiKey', key);
            setApiKey(key);
            setIsKeyModalOpen(false);
        }
    };

    if (!apiKey || isKeyModalOpen) {
        return <ApiKeyModal onSubmit={handleApiKeySubmit} />;
    }

    return <MapView apiKey={apiKey} />;
};

// --- API Key Modal ---
const ApiKeyModal: React.FC<{ onSubmit: (key: string) => void }> = ({ onSubmit }) => {
    const [key, setKey] = useState('');
    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <h2>Enter Google Maps API Key</h2>
                <p>Please provide your Google Maps API key to use this application.</p>
                <input
                    type="text"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder="Your API Key"
                    style={styles.apiKeyInput}
                />
                <button onClick={() => onSubmit(key)} style={styles.apiKeySubmit}>Submit</button>
            </div>
        </div>
    );
};

// --- Map View (Main UI) ---
const MapView: React.FC<{ apiKey: string }> = ({ apiKey }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    
    const [airportSensors, setAirportSensors] = useState<Sensor[]>([]);
    const [userSensors, setUserSensors] = useState<Sensor[]>([]);
    
    const [isPlacingSensor, setIsPlacingSensor] = useState(false);
    const [testSensor, setTestSensor] = useState<Sensor | null>(null);

    const allSensors = useMemo(() => {
        const sensors = [...airportSensors, ...userSensors];
        if (testSensor) {
            sensors.push(testSensor);
        }
        return sensors;
    }, [airportSensors, userSensors, testSensor]);

    const [activeCountries, setActiveCountries] = useState<Set<string>>(new Set(['BE']));
    const [coverage, setCoverage] = useState<{ grid: CoverageGrid, detailGrid: string[][][][] } | null>(null);
    const [simulation, setSimulation] = useState<SimulationEngine | null>(null);
    const [simulationTime, setSimulationTime] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(300);
    const [altitudeRange, setAltitudeRange] = useState([0, 39]); // Indexes for 1000ft to 40000ft
    
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number, lat: number, lon: number } | null>(null);
    const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
    
    const animationFrameId = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeAirports = useMemo(() => {
        return ALL_AIRPORTS.filter(airport => activeCountries.has(airport.country));
    }, [activeCountries]);
    
    const activeAltitudeIndexes = useMemo(() => {
        const indexes: number[] = [];
        for (let i = altitudeRange[0]; i <= altitudeRange[1]; i++) {
            indexes.push(i);
        }
        return indexes;
    }, [altitudeRange]);
    
    // --- Effects ---
    
    useEffect(() => {
        const loadMap = () => {
            if (window.google && mapRef.current) {
                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 50.8503, lng: 4.3517 },
                    zoom: 5,
                    mapId: MAP_ID,
                    disableDefaultUI: true,
                    styles: [ { "featureType": "all", "elementType": "all", "stylers": [ { "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" } ] } ]
                });
                setMap(mapInstance);
            }
        };

        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&map_ids=${MAP_ID}&libraries=marker`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.head.appendChild(script);
        } else {
            loadMap();
        }
    }, [apiKey]);

    useEffect(() => {
      if (!map) return;
      const clickListener = map.addListener('click', (e: any) => {
          if (isPlacingSensor) {
              // The new workflow uses a button, so clicking the map does nothing in placement mode.
              return;
          }

          if (isSimulating) {
              if (simulation?.activeAircraft) {
                  const clickedPos = { lat: e.latLng.lat(), lon: e.latLng.lng() };
                  let closestAircraft: Aircraft | null = null;
                  let minDistance = Infinity;

                  simulation.activeAircraft.forEach(ac => {
                      const distance = haversineDistance(clickedPos.lat, clickedPos.lon, ac.position.lat, ac.position.lon);
                      if (distance < minDistance) {
                          minDistance = distance;
                          closestAircraft = ac;
                      }
                  });
                  
                  if (closestAircraft && minDistance < 20) { // 20km click radius
                      setSelectedAircraft(closestAircraft);
                      setSelectedCell(null);
                  } else {
                      setSelectedAircraft(null);
                  }
              }
          } else {
              const lat = e.latLng.lat();
              const lon = e.latLng.lng();
              const { x, y } = latLonToXY(lat, lon);
              const gridX = Math.floor(x / GRID_CELL_SIZE_KM);
              const gridY = Math.floor(y / GRID_CELL_SIZE_KM);
              if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
                  setSelectedCell({ x: gridX, y: gridY, lat, lon });
                  setSelectedAircraft(null);
              }
          }
      });
      return () => { window.google?.maps.event.removeListener(clickListener); };
    }, [map, isSimulating, simulation, isPlacingSensor]);
    
    useEffect(() => {
        const newSensors: Sensor[] = [];
        activeAirports.forEach(airport => {
            const passengerCount = airport.passengers;
            const {lat, lon} = airport;
            if (passengerCount >= 10_00_000) {
                newSensors.push({ id: `${airport.icao}-S-1`, name: `${airport.icao} Mode S`, type: SensorType.MODE_S, lat, lon, isActive: true, ...SENSOR_DEFINITIONS[SensorType.MODE_S], x: 0, y: 0 });
                newSensors.push({ id: `${airport.icao}-P-2`, name: `${airport.icao} Primary`, type: SensorType.PRIMARY, lat, lon, isActive: true, ...SENSOR_DEFINITIONS[SensorType.PRIMARY], x: 0, y: 0 });
            } else if (passengerCount >= 5_000_000) {
                 newSensors.push({ id: `${airport.icao}-S-1`, name: `${airport.icao} Mode S`, type: SensorType.MODE_S, lat, lon, isActive: true, ...SENSOR_DEFINITIONS[SensorType.MODE_S], x: 0, y: 0 });
            } else if (passengerCount >= 2_00_000) {
                 newSensors.push({ id: `${airport.icao}-A-1`, name: `${airport.icao} ADS-B`, type: SensorType.ADS_B, lat, lon, isActive: true, ...SENSOR_DEFINITIONS[SensorType.ADS_B], x: 0, y: 0 });
            }
        });
        setAirportSensors(newSensors);
    }, [activeAirports]);

    useEffect(() => {
        if (activeAirports.length > 0) {
            const newSim = new SimulationEngine(activeAirports);
            setSimulation(newSim);
        } else {
            setSimulation(null);
        }
    }, [activeAirports]);

    useEffect(() => {
        const { coverageGrid, coverageDetailGrid } = calculateCoverageGrids(allSensors, activeAltitudeIndexes);
        setCoverage({ grid: coverageGrid, detailGrid: coverageDetailGrid });
    }, [allSensors, activeAltitudeIndexes]);

    const runSimulation = useCallback((lastTime: number) => {
        const now = performance.now();
        const deltaTimeMs = now - lastTime;
        const deltaTimeSeconds = (deltaTimeMs / 1000) * simulationSpeed;
        setSimulationTime(prevTime => (prevTime + deltaTimeSeconds) % (24 * 60 * 60));
        animationFrameId.current = requestAnimationFrame(() => runSimulation(now));
    }, [simulationSpeed]);

    useEffect(() => {
        if (isSimulating) {
            animationFrameId.current = requestAnimationFrame(() => runSimulation(performance.now()));
        } else {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        }
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [isSimulating, runSimulation]);
    
    useEffect(() => {
        if (simulation && coverage && isSimulating) {
             const deltaTime = (1 / 60) * simulationSpeed; // Approximate delta time
             simulation.update(simulationTime, deltaTime, coverage.detailGrid);
        }
    }, [simulationTime, simulation, coverage, isSimulating, simulationSpeed]);

    // --- Handlers ---
    const handleCountryToggle = (countryCode: string) => {
        setActiveCountries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(countryCode)) newSet.delete(countryCode);
            else newSet.add(countryCode);
            return newSet;
        });
    };
    
    const handleSelectAllCountries = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setActiveCountries(new Set(ALL_COUNTRIES));
        else setActiveCountries(new Set());
    };

    const handleSetSensorAtCrosshair = () => {
        if (map) {
            const center = map.getCenter();
            const lat = center.lat();
            const lon = center.lng();
            setTestSensor({
                id: 'USER-TEST',
                name: `Test Sensor`,
                type: SensorType.MODE_S,
                lat,
                lon,
                isActive: true,
                ...SENSOR_DEFINITIONS[SensorType.MODE_S], x: 0, y: 0,
            });
            setIsPlacingSensor(false);
        }
    };
    
    const handleConfirmPlacement = () => {
        if (testSensor) {
            const permanentSensor = { ...testSensor, id: `USER-${Date.now()}`, name: `User Sensor #${userSensors.length + 1}` };
            setUserSensors(prev => [...prev, permanentSensor]);
            setTestSensor(null);
        }
    };

    const handleCancelPlacement = () => {
        setTestSensor(null);
        setIsPlacingSensor(false);
    };

    const handleExportSensors = () => {
        const data = JSON.stringify(userSensors.map(({ id, name, type, lat, lon, isActive }) => ({ id, name, type, lat, lon, isActive })), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'radar-sim-sensors.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target?.result as string);
                    if (Array.isArray(imported) && imported.every(s => 'lat' in s && 'lon' in s && 'type' in s)) {
                        const newSensors = imported.map((s: any) => ({
                            ...SENSOR_DEFINITIONS[s.type as SensorType],
                            x: 0, y: 0,
                            ...s,
                        }));
                        setUserSensors(newSensors);
                        alert(`Successfully imported ${newSensors.length} sensors.`);
                    } else {
                        throw new Error('Invalid file format.');
                    }
                } catch (error) {
                    alert('Failed to import sensors. Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    return (
        <div style={styles.container}>
            <div ref={mapRef} style={styles.map} />
            {isPlacingSensor && (
                 <div style={styles.crosshair}>
                    <div style={{...styles.crosshairLine, width: '30px', height: '1px'}}></div>
                    <div style={{...styles.crosshairLine, width: '1px', height: '30px'}}></div>
                 </div>
            )}
            {map && (
                <>
                    <CoverageOverlay map={map} grid={coverage?.grid ?? null} />
                    <SensorMarkers map={map} sensors={allSensors.filter(s => s.id !== testSensor?.id)} />
                    {testSensor && <TestSensorMarker map={map} sensor={testSensor} />}
                    {isSimulating && simulation && <AircraftMarkers map={map} aircraft={simulation.activeAircraft} coverageGrid={coverage?.grid ?? null} />}
                    
                    {selectedCell && coverage && (
                        <CustomInfoWindow
                            map={map}
                            position={{ lat: selectedCell.lat, lng: selectedCell.lon }}
                            onClose={() => setSelectedCell(null)}
                        >
                            <CellDetailReport
                                x={selectedCell.x}
                                y={selectedCell.y}
                                detailGrid={coverage.detailGrid}
                                sensors={allSensors}
                            />
                        </CustomInfoWindow>
                    )}
                    
                    {selectedAircraft && (
                         <CustomInfoWindow
                            map={map}
                            position={{ lat: selectedAircraft.position.lat, lng: selectedAircraft.position.lon }}
                            onClose={() => setSelectedAircraft(null)}
                        >
                            <AircraftDetailReport aircraft={selectedAircraft} />
                        </CustomInfoWindow>
                    )}
                </>
            )}

            <ControlPanel
                activeCountries={activeCountries}
                onCountryToggle={handleCountryToggle}
                onSelectAll={handleSelectAllCountries}
                altitudeRange={altitudeRange}
                onAltitudeChange={setAltitudeRange}
                isPlacingSensor={isPlacingSensor}
                onPlaceSensor={() => setIsPlacingSensor(true)}
                onSetSensorAtCrosshair={handleSetSensorAtCrosshair}
                testSensor={testSensor}
                onConfirmPlacement={handleConfirmPlacement}
                onCancelPlacement={handleCancelPlacement}
                onExport={handleExportSensors}
                onImport={handleImportClick}
                isSimulating={isSimulating}
                onToggleSimulation={() => setIsSimulating(p => !p)}
                simulationTime={simulationTime}
                simulationSpeed={simulationSpeed}
                onSpeedChange={setSimulationSpeed}
            />

            <SensorListPanel
                sensors={allSensors.filter(s => s.id !== 'USER-TEST')}
                onToggle={(sensorId) => {
                    const isUserSensor = userSensors.some(s => s.id === sensorId);
                    if (isUserSensor) {
                        setUserSensors(prev => prev.map(s => s.id === sensorId ? { ...s, isActive: !s.isActive } : s));
                    } else {
                        setAirportSensors(prev => prev.map(s => s.id === sensorId ? { ...s, isActive: !s.isActive } : s));
                    }
                }}
            />
            
             <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
    );
};

// --- Child Components ---

const ControlPanel: React.FC<any> = ({ activeCountries, onCountryToggle, onSelectAll, altitudeRange, onAltitudeChange, isPlacingSensor, onPlaceSensor, onSetSensorAtCrosshair, testSensor, onConfirmPlacement, onCancelPlacement, onExport, onImport, isSimulating, onToggleSimulation, simulationTime, simulationSpeed, onSpeedChange }) => {
    const [isCountriesOpen, setCountriesOpen] = useState(true);
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // FIX: Replaced useMemo with direct instantiation to avoid potential cryptic compiler errors.
    const numberFormatter = new Intl.NumberFormat('en-US');

    return (
        <div style={styles.panelLeft}>
            <h2 style={styles.panelTitle}>Radar Simulation</h2>
            <div style={styles.panelSection}>
                <button onClick={onToggleSimulation} style={isSimulating ? styles.pauseButton : styles.playButton}>
                    {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
                </button>
                <div style={styles.timeDisplay}>
                    <span>Sim Time: {formatTime(simulationTime)}</span>
                    <span>Speed: {simulationSpeed}x</span>
                </div>
                <input type="range" min="1" max="1000" step="1" value={simulationSpeed} onChange={e => onSpeedChange(Number(e.target.value))} style={{width: '100%'}}/>
            </div>

            <div style={styles.panelSection}>
                 <h3 style={styles.panelSubtitle}>Coverage Analysis</h3>
                 <label>Altitude Filter (ft): {ALTITUDE_LEVELS_FT[altitudeRange[0]] ? numberFormatter.format(ALTITUDE_LEVELS_FT[altitudeRange[0]]) : ''} - {ALTITUDE_LEVELS_FT[altitudeRange[1]] ? numberFormatter.format(ALTITUDE_LEVELS_FT[altitudeRange[1]]) : ''}</label>
                 <div>Min: <input type="range" min="0" max="39" value={altitudeRange[0]} onChange={e => onAltitudeChange([Math.min(Number(e.target.value), altitudeRange[1]), altitudeRange[1]])} style={{width: '80%'}}/></div>
                 <div>Max: <input type="range" min="0" max="39" value={altitudeRange[1]} onChange={e => onAltitudeChange([altitudeRange[0], Math.max(Number(e.target.value), altitudeRange[0])])} style={{width: '80%'}}/></div>
            </div>
            
            <div style={styles.panelSection}>
                <h3 style={styles.panelSubtitle}>Network Planning</h3>
                {testSensor ? (
                    <div>
                        <p>Confirm placement of new sensor?</p>
                        <div style={{display: 'flex', gap: '10px'}}>
                           <button onClick={onConfirmPlacement} style={{...styles.button, backgroundColor: '#4CAF50'}}>Confirm</button>
                           <button onClick={onCancelPlacement} style={{...styles.button, backgroundColor: '#F44336'}}>Cancel</button>
                        </div>
                    </div>
                ) : isPlacingSensor ? (
                    <div>
                        <p>Move map under crosshair to position sensor.</p>
                         <div style={{display: 'flex', gap: '10px'}}>
                            <button onClick={onSetSensorAtCrosshair} style={{...styles.button, backgroundColor: '#007bff'}}>Set Sensor at Crosshair</button>
                            <button onClick={onCancelPlacement} style={{...styles.button, backgroundColor: '#6c757d'}}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={onPlaceSensor} style={styles.button}>
                        Place New Sensor
                    </button>
                )}
                 <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button onClick={onExport} style={{...styles.button, opacity: isPlacingSensor || testSensor ? 0.5 : 1}} disabled={isPlacingSensor || !!testSensor}>Export User Sensors</button>
                    <button onClick={onImport} style={{...styles.button, opacity: isPlacingSensor || testSensor ? 0.5 : 1}} disabled={isPlacingSensor || !!testSensor}>Import User Sensors</button>
                </div>
            </div>

             <div style={styles.panelSection}>
                <h3 onClick={() => setCountriesOpen(!isCountriesOpen)} style={{...styles.panelSubtitle, cursor: 'pointer'}}>
                    Active Regions {isCountriesOpen ? '▼' : '▶'}
                </h3>
                {isCountriesOpen && (
                     <>
                        <div style={styles.countryToggle}>
                            <input type="checkbox" id="select-all" onChange={onSelectAll} checked={activeCountries.size === ALL_COUNTRIES.length} />
                            <label htmlFor="select-all">Select All</label>
                        </div>
                        <div style={styles.countryList}>
                            {ALL_COUNTRIES.map(code => (
                                <div key={code} style={styles.countryToggle}>
                                    <input type="checkbox" id={code} checked={activeCountries.has(code)} onChange={() => onCountryToggle(code)} />
                                    <label htmlFor={code}>{code}</label>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SensorListPanel: React.FC<{ sensors: Sensor[], onToggle: (id: string) => void }> = ({ sensors, onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div style={styles.panelRight}>
            <h3 onClick={() => setIsOpen(!isOpen)} style={{...styles.panelSubtitle, cursor: 'pointer', margin: 0, padding: '10px'}}>
                Sensor Network ({sensors.filter(s => s.isActive).length} / {sensors.length}) {isOpen ? '▼' : '▶'}
            </h3>
            {isOpen && (
                <div style={styles.sensorList}>
                    {sensors.map(sensor => (
                         <div key={sensor.id} style={styles.sensorItem}>
                            <input type="checkbox" checked={sensor.isActive} onChange={() => onToggle(sensor.id)} />
                            <span style={{color: sensorTypeToColor[sensor.type]}}>●</span>
                            <span style={{flex: 1}}>{sensor.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const CoverageOverlay: React.FC<{ map: google.maps.Map, grid: CoverageGrid | null }> = ({ map, grid }) => {
    const overlayRef = useRef<any>();

    useEffect(() => {
        if (!window.google) return;
        
        class CoverageOverlayView extends window.google.maps.OverlayView {
            private canvas: HTMLCanvasElement | null = null;
            private grid: CoverageGrid | null = null;
            
            constructor(private mapInstance: google.maps.Map, gridData: CoverageGrid | null) {
                super();
                this.grid = gridData;
                this.setMap(mapInstance);
            }
            
            onAdd() {
                this.canvas = document.createElement('canvas');
                this.canvas.style.position = 'absolute';
                this.canvas.style.pointerEvents = 'none';
                this.getPanes()?.overlayLayer.appendChild(this.canvas);
            }

            onRemove() {
                if (this.canvas) {
                    this.canvas.parentElement?.removeChild(this.canvas);
                    this.canvas = null;
                }
            }

            draw() {
                if (!this.canvas || !this.grid) return;

                const projection = this.getProjection();
                const bounds = this.mapInstance.getBounds();
                if (!projection || !bounds) return;

                const sw = projection.fromLatLngToDivPixel(bounds.getSouthWest());
                const ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());

                this.canvas.width = ne.x - sw.x;
                this.canvas.height = sw.y - ne.y;
                this.canvas.style.left = `${sw.x}px`;
                this.canvas.style.top = `${ne.y}px`;

                const ctx = this.canvas.getContext('2d');
                if (!ctx) return;
                
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                for (let i = 0; i < GRID_WIDTH; i++) {
                    for (let j = 0; j < GRID_HEIGHT; j++) {
                        const cellStatus = this.grid[i][j];
                        if (cellStatus === CoverageStatus.EMPTY) continue;

                        const { lat: cellLat, lon: cellLon } = xyToLatLon((i + 0.5) * GRID_CELL_SIZE_KM, (j + 0.5) * GRID_CELL_SIZE_KM);
                        const cellLatLng = new window.google.maps.LatLng(cellLat, cellLon);

                        if (bounds.contains(cellLatLng)) {
                             const { lat: nwLat, lon: nwLon } = xyToLatLon(i * GRID_CELL_SIZE_KM, j * GRID_CELL_SIZE_KM);
                             const { lat: seLat, lon: seLon } = xyToLatLon((i + 1) * GRID_CELL_SIZE_KM, (j + 1) * GRID_CELL_SIZE_KM);
                             const nw = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(nwLat, nwLon));
                             const se = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(seLat, seLon));

                             if (!nw || !se) continue;
                             
                             const rectX = nw.x - sw.x;
                             const rectY = nw.y - ne.y;
                             const rectW = se.x - nw.x;
                             const rectH = se.y - nw.y;
                             
                             ctx.fillStyle = statusToColor[cellStatus];
                             ctx.fillRect(rectX, rectY, rectW, rectH);
                        }
                    }
                }
            }

            updateGrid(newGrid: CoverageGrid | null) {
                this.grid = newGrid;
                this.draw();
            }
        }
        
        if (!overlayRef.current) {
            overlayRef.current = new CoverageOverlayView(map, grid);
        } else {
            overlayRef.current.updateGrid(grid);
        }

        const idleListener = map.addListener('idle', () => overlayRef.current?.draw());
        return () => {
            window.google.maps.event.removeListener(idleListener);
            if(overlayRef.current) {
                overlayRef.current.setMap(null);
                overlayRef.current = null;
            }
        };

    }, [map]);
    
    useEffect(() => {
        overlayRef.current?.updateGrid(grid);
    }, [grid]);

    return null;
};

const SensorMarkers: React.FC<{ map: google.maps.Map, sensors: Sensor[] }> = ({ map, sensors }) => {
    const markersRef = useRef<{ [id: string]: any }>({});

    useEffect(() => {
        const currentMarkers = markersRef.current;
        const sensorIds = new Set(sensors.map(s => s.id));

        Object.keys(currentMarkers).forEach(id => {
            if (!sensorIds.has(id)) {
                currentMarkers[id].map = null;
                delete currentMarkers[id];
            }
        });

        sensors.forEach(sensor => {
            const el = document.createElement('div');
            el.style.width = '16px';
            el.style.height = '16px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = sensorTypeToColor[sensor.type];
            el.style.border = '2px solid white';
            el.style.opacity = sensor.isActive ? '0.9' : '0.3';
            el.style.transform = 'translate(-50%, -50%)';
            el.title = sensor.name;

            if (currentMarkers[sensor.id]) {
                currentMarkers[sensor.id].position = { lat: sensor.lat, lng: sensor.lon };
                currentMarkers[sensor.id].content = el;
            } else {
                currentMarkers[sensor.id] = new window.google.maps.marker.AdvancedMarkerElement({
                    position: { lat: sensor.lat, lng: sensor.lon },
                    map,
                    content: el
                });
            }
        });

    }, [map, sensors]);
    
    useEffect(() => {
        const currentMarkers = markersRef.current;
        return () => {
            Object.values(currentMarkers).forEach(marker => marker.map = null);
        }
    }, []);

    return null;
};

const TestSensorMarker: React.FC<{ map: google.maps.Map, sensor: Sensor }> = ({ map, sensor }) => {
    const markerRef = useRef<any>();
    const pulseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = document.createElement('div');
        el.innerHTML = `
            <style>
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                    100% { transform: scale(0.9); opacity: 1; }
                }
            </style>
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #00FFFF; border: 2px solid white; animation: pulse 1.5s infinite; transform: translate(-50%, -50%);"></div>
        `;

        if (!markerRef.current) {
            markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({ map, content: el });
        }
        markerRef.current.position = { lat: sensor.lat, lng: sensor.lon };

        return () => {
            if (markerRef.current) {
                markerRef.current.map = null;
                markerRef.current = null;
            }
        };
    }, [map, sensor]);

    return null;
};


const AircraftMarkers: React.FC<{ map: google.maps.Map, aircraft: Aircraft[], coverageGrid: CoverageGrid | null }> = ({ map, aircraft, coverageGrid }) => {
     const markersRef = useRef<{ [id: string]: any }>({});
    
    useEffect(() => {
        const currentMarkers = markersRef.current;
        const aircraftIds = new Set(aircraft.map(a => a.id));
        const numberFormatter = new Intl.NumberFormat('en-US');

        Object.keys(currentMarkers).forEach(id => {
            if (!aircraftIds.has(id)) {
                currentMarkers[id].map = null;
                delete currentMarkers[id];
            }
        });

        aircraft.forEach(ac => {
            const { lat, lon, alt } = ac.position;
            const { x, y } = latLonToXY(lat, lon);
            const gridX = Math.floor(x / GRID_CELL_SIZE_KM);
            const gridY = Math.floor(y / GRID_CELL_SIZE_KM);
            
            let color = '#FFC107'; // Default yellow
            if (coverageGrid && gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
                const altIndex = ALTITUDE_LEVELS_FT.findIndex(level => alt < level);
                if (altIndex !== -1) {
                    const status = coverageGrid[gridX][gridY];
                    if (status === CoverageStatus.GREEN) color = '#4CAF50';
                    else if (status === CoverageStatus.ORANGE) color = '#FF9800';
                    else if (status === CoverageStatus.RED) color = '#F44336';
                }
            }

            const el = document.createElement('div');
            el.innerHTML = `
                <div title="${ac.flightNumber} @ ${numberFormatter.format(Math.round(alt))} ft" style="transform: rotate(${ac.heading - 90}deg)  translate(-50%, -50%); transform-origin: center; position: absolute;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                </div>`;
            
            const position = { lat, lng: lon };

            if (currentMarkers[ac.id]) {
                currentMarkers[ac.id].position = position;
                currentMarkers[ac.id].content = el;
            } else {
                currentMarkers[ac.id] = new window.google.maps.marker.AdvancedMarkerElement({
                    position,
                    map,
                    content: el,
                    zIndex: 1000
                });
            }
        });

    }, [map, aircraft, coverageGrid]);
    
    useEffect(() => {
        const currentMarkers = markersRef.current;
        return () => {
             Object.values(currentMarkers).forEach(marker => marker.map = null);
        }
    }, []);

    return null;
}

const CustomInfoWindow: React.FC<{ map: google.maps.Map, position: {lat: number, lng: number}, onClose: () => void, children: React.ReactNode }> = ({ map, position, onClose, children }) => {
    const iwRef = useRef<google.maps.InfoWindow>();
    const containerRef = useRef<HTMLDivElement>();
    const rootRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) {
            containerRef.current = document.createElement('div');
        }
        if (!rootRef.current) {
            rootRef.current = ReactDOM.createRoot(containerRef.current);
        }
        if (!iwRef.current) {
            iwRef.current = new window.google.maps.InfoWindow({ content: containerRef.current, disableAutoPan: true });
            iwRef.current.addListener('closeclick', onClose);
        }

        rootRef.current.render(children);
        iwRef.current.setPosition(position);
        iwRef.current.open(map);

        const styleInterval = setInterval(() => {
            const iwContainer = containerRef.current?.closest('.gm-style-iw-d')?.parentElement;
            if (iwContainer) {
                iwContainer.style.backgroundColor = 'transparent';
                iwContainer.style.boxShadow = 'none';
                iwContainer.style.border = 'none';
                const iwTail = iwContainer.nextElementSibling;
                if(iwTail) (iwTail as HTMLElement).style.display = 'none';
                clearInterval(styleInterval);
            }
        }, 10);
        
        return () => clearInterval(styleInterval);

    }, [map, position, children, onClose]);
    
    useEffect(() => {
        return () => {
            iwRef.current?.close();
            if (rootRef.current) {
                setTimeout(() => rootRef.current.unmount(), 0);
                rootRef.current = null;
            }
        };
    }, []);

    return null;
};

const CellDetailReport: React.FC<{ x: number, y: number, detailGrid: string[][][][], sensors: Sensor[]}> = ({ x, y, detailGrid, sensors }) => {
    const sensorMap = useMemo(() => new Map(sensors.map(s => [s.id, s.name])), [sensors]);
    const cellDataByAlt = detailGrid[x]?.[y] ?? [];
    
    const categorized = { green: [], orange: [], red: [] };
    cellDataByAlt.forEach((sensorIds, altIndex) => {
        const alt = ALTITUDE_LEVELS_FT[altIndex];
        const entry = { alt, sensors: sensorIds.map(id => sensorMap.get(id) ?? id) };
        if (sensorIds.length >= 2) (categorized.green as any).push(entry);
        else if (sensorIds.length === 1) (categorized.orange as any).push(entry);
        else (categorized.red as any).push(entry);
    });

    // FIX: Replaced useMemo with direct instantiation to avoid potential cryptic compiler errors.
    const numberFormatter = new Intl.NumberFormat('en-US');

    return (
        <div style={styles.infoWindow}>
            <h4 style={styles.infoWindowTitle}>Coverage Report: Grid ({x}, {y})</h4>
            <div style={styles.infoWindowSection}>
                <h5 style={{...styles.infoWindowSubtitle, color: statusToColor.GREEN}}>Fully Covered ({categorized.green.length})</h5>
                 {categorized.green.slice(0, 5).map(({ alt, sensors }: any) => <div key={alt}>{numberFormatter.format(alt)} ft: {sensors.join(', ')}</div>)}
                 {categorized.green.length > 5 && <div>...and {categorized.green.length - 5} more</div>}
            </div>
            <div style={styles.infoWindowSection}>
                <h5 style={{...styles.infoWindowSubtitle, color: statusToColor.ORANGE}}>Partially Covered ({categorized.orange.length})</h5>
                 {categorized.orange.slice(0, 5).map(({ alt, sensors }: any) => <div key={alt}>{numberFormatter.format(alt)} ft: {sensors.join(', ')}</div>)}
                 {categorized.orange.length > 5 && <div>...and {categorized.orange.length - 5} more</div>}
            </div>
            <div style={styles.infoWindowSection}>
                <h5 style={{...styles.infoWindowSubtitle, color: statusToColor.RED}}>No Coverage ({categorized.red.length})</h5>
                {categorized.red.length > 0 ? 
                    `${categorized.red.map(({alt}: any) => numberFormatter.format(alt)).slice(0,5).join(', ')} ft...`
                    : 'None'
                }
            </div>
        </div>
    );
}

const AircraftDetailReport: React.FC<{ aircraft: Aircraft }> = ({ aircraft }) => {
    const totalTime = aircraft.timeInGreenSec + aircraft.timeInOrangeSec + aircraft.timeInRedSec;
    const formatPercent = (time: number) => totalTime > 0 ? `${((time / totalTime) * 100).toFixed(1)}%` : '0.0%';
    // FIX: Replaced useMemo with direct instantiation to avoid potential cryptic compiler errors.
    const numberFormatter = new Intl.NumberFormat('en-US');

    return (
        <div style={styles.infoWindow}>
            <h4 style={styles.infoWindowTitle}>{aircraft.flightNumber} ({aircraft.origin.icao} → {aircraft.destination.icao})</h4>
            <p><strong>Status:</strong> {FlightPhase[aircraft.phase]}<br/>
            <strong>Altitude:</strong> {numberFormatter.format(Math.round(aircraft.position.alt))} ft<br/>
            <strong>Speed:</strong> {Math.round(aircraft.speedKmh)} km/h<br/>
            <strong>Heading:</strong> {Math.round(aircraft.heading)}°</p>
            <div style={styles.infoWindowSection}>
                 <h5 style={styles.infoWindowSubtitle}>Coverage Analysis</h5>
                 <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
                    <div><strong>{formatPercent(aircraft.timeInGreenSec)}</strong><div style={{color: statusToColor.GREEN}}>Full</div></div>
                    <div><strong>{formatPercent(aircraft.timeInOrangeSec)}</strong><div style={{color: statusToColor.ORANGE}}>Partial</div></div>
                    <div><strong>{formatPercent(aircraft.timeInRedSec)}</strong><div style={{color: statusToColor.RED}}>None</div></div>
                 </div>
                 <div style={{fontSize: '0.8em', textAlign: 'center', marginTop: '5px'}}>
                    Total Minutes: {(totalTime / 60).toFixed(1)}
                 </div>
            </div>
        </div>
    );
};

const statusToColor: { [key in CoverageStatus | string]: string } = {
    [CoverageStatus.GREEN]: 'rgba(76, 175, 80, 0.5)',
    'GREEN': 'rgba(76, 175, 80, 1)',
    [CoverageStatus.ORANGE]: 'rgba(255, 152, 0, 0.5)',
    'ORANGE': 'rgba(255, 152, 0, 1)',
    [CoverageStatus.RED]: 'rgba(244, 67, 54, 0.5)',
    'RED': 'rgba(244, 67, 54, 1)',
    [CoverageStatus.EMPTY]: 'transparent'
};

const sensorTypeToColor: { [key in SensorType]: string } = {
    [SensorType.ADS_B]: '#03A9F4', 
    [SensorType.MODE_S]: '#FFC107',
    [SensorType.PRIMARY]: '#9C27B0'
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { width: '100%', height: '100%', position: 'relative' },
    map: { width: '100%', height: '100%' },
    panelLeft: { position: 'absolute', top: '10px', left: '10px', width: '320px', backgroundColor: 'rgba(40, 40, 40, 0.9)', borderRadius: '8px', padding: '15px', color: '#f0f0f0', maxHeight: 'calc(100% - 20px)', overflowY: 'auto', backdropFilter: 'blur(5px)' },
    panelRight: { position: 'absolute', top: '10px', right: '10px', width: '280px', backgroundColor: 'rgba(40, 40, 40, 0.9)', borderRadius: '8px', color: '#f0f0f0', maxHeight: 'calc(100% - 20px)', overflow: 'hidden', backdropFilter: 'blur(5px)' },
    panelTitle: { margin: '0 0 15px 0', borderBottom: '1px solid #555', paddingBottom: '10px' },
    panelSubtitle: { margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '5px', fontSize: '1.1em' },
    panelSection: { marginBottom: '20px' },
    button: { backgroundColor: '#4a4a4a', color: 'white', border: '1px solid #666', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' },
    playButton: { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '1em' },
    pauseButton: { backgroundColor: '#F44336', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '1em' },
    timeDisplay: { display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '0.9em' },
    countryList: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', fontSize: '0.9em' },
    countryToggle: { display: 'flex', alignItems: 'center', gap: '5px' },
    sensorList: { overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', padding: '0 10px 10px 10px' },
    sensorItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid #333', fontSize: '0.9em' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #444' },
    apiKeyInput: { padding: '10px', width: '300px', margin: '10px 0', backgroundColor: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' },
    apiKeySubmit: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    infoWindow: { backgroundColor: 'rgba(40, 40, 40, 0.95)', color: '#f0f0f0', padding: '15px', borderRadius: '8px', width: '280px', fontSize: '0.9em', backdropFilter: 'blur(5px)', border: '1px solid #555' },
    infoWindowTitle: { margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #555' },
    infoWindowSubtitle: { margin: '0 0 5px 0', paddingBottom: '3px', borderBottom: '1px solid #444', fontSize: '1em' },
    infoWindowSection: { marginBottom: '10px' },
    crosshair: { position: 'absolute', top: '50%', left: '50%', width: '30px', height: '30px', pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translate(-50%, -50%)', zIndex: 1000 },
    crosshairLine: { position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.8)' },
};

export default App;