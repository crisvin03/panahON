export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  province: string;
  address: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  pressure: number;
  visibility: number;
  wind: {
    speed: number;
    direction: number;
    speedKmh: number;
  };
  clouds: number;
  location: string;
  icon: string;
  timestamp: string;
}

export interface ForecastData {
  date: string;
  timestamp: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  wind: {
    speed: number;
    direction: number;
    speedKmh: number;
  };
  precipitation: number;
  icon: string;
}

export interface Alert {
  id: string;
  message: string;
  signal: number;
  timestamp: string;
  location: string;
  windSpeed: number;
}

export interface Settings {
  notifications: boolean;
  language: 'fil' | 'en';
  theme: 'light' | 'dark';
  soundEffects: boolean;
}

export interface WeatherContextType {
  weather: WeatherData | null;
  forecast: ForecastData[];
  location: LocationData | null;
  loading: boolean;
  alertHistory: Alert[];
  signalLevel: number;
  settings: Settings;
  updateLocation: () => Promise<void>;
  loadWeatherData: () => Promise<void>;
  saveSettings: (newSettings: Settings) => Promise<void>;
  refreshWeather: () => Promise<void>;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  signal1: string;
  signal2: string;
  signal3: string;
  signal4: string;
  signal5: string;
}

export interface Theme {
  colors: ThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
}

