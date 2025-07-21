import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const { width } = Dimensions.get('window');

const GoalsList = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadGoals();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortGoals();
  }, [goals, searchQuery, statusFilter, priorityFilter, sortBy]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get(`/goals?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      
      if (currentPage === 1) {
        setGoals(response.goals || []);
      } else {
        setGoals(prev => [...prev, ...(response.goals || [])]);
      }
      
      setHasMore(response.hasMore || false);
      console.log('Goals loaded:', response);
    } catch (error) {
      console.error('Error loading goals:', error);
      // Use mock data for development
      setMockData();
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const setMockData = () => {
    const mockGoals = [
      { id: 1, title: 'Learn React Native', description: 'Master React Native development', status: 'in_progress', priority: 'High', progress: 75, deadline: '2024-01-15', createdAt: '2024-01-01' },
      { id: 2, title: 'Complete Project', description: 'Finish the main project', status: 'not_started', priority: 'Medium', progress: 0, deadline: '2024-01-20', createdAt: '2024-01-02' },
      { id: 3, title: 'Exercise Daily', description: 'Maintain daily exercise routine', status: 'completed', priority: 'Low', progress: 100, deadline: '2024-01-10', createdAt: '2024-01-03' },
      { id: 4, title: 'Read 12 Books', description: 'Read one book per month', status: 'in_progress', priority: 'Medium', progress: 45, deadline: '2024-12-31', createdAt: '2024-01-04' },
      { id: 5, title: 'Learn Spanish', description: 'Achieve B2 level in Spanish', status: 'not_started', priority: 'High', progress: 0, deadline: '2024-06-30', createdAt: '2024-01-05' },
    ];
    setGoals(mockGoals);
    setHasMore(false);
  };

  const filterAndSortGoals = () => {
    let filtered = [...goals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(goal => goal.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'progress':
          return b.progress - a.progress;
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredGoals(filtered);
  };

  const loadMoreGoals = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleCreateGoal = () => {
    navigation.navigate('CreateGoal');
  };

  const handleGoalPress = (goal) => {
    if (isSelectionMode) {
      toggleGoalSelection(goal.id);
    } else {
      navigation.navigate('GoalDetail', { goalId: goal.id });
    }
  };

  const handleLongPress = (goal) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedGoals([goal.id]);
    }
  };

  const toggleGoalSelection = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleBulkAction = (action) => {
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

  const performBulkAction = async (action) => {
    try {
      // TODO: Implement bulk actions API
      console.log(`Performing ${action} on goals:`, selectedGoals);
      Alert.alert('Success', `Bulk ${action} completed successfully.`);
      
      // Refresh goals
      setCurrentPage(1);
      setSelectedGoals([]);
      setIsSelectionMode(false);
      loadGoals();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      Alert.alert('Error', 'Failed to perform bulk action. Please try again.');
    }
  };

  const handleQuickStatusUpdate = async (goalId, newStatus) => {
    try {
      // TODO: Implement quick status update API
      console.log(`Updating goal ${goalId} status to ${newStatus}`);
      
      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, status: newStatus }
            : goal
        )
      );
    } catch (error) {
      console.error('Error updating goal status:', error);
      Alert.alert('Error', 'Failed to update goal status. Please try again.');
    }
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

  const renderGoalItem = ({ item: goal }) => {
    const isSelected = selectedGoals.includes(goal.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.goalItem,
          viewMode === 'grid' && styles.goalGridItem,
          isSelected && styles.selectedGoalItem
        ]}
        onPress={() => handleGoalPress(goal)}
        onLongPress={() => handleLongPress(goal)}
      >
        {isSelectionMode && (
          <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        )}
        
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle} numberOfLines={2}>{goal.title}</Text>
          <View style={styles.goalMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) }]}>
              <Text style={styles.priorityText}>{goal.priority}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goal.status) }]}>
              <Text style={styles.statusText}>{goal.status.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.goalDescription} numberOfLines={2}>{goal.description}</Text>

        <View style={styles.goalProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${goal.progress}%`, backgroundColor: getStatusColor(goal.status) }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.deadlineText}>Due: {goal.deadline}</Text>
          {isSelectionMode && (
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleQuickStatusUpdate(goal.id, 'completed')}
            >
              <Text style={styles.quickActionText}>✓</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Goals</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.viewModeButton} 
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Text style={styles.viewModeIcon}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersSection}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search goals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'all' && styles.activeFilterButton]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'all' && styles.activeFilterButtonText]}>
            All Status
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'not_started' && styles.activeFilterButton]}
          onPress={() => setStatusFilter('not_started')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'not_started' && styles.activeFilterButtonText]}>
            Not Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'in_progress' && styles.activeFilterButton]}
          onPress={() => setStatusFilter('in_progress')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'in_progress' && styles.activeFilterButtonText]}>
            In Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'completed' && styles.activeFilterButton]}
          onPress={() => setStatusFilter('completed')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'completed' && styles.activeFilterButtonText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Priority Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterButton, priorityFilter === 'all' && styles.activeFilterButton]}
          onPress={() => setPriorityFilter('all')}
        >
          <Text style={[styles.filterButtonText, priorityFilter === 'all' && styles.activeFilterButtonText]}>
            All Priority
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, priorityFilter === 'High' && styles.activeFilterButton]}
          onPress={() => setPriorityFilter('High')}
        >
          <Text style={[styles.filterButtonText, priorityFilter === 'High' && styles.activeFilterButtonText]}>
            High
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, priorityFilter === 'Medium' && styles.activeFilterButton]}
          onPress={() => setPriorityFilter('Medium')}
        >
          <Text style={[styles.filterButtonText, priorityFilter === 'Medium' && styles.activeFilterButtonText]}>
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, priorityFilter === 'Low' && styles.activeFilterButton]}
          onPress={() => setPriorityFilter('Low')}
        >
          <Text style={[styles.filterButtonText, priorityFilter === 'Low' && styles.activeFilterButtonText]}>
            Low
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'deadline', label: 'Deadline' },
            { key: 'priority', label: 'Priority' },
            { key: 'progress', label: 'Progress' },
            { key: 'created', label: 'Created' },
          ].map(sortOption => (
            <TouchableOpacity
              key={sortOption.key}
              style={[styles.sortButton, sortBy === sortOption.key && styles.activeSortButton]}
              onPress={() => setSortBy(sortOption.key)}
            >
              <Text style={[styles.sortButtonText, sortBy === sortOption.key && styles.activeSortButtonText]}>
                {sortOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          <TouchableOpacity 
            style={styles.bulkButton} 
            onPress={() => handleBulkAction('complete')}
          >
            <Text style={styles.bulkButtonText}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bulkButton} 
            onPress={() => handleBulkAction('delete')}
          >
            <Text style={styles.bulkButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => {
              setSelectedGoals([]);
              setIsSelectionMode(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading goals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
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
            <TouchableOpacity style={styles.createEmptyButton} onPress={handleCreateGoal}>
              <Text style={styles.createEmptyButtonText}>Create your first goal</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          isLoadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingMoreText}>Loading more goals...</Text>
            </View>
          )
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  viewModeIcon: {
    fontSize: 18,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  filtersRow: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 1,
    borderBottomColor: '#bbdefb',
  },
  bulkActionsText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  goalsList: {
    padding: 10,
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  goalGridItem: {
    flex: 1,
    marginHorizontal: 5,
    minWidth: (width - 40) / 2,
  },
  selectedGoalItem: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedIndicator: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  goalHeader: {
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  goalMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    minWidth: 30,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: '#666',
  },
  quickActionButton: {
    backgroundColor: '#28a745',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  createEmptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createEmptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingMore: {
    alignItems: 'center',
    padding: 20,
  },
  loadingMoreText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default GoalsList; 