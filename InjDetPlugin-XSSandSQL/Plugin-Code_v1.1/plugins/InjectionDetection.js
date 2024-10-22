const fs = require('fs');
const path = require('path');

// 配置默认封禁时长（以秒为单位）和最大攻击次数
const DEFAULT_BAN_DURATION_SECONDS = 2 * 60 * 20; // 2小时封禁（以秒为单位）
const MAX_ATTACK_COUNT = 10; // 默认最大攻击次数

// 永久黑名单默认内容
const defaultPermBlacklist = [
    "192.168.255.10",
    "203.0.113.5"
];

// 读取向量库
const sqlInjectionPatterns = JSON.parse(fs.readFileSync(path.join(__dirname, '../attackVectors/sqlInjection.json')));
const xssInjectionPatterns = JSON.parse(fs.readFileSync(path.join(__dirname, '../attackVectors/xssInjection.json')));

// 创建日志文件夹
function ensureLogDirectoryExists(logDir) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

// 初始化文件
function initializeFile(filePath, initialContent) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));
    } else {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim() === '') {
            fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));
        }
    }
}

// 初始化永久黑名单
function initializePermBlacklist() {
    const permBlacklistPath = path.join(__dirname, '../blacklists/permBlacklist.json');
    initializeFile(permBlacklistPath, defaultPermBlacklist);
}

// 读取黑名单
function loadBlacklist(type) {
    const blacklistPath = path.join(__dirname, `../blacklists/${type}Blacklist.json`);
    initializeFile(blacklistPath, []); // 初始化为空数组
    return JSON.parse(fs.readFileSync(blacklistPath));
}

// 保存黑名单
function saveBlacklist(type, blacklist) {
    const blacklistPath = path.join(__dirname, `../blacklists/${type}Blacklist.json`);
    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 2));
}

// 检查IP是否在黑名单中并返回封禁类型及时间
function checkBlacklist(ip) {
    const permBlacklist = loadBlacklist('perm');
    const tempBlacklist = loadBlacklist('temp');
    const currentTime = Date.now();

    // 检查永久黑名单
    if (permBlacklist.includes(ip)) {
        return { isBlacklisted: true, type: 'perm' };
    }

    // 检查临时黑名单
    const tempEntry = tempBlacklist.find(entry => entry.ip === ip);
    if (tempEntry) {
        const banDurationMillis = tempEntry.banDuration * 1000; // 封禁时长（毫秒）
        const banEndTime = new Date(tempEntry.bannedAt).getTime() + banDurationMillis;
        if (currentTime < banEndTime) { // 封禁时间未过
            const remainingTime = Math.ceil((banEndTime - currentTime) / 1000); // 剩余时间（秒）
            return { isBlacklisted: true, type: 'temp', remainingTime: remainingTime };
        } else {
            // 封禁时间已过，解除封禁
            const updatedTempBlacklist = tempBlacklist.filter(entry => entry.ip !== ip);
            saveBlacklist('temp', updatedTempBlacklist);
        }
    }
    return { isBlacklisted: false };
}

// 记录攻击行为的IP次数，并在必要时加入临时黑名单
function recordAttackAttempt(ip) {
    const logDir = path.join(__dirname, '../logs');
    const attackCountPath = path.join(logDir, 'attackCount.json');
    initializeFile(attackCountPath, {});

    const attackCounts = JSON.parse(fs.readFileSync(attackCountPath));
    const currentTime = Date.now();

    if (!attackCounts[ip]) {
        attackCounts[ip] = { count: 1, firstAttempt: currentTime };
    } else {
        const firstAttemptTime = attackCounts[ip].firstAttempt;
        if (currentTime - firstAttemptTime < 60 * 60 * 1000) { // 在一小时内
            attackCounts[ip].count++;
        } else {
            attackCounts[ip] = { count: 1, firstAttempt: currentTime };
        }
    }

    // 如果攻击次数超过MAX_ATTACK_COUNT次，将其加入临时黑名单
    if (attackCounts[ip].count >= MAX_ATTACK_COUNT) {
        const banDuration = DEFAULT_BAN_DURATION_SECONDS * 1000; // 封禁时长（毫秒）
        const unbanAt = new Date(currentTime + banDuration).toISOString(); // 计算解封时间

        const tempBlacklist = loadBlacklist('temp');
        tempBlacklist.push({
            ip: ip,
            bannedAt: new Date().toISOString(),
            banDuration: DEFAULT_BAN_DURATION_SECONDS, // 封禁时长（秒）
            unbanAt: unbanAt // 解封时间
        });
        saveBlacklist('temp', tempBlacklist);
        delete attackCounts[ip]; // 重置攻击次数
    }

    fs.writeFileSync(attackCountPath, JSON.stringify(attackCounts, null, 2));
}

// 日志记录函数
function logAttack(type, ip, input) {
    const logDir = path.join(__dirname, '../logs');
    const logPath = path.join(logDir, 'InjDetLogs.json');
    
    ensureLogDirectoryExists(logDir);
    initializeFile(logPath, []);

    let currentLogs = [];
    try {
        currentLogs = JSON.parse(fs.readFileSync(logPath));
    } catch (err) {
        console.error('日志文件解析出错:', err);
        currentLogs = [];
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

    // 初始化永久黑名单（如果不存在）
    initializePermBlacklist();

    // 检查IP是否在黑名单中
    const blacklistCheck = checkBlacklist(userIp);
    if (blacklistCheck.isBlacklisted) {
        if (blacklistCheck.type === 'perm') {
            return res.status(403).send('你已被永久封禁，请联系管理员');
        } else if (blacklistCheck.type === 'temp') {
            return res.status(403).send(`你已被封禁，剩余 ${blacklistCheck.remainingTime} 秒，请稍后再试或联系管理员`);
        }
    }

    // 检测SQL注入
    for (const pattern of sqlInjectionPatterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(userInput)) {
            logAttack('SQL Injection', userIp, userInput);
            recordAttackAttempt(userIp); // 记录攻击尝试
            return res.status(400).send('SQL Injection detected');
        }
    }

    // 检测XSS注入
    for (const pattern of xssInjectionPatterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(userInput)) {
            logAttack('XSS Injection', userIp, userInput);
            recordAttackAttempt(userIp); // 记录攻击尝试
            return res.status(400).send('XSS Injection detected');
        }
    }

    // 如果没有检测到注入，记录正常日志
    logAttack('Normal', userIp, userInput);
    next();
}

module.exports = detectInjection;
