# Các lệnh Git thường dùng

## Cấu hình cơ bản
```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

## Khởi tạo và clone repository
```bash
git init                    # Khởi tạo repository mới
git clone <url>            # Clone repository từ remote
```

## Kiểm tra trạng thái và thông tin
```bash
git status                 # Xem trạng thái các file
git log                    # Xem lịch sử commit
git log --oneline          # Xem lịch sử commit ngắn gọn
git diff                   # Xem thay đổi chưa staged
git diff --staged          # Xem thay đổi đã staged
```

## Thêm và commit
```bash
git add <file>             # Thêm file vào staging area
git add .                  # Thêm tất cả file vào staging area
git commit -m "message"    # Commit với message
git commit -am "message"   # Thêm tất cả và commit trong 1 lệnh
```

## Nhánh (Branch)
```bash
git branch                 # Liệt kê các nhánh
git branch <name>          # Tạo nhánh mới
git checkout <branch>      # Chuyển sang nhánh khác
git checkout -b <branch>   # Tạo và chuyển sang nhánh mới
git merge <branch>         # Merge nhánh hiện tại với nhánh khác
git branch -d <branch>     # Xóa nhánh
```

## Remote repository
```bash
git remote -v              # Xem danh sách remote
git remote add origin <url> # Thêm remote repository
git push origin <branch>   # Đẩy code lên remote
git pull origin <branch>   # Lấy code từ remote
git fetch                  # Lấy thông tin từ remote
```

## Lưu trữ tạm thời (Stash)
```bash
git stash                  # Lưu thay đổi tạm thời
git stash list            # Xem danh sách stash
git stash pop             # Lấy thay đổi từ stash
git stash drop            # Xóa stash mới nhất
```

## Hoàn tác thay đổi
```bash
git reset HEAD <file>      # Bỏ staged file
git checkout -- <file>     # Hoàn tác thay đổi chưa staged
git revert <commit>        # Tạo commit mới để hoàn tác commit cũ
```

## Xử lý lỗi và conflict
```bash
# Xử lý lỗi "refusing to merge unrelated histories"
git pull origin <branch> --allow-unrelated-histories

# Xử lý conflict
git status                  # Kiểm tra file đang conflict
git add <file>             # Sau khi sửa conflict, add file
git commit -m "message"    # Commit sau khi resolve conflict

# Hủy merge đang conflict
git merge --abort

# Xem lịch sử merge
git log --merges
```

## Các lệnh hữu ích khác
```bash
git tag                    # Xem danh sách tag
git tag <name>            # Tạo tag mới
git blame <file>          # Xem ai đã thay đổi từng dòng trong file
git clean -n              # Xem các file sẽ bị xóa
git clean -f              # Xóa các file không được theo dõi
```

## Lưu ý
- Luôn kiểm tra `git status` trước khi thực hiện các thao tác
- Commit thường xuyên với message rõ ràng
- Pull code trước khi push để tránh conflict
- Sử dụng branch cho các tính năng mới
- Khi gặp lỗi "unrelated histories", sử dụng flag --allow-unrelated-histories
- Luôn backup code trước khi thực hiện các thao tác merge phức tạp
