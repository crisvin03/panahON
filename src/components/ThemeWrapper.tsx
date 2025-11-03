import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { settings } = useWeather();
  const themeMode = settings.theme || 'dark';

  return (
    <ThemeProvider themeMode={themeMode}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;

