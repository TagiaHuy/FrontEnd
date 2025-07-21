import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const Settings = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Load settings from API
      // const userSettings = await apiService.get('/user/settings');
      // setSettings(userSettings);
      
      // For now, use default settings
      console.log('Loading settings...');
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (category: string, key: string, value: any) => {
    try {
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
      };
      setSettings(newSettings);

      // TODO: Update settings via API
      // await apiService.put('/user/settings', { [category]: { [key]: value } });
      console.log(`Updated ${category}.${key}:`, value);
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  const handleThemeChange = (theme: string) => {
    updateSetting('theme', 'theme', theme);
  };

  const handleLanguageChange = (language: string) => {
    updateSetting('language', 'language', language);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Please type "DELETE" to confirm account deletion:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: performDeleteAccount,
        },
      ]
    );
  };

  const performDeleteAccount = async () => {
    try {
      // TODO: Implement account deletion API call
      // await apiService.delete('/user/account');
      
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  const SettingItem = ({ title, subtitle, children, onPress = null }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem title="Push Notifications" subtitle="Receive push notifications">
            <Switch
              value={settings.notifications.pushNotifications}
              onValueChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={settings.notifications.pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem title="Email Notifications" subtitle="Receive email notifications">
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={settings.notifications.emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem title="Marketing Emails" subtitle="Receive promotional emails">
            <Switch
              value={settings.notifications.marketingEmails}
              onValueChange={(value) => updateSetting('notifications', 'marketingEmails', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={settings.notifications.marketingEmails ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <SettingItem 
            title="Profile Visibility" 
            subtitle={settings.privacy.profileVisibility === 'public' ? 'Public' : 'Private'}
            onPress={() => {
              const newValue = settings.privacy.profileVisibility === 'public' ? 'private' : 'public';
              updateSetting('privacy', 'profileVisibility', newValue);
            }}
          >
            <Text style={styles.settingValue}>
              {settings.privacy.profileVisibility === 'public' ? 'Public' : 'Private'}
            </Text>
          </SettingItem>

          <SettingItem title="Show Email" subtitle="Display email to other users">
            <Switch
              value={settings.privacy.showEmail}
              onValueChange={(value) => updateSetting('privacy', 'showEmail', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={settings.privacy.showEmail ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem title="Allow Messages" subtitle="Allow other users to message you">
            <Switch
              value={settings.privacy.allowMessages}
              onValueChange={(value) => updateSetting('privacy', 'allowMessages', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={settings.privacy.allowMessages ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Theme Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingItem 
            title="Theme" 
            subtitle="Choose your preferred theme"
            onPress={() => {
              const themes = ['light', 'dark', 'auto'];
              const currentIndex = themes.indexOf(settings.theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              handleThemeChange(nextTheme);
            }}
          >
            <Text style={styles.settingValue}>
              {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
            </Text>
          </SettingItem>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          
          <SettingItem 
            title="Language" 
            subtitle="Choose your preferred language"
            onPress={() => {
              const languages = ['en', 'vi', 'es', 'fr'];
              const currentIndex = languages.indexOf(settings.language);
              const nextLanguage = languages[(currentIndex + 1) % languages.length];
              handleLanguageChange(nextLanguage);
            }}
          >
            <Text style={styles.settingValue}>
              {settings.language === 'en' ? 'English' : 
               settings.language === 'vi' ? 'Tiếng Việt' :
               settings.language === 'es' ? 'Español' :
               settings.language === 'fr' ? 'Français' : 'English'}
            </Text>
          </SettingItem>
        </View>

        {/* Account Deletion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem 
            title="Delete Account" 
            subtitle="Permanently delete your account and all data"
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </SettingItem>
        </View>
      </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '500',
  },
});

export default Settings; 