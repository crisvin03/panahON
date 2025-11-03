import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CharacterAssistantProps {
  signalLevel: number;
}

interface CharacterData {
  image: ImageSourcePropType | null;
}

// Helper function to safely get character image
const getCharacterImage = (signalLevel: number): ImageSourcePropType | null => {
  try {
    switch (signalLevel) {
      case 0:
        return require('../../assets/Character.png');
      case 1:
        return require('../../assets/Character1.png');
      case 2:
        return require('../../assets/Character2.png');
      case 3:
        return require('../../assets/Character3.png');
      case 4:
        return require('../../assets/Character4.png');
      case 5:
        return require('../../assets/Character5.png');
      default:
        return require('../../assets/Character.png');
    }
  } catch (error) {
    // If image doesn't exist, return null to use placeholder
    return null;
  }
};

const CharacterAssistant: React.FC<CharacterAssistantProps> = ({ signalLevel }) => {
  const { theme } = useTheme();

  const getCharacterData = (): CharacterData => {
    const image = getCharacterImage(signalLevel);
    return {
      image, // Character image for the current signal level
    };
  };

  const character = getCharacterData();

  // Placeholder Character Component (fallback if images don't exist)
  const CharacterPlaceholder = () => {
    const borderColor = theme.colors.text; // Use theme text color for visibility
    // Create rgba color with 20% opacity for fill (theme text color is #1F2937)
    const fillColor = 'rgba(31, 41, 55, 0.2)'; // 20% opacity of text color
    return (
      <View style={styles.characterPlaceholder}>
        {/* Head */}
        <View style={[styles.head, { borderColor, backgroundColor: fillColor }]} />
        {/* Hair tied back */}
        <View style={[styles.hair, { borderColor }]} />
        {/* Body (top with apron) */}
        <View style={[styles.body, { borderColor, backgroundColor: fillColor }]}>
          <View style={[styles.apron, { borderColor }]} />
        </View>
        {/* Right arm - hand on chin */}
        <View style={[styles.rightArm, { borderColor }]}>
          <View style={[styles.hand, { borderColor }]} />
        </View>
        {/* Left arm - crossed */}
        <View style={[styles.leftArm, { borderColor }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Character Image */}
        <View style={styles.characterContainer}>
          {character.image ? (
            <Image
              source={character.image}
              style={styles.characterImage}
              resizeMode="contain"
            />
          ) : (
            <CharacterPlaceholder />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 24,
    paddingHorizontal: 24,
    minHeight: 260,
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  // Placeholder Character Styles
  characterPlaceholder: {
    width: 180,
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    marginTop: 15,
  },
  hair: {
    position: 'absolute',
    top: 8,
    left: 20,
    width: 50,
    height: 25,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  body: {
    width: 70,
    height: 80,
    borderWidth: 3,
    marginTop: 8,
    borderRadius: 10,
    position: 'relative',
  },
  apron: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
    height: 45,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  rightArm: {
    position: 'absolute',
    top: 70,
    right: -15,
    width: 35,
    height: 12,
    borderWidth: 2,
    borderRightWidth: 0,
    borderTopRightRadius: 15,
    transform: [{ rotate: '-25deg' }],
  },
  hand: {
    position: 'absolute',
    top: -5,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  leftArm: {
    position: 'absolute',
    top: 75,
    left: -10,
    width: 30,
    height: 8,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopLeftRadius: 12,
    transform: [{ rotate: '20deg' }],
  },
});

export default CharacterAssistant;

