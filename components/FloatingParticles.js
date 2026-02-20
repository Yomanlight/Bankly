import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedParticle = ({ index }) => {
  const startX = (index * 60) % (SCREEN_WIDTH - 40);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT + 50);
      translateX.setValue(0);
      
      // Animation verticale + horizontale aléatoire
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 20000 + (index * 1000),
          delay: index * 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: (Math.random() - 0.5) * 100, // Mouvement horizontal aléatoire -50 à +50
          duration: 20000 + (index * 1000),
          delay: index * 500,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    
    // Animation de scintillement violet
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1500 + (index * 200),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: 1500 + (index * 200),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      {/* Glow violet scintillant */}
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
      
      {/* Point blanc brillant */}
      <View style={styles.dot} />
    </Animated.View>
  );
};

export default function FloatingParticles({ count = 15 }) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <AnimatedParticle key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    elevation: 0,
  },
  particle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  dot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 0.75,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
});
