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
import { ForecastData } from '../types';

const ForecastScreen: React.FC = () => {
  const { forecast } = useWeather();
  const { theme } = useTheme();

  const getWeatherIcon = (condition: string): string => {
    switch (condition) {
      case 'Clear':
        return '☀️';
      case 'Clouds':
        return '☁️';
      case 'Rain':
        return '🌧️';
      case 'Drizzle':
        return '🌦️';
      case 'Thunderstorm':
        return '⛈️';
      default:
        return '☀️';
    }
  };

  const renderForecastItem: ListRenderItem<ForecastData> = ({ item, index }) => {
    const date = new Date(item.timestamp);
    const isToday = index === 0;

    return (
      <View style={[styles.forecastCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.forecastHeader}>
          <View>
            <Text style={[styles.dayText, { color: theme.colors.text }]}>
              {isToday ? 'Today' : format(date, 'EEEE')}
            </Text>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              {format(date, 'MMM dd')}
            </Text>
          </View>
          <Text style={styles.weatherIcon}>{getWeatherIcon(item.condition)}</Text>
        </View>

        <View style={styles.temperatureRow}>
          <Text style={[styles.temperatureText, { color: theme.colors.text }]}>
            {item.temperature}°
          </Text>
          <View style={styles.conditionContainer}>
            <Text style={[styles.conditionText, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.humidity}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.wind.speedKmh} km/h
            </Text>
          </View>
          {item.precipitation > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="rainy-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {item.precipitation}mm
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={forecast}
        renderItem={renderForecastItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  forecastCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
  },
  weatherIcon: {
    fontSize: 40,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 15,
  },
  conditionContainer: {
    flex: 1,
  },
  conditionText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ForecastScreen;

