import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function QuestionInput({ question, placeholder, value, onChangeText, keyboardType = 'default' }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
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
    marginBottom: 24,
    lineHeight: 32,
  },
  input: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
  },
});
