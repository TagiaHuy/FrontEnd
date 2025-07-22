// File index.ts này dùng để export các component và type liên quan đến goals (mục tiêu)
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { GoalCard, GoalFilters } from '@/components/features/goals'

export { default as GoalCard } from './GoalCard';
export { default as GoalFilters } from './GoalFilters';
export type { GoalCardProps, Goal } from './GoalCard';
export type { GoalFiltersProps, FilterState } from './GoalFilters'; 