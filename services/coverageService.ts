import {
  MAP_BOUNDS,
  KM_PER_DEG_LAT,
  KM_PER_DEG_LON,
  GRID_WIDTH,
  GRID_HEIGHT,
  GRID_CELL_SIZE_KM,
  SENSOR_DEFINITIONS,
  ALTITUDE_LEVELS_KM,
  ALTITUDE_LEVELS_FT,
} from '../constants';
import { Sensor, CoverageGrid, CoverageStatus, SuggestedSensorLocation, Airport } from '../types';

// --- UTILITY FUNCTIONS ---
const deg2rad = (deg: number) => deg * (Math.PI / 180);

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


export function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const y = (MAP_BOUNDS.maxLat - lat) * KM_PER_DEG_LAT;
  const x = (lon - MAP_BOUNDS.minLon) * KM_PER_DEG_LON;
  return { x, y };
}

export function xyToLatLon(x: number, y: number): { lat: number; lon: number } {
    const lon = x / KM_PER_DEG_LON + MAP_BOUNDS.minLon;
    const lat = MAP_BOUNDS.maxLat - y / KM_PER_DEG_LAT;
    return { lat, lon };
}

export function createCountryGrid(allAirports: Airport[]): string[][] {
  const grid: string[][] = Array(GRID_WIDTH).fill("").map(() => Array(GRID_HEIGHT).fill("")); // "" represents sea/unassigned
  if (allAirports.length === 0) return grid;

  // Stricter heuristic to prevent labeling sea as land
  const MAX_LAND_DISTANCE_KM = 200; 

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      const cellX_km = (i + 0.5) * GRID_CELL_SIZE_KM;
      const cellY_km = (j + 0.5) * GRID_CELL_SIZE_KM;
      
      let closestAirport: Airport | null = null;
      let minDistanceSq = Infinity;

      for (const airport of allAirports) {
        const { x: airportX_km, y: airportY_km } = latLonToXY(airport.lat, airport.lon);
        const dx = cellX_km - airportX_km;
        const dy = cellY_km - airportY_km;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < minDistanceSq) {
          minDistanceSq = distSq;
          closestAirport = airport;
        }
      }
      
      if (closestAirport && Math.sqrt(minDistanceSq) <= MAX_LAND_DISTANCE_KM) {
        grid[i][j] = closestAirport.country;
      }
    }
  }
  return grid;
}


export function calculateCoverageGrids(sensors: Sensor[], activeAltitudeIndexes: number[]): {
  coverageGrid: CoverageGrid;
  coverageDetailGrid: string[][][][];
} {
  const coverageGrid: CoverageGrid = Array(GRID_WIDTH).fill(0).map(() => Array(GRID_HEIGHT).fill(CoverageStatus.EMPTY));
  const coverageDetailGrid: string[][][][] = Array(GRID_WIDTH).fill(0).map(() => Array(GRID_HEIGHT).fill(0).map(() => Array(ALTITUDE_LEVELS_KM.length).fill(0).map(() => [])));
  const activeSensors = sensors.filter(s => s.isActive);

  if (activeSensors.length === 0) {
    // If no sensors, the whole grid is RED
     for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            coverageGrid[i][j] = CoverageStatus.RED;
        }
    }
    return { coverageGrid, coverageDetailGrid };
  }

  activeSensors.forEach(sensor => {
    const { x, y } = latLonToXY(sensor.lat, sensor.lon);
    sensor.x = x;
    sensor.y = y;
  });
  
  const minHitsInCellFiltered: number[][] = Array(GRID_WIDTH).fill(0).map(() => Array(GRID_HEIGHT).fill(Infinity));

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {

      for (let k = 0; k < ALTITUDE_LEVELS_KM.length; k++) {
        const altitudeKm = ALTITUDE_LEVELS_KM[k];
        activeSensors.forEach(sensor => {
          const sensorDef = SENSOR_DEFINITIONS[sensor.type];
          const dx = (i + 0.5) * GRID_CELL_SIZE_KM - sensor.x;
          const dy = (j + 0.5) * GRID_CELL_SIZE_KM - sensor.y;
          const horizontalDistSq = dx * dx + dy * dy;
          const distSq = horizontalDistSq + altitudeKm * altitudeKm;
          if (distSq <= sensorDef.rangeKm * sensorDef.rangeKm) {
            if (!sensorDef.hasConeOfSilence || Math.sqrt(horizontalDistSq) > sensorDef.coneOfSilenceRadiusKm) {
              coverageDetailGrid[i][j][k].push(sensor.id);
            }
          }
        });
        
        if (activeAltitudeIndexes.includes(k)) {
            const hitsAtThisAltitude = coverageDetailGrid[i][j][k].length;
             minHitsInCellFiltered[i][j] = Math.min(minHitsInCellFiltered[i][j], hitsAtThisAltitude);
        }
      }
      
      if (minHitsInCellFiltered[i][j] === Infinity) { // This happens if no altitude is selected
        minHitsInCellFiltered[i][j] = 0;
      }

      if (minHitsInCellFiltered[i][j] >= 2) {
        coverageGrid[i][j] = CoverageStatus.GREEN;
      } else if (minHitsInCellFiltered[i][j] === 1) {
        coverageGrid[i][j] = CoverageStatus.ORANGE;
      } else {
        coverageGrid[i][j] = CoverageStatus.RED;
      }
    }
  }

  return { coverageGrid, coverageDetailGrid };
}