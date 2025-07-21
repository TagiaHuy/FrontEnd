import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../../ui';
import { colors, textStyles, spacing, priorityColors } from '../../../styles';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface TaskListProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
  onTaskToggle?: (taskId: number, completed: boolean) => void;
  style?: any;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskPress, 
  onTaskToggle, 
  style 
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    return priorityColors[priority];
  };

  const handleTaskPress = (task: Task) => {
    onTaskPress?.(task);
  };

  const handleTaskToggle = (task: Task) => {
    onTaskToggle?.(task.id, !task.completed);
  };

  if (tasks.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Today's Tasks</Text>
        <Text style={styles.emptyText}>No tasks for today</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Today's Tasks</Text>
      {tasks.map((task) => (
        <Card
          key={task.id}
          variant="elevated"
          padding="small"
          style={styles.taskCard}
        >
          <View style={styles.taskContent}>
            <View style={styles.taskInfo}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
              <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
                {task.title}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.taskCheckbox, task.completed && styles.checkedTask]}
              onPress={() => handleTaskToggle(task)}
            >
              {task.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </Card>
      ))}
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
  
  emptyText: {
    ...textStyles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: spacing.lg,
  },
  
  taskCard: {
    marginBottom: spacing.sm,
  },
  
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  
  taskTitle: {
    ...textStyles.body2,
    color: colors.text.primary,
    flex: 1,
  },
  
  completedTask: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  
  taskCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary.main,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  checkedTask: {
    backgroundColor: colors.primary.main,
  },
  
  checkmark: {
    color: colors.primary.contrast,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TaskList; 