// Bảng màu (color palette) cho toàn bộ ứng dụng
export const colors = {
  // Màu chính (Primary colors) - dùng cho các thành phần nổi bật, nút chính
  primary: {
    main: '#007AFF',      // Xanh dương chủ đạo
    light: '#4DA3FF',     // Xanh dương nhạt
    dark: '#0056CC',      // Xanh dương đậm
    contrast: '#FFFFFF',  // Màu chữ nổi bật trên nền primary
  },
  
  // Màu phụ (Secondary colors) - dùng cho các thành phần phụ, nút phụ
  secondary: {
    main: '#6C757D',      // Xám trung tính
    light: '#ADB5BD',     // Xám nhạt
    dark: '#495057',      // Xám đậm
    contrast: '#FFFFFF',  // Màu chữ nổi bật trên nền secondary
  },
  
  // Màu thành công (Success colors) - dùng cho trạng thái thành công, hoàn thành
  success: {
    main: '#28A745',      // Xanh lá cây
    light: '#5CB85C',     // Xanh lá nhạt
    dark: '#1E7E34',      // Xanh lá đậm
    contrast: '#FFFFFF',  // Màu chữ nổi bật trên nền success
  },
  
  // Màu cảnh báo (Warning colors) - dùng cho trạng thái cảnh báo, chú ý
  warning: {
    main: '#FFC107',      // Vàng
    light: '#FFD54F',     // Vàng nhạt
    dark: '#FF8F00',      // Vàng đậm
    contrast: '#212529',  // Màu chữ nổi bật trên nền warning
  },
  
  // Màu lỗi (Error colors) - dùng cho trạng thái lỗi, thất bại
  error: {
    main: '#DC3545',      // Đỏ
    light: '#E57373',     // Đỏ nhạt
    dark: '#C62828',      // Đỏ đậm
    contrast: '#FFFFFF',  // Màu chữ nổi bật trên nền error
  },
  
  // Màu thông tin (Info colors) - dùng cho thông báo, trạng thái thông tin
  info: {
    main: '#17A2B8',      // Xanh cyan
    light: '#4FC3F7',     // Xanh cyan nhạt
    dark: '#0277BD',      // Xanh cyan đậm
    contrast: '#FFFFFF',  // Màu chữ nổi bật trên nền info
  },
  
  // Màu trung tính (Neutral colors) - dùng cho nền, border, text phụ
  neutral: {
    white: '#FFFFFF',     // Trắng
    gray50: '#F8F9FA',    // Xám rất nhạt
    gray100: '#E9ECEF',   // Xám nhạt
    gray200: '#DEE2E6',   // Xám sáng
    gray300: '#CED4DA',   // Xám trung bình
    gray400: '#ADB5BD',   // Xám vừa
    gray500: '#6C757D',   // Xám đậm vừa
    gray600: '#495057',   // Xám đậm
    gray700: '#343A40',   // Xám rất đậm
    gray800: '#212529',   // Gần như đen
    gray900: '#000000',   // Đen
  },
  
  // Màu nền (Background colors) - dùng cho background các màn hình, card, v.v.
  background: {
    primary: '#FFFFFF',   // Nền chính (trắng)
    secondary: '#F8F9FA', // Nền phụ (xám rất nhạt)
    tertiary: '#E9ECEF',  // Nền phụ thứ 3 (xám nhạt)
  },
  
  // Màu chữ (Text colors)
  text: {
    primary: '#212529',   // Màu chữ chính (gần đen)
    secondary: '#6C757D', // Màu chữ phụ (xám)
    tertiary: '#ADB5BD',  // Màu chữ phụ thứ 3 (xám nhạt)
    inverse: '#FFFFFF',   // Màu chữ trên nền tối
  },
  
  // Màu viền (Border colors)
  border: {
    light: '#E9ECEF',     // Viền nhạt
    medium: '#DEE2E6',    // Viền trung bình
    dark: '#CED4DA',      // Viền đậm
  },
  
  // Màu bóng (Shadow colors)
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',   // Bóng rất nhẹ
    medium: 'rgba(0, 0, 0, 0.1)',   // Bóng trung bình
    dark: 'rgba(0, 0, 0, 0.2)',     // Bóng đậm
  },
} as const;

// Mapping màu cho mức độ ưu tiên (Priority colors mapping)
// Dùng cho các task/goal có mức độ ưu tiên: high, medium, low
export const priorityColors = {
  high: colors.error.main,     // Ưu tiên cao: màu đỏ (error)
  medium: colors.warning.main, // Ưu tiên vừa: màu vàng (warning)
  low: colors.success.main,    // Ưu tiên thấp: màu xanh lá (success)
} as const;

// Mapping màu cho trạng thái (Status colors mapping)
// Dùng cho các trạng thái của task/goal: completed, in_progress, not_started
export const statusColors = {
  completed: colors.success.main,     // Đã hoàn thành: xanh lá
  in_progress: colors.primary.main,   // Đang thực hiện: xanh dương
  not_started: colors.secondary.main, // Chưa bắt đầu: xám
} as const;

// Kiểu cho key của bảng màu chính
export type ColorKey = keyof typeof colors;
// Kiểu cho mức độ ưu tiên
export type PriorityLevel = keyof typeof priorityColors;
// Kiểu cho trạng thái
export type StatusType = keyof typeof statusColors; 