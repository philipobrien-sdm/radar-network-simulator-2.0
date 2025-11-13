export enum SensorType {
  ADS_B = 'ADS_B',
  MODE_S = 'MODE_S',
  PRIMARY = 'PRIMARY',
}

export interface Airport {
  icao: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  passengers: number;
  elevation: number; // in feet
  runways: number[]; // runway headings in degrees, e.g., [90, 270]
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  lat: number;
  lon: number;
  x: number;
  y: number;
  rangeKm: number;
  hasConeOfSilence: boolean;
  coneOfSilenceRadiusKm: number;
  isActive: boolean;
}

export interface SuggestedSensorLocation {
    lat: number;
    lon: number;
}

export enum CoverageStatus {
  EMPTY = 0,
  RED = 1,
  ORANGE = 2,
  GREEN = 3,
}

export type CoverageGrid = CoverageStatus[][];

export enum FlightPhase {
    SCHEDULED,
    CLIMBING,
    CRUISING,
    DESCENDING,
    LANDED,
}

export interface Aircraft {
    id: string;
    flightNumber: string;
    origin: Airport;
    destination: Airport;
    departureTime: number; // in simulation seconds from midnight
    
    // Dynamic State
    phase: FlightPhase;
    position: {
        lat: number;
        lon: number;
        alt: number; // altitude in feet
    };
    speedKmh: number; // ground speed
    heading: number; // degrees
    
    // Flight Plan
    cruiseAltitude: number;
    totalDistanceKm: number;
    distanceCoveredKm: number;

    // Coverage Stats
    timeInGreenSec: number;
    timeInOrangeSec: number;
    timeInRedSec: number;
}

export interface WindVector {
    direction: number; // degrees from which the wind is blowing
    speedKph: number;
}