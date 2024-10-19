## server.js 的mysql版本 >> server_mysql.js

项目安装依赖库，参考版本`  "mysql2": "^3.11.3"`

```shell
sudo npm install mysql2
```



## db_setup.sql使用

懒人一键配置 web 依赖数据库。

文件同目录下运行指令：

```shell
sudo mysql -u root -p < db_setup.sql		#安装
sudo mysql -u root -p < db_unsetup.sql	#卸载
```



## server_mysql.js使用

服务端：`server_mysql.js`

使用方法：把 `server_mysql.js` 文件移至项目根目录下，运行下面指令：

```shell
sudo node server_mysql.js
```



  

