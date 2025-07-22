/*
 * StatsCard - Thẻ thống kê tiến độ
 *
 * Chức năng:
 *   - Hiển thị số lượng đã hoàn thành, tổng số, label
 *   - Hiển thị thanh tiến độ (ProgressBar)
 *
 * Props:
 *   - stats: Dữ liệu thống kê (completed, total, label, color)
 *   - style: Style tuỳ chỉnh
 *
 * Sử dụng:
 *   - Tính phần trăm hoàn thành, đổi màu theo tiến độ
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from '../../ui';
import { colors, textStyles, spacing } from '../../../styles';

export interface StatsData {
  completed: number;
  total: number;
  label: string;
  color?: string;
}

export interface StatsCardProps {
  stats: StatsData;
  style?: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, style }) => {
  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const progressColor = stats.color || (progress >= 80 ? colors.success.main : progress >= 60 ? colors.primary.main : colors.warning.main);

  return (
    <Card variant="elevated" padding="medium" style={[styles.card, style]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.number}>{stats.completed}/{stats.total}</Text>
          <Text style={styles.label}>{stats.label}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            variant="primary"
            size="small"
            showLabel={false}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  
  content: {
    alignItems: 'center',
  },
  
  header: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  number: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  label: {
    ...textStyles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  progressContainer: {
    width: '100%',
  },
});

export default StatsCard; 