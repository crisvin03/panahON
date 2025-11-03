import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getLocationAsync } from '../services/locationService';
import { fetchWeatherData, fetchForecastData } from '../services/weatherService';
import { scheduleAlertNotifications } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherContextType, WeatherData, ForecastData, LocationData, Alert, Settings } from '../types';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const [signalLevel, setSignalLevel] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    language: 'fil',
    theme: 'dark',
    soundEffects: true,
  });

  useEffect(() => {
    loadSettings();
    loadAlertHistory();
  }, []);

  useEffect(() => {
    if (location) {
      loadWeatherData();
    }
  }, [location]);

  const loadSettings = async (): Promise<void> => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadAlertHistory = async (): Promise<void> => {
    try {
      const history = await AsyncStorage.getItem('alertHistory');
      if (history) {
        setAlertHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading alert history:', error);
    }
  };

  const saveSettings = async (newSettings: Settings): Promise<void> => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadWeatherData = async (): Promise<void> => {
    if (!location) return;

    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(location.lat, location.lon),
        fetchForecastData(location.lat, location.lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);

      // Calculate signal level based on wind speed
      const windSpeedMs = weatherData.wind.speed;
      const signal = calculateSignalLevel(windSpeedMs);
      setSignalLevel(signal);

      // Check if alert should be triggered
      if (settings.notifications) {
        await checkAndTriggerAlert(weatherData, signal);
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSignalLevel = (windSpeedMs: number): number => {
    if (windSpeedMs >= 220) return 5;
    if (windSpeedMs >= 185) return 4;
    if (windSpeedMs >= 100) return 3;
    if (windSpeedMs >= 60) return 2;
    if (windSpeedMs >= 30) return 1;
    return 0;
  };

  const checkAndTriggerAlert = async (weatherData: WeatherData, signal: number): Promise<void> => {
    const { SIGNAL_1, SIGNAL_2, SIGNAL_3, SIGNAL_4, SIGNAL_5 } = require('../config/config').SIGNAL_LEVELS;
    
    if (signal > 0) {
      const alertMessage = getAlertMessage(signal, weatherData.location);
      await addAlertToHistory(alertMessage, signal, weatherData);
      await scheduleAlertNotifications(alertMessage, signal, settings.soundEffects);
    }
  };

  const getAlertMessage = (signal: number, location: string): string => {
    const messages: Record<string, Record<number, string>> = {
      fil: {
        1: `⚠️ Signal #${signal} sa ${location}. Dahan-dahan lang, ingat!`,
        2: `⚠️ Signal #${signal} sa ${location}. Dahan-dahan lang, ingat!`,
        3: `🚨 Signal #${signal} sa ${location}! Manatili sa loob ng bahay!`,
        4: `🚨 Signal #${signal} sa ${location}! Manatili sa loob ng bahay!`,
        5: `🚨🚨 Signal #${signal} sa ${location}! EVACUATE IF NECESSARY!`,
      },
      en: {
        1: `⚠️ Signal #${signal} in ${location}. Take care!`,
        2: `⚠️ Signal #${signal} in ${location}. Take care!`,
        3: `🚨 Signal #${signal} in ${location}! Stay indoors!`,
        4: `🚨 Signal #${signal} in ${location}! Stay indoors!`,
        5: `🚨🚨 Signal #${signal} in ${location}! EVACUATE IF NECESSARY!`,
      },
    };

    const lang = settings.language;
    return messages[lang]?.[signal] || messages.en[signal];
  };

  const addAlertToHistory = async (message: string, signal: number, weatherData: WeatherData): Promise<void> => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      message,
      signal,
      timestamp: new Date().toISOString(),
      location: weatherData.location,
      windSpeed: weatherData.wind.speed,
    };

    const updatedHistory = [newAlert, ...alertHistory];
    setAlertHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem('alertHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving alert history:', error);
    }
  };

  const updateLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      const locationData = await getLocationAsync();
      setLocation(locationData);
    } catch (error) {
      // Error is already handled in getLocationAsync with fallback
      // Just log for debugging if needed
      if (__DEV__) {
        console.warn('Location update completed with fallback if needed');
      }
    } finally {
      setLoading(false);
    }
  };

  const value: WeatherContextType = {
    weather,
    forecast,
    location,
    loading,
    alertHistory,
    signalLevel,
    settings,
    updateLocation,
    loadWeatherData,
    saveSettings,
    refreshWeather: loadWeatherData,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

