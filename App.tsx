import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';
import { WeatherProvider } from './src/context/WeatherContext';
import ThemeWrapper from './src/components/ThemeWrapper';

export default function App() {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <ThemeWrapper>
          <Navigation />
        </ThemeWrapper>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}

