// Profile.tsx - Màn hình hồ sơ người dùng (User Profile Screen)

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import * as ImagePicker from 'react-native-image-picker';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

// Component chính cho màn hình Profile
const Profile = () => {
  // Lấy thông tin user và token từ context
  const { user, token } = useAuth();
  // Hook loading cho profile
  const { isLoading: isLoadingProfile, withLoading } = useLoading(true);

  // State cho các trường thông tin hồ sơ
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load thông tin hồ sơ khi mount component
  useEffect(() => {
    withLoading(loadUserProfile);
  }, []);

  // Hàm lấy thông tin hồ sơ từ API
  const loadUserProfile = async () => {
    try {
      const profileData = await apiService.get('/user/profile');
      setName(profileData.name || user?.name || '');
      setEmail(profileData.email || user?.email || '');
      setProfileImage(profileData.profileImage || null);
    } catch (error) {
      // Nếu lỗi thì fallback về thông tin user trong context
      setName(user?.name || '');
      setEmail(user?.email || '');
    }
  };

  // Hàm xử lý upload/chọn ảnh đại diện mới
  const handleImageUpload = async () => {
    // Sử dụng ImagePicker để chọn ảnh từ thư viện
    ImagePicker.launchImageLibrary({ mediaType: 'photo', includeBase64: true }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image.');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (!asset || !asset.base64) {
        Alert.alert('Error', 'No image selected.');
        return;
      }
      setIsUploading(true);
      try {
        // Chuẩn bị dữ liệu ảnh base64 để gửi lên server
        const updateData = {
          profileImage: `data:${asset.type};base64,${asset.base64}`,
        };
        await apiService.put('/user/profile', updateData);
        setProfileImage(updateData.profileImage);
        Alert.alert('Success', 'Profile photo updated!');
      } catch (e) {
        Alert.alert('Error', 'Failed to upload photo.');
      } finally {
        setIsUploading(false);
      }
    });
  };

  // Hàm xử lý lưu thông tin hồ sơ (chỉ cho phép đổi tên)
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setIsSaving(true);
    try {
      const updateData = { name: name.trim() };
      await apiService.put('/user/profile', updateData);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Hàm xử lý đổi mật khẩu (chưa implement)
  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Change password functionality will be implemented.',
      [{ text: 'OK' }]
    );
  };

  // Hiển thị loading khi đang lấy thông tin hồ sơ
  if (isLoadingProfile) {
    return <Loading fullScreen text="Loading profile..." />;
  }

  // Render UI màn hình hồ sơ
  return (
    <ScrollView style={commonStyles.container}>
      <View style={{ padding: spacing.lg }}>
        {/* Tiêu đề màn hình */}
        <Text style={[textStyles.h2, { textAlign: 'center', marginBottom: spacing['2xl'] }]}>Profile</Text>
        {/* Khu vực ảnh đại diện */}
        <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
          <View style={{ marginBottom: spacing.md }}>
            {profileImage ? (
              // Nếu có ảnh đại diện thì hiển thị ảnh
              <Image source={{ uri: profileImage }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.primary.main }} />
            ) : (
              // Nếu chưa có ảnh thì hiển thị ký tự đầu tên
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primary.main, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.primary.main }}>
                <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}
          </View>
          {/* Nút đổi/chọn ảnh đại diện */}
          <Button title={isUploading ? 'Uploading...' : 'Change Photo'} onPress={handleImageUpload} loading={isUploading} style={{ borderRadius: 20, paddingHorizontal: 20 }} />
        </View>
        {/* Form thông tin hồ sơ */}
        <View style={{ backgroundColor: colors.background.primary, borderRadius: 12, padding: spacing.lg, marginBottom: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }}>
          {/* Trường nhập tên */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={textStyles.label}>Full Name</Text>
            <TextInput
              style={{ width: '100%', height: 50, borderWidth: 1, borderColor: colors.neutral.gray200, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: colors.background.secondary }}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          {/* Hiển thị email (không cho sửa) */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={textStyles.label}>Email Address</Text>
            <View style={{ width: '100%', height: 50, borderWidth: 1, borderColor: colors.neutral.gray200, borderRadius: 8, paddingHorizontal: 15, backgroundColor: colors.background.tertiary, justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, color: colors.text.secondary }}>{email}</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 5, fontStyle: 'italic' }}>Email cannot be changed</Text>
          </View>
          {/* Nút lưu thay đổi */}
          <Button title={isSaving ? 'Saving...' : 'Save Changes'} onPress={handleSaveProfile} loading={isSaving} style={{ marginTop: 10 }} />
        </View>
        {/* Khu vực đổi mật khẩu */}
        <View style={{ backgroundColor: colors.background.primary, borderRadius: 12, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }}>
          <Text style={textStyles.h5}>Security</Text>
          {/* Nút đổi mật khẩu */}
          <Button title="Change Password" variant="outline" onPress={handleChangePassword} style={{ marginTop: spacing.md }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile; 