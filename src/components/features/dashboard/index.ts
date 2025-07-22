// File index.ts này dùng để export các component và type liên quan đến dashboard (thống kê, hành động nhanh, danh sách task)
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { StatsCard, QuickActions, TaskList } from '@/components/features/dashboard'
export { default as StatsCard } from './StatsCard';
export { default as QuickActions } from './QuickActions';
export { default as TaskList } from './TaskList';
export type { StatsCardProps, StatsData } from './StatsCard';
export type { QuickActionsProps, QuickAction } from './QuickActions';
export type { TaskListProps, Task } from './TaskList'; 