/*
 * PhaseCard - Thẻ hiển thị thông tin một phase (giai đoạn) của goal
 *
 * Chức năng:
 *   - Hiển thị tiêu đề, tiến độ, số task hoàn thành, danh sách task
 *   - Mở rộng/thu gọn để xem task, tick hoàn thành task
 *
 * Props:
 *   - phase: Dữ liệu phase
 *   - isSelected: Có đang mở rộng phase không
 *   - onExpand: Hàm mở rộng/thu gọn phase
 *   - tasks: Danh sách task thuộc phase
 *   - loadingTasks: Đang loading task
 *   - onToggleTask: Đánh dấu hoàn thành task
 *   - updatingTaskIds: Danh sách id task đang cập nhật
 *
 * Sử dụng:
 *   - Hiển thị thông tin phase, danh sách task khi mở rộng
 */
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, ProgressBar } from '../../ui';
import { colors, spacing, textStyles, statusColors } from '../../../styles';

export interface Task {
  id: number;
  title: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface Phase {
  id: number;
  title: string;
  status: 'completed' | 'in_progress' | 'not_started';
  progress: number;
  completed_tasks: number;
  total_tasks: number;
}

interface PhaseCardProps {
  phase: Phase;
  isSelected: boolean;
  onExpand: (phase: Phase) => void;
  tasks: Task[];
  loadingTasks: boolean;
  onToggleTask: (task: Task) => void;
  updatingTaskIds: number[];
}

const getPhaseStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return '✅';
    case 'in_progress': return '🔄';
    case 'not_started': return '⏳';
    default: return '⏳';
  }
};

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  isSelected,
  onExpand,
  tasks,
  loadingTasks,
  onToggleTask,
  updatingTaskIds,
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => onExpand(phase)}>
        <View style={styles.header}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>{getPhaseStatusIcon(phase.status)}</Text>
            <Text style={styles.title}>{phase.title}</Text>
          </View>
          <Text style={styles.progress}>{phase.progress}%</Text>
        </View>
      </TouchableOpacity>
      <ProgressBar progress={phase.progress} variant={phase.status === 'completed' ? 'success' : 'primary'} size="small" />
      <View style={styles.metaRow}>
        <Text style={styles.tasksMeta}>{phase.completed_tasks}/{phase.total_tasks} tasks completed</Text>
      </View>
      {isSelected && (
        <View style={{ marginTop: spacing.md }}>
          {loadingTasks ? (
            <ActivityIndicator size="small" color={colors.primary.main} />
          ) : tasks.length === 0 ? (
            <Text style={styles.noTasks}>No tasks in this phase.</Text>
          ) : (
            tasks.map(task => (
              <View key={task.id} style={styles.taskRow}>
                <TouchableOpacity
                  style={[styles.checkbox, task.status === 'completed' && styles.checkboxChecked]}
                  onPress={() => onToggleTask(task)}
                  disabled={updatingTaskIds.includes(task.id)}
                >
                  {task.status === 'completed' && <Text style={styles.checkboxTick}>✓</Text>}
                </TouchableOpacity>
                <Text style={[styles.taskTitle, task.status === 'completed' && styles.completedTask]}>{task.title}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  title: {
    ...textStyles.h5,
    color: colors.text.primary,
  },
  progress: {
    ...textStyles.body2,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  tasksMeta: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  noTasks: {
    ...textStyles.body2,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.primary.main,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkboxTick: {
    color: colors.neutral.white,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 18,
  },
  taskTitle: {
    ...textStyles.body2,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  completedTask: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
});

export default PhaseCard; 