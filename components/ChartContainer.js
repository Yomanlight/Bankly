import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_PERIODS = [
  { label: '1J', value: '1D' },
  { label: '1S', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '1A', value: '1Y' },
  { label: 'Max', value: 'MAX' },
];

export default function ChartContainer({
  title,
  periods = DEFAULT_PERIODS,
  selectedPeriod,
  onPeriodChange,
  children,
}) {
  const { colors } = useTheme();

  const handlePeriodChange = (period) => {
    if (period.value !== selectedPeriod) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPeriodChange(period.value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.periodSelector}>
        {periods.map((period) => {
          const isSelected = period.value === selectedPeriod;
          return (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.periodButton,
                {
                  backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
                },
              ]}
              onPress={() => handlePeriodChange(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: isSelected ? colors.primary : colors.textMuted,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.chartContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 13,
  },
  chartContent: {
    paddingHorizontal: 24,
  },
});
