import { AIRCRAFT_CAPACITY, SECONDS_IN_DAY, DAY_START_HOUR, DAY_END_HOUR, DAY_NIGHT_TRAFFIC_RATIO, AIRCRAFT_CRUISE_SPEED_KMH, AIRCRAFT_CLIMB_RATE_FPM, AIRCRAFT_DESCENT_RATE_FPM, ALTITUDE_LEVELS_FT, GRID_HEIGHT, GRID_WIDTH, GRID_CELL_SIZE_KM } from './constants';
import { Airport, Aircraft, FlightPhase, WindVector } from './types';
import { latLonToXY, haversineDistance } from './services/coverageService';

// --- UTILITY FUNCTIONS ---
const deg2rad = (deg: number) => deg * (Math.PI / 180);
const rad2deg = (rad: number) => rad * (180 / Math.PI);

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = deg2rad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(deg2rad(lat2));
    const x = Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
              Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(dLon);
    const bearing = rad2deg(Math.atan2(y, x));
    return (bearing + 360) % 360;
}

function getDestinationLatLon(lat: number, lon: number, bearing: number, distanceKm: number) {
    const R = 6371; // Earth's radius in km
    const dR = distanceKm / R;
    const latRad = deg2rad(lat);
    const lonRad = deg2rad(lon);
    const bearingRad = deg2rad(bearing);
    const asinArg = Math.sin(latRad) * Math.cos(dR) + Math.cos(latRad) * Math.sin(dR) * Math.cos(bearingRad);
    const destLatRad = Math.asin(Math.max(-1, Math.min(1, asinArg)));
    const destLonRad = lonRad + Math.atan2(Math.sin(bearingRad) * Math.sin(dR) * Math.cos(latRad), Math.cos(dR) - Math.sin(latRad) * Math.sin(destLatRad));
    return { lat: rad2deg(destLatRad), lon: rad2deg(destLonRad) };
}

// --- SIMULATION ENGINE ---

export class SimulationEngine {
    public aircraft: Aircraft[] = [];
    public activeAircraft: Aircraft[] = [];
    public windField: WindVector[][];
    private lastWindUpdate: number = 0;

    constructor(activeAirports: Airport[]) {
        this.windField = this.generateWindField();
        this.generateFullDayFlightPlan(activeAirports);
    }

    private generateWindField(): WindVector[][] {
        // Simplified wind field for now
        return Array.from({ length: 10 }, () => 
            Array.from({ length: 10 }, () => ({
                direction: Math.random() * 360,
                speedKph: 10 + Math.random() * 30
            }))
        );
    }

    public getWindAt(lat: number, lon: number): WindVector {
        // For simplicity, return a single global wind for now
        return this.windField[0][0];
    }
    
