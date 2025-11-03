import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { EMERGENCY_HOTLINES } from '../config/config';

interface SafetyTip {
  signal: number;
  title: string;
  tips: string[];
  icon: string;
  color: string;
}

interface EmergencyContact {
  name: string;
  number: string;
  icon: string;
}

interface EssentialItem {
  name: string;
  icon: string;
}

const SafetyTipsScreen: React.FC = () => {
  const { theme } = useTheme();

  const safetyTips: SafetyTip[] = [
    {
      signal: 1,
      title: 'Signal #1 - Malakas na Hangin',
      tips: [
        'Secure loose objects outside your home',
        'Avoid outdoor activities',
        'Monitor weather updates',
        'Prepare emergency kit',
      ],
      icon: 'warning-outline',
      color: 'signal1',
    },
    {
      signal: 2,
      title: 'Signal #2 - Tanda ng Bagyo',
      tips: [
        'Stay indoors and away from windows',
        'Cancel outdoor activities',
        'Charge devices and power banks',
        'Have emergency supplies ready',
        'Know your evacuation routes',
      ],
      icon: 'warning',
      color: 'signal2',
    },
    {
      signal: 3,
      title: 'Signal #3 - Malakas na Bagyo',
      tips: [
        'DO NOT go outside',
        'Stay away from windows',
        'Turn off main power if flooding',
        'Keep emergency contacts nearby',
        'Stay updated with official advisories',
        'Prepare for possible evacuation',
      ],
      icon: 'alert-circle',
      color: 'signal3',
    },
    {
      signal: 4,
      title: 'Signal #4 - Napakalakas na Bagyo',
      tips: [
        'EVACUATE IMMEDIATELY if needed',
        'Do not wait for last minute',
        'Bring important documents',
        'Follow evacuation routes',
        'Stay in designated shelters',
        'Keep emergency radio nearby',
      ],
      icon: 'alert',
      color: 'signal4',
    },
    {
      signal: 5,
      title: 'Signal #5 - Super Bagyo',
      tips: [
        'EVACUATE TO SAFE PLACES',
        'DO NOT attempt to stay',
        'Bring GO BAG with essentials',
        'Follow authorities\' instructions',
        'Stay away from coastlines',
        'Remain in shelter until cleared',
      ],
      icon: 'flame',
      color: 'signal5',
    },
  ];

  const emergencyContacts: EmergencyContact[] = [
    { name: 'NDRRMC (Emergency)', number: EMERGENCY_HOTLINES.NDRRMC, icon: 'call' },
    { name: 'Philippine Red Cross', number: EMERGENCY_HOTLINES.RED_CROSS, icon: 'medical' },
    { name: 'PAGASA', number: EMERGENCY_HOTLINES.PAGASA, icon: 'cloud' },
    { name: 'PHILVOLCS', number: EMERGENCY_HOTLINES.PHILVOLCS, icon: 'warning' },
  ];

  const essentialItems: EssentialItem[] = [
    { name: 'Flashlight & Batteries', icon: 'flashlight' },
    { name: 'First Aid Kit', icon: 'bandage' },
    { name: 'Bottled Water', icon: 'water' },
    { name: 'Non-perishable Food', icon: 'restaurant' },
    { name: 'Power Bank', icon: 'battery-charging' },
    { name: 'Radio', icon: 'radio' },
    { name: 'Emergency Cash', icon: 'cash' },
    { name: 'Important Documents', icon: 'document' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Safety Tips by Signal Level */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          SAFETY GUIDELINES BY SIGNAL
        </Text>
        {safetyTips.map((item, index) => (
          <View
            key={index}
            style={[
              styles.tipCard,
              { backgroundColor: theme.colors.surface },
              { borderLeftWidth: 4, borderLeftColor: theme.colors[item.color as keyof typeof theme.colors] },
            ]}
          >
            <View style={styles.tipHeader}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors[item.color as keyof typeof theme.colors] }]}>
                <Ionicons name={item.icon as any} size={24} color="white" />
              </View>
              <Text style={[styles.tipTitle, { color: theme.colors.text }]}>{item.title}</Text>
            </View>
            {item.tips.map((tip, tipIndex) => (
              <View key={tipIndex} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors[item.color as keyof typeof theme.colors]} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>{tip}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Essential Items */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          ESSENTIAL ITEMS
        </Text>
        <View style={[styles.itemsGrid, { backgroundColor: theme.colors.surface }]}>
          {essentialItems.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Ionicons name={item.icon as any} size={32} color={theme.colors.primary} />
              <Text style={[styles.itemText, { color: theme.colors.text }]}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          EMERGENCY HOTLINES
        </Text>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.contactLeft}>
              <Ionicons name={contact.icon as any} size={24} color={theme.colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.colors.text }]}>
                  {contact.name}
                </Text>
                <Text style={[styles.contactNumber, { color: theme.colors.primary }]}>
                  {contact.number}
                </Text>
              </View>
            </View>
            <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
          </View>
        ))}
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
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemCard: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SafetyTipsScreen;

