### typora+github云笔记，自动上传脚本

**食用方法：**

1. 在运行之前，要先在你的本地生成一对ssh的公钥和秘钥，把公钥配置在你的github账户上。
2. 把`AutoUpdate.bat`和`.gitignore`文件，放到你笔记文件的根目录下，就是跟`.git`在同一目录下。
3. 编辑打开`AutoUpdate.bat`，找到代码其中其中的`git@github.com:你的github用户名/你的仓库名.git`部分，按照所提示的格式，自行更改为自己的仓库链接。
4. 运行。（运行记得把.bat后面的.txt删掉。）
    如果运行报错就把里面的中文注释删掉。

#### 文件：

**（把.txt删掉然后运行）脚本文件：**`AutoUpdate.bat.txt`	（Windows运行，bat文件）

**（手动配置，把.txt删掉）Git配置文件：**`.gitignore.txt`
`.gitignore`是Git配置文件，用于Git提交时，忽视那些你配置的文件。目录也可以。

示例：

```
AutoUpdate.bat
AutoTest.bat
Auto*.bat
你的秘密目录,它是不会被上传到github上的
```



