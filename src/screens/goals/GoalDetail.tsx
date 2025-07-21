import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

interface GoalDetailProps {
  navigation: any;
  route: {
    params: {
      goalId: number;
    };
  };
}

const { width } = Dimensions.get('window');

const GoalDetail = ({ navigation, route }: GoalDetailProps) => {
  const { user } = useAuth();
  const { goalId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [goal, setGoal] = useState(null);
  const [phases, setPhases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [phaseTasksMap, setPhaseTasksMap] = useState({}); // { [phaseId]: [tasks] }
  const [loadingPhaseId, setLoadingPhaseId] = useState(null);
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]); // Để disable khi đang update

  useEffect(() => {
    loadGoalDetail();
  }, [goalId]);

  const loadGoalDetail = async () => {
    try {
      setIsLoading(true);
      // Load goal information
      const goalResponse = await apiService.get(`/goals/${goalId}`);
      const goalData = goalResponse.goal || goalResponse;
      setGoal(goalData);
      // Load progress with phases
      const progressResponse = await apiService.get(`/goals/${goalId}/progress-with-phases`);
      setPhases(progressResponse.phases || []);
      // Prefer overall_progress from progressResponse, fallback to progress from goalData
      setProgress(
        progressResponse.goal?.overall_progress ?? goalData.progress ?? 0
      );
      // Load tasks from API (replace mock data)
      const tasksResponse = await apiService.get(`/tasks?goal_id=${goalId}`);
      setTasks(tasksResponse.tasks || []);
      // Thêm log để debug
      console.log('Phases:', progressResponse.phases);
      console.log('Tasks:', tasksResponse.tasks);
    } catch (error) {
      console.error('Error loading goal detail:', error);
      // Optionally: setTasks([]); // Do not use mock data
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadGoalDetail();
  };

  const handleEdit = () => {
    navigation.navigate('EditGoal', { goalId });
  };

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
      console.error('Error deleting goal:', error);
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
        shareGoal();
        break;
      default:
        break;
    }
    setShowQuickActions(false);
  };

  const updateGoalStatus = async (newStatus) => {
    try {
      const response = await apiService.put(`/goals/${goalId}`, { status: newStatus });
      setGoal(prev => ({ ...prev, status: newStatus }));
      Alert.alert('Success', `Goal marked as ${newStatus.replace('_', ' ')}!`);
    } catch (error) {
      console.error('Error updating goal status:', error);
      Alert.alert('Error', 'Failed to update goal status. Please try again.');
    }
  };

  const shareGoal = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share', 'Sharing functionality will be implemented.');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#007AFF';
      case 'not_started': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPhaseStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'not_started': return '⏳';
      default: return '⏳';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'not_started': return '⏳';
      default: return '⏳';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPriority = (priority: string) => {
    if (!priority) return '';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatStatus = (status: string) => {
    if (!status) return '';
    return status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Khi nhấn vào 1 phase, gọi API lấy tasks của phase đó nếu chưa có
  const handleExpandPhase = async (phase) => {
    if (selectedPhaseId === phase.id) {
      setSelectedPhaseId(null);
      return;
    }
    setSelectedPhaseId(phase.id);
    if (!phaseTasksMap[phase.id]) {
      setLoadingPhaseId(phase.id);
      try {
        const res = await apiService.get(`/goals/${goalId}/phases/${phase.id}/tasks`);
        setPhaseTasksMap(prev => ({ ...prev, [phase.id]: res.tasks || [] }));
      } catch (e) {
        Alert.alert('Error', 'Failed to load tasks for phase');
      } finally {
        setLoadingPhaseId(null);
      }
    }
  };

  // Hàm cập nhật trạng thái task (toggle complete)
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading goal details...</Text>
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Goal not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadGoalDetail}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining(goal.deadline);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionsButton}
              onPress={() => setShowQuickActions(!showQuickActions)}
            >
              <Text style={styles.quickActionsIcon}>⋯</Text>
            </TouchableOpacity>
          </View>

          {showQuickActions && (
            <View style={styles.quickActionsMenu}>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleQuickAction('mark_complete')}
              >
                <Text style={styles.quickActionIcon}>✅</Text>
                <Text style={styles.quickActionText}>Mark Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleQuickAction('mark_in_progress')}
              >
                <Text style={styles.quickActionIcon}>🔄</Text>
                <Text style={styles.quickActionText}>Mark In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleQuickAction('add_task')}
              >
                <Text style={styles.quickActionIcon}>📝</Text>
                <Text style={styles.quickActionText}>Add Task</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleQuickAction('add_phase')}
              >
                <Text style={styles.quickActionIcon}>📋</Text>
                <Text style={styles.quickActionText}>Add Phase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleQuickAction('share')}
              >
                <Text style={styles.quickActionIcon}>📤</Text>
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Goal Information */}
        <View style={styles.goalInfo}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.name}</Text>
            <View style={styles.goalMeta}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) }]}>
                <Text style={styles.priorityText}>{formatPriority(goal.priority)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goal.status) }]}>
                <Text style={styles.statusText}>{formatStatus(goal.status)}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.goalDescription}>{goal.description}</Text>

          <View style={styles.goalDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>{formatDate(goal.deadline)}</Text>
              <Text style={[styles.daysRemaining, daysRemaining < 0 && styles.overdue]}>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Created:</Text>
              <Text style={styles.detailValue}>{formatDate(goal.created_at || goal.createdAt)}</Text>
            </View>
            {goal.category && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{goal.category}</Text>
              </View>
            )}
          </View>

          {goal.tags && goal.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {goal.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: getStatusColor(goal.status) }
              ]}
            />
          </View>
        </View>

        {/* Phases List */}
        <View style={styles.phasesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phases</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreatePhase', { goalId: goal.id, lastOrderNumber: phases.length })}
            >
              <Text style={styles.addButtonText}>+ Add Phase</Text>
            </TouchableOpacity>
          </View>
          {phases.map((phase) => {
            const isSelected = selectedPhaseId === phase.id;
            const phaseTasks = phaseTasksMap[phase.id] || [];
            return (
              <View key={phase.id} style={styles.phaseCard}>
                <TouchableOpacity onPress={() => handleExpandPhase(phase)}>
                  <View style={styles.phaseHeader}>
                    <View style={styles.phaseInfo}>
                      <Text style={styles.phaseIcon}>{getPhaseStatusIcon(phase.status)}</Text>
                      <Text style={styles.phaseName}>{phase.title}</Text>
                    </View>
                    <Text style={styles.phaseProgress}>{phase.progress}%</Text>
                  </View>
                </TouchableOpacity>
                {/* Không có description trong API progress-with-phases, nếu cần lấy thì phải gọi API khác */}
                <View style={styles.phaseProgressBar}>
                  <View
                    style={[
                      styles.phaseProgressFill,
                      { width: `${phase.progress}%`, backgroundColor: getStatusColor(phase.status) }
                    ]}
                  />
                </View>
                <View style={styles.phaseMeta}>
                  <Text style={styles.phaseTasks}>
                    {phase.completed_tasks}/{phase.total_tasks} tasks completed
                  </Text>
                </View>
                {/* Hiển thị danh sách task nếu phase được chọn */}
                {isSelected && (
                  <View style={{ marginTop: 10 }}>
                    {loadingPhaseId === phase.id ? (
                      <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                      phaseTasks.length === 0 ? (
                        <Text style={styles.value}>No tasks in this phase.</Text>
                      ) : (
                        phaseTasks.map(task => (
                          <View key={task.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <TouchableOpacity
                              style={[styles.checkbox, task.status === 'completed' && styles.checkboxChecked]}
                              onPress={() => handleToggleTaskComplete(task, phase.id)}
                              disabled={updatingTaskIds.includes(task.id)}
                            >
                              {task.status === 'completed' && <Text style={styles.checkboxTick}>✓</Text>}
                            </TouchableOpacity>
                            <Text style={[styles.taskTitle, { flex: 1, marginLeft: 8, color: task.status === 'completed' ? '#999' : '#333', textDecorationLine: task.status === 'completed' ? 'line-through' : 'none' }]}>{task.title}</Text>
                          </View>
                        ))
                      )
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Tasks Overview */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks Overview</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateTask', { goalId: goal.id })}
            >
              <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tasksSummary}>
            <View style={styles.taskStat}>
              <Text style={styles.taskStatNumber}>
                {tasks.filter(task => task.status === 'completed').length}
              </Text>
              <Text style={styles.taskStatLabel}>Completed</Text>
            </View>
            <View style={styles.taskStat}>
              <Text style={styles.taskStatNumber}>
                {tasks.filter(task => task.status === 'in_progress').length}
              </Text>
              <Text style={styles.taskStatLabel}>In Progress</Text>
            </View>
            <View style={styles.taskStat}>
              <Text style={styles.taskStatNumber}>
                {tasks.filter(task => task.status === 'not_started').length}
              </Text>
              <Text style={styles.taskStatLabel}>Pending</Text>
            </View>
          </View>

          {tasks.slice(0, 5).map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            >
              <Text style={styles.taskIcon}>{getTaskStatusIcon(task.status)}</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskPhase}>{task.phase}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Text style={styles.taskStatus}>{formatStatus(task.status)}</Text>
                  {task.deadline && (
                    <Text style={styles.taskDeadline}> | Due: {formatDate(task.deadline)}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {tasks.length > 5 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>
                View all {tasks.length} tasks
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  quickActionsButton: {
    padding: 8,
  },
  quickActionsIcon: {
    fontSize: 20,
    color: '#666',
  },
  quickActionsMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  quickActionIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
  },
  goalInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  goalHeader: {
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  goalMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  goalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  goalDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  daysRemaining: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  overdue: {
    color: '#dc3545',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  phasesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  phaseCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phaseProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  phaseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  phaseProgressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 10,
  },
  phaseProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  phaseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseTasks: {
    fontSize: 12,
    color: '#666',
  },
  phaseDates: {
    fontSize: 12,
    color: '#666',
  },
  tasksSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  tasksSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  taskStat: {
    alignItems: 'center',
  },
  taskStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  taskStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  taskIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  taskPhase: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  taskDeadline: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  viewAllButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    padding: 20,
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 50,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 18,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default GoalDetail; 