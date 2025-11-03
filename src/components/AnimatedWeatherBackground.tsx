import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface AnimatedWeatherBackgroundProps {
  condition: string;
}

const AnimatedWeatherBackground: React.FC<AnimatedWeatherBackgroundProps> = ({ condition }) => {
  const { theme } = useTheme();
  const rainOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const cloudMovement = useRef(new Animated.Value(0)).current;
  const gradientOpacity = useRef(new Animated.Value(1)).current;
  const previousCondition = useRef<string>(condition);

  useEffect(() => {
    // Smooth transition when condition changes
    if (previousCondition.current !== condition) {
      Animated.sequence([
        Animated.timing(gradientOpacity, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      previousCondition.current = condition;
    }

    // Cloud movement animation for all conditions
    Animated.loop(
      Animated.timing(cloudMovement, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') {
      // Smooth rain animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rainOpacity, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rainOpacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Thunderstorm flash effect
      if (condition === 'Thunderstorm') {
        const flashInterval = setInterval(() => {
          Animated.sequence([
            Animated.timing(flashOpacity, {
              toValue: 0.6,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(flashOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }, Math.random() * 4000 + 3500);

        return () => clearInterval(flashInterval);
      }
    } else {
      // Smoothly fade out rain effects
      Animated.parallel([
        Animated.timing(rainOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [condition]);

  const getGradientColors = (): [string, string, string] => {
    switch (condition) {
      case 'Thunderstorm':
        return ['#0f0f1e', '#1a1a2e', '#2d2d44'];
      case 'Rain':
      case 'Drizzle':
        return ['#1e2a35', '#2d3436', '#34495e'];
      case 'Clouds':
        return ['#5a6c7d', '#636e72', '#7f8c8d'];
      case 'Clear':
        return ['#4dabf7', '#74b9ff', '#a8e6cf'];
      default:
        return [theme.colors.background, theme.colors.surface, theme.colors.background];
    }
  };

  const cloudTranslateX = cloudMovement.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        {/* Cloud overlay for Clouds condition */}
        {condition === 'Clouds' && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [{ translateX: cloudTranslateX }],
                opacity: 0.15,
              },
            ]}
          >
            <View style={styles.cloud1} />
            <View style={styles.cloud2} />
            <View style={styles.cloud3} />
          </Animated.View>
        )}

        {/* Animated rain overlay */}
        {(condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') && (
          <>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: rainOpacity,
                  backgroundColor: 'rgba(135, 206, 250, 0.08)',
                },
              ]}
            />
            {/* Additional rain layer for depth */}
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: rainOpacity,
                  backgroundColor: 'rgba(176, 224, 230, 0.05)',
                },
              ]}
            />
            {/* Thunder flash */}
            {condition === 'Thunderstorm' && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    opacity: flashOpacity,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                ]}
              />
            )}
          </>
        )}

        {/* Subtle particles for Clear weather */}
        {condition === 'Clear' && (
          <View style={StyleSheet.absoluteFill}>
            <View style={[styles.particle, styles.particle1]} />
            <View style={[styles.particle, styles.particle2]} />
            <View style={[styles.particle, styles.particle3]} />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Cloud shapes
  cloud1: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 100,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    opacity: 0.4,
  },
  cloud2: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 120,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 60,
    opacity: 0.35,
  },
  cloud3: {
    position: 'absolute',
    top: 150,
    left: 100,
    width: 80,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    opacity: 0.3,
  },
  // Particles for clear weather
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '60%',
    right: '20%',
  },
  particle3: {
    top: '80%',
    left: '50%',
  },
});

export default AnimatedWeatherBackground;

