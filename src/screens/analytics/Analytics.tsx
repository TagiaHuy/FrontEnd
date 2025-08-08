// Analytics.tsx - Màn hình tổng hợp phân tích hiệu suất người dùng

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import StatCard from '../../components/features/analytics/StatCard';
import { LineChart, BarChart, DoughnutChart } from '../../components/features/analytics';
import InsightCard from '../../components/features/analytics/InsightCard';
import { colors, textStyles, spacing, borderRadius } from '../../styles';

const { width: screenWidth } = Dimensions.get('window');

// Component chính cho màn hình Analytics
const Analytics = () => {
  const { user } = useAuth();

  // State quản lý loading
  const [isLoading, setIsLoading] = useState(true);

  // State cho bộ lọc thời gian (week, month, year)
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  // State thống kê task
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  });

  // State thống kê goal
  const [goalStats, setGoalStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0,
  });

  // State thống kê thời gian làm việc
  const [timeTracking, setTimeTracking] = useState({
    totalHours: 0,
    averagePerDay: 0,
    mostProductiveDay: '',
    weeklyData: [],
  });

  // State cho các insight về năng suất
  const [productivityInsights, setProductivityInsights] = useState([]);

  // useEffect để load lại dữ liệu khi thay đổi dateRange
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  // Hàm lấy dữ liệu analytics từ API
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Lấy thống kê task
      const taskData = await apiService.get(`/tasks/statistics?range=${dateRange}`);
      setTaskStats(taskData);
      
      // 2. Lấy thống kê goal
      const goalData = await apiService.get(`/goals/stats?range=${dateRange}`);
      setGoalStats(goalData);
      
      // 3. Lấy thống kê thời gian làm việc
      const timeData = await apiService.get(`/time-tracking/summary?range=${dateRange}`);
      setTimeTracking(timeData);
      
      // 4. Lấy gợi ý năng suất
      const insightsData = await apiService.get(`/analytics/insights?range=${dateRange}`);
      setProductivityInsights(insightsData);
      
      console.log('Analytics data loaded:', { taskData, goalData, timeData, insightsData });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Nếu lỗi thì dùng dữ liệu mock cho dev
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm set dữ liệu mock cho phát triển
  const setMockData = () => {
    setTaskStats({
      total: 45,
      completed: 32,
      pending: 10,
      overdue: 3,
      completionRate: 71,
    });
    
    setGoalStats({
      total: 8,
      completed: 5,
      inProgress: 3,
      completionRate: 62.5,
    });
    
    setTimeTracking({
      totalHours: 156,
      averagePerDay: 5.2,
      mostProductiveDay: 'Wednesday',
      weeklyData: [
        { day: 'Mon', hours: 6.5, tasks: 8 },
        { day: 'Tue', hours: 4.8, tasks: 6 },
        { day: 'Wed', hours: 7.2, tasks: 10 },
        { day: 'Thu', hours: 5.1, tasks: 7 },
        { day: 'Fri', hours: 4.3, tasks: 5 },
        { day: 'Sat', hours: 3.8, tasks: 4 },
        { day: 'Sun', hours: 2.1, tasks: 2 },
      ],
    });
    
    setProductivityInsights([
      { type: 'positive', message: 'You completed 15% more tasks this week compared to last week!' },
      { type: 'suggestion', message: 'Try working on high-priority tasks in the morning for better focus.' },
      { type: 'achievement', message: 'You achieved your daily goal 5 out of 7 days this week.' },
    ]);
  };

  // Hàm xử lý export dữ liệu
  const handleExport = () => {
    Alert.alert(
      'Export Analytics',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF', onPress: () => exportData('pdf') },
        { text: 'CSV', onPress: () => exportData('csv') },
      ]
    );
  };

  // Hàm export dữ liệu (chưa implement)
  const exportData = (format: string) => {
    Alert.alert('Export', `${format.toUpperCase()} export functionality will be implemented.`);
  };

  // Chuẩn bị dữ liệu cho các biểu đồ
  const taskBarData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{ data: [taskStats.completed, taskStats.pending, taskStats.overdue] }],
  };

  const goalDoughnutData = [
    {
      name: 'Completed',
      population: goalStats.completed || 0,
      color: colors.success.main,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
    {
      name: 'In Progress',
      population: goalStats.inProgress || 0,
      color: colors.primary.main,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
    {
      name: 'Not Started',
      population: Math.max(0, (goalStats.total || 0) - (goalStats.completed || 0) - (goalStats.inProgress || 0)),
      color: colors.neutral.gray300,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
  ].filter(item => item.population > 0); // Only show segments with data

  const timeLineData = {
    labels: timeTracking.weeklyData?.map(d => d.day) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: timeTracking.weeklyData?.map(d => d.hours) || [0, 0, 0, 0, 0, 0, 0] }],
  };

  const taskCompletionBarData = {
    labels: timeTracking.weeklyData?.map(d => d.day) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: timeTracking.weeklyData?.map(d => d.tasks) || [0, 0, 0, 0, 0, 0, 0] }],
  };

  // Hiển thị loading khi đang lấy dữ liệu
  if (isLoading) {
    return <Loading />;
  }

  // Render UI chính
  return (
    <ScrollView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Button title="Export" onPress={handleExport} />
      </View>

      {/* 2. BỘ LỌC */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Time Period</Text>
        <View style={styles.filterButtons}>
          {['week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              title={range.charAt(0).toUpperCase() + range.slice(1)}
              onPress={() => setDateRange(range)}
              variant={dateRange === range ? 'primary' : 'outline'}
              style={dateRange === range ? styles.activeFilterButton : styles.filterButton}
              textStyle={dateRange === range ? styles.activeFilterButtonText : styles.filterButtonText}
            />
          ))}
        </View>
      </View>

      {/* 3. TASK STATISTICS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Tasks" 
            value={taskStats.total} 
            color={colors.primary.main}
          />
          <StatCard 
            title="Completed" 
            value={taskStats.completed} 
            color={colors.success.main}
          />
          <StatCard 
            title="Pending" 
            value={taskStats.pending} 
            color={colors.warning.main}
          />
          <StatCard 
            title="Overdue" 
            value={taskStats.overdue} 
            color={colors.error.main}
          />
        </View>
        
        {/* Completion Rate */}
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>Completion Rate</Text>
          <Text style={styles.completionRate}>{taskStats.completionRate}%</Text>
          <View style={styles.completionBar}>
            <View 
              style={[
                styles.completionFill, 
                { width: `${taskStats.completionRate}%` }
              ]} 
            />
          </View>
        </View>

        {/* 📊 Biểu đồ Bar: Task Statistics */}
        <BarChart 
          data={taskBarData}
          title="Task Status Distribution"
          height={200}
          width={screenWidth - 32}
        />
      </View>

      

      {/* 5. TIME TRACKING */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Tracking</Text>
        <View style={styles.timeStats}>
          <StatCard 
            title="Total Hours" 
            value={timeTracking.totalHours} 
            color={colors.primary.main}
          />
          <StatCard 
            title="Daily Average" 
            value={timeTracking.averagePerDay} 
            color={colors.info.main}
          />
          <StatCard 
            title="Most Productive" 
            value={timeTracking.mostProductiveDay} 
            color={colors.success.main}
          />
        </View>

        {/* 📈 Biểu đồ Line: Weekly Hours */}
        <LineChart 
          data={timeLineData}
          title="Weekly Hours Distribution"
          height={200}
          width={screenWidth - 32}
        />

        {/* 📊 Biểu đồ Bar nhỏ: Weekly Tasks */}
        <BarChart 
          data={taskCompletionBarData}
          title="Weekly Task Completion"
          height={150}
          width={screenWidth - 32}
        />
      </View>

      {/* 6. PERFORMANCE CHARTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Trends</Text>
        <LineChart 
          data={timeLineData}
          title="Task Completion Trend"
          height={200}
          width={screenWidth - 32}
        />
        <BarChart 
          data={taskBarData}
          title="Goal Achievement Rate"
          height={200}
          width={screenWidth - 32}
        />
      </View>

      {/* 7. INSIGHTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productivity Insights</Text>
        {productivityInsights.map((insight, index) => (
          <InsightCard 
            key={index} 
            type={insight.type} 
            message={insight.message} 
          />
        ))}
      </View>
    </ScrollView>
  );
};

// StyleSheet cho màn hình Analytics
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  exportButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  exportButtonText: {
    color: colors.primary.contrast,
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: colors.primary.contrast,
  },
  section: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  completionCard: {
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  completionRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },
  completionBar: {
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
  timeStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});

export default Analytics; 