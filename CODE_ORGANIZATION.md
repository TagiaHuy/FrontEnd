### 1. Thư mục chính

- **app/**  
  Chứa toàn bộ mã nguồn ứng dụng, bao gồm các màn hình (screens), routes, layouts, và logic chính của app.
    Dưới đây là giải thích cấu trúc file và thư mục trong thư mục `app` của dự án:

    ---

    ### 1. **_layout.tsx**
    - Đây là file layout gốc cho toàn bộ ứng dụng hoặc cho một nhóm route.
    - Định nghĩa cấu trúc giao diện chung (header, footer, theme, navigation...) cho các màn hình con bên trong.
    - Thường dùng để bọc các màn hình con với các provider hoặc layout chung.

    ---

    ### 2. **+not-found.tsx**
    - Đây là file xử lý khi người dùng truy cập vào một route không tồn tại (404 Not Found).
    - Hiển thị thông báo lỗi và thường có nút để quay về trang chủ hoặc trang hợp lệ khác.

    ---

    ### 3. **(main)/**
    - Thư mục này thường chứa các màn hình chính (main screens) của ứng dụng.
    - Có thể là các màn hình như: Trang chủ, Danh sách công việc, Thống kê, Hồ sơ cá nhân, v.v.
    - Dấu ngoặc đơn `(main)` là convention của Expo Router để nhóm các route lại với nhau mà không ảnh hưởng đến URL.

    ---

    ### 4. **(tabs)/**
    - Thư mục này chứa các màn hình được điều hướng bằng tab (tab navigation).
    - Thường có các file như: `index.tsx` (tab Home), `explore.tsx` (tab Explore), và `_layout.tsx` (định nghĩa cấu trúc tab bar).
    - Dấu ngoặc đơn `(tabs)` cũng là convention của Expo Router để nhóm các route dạng tab.

    ---

    ### **Tóm lại:**
    - **`_layout.tsx`**: Layout chung cho các màn hình con.
    - **`+not-found.tsx`**: Trang báo lỗi khi truy cập route không tồn tại.
    - **`(main)/`**: Nhóm các màn hình chính của app.
    - **`(tabs)/`**: Nhóm các màn hình điều hướng theo tab.

- **components/**  
  Chứa các React components có thể tái sử dụng ở nhiều nơi trong ứng dụng (ví dụ: button, input, modal...).

  1. Thư mục `ui/`:
  - Đây là thư mục con chứa các component UI cơ bản
  - Thường được sử dụng để tổ chức các component UI tái sử dụng

  2. Các file component chính:

  - `Collapsible.tsx` (1.3KB):
    - Component có thể mở rộng/thu gọn
    - Thường dùng cho các phần nội dung có thể ẩn/hiện

  - `ExternalLink.tsx` (713B):
    - Component để xử lý các liên kết bên ngoài
    - Có thể bao gồm các tính năng như mở link trong trình duyệt

  - `HapticTab.tsx` (564B):
    - Component tab có phản hồi xúc giác (haptic feedback)
    - Dùng cho điều hướng tab trong ứng dụng

  - `HelloWave.tsx` (939B):
    - Component hiển thị animation chào mừng
    - Có thể là một hiệu ứng wave hoặc animation đơn giản

  - `ParallaxScrollView.tsx` (2.1KB):
    - Component scroll view có hiệu ứng parallax
    - Tạo hiệu ứng cuộn với các layer di chuyển với tốc độ khác nhau

  - `ThemedText.tsx` (1.3KB):
    - Component text có theme
    - Xử lý hiển thị text với các style theo theme của ứng dụng

  - `ThemedView.tsx` (468B):
    - Component view có theme
    - Xử lý hiển thị view với các style theo theme của ứng dụng

- **hooks/**  
  Chứa các custom React hooks (ví dụ: useAuth, useTheme) để tái sử dụng logic.

    Thư mục `hooks` chứa các custom React hooks được sử dụng trong dự án, cụ thể:

    1. `useColorScheme.ts` (47B):
    - Hook cơ bản để lấy color scheme của hệ thống
    - File này rất nhỏ (47B) có thể là một file stub hoặc interface định nghĩa

    2. `useColorScheme.web.ts` (480B):
    - Phiên bản web của hook useColorScheme
    - Chứa logic để xử lý color scheme trên nền tảng web
    - Kích thước lớn hơn (480B) cho thấy có nhiều logic xử lý hơn

    3. `useThemeColor.ts` (536B):
    - Hook để quản lý và sử dụng màu sắc theo theme
    - Có thể cung cấp các hàm tiện ích để lấy màu sắc từ theme
    - Kích thước 536B cho thấy có nhiều logic xử lý theme

- **constants/**  
  Chứa các hằng số, cấu hình chung, giá trị mặc định dùng xuyên suốt ứng dụng.

    1. `Colors.ts` (750B):
    - File định nghĩa các màu sắc được sử dụng trong ứng dụng
    - Kích thước 750B cho thấy có nhiều định nghĩa màu sắc
    - Đây là nơi tập trung tất cả các giá trị màu sắc để:
      - Dễ dàng quản lý và thay đổi
      - Đảm bảo tính nhất quán trong toàn bộ ứng dụng
      - Hỗ trợ việc thay đổi theme

    Cấu trúc này cho thấy:
    - Dự án tổ chức các hằng số vào một thư mục riêng để dễ quản lý
    - Tập trung vào việc quản lý màu sắc một cách có hệ thống
    - Có thể hỗ trợ nhiều theme khác nhau thông qua việc định nghĩa màu sắc tập trung

- **assets/**  
  Chứa các tài nguyên tĩnh như hình ảnh, fonts, icons...

- **.expo/**  
  Thư mục hệ thống của Expo, chứa cache và các file cấu hình tạm thời (không cần quan tâm khi phát triển).

- **node_modules/**  
  Chứa toàn bộ các thư viện (dependencies) mà bạn đã cài đặt qua npm/yarn.

- **.vscode/**  
  Chứa các cấu hình dành riêng cho Visual Studio Code (settings, extensions...).

- **scripts/**  
  Chứa các script tiện ích phục vụ build, deploy, hoặc các tác vụ tự động khác.

---

### 2. File cấu hình & quản lý

- **package.json**  
  File cấu hình chính của dự án Node.js/React Native. Khai báo dependencies, scripts, metadata của project.

- **package-lock.json**  
  Ghi lại chính xác phiên bản các dependencies đã cài đặt, giúp đảm bảo đồng nhất môi trường khi cài đặt lại.

- **tsconfig.json**  
  Cấu hình cho TypeScript (nếu dùng TypeScript), quy định cách biên dịch mã nguồn.

- **app.json**  
  File cấu hình cho Expo (tên app, icon, splash screen, quyền truy cập...).

- **eslint.config.js**  
  Cấu hình cho ESLint, giúp kiểm tra và chuẩn hóa style code.

- **expo-env.d.ts**  
  Định nghĩa các type cho môi trường Expo, giúp TypeScript hiểu rõ hơn về các biến môi trường.

- **.gitignore**  
  Khai báo các file/thư mục không cần đưa lên hệ thống quản lý mã nguồn Git (ví dụ: node_modules, .expo...).

---

### 3. File tài liệu

- **README.md**  
  Tài liệu hướng dẫn tổng quan về dự án, cách cài đặt, chạy, và các thông tin quan trọng khác.

- **BEST_PRACTICES.md**  
  Tài liệu tổng hợp các best practices (thực hành tốt nhất) khi phát triển dự án.

- **CODE_ORGANIZATION.md**  
  Tài liệu hướng dẫn chi tiết về cách tổ chức và quản lý mã nguồn trong dự án.

