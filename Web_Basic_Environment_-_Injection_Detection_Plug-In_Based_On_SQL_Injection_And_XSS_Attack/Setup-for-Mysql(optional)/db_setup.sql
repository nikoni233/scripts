CREATE DATABASE web_xssANDsql_test_db;

USE web_xssANDsql_test_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    age INT,
    phone VARCHAR(15)
);

INSERT INTO users (username, password, email, age, phone) VALUES
('张三', '123', 'zhangsan@zs.email', 23, '0123456789'),
('李四', '234', 'lisi@ls.email', 19, '0234567891'),
('王五', '345', 'wangwu@ww.email', 28, '0345678912'),
('赵六', '456', 'zhaoliu@zl.email', 30, '0456789123'),
('钱七', '567', 'qianqi@qk.email', 25, '0567891234'),
('孙八', '678', 'sunba@sb.email', 22, '0678912345');

CREATE USER 'web_xssANDsql_test_user'@'%' IDENTIFIED BY 'web123456';
GRANT SELECT, INSERT, UPDATE, DELETE ON web_xssANDsql_test_db.* TO 'web_xssANDsql_test_user'@'%';
FLUSH PRIVILEGES;
