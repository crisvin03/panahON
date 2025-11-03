// API Configuration
export const OPENWEATHER_API_KEY = '2c520de3d9bddc246035353882081ca1'; // API key
export const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const GEOCODING_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

// Alert Thresholds
export const ALERT_THRESHOLDS = {
  WIND_SPEED_MS: 10, // m/s
  HEAVY_RAIN_THRESHOLD: 50, // mm
};

// Signal Level Thresholds (m/s)
export const SIGNAL_LEVELS = {
  SIGNAL_1: { min: 30, max: 60 },
  SIGNAL_2: { min: 60, max: 100 },
  SIGNAL_3: { min: 100, max: 185 },
  SIGNAL_4: { min: 185, max: 220 },
  SIGNAL_5: { min: 220, max: 1000 },
};

// Emergency Hotlines
export const EMERGENCY_HOTLINES = {
  NDRRMC: '911',
  RED_CROSS: '143',
  PAGASA: '(02) 8284-0800',
  PHILVOLCS: '(02) 426-1468',
};

export default {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
  GEOCODING_BASE_URL,
  ALERT_THRESHOLDS,
  SIGNAL_LEVELS,
  EMERGENCY_HOTLINES,
};

