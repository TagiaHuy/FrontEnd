import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Button } from '../../ui';
import { colors, textStyles, spacing } from '../../../styles';

export interface FilterState {
  searchQuery: string;
  statusFilter: 'all' | 'not_started' | 'in_progress' | 'completed';
  priorityFilter: 'all' | 'High' | 'Medium' | 'Low';
  sortBy: 'deadline' | 'priority' | 'progress' | 'created';
}

export interface GoalFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  style?: any;
}

const GoalFilters: React.FC<GoalFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  style 
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <View style={[styles.container, style]}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search goals..."
          value={filters.searchQuery}
          onChangeText={(text) => updateFilter('searchQuery', text)}
        />
      </View>

      {/* Status Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
        {[
          { key: 'all', label: 'All Status' },
          { key: 'not_started', label: 'Not Started' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map((status) => (
          <Button
            key={status.key}
            title={status.label}
            variant={filters.statusFilter === status.key ? 'primary' : 'outline'}
            size="small"
            onPress={() => updateFilter('statusFilter', status.key)}
            style={styles.filterButton}
          />
        ))}
      </ScrollView>

      {/* Priority Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
        {[
          { key: 'all', label: 'All Priority' },
          { key: 'High', label: 'High' },
          { key: 'Medium', label: 'Medium' },
          { key: 'Low', label: 'Low' },
        ].map((priority) => (
          <Button
            key={priority.key}
            title={priority.label}
            variant={filters.priorityFilter === priority.key ? 'primary' : 'outline'}
            size="small"
            onPress={() => updateFilter('priorityFilter', priority.key)}
            style={styles.filterButton}
          />
        ))}
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
          ].map((sortOption) => (
            <Button
              key={sortOption.key}
              title={sortOption.label}
              variant={filters.sortBy === sortOption.key ? 'primary' : 'outline'}
              size="small"
              onPress={() => updateFilter('sortBy', sortOption.key)}
              style={styles.sortButton}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  
  searchContainer: {
    marginBottom: spacing.md,
  },
  
  searchInput: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  
  filtersRow: {
    marginBottom: spacing.sm,
  },
  
  filterButton: {
    marginRight: spacing.sm,
  },
  
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  sortLabel: {
    ...textStyles.body3,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  
  sortButton: {
    marginRight: spacing.sm,
  },
});

export default GoalFilters; 