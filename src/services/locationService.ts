import * as Location from 'expo-location';
import axios from 'axios';
import { GEOCODING_BASE_URL, OPENWEATHER_API_KEY } from '../config/config';
import { LocationData } from '../types';

// Default location (Manila, Philippines) as fallback
const DEFAULT_LOCATION: LocationData = {
  lat: 14.5995,
  lon: 120.9842,
  city: 'Manila',
  province: 'Metro Manila',
  address: 'Manila, Metro Manila, Philippines',
};

export const getLocationAsync = async (): Promise<LocationData> => {
  try {
    // Always check current permission status first
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
    
    // Check if location services are enabled on device
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      if (__DEV__) {
        console.warn('Location services are disabled on device. Please enable location services in settings.');
      }
      // Still request permission - user might enable location services
    }

    // Always request permission, even if previously denied
    // This ensures the permission dialog is shown to the user
    let status = currentStatus;
    
    if (currentStatus !== 'granted') {
      // Request permission explicitly - this will show the permission dialog
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      status = permissionResponse.status;
    }
    
    // If permission still not granted after request, use default location
    if (status !== 'granted') {
      if (__DEV__) {
        if (status === 'denied') {
          console.warn('Location permission denied by user. Using default location (Manila).');
        } else {
          console.warn(`Location permission status: ${status}. Using default location (Manila).`);
        }
      }
      return DEFAULT_LOCATION;
    }

    // Get current position with timeout handling (15 seconds)
    // Use High accuracy for exact location
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Use High accuracy for exact location
      }),
      new Promise<Location.LocationObject>((_, reject) =>
        setTimeout(() => reject(new Error('Location request timeout')), 15000)
      ),
    ]);

    const { latitude, longitude } = position.coords;

    // Reverse geocode to get city/province
    const cityData = await reverseGeocode(latitude, longitude);

    return {
      lat: latitude,
      lon: longitude,
      city: cityData.city || 'Unknown',
      province: cityData.province || 'Unknown',
      address: cityData.address,
    };
  } catch (error) {
    // Silently fall back to default location - only log in dev mode
    if (__DEV__) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('timeout')) {
        console.log('Location request timed out. Using default location (Manila).');
      } else {
        console.warn('Error getting location, using default:', errorMessage);
      }
    }
    return DEFAULT_LOCATION;
  }
};

interface GeocodeResult {
  city: string;
  province: string;
  address: string;
}

export const reverseGeocode = async (lat: number, lon: number): Promise<GeocodeResult> => {
  try {
    const response = await axios.get(`${GEOCODING_BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });

    const data = response.data[0];
    return {
      city: data.name,
      province: data.state || data.county || 'Philippines',
      address: data.display_name || `${data.name}, Philippines`,
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return {
      city: 'Unknown',
      province: 'Philippines',
      address: 'Unknown Location',
    };
  }
};

export const watchPositionAsync = (callback: (location: Location.LocationObject) => void) => {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000, // Update every 30 seconds
      distanceInterval: 100, // Update every 100 meters
    },
    callback
  );
};

