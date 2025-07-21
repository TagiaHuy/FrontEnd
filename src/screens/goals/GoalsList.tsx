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

const GoalsList = ({ navigation }) => {
  const { user } = useAuth();
  const { execute, isLoading } = useApi();
  const { currentPage, hasNextPage, setTotalItems, nextPage, reset: resetPagination } = usePagination();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    sortBy: 'deadline',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadGoals();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortGoals();
  }, [goals, filters]);

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
      // Use mock data for development
      setMockData();
    }
  };

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

  const filterAndSortGoals = () => {
    let filtered = [...goals];

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === filters.statusFilter);
    }

    // Priority filter
    if (filters.priorityFilter !== 'all') {
      filtered = filtered.filter(goal => goal.priority === filters.priorityFilter);
    }

    // Sort
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

  const handleCreateGoal = () => {
    navigation.navigate('CreateGoal');
  };

  const handleGoalPress = (goal: Goal) => {
    if (isSelectionMode) {
      toggleGoalSelection(goal.id);
    } else {
      navigation.navigate('GoalDetail', { goalId: goal.id });
    }
  };

  const handleLongPress = (goal: Goal) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedGoals([goal.id]);
    }
  };

  const toggleGoalSelection = (goalId: number) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

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

  const performBulkAction = async (action: string) => {
    try {
      // TODO: Implement bulk actions API
      console.log(`Performing ${action} on goals:`, selectedGoals);
      Alert.alert('Success', `Bulk ${action} completed successfully.`);
      
      // Refresh goals
      resetPagination();
      setSelectedGoals([]);
      setIsSelectionMode(false);
      loadGoals();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      Alert.alert('Error', 'Failed to perform bulk action. Please try again.');
    }
  };

  const handleQuickStatusUpdate = async (goalId: number, newStatus: string) => {
    try {
      // TODO: Implement quick status update API
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

  const loadMoreGoals = () => {
    if (hasNextPage && !isLoading) {
      nextPage();
    }
  };

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

  if (isLoading && goals.length === 0) {
    return <Loading text="Loading goals..." fullScreen />;
  }

  return (
    <View style={commonStyles.container}>
      {renderHeader()}
      
      <GoalFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {renderBulkActions()}
      
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