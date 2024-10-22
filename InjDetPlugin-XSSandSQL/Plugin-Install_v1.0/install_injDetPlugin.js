const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper'); // 需要安装 unzipper
const readline = require('readline');

// 插件ZIP文件路径
const zipFilePath = path.join(__dirname, 'injDet_package.zip'); // 假设你的压缩文件名为 injDet_package.zip
const targetDir = __dirname; // 目标目录为当前目录

// 卸载脚本的路径
const uninstallScriptPath = path.join(__dirname, 'uninstall_injDetPlugin.js');

// 创建一个安装过程的提示
function promptInstall(rl) {
    rl.question('确定要安装入侵检测插件吗？(y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            installPlugin(rl);
        } else {
            console.log('取消安装。');
            rl.close();
        }
    });
}

// 安装插件
function installPlugin(rl) {
    fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: targetDir }))
        .on('close', () => {
            console.log('插件安装成功！');
            console.log(`插件文件已解压到 ${targetDir}`);
            createUninstallScript(); // 安装完成后创建卸载脚本
            rl.close(); // 关闭 readline 接口
        })
        .on('error', (err) => {
            console.error('安装过程中出错:', err);
            rl.close(); // 关闭 readline 接口
        });
}

// 创建卸载脚本
function createUninstallScript() {
    const uninstallScriptContent = `
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 要删除的文件和目录路径
const sqlInjectionFilePath = path.join(__dirname, 'attackVectors', 'sqlInjection.json');
const xssInjectionFilePath = path.join(__dirname, 'attackVectors', 'xssInjection.json');
const injectionDetectionFilePath = path.join(__dirname, 'plugins', 'InjectionDetection.js');
const attackVectorsDir = path.join(__dirname, 'attackVectors');
const pluginsDir = path.join(__dirname, 'plugins');
const uninstallScriptPath = path.join(__dirname, 'uninstall_injDetPlugin.js');

// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 确认提示
function promptUninstall() {
    rl.question('确定要卸载入侵检测插件吗？(y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            uninstallPlugin();
        } else {
            console.log('取消卸载。');
            rl.close();
        }
    });
}

// 删除文件和目录的函数
function uninstallPlugin() {
    console.log('正在卸载入侵检测插件...');

    // 删除 sqlInjection.json
    if (fs.existsSync(sqlInjectionFilePath)) {
        fs.unlinkSync(sqlInjectionFilePath);
        console.log(\`已删除文件: \${sqlInjectionFilePath}\`);
    }

    // 删除 xssInjection.json
    if (fs.existsSync(xssInjectionFilePath)) {
        fs.unlinkSync(xssInjectionFilePath);
        console.log(\`已删除文件: \${xssInjectionFilePath}\`);
    }

    // 删除 InjectionDetection.js
    if (fs.existsSync(injectionDetectionFilePath)) {
        fs.unlinkSync(injectionDetectionFilePath);
        console.log(\`已删除文件: \${injectionDetectionFilePath}\`);
    }

    // 检查并删除 attackVectors 目录（如果为空）
    if (fs.existsSync(attackVectorsDir) && isDirectoryEmpty(attackVectorsDir)) {
        fs.rmdirSync(attackVectorsDir);
        console.log(\`已删除空目录: \${attackVectorsDir}\`);
    }

    // 检查并删除 plugins 目录（如果为空）
    if (fs.existsSync(pluginsDir) && isDirectoryEmpty(pluginsDir)) {
        fs.rmdirSync(pluginsDir);
        console.log(\`已删除空目录: \${pluginsDir}\`);
    }

    // 删除卸载脚本
    if (fs.existsSync(uninstallScriptPath)) {
        fs.unlinkSync(uninstallScriptPath);
        console.log(\`已删除卸载脚本: \${uninstallScriptPath}\`);
    }

    console.log('插件卸载完成。');
    rl.close(); // 关闭 readline 接口
}

// 判断目录是否为空
function isDirectoryEmpty(directoryPath) {
    return fs.readdirSync(directoryPath).length === 0;
}

// 检查是否需要卸载
promptUninstall();
`;

    // 写入卸载脚本
    fs.writeFileSync(uninstallScriptPath, uninstallScriptContent.trim());
    console.log('已生成卸载脚本: ' + uninstallScriptPath);
}

// 检查插件文件是否存在
if (fs.existsSync(zipFilePath)) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    promptInstall(rl); // 传递 rl 到函数
} else {
    console.error('找不到插件文件，请确保 injDet_package.zip 存在于项目根目录。');
}
