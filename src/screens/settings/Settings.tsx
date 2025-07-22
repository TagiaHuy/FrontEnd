// Settings.tsx - Màn hình cài đặt cho người dùng

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Button, Loading } from '../../components/ui';
import { colors, spacing, textStyles, commonStyles } from '../../styles';
import { useLoading } from '../../hooks/useLoading';

// Component chính cho màn hình Settings
const Settings = () => {
  const { logout } = useAuth();
  // Hook loading cho màn hình settings
  const { isLoading, withLoading } = useLoading(true);

  // State lưu trữ các cài đặt của người dùng
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowMessages: true,
    },
    theme: 'light',
    language: 'en',
  });

  // Load settings khi mount component
  useEffect(() => {
    withLoading(loadSettings);
  }, []);

  // Hàm lấy settings từ API (chưa implement)
  const loadSettings = async () => {
    // TODO: Load settings from API
  };

  // Hàm cập nhật một setting cụ thể
  const updateSetting = async (category: string, key: string, value: any) => {
    try {
      // Tạo object settings mới với giá trị cập nhật
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
      };
      setSettings(newSettings);
      // TODO: Update settings via API
    } catch (error) {
      // Nếu lỗi, giữ nguyên settings cũ
      setSettings(settings);
    }
  };

  // Xử lý đổi theme
  const handleThemeChange = (theme: string) => {
    updateSetting('theme', 'theme', theme);
  };

  // Xử lý đổi ngôn ngữ
  const handleLanguageChange = (language: string) => {
    updateSetting('language', 'language', language);
  };

  // Xử lý khi bấm xóa tài khoản
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDeleteAccount },
      ]
    );
  };

  // Xác nhận xóa tài khoản lần cuối
  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Please type "DELETE" to confirm account deletion:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Account', style: 'destructive', onPress: performDeleteAccount },
      ]
    );
  };

  // Hàm thực hiện xóa tài khoản (chưa gọi API thật)
  const performDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion API call
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  // Component hiển thị từng mục cài đặt
  const SettingItem = ({ title, subtitle, children, onPress = null }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.gray100
    }}>
      <View style={{ flex: 1 }}>
        <Text style={textStyles.body2}>{title}</Text>
        {subtitle && <Text style={{ color: colors.text.secondary, fontSize: 14 }}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  // Hiển thị loading khi đang tải settings
  if (isLoading) {
    return <Loading fullScreen text="Loading settings..." />;
  }

  // Render UI màn hình cài đặt
  return (
    <ScrollView style={commonStyles.container}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[textStyles.h2, { textAlign: 'center', marginBottom: spacing['2xl'] }]}>Settings</Text>
        {/* Notification Settings - Cài đặt thông báo */}
        <View style={{
          backgroundColor: colors.background.primary,
          borderRadius: 12,
          marginBottom: spacing.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text style={[textStyles.h5, { padding: spacing.lg, paddingBottom: spacing.md }]}>Notifications</Text>
          {/* Bật/tắt thông báo đẩy */}
          <SettingItem title="Push Notifications" subtitle="Receive push notifications">
            <Switch
              value={settings.notifications.pushNotifications}
              onValueChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              trackColor={{ false: '#767577', true: colors.primary.main }}
              thumbColor={settings.notifications.pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
          {/* Bật/tắt thông báo email */}
          <SettingItem title="Email Notifications" subtitle="Receive email notifications">
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              trackColor={{ false: '#767577', true: colors.primary.main }}
              thumbColor={settings.notifications.emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
          {/* Bật/tắt email marketing */}
          <SettingItem title="Marketing Emails" subtitle="Receive promotional emails">
            <Switch
              value={settings.notifications.marketingEmails}
              onValueChange={(value) => updateSetting('notifications', 'marketingEmails', value)}
              trackColor={{ false: '#767577', true: colors.primary.main }}
              thumbColor={settings.notifications.marketingEmails ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>
        {/* Privacy Settings - Cài đặt quyền riêng tư */}
        <View style={{
          backgroundColor: colors.background.primary,
          borderRadius: 12,
          marginBottom: spacing.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text style={[textStyles.h5, { padding: spacing.lg, paddingBottom: spacing.md }]}>Privacy</Text>
          {/* Chuyển đổi chế độ hiển thị hồ sơ */}
          <SettingItem
            title="Profile Visibility"
            subtitle={settings.privacy.profileVisibility === 'public' ? 'Public' : 'Private'}
          >
            <Button
              title={settings.privacy.profileVisibility === 'public' ? 'Public' : 'Private'}
              variant="outline"
              onPress={() => {
                const newValue = settings.privacy.profileVisibility === 'public' ? 'private' : 'public';
                updateSetting('privacy', 'profileVisibility', newValue);
              }}
              style={{ minWidth: 80 }}
            />
          </SettingItem>
          {/* Bật/tắt hiển thị email */}
          <SettingItem title="Show Email" subtitle="Display email to other users">
            <Switch
              value={settings.privacy.showEmail}
              onValueChange={(value) => updateSetting('privacy', 'showEmail', value)}
              trackColor={{ false: '#767577', true: colors.primary.main }}
              thumbColor={settings.privacy.showEmail ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
          {/* Bật/tắt cho phép nhắn tin */}
          <SettingItem title="Allow Messages" subtitle="Allow other users to message you">
            <Switch
              value={settings.privacy.allowMessages}
              onValueChange={(value) => updateSetting('privacy', 'allowMessages', value)}
              trackColor={{ false: '#767577', true: colors.primary.main }}
              thumbColor={settings.privacy.allowMessages ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>
        {/* Theme Preferences - Cài đặt giao diện */}
        <View style={{
          backgroundColor: colors.background.primary,
          borderRadius: 12,
          marginBottom: spacing.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text style={[textStyles.h5, { padding: spacing.lg, paddingBottom: spacing.md }]}>Appearance</Text>
          {/* Chọn theme */}
          <SettingItem
            title="Theme"
            subtitle="Choose your preferred theme"
          >
            <Button
              title={settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
              variant="outline"
              onPress={() => {
                // Chuyển đổi giữa các theme: light, dark, auto
                const themes = ['light', 'dark', 'auto'];
                const currentIndex = themes.indexOf(settings.theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                handleThemeChange(nextTheme);
              }}
              style={{ minWidth: 80 }}
            />
          </SettingItem>
        </View>
        {/* Language Settings - Cài đặt ngôn ngữ */}
        <View style={{
          backgroundColor: colors.background.primary,
          borderRadius: 12,
          marginBottom: spacing.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text style={[textStyles.h5, { padding: spacing.lg, paddingBottom: spacing.md }]}>Language</Text>
          {/* Chọn ngôn ngữ */}
          <SettingItem
            title="Language"
            subtitle="Choose your preferred language"
          >
            <Button
              title={
                settings.language === 'en'
                  ? 'English'
                  : settings.language === 'vi'
                  ? 'Tiếng Việt'
                  : settings.language === 'es'
                  ? 'Español'
                  : settings.language === 'fr'
                  ? 'Français'
                  : 'English'
              }
              variant="outline"
              onPress={() => {
                // Chuyển đổi giữa các ngôn ngữ: en, vi, es, fr
                const languages = ['en', 'vi', 'es', 'fr'];
                const currentIndex = languages.indexOf(settings.language);
                const nextLanguage = languages[(currentIndex + 1) % languages.length];
                handleLanguageChange(nextLanguage);
              }}
              style={{ minWidth: 80 }}
            />
          </SettingItem>
        </View>
        {/* Account Deletion - Xóa tài khoản */}
        <View style={{
          backgroundColor: colors.background.primary,
          borderRadius: 12,
          marginBottom: spacing.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text style={[textStyles.h5, { padding: spacing.lg, paddingBottom: spacing.md }]}>Account</Text>
          {/* Nút xóa tài khoản */}
          <SettingItem
            title="Delete Account"
            subtitle="Permanently delete your account and all data"
          >
            <Button title="Delete" variant="danger" onPress={handleDeleteAccount} />
          </SettingItem>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings; 