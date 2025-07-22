// babel.config.js - Cấu hình Babel cho dự án React Native sử dụng Expo và dotenv
module.exports = function(api) {
  // Bật cache để tăng tốc độ build
  api.cache(true);
  return {
    // Sử dụng preset của Expo
    presets: ['babel-preset-expo'],
    plugins: [
      // Cấu hình plugin để import biến môi trường từ file .env
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true
      }]
    ]
  };
}; 