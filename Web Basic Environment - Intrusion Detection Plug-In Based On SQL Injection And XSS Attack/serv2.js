const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// 重定向到 ind2.html
app.get('/', (req, res) => {
    res.redirect('/ind2.html');
});
// 提供静态文件
app.use(express.static('public'));

//---------------------xss---------------------------------
// 接收 POST 请求
var content = "";
app.get("/content",(req,res)=>{
    // 解决方案：
    // res.send(escape(content))
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
        if (data.length > 0)
            res.send("登录成功");
        else
            res.send("登录失败");
    });
});


// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
