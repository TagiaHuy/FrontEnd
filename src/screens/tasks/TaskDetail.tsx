// TaskDetail.tsx - Hiển thị chi tiết một task, cho phép cập nhật trạng thái, thêm comment, và xem thông tin liên quan

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { apiService } from '../../services/api';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

// Các trạng thái có thể của task
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TaskDetail = ({ navigation, route }) => {
  // Lấy taskId và dữ liệu task (nếu có sẵn) từ params
  const { taskId, taskData } = route.params;
  // Hook loading, nếu chưa có taskData thì sẽ loading
  const { isLoading, withLoading } = useLoading(!taskData);
  // State lưu thông tin task
  const [task, setTask] = useState(taskData || null);
  // State lưu trạng thái hiện tại của task
  const [status, setStatus] = useState(taskData ? taskData.status : '');
  // State lưu danh sách comment
  const [comments, setComments] = useState([]);
  // State cho comment mới
  const [newComment, setNewComment] = useState('');
  // State cho các task liên quan (placeholder)
  const [relatedTasks, setRelatedTasks] = useState([]);
  // State loading khi cập nhật trạng thái
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Khi taskId thay đổi, load lại task nếu chưa có sẵn
  useEffect(() => {
    if (!taskData) {
      withLoading(loadTask);
    } else {
      setTask(taskData);
      setStatus(taskData.status);
    }
  }, [taskId]);

  // Hàm load chi tiết task từ API
  const loadTask = async () => {
    try {
      const response = await apiService.get(`/tasks/${taskId}`);
      const taskData = response.task || response;
      setTask(taskData);
      setStatus(taskData.status);
    } catch (error) {
      setTask(null);
      Alert.alert('Error', 'Failed to load task.');
    }
  };

  // Hàm cập nhật trạng thái task
  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsSavingStatus(true);
      await apiService.put(`/tasks/${taskId}/status`, { status: newStatus });
      setStatus(newStatus);
      setTask((prev) => ({ ...prev, status: newStatus }));
      Alert.alert('Success', 'Status updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Hàm thêm comment mới (chỉ local, chưa gọi API)
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), content: newComment, author: 'You', created_at: new Date().toISOString() }
    ]);
    setNewComment('');
  };

  // Hiển thị loading khi đang tải task
  if (isLoading) {
    return <Loading fullScreen text="Loading task..." />;
  }

  // Nếu không tìm thấy task
  if (!task) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={textStyles.h4}>Task not found</Text>
        <Button title="Retry" onPress={loadTask} />
      </View>
    );
  }

  // Render UI chi tiết task
  return (
    <ScrollView style={commonStyles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.primary,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral.gray100
        }}
      >
        <Button title="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={[textStyles.h4, { marginLeft: spacing.md }]}>Task Detail</Text>
      </View>
      {/* Thông tin task */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.h5}>{task.title}</Text>
        <Text style={textStyles.label}>Description:</Text>
        <Text style={textStyles.body2}>{task.description}</Text>
        <Text style={textStyles.label}>Goal:</Text>
        <Text style={textStyles.body2}>{task.goal_title || task.goal?.name || '-'}</Text>
        {/* Hiển thị phase nếu có */}
        {task.phase_title || task.phase?.title ? (
          <>
            <Text style={textStyles.label}>Phase:</Text>
            <Text style={textStyles.body2}>{task.phase_title || task.phase?.title}</Text>
          </>
        ) : null}
        <Text style={textStyles.label}>Deadline:</Text>
        <Text style={textStyles.body2}>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</Text>
        <Text style={textStyles.label}>Priority:</Text>
        <Text style={textStyles.body2}>{task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : '-'}</Text>
      </View>
      {/* Cập nhật trạng thái */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Status:</Text>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
          {statusOptions.map((opt) => (
            <Button
              key={opt.value}
              title={opt.label}
              variant={status === opt.value ? 'primary' : 'outline'}
              onPress={() => handleStatusUpdate(opt.value)}
              loading={isSavingStatus && status === opt.value}
              style={{ minWidth: 100 }}
            />
          ))}
        </View>
      </View>
      {/* Phần bình luận (comment) */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Comments</Text>
        {comments.length === 0 && <Text style={textStyles.body2}>No comments yet.</Text>}
        {comments.map((comment) => (
          <View key={comment.id} style={{ backgroundColor: colors.background.secondary, borderRadius: 8, padding: spacing.md, marginBottom: spacing.xs }}>
            <Text style={{ fontWeight: 'bold', color: colors.primary.main, marginBottom: 2 }}>{comment.author}</Text>
            <Text style={textStyles.body2}>{comment.content}</Text>
            <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 2 }}>{new Date(comment.created_at).toLocaleString()}</Text>
          </View>
        ))}
        {/* Ô nhập comment mới */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: colors.background.secondary,
              borderRadius: 8,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.neutral.gray100,
              marginRight: spacing.sm
            }}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Send" onPress={handleAddComment} style={{ minWidth: 70 }} />
        </View>
      </View>
      {/* Placeholder cho time tracking */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Time Tracking</Text>
        <Text style={textStyles.body2}>Time tracking will be displayed here.</Text>
      </View>
      {/* Placeholder cho các task liên quan */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Related Tasks</Text>
        {relatedTasks.length === 0 ? (
          <Text style={textStyles.body2}>No related tasks.</Text>
        ) : (
          relatedTasks.map((t) => (
            <Text key={t.id} style={textStyles.body2}>{t.title}</Text>
          ))
        )}
      </View>
      {/* Placeholder cho file đính kèm */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Attachments</Text>
        <Text style={textStyles.body2}>File attachments will be displayed here.</Text>
      </View>
      {/* Placeholder cho dependencies */}
      <View style={{ backgroundColor: colors.background.primary, marginTop: spacing.md, padding: spacing.lg, borderRadius: 8 }}>
        <Text style={textStyles.label}>Dependencies</Text>
        <Text style={textStyles.body2}>Task dependencies will be displayed here.</Text>
      </View>
      {/* Khoảng trống cuối để tránh che nút khi bàn phím mở */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default TaskDetail; 