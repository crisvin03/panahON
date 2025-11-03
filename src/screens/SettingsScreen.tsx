import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingItemProps {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

const SettingsScreen: React.FC = () => {
  const { settings, saveSettings } = useWeather();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleToggleNotifications = (value: boolean): void => {
    saveSettings({ ...settings, notifications: value });
  };

  const handleToggleSoundEffects = (value: boolean): void => {
    saveSettings({ ...settings, soundEffects: value });
  };

  const handleChangeTheme = (newTheme: 'light' | 'dark'): void => {
    saveSettings({ ...settings, theme: newTheme });
  };

  const handleChangeLanguage = (newLang: 'fil' | 'en'): void => {
    saveSettings({ ...settings, language: newLang });
  };

  const handleResetData = (): void => {
    Alert.alert(
      'Reset App Data',
      'This will clear all your alert history and settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['alertHistory', 'settings']);
              Alert.alert('Success', 'App data has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  const SettingItem: React.FC<SettingItemProps> = ({ icon, title, value, onPress, rightComponent }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {rightComponent || (value && (
        <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
          {value}
        </Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          NOTIFICATIONS
        </Text>
        <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={theme.colors.primary} />
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              Enable Alerts
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
          />
        </View>
        <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="volume-high" size={24} color={theme.colors.primary} />
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              Sound Effects
            </Text>
          </View>
          <Switch
            value={settings.soundEffects}
            onValueChange={handleToggleSoundEffects}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.soundEffects ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          APPEARANCE
        </Text>
        <SettingItem
          icon="color-palette"
          title="Theme"
          value={settings.theme === 'dark' ? 'Dark' : 'Light'}
          onPress={() => {
            const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
            handleChangeTheme(newTheme);
          }}
        />
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          LANGUAGE
        </Text>
        <SettingItem
          icon="language"
          title="Language"
          value={settings.language === 'fil' ? 'Filipino' : 'English'}
          onPress={() => {
            const newLang = settings.language === 'fil' ? 'en' : 'fil';
            handleChangeLanguage(newLang);
          }}
        />
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          DATA
        </Text>
        <SettingItem
          icon="trash-outline"
          title="Reset App Data"
          onPress={handleResetData}
          rightComponent={<Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />}
        />
      </View>

      {/* Safety Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          SAFETY
        </Text>
        <SettingItem
          icon="shield-checkmark-outline"
          title="Safety Tips & Preparedness"
          onPress={() => navigation.navigate('SafetyTips')}
          rightComponent={<Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          ABOUT
        </Text>
        <View style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            PanahON - Bagyo Watch PH
          </Text>
          <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Stay informed about typhoon conditions and weather alerts in the Philippines.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  aboutCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;

