import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';
import { Theme } from '../types';
import { darkTheme } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ForecastScreen from '../screens/ForecastScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SafetyTipsScreen from '../screens/SafetyTipsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface SettingsStackProps {
  theme: Theme;
}

const SettingsStack: React.FC<SettingsStackProps> = ({ theme }) => {
  const isDarkTheme = theme.colors.background === darkTheme.colors.background;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SafetyTips"
        component={SafetyTipsScreen}
        options={{
          title: 'Safety Tips',
          headerStyle: {
            backgroundColor: theme.colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkTheme ? 0.3 : 0.08,
            shadowRadius: 6,
            elevation: 5,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation: React.FC = () => {
  const { theme } = useTheme();
  const { settings } = useWeather();
  const isDarkTheme = theme.colors.background === darkTheme.colors.background;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Forecast') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Alerts') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: isDarkTheme ? 0.3 : 0.08,
            shadowRadius: 6,
            elevation: 8,
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkTheme ? 0.3 : 0.08,
            shadowRadius: 6,
            elevation: 5,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'PanahON' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Storm Map' }}
        />
        <Tab.Screen 
          name="Forecast" 
          component={ForecastScreen} 
          options={{ title: 'Forecast' }}
        />
        <Tab.Screen 
          name="Alerts" 
          component={AlertsScreen} 
          options={{ title: 'Alerts' }}
        />
        <Tab.Screen 
          name="Settings" 
          options={{ title: 'Settings', headerShown: false }}
        >
          {(props) => <SettingsStack {...props} theme={theme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

