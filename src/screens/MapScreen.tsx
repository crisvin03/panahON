import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Circle, Polyline, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const MapScreen: React.FC = () => {
  const { location, weather, forecast, signalLevel } = useWeather();
  const { theme } = useTheme();

  if (!location) {
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
  }

  // Get hurricane forecast path positions
  const getHurricanePath = () => {
    if (!weather || signalLevel === 0 || !weather.wind.direction) return { positions: [], markers: [] };
    
    const positions = [];
    const markers = [];
    const windDirRad = (weather.wind.direction * Math.PI) / 180;
    const speedKmh = weather.wind.speedKmh;
    const hoursPerForecast = [6, 12, 18, 24]; // Forecast positions in hours
    
    // Current position
    positions.push({
      latitude: location.lat,
      longitude: location.lon,
    });
    markers.push({
      coordinate: { latitude: location.lat, longitude: location.lon },
      isCurrent: true,
    });

    // Calculate forecast positions based on wind direction and speed
    hoursPerForecast.forEach((hours) => {
      const distanceKm = (speedKmh * hours) / 1; // Distance in km (speed already in km/h)
      const latOffset = (Math.cos(windDirRad) * distanceKm) / 111;
      const lonOffset = (Math.sin(windDirRad) * distanceKm) / (111 * Math.cos(location.lat * Math.PI / 180));
      
      const forecastLat = location.lat + latOffset;
      const forecastLon = location.lon + lonOffset;
      
      positions.push({
        latitude: forecastLat,
        longitude: forecastLon,
      });
      
      markers.push({
        coordinate: { latitude: forecastLat, longitude: forecastLon },
        isCurrent: false,
        hours,
      });
    });

    return { positions, markers };
  };

  // Generate hurricane vortex shape with continuous spiral bands
  const generateHurricaneVortex = (centerLat: number, centerLon: number, baseRadiusKm: number) => {
    const vortexShapes = [];
    const windDirRad = weather?.wind.direction ? (weather.wind.direction * Math.PI) / 180 : Math.PI / 4;
    const maxRadius = baseRadiusKm * 1000; // Convert to meters
    const eyeRadius = maxRadius * 0.1; // Eye size (10% of max radius)
    
    // Create multiple continuous spiral bands
    const numBands = 10; // Number of intensity bands
    const pointsPerBand = 120; // More points for very smooth spirals
    const spiralTurns = 3; // Number of full rotations per band
    
    // Generate intensity bands from outer to inner (so outer renders first, inner on top)
    for (let band = numBands - 1; band >= 0; band--) {
      const bandProgress = band / numBands;
      const innerRadiusFactor = bandProgress;
      const outerRadiusFactor = (band + 1) / numBands;
      
      // Outer radius of this band
      const outerRadius = maxRadius * outerRadiusFactor;
      // Inner radius of this band (creates eye for innermost)
      const innerRadius = band === 0 ? eyeRadius : maxRadius * innerRadiusFactor;
      
      // Skip if inner radius is larger than outer
      if (innerRadius >= outerRadius) continue;
      
      const coordinates = [];
      
      // Generate continuous spiral band
      for (let i = 0; i <= pointsPerBand; i++) {
        const t = i / pointsPerBand;
        
        // Angle increases with spiral turns
        const baseAngle = t * Math.PI * 2 * spiralTurns;
        
        // Radius smoothly increases from inner to outer as we go around
        // Add slight variation to create spiral effect
        const radiusProgress = t;
        const currentRadius = innerRadius + (outerRadius - innerRadius) * radiusProgress;
        
        // Combine base angle with wind direction and spiral twist
        const spiralTwist = baseAngle * 0.25; // Controls spiral tightness
        const finalAngle = baseAngle + windDirRad + spiralTwist;
        
        const latOffset = (Math.cos(finalAngle) * currentRadius) / 111000;
        const lonOffset = (Math.sin(finalAngle) * currentRadius) / (111000 * Math.cos(centerLat * Math.PI / 180));
        
        coordinates.push({
          latitude: centerLat + latOffset,
          longitude: centerLon + lonOffset,
        });
      }
      
      // Close the polygon
      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }
      
      // Determine color based on intensity (center = high, outer = low)
      const intensity = 1 - bandProgress;
      let fillColor, strokeColor;
      
        if (intensity > 0.88) {
          // Center - Deep Purple/Magenta (highest intensity)
          fillColor = 'rgba(147, 51, 234, 0.65)';
          strokeColor = 'rgba(147, 51, 234, 0.95)';
        } else if (intensity > 0.75) {
          // Inner - Magenta/Red
          fillColor = 'rgba(219, 39, 119, 0.6)';
          strokeColor = 'rgba(219, 39, 119, 0.9)';
        } else if (intensity > 0.6) {
          // Inner-mid - Red
          fillColor = 'rgba(239, 68, 68, 0.55)';
          strokeColor = 'rgba(239, 68, 68, 0.85)';
        } else if (intensity > 0.45) {
          // Mid - Orange/Red
          fillColor = 'rgba(249, 115, 22, 0.5)';
          strokeColor = 'rgba(249, 115, 22, 0.8)';
        } else if (intensity > 0.3) {
          // Outer-mid - Yellow/Orange
          fillColor = 'rgba(234, 179, 8, 0.45)';
          strokeColor = 'rgba(234, 179, 8, 0.7)';
        } else {
          // Outer - Green (lowest intensity)
          fillColor = 'rgba(34, 197, 94, 0.4)';
          strokeColor = 'rgba(34, 197, 94, 0.6)';
        }
      
      vortexShapes.push({
        coordinates,
        fillColor,
        strokeColor,
        strokeWidth: 1.5,
      });
    }
    
    return vortexShapes;
  };

  // Generate wind direction lines (spiral pattern showing vortex flow)
  const generateWindLines = (centerLat: number, centerLon: number, baseRadiusKm: number) => {
    if (!weather?.wind.direction) return [];
    
    const lines = [];
    const windDirRad = (weather.wind.direction * Math.PI) / 180;
    const maxRadius = baseRadiusKm * 2.2 * 1000; // Extend beyond vortex
    const numLines = 24; // More lines for better coverage
    
    for (let i = 0; i < numLines; i++) {
      const baseAngle = (i / numLines) * Math.PI * 2;
      
      // Create curved spiral wind lines
      const spiralTurns = 1.5; // How many turns the spiral makes
      const startAngle = baseAngle + windDirRad;
      
      // Create multiple points for curved line (simulate with shorter segments)
      const numSegments = 3;
      const lineCoords = [];
      
      for (let seg = 0; seg <= numSegments; seg++) {
        const segmentProgress = seg / numSegments;
        const spiralAngle = startAngle + (segmentProgress * Math.PI * spiralTurns);
        
        // Radius decreases as we spiral inward
        const currentRadius = maxRadius * (0.85 - segmentProgress * 0.6);
        
        const lat = centerLat + (Math.cos(spiralAngle) * currentRadius) / 111000;
        const lon = centerLon + (Math.sin(spiralAngle) * currentRadius) / (111000 * Math.cos(centerLat * Math.PI / 180));
        
        lineCoords.push({ latitude: lat, longitude: lon });
      }
      
      lines.push({
        coordinates: lineCoords,
      });
    }
    
    return lines;
  };

  // Calculate storm vortex zones
  const getStormVortex = () => {
    if (!weather || signalLevel === 0) return { polygons: [], windLines: [] };
    
    const baseRadiusKm = signalLevel * 2; // km, increases with signal level
    const polygons = generateHurricaneVortex(location.lat, location.lon, baseRadiusKm);
    const windLines = generateWindLines(location.lat, location.lon, baseRadiusKm);
    
    return { polygons, windLines };
  };

  // Calculate rain areas with radar-like colors
  const getRainAreas = () => {
    if (!forecast || forecast.length === 0) return [];
    
    const rainAreas = [];
    forecast.forEach((day, index) => {
      if (day.precipitation > 0 && (day.condition === 'Rain' || day.condition === 'Thunderstorm' || day.condition === 'Drizzle')) {
        // Create rain area with radar-like visualization
        const radius = Math.min(day.precipitation * 15, 150) * 1000; // Max 150km radius
        
        // Radar color based on precipitation intensity (like weather radar)
        let color, strokeColor;
        if (day.precipitation > 20) {
          // Heavy rain - Red/Magenta
          color = 'rgba(219, 39, 119, 0.4)';
          strokeColor = 'rgba(219, 39, 119, 0.7)';
        } else if (day.precipitation > 10) {
          // Moderate-heavy - Orange
          color = 'rgba(249, 115, 22, 0.35)';
          strokeColor = 'rgba(249, 115, 22, 0.6)';
        } else if (day.precipitation > 5) {
          // Moderate - Yellow
          color = 'rgba(234, 179, 8, 0.3)';
          strokeColor = 'rgba(234, 179, 8, 0.5)';
        } else if (day.precipitation > 2) {
          // Light-moderate - Green
          color = 'rgba(34, 197, 94, 0.25)';
          strokeColor = 'rgba(34, 197, 94, 0.4)';
        } else {
          // Light - Blue
          color = 'rgba(59, 130, 246, 0.2)';
          strokeColor = 'rgba(59, 130, 246, 0.35)';
        }
        
        // Spread rain area based on forecast direction
        const windDirRad = weather?.wind.direction ? (weather.wind.direction * Math.PI) / 180 : 0;
        const offsetLat = (Math.cos(windDirRad) * index * 0.15);
        const offsetLon = (Math.sin(windDirRad) * index * 0.15) / Math.cos(location.lat * Math.PI / 180);
        
        rainAreas.push({
          center: { 
            latitude: location.lat + offsetLat, 
            longitude: location.lon + offsetLon 
          },
          radius: radius,
          color: color,
          strokeColor: strokeColor,
          strokeWidth: 1.5,
          precipitation: day.precipitation,
        });
      }
    });

    return rainAreas;
  };

  // Get current rain area for real-time display
  const getCurrentRainArea = () => {
    if (!weather || !(weather.condition === 'Rain' || weather.condition === 'Thunderstorm' || weather.condition === 'Drizzle')) {
      return null;
    }

    // Use humidity and condition to estimate precipitation intensity
    const intensity = weather.humidity > 80 ? 8 : weather.humidity > 60 ? 4 : 2;
    const radius = Math.min(intensity * 12, 120) * 1000;
    
    let color, strokeColor;
    if (intensity > 6) {
      color = 'rgba(219, 39, 119, 0.35)';
      strokeColor = 'rgba(219, 39, 119, 0.6)';
    } else if (intensity > 4) {
      color = 'rgba(249, 115, 22, 0.3)';
      strokeColor = 'rgba(249, 115, 22, 0.55)';
    } else {
      color = 'rgba(59, 130, 246, 0.25)';
      strokeColor = 'rgba(59, 130, 246, 0.4)';
    }

    return {
      center: { latitude: location.lat, longitude: location.lon },
      radius: radius,
      color: color,
      strokeColor: strokeColor,
      strokeWidth: 2,
    };
  };

  const stormVortex = getStormVortex();
  const rainAreas = getRainAreas();
  const currentRainArea = getCurrentRainArea();
  const hurricanePath = getHurricanePath();
  const hasActiveStorm = signalLevel > 0;
  const hasRain = weather && (weather.condition === 'Rain' || weather.condition === 'Thunderstorm' || weather.condition === 'Drizzle');

  // Get wind direction abbreviation
  const getWindDirectionAbbr = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lon,
          latitudeDelta: signalLevel > 0 ? 3 : 0.8,
          longitudeDelta: signalLevel > 0 ? 3 : 0.8,
        }}
        region={{
          latitude: location.lat,
          longitude: location.lon,
          latitudeDelta: signalLevel > 0 ? 3 : 0.8,
          longitudeDelta: signalLevel > 0 ? 3 : 0.8,
        }}
        mapType="standard"
      >
        {/* Current Rain Area (Real-time) */}
        {currentRainArea && (
          <Circle
            center={currentRainArea.center}
            radius={currentRainArea.radius}
            fillColor={currentRainArea.color}
            strokeColor={currentRainArea.strokeColor}
            strokeWidth={currentRainArea.strokeWidth}
          />
        )}

        {/* Forecast Rain Areas */}
        {rainAreas.map((area, index) => (
          <Circle
            key={`rain-${index}`}
            center={area.center}
            radius={area.radius}
            fillColor={area.color}
            strokeColor={area.strokeColor}
            strokeWidth={area.strokeWidth}
          />
        ))}

        {/* Hurricane Path Line */}
        {hasActiveStorm && hurricanePath.positions.length > 1 && (
          <Polyline
            coordinates={hurricanePath.positions}
            strokeColor="#DC2626"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
            lineCap="round"
          />
        )}

        {/* Wind Direction Lines (Spiral Pattern) */}
        {hasActiveStorm && stormVortex.windLines.map((line, index) => (
          <Polyline
            key={`wind-${index}`}
            coordinates={line.coordinates}
            strokeColor="rgba(255, 255, 255, 0.65)"
            strokeWidth={1.5}
            lineDashPattern={[4, 3]}
            lineCap="round"
          />
        ))}

        {/* Hurricane Vortex (Spiral Bands) */}
        {hasActiveStorm && stormVortex.polygons.map((polygon, index) => (
          <Polygon
            key={`vortex-${index}`}
            coordinates={polygon.coordinates}
            fillColor={polygon.fillColor}
            strokeColor={polygon.strokeColor}
            strokeWidth={polygon.strokeWidth}
          />
        ))}

        {/* Hurricane Forecast Markers */}
        {hasActiveStorm && hurricanePath.markers.map((marker, index) => (
          <Marker
            key={`hurricane-${index}`}
            coordinate={marker.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            title={marker.isCurrent ? 'Current Position' : `+${marker.hours}h Forecast`}
          >
            <View style={[styles.hurricaneMarker, { backgroundColor: theme.colors[`signal${signalLevel}` as keyof typeof theme.colors] }]}>
              <View style={styles.hurricaneIcon}>
                <Ionicons name="warning" size={18} color="white" />
              </View>
            </View>
          </Marker>
        ))}

        {/* Location Marker (if no storm) */}
        {!hasActiveStorm && (
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lon,
            }}
            title={weather?.location || 'Your Location'}
            description={`Temperature: ${weather?.temperature}°C${hasRain ? ' - Rain' : ''}`}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.locationMarker, { backgroundColor: hasRain ? '#3b82f6' : '#2563eb' }]}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={14} color="white" />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Information Panel */}
      {hasActiveStorm && weather && (
        <View style={[styles.infoPanel, { backgroundColor: theme.colors[`signal${signalLevel}` as keyof typeof theme.colors] }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="warning" size={28} color="white" />
            <View style={styles.infoTitleContainer}>
              <Text style={styles.infoTitle}>Signal #{signalLevel}</Text>
              <Text style={styles.infoSubtitle}>
                {signalLevel === 1 ? 'Strong Wind' :
                 signalLevel === 2 ? 'Tropical Storm' :
                 signalLevel === 3 ? 'Strong Storm' :
                 signalLevel === 4 ? 'Very Strong Storm' : 'Super Typhoon'}
              </Text>
            </View>
          </View>
          <View style={styles.infoDetails}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max wind speed:</Text>
              <Text style={styles.infoValue}>{weather.wind.speedKmh} km/h</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Direction:</Text>
              <Text style={styles.infoValue}>{weather.wind.direction ? getWindDirectionAbbr(weather.wind.direction) : '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{weather.location}</Text>
            </View>
            {forecast.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Forecast:</Text>
                <Text style={styles.infoValue}>
                  {format(new Date(forecast[0].timestamp), 'MMM dd, HH:mm')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  stormMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stormIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stormIconInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
  },
  locationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  hurricaneMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  hurricaneIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    maxHeight: 220,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  infoDetails: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
});

export default MapScreen;

