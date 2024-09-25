### 监测违规IP并封禁的脚本

**项目链接：**[点我，快速访问(github.com)](https://github.com/nikoni233/scripts/tree/main/IP_auto_deny)

---

#### **食用方法：**

1. 把`ip_deny_en.sh`或``ip_deny_zh.sh`下载到你的linux系统中，找一个目录存放。
2. 如果需要设置白名单规则，就把`whiteip.conf`也下载到你的linux系统，和上面的脚本放到同一目录下。然后根据你的需要自行更改其中的信息。
3. 运行脚本。（确保你拥有root权限再运行）
4. 查看运行结果。
	- 控制台输出。
	- 同目录下会生成一个`logipdeny.log`日志文件，里面记录脚本的一切操作，可以查看。
	- `iptables -L`也可以查看脚本所配置的封禁规则。

#### **文件：**

**（英文注释版本）脚本文件：**`ip_deny_en.sh`

**（中文注释版本）脚本文件：**`ip_deny_zh.sh`
要是运行报错就把里面的中文注释删掉，或者换成`_en`版本。

**（手动配置）配置文件：**`whiteip.conf`
IP白名单文件，你在这里添加的IP都不会被脚本识别给ban掉。

**（脚本自动生成）日志文件**：`logipdeny.log`
运行脚本，脚本的一切操作，都记录在这个日志文件中。



#### 更多详细内容：

文档：[notebook/linux、shell、git学习/06.02、SecureLog系统登录日志及相关管理脚本.md at main · nikoni233/notebook (github.com)](https://github.com/nikoni233/notebook/blob/main/linux、shell、git学习/06.02、SecureLog系统登录日志及相关管理脚本.md)