    public update(simulationTime: number, deltaTimeSeconds: number, coverageDetailGrid: string[][][][]) {
        // Activate scheduled flights
        this.aircraft.forEach(ac => {
            if (ac.phase === FlightPhase.SCHEDULED && simulationTime >= ac.departureTime) {
                ac.phase = FlightPhase.CLIMBING;
                this.activeAircraft.push(ac);
            }
        });

        // Update active flights
        this.activeAircraft = this.activeAircraft.filter(ac => {
            if (ac.phase === FlightPhase.LANDED) return false;
            
            const remainingDistance = haversineDistance(ac.position.lat, ac.position.lon, ac.destination.lat, ac.destination.lon);
            const descentDist = (ac.cruiseAltitude - ac.destination.elevation) / AIRCRAFT_DESCENT_RATE_FPM * (AIRCRAFT_CRUISE_SPEED_KMH / 60);

            if (ac.phase === FlightPhase.CLIMBING && ac.position.alt >= ac.cruiseAltitude) {
                ac.phase = FlightPhase.CRUISING;
            } 
            else if (ac.phase === FlightPhase.CRUISING && remainingDistance <= descentDist) {
                ac.phase = FlightPhase.DESCENDING;
            } 
            else if (ac.phase === FlightPhase.DESCENDING && remainingDistance < 1) { 
                ac.phase = FlightPhase.LANDED;
                ac.position.lat = ac.destination.lat;
                ac.position.lon = ac.destination.lon;
                ac.position.alt = ac.destination.elevation;
                return false; 
            }

            const speedKmh = AIRCRAFT_CRUISE_SPEED_KMH;
            const distanceIncrement = (speedKmh / 3600) * deltaTimeSeconds;
            
            switch (ac.phase) {
                case FlightPhase.CLIMBING:
                    ac.position.alt += (AIRCRAFT_CLIMB_RATE_FPM / 60) * deltaTimeSeconds;
                    break;
                case FlightPhase.DESCENDING:
                    const altitudeToLose = ac.position.alt - ac.destination.elevation;
                    if (remainingDistance > 0.1 && altitudeToLose > 0) {
                        const timeToDestinationSeconds = (remainingDistance / speedKmh) * 3600;
                        const requiredDescentRateFps = altitudeToLose / timeToDestinationSeconds;
                        ac.position.alt -= requiredDescentRateFps * deltaTimeSeconds;
                    } else {
                         ac.position.alt -= (AIRCRAFT_DESCENT_RATE_FPM / 60) * deltaTimeSeconds;
                    }
                    break;
                case FlightPhase.CRUISING:
                    ac.position.alt = ac.cruiseAltitude;
                    break;
            }
            ac.position.alt = Math.max(ac.destination.elevation, ac.position.alt);

            ac.distanceCoveredKm += distanceIncrement;
            ac.speedKmh = speedKmh;
            ac.heading = getBearing(ac.position.lat, ac.position.lon, ac.destination.lat, ac.destination.lon);

            const newPos = getDestinationLatLon(ac.position.lat, ac.position.lon, ac.heading, distanceIncrement);
            ac.position.lat = newPos.lat;
            ac.position.lon = newPos.lon;
            
            const { x, y } = latLonToXY(ac.position.lat, ac.position.lon);
            const gridX = Math.floor(x / GRID_CELL_SIZE_KM);
            const gridY = Math.floor(y / GRID_CELL_SIZE_KM);
            
            if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
                const altIndex = ALTITUDE_LEVELS_FT.findIndex(level => ac.position.alt < level);
                if (altIndex !== -1) {
                    const hits = coverageDetailGrid[gridX]?.[gridY]?.[altIndex]?.length ?? 0;
                    if (hits >= 2) ac.timeInGreenSec += deltaTimeSeconds;
                    else if (hits === 1) ac.timeInOrangeSec += deltaTimeSeconds;
                    else ac.timeInRedSec += deltaTimeSeconds;
                } else {
                    ac.timeInRedSec += deltaTimeSeconds;
                }
            } else {
                ac.timeInRedSec += deltaTimeSeconds;
            }
            
            return true;
        });
        
        if (simulationTime - this.lastWindUpdate > 600) {
            this.windField = this.generateWindField();
            this.lastWindUpdate = simulationTime;
        }
    }

    private generateFullDayFlightPlan(airports: Airport[]) {
        if (airports.length < 2) {
            this.aircraft = [];
            return;
        }
        
        const flights: Aircraft[] = [];
        let flightIdCounter = 100;
        
        airports.forEach(origin => {
            const dailyFlights = Math.ceil(((origin.passengers / 365) / AIRCRAFT_CAPACITY) / 10);
            const dayFlights = Math.round(dailyFlights * DAY_NIGHT_TRAFFIC_RATIO);
            const nightFlights = dailyFlights - dayFlights;

            const potentialDestinations = airports.filter(d => d.icao !== origin.icao);
            if (potentialDestinations.length === 0) return;

            for (let i = 0; i < dailyFlights; i++) {
                const destination = potentialDestinations[Math.floor(Math.random() * potentialDestinations.length)];
                
                let departureTime: number;
                if (i < dayFlights) {
                    departureTime = (DAY_START_HOUR * 3600) + Math.random() * ((DAY_END_HOUR - DAY_START_HOUR) * 3600);
                } else {
                    const nightDuration = (24 - (DAY_END_HOUR - DAY_START_HOUR)) * 3600;
                    departureTime = ((DAY_END_HOUR * 3600) + Math.random() * nightDuration) % SECONDS_IN_DAY;
                }

                const totalDistanceKm = haversineDistance(origin.lat, origin.lon, destination.lat, destination.lon);
                
                const aircraft: Aircraft = {
                    id: `${origin.icao}${destination.icao}${flightIdCounter++}`,
                    flightNumber: `FL${flightIdCounter}`,
                    origin,
                    destination,
                    departureTime,
                    phase: FlightPhase.SCHEDULED,
                    position: { lat: origin.lat, lon: origin.lon, alt: origin.elevation },
                    speedKmh: 0,
                    heading: 0,
                    cruiseAltitude: 30000 + Math.floor(Math.random() * 9) * 1000,
                    totalDistanceKm,
                    distanceCoveredKm: 0,
                    timeInGreenSec: 0,
                    timeInOrangeSec: 0,
                    timeInRedSec: 0,
                };
                flights.push(aircraft);
            }
        });

        this.aircraft = flights;
    }
}