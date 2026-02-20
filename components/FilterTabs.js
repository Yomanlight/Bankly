import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function FilterTabs({ options, selected, onSelect }) {
  const { colors } = useTheme();

  const handleSelect = (option) => {
    if (option !== selected) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(option);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
              },
            ]}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isSelected ? colors.primary : colors.textMuted,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
  },
});
