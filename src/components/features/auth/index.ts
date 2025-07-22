// File index.ts này dùng để export các component liên quan đến authentication (đăng nhập/đăng ký)
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { LoginForm, RegisterForm } from '@/components/features/auth'
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
export type { LoginFormProps, LoginFormData } from './LoginForm';
export type { RegisterFormProps, RegisterFormData } from './RegisterForm'; 