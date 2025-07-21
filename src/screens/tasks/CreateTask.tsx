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
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { apiService } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

// Add types
interface Template {
  id: number;
  title: string;
  description: string;
  priority: string;
}
interface Goal {
  id: number;
  name: string;
}
interface Phase {
  id: number;
  title: string;
}
interface RouteParams {
  goalId?: number;
  phaseId?: number;
}

const priorities = [
  { value: 'Low', label: 'Low', color: '#28a745', icon: '🟢' },
  { value: 'Medium', label: 'Medium', color: '#ffc107', icon: '🟡' },
  { value: 'High', label: 'High', color: '#dc3545', icon: '🔴' },
];

const templates = [
  {
    id: 1,
    title: 'Đọc tài liệu',
    description: 'Đọc tài liệu hướng dẫn và ghi chú lại các điểm quan trọng.',
    priority: 'Medium',
  },
  {
    id: 2,
    title: 'Làm bài tập',
    description: 'Hoàn thành các bài tập thực hành.',
    priority: 'High',
  },
  {
    id: 3,
    title: 'Họp nhóm',
    description: 'Tham gia họp nhóm để trao đổi tiến độ.',
    priority: 'Low',
  },
];

const CreateTask = ({ navigation, route }: { navigation: any; route: { params: RouteParams } }) => {
  const { goalId: initialGoalId = null, phaseId: initialPhaseId = null } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState(initialGoalId);
  const [phaseId, setPhaseId] = useState(initialPhaseId);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringRule, setRecurringRule] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Recurring presets
  const recurringPresets = [
    { label: 'None', value: '' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Custom', value: 'custom' },
  ];
  const [recurringPreset, setRecurringPreset] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (goalId) fetchPhases(goalId);
  }, [goalId]);

  useEffect(() => {
    validateForm();
  }, [title, description, goalId, phaseId, deadline, priority]);

  const fetchGoals = async () => {
    try {
      const response = await apiService.get('/goals');
      setGoals(response.goals || response);
    } catch (error) {
      setGoals([]);
    }
  };

  const fetchPhases = async (goalId) => {
    try {
      const response = await apiService.get(`/goals/${goalId}/phases`);
      setPhases(response.phases || []);
    } catch (error) {
      setPhases([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!goalId) {
      newErrors.goalId = 'Please select a goal';
    }
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleTemplateSelect = (template: Template) => {
    setTitle(template.title);
    setDescription(template.description);
    setPriority(template.priority);
    setSelectedTemplate(template);
  };

  const handleCreate = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fix the errors before creating.');
      return;
    }
    try {
      setIsLoading(true);
      const data = {
        title: title.trim(),
        description: description.trim(),
        goal_id: goalId,
        phase_id: phaseId,
        deadline,
        priority,
        is_recurring: isRecurring,
        recurring_rule: isRecurring ? recurringRule : '',
      };
      await apiService.post('/tasks', data);
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Task</Text>
          <TouchableOpacity
            style={[styles.createButton, !isFormValid && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesContainer}>
            {templates.map((template: Template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate?.id === template.id && styles.selectedTemplateCard
                ]}
                onPress={() => handleTemplateSelect(template)}
              >
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.templateDescription} numberOfLines={2}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Task Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Describe this task..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={300}
          />
          <Text style={styles.characterCount}>
            {description.length}/300 characters
          </Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Goal *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsRow}>
            {goals.map((goal: Goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalButton,
                  goalId === goal.id && styles.goalButtonSelected
                ]}
                onPress={() => setGoalId(goal.id)}
              >
                <Text style={styles.goalButtonText}>{goal.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.goalId && <Text style={styles.errorText}>{errors.goalId}</Text>}
        </View>

        {/* Phase Selection */}
        {phases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Phase (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsRow}>
              {phases.map((phase: Phase) => (
                <TouchableOpacity
                  key={phase.id}
                  style={[
                    styles.goalButton,
                    phaseId === phase.id && styles.goalButtonSelected
                  ]}
                  onPress={() => setPhaseId(phase.id)}
                >
                  <Text style={styles.goalButtonText}>{phase.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Deadline */}
        <View style={styles.section}>
          <Text style={styles.label}>Deadline *</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: deadline ? '#333' : '#aaa', fontSize: 16 }}>
              {deadline ? deadline : 'Select deadline'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={deadline ? new Date(deadline) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDeadline(selectedDate.toISOString().split('T')[0]);
                }
              }}
            />
          )}
          <Text style={styles.helperText}>
            Format: YYYY-MM-DD (e.g., 2024-12-31)
          </Text>
          {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority *</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priorityOption) => (
              <TouchableOpacity
                key={priorityOption.value}
                style={[
                  styles.priorityButton,
                  priority === priorityOption.value && styles.priorityButtonSelected,
                  { borderColor: priorityOption.color }
                ]}
                onPress={() => setPriority(priorityOption.value)}
              >
                <Text style={styles.priorityIcon}>{priorityOption.icon}</Text>
                <Text style={[
                  styles.priorityText,
                  priority === priorityOption.value && styles.priorityTextSelected
                ]}>
                  {priorityOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recurring Task Option */}
        <View style={styles.section}>
          <View style={styles.recurringRow}>
            <Text style={styles.label}>Recurring Task</Text>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>
          {isRecurring && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                {recurringPresets.map((preset) => (
                  <TouchableOpacity
                    key={preset.value}
                    style={[
                      styles.goalButton,
                      recurringPreset === preset.value && styles.goalButtonSelected,
                    ]}
                    onPress={() => {
                      setRecurringPreset(preset.value);
                      if (preset.value === 'custom') {
                        setRecurringRule('');
                      } else if (preset.value === '') {
                        setRecurringRule('');
                      } else {
                        setRecurringRule(preset.value);
                      }
                    }}
                  >
                    <Text style={styles.goalButtonText}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {recurringPreset === 'custom' && (
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Every Monday, Every 1st of month"
                  value={recurringRule}
                  onChangeText={setRecurringRule}
                />
              )}
            </>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  templatesContainer: {
    marginBottom: 10,
  },
  templateCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    width: 180,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 80,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  goalsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  goalButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  goalButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  priorityButtonSelected: {
    backgroundColor: '#f8f9fa',
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  priorityTextSelected: {
    color: '#333',
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default CreateTask; 