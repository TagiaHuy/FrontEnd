import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const { width } = Dimensions.get('window');

const Analytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  });
  const [goalStats, setGoalStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0,
  });
  const [timeTracking, setTimeTracking] = useState({
    totalHours: 0,
    averagePerDay: 0,
    mostProductiveDay: '',
    weeklyData: [],
  });
  const [productivityInsights, setProductivityInsights] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Load task statistics
      const taskData = await apiService.get(`/tasks/statistics?range=${dateRange}`);
      setTaskStats(taskData);
      
      // Load goal statistics
      const goalData = await apiService.get(`/goals/stats?range=${dateRange}`);
      setGoalStats(goalData);
      
      console.log('Analytics data loaded:', { taskData, goalData });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Use mock data for development
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };

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

  const exportData = (format: string) => {
    // TODO: Implement export functionality
    Alert.alert('Export', `${format.toUpperCase()} export functionality will be implemented.`);
  };

  const StatCard = ({ title, value, subtitle = null, color = '#007AFF' }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ChartPlaceholder = ({ title, data, type = 'bar' }) => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.chartIcon}>
          {type === 'bar' ? '📊' : type === 'line' ? '📈' : '📉'}
        </Text>
        <Text style={styles.chartLabel}>Interactive Chart</Text>
        <Text style={styles.chartNote}>Chart library will be integrated</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Date Range Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Time Period</Text>
        <View style={styles.filterButtons}>
          {['week', 'month', 'year'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.filterButton,
                dateRange === range && styles.activeFilterButton
              ]}
              onPress={() => setDateRange(range)}
            >
              <Text style={[
                styles.filterButtonText,
                dateRange === range && styles.activeFilterButtonText
              ]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Tasks" 
            value={taskStats.total} 
            color="#007AFF"
          />
          <StatCard 
            title="Completed" 
            value={taskStats.completed} 
            color="#28a745"
          />
          <StatCard 
            title="Pending" 
            value={taskStats.pending} 
            color="#ffc107"
          />
          <StatCard 
            title="Overdue" 
            value={taskStats.overdue} 
            color="#dc3545"
          />
        </View>
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
      </View>

      {/* Goal Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal Progress</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Goals" 
            value={goalStats.total} 
            color="#007AFF"
          />
          <StatCard 
            title="Completed" 
            value={goalStats.completed} 
            color="#28a745"
          />
          <StatCard 
            title="In Progress" 
            value={goalStats.inProgress} 
            color="#17a2b8"
          />
          <StatCard 
            title="Completion Rate" 
            value={`${goalStats.completionRate}%`} 
            color="#6f42c1"
          />
        </View>
      </View>

      {/* Time Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Tracking</Text>
        <View style={styles.timeStats}>
          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Total Hours</Text>
            <Text style={styles.timeValue}>{timeTracking.totalHours}h</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Daily Average</Text>
            <Text style={styles.timeValue}>{timeTracking.averagePerDay}h</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Most Productive</Text>
            <Text style={styles.timeValue}>{timeTracking.mostProductiveDay}</Text>
          </View>
        </View>
        <ChartPlaceholder 
          title="Weekly Time Distribution" 
          data={timeTracking.weeklyData} 
          type="line"
        />
      </View>

      {/* Performance Charts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Trends</Text>
        <ChartPlaceholder 
          title="Task Completion Trend" 
          data={[]} 
          type="line"
        />
        <ChartPlaceholder 
          title="Goal Achievement Rate" 
          data={[]} 
          type="bar"
        />
      </View>

      {/* Productivity Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productivity Insights</Text>
        {productivityInsights.map((insight, index) => (
          <View key={index} style={[
            styles.insightCard,
            insight.type === 'positive' && styles.positiveInsight,
            insight.type === 'suggestion' && styles.suggestionInsight,
            insight.type === 'achievement' && styles.achievementInsight,
          ]}>
            <Text style={styles.insightIcon}>
              {insight.type === 'positive' ? '📈' : 
               insight.type === 'suggestion' ? '💡' : '🏆'}
            </Text>
            <Text style={styles.insightText}>{insight.message}</Text>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  completionCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  completionRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  completionBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  timeStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  timeCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  chartNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  positiveInsight: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  suggestionInsight: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  achievementInsight: {
    backgroundColor: '#cce5ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default Analytics; 