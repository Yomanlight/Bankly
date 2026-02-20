import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIME_PERIODS = [
  { label: '1J', value: '1D' },
  { label: '1S', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '1A', value: '1Y' },
  { label: 'Max', value: 'MAX' },
];

export default function PerformanceChart({ data, style }) {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Données fictives pour la démo (à remplacer par vraies données)
  const chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [65, 68, 70, 72, 75, 77, 80],
        color: (opacity = 1) => colors.primary,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textMuted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Pas de points, juste la ligne (style Finary)
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Lignes pleines
      stroke: colors.border,
      strokeWidth: 1,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {TIME_PERIODS.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              {
                backgroundColor:
                  selectedPeriod === period.value
                    ? colors.primary + '20'
                    : 'transparent',
              },
            ]}
            onPress={() => handlePeriodChange(period.value)}
          >
            <Text
              style={[
                styles.periodText,
                {
                  color:
                    selectedPeriod === period.value
                      ? colors.primary
                      : colors.textMuted,
                  fontWeight: selectedPeriod === period.value ? '600' : '400',
                },
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 48}
        height={220}
        chartConfig={chartConfig}
        bezier // Courbe lisse comme Finary
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={false}
        withShadow={false}
        transparent
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 13,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
