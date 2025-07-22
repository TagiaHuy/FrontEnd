import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Card from '../../ui/Card';
import { colors, textStyles, spacing } from '../../../styles';

interface ChartPlaceholderProps {
  title: string;
  data?: any;
  type?: 'bar' | 'line' | 'area';
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ title, type = 'bar' }) => (
  <Card padding="large" style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.chartContainer}>
      <Text style={styles.icon}>
        {type === 'bar' ? '📊' : type === 'line' ? '📈' : '📉'}
      </Text>
      <Text style={styles.label}>Interactive Chart</Text>
      <Text style={styles.note}>Chart library will be integrated</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  label: {
    ...textStyles.body1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  note: {
    ...textStyles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default ChartPlaceholder; 