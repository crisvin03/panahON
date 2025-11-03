import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { WeatherData } from '../types';

interface AlertCardProps {
  signalLevel: number;
  weather: WeatherData | null;
}

interface SignalMessage {
  icon: string;
  message: string;
}

const signalMessages: Record<number, SignalMessage> = {
  1: { icon: 'warning-outline', message: 'Prepare for strong winds' },
  2: { icon: 'warning', message: 'Tropical storm conditions' },
  3: { icon: 'alert-circle', message: 'Stay indoors! Strong typhoon' },
  4: { icon: 'alert', message: 'Extreme conditions! Stay safe!' },
  5: { icon: 'flame', message: 'EVACUATE IF NECESSARY!' },
};

const AlertCard: React.FC<AlertCardProps> = ({ signalLevel, weather }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  if (signalLevel === 0) return null;

  const alert = signalMessages[signalLevel] || signalMessages[1];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors[`signal${signalLevel}` as keyof typeof theme.colors] },
      ]}
      onPress={() => navigation.navigate('Alerts')}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={alert.icon as any} size={32} color="white" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Signal #{signalLevel}</Text>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.windSpeed}>
          Wind: {weather?.wind?.speedKmh || 0} km/h
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  windSpeed: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
});

export default AlertCard;

