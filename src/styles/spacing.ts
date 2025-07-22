// ===============================
// Spacing system for the application
// ===============================

// Định nghĩa các giá trị spacing (khoảng cách) dùng cho margin, padding, gap, v.v.
// Đơn vị mặc định là px (pixel)
export const spacing = {
  // Rất nhỏ (4px) - dùng cho khoảng cách nhỏ nhất
  xs: 4,
  // Nhỏ (8px)
  sm: 8,
  // Trung bình (12px)
  md: 12,
  // Lớn (16px)
  lg: 16,
  // Rất lớn (20px)
  xl: 20,
  // Cực lớn (24px)
  '2xl': 24,
  // Siêu lớn (32px)
  '3xl': 32,
  // 40px
  '4xl': 40,
  // 48px
  '5xl': 48,
  // 56px
  '6xl': 56,
  // 64px
  '7xl': 64,
  // 72px
  '8xl': 72,
} as const;

// ===============================
// Margins - Khoảng cách ngoài (margin)
// ===============================
export const margins = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// ===============================
// Paddings - Khoảng cách trong (padding)
// ===============================
export const paddings = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// ===============================
// Gaps - Khoảng cách giữa các phần tử trong flex/grid
// ===============================
export const gaps = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// ===============================
// Border radius - Bo góc
// ===============================
export const borderRadius = {
  // Không bo góc
  none: 0,
  // Bo nhẹ
  sm: 4,
  // Bo trung bình
  md: 8,
  // Bo lớn
  lg: 12,
  // Bo rất lớn
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  // Bo tròn hoàn toàn (dùng cho avatar, badge, v.v.)
  full: 9999,
} as const;

// ===============================
// Border width - Độ dày viền
// ===============================
export const borderWidth = {
  none: 0,    // Không viền
  thin: 1,    // Viền mỏng
  medium: 2,  // Viền trung bình
  thick: 3,   // Viền dày
} as const;

// ===============================
// Shadow offsets - Độ lệch bóng
// ===============================
export const shadowOffset = {
  sm: { width: 0, height: 1 },   // Bóng nhẹ
  md: { width: 0, height: 2 },   // Bóng trung bình
  lg: { width: 0, height: 4 },   // Bóng lớn
  xl: { width: 0, height: 8 },   // Bóng rất lớn
} as const;

// ===============================
// Shadow radius - Độ mờ bóng
// ===============================
export const shadowRadius = {
  sm: 2,      // Bóng nhẹ
  md: 3.84,   // Bóng trung bình
  lg: 8,      // Bóng lớn
  xl: 16,     // Bóng rất lớn
} as const;

// ===============================
// Kiểu type cho các giá trị spacing
// ===============================
export type SpacingSize = keyof typeof spacing;
export type MarginSize = keyof typeof margins;
export type PaddingSize = keyof typeof paddings;
export type GapSize = keyof typeof gaps;
export type BorderRadiusSize = keyof typeof borderRadius;
export type BorderWidthSize = keyof typeof borderWidth;
export type ShadowSize = keyof typeof shadowOffset; 