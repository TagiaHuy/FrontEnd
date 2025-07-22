// ===============================
// Entry point for all style exports
// ===============================

// Export all style modules for global usage
export * from './colors';      // Bảng màu (color palette)
export * from './typography';  // Kiểu chữ (typography)
export * from './spacing';     // Khoảng cách, border, v.v.
export * from './common';      // Các style dùng chung

// ===============================
// Re-export commonly used items for convenience
// ===============================

// Màu sắc và mapping màu cho mức độ ưu tiên, trạng thái
export { colors, priorityColors, statusColors } from './colors';

// Typography và text styles
export { typography, textStyles } from './typography';

// Spacing, border, margin, padding, v.v.
export { spacing, margins, paddings, gaps, borderRadius, borderWidth } from './spacing';

// Các style chung và hàm tạo style động
export { 
  commonStyles, 
  createShadow, 
  createBorderRadius, 
  createPadding, 
  createMargin 
} from './common'; 