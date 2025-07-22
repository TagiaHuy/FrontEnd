import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Card from '../../ui/Card';
import { colors, textStyles, spacing } from '../../../styles';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | null;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color = colors.primary.main }) => (
  <Card padding="large" style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minWidth: 120,
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.body3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  value: {
    ...textStyles.h2,
    marginBottom: 2,
  },
  subtitle: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default StatCard; 