import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { useLoading } from '../../hooks/useLoading';
import { useApi } from '../../hooks/useApi';
import { Card, ProgressBar, Button, Badge, Loading } from '../../components/ui';
import PhaseCard from '../../components/features/goals/PhaseCard';
import QuickActionsMenu from '../../components/features/goals/QuickActionsMenu';
import { colors, spacing, textStyles, priorityColors, statusColors, commonStyles } from '../../styles';

const GoalDetail = ({ navigation, route }) => {
  const { user } = useAuth();
  const { goalId } = route.params;

  // Loading state
  const { isLoading, withLoading } = useLoading(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [goal, setGoal] = useState(null);
  const [phases, setPhases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [phaseTasksMap, setPhaseTasksMap] = useState({});
  const [loadingPhaseId, setLoadingPhaseId] = useState(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);

  useEffect(() => {
    withLoading(loadGoalDetail);
  }, [goalId]);

  const loadGoalDetail = async () => {
    try {
      // Load goal information
      const goalResponse = await apiService.get(`/goals/${goalId}`);
      const goalData = goalResponse.goal || goalResponse;
      setGoal(goalData);
      // Load roadmap (phases + tasks)
      const roadmapResponse = await apiService.get(`/goals/${goalId}/roadmap`);
      console.log(roadmapResponse);
      // roadmapResponse.roadmap: [{ phase, tasks, milestone }]
      const phasesFromRoadmap = roadmapResponse.roadmap.map(item => ({ ...item.phase, milestone: item.milestone, tasks: item.tasks }));
      setPhases(phasesFromRoadmap);
      // Flatten all tasks from all phases for Tasks Overview
      const allTasks = roadmapResponse.roadmap.flatMap(item => item.tasks.map(task => ({ ...task, phase: item.phase.title })));
      setTasks(allTasks);
      // Progress: tính tổng progress trung bình các phase hoặc lấy từ goal nếu có
      setProgress(goalData.progress ?? 0);
    } catch (error) {
      console.error('Error loading goal detail:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    withLoading(loadGoalDetail);
  };

  const handleEdit = () => navigation.navigate('EditGoal', { goalId });
  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ]
    );
  };
  const performDelete = async () => {
    try {
      await apiService.delete(`/goals/${goalId}`);
      Alert.alert('Success', 'Goal deleted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete goal. Please try again.');
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'mark_complete':
        updateGoalStatus('completed');
        break;
      case 'mark_in_progress':
        updateGoalStatus('in_progress');
        break;
      case 'add_task':
        navigation.navigate('AddTask', { goalId });
        break;
      case 'add_phase':
        navigation.navigate('AddPhase', { goalId });
        break;
      case 'share':
        Alert.alert('Share', 'Sharing functionality will be implemented.');
        break;
      default:
        break;
    }
    setShowQuickActions(false);
  };
  const updateGoalStatus = async (newStatus) => {
    try {
      await apiService.put(`/goals/${goalId}`, { status: newStatus });
      setGoal(prev => ({ ...prev, status: newStatus }));
      Alert.alert('Success', `Goal marked as ${newStatus.replace('_', ' ')}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal status. Please try again.');
    }
  };

  // Phase expand/collapse
  const handleExpandPhase = async (phase) => {
    if (selectedPhaseId === phase.id) {
      setSelectedPhaseId(null);
      return;
    }
    setSelectedPhaseId(phase.id);
    // Không cần gọi API nữa, tasks đã có sẵn trong phase.tasks
    setPhaseTasksMap(prev => ({ ...prev, [phase.id]: phase.tasks || [] }));
  };
  // Toggle task complete
  const handleToggleTaskComplete = async (task, phaseId) => {
    const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    setUpdatingTaskIds((prev) => [...prev, task.id]);
    try {
      await apiService.put(`/tasks/${task.id}/status`, { status: newStatus });
      setPhaseTasksMap(prev => ({
        ...prev,
        [phaseId]: prev[phaseId].map(t => t.id === task.id ? { ...t, status: newStatus } : t)
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status.');
    } finally {
      setUpdatingTaskIds((prev) => prev.filter(id => id !== task.id));
    }
  };

  // Helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const formatPriority = (priority) => priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : '';
  const formatStatus = (status) => status ? status.replace(/_/g, ' ').replace(/^[a-z]/, c => c.toUpperCase()) : '';
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading goal details..." />;
  }
  if (!goal) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={textStyles.h4}>Goal not found</Text>
        <Button title="Retry" onPress={loadGoalDetail} />
      </View>
    );
  }
  const daysRemaining = getDaysRemaining(goal.deadline);

  // Quick actions
  const quickActions = [
    { id: 'mark_complete', icon: '✅', label: 'Mark Complete', onPress: () => handleQuickAction('mark_complete') },
    { id: 'mark_in_progress', icon: '🔄', label: 'Mark In Progress', onPress: () => handleQuickAction('mark_in_progress') },
    { id: 'add_task', icon: '📝', label: 'Add Task', onPress: () => handleQuickAction('add_task') },
    { id: 'add_phase', icon: '📋', label: 'Add Phase', onPress: () => handleQuickAction('add_phase') },
    { id: 'share', icon: '📤', label: 'Share', onPress: () => handleQuickAction('share') },
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        {/* Header + Quick Actions */}
        <Card style={{ margin: spacing.md, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button title="← Back" variant="ghost" onPress={() => navigation.goBack()} />
            <Button title="⋯" variant="ghost" onPress={() => setShowQuickActions(!showQuickActions)} />
          </View>
          {showQuickActions && (
            <QuickActionsMenu actions={quickActions} />
          )}
        </Card>
        {/* Goal Info */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <Text style={textStyles.h3}>{goal.name}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm }}>
            <Badge label={formatPriority(goal.priority)} style={{ backgroundColor: priorityColors[goal.priority?.toLowerCase?.() || 'low'] }} />
            <Badge label={formatStatus(goal.status)} style={{ backgroundColor: statusColors[goal.status] }} />
          </View>
          <Text style={[textStyles.body2, { color: colors.text.secondary, marginBottom: spacing.md }]}>{goal.description}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            <Text style={textStyles.body2}>Deadline: {formatDate(goal.deadline)}
              <Text style={{ color: daysRemaining < 0 ? colors.error.main : colors.success.main, fontWeight: 'bold' }}>  {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}</Text>
            </Text>
            <Text style={textStyles.body2}>Created: {formatDate(goal.created_at || goal.createdAt)}</Text>
            {goal.category && <Text style={textStyles.body2}>Category: {goal.category}</Text>}
          </View>
          {goal.tags && goal.tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
              {goal.tags.map((tag, idx) => (
                <Badge key={idx} label={`#${tag}`} variant="info" size="small" style={{ marginRight: spacing.xs }} />
              ))}
            </View>
          )}
        </Card>
        {/* Progress Bar */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={textStyles.h4}>Overall Progress</Text>
            <Text style={textStyles.h4}>{progress}%</Text>
          </View>
          <ProgressBar progress={progress} variant={goal.status === 'completed' ? 'success' : 'primary'} size="large" showLabel labelPosition="bottom" />
        </Card>
        {/* Phases List */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={textStyles.h4}>Phases</Text>
            <Button title="+ Add Phase" size="small" onPress={() => navigation.navigate('CreatePhase', { goalId: goal.id, lastOrderNumber: phases.length })} />
          </View>
          {phases.map(phase => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isSelected={selectedPhaseId === phase.id}
              onExpand={handleExpandPhase}
              tasks={phaseTasksMap[phase.id] || phase.tasks || []}
              loadingTasks={false}
              onToggleTask={task => handleToggleTaskComplete(task, phase.id)}
              updatingTaskIds={updatingTaskIds}
            />
          ))}
        </Card>
        {/* Tasks Overview */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={textStyles.h4}>Tasks Overview</Text>
            <Button title="+ Add Task" size="small" onPress={() => navigation.navigate('CreateTask', { goalId: goal.id })} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={textStyles.h3}>{tasks.filter(task => task.status === 'completed').length}</Text>
              <Text style={textStyles.body3}>Completed</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={textStyles.h3}>{tasks.filter(task => task.status === 'in_progress').length}</Text>
              <Text style={textStyles.body3}>In Progress</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={textStyles.h3}>{tasks.filter(task => task.status === 'not_started').length}</Text>
              <Text style={textStyles.body3}>Pending</Text>
            </View>
          </View>
          {tasks.slice(0, 5).map(task => (
            <TouchableOpacity key={task.id} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id, taskData: task })}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, padding: spacing.md }}>
                <Text style={{ fontSize: 16, marginRight: spacing.md }}>{task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : '⏳'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.body2}>{task.title}</Text>
                  <Text style={textStyles.caption}>{task.phase}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Text style={textStyles.caption}>{formatStatus(task.status)}</Text>
                    {task.deadline && <Text style={textStyles.caption}> | Due: {formatDate(task.deadline)}</Text>}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
          {tasks.length > 5 && (
            <Button title={`View all ${tasks.length} tasks`} variant="ghost" onPress={() => {}} />
          )}
        </Card>
        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: spacing.md, margin: spacing.md }}>
          <Button title="Edit Goal" onPress={handleEdit} />
          <Button title="Delete Goal" variant="danger" onPress={handleDelete} />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default GoalDetail; 