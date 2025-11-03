import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import CharacterAssistant from '../components/CharacterAssistant';
import AlertCard from '../components/AlertCard';

const HomeScreen: React.FC = () => {
  const { weather, forecast, loading, signalLevel, updateLocation, refreshWeather, location } = useWeather();
  const { theme } = useTheme();

  useEffect(() => {
    // Load location and weather on mount
    updateLocation();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateLocation();
      refreshWeather();
    }, 300000); // 5 minutes = 300000ms

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading weather data...
        </Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="cloud-offline" size={64} color={theme.colors.textSecondary} />
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          Unable to load weather data
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            updateLocation();
            refreshWeather();
          }}
        >
          <Text style={styles.refreshButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const signalColor = signalLevel > 0 ? theme.colors[`signal${signalLevel}` as keyof typeof theme.colors] : theme.colors.text;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.locationCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.locationIconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.locationContainer}>
              <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>
                Current Location
              </Text>
              {location ? (
                <>
                  <Text style={[styles.locationValue, { color: theme.colors.text }]}>
                    {location.city}, {location.province}
                  </Text>
                  {location.address && location.address !== `${location.city}, ${location.province}` && (
                    <Text style={[styles.locationAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                      {location.address}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={[styles.locationValue, { color: theme.colors.textSecondary }]}>
                  Getting location...
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Main Temperature Display */}
        <View style={styles.temperatureSection}>
          <View style={styles.temperatureWrapper}>
            <Text style={[styles.temperature, { color: theme.colors.text }]}>
              {weather.temperature}
            </Text>
            <Text style={[styles.temperatureUnit, { color: theme.colors.textSecondary }]}>
              °C
            </Text>
          </View>
          <View style={styles.conditionWrapper}>
            <Text style={[styles.condition, { color: theme.colors.text }]}>
              {weather.description}
            </Text>
          </View>
        </View>

        {/* Signal Level Indicator */}
        {signalLevel > 0 && (
          <View style={[styles.signalBadge, { backgroundColor: signalColor as string }]}>
            <Ionicons name="warning" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.signalText}>Signal #{signalLevel} Active</Text>
          </View>
        )}

        {/* Alert Card */}
        <AlertCard signalLevel={signalLevel} weather={weather} />

        {/* Character Assistant */}
        <CharacterAssistant signalLevel={signalLevel} />

        {/* Weather Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.headerIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="stats-chart-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
              Current Conditions
            </Text>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={[styles.detailItem, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="water-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Humidity
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {weather.humidity}%
              </Text>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="speedometer-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Wind Speed
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {weather.wind.speedKmh} km/h
              </Text>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="thermometer-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Feels Like
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {weather.feelsLike}°C
              </Text>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="eye-outline" size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Visibility
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {weather.visibility} km
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast Card */}
        {forecast.length > 0 && (
          <View style={[styles.forecastCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.headerIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
                Forecast
              </Text>
            </View>
            <View style={styles.forecastPreview}>
              {forecast.slice(0, 3).map((day, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.forecastItem,
                    { backgroundColor: theme.colors.background }
                  ]}
                >
                  <Text style={[styles.forecastDay, { color: theme.colors.textSecondary }]}>
                    {new Date(day.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={styles.forecastIcon}>
                    {day.condition === 'Rain' ? '🌧️' : 
                     day.condition === 'Thunderstorm' ? '⛈️' : 
                     day.condition === 'Clouds' ? '☁️' : '☀️'}
                  </Text>
                  <Text style={[styles.forecastTemp, { color: theme.colors.text }]}>
                    {day.temperature}°
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  // Header Section
  headerSection: {
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    opacity: 0.7,
  },
  locationValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  locationAddress: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
    opacity: 0.75,
  },
  // Temperature Section
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 8,
  },
  temperatureWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -2,
    lineHeight: 72,
  },
  temperatureUnit: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 4,
    opacity: 0.8,
  },
  conditionWrapper: {
    marginTop: 8,
  },
  condition: {
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
    opacity: 0.85,
  },
  // Signal Badge
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  signalText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Details Card
  detailsCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  // Forecast Card
  forecastCard: {
    borderRadius: 28,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  forecastPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  forecastItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  forecastTemp: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  forecastIcon: {
    fontSize: 36,
    marginVertical: 6,
  },
  // Loading & Error States
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;

