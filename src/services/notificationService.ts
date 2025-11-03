import { Vibration, Alert } from 'react-native';

export const scheduleAlertNotifications = async (message: string, signalLevel: number, playSound: boolean = true): Promise<void> => {
  try {
    // Vibrate device
    if (signalLevel >= 3) {
      Vibration.vibrate([500, 200, 500], true); // Strong vibration for high signals
    } else if (signalLevel >= 2) {
      Vibration.vibrate([400, 200, 400]); // Medium vibration
    } else {
      Vibration.vibrate(300); // Short vibration
    }

    // Show native alert since expo-notifications not fully supported in Expo Go
    Alert.alert(
      '⚠️ Bagyo Alert!',
      message,
      [{ text: 'OK' }]
    );

    // Cancel vibration after a short duration
    if (signalLevel >= 3) {
      setTimeout(() => {
        Vibration.cancel();
      }, 3000);
    }
  } catch (error) {
    console.error('Error showing alert:', error);
  }
};

export const getAllNotifications = async (): Promise<any[]> => {
  // Not supported in Expo Go
  return [];
};

export const cancelAllNotifications = async (): Promise<void> => {
  // Not supported in Expo Go
  return Promise.resolve();
};

