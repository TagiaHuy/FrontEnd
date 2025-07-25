// Dashboard.tsx - Màn hình tổng quan chính của ứng dụng

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useGoals } from '../../context/GoalContext';
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
  // Lấy thông tin user và hàm logout từ context
  const { user, logout } = useAuth();
  const { goals, reloadGoals, loading: loadingGoals } = useGoals();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Gọi lại hàm reloadGoals để cập nhật danh sách goals
      await reloadGoals(); 
      // Tải lại dữ liệu dashboard
      await loadDashboardData();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      Alert.alert('Error', 'Failed to refresh dashboard data.');
    } finally {
      setRefreshing(false);
    }
  }, [reloadGoals]);
  // Các hook useApi để quản lý loading và gọi API cho từng loại dữ liệu
  const { isLoading: isLoadingGoals, execute: executeGoals } = useApi();
  const { isLoading: isLoadingTasks, execute: executeTasks } = useApi();
  const { isLoading: isLoadingStats, execute: executeStats } = useApi();

  // State lưu trữ danh sách goals, tasks hôm nay và thống kê
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  // Các hàm điều hướng đến các màn hình khác
  const handleProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);
  const handleSettings = useCallback(() => navigation.navigate('Settings'), [navigation]);
  const handleAnalytics = useCallback(() => navigation.navigate('Analytics'), [navigation]);
  const handleGoals = useCallback(() => navigation.navigate('GoalsList'), [navigation]);
  const handleAddTask = useCallback(() => Alert.alert('Add Task', 'Add task functionality will be implemented.'), []);

    // Danh sách các quick action trên dashboard
  const quickActions: QuickAction[] = useMemo(() => [
    { id: 'add-task', title: 'Add Task', icon: '📝', onPress: handleAddTask },
    { id: 'profile', title: 'Profile', icon: '👤', onPress: handleProfile },
    { id: 'settings', title: 'Settings', icon: '⚙️', onPress: handleSettings },
    { id: 'analytics', title: 'Analytics', icon: '📊', onPress: handleAnalytics },
    { id: 'goals', title: 'Goals', icon: '🎯', onPress: handleGoals },
  ], [handleAddTask, handleProfile, handleSettings, handleAnalytics, handleGoals]);

  // Dữ liệu thống kê cho các StatsCard
  const statsData: StatsData[] = useMemo(() => [
    { completed: stats.completedGoals, total: stats.totalGoals, label: 'Goals' },
    { completed: stats.completedTasks, total: stats.totalTasks, label: 'Tasks' },
  ], [stats]);


  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {

      await reloadGoals();
      const tasksResult = await executeTasks(async () => {
        const tasksData = await apiService.get('/tasks/today');
        console.log("today task ", tasksData.tasks);
        setTodayTasks(tasksData.tasks);
        return tasksData; 
      });

      const statsResult = await executeStats(async () => {
        const statsData = await apiService.get('/goals/stats');
        setStats(statsData);
        return statsData;
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again later.');     
    }
  }, [reloadGoals, executeTasks, executeStats]);

  // useEffect để load dữ liệu dashboard khi component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Hàm xử lý toggle trạng thái hoàn thành của task hôm nay
  // Hàm xử lý toggle trạng thái hoàn thành của task hôm nay
  const handleTaskToggle = useCallback(async (taskId: number, completed: boolean) => {
    // Cập nhật UI trước (optimistic update)
    setTodayTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );

    // Gửi request cập nhật status lên server
    const newStatus = completed ? 'completed' : 'in_progress';

    try {
      await apiService.put(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // (Tùy chọn) rollback nếu thất bại
      setTodayTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    }
  }, []);


  // Hàm xử lý logout
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  }, [logout]);

  // Xác định trạng thái loading tổng hợp
  const isLoading = isLoadingGoals || isLoadingTasks || isLoadingStats;

  // Hiển thị loading khi đang lấy dữ liệu
  if (isLoading) {
    return <Loading text="Loading dashboard..." fullScreen />;
  }

  // Render UI chính của dashboard
  return (
    <ScrollView 
    style={commonStyles.container}
    refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      
      {/* Header - Chào mừng user */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Progress Overview Cards - Thống kê tổng quan */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.progressCards}>
          {statsData.map((stat, index) => (
            <StatsCard key={index} stats={stat} />
          ))}
        </View>
      </View>

      {/* Quick Actions - Các hành động nhanh */}
      <View style={styles.quickActionsSection}>
        <QuickActions actions={quickActions} />
      </View>

      {/* Today's Tasks - Danh sách task hôm nay */}
      <View style={styles.tasksSection}>
        <TaskList 
          tasks={todayTasks}
          onTaskToggle={handleTaskToggle}
        />
      </View>

      {/* Recent Goals - Các goal gần đây */}
      {/* <View style={styles.goalsSection}>
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
      </View> */}

      {/* Statistics Chart Placeholder - Biểu đồ thống kê (chưa implement) */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <Card variant="elevated" padding="large" style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📊</Text>
          <Text style={styles.chartLabel}>Weekly Progress Chart</Text>
          <Text style={styles.chartNote}>Chart visualization will be implemented</Text>
        </Card>
      </View>

      {/* Navigation Footer - Nút logout */}
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

// StyleSheet cho Dashboard
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