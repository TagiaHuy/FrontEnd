// File index.ts này dùng để export các component và type liên quan đến features (tính năng chính)
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { LoginForm, GoalCard, StatsCard } from '@/components/features'

export * from './auth';
export * from './goals';
export * from './dashboard';

// Export các component phổ biến để import trực tiếp
export { LoginForm, RegisterForm } from './auth';
export { GoalCard } from './goals';
export { StatsCard, QuickActions, TaskList } from './dashboard'; 