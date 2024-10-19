const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs'); // 用于读取 SQL 文件

const app = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 引入入侵检测插件
const detectInjection = require('./plugins/InjectionDetection');
app.use(detectInjection);

// <!-- 重定向到 ind3.html -->
// app.get('/', (req, res) => {
//     res.redirect('/ind2.html');
// });
// 提供静态文件
app.use(express.static('public'));

//---------------------xss---------------------------------
// 接收 POST 请求
var content = "";
app.get("/content", (req, res) => {
    res.send(content);
});

app.post('/setContent', (req, res) => {
    content = req.body.content;
    res.send("OK");
});

//---------------------sql---------------------------------
// 使用 SQLite3 连接内存数据库
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error('Error connecting to SQLite database:', err.message);
    }
    console.log('Connected to in-memory SQLite database.');

    // 读取 users.sql 文件中的内容并执行
    const sqlFilePath = './sql/users.sql';
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    db.exec(sqlContent, (err) => {
        if (err) {
            console.error('Error executing SQL script:', err.message);
        } else {
            console.log('Database initialized with users table and data.');
        }
    });
});

// 处理登录请求
app.post('/login', (req, res) => {
    var sql = `SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`;
    const params = [req.body.username, req.body.password];
    console.log(sql);

    db.all(sql,function(err,data){
        if(err){
            console.log(err);
            res.send("查询错误");
            return;
        }
        console.log(data);
        if (data.length > 0){
            // 登录成功，返回用户信息
            res.json({
                message: "登录成功",
                userInfo: data // 返回查询内容
            });
        }else
            // 登录失败
            res.json({
                message: "登录失败",
                userInfo: "登录失败无法查询"
            });
    });
});

// 端口
const port = 3002;
// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
