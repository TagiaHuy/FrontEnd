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
  Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateGoal = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form fields
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Auto-save states
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const priorities = [
    { value: 'Low', label: 'Low', color: '#28a745', icon: '🟢' },
    { value: 'Medium', label: 'Medium', color: '#ffc107', icon: '🟡' },
    { value: 'High', label: 'High', color: '#dc3545', icon: '🔴' },
  ];

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
      priority: 'medium',
      deadline: '6 months'
    },
    {
      id: 3,
      name: 'Reading Goal',
      title: 'Read Books',
      description: 'Read a specific number of books',
      priority: 'low',
      deadline: '1 year'
    },
    {
      id: 4,
      name: 'Project Goal',
      title: 'Complete Project',
      description: 'Finish a specific project or task',
      priority: 'high',
      deadline: '2 months'
    }
  ];

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

  useEffect(() => {
    validateForm();
    if (hasUnsavedChanges) {
      autoSaveDraft();
    }
  }, [goalName, description, deadline, priority]);

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
        console.log('Draft loaded:', draftData);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

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
      console.log('Draft saved:', draftData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const autoSaveDraft = () => {
    const timeoutId = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDraft();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem('goal_draft');
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
            
            // Set deadline based on template
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

  const handleCreateGoal = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fix the errors before creating the goal.');
      return;
    }

    try {
      setIsLoading(true);
      
      const goalData = {
        name: goalName.trim(),
        description: description.trim(),
        deadline: deadline,
        priority: priority
      };

      const response = await apiService.post('/goals', goalData);
      
      console.log('Goal created:', response);
      
      // Clear draft after successful creation
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
      console.error('Error creating goal:', error);
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5); // Allow up to 5 years in the future
    return maxDate.toISOString().split('T')[0];
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
          <Text style={styles.headerTitle}>Create Goal</Text>
          <TouchableOpacity 
            style={[styles.createButton, !isFormValid && styles.createButtonDisabled]} 
            onPress={handleCreateGoal}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Auto-save indicator */}
        {lastSaved && (
          <View style={styles.autoSaveIndicator}>
            <Text style={styles.autoSaveText}>
              Draft saved at {lastSaved.toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesContainer}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate?.id === template.id && styles.selectedTemplateCard
                ]}
                onPress={() => handleTemplateSelect(template)}
              >
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.templateDescription} numberOfLines={2}>
                  {template.description}
                </Text>
                <View style={styles.templateMeta}>
                  <Text style={styles.templatePriority}>{template.priority}</Text>
                  <Text style={styles.templateDeadline}>{template.deadline}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Goal Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Goal Name *</Text>
          <TextInput
            style={[styles.input, errors.goalName && styles.inputError]}
            placeholder="Enter your goal name"
            value={goalName}
            onChangeText={(text) => {
              setGoalName(text);
              setHasUnsavedChanges(true);
            }}
            maxLength={100}
          />
          {errors.goalName && <Text style={styles.errorText}>{errors.goalName}</Text>}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
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
          <Text style={styles.characterCount}>
            {description.length}/500 characters
          </Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Deadline */}
        <View style={styles.section}>
          <Text style={styles.label}>Deadline *</Text>
          <TextInput
            style={[styles.input, errors.deadline && styles.inputError]}
            placeholder="Select deadline"
            value={deadline}
            onChangeText={setDeadline}
            onFocus={() => {
              // In a real app, you'd use a date picker component
              // For now, we'll use text input with date format
              if (!deadline) {
                const today = new Date();
                today.setMonth(today.getMonth() + 1);
                setDeadline(today.toISOString().split('T')[0]);
                setHasUnsavedChanges(true);
              }
            }}
          />
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
                onPress={() => {
                  setPriority(priorityOption.value);
                  setHasUnsavedChanges(true);
                }}
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

        {/* Form Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Goal Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>{goalName || 'Not set'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Priority:</Text>
            <Text style={styles.summaryValue}>
              {priorities.find(p => p.value === priority)?.label || 'Not set'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Deadline:</Text>
            <Text style={styles.summaryValue}>{deadline || 'Not set'}</Text>
          </View>
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
  autoSaveIndicator: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    alignItems: 'center',
  },
  autoSaveText: {
    fontSize: 12,
    color: '#1976d2',
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
    width: 150,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  templateName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
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
  templateMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templatePriority: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
  },
  templateDeadline: {
    fontSize: 10,
    color: '#666',
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
    minHeight: 100,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
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
  summarySection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default CreateGoal; 