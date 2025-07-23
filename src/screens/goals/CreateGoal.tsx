import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, priorityColors, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';
// Kiểu dữ liệu cho lỗi của form
type Errors = {
  goalName?: string;
  description?: string;
  deadline?: string;
};

const CreateGoal = ({ navigation }) => {
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoading(false);
  const [isSaving, setIsSaving] = useState(false);
  // Các trường của form
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Trạng thái kiểm tra hợp lệ và lỗi
  const [errors, setErrors] = useState<Errors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Trạng thái lưu nháp tự động
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Danh sách mức độ ưu tiên
  const priorities = [
    { value: 'Low', label: 'Low', color: priorityColors.low, icon: '🟢' },
    { value: 'Medium', label: 'Medium', color: priorityColors.medium, icon: '🟡' },
    { value: 'High', label: 'High', color: priorityColors.high, icon: '🔴' },
  ];

  // Danh sách template mẫu cho mục tiêu
  const templates = [
    {
      id: 1,
      name: 'Learning Goal',
      title: 'Learn New Skill',
      description: 'Master a new skill or technology',
      priority: 'High',
      deadline: '3 months'
    },
    {
      id: 2,
      name: 'Fitness Goal',
      title: 'Exercise Routine',
      description: 'Establish and maintain a regular exercise routine',
      priority: 'Medium',
      deadline: '6 months'
    },
    {
      id: 3,
      name: 'Reading Goal',
      title: 'Read Books',
      description: 'Read a specific number of books',
      priority: 'Low',
      deadline: '1 year'
    },
    {
      id: 4,
      name: 'Project Goal',
      title: 'Complete Project',
      description: 'Finish a specific project or task',
      priority: 'High',
      deadline: '2 months'
    }
  ];

  // Effect để load bản nháp khi mở màn hình và cảnh báo khi rời đi nếu có thay đổi chưa lưu
  useEffect(() => {
    loadDraft();
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Do you want to save as draft or discard?',
          [
            { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
            { text: 'Save Draft', onPress: () => saveDraft().then(() => navigation.dispatch(e.data.action)) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    });
    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  // Effect để validate form và tự động lưu nháp khi có thay đổi
  useEffect(() => {
    validateForm();
    if (hasUnsavedChanges) {
      autoSaveDraft();
    }
  }, [goalName, description, deadline, priority]);

  // Hàm load bản nháp từ AsyncStorage
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('goal_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        setGoalName(draftData.goalName || '');
        setDescription(draftData.description || '');
        setDeadline(draftData.deadline || '');
        setPriority(draftData.priority || 'Medium');
        setHasUnsavedChanges(false);
      }
    } catch (error) {}
  };

  // Hàm lưu bản nháp vào AsyncStorage
  const saveDraft = async () => {
    try {
      const draftData = {
        goalName,
        description,
        deadline,
        priority,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('goal_draft', JSON.stringify(draftData));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {}
  };

  // Hàm tự động lưu bản nháp sau 2 giây nếu có thay đổi
  const autoSaveDraft = () => {
    const timeoutId = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  };

  // Hàm xóa bản nháp khỏi AsyncStorage
  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem('goal_draft');
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (error) {}
  };

  // Hàm kiểm tra hợp lệ của form
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

  // Hàm chọn template mẫu cho mục tiêu
  const handleTemplateSelect = (template) => {
    Alert.alert(
      'Use Template',
      `Do you want to use the "${template.name}" template?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Template', 
          onPress: () => {
            setGoalName(template.title);
            setDescription(template.description);
            setPriority(template.priority);
            // Thiết lập deadline dựa trên template
            const today = new Date();
            let deadlineDate = new Date();
            switch (template.deadline) {
              case '1 month':
                deadlineDate.setMonth(today.getMonth() + 1);
                break;
              case '2 months':
                deadlineDate.setMonth(today.getMonth() + 2);
                break;
              case '3 months':
                deadlineDate.setMonth(today.getMonth() + 3);
                break;
              case '6 months':
                deadlineDate.setMonth(today.getMonth() + 6);
                break;
              case '1 year':
                deadlineDate.setFullYear(today.getFullYear() + 1);
                break;
              default:
                deadlineDate.setMonth(today.getMonth() + 1);
            }
            setDeadline(deadlineDate.toISOString().split('T')[0]);
            setSelectedTemplate(template);
            setHasUnsavedChanges(true);
          }
        },
      ]
    );
  };

  // Hàm tạo mục tiêu mới
  const handleCreateGoal = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fix the errors before creating the goal.');
      return;
    }
    await withLoading(async () => {
      try {
        setIsSaving(true);
        const goalData = {
          name: goalName.trim(),
          description: description.trim(),
          deadline: deadline,
          priority: priority
        };
        await apiService.post('/goals', goalData);
        await clearDraft();

        Alert.alert(
          'Success',
          'Goal created successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('GoalsList')
            }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to create goal. Please try again.');
      } finally {
        setIsSaving(false);
      }
    });
  };

  // Hàm xử lý khi nhấn Cancel
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Do you want to save your changes as draft?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save Draft', onPress: () => saveDraft().then(() => navigation.goBack()) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Hiển thị loading khi đang tạo mục tiêu
  if (isLoading) {
    return <Loading fullScreen text="Creating goal..." />;
  }

  // Giao diện chính của màn hình tạo mục tiêu
  return (
    <KeyboardAvoidingView 
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background.primary, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray100 }}>
          <Button title="Cancel" variant="ghost" onPress={handleCancel} />
          <Text style={textStyles.h4}>Create Goal</Text>
          <Button
            title={isSaving ? 'Creating...' : 'Create'}
            onPress={handleCreateGoal}
            disabled={!isFormValid || isSaving}
            loading={isSaving}
          />
        </View>
        {/* Hiển thị thông báo đã lưu nháp gần nhất */}
        {lastSaved && (
          <View style={{ backgroundColor: colors.info.light, padding: spacing.sm, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: colors.info.main }}>
              Draft saved at {lastSaved.toLocaleTimeString()}
            </Text>
          </View>
        )}
        {/* Chọn template mẫu */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.h5}>Choose Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            {templates.map((template) => (
              <Button
                key={template.id}
                title={template.title}
                variant={selectedTemplate?.id === template.id ? 'primary' : 'outline'}
                style={{ marginRight: spacing.md, minWidth: 150 }}
                onPress={() => handleTemplateSelect(template)}
              />
            ))}
          </ScrollView>
        </View>
        {/* Nhập tên mục tiêu */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Goal Name *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.goalName ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Enter your goal name"
              value={goalName}
              onChangeText={(text) => {
                setGoalName(text);
                setHasUnsavedChanges(true);
              }}
              maxLength={100}
            />
          </View>
          {errors.goalName && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.goalName}</Text>}
        </View>
        {/* Nhập mô tả mục tiêu */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Description *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.description ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, minHeight: 100, padding: spacing.md }}
              placeholder="Describe your goal in detail..."
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setHasUnsavedChanges(true);
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, textAlign: 'right', marginTop: 5 }}>{description.length}/500 characters</Text>
          {errors.description && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.description}</Text>}
        </View>
        {/* Nhập deadline */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Deadline *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.deadline ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Select deadline"
              value={deadline}
              onChangeText={setDeadline}
              onFocus={() => {
                if (!deadline) {
                  const today = new Date();
                  today.setMonth(today.getMonth() + 1);
                  setDeadline(today.toISOString().split('T')[0]);
                  setHasUnsavedChanges(true);
                }
              }}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 5 }}>Format: YYYY-MM-DD (e.g., 2024-12-31)</Text>
          {errors.deadline && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.deadline}</Text>}
        </View>
        {/* Chọn mức độ ưu tiên */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Priority *</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
            {priorities.map((priorityOption) => (
              <Button
                key={priorityOption.value}
                title={priorityOption.icon + ' ' + priorityOption.label}
                variant={priority === priorityOption.value ? 'primary' : 'outline'}
                style={{ flex: 1, borderColor: priorityOption.color }}
                onPress={() => {
                  setPriority(priorityOption.value);
                  setHasUnsavedChanges(true);
                }}
              />
            ))}
          </View>
        </View>
        {/* Hiển thị tóm tắt thông tin mục tiêu */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.h5}>Goal Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={textStyles.body2}>Name:</Text>
            <Text style={textStyles.body2}>{goalName || 'Not set'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={textStyles.body2}>Priority:</Text>
            <Text style={textStyles.body2}>{priorities.find(p => p.value === priority)?.label || 'Not set'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={textStyles.body2}>Deadline:</Text>
            <Text style={textStyles.body2}>{deadline || 'Not set'}</Text>
          </View>
        </View>
        {/* Khoảng trống cuối trang */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateGoal; 