## 【代码文件】sql注入和xss攻击的入侵检测插件

#### ##简述##

```javascript
/*
名字：基础xss攻击和sql注入的入侵检测插件
版本：v1.1
更新日期：2024/10/22
更新日志：在原有功能（向量库、日志）的基础上，新增功能（黑名单规则限制访问）。

描述：一个通过部署在web服务器上的插件，对网站中的xss注入和sql注入攻击进行识别和拦截。
功能：向量库(xss,sql)、日志、黑名单(永久,临时)[新增]
功能详细介绍：
xss攻击向量库、sql攻击向量库：调用向量库的数据进行精准识别拦截。
入侵检测日志：记录每次访问请求的检测结果。
临时黑名单、永久黑名单：通过黑名单规则限制，阻止违规/指定ip进行页面访问。
*/
```



#### ##目录结构##

```
MyNewWeb/
│
│
├── plugins/
│   └── InjectionDetection.js         # 入侵检测插件（插件核心文件，外部导入）
│
├── attackVectors/
│   ├── sqlInjection.json             # SQL注入向量库（插件附属文件，向量库文件，外部导入）
│   └── xssInjection.json             # XSS注入向量库（插件附属文件，向量库文件，外部导入）
│
├── logs/
│   └── InjDetLogs.json               # 插件生成的日志文件（插件运行时产生的日志）
│
├── blacklists/
│   ├── tempBlacklist.json            # 临时黑名单文件（插件附属文件，黑名单文件，自动生成/外部导入）
│   └── permBlacklist.json            # 永久黑名单文件（插件附属文件，黑名单文件，自动生成/外部导入）
│
```



#### ##食用方式##

1. **部署插件文件。**

	- **方法一：将代码文件手动部署到项目根目录下。**

	- **方法二：使用一键部署的安装程序。**

		（1）将安装程序 `install_injDetPlugin.js` 和组件包 `injDet_package.zip` 下载到你的项目根目录下。

		（2）安装程序依赖 `unzipper` 运行。
		```shell
		sudo npm install unzipper
		```

		（3）执行安装程序，根据程序引导，一键部署到项目文件中。
		```shell
		sudo node install_injDetPlugin.js
		```

		（4）卸载插件。
		```shell
		sudo node uninstall_injDetPlugin.js
		```

		

2. **在你的服务端 `server.js` 中引入插件。**

	```javascript
	// 引入入侵检测插件
	const detectInjection = require('./plugins/InjectionDetection');
	app.use(detectInjection);
	```

	



