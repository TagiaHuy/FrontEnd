import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

// ApiService: Lớp tiện ích để gọi API backend với xử lý token tự động
class ApiService {
  private baseURL: string;

  // Khởi tạo với baseURL lấy từ biến môi trường
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Lấy headers cho request, tự động thêm Authorization nếu có token
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Gửi request GET tới endpoint
  async get(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse(response);
  }

  // Gửi request POST tới endpoint với dữ liệu data
  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Gửi request PUT tới endpoint với dữ liệu data
  async put(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Gửi request DELETE tới endpoint
  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse(response);
  }

  // Xử lý response trả về từ API, tự động clear token nếu 401
  private async handleResponse(response: Response) {
    const data = await response.json();
    
    if (response.ok) {
      // Trả về dữ liệu nếu thành công
      return data;
    } else {
      // Xử lý lỗi xác thực (token hết hạn hoặc không hợp lệ)
      if (response.status === 401) {
        // Xóa token và userData khỏi AsyncStorage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
        // Có thể điều hướng về màn hình đăng nhập tại đây nếu muốn
      }
      // Ném lỗi với message từ API hoặc message mặc định
      throw new Error(data.message || 'API request failed');
    }
  }
}

// Tạo instance dùng chung cho toàn app
export const apiService = new ApiService(); 