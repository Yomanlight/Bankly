import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Logo({ size = 'medium', style }) {
  const sizes = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 180, height: 180 },
  };

  const logoSize = sizes[size] || sizes.medium;

  return (
    <Image
      source={require('../assets/bankly.png')}
      style={[styles.logo, logoSize, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // Styles de base
  },
});
