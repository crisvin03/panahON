import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import { Alert } from '../types';

const AlertsScreen: React.FC = () => {
  const { alertHistory, signalLevel, weather } = useWeather();
  const { theme } = useTheme();

  const getAlertIcon = (signal: number): string => {
    switch (signal) {
      case 1:
      case 2:
        return 'warning-outline';
      case 3:
        return 'alert-circle-outline';
      case 4:
        return 'alert-outline';
      case 5:
        return 'flame-outline';
      default:
        return 'notifications-outline';
    }
  };

  const renderAlertItem: ListRenderItem<Alert> = ({ item }) => {
    const alertColors: Record<number, string> = {
      1: theme.colors.signal1,
      2: theme.colors.signal2,
      3: theme.colors.signal3,
      4: theme.colors.signal4,
      5: theme.colors.signal5,
    };

    return (
      <View style={[styles.alertCard, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.signalIndicator, { backgroundColor: alertColors[item.signal] }]}>
          <Ionicons name={getAlertIcon(item.signal) as any} size={24} color="white" />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={[styles.signalBadge, { color: alertColors[item.signal] }]}>
              Signal #{item.signal}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
            </Text>
          </View>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            {item.message}
          </Text>
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
            📍 {item.location}
          </Text>
          <Text style={[styles.windSpeed, { color: theme.colors.textSecondary }]}>
            🌪️ Wind: {item.windSpeed} m/s
          </Text>
        </View>
      </View>
    );
  };

  if (alertHistory.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No alerts yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            You'll receive alerts when typhoon conditions are detected
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Current Status Card */}
      {signalLevel > 0 && (
        <View style={[styles.currentStatusCard, { backgroundColor: theme.colors[`signal${signalLevel}` as keyof typeof theme.colors] }]}>
          <Ionicons name="warning" size={32} color="white" />
          <View style={styles.currentStatusContent}>
            <Text style={styles.currentSignalText}>Signal #{signalLevel}</Text>
            <Text style={styles.currentLocationText}>{weather?.location}</Text>
          </View>
        </View>
      )}

      <FlatList
        data={alertHistory}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  currentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  currentStatusContent: {
    marginLeft: 15,
    flex: 1,
  },
  currentSignalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  currentLocationText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signalIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  signalBadge: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    marginBottom: 4,
  },
  windSpeed: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AlertsScreen;

