// ===============================
// Typography system for the application
// ===============================

// Định nghĩa các thuộc tính typography cơ bản: kích thước chữ, độ đậm, khoảng cách chữ
export const typography = {
  // ===== Font sizes =====
  // Đơn vị: px
  sizes: {
    xs: 10,      // Rất nhỏ (caption, label phụ)
    sm: 12,      // Nhỏ (body3, caption)
    base: 14,    // Mặc định (body2, button)
    lg: 16,      // Lớn (body1, input, label)
    xl: 18,      // Rất lớn (heading nhỏ)
    '2xl': 20,   // Heading vừa
    '3xl': 24,   // Heading lớn
    '4xl': 28,   // Heading rất lớn
    '5xl': 32,   // Heading cực lớn
    '6xl': 36,   // Heading siêu lớn
  },
  
  // ===== Font weights =====
  // Giá trị dạng string để tương thích React Native
  weights: {
    light: '300',      // Nhẹ
    normal: '400',     // Thường
    medium: '500',     // Trung bình
    semibold: '600',   // Đậm vừa
    bold: '700',       // Đậm
    extrabold: '800',  // Siêu đậm
  },
  
  // ===== Letter spacing =====
  // Khoảng cách giữa các ký tự
  letterSpacing: {
    tight: -0.5,   // Hẹp
    normal: 0,     // Mặc định
    wide: 0.5,     // Rộng
  },
} as const;

// ===============================
// Predefined text styles (Các kiểu chữ dựng sẵn)
// ===============================
export const textStyles = {
  // ===== Headings =====
  h1: {
    fontSize: 28,         // Heading lớn nhất
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,         // Heading lớn
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,         // Heading vừa
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,         // Heading nhỏ
    fontWeight: '600',
  },
  h5: {
    fontSize: 16,         // Heading phụ
    fontWeight: '500',
  },
  h6: {
    fontSize: 14,         // Heading phụ nhỏ nhất
    fontWeight: '500',
  },
  
  // ===== Body text =====
  body1: {
    fontSize: 16,         // Đoạn văn bản chính
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,         // Đoạn văn bản phụ
    fontWeight: '400',
  },
  body3: {
    fontSize: 12,         // Đoạn văn bản nhỏ, chú thích
    fontWeight: '400',
  },
  
  // ===== Caption =====
  caption: {
    fontSize: 10,         // Chú thích nhỏ nhất
    fontWeight: '400',
  },
  
  // ===== Button text =====
  button: {
    fontSize: 14,         // Chữ trên nút bấm
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // ===== Input text =====
  input: {
    fontSize: 16,         // Chữ trong ô nhập liệu
    fontWeight: '400',
  },
  
  // ===== Label text =====
  label: {
    fontSize: 16,         // Nhãn cho input, form
    fontWeight: '600',
  },
} as const;

// ===============================
// Kiểu TypeScript cho typography
// ===============================
export type TypographySize = keyof typeof typography.sizes;      // 'xs' | 'sm' | ...
export type TypographyWeight = keyof typeof typography.weights;  // 'light' | 'normal' | ...
export type TextStyle = keyof typeof textStyles;                // 'h1' | 'body1' | ...