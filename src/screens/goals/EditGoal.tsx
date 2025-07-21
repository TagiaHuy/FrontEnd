import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, priorityColors, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

const priorities = [
  { value: 'Low', label: 'Low', color: priorityColors.low, icon: '🟢' },
  { value: 'Medium', label: 'Medium', color: priorityColors.medium, icon: '🟡' },
  { value: 'High', label: 'High', color: priorityColors.high, icon: '🔴' },
];

type Errors = {
  goalName?: string;
  description?: string;
  deadline?: string;
};

const EditGoal = ({ navigation, route }) => {
  const { goalId } = route.params;
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoading(true);
  const [isSaving, setIsSaving] = useState(false);
  const [goal, setGoal] = useState(null);
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [errors, setErrors] = useState<Errors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [changeHistory, setChangeHistory] = useState([]);

  useEffect(() => {
    withLoading(loadGoal);
  }, [goalId]);

  useEffect(() => {
    validateForm();
  }, [goalName, description, deadline, priority]);

  const loadGoal = async () => {
    try {
      const response = await apiService.get(`/goals/${goalId}`);
      const goalData = response.goal || response;
      setGoal(goalData);
      setGoalName(goalData.name || '');
      setDescription(goalData.description || '');
      setDeadline(goalData.deadline ? goalData.deadline.split('T')[0] : '');
      setPriority(goalData.priority ? capitalize(goalData.priority) : 'Medium');
      // TODO: Load change history if available
    } catch (error) {
      Alert.alert('Error', 'Failed to load goal.');
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!goalName.trim()) {
      newErrors.goalName = 'Goal name is required';
    } else if (goalName.trim().length < 3) {
      newErrors.goalName = 'Goal name must be at least 3 characters';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }
    try {
      setIsSaving(true);
      const updateData = {
        name: goalName.trim(),
        description: description.trim(),
        deadline: deadline,
        priority: priority,
      };
      await apiService.put(`/goals/${goalId}`, updateData);
      Alert.alert('Success', 'Goal updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigation.goBack();
  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ]
    );
  };
  const performDelete = async () => {
    try {
      await apiService.delete(`/goals/${goalId}`);
      Alert.alert('Success', 'Goal deleted successfully!');
      navigation.navigate('GoalsList');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete goal. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading goal..." />;
  }

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background.primary, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray100 }}>
          <Button title="Cancel" variant="ghost" onPress={handleCancel} />
          <Text style={textStyles.h4}>Edit Goal</Text>
          <Button
            title={isSaving ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={!isFormValid || isSaving}
            loading={isSaving}
          />
        </View>
        {/* Goal Name */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Goal Name *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.goalName ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <Text
              style={{ padding: spacing.md, fontSize: 16 }}
              selectable={false}
            >
              <TextInput
                style={{ fontSize: 16 }}
                placeholder="Enter your goal name"
                value={goalName}
                onChangeText={setGoalName}
                maxLength={100}
              />
            </Text>
          </View>
          {errors.goalName && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.goalName}</Text>}
        </View>
        {/* Description */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Description *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.description ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, minHeight: 100, padding: spacing.md }}
              placeholder="Describe your goal in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, textAlign: 'right', marginTop: 5 }}>{description.length}/500 characters</Text>
          {errors.description && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.description}</Text>}
        </View>
        {/* Deadline */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Deadline *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.deadline ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Select deadline"
              value={deadline}
              onChangeText={setDeadline}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 5 }}>Format: YYYY-MM-DD (e.g., 2024-12-31)</Text>
          {errors.deadline && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.deadline}</Text>}
        </View>
        {/* Priority */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Priority *</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
            {priorities.map((priorityOption) => (
              <Button
                key={priorityOption.value}
                title={priorityOption.icon + ' ' + priorityOption.label}
                variant={priority === priorityOption.value ? 'primary' : 'outline'}
                style={{ flex: 1, borderColor: priorityOption.color }}
                onPress={() => setPriority(priorityOption.value)}
              />
            ))}
          </View>
        </View>
        {/* Change History Placeholder */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.h5}>Change History</Text>
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 5 }}>Change history will be displayed here in the future.</Text>
        </View>
        {/* Delete Button */}
        <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
          <Button title="Delete Goal" variant="danger" onPress={handleDelete} />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditGoal; 