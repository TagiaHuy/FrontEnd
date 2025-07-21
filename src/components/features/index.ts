// Export all feature components from a single entry point
export * from './auth';
export * from './goals';
export * from './dashboard';

// Re-export commonly used components for convenience
export { LoginForm, RegisterForm } from './auth';
export { GoalCard } from './goals';
export { StatsCard, QuickActions, TaskList } from './dashboard'; 