import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Badge, ProgressBar } from '../../ui';
import { colors, textStyles, spacing, statusColors, priorityColors } from '../../../styles';

export interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  deadline: string;
  createdAt: string;
}

export interface GoalCardProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  onLongPress?: (goal: Goal) => void;
  selected?: boolean;
  showSelection?: boolean;
  onQuickAction?: (goalId: number, action: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  onLongPress,
  selected = false,
  showSelection = false,
  onQuickAction,
}) => {
  const handlePress = () => {
    onPress(goal);
  };

  const handleLongPress = () => {
    onLongPress?.(goal);
  };

  const getStatusColor = (status: Goal['status']) => {
    return statusColors[status];
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    const priorityKey = priority.toLowerCase() as keyof typeof priorityColors;
    return priorityColors[priorityKey];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <Card
        variant={selected ? 'outlined' : 'elevated'}
        style={[
          styles.card,
          selected && styles.selectedCard,
        ]}
      >
        {showSelection && (
          <View style={[styles.selectionIndicator, selected && styles.selectedIndicator]}>
            {selected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {goal.title}
          </Text>
          <View style={styles.badges}>
            <Badge
              label={goal.priority}
              variant="primary"
              size="small"
              style={[styles.badge, { backgroundColor: getPriorityColor(goal.priority) }]}
            />
            <Badge
              label={goal.status.replace('_', ' ')}
              variant="primary"
              size="small"
              style={[styles.badge, { backgroundColor: getStatusColor(goal.status) }]}
            />
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={goal.progress}
            variant={goal.progress >= 80 ? 'success' : goal.progress >= 60 ? 'primary' : 'warning'}
            size="small"
            showLabel
            labelPosition="bottom"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.deadline}>
            Due: {formatDate(goal.deadline)}
          </Text>
          {showSelection && onQuickAction && (
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => onQuickAction(goal.id, 'complete')}
            >
              <Text style={styles.quickActionText}>✓</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    position: 'relative',
  },
  
  selectedCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  
  selectionIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    zIndex: 1,
  },
  
  selectedIndicator: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  
  checkmark: {
    color: colors.primary.contrast,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  header: {
    marginBottom: spacing.sm,
  },
  
  title: {
    ...textStyles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  
  badge: {
    textTransform: 'uppercase',
  },
  
  description: {
    ...textStyles.body2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  
  progressContainer: {
    marginBottom: spacing.md,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  deadline: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  
  quickActionButton: {
    backgroundColor: colors.success.main,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  quickActionText: {
    color: colors.success.contrast,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GoalCard; 