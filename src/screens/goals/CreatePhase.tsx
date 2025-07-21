import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { apiService } from '../../services/api';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

const templates = [
  {
    id: 1,
    title: 'Giai đoạn 1: Học cơ bản',
    description: 'Học các khái niệm cơ bản về Node.js',
  },
  {
    id: 2,
    title: 'Giai đoạn 2: Thực hành',
    description: 'Làm các bài tập thực hành',
  },
  {
    id: 3,
    title: 'Giai đoạn 3: Nâng cao',
    description: 'Học các kỹ thuật nâng cao và tối ưu hóa',
  },
];

type Errors = {
  title?: string;
  description?: string;
  orderNumber?: string;
};

const CreatePhase = ({ navigation, route }) => {
  const { goalId, lastOrderNumber = 0 } = route.params;
  const { isLoading, withLoading } = useLoading(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderNumber, setOrderNumber] = useState(lastOrderNumber + 1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [title, description, orderNumber]);

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!title.trim()) {
      newErrors.title = 'Phase title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!orderNumber || isNaN(orderNumber) || orderNumber < 1) {
      newErrors.orderNumber = 'Order number must be a positive integer';
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleTemplateSelect = (template) => {
    setTitle(template.title);
    setDescription(template.description);
    setSelectedTemplate(template);
  };

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
          order_number: Number(orderNumber),
        };
        await apiService.post(`/goals/${goalId}/phases`, data);
        Alert.alert('Success', 'Phase created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        Alert.alert('Error', 'Failed to create phase. Please try again.');
      }
    });
  };

  const handleCancel = () => navigation.goBack();

  if (isLoading) {
    return <Loading fullScreen text="Creating phase..." />;
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
          <Text style={textStyles.h4}>Create Phase</Text>
          <Button
            title={isLoading ? 'Creating...' : 'Create'}
            onPress={handleCreate}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          />
        </View>
        {/* Template Selection */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.h5}>Choose Template (Optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            {templates.map((template) => (
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
        {/* Phase Title */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Phase Title *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.title ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Enter phase title"
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
              placeholder="Describe this phase..."
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
        {/* Order Number */}
        <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg }}>
          <Text style={textStyles.label}>Order Number *</Text>
          <View style={{ borderWidth: 1, borderColor: errors.orderNumber ? colors.error.main : colors.neutral.gray100, borderRadius: 8, marginTop: spacing.xs }}>
            <TextInput
              style={{ fontSize: 16, padding: spacing.md }}
              placeholder="Enter order number"
              value={orderNumber.toString()}
              onChangeText={text => setOrderNumber(Number(text.replace(/[^0-9]/g, '')))}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          {errors.orderNumber && <Text style={{ color: colors.error.main, fontSize: 12, marginTop: 5 }}>{errors.orderNumber}</Text>}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatePhase; 