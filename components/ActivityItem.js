import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ACTIVITY_CONFIG = {
  module_completed: {
    icon: 'checkmark-circle',
    color: '#10B981', // Green
    label: 'Module complété',
  },
  lesson_read: {
    icon: 'book',
    color: '#8B5CF6', // Purple
    label: 'Leçon lue',
  },
  goal_achieved: {
    icon: 'trophy',
    color: '#F59E0B', // Yellow
    label: 'Objectif atteint',
  },
  quiz_passed: {
    icon: 'star',
    color: '#3B82F6', // Blue
    label: 'Quiz réussi',
  },
};

export default function ActivityItem({ type, title, time, points, onPress }) {
  const { colors } = useTheme();
  const config = ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.lesson_read;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{config.label}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>{time}</Text>
      </View>
      {points && (
        <View style={[styles.pointsContainer, { backgroundColor: colors.success + '20' }]}>
          <Text style={[styles.points, { color: colors.success }]}>+{points}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
  },
  pointsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
