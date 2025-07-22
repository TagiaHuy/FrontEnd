/*
 * QuickActions - Hiển thị các hành động nhanh dạng lưới
 *
 * Chức năng:
 *   - Hiển thị các action (thêm, xoá, v.v.) dạng card
 *   - Mỗi action có icon, tiêu đề, bấm vào gọi hàm tương ứng
 *
 * Props:
 *   - actions: Mảng các action (id, title, icon, onPress)
 *   - style: Style tuỳ chỉnh
 *
 * Sử dụng:
 *   - Render các action dạng card, bấm gọi onPress
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '../../ui';
import { colors, textStyles, spacing } from '../../../styles';

const { width } = Dimensions.get('window');

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  style?: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <Card
            key={action.id}
            variant="elevated"
            padding="medium"
            style={styles.actionCard}
            onTouchEnd={action.onPress}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  
  title: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  actionCard: {
    width: (width - spacing.lg * 3) / 2,
    minHeight: 80,
  },
  
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  
  actionTitle: {
    ...textStyles.body3,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickActions; 