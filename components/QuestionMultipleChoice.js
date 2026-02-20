import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function QuestionMultipleChoice({ question, options, selectedValue, onSelect }) {
  const { colors } = useTheme();
  const scaleAnims = React.useMemo(
    () => options.map(() => new Animated.Value(1)),
    [options.length]
  );

  const handleSelect = (value, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate the selected option if available
    if (scaleAnims[index]) {
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[index], {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.8}
              onPress={() => handleSelect(option.value, index)}
            >
              <Animated.View
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? colors.primary + '20' : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    transform: scaleAnims[index] ? [{ scale: scaleAnims[index] }] : [],
                  },
                ]}
              >
                <View style={styles.optionContent}>
                  {option.icon && (
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                      <Ionicons name={option.icon} size={24} color={colors.primary} />
                    </View>
                  )}
                  <View style={styles.textContainer}>
                    <Text style={[styles.optionText, { color: colors.text }]}>{option.label}</Text>
                    {option.subtitle && (
                      <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>{option.subtitle}</Text>
                    )}
                  </View>
                </View>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
