## 插件载入测试环境 - sql注入和xss攻击的入侵检测插件

Web Basic Environment - Intrusion Detection Plug-In Based On SQL Injection And XSS Attack

纯web靶场环境，详见：[点我跳转](https://github.com/nikoni233/scripts/tree/main/Web_Basic_Environment--Only_Environment--InjDet-Plug-In_Based_XAS-Attack)

---

### ##项目结构##

```
MyNewWeb/
│
├── public/
│   └── index.html           # 前端 HTML 文件（已存在）
│
├── plugins/
│   └── InjectionDetection.js           # 入侵检测中间件（插件，外部导入）
│
├── attackVectors/
│   ├── sqlInjection.json 	# SQL 注入向量库（插件附属文件，外部导入）
│   └── xssInjection.json  	# XSS 注入向量库（插件附属文件，外部导入）
│
├── logs/
│   └── InjDetLogs.json           # 入侵检测的日志（插件运行时产生的日志）
│
├── package.json             # Node.js 项目描述文件（已存在）
└── server.js               # Node.js 服务器主文件（已存在）

```



### ##食用方式##

1. **文件放到项目根目录下。**

2. **安装项目依赖库。**
	参考版本：
	"express": "^4.21.1",
	"sqlite3": "^5.1.7",
	"mysql2": "^3.11.3"

	```shell
	sudo npm install express
	sudo npm install sqlite3
	
	sudo npm install mysql2		# 可选
	```

3. **运行服务端。**

	```shell
	sudo node server.js
	```

4. **浏览器访问页面。**
	打开浏览器，地址栏输入 `http://localhost:3002` 。