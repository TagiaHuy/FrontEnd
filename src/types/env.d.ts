// Định nghĩa các biến môi trường được import từ @env (sử dụng cho react-native-dotenv)
// Thêm biến mới tại đây nếu bạn thêm vào file .env
declare module '@env' {
  // Đường dẫn cơ sở của API backend
  export const API_BASE_URL: string;
  // Thời gian timeout cho request API (ms)
  export const API_TIMEOUT: string;
} 