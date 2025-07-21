import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load goals
      const goalsData = await apiService.get('/goals');
      setGoals(goalsData.slice(0, 3)); // Show only 3 recent goals
      
      // Load today's tasks
      const tasksData = await apiService.get('/tasks/today');
      setTodayTasks(tasksData);
      
      // Load statistics
      const statsData = await apiService.get('/goals/stats');
      setStats(statsData);
      
      console.log('Dashboard data loaded:', { goals: goalsData, tasks: tasksData, stats: statsData });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Use mock data for development
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const setMockData = () => {
    setGoals([
      { id: 1, title: 'Learn React Native', progress: 75, deadline: '2024-01-15' },
      { id: 2, title: 'Complete Project', progress: 45, deadline: '2024-01-20' },
      { id: 3, title: 'Exercise Daily', progress: 90, deadline: '2024-01-10' },
    ]);
    setTodayTasks([
      { id: 1, title: 'Complete login screen', completed: false, priority: 'high' },
      { id: 2, title: 'Review code', completed: true, priority: 'medium' },
      { id: 3, title: 'Update documentation', completed: false, priority: 'low' },
    ]);
    setStats({
      totalGoals: 5,
      completedGoals: 2,
      totalTasks: 12,
      completedTasks: 8,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleProfile = () => navigation.navigate('Profile');
  const handleSettings = () => navigation.navigate('Settings');
  const handleAnalytics = () => navigation.navigate('Analytics');
  const handleGoals = () => navigation.navigate('GoalsList');
  const handleAddTask = () => Alert.alert('Add Task', 'Add task functionality will be implemented.');

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#28a745';
    if (progress >= 60) return '#17a2b8';
    if (progress >= 40) return '#ffc107';
    return '#dc3545';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Progress Overview Cards */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.progressCards}>
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>{stats.completedGoals}/{stats.totalGoals}</Text>
            <Text style={styles.progressLabel}>Goals</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(stats.completedGoals / stats.totalGoals) * 100}%`,
                    backgroundColor: getProgressColor((stats.completedGoals / stats.totalGoals) * 100)
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>{stats.completedTasks}/{stats.totalTasks}</Text>
            <Text style={styles.progressLabel}>Tasks</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(stats.completedTasks / stats.totalTasks) * 100}%`,
                    backgroundColor: getProgressColor((stats.completedTasks / stats.totalTasks) * 100)
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddTask}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>Add Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleProfile}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAnalytics}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleGoals}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Goals</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {todayTasks.length > 0 ? (
          todayTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskContent}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
                  {task.title}
                </Text>
              </View>
              <TouchableOpacity style={[styles.taskCheckbox, task.completed && styles.checkedTask]}>
                {task.completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No tasks for today</Text>
        )}
      </View>

      {/* Recent Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Recent Goals</Text>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDeadline}>{goal.deadline}</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgressFill, 
                    { 
                      width: `${goal.progress}%`,
                      backgroundColor: getProgressColor(goal.progress)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalProgressText}>{goal.progress}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Statistics Chart Placeholder */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📊</Text>
          <Text style={styles.chartLabel}>Weekly Progress Chart</Text>
          <Text style={styles.chartNote}>Chart visualization will be implemented</Text>
        </View>
      </View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#e3f2fd',
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 15,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionButton: {
    width: (width - 70) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  tasksSection: {
    padding: 20,
    paddingTop: 0,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedTask: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  goalsSection: {
    padding: 20,
    paddingTop: 0,
  },
  goalItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#666',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    minWidth: 30,
  },
  statsSection: {
    padding: 20,
    paddingTop: 0,
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartText: {
    fontSize: 48,
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  chartNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Dashboard; 