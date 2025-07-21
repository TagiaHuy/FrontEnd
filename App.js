import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Login from './src/screens/auth/login';
import Register from './src/screens/auth/register';
import ForgotPassword from './src/screens/auth/forgotPassword';
import Dashboard from './src/screens/dashboard/Dashboard';
import Profile from './src/screens/profile/Profile';
import Settings from './src/screens/settings/Settings';
import Analytics from './src/screens/analytics/Analytics';
import GoalsList from './src/screens/goals/GoalsList';
import CreateGoal from './src/screens/goals/CreateGoal';
import GoalDetail from './src/screens/goals/GoalDetail';
import EditGoal from './src/screens/goals/EditGoal';
import CreatePhase from './src/screens/goals/CreatePhase';
import CreateTask from './src/screens/tasks/CreateTask';
import TaskDetail from './src/screens/tasks/TaskDetail';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        // Authenticated stack
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
        // Non-authenticated stack
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

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
