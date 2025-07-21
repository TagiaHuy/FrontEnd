import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import * as ImagePicker from 'react-native-image-picker';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

const Profile = () => {
  const { user, token } = useAuth();
  const { isLoading: isLoadingProfile, withLoading } = useLoading(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    withLoading(loadUserProfile);
  }, []);

  const loadUserProfile = async () => {
    try {
      const profileData = await apiService.get('/user/profile');
      setName(profileData.name || user?.name || '');
      setEmail(profileData.email || user?.email || '');
      setProfileImage(profileData.profileImage || null);
    } catch (error) {
      setName(user?.name || '');
      setEmail(user?.email || '');
    }
  };

  const handleImageUpload = async () => {
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

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Change password functionality will be implemented.',
      [{ text: 'OK' }]
    );
  };

  if (isLoadingProfile) {
    return <Loading fullScreen text="Loading profile..." />;
  }

  return (
    <ScrollView style={commonStyles.container}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[textStyles.h2, { textAlign: 'center', marginBottom: spacing['2xl'] }]}>Profile</Text>
        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
          <View style={{ marginBottom: spacing.md }}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.primary.main }} />
            ) : (
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primary.main, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.primary.main }}>
                <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}
          </View>
          <Button title={isUploading ? 'Uploading...' : 'Change Photo'} onPress={handleImageUpload} loading={isUploading} style={{ borderRadius: 20, paddingHorizontal: 20 }} />
        </View>
        {/* Profile Form */}
        <View style={{ backgroundColor: colors.background.primary, borderRadius: 12, padding: spacing.lg, marginBottom: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }}>
          {/* Name Input */}
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
          {/* Email Display (Read-only) */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={textStyles.label}>Email Address</Text>
            <View style={{ width: '100%', height: 50, borderWidth: 1, borderColor: colors.neutral.gray200, borderRadius: 8, paddingHorizontal: 15, backgroundColor: colors.background.tertiary, justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, color: colors.text.secondary }}>{email}</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 5, fontStyle: 'italic' }}>Email cannot be changed</Text>
          </View>
          {/* Save Button */}
          <Button title={isSaving ? 'Saving...' : 'Save Changes'} onPress={handleSaveProfile} loading={isSaving} style={{ marginTop: 10 }} />
        </View>
        {/* Change Password Section */}
        <View style={{ backgroundColor: colors.background.primary, borderRadius: 12, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }}>
          <Text style={textStyles.h5}>Security</Text>
          <Button title="Change Password" variant="outline" onPress={handleChangePassword} style={{ marginTop: spacing.md }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile; 