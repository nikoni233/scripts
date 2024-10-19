const express = require('express');
const mysql = require('mysql2');

const app = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// <!-- 重定向到 ind3.html -->
// app.get('/', (req, res) => {
//     res.redirect('/ind3.html');
// });
// 提供静态文件
app.use(express.static('public'));

//---------------------xss---------------------------------
// 接收 POST 请求
var content = "";
app.get("/content",(req,res)=>{
    res.send(content)
})

app.post('/setContent',(req,res)=>{
    content=req.body.content
    res.send("OK")
})

//---------------------sql---------------------------------
// 数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'web_xssANDsql_test_user',
    password: 'web123456',
    database: 'web_xssANDsql_test_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
app.post('/login', (req, res) => {
    var sql = `SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`;
    console.log(sql);

    db.query(sql, function (err, data) {
        if (err) {
            console.log(err);
            res.send("查询错误");
            return;
        }
        console.log(data);
        if (data.length > 0) {
            // 登录成功，返回用户信息
            res.json({
                message: "登录成功",
                userInfo: data // 返回查询内容
            });
        } else
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
