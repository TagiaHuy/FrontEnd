import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { 
  StatsCard, 
  QuickActions, 
  TaskList,
  StatsData,
  QuickAction,
  Task
} from '../../components/features/dashboard';
import { Button, Card, Loading } from '../../components/ui';
import { useApi, useMultipleLoading } from '../../hooks';
import { colors, textStyles, spacing, commonStyles } from '../../styles';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { isLoading: isLoadingGoals, execute: executeGoals } = useApi();
  const { isLoading: isLoadingTasks, execute: executeTasks } = useApi();
  const { isLoading: isLoadingStats, execute: executeStats } = useApi();

  const [goals, setGoals] = React.useState([]);
  const [todayTasks, setTodayTasks] = React.useState<Task[]>([]);
  const [stats, setStats] = React.useState({
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
      // Load goals
      const goalsResult = await executeGoals(async () => {
        const goalsData = await apiService.get('/goals');
        setGoals(goalsData.slice(0, 3)); // Show only 3 recent goals
        return goalsData;
      });

      // Load today's tasks
      const tasksResult = await executeTasks(async () => {
        const tasksData = await apiService.get('/tasks/today');
        setTodayTasks(tasksData);
        return tasksData;
      });

      // Load statistics
      const statsResult = await executeStats(async () => {
        const statsData = await apiService.get('/goals/stats');
        setStats(statsData);
        return statsData;
      });

      if (!goalsResult.success || !tasksResult.success || !statsResult.success) {
        // Use mock data for development
        setMockData();
      }

      console.log('Dashboard data loaded:', { goals, tasks: todayTasks, stats });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setMockData();
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

  const quickActions: QuickAction[] = [
    { id: 'add-task', title: 'Add Task', icon: '📝', onPress: handleAddTask },
    { id: 'profile', title: 'Profile', icon: '👤', onPress: handleProfile },
    { id: 'settings', title: 'Settings', icon: '⚙️', onPress: handleSettings },
    { id: 'analytics', title: 'Analytics', icon: '📊', onPress: handleAnalytics },
    { id: 'goals', title: 'Goals', icon: '🎯', onPress: handleGoals },
  ];

  const statsData: StatsData[] = [
    {
      completed: stats.completedGoals,
      total: stats.totalGoals,
      label: 'Goals',
    },
    {
      completed: stats.completedTasks,
      total: stats.totalTasks,
      label: 'Tasks',
    },
  ];

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    setTodayTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const isLoading = isLoadingGoals || isLoadingTasks || isLoadingStats;

  if (isLoading) {
    return <Loading text="Loading dashboard..." fullScreen />;
  }

  return (
    <ScrollView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Progress Overview Cards */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.progressCards}>
          {statsData.map((stat, index) => (
            <StatsCard key={index} stats={stat} />
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <QuickActions actions={quickActions} />
      </View>

      {/* Today's Tasks */}
      <View style={styles.tasksSection}>
        <TaskList 
          tasks={todayTasks}
          onTaskToggle={handleTaskToggle}
        />
      </View>

      {/* Recent Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Recent Goals</Text>
        {goals.map((goal) => (
          <Card key={goal.id} variant="elevated" padding="small" style={styles.goalCard}>
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
                      backgroundColor: goal.progress >= 80 ? colors.success.main : 
                                     goal.progress >= 60 ? colors.primary.main : colors.warning.main
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalProgressText}>{goal.progress}%</Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Statistics Chart Placeholder */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <Card variant="elevated" padding="large" style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📊</Text>
          <Text style={styles.chartLabel}>Weekly Progress Chart</Text>
          <Text style={styles.chartNote}>Chart visualization will be implemented</Text>
        </Card>
      </View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <Button
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    paddingTop: 40,
  },
  welcomeText: {
    ...textStyles.h2,
    color: colors.primary.contrast,
    marginBottom: spacing.xs,
  },
  dateText: {
    ...textStyles.body2,
    color: colors.primary.light,
  },
  progressSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },
  tasksSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },
  goalsSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  goalCard: {
    marginBottom: spacing.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalTitle: {
    ...textStyles.body2,
    color: colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  goalDeadline: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    ...textStyles.caption,
    color: colors.text.primary,
    fontWeight: '500',
    minWidth: 30,
  },
  statsSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  chartPlaceholder: {
    alignItems: 'center',
  },
  chartText: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  chartLabel: {
    ...textStyles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  chartNote: {
    ...textStyles.body3,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
});

export default Dashboard; 