// Dashboard.tsx - Màn hình tổng quan chính của ứng dụng

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
  // Lấy thông tin user và hàm logout từ context
  const { user, logout } = useAuth();

  // Các hook useApi để quản lý loading và gọi API cho từng loại dữ liệu
  const { isLoading: isLoadingGoals, execute: executeGoals } = useApi();
  const { isLoading: isLoadingTasks, execute: executeTasks } = useApi();
  const { isLoading: isLoadingStats, execute: executeStats } = useApi();

  // State lưu trữ danh sách goals, tasks hôm nay và thống kê
  const [goals, setGoals] = React.useState([]);
  const [todayTasks, setTodayTasks] = React.useState<Task[]>([]);
  const [stats, setStats] = React.useState({
    totalGoals: 0,
    completedGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  // useEffect để load dữ liệu dashboard khi component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Hàm load dữ liệu dashboard từ API
  const loadDashboardData = async () => {
    try {
      // Lấy danh sách goals
      const goalsResult = await executeGoals(async () => {
        const goalsData = await apiService.get('/goals');
        setGoals(goalsData.slice(0, 3)); // Hiển thị 3 goal gần nhất
        return goalsData;
      });

      // Lấy danh sách task hôm nay
      const tasksResult = await executeTasks(async () => {
        const tasksData = await apiService.get('/tasks/today');
        setTodayTasks(tasksData);
        return tasksData;
      });

      // Lấy thống kê goals/tasks
      const statsResult = await executeStats(async () => {
        const statsData = await apiService.get('/goals/stats');
        setStats(statsData);
        return statsData;
      });

      // Nếu có lỗi khi lấy dữ liệu, dùng mock data cho dev
      if (!goalsResult.success || !tasksResult.success || !statsResult.success) {
        // Dùng dữ liệu mock cho phát triển
        setMockData();
      }

      console.log('Dashboard data loaded:', { goals, tasks: todayTasks, stats });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setMockData();
    }
  };

  // Hàm set dữ liệu mock cho phát triển
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

  // Hàm xử lý logout
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

  // Các hàm điều hướng đến các màn hình khác
  const handleProfile = () => navigation.navigate('Profile');
  const handleSettings = () => navigation.navigate('Settings');
  const handleAnalytics = () => navigation.navigate('Analytics');
  const handleGoals = () => navigation.navigate('GoalsList');
  const handleAddTask = () => Alert.alert('Add Task', 'Add task functionality will be implemented.');

  // Danh sách các quick action trên dashboard
  const quickActions: QuickAction[] = [
    { id: 'add-task', title: 'Add Task', icon: '📝', onPress: handleAddTask },
    { id: 'profile', title: 'Profile', icon: '👤', onPress: handleProfile },
    { id: 'settings', title: 'Settings', icon: '⚙️', onPress: handleSettings },
    { id: 'analytics', title: 'Analytics', icon: '📊', onPress: handleAnalytics },
    { id: 'goals', title: 'Goals', icon: '🎯', onPress: handleGoals },
  ];

  // Dữ liệu thống kê cho các StatsCard
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

  // Hàm xử lý toggle trạng thái hoàn thành của task hôm nay
  const handleTaskToggle = (taskId: number, completed: boolean) => {
    setTodayTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  // Xác định trạng thái loading tổng hợp
  const isLoading = isLoadingGoals || isLoadingTasks || isLoadingStats;

  // Hiển thị loading khi đang lấy dữ liệu
  if (isLoading) {
    return <Loading text="Loading dashboard..." fullScreen />;
  }

  // Render UI chính của dashboard
  return (
    <ScrollView style={commonStyles.container}>
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