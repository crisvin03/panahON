import axios from 'axios';
import { OPENWEATHER_BASE_URL, OPENWEATHER_API_KEY } from '../config/config';
import { WeatherData, ForecastData } from '../types';

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  visibility: number;
  wind: {
    speed: number;
    deg?: number;
  };
  clouds: {
    all: number;
  };
  name: string;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg?: number;
  };
  rain?: {
    '3h': number;
  };
}

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get<OpenWeatherResponse>(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      wind: {
        speed: data.wind.speed, // m/s
        direction: data.wind.deg || 0,
        speedKmh: Math.round(data.wind.speed * 3.6), // Convert to km/h
      },
      clouds: data.clouds.all,
      location: `${data.name}, Philippines`,
      icon: data.weather[0].icon,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecastData = async (lat: number, lon: number): Promise<ForecastData[]> => {
  try {
    const response = await axios.get<{ list: ForecastItem[] }>(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    const data = response.data.list;
    
    // Group by day and get one forecast per day (morning forecast)
    const forecastByDay: Record<string, ForecastData> = {};
    
    data.forEach((item: ForecastItem) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!forecastByDay[dayKey] || date.getHours() === 12) {
        // Prefer noon forecast or first available
        forecastByDay[dayKey] = {
          date: dayKey,
          timestamp: item.dt * 1000,
          temperature: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          wind: {
            speed: item.wind.speed,
            direction: item.wind.deg || 0,
            speedKmh: Math.round(item.wind.speed * 3.6),
          },
          precipitation: item.rain ? item.rain['3h'] || 0 : 0,
          icon: item.weather[0].icon,
        };
      }
    });

    // Convert to array and return next 5 days
    return Object.values(forecastByDay).slice(0, 5);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

const weatherIcons: Record<string, string> = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Haze': '🌫️',
  'Fog': '🌫️',
};

export const getWeatherIcon = (condition: string): string => {
  return weatherIcons[condition] || '☀️';
};

export const getSignalDescription = () => {
  const descriptions = {
    fil: {
      0: 'Walang Signal',
      1: 'Malakas na Hangin',
      2: 'Tanda ng Bagyo',
      3: 'Malakas na Bagyo',
      4: 'Napakalakas na Bagyo',
      5: 'Super Bagyo',
    },
    en: {
      0: 'No Signal',
      1: 'Strong Wind',
      2: 'Tropical Storm',
      3: 'Strong Storm',
      4: 'Very Strong Storm',
      5: 'Super Typhoon',
    },
  };
  
  return descriptions;
};

