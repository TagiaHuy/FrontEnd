// File index.ts này dùng để export các UI component và type liên quan
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { Button, Input, Card } from '@/components/ui'

// Export các UI component
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as ProgressBar } from './ProgressBar';
export { default as Loading } from './Loading';

// Export các type của UI component
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';
export type { CardProps } from './Card';
export type { BadgeProps } from './Badge';
export type { ProgressBarProps } from './ProgressBar';
export type { LoadingProps } from './Loading'; 