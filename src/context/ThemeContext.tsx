import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeContextType, Theme, ThemeColors } from '../types';

const lightThemeColors: ThemeColors = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#4B5563',
  border: '#D1D5DB',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  signal1: '#F59E0B',
  signal2: '#F97316',
  signal3: '#EF4444',
  signal4: '#DC2626',
  signal5: '#B91C1C',
};

const darkThemeColors: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#a78bfa',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  signal1: '#fbbf24',
  signal2: '#f59e0b',
  signal3: '#ef4444',
  signal4: '#dc2626',
  signal5: '#991b1b',
};

export const lightTheme: Theme = { colors: lightThemeColors };
export const darkTheme: Theme = { colors: darkThemeColors };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  themeMode: 'light' | 'dark';
}

export const ThemeProvider = ({ children, themeMode }: ThemeProviderProps) => {
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

