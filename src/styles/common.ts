import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing, borderRadius, borderWidth, shadowOffset, shadowRadius } from './spacing';
import { textStyles } from './typography';

// Các style dùng chung cho toàn bộ ứng dụng
export const commonStyles = StyleSheet.create({
  // ===== Layout =====
  // Container chính, chiếm toàn bộ màn hình, nền trắng
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Container cho ScrollView, cho phép scroll hết nội dung
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Căn giữa nội dung cả theo chiều dọc và ngang
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Hiển thị các phần tử theo hàng ngang, căn giữa theo chiều dọc
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Hàng ngang, căn giữa theo chiều dọc, hai đầu cách đều
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Hàng ngang, căn giữa cả hai chiều
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ===== Card =====
  // Thẻ card mặc định, có bóng vừa
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow.medium,
    shadowOffset: shadowOffset.md,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.md,
    elevation: 5,
  },
  
  // Card nhẹ, bóng nhẹ hơn, padding nhỏ hơn
  cardLight: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.shadow.light,
    shadowOffset: shadowOffset.sm,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.sm,
    elevation: 2,
  },
  
  // ===== Button =====
  // Nút chính (primary)
  button: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Nút phụ (secondary)
  buttonSecondary: {
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Nút viền (outline)
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: borderWidth.thin,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Nút bị disable
  buttonDisabled: {
    backgroundColor: colors.neutral.gray300,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ===== Input =====
  // Ô nhập liệu mặc định
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  // Ô nhập liệu khi focus
  inputFocused: {
    backgroundColor: colors.background.primary,
    borderWidth: borderWidth.medium,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  // Ô nhập liệu khi có lỗi
  inputError: {
    backgroundColor: colors.background.primary,
    borderWidth: borderWidth.medium,
    borderColor: colors.error.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  // ===== Label =====
  // Nhãn cho input, form
  label: {
    ...textStyles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  // ===== Badge =====
  // Huy hiệu (badge) mặc định
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Badge nhỏ
  badgeSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ===== Progress Bar =====
  // Thanh tiến trình nền
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  
  // Phần fill của progress bar
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  // ===== Divider =====
  // Đường kẻ ngang chia cách
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  
  // Đường kẻ dọc chia cách
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  
  // ===== Loading =====
  // Container loading, căn giữa
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  
  // ===== Empty State =====
  // Container hiển thị khi không có dữ liệu
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  
  // ===== Shadow =====
  // Bóng nhẹ
  shadowLight: {
    shadowColor: colors.shadow.light,
    shadowOffset: shadowOffset.sm,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.sm,
    elevation: 2,
  },
  
  // Bóng vừa
  shadowMedium: {
    shadowColor: colors.shadow.medium,
    shadowOffset: shadowOffset.md,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.md,
    elevation: 5,
  },
  
  // Bóng đậm
  shadowHeavy: {
    shadowColor: colors.shadow.dark,
    shadowOffset: shadowOffset.lg,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.lg,
    elevation: 8,
  },
});

// ===== Các hàm helper cho style động =====

// Hàm tạo style bóng động theo size ('light' | 'medium' | 'heavy')
// Trả về object style bóng phù hợp
export const createShadow = (size: 'light' | 'medium' | 'heavy' = 'medium') => {
  const shadowConfigs = {
    light: {
      shadowColor: colors.shadow.light,
      shadowOffset: shadowOffset.sm,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.sm,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.shadow.medium,
      shadowOffset: shadowOffset.md,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.md,
      elevation: 5,
    },
    heavy: {
      shadowColor: colors.shadow.dark,
      shadowOffset: shadowOffset.lg,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.lg,
      elevation: 8,
    },
  };
  
  return shadowConfigs[size];
};

// Hàm tạo borderRadius động theo size ('sm', 'md', 'lg', ...)
export const createBorderRadius = (size: keyof typeof borderRadius = 'md') => {
  return { borderRadius: borderRadius[size] };
};

// Hàm tạo padding động theo size ('sm', 'md', 'lg', ...)
export const createPadding = (size: keyof typeof spacing = 'md') => {
  return { padding: spacing[size] };
};

// Hàm tạo margin động theo size ('sm', 'md', 'lg', ...)
export const createMargin = (size: keyof typeof spacing = 'md') => {
  return { margin: spacing[size] };
}; 