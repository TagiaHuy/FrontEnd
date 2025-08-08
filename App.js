// App.js - Entry point của ứng dụng React Native, cấu hình navigation và context

import React from 'react';
// Import các thư viện điều hướng
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import thanh trạng thái Expo
import { StatusBar } from 'expo-status-bar';
// Import context xác thực và hook
import { AuthProvider, useAuth } from './src/context/AuthContext';
// Import các màn hình authentication
import Login from './src/screens/auth/login';
import Register from './src/screens/auth/register';
import ForgotPassword from './src/screens/auth/forgotPassword';
// Import các màn hình chính của app
import Dashboard from './src/screens/dashboard/Dashboard';
import Profile from './src/screens/profile/Profile';
import Settings from './src/screens/settings/Settings';
import Analytics from './src/screens/analytics/Analytics';
// Import các màn hình liên quan đến goals
import GoalsList from './src/screens/goals/GoalsList';
import CreateGoal from './src/screens/goals/CreateGoal';
import GoalDetail from './src/screens/goals/GoalDetail';
import EditGoal from './src/screens/goals/EditGoal';
import CreatePhase from './src/screens/phases/CreatePhase';
// Import các màn hình liên quan đến tasks
import CreateTask from './src/screens/tasks/CreateTask';
import TaskDetail from './src/screens/tasks/TaskDetail';
import { GoalProvider } from './src/context/GoalContext';

// Khởi tạo Stack Navigator
const Stack = createNativeStackNavigator();

// Component điều hướng chính của app
const AppNavigator = () => {
  // Lấy trạng thái xác thực và loading từ context
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Có thể thêm màn hình loading ở đây nếu muốn
    return null;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        // Stack cho user đã đăng nhập
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={Profile}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={Settings}
            options={{ title: 'Settings' }}
          />
          <Stack.Screen 
            name="Analytics" 
            component={Analytics}
            options={{ title: 'Analytics' }}
          />
          <Stack.Screen 
            name="GoalsList" 
            component={GoalsList}
            options={{ title: 'Goals' }}
          />
          <Stack.Screen 
            name="CreateGoal" 
            component={CreateGoal}
            options={{ title: 'Create Goal' }}
          />
          <Stack.Screen 
            name="GoalDetail" 
            component={GoalDetail}
            options={{ title: 'Goal Detail' }}
          />
          <Stack.Screen 
            name="EditGoal" 
            component={EditGoal}
            options={{ title: 'Edit Goal' }}
          />
          <Stack.Screen 
            name="CreatePhase" 
            component={CreatePhase}
            options={{ title: 'Create Phase' }}
          />
          <Stack.Screen 
            name="CreateTask" 
            component={CreateTask}
            options={{ title: 'Create Task' }}
          />
          <Stack.Screen 
            name="TaskDetail" 
            component={TaskDetail}
            options={{ title: 'Task Detail' }}
          />
        </>
      ) : (
        // Stack cho user chưa đăng nhập
        <>
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="Register" 
            component={Register}
            options={{ title: 'Register' }}
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPassword}
            options={{ title: 'Forgot Password' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Component gốc của ứng dụng, bọc toàn bộ app với AuthProvider và NavigationContainer
export default function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </GoalProvider>
    </AuthProvider>
  );
}
