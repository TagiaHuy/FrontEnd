import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Card } from '../../ui';
import { colors, spacing, textStyles } from '../../../styles';

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface QuickActionsMenuProps {
  actions: QuickAction[];
  style?: any;
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ actions, style }) => {
  return (
    <Card style={[styles.menu, style]}>
      {actions.map(action => (
        <TouchableOpacity
          key={action.id}
          style={styles.item}
          onPress={action.onPress}
        >
          <Text style={styles.icon}>{action.icon}</Text>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  menu: {
    borderRadius: 8,
    marginTop: spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  label: {
    ...textStyles.body2,
    color: colors.text.primary,
  },
});

export default QuickActionsMenu; 