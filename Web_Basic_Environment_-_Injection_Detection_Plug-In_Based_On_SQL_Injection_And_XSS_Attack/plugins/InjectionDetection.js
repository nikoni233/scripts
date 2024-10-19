const fs = require('fs');
const path = require('path');

// 读取向量库
const sqlInjectionPatterns = JSON.parse(fs.readFileSync(path.join(__dirname, '../attackVectors/sqlInjection.json')));
const xssInjectionPatterns = JSON.parse(fs.readFileSync(path.join(__dirname, '../attackVectors/xssInjection.json')));

// 初始化日志文件
function initializeLogFile(logPath) {
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, JSON.stringify([])); // 初始化空数组作为日志
    } else {
        const fileContent = fs.readFileSync(logPath, 'utf-8');
        if (fileContent.trim() === '') {
            fs.writeFileSync(logPath, JSON.stringify([])); // 如果文件为空，初始化为空数组
        }
    }
}

// 日志记录函数
function logAttack(type, ip, input) {
    const logPath = path.join(__dirname, '../logs/InjDetLogs.json');
    initializeLogFile(logPath); // 确保日志文件已初始化

    let currentLogs = [];
    try {
        currentLogs = JSON.parse(fs.readFileSync(logPath));
    } catch (err) {
        console.error('日志文件解析出错:', err);
        currentLogs = []; // 如果解析失败，重新初始化为空数组
    }

    const logEntry = {
        time: new Date().toISOString(),
        type: type,
        ip: ip,
        input: input
    };

    currentLogs.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(currentLogs, null, 2));
}

// 检测函数
function detectInjection(req, res, next) {
    const userInput = JSON.stringify(req.body) + JSON.stringify(req.query);
    const userIp = req.ip;

    // 检测SQL注入
    for (const pattern of sqlInjectionPatterns) {
        if (userInput.includes(pattern)) {
            logAttack('SQL Injection', userIp, userInput);
            return res.status(400).send('SQL Injection detected');
        }
    }

    // 检测XSS注入
    for (const pattern of xssInjectionPatterns) {
        if (userInput.includes(pattern)) {
            logAttack('XSS Injection', userIp, userInput);
            return res.status(400).send('XSS Injection detected');
        }
    }

    // 如果没有检测到注入，记录正常日志
    logAttack('Normal', userIp, userInput);
    next();
}

module.exports = detectInjection;
