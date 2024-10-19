## sql注入和xss攻击的入侵检测插件

Intrusion Detection Plug-In Based On SQL Injection And XSS Attack

---

载入插件的测试环境：Environment-and-Plugin-Web_Test(OLD)

无插件的靶场测试环境：Environment-Web_Test

插件源代码：Plugin-Code

插件一键部署安装程序：Plugin-Install



---

### 插件安装

手动部署 或 一键部署安装程序。详见 `Plugin-Install` 目录。



---

### 测试环境

靶场web服务器采用前后端分离，后端采用node.js运行。



---

### 插件目录结构

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
