import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius } from '../../../styles';

interface InsightCardProps {
  type: 'positive' | 'suggestion' | 'achievement';
  message: string;
}

const typeStyles = {
  positive: {
    backgroundColor: '#d4edda',
    borderLeftColor: colors.success.main,
  },
  suggestion: {
    backgroundColor: '#fff3cd',
    borderLeftColor: colors.warning.main,
  },
  achievement: {
    backgroundColor: '#cce5ff',
    borderLeftColor: colors.primary.main,
  },
};

const typeIcons = {
  positive: '📈',
  suggestion: '💡',
  achievement: '🏆',
};

const InsightCard: React.FC<InsightCardProps> = ({ type, message }) => (
  <View style={[styles.card, typeStyles[type]]}>
    <Text style={styles.icon}>{typeIcons[type]}</Text>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
    ...textStyles.body2,
    color: colors.text.primary,
    lineHeight: 20,
  },
});

export default InsightCard; 