// CreateTask.tsx - Màn hình tạo task mới cho user

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput, Switch, TouchableOpacity } from 'react-native';
import { apiService } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, priorityColors, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

// Định nghĩa interface cho template mẫu task
interface Template {
  id: number;
  title: string;
  description: string;
  priority: string;
}

// Định nghĩa interface cho Goal
interface Goal {
  id: number;
  name: string;
}

// Định nghĩa interface cho Phase
interface Phase {
  id: number;
  title: string;
}

// Định nghĩa kiểu cho params truyền qua route
interface RouteParams {
  goalId?: number;
  phaseId?: number;
}

// Định nghĩa kiểu cho errors của form
type Errors = {
  title?: string;
  description?: string;
  goalId?: string;
  deadline?: string;
};

// Danh sách mức độ ưu tiên
const priorities = [
  { value: 'Low', label: 'Low', color: priorityColors.low, icon: '🟢' },
  { value: 'Medium', label: 'Medium', color: priorityColors.medium, icon: '🟡' },
  { value: 'High', label: 'High', color: priorityColors.high, icon: '🔴' },
];

// Danh sách template mẫu cho task
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

// Component chính để tạo task mới
const CreateTask = ({ navigation, route }: { navigation: any; route: { params: RouteParams } }) => {
  // Lấy goalId và phaseId từ params nếu có
  const { goalId: initialGoalId = null, phaseId: initialPhaseId = null } = route.params || {};
  const { isLoading, withLoading } = useLoading(false);

  // State cho các trường của form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState(initialGoalId);
  const [phaseId, setPhaseId] = useState(initialPhaseId);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringRule, setRecurringRule] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Các preset cho recurring task
  const recurringPresets = [
    { label: 'None', value: '' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Custom', value: 'custom' },
  ];
  const [recurringPreset, setRecurringPreset] = useState('');

  // Lấy danh sách goals khi mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Lấy danh sách phases khi goalId thay đổi
  useEffect(() => {
    if (goalId) fetchPhases(goalId);
  }, [goalId]);

  // Validate form mỗi khi các trường thay đổi
  useEffect(() => {
    validateForm();
  }, [title, description, goalId, phaseId, deadline, priority]);

  // Hàm lấy danh sách goals từ API
  const fetchGoals = async () => {
    try {
      const response = await apiService.get('/goals');
      setGoals(response.goals || response);
    } catch (error) {
      setGoals([]);
    }
  };

  // Hàm lấy danh sách phases theo goalId từ API
  const fetchPhases = async (goalId) => {
    try {
      const response = await apiService.get(`/goals/${goalId}/phases`);
      setPhases(response.phases || []);
    } catch (error) {
      setPhases([]);
    }
  };

  // Hàm kiểm tra hợp lệ của form
  const validateForm = () => {
    const newErrors: Errors = {};
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

  // Khi chọn template mẫu
  const handleTemplateSelect = (template: Template) => {
    setTitle(template.title);
    setDescription(template.description);
    setPriority(template.priority);
    setSelectedTemplate(template);
  };

  // Hàm xử lý khi nhấn nút tạo task
  const handleCreate = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fix the errors before creating.');
      return;
    }
    await withLoading(async () => {
      try {
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
        Alert.alert('Error', 'Failed to create task. Please try again.');
      }
    });
  };

  // Hàm xử lý khi nhấn cancel
  const handleCancel = () => navigation.goBack();

  // Nếu đang loading thì show loading
  if (isLoading) {
    return <Loading fullScreen text="Creating task..." />;
  }

  // Render UI
  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background.primary, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray100 }}>
          <Button title="Cancel" variant="ghost" onPress={handleCancel} />
          <Text style={textStyles.h4}>Create Task</Text>
          <Button
            title="Create"
            onPress={handleCreate}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          />
        </View>
        {/* Template Selection */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.h5}>Choose Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            {templates.map((template: Template) => (
              <Button
                key={template.id}
                title={template.title}
                variant={selectedTemplate?.id === template.id ? 'primary' : 'outline'}
                style={{ marginRight: spacing.md, minWidth: 180 }}
                onPress={() => handleTemplateSelect(template)}
              />
            ))}
          </ScrollView>
        </View>
        {/* Task Title */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Task Title *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.title ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>
          {errors.title && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.title}</Text>}
        </View>
        {/* Description */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Description *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.description ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, minHeight: 80, padding: spacing.md }}
              placeholder="Describe this task..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={300}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, textAlign: 'right', marginTop: 5 }}>{description.length}/300 characters</Text>
          {errors.description && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.description}</Text>}
        </View>
        {/* Goal Selection */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Goal *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
            {goals.map((goal: Goal) => (
              <Button
                key={goal.id}
                title={goal.name}
                variant={goalId === goal.id ? 'primary' : 'outline'}
                style={{ marginRight: spacing.md, minWidth: 120 }}
                onPress={() => setGoalId(goal.id)}
              />
            ))}
          </ScrollView>
          {errors.goalId && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.goalId}</Text>}
        </View>
        {/* Phase Selection */}
        {phases.length > 0 && (
          <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
            <Text style={textStyles.label}>Phase (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
              {phases.map((phase: Phase) => (
                <Button
                  key={phase.id}
                  title={phase.title}
                  variant={phaseId === phase.id ? 'primary' : 'outline'}
                  style={{ marginRight: spacing.md, minWidth: 120 }}
                  onPress={() => setPhaseId(phase.id)}
                />
              ))}
            </ScrollView>
          </View>
        )}
        {/* Deadline */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Deadline *</Text>
          <TouchableOpacity
            style={{ borderWidth: 1, borderColor: colors.neutral.gray100, borderRadius: 8, padding: spacing.md, justifyContent: 'center', marginTop: spacing.xs }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: deadline ? colors.text.primary : colors.text.secondary, fontSize: 16 }}>
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
        {/* Recurring Task Option */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={textStyles.label}>Recurring Task</Text>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>
          {isRecurring && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                {recurringPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    title={preset.label}
                    variant={recurringPreset === preset.value ? 'primary' : 'outline'}
                    style={{ marginRight: spacing.md, minWidth: 100 }}
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
                  />
                ))}
              </ScrollView>
              {recurringPreset === 'custom' && (
                <TextInput
                  style={{ fontSize: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}
                  placeholder="e.g., Every Monday, Every 1st of month"
                  value={recurringRule}
                  onChangeText={setRecurringRule}
                />
              )}
            </>
          )}
        </View>
        {/* Khoảng trống cuối để tránh che nút khi bàn phím mở */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTask; 