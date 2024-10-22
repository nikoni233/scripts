## 【一键部署】sql注入和xss攻击的入侵检测插件的一键部署安装程序



#### ##目录结构##

```
MyNewWeb/
│
├── plugins/
│   └── InjectionDetection.js           # 入侵检测中间件（插件，外部导入）
│
├── attackVectors/
│   ├── sqlInjection.json 	# SQL 注入向量库（插件附属文件，外部导入）
│   └── xssInjection.json  	# XSS 注入向量库（插件附属文件，外部导入）
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

	



