###

- Những điểm cần cải thiện:

* Thời gian tìm hiểm typescript typeorm và kết nối với mysql ở tyeorm chưa nhiều.
* Code typescript chưa được tối ưu.
* CreatedAt and UpdatedAt trong model Task chưa được xử lý ở type Date()
* Chưa validate entity trong typeorm

#### Setup

## Deploy source code in local PC

```bash
npm install
npm start
port: 2000
```

#### Database Connection

```Tạo client connection in mysql
[] Vào terminal của window
[] Gõ: mysql -u root -p
[] Nhập password
[] Tạo New Account: gõ vào termial (thay thế [newuser] và [password] tùy ý)
```

[] CREATE USER 'newuser'@'localhost' IDENTIFIED WITH mysql*native_password BY 'password';
[] GRANT ALL PRIVILEGES ON *.\_ TO ‘newuser’@'localhost';
[] FLUSH PRIVILEGES;
[] quit;

```
[] connection vào MySQL Workbench bằng account vừa tạo
```

```Tạo database
[] CREATE SCHEMA `todo-api` ;
[] Tạo bảng User
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);
[] Tạo bảng task
CREATE TABLE `task` (
  `description` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `status` enum('new','complete') NOT NULL DEFAULT 'new',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `dateComplete` varchar(255) NOT NULL,
  `createdAt` varchar(255) NOT NULL,
  `updatedAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
);
```
