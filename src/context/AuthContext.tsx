// AuthContext.tsx - Context quản lý trạng thái xác thực (authentication) toàn app
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa kiểu dữ liệu User
interface User {
  id: number;
  name: string;
  email: string;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null; // Thông tin user hiện tại (nếu đã đăng nhập)
  token: string | null; // Token xác thực (JWT hoặc tương tự)
  isLoading: boolean; // Đang kiểm tra trạng thái đăng nhập hay không
  login: (userData: User, authToken: string) => Promise<void>; // Hàm đăng nhập
  logout: () => Promise<void>; // Hàm đăng xuất
  isAuthenticated: boolean; // Đã đăng nhập hay chưa
}

// Tạo context với giá trị mặc định là undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider bọc quanh app để cung cấp trạng thái xác thực
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State lưu thông tin user, token, trạng thái loading
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Khi app khởi động, load thông tin xác thực từ AsyncStorage
    loadStoredAuth();
  }, []);

  // Hàm load thông tin xác thực từ AsyncStorage (nếu có)
  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng nhập: lưu thông tin user và token vào AsyncStorage và state
  const login = async (userData: User, authToken: string) => {
    try {
      // Lưu vào AsyncStorage
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // Cập nhật state
      setToken(authToken);
      setUser(userData);
      
      console.log('Auth data stored successfully');
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  // Hàm đăng xuất: xoá thông tin xác thực khỏi AsyncStorage và state
  const logout = async () => {
    try {
      // Xoá khỏi AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      // Xoá khỏi state
      setToken(null);
      setUser(null);
      
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Giá trị context cung cấp cho các component con
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  // Trả về Provider bọc quanh children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 