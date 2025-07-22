import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { GoalCard, GoalFilters, Goal, FilterState } from '../../components/features/goals';
import { Button, Loading } from '../../components/ui';
import { useApi, usePagination } from '../../hooks';
import { colors, textStyles, spacing, commonStyles } from '../../styles';

// Màn hình danh sách Goals
const GoalsList = ({ navigation }) => {
  const { user } = useAuth();
  const { execute, isLoading } = useApi();
  const { currentPage, hasNextPage, setTotalItems, nextPage, reset: resetPagination } = usePagination();
  
  // State lưu danh sách goals lấy từ API hoặc mock
  const [goals, setGoals] = useState<Goal[]>([]);
  // State lưu danh sách goals sau khi filter/sort
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  // State lưu các filter hiện tại
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    sortBy: 'deadline',
  });
  // State chế độ hiển thị: grid hoặc list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // State lưu các goal được chọn (cho bulk actions)
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  // State bật/tắt chế độ chọn nhiều
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Effect: load goals khi currentPage thay đổi
  useEffect(() => {
    loadGoals();
  }, [currentPage]);

  // Effect: filter & sort lại goals khi goals hoặc filters thay đổi
  useEffect(() => {
    filterAndSortGoals();
  }, [goals, filters]);

  // Hàm load goals từ API (hoặc mock nếu lỗi)
  const loadGoals = async () => {
    const result = await execute(async () => {
      const response = await apiService.get(`/goals?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      
      if (currentPage === 1) {
        setGoals(response.goals || []);
      } else {
        setGoals(prev => [...prev, ...(response.goals || [])]);
      }
      
      setTotalItems(response.total || 0);
      return response;
    });

    if (!result.success) {
      // Dùng mock data khi dev hoặc lỗi API
      setMockData();
    }
  };

  // Hàm set mock data cho goals (dùng khi dev hoặc lỗi API)
  const setMockData = () => {
    const mockGoals: Goal[] = [
      { id: 1, title: 'Learn React Native', description: 'Master React Native development', status: 'in_progress', priority: 'High', progress: 75, deadline: '2024-01-15', createdAt: '2024-01-01' },
      { id: 2, title: 'Complete Project', description: 'Finish the main project', status: 'not_started', priority: 'Medium', progress: 0, deadline: '2024-01-20', createdAt: '2024-01-02' },
      { id: 3, title: 'Exercise Daily', description: 'Maintain daily exercise routine', status: 'completed', priority: 'Low', progress: 100, deadline: '2024-01-10', createdAt: '2024-01-03' },
      { id: 4, title: 'Read 12 Books', description: 'Read one book per month', status: 'in_progress', priority: 'Medium', progress: 45, deadline: '2024-12-31', createdAt: '2024-01-04' },
      { id: 5, title: 'Learn Spanish', description: 'Achieve B2 level in Spanish', status: 'not_started', priority: 'High', progress: 0, deadline: '2024-06-30', createdAt: '2024-01-05' },
    ];
    setGoals(mockGoals);
    setTotalItems(mockGoals.length);
  };

  // Hàm filter và sort goals dựa trên filters hiện tại
  const filterAndSortGoals = () => {
    let filtered = [...goals];

    // Lọc theo search query
    if (filters.searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Lọc theo status
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === filters.statusFilter);
    }

    // Lọc theo priority
    if (filters.priorityFilter !== 'all') {
      filtered = filtered.filter(goal => goal.priority === filters.priorityFilter);
    }

    // Sắp xếp theo sortBy
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'progress':
          return b.progress - a.progress;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredGoals(filtered);
  };

  // Xử lý khi nhấn nút tạo goal mới
  const handleCreateGoal = () => {
    navigation.navigate('CreateGoal');
  };

  // Xử lý khi nhấn vào 1 goal (nếu đang chọn nhiều thì toggle chọn, không thì vào detail)
  const handleGoalPress = (goal: Goal) => {
    if (isSelectionMode) {
      toggleGoalSelection(goal.id);
    } else {
      navigation.navigate('GoalDetail', { goalId: goal.id });
    }
  };

  // Xử lý khi nhấn giữ 1 goal (bật chế độ chọn nhiều)
  const handleLongPress = (goal: Goal) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedGoals([goal.id]);
    }
  };

  // Toggle chọn/bỏ chọn 1 goal trong chế độ chọn nhiều
  const toggleGoalSelection = (goalId: number) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  // Xử lý khi nhấn bulk action (complete/delete)
  const handleBulkAction = (action: string) => {
    if (selectedGoals.length === 0) {
      Alert.alert('No Goals Selected', 'Please select goals to perform bulk actions.');
      return;
    }

    Alert.alert(
      'Bulk Action',
      `Are you sure you want to ${action} ${selectedGoals.length} goal(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => performBulkAction(action) },
      ]
    );
  };

  // Hàm thực hiện bulk action (chưa gọi API thật)
  const performBulkAction = async (action: string) => {
    try {
      // TODO: Gọi API thực hiện bulk action
      console.log(`Performing ${action} on goals:`, selectedGoals);
      Alert.alert('Success', `Bulk ${action} completed successfully.`);
      
      // Sau khi xong thì reset chọn và reload goals
      resetPagination();
      setSelectedGoals([]);
      setIsSelectionMode(false);
      loadGoals();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      Alert.alert('Error', 'Failed to perform bulk action. Please try again.');
    }
  };

  // Xử lý cập nhật nhanh trạng thái goal (quick action trên GoalCard)
  const handleQuickStatusUpdate = async (goalId: number, newStatus: string) => {
    try {
      // TODO: Gọi API cập nhật trạng thái goal
      console.log(`Updating goal ${goalId} status to ${newStatus}`);
      
      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, status: newStatus as Goal['status'] }
            : goal
        )
      );
    } catch (error) {
      console.error('Error updating goal status:', error);
      Alert.alert('Error', 'Failed to update goal status. Please try again.');
    }
  };

  // Hàm load thêm goals khi scroll tới cuối danh sách
  const loadMoreGoals = () => {
    if (hasNextPage && !isLoading) {
      nextPage();
    }
  };

  // Render 1 item goal (GoalCard)
  const renderGoalItem = ({ item: goal }: { item: Goal }) => {
    const isSelected = selectedGoals.includes(goal.id);
    
    return (
      <GoalCard
        goal={goal}
        onPress={handleGoalPress}
        onLongPress={handleLongPress}
        selected={isSelected}
        showSelection={isSelectionMode}
        onQuickAction={handleQuickStatusUpdate}
      />
    );
  };

  // Render header của màn hình (tiêu đề + nút chuyển view + nút tạo goal)
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Goals</Text>
      <View style={styles.headerActions}>
        <Button
          title={viewMode === 'grid' ? '☰' : '⊞'}
          variant="outline"
          size="small"
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          style={styles.viewModeButton}
        />
        <Button
          title="+ Create"
          onPress={handleCreateGoal}
          size="small"
        />
      </View>
    </View>
  );

  // Render thanh bulk actions khi đang chọn nhiều goals
  const renderBulkActions = () => (
    isSelectionMode && (
      <View style={styles.bulkActions}>
        <Text style={styles.bulkActionsText}>
          {selectedGoals.length} goal(s) selected
        </Text>
        <View style={styles.bulkButtons}>
          <Button
            title="Complete"
            variant="primary"
            size="small"
            onPress={() => handleBulkAction('complete')}
            style={styles.bulkButton}
          />
          <Button
            title="Delete"
            variant="danger"
            size="small"
            onPress={() => handleBulkAction('delete')}
            style={styles.bulkButton}
          />
          <Button
            title="Cancel"
            variant="secondary"
            size="small"
            onPress={() => {
              setSelectedGoals([]);
              setIsSelectionMode(false);
            }}
          />
        </View>
      </View>
    )
  );

  // Nếu đang loading lần đầu (chưa có goals) thì show loading full screen
  if (isLoading && goals.length === 0) {
    return <Loading text="Loading goals..." fullScreen />;
  }

  // Render chính của màn hình GoalsList
  return (
    <View style={commonStyles.container}>
      {renderHeader()}
      
      {/* Bộ lọc goals */}
      <GoalFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {renderBulkActions()}
      
      {/* Danh sách goals dạng FlatList */}
      <FlatList
        data={filteredGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id.toString()}
        key={viewMode}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={styles.goalsList}
        onEndReached={loadMoreGoals}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No goals found</Text>
            <Button
              title="Create your first goal"
              onPress={handleCreateGoal}
              style={styles.createEmptyButton}
            />
          </View>
        }
        ListFooterComponent={
          isLoading && goals.length > 0 && (
            <Loading text="Loading more goals..." />
          )
        }
      />
    </View>
  );
};

// StyleSheet cho màn hình GoalsList
const styles = StyleSheet.create({
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
    ...textStyles.h2,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  viewModeButton: {
    minWidth: 40,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.main,
  },
  bulkActionsText: {
    ...textStyles.body3,
    color: colors.primary.dark,
    fontWeight: '500',
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bulkButton: {
    minWidth: 80,
  },
  goalsList: {
    padding: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptyText: {
    ...textStyles.h4,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  createEmptyButton: {
    minWidth: 200,
  },
});

export default GoalsList; 