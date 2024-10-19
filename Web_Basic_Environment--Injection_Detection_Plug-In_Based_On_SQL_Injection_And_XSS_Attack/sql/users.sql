
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER NOT NULL,
    phone TEXT NOT NULL
);

INSERT INTO users (username, password, email, age, phone) VALUES
('张三', '123', 'zhangsan@zs.email', 23, '0123456789'),
('李四', '234', 'lisi@ls.email', 19, '0234567891'),
('王五', '345', 'wangwu@ww.email', 28, '0345678912'),
('赵六', '456', 'zhaoliu@zl.email', 30, '0456789123'),
('钱七', '567', 'qianqi@qk.email', 25, '0567891234'),
('孙八', '678', 'sunba@sb.email', 22, '0678912345');
