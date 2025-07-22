// index.js - Entry point của ứng dụng, đăng ký component gốc với Expo
import { registerRootComponent } from 'expo';

import App from './App';

// Hàm này sẽ đăng ký App là component gốc của ứng dụng với Expo hoặc React Native
// registerRootComponent gọi AppRegistry.registerComponent('main', () => App);
// Đảm bảo môi trường được thiết lập đúng khi chạy trên Expo Go hoặc build native
registerRootComponent(App);
