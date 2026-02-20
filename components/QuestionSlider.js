import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function QuestionSlider({ question, min, max, step = 1, suffix = '', labels, selectedValue, onSelect }) {
  const { colors } = useTheme();
  const [localValue, setLocalValue] = useState(selectedValue || min);

  const handleValueChange = (value) => {
    setLocalValue(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSlidingComplete = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
      
      <View style={[styles.valueContainer, { backgroundColor: colors.primary + '20' }]}>
        <Text style={[styles.value, { color: colors.primary }]}>
          {localValue}{suffix}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={localValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
      </View>

      {labels && (
        <View style={styles.labelsContainer}>
          <Text style={[styles.label, { color: colors.textMuted }]}>{labels.min}</Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>{labels.max}</Text>
        </View>
      )}
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
  valueContainer: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    marginBottom: 32,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
  },
});
