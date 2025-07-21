import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { apiService } from '../../services/api';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TaskDetail = ({ navigation, route }) => {
  const { taskId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get(`/tasks/${taskId}`);
      const taskData = response.task || response;
      setTask(taskData);
      setStatus(taskData.status);
      // TODO: Load comments, related tasks, time tracking, attachments, dependencies
    } catch (error) {
      setTask(null);
      Alert.alert('Error', 'Failed to load task.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // TODO: Call API to add comment
    setComments((prev) => [
      ...prev,
      { id: Date.now(), content: newComment, author: 'You', created_at: new Date().toISOString() }
    ]);
    setNewComment('');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTask}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Detail</Text>
      </View>

      {/* Task Information */}
      <View style={styles.section}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{task.description}</Text>
        <Text style={styles.label}>Goal:</Text>
        <Text style={styles.value}>{task.goal_title || task.goal?.name || '-'}</Text>
        {task.phase_title || task.phase?.title ? (
          <>
            <Text style={styles.label}>Phase:</Text>
            <Text style={styles.value}>{task.phase_title || task.phase?.title}</Text>
          </>
        ) : null}
        <Text style={styles.label}>Deadline:</Text>
        <Text style={styles.value}>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</Text>
        <Text style={styles.label}>Priority:</Text>
        <Text style={styles.value}>{task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : '-'}</Text>
      </View>

      {/* Status Update */}
      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.statusButton, status === opt.value && styles.statusButtonSelected]}
              onPress={() => handleStatusUpdate(opt.value)}
              disabled={isSavingStatus}
            >
              <Text style={styles.statusButtonText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Comments</Text>
        {comments.length === 0 && <Text style={styles.value}>No comments yet.</Text>}
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Text style={styles.commentAuthor}>{comment.author}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <Text style={styles.commentDate}>{new Date(comment.created_at).toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.addCommentRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
            <Text style={styles.addCommentButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Tracking Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>Time Tracking</Text>
        <Text style={styles.value}>Time tracking will be displayed here.</Text>
      </View>

      {/* Related Tasks Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>Related Tasks</Text>
        {relatedTasks.length === 0 ? (
          <Text style={styles.value}>No related tasks.</Text>
        ) : (
          relatedTasks.map((t) => (
            <Text key={t.id} style={styles.value}>{t.title}</Text>
          ))
        )}
      </View>

      {/* File Attachments Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>Attachments</Text>
        <Text style={styles.value}>File attachments will be displayed here.</Text>
      </View>

      {/* Dependencies Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>Dependencies</Text>
        <Text style={styles.value}>Task dependencies will be displayed here.</Text>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default TaskDetail; 