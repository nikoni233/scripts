#!/bin/bash
#功能：	监测违规IP并封禁的脚本
#描述：	本脚本旨在，运行后自动从系统日志文件（/var/log/secure）中获取，外部主机发送ssh请求的错误连接的次数与相应的IP，判断是否符合脚本的封禁规则。
#		若符合脚本的封禁规则，则将该IP配置到iptables中并设置禁止规则，以达到该外部主机不能再发送ssh请求连接。最后，把脚本的运行操作保存在脚本日志（logipdeny.log）中。
#		脚本的封禁规则：
#		- 尝试登录失败次数超过大于设定的允许最大错误连接次数
#		- 在脚本的白名单之外
#版本： 1.0
#https://github.com/nikoni233/scripts/tree/main/IP_auto_deny
#注：（如果运行有问题就把中文注释删掉）（或者用_en版本）
#
# 基础参数
FAILCOUNT=7	# 允许最大错误连接次数
WHITELIST_FILE="whiteip.conf"	# 白名单文件路径
WHITELIST_FILE_DEF="192.168.255.1"	# 默认参数。（如果白名单文件不存在）
#
#
# 检查secure日志文件是否存在
LOGDIR=/var/log
ls -l ${LOGDIR}/secure* >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "Secure Log does not exist."
	exit 1
fi
# 检查白名单文件是否存在
ls -l ${WHITELIST_FILE} >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "$WHITELIST_FILE def:$WHITELIST_FILE_DEF"
	echo "$WHITELIST_FILE_DEF" > $WHITELIST_FILE
fi
LOGFILE="logipdeny.log"	# 脚本日志路径
# 检查白名单文件是否存在
ls -l ${LOGFILE} >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "VISITS IP LastVisitTime AddRuleTime" > $LOGFILE
fi
#
#
#列出所有的secure日志文件，让用户选择
LOGNAME=`ls ${LOGDIR} -l | grep secure | awk '{print $NF}' | xargs`
echo "$(hostname) Secure Log Name Is: " ${LOGNAME}
while true; do
    read -p "Please Input Log Name Is: " LOG_NAME
    if [ ! -f "${LOGDIR}/$LOG_NAME" ];then
        echo "File does not exist, re-enter."
    else
        break
    fi
done
#
WHITELIST=$(cat ${WHITELIST_FILE})
DENYS=$(more ${LOGDIR}/${LOG_NAME} | grep -i "failed" | awk -F "from" '{print $2}' | awk '{print $1}' | sed '/^$/d' | sort | uniq -c | awk '$1 >= $FAILCOUNT {print $1, $2}')
DENYS_NUM=$(echo "$DENYS" | wc -l)
#echo -e "VISITS IP\n$DENYS"
#
# 在控制台显示连接失败的IP与连接次数
echo "VISITS IP"
echo "$DENYS" | while read VISITS IP; do
    if echo "$WHITELIST" | grep -q "$IP"; then
    	echo "$VISITS $IP (whitelist)"
    else
    	echo "$VISITS $IP"
    fi
done
# 把符合封禁规则的IP配置在iptables中并设置禁止规则；
# 把脚本操作保存到脚本日志文件中。
echo "$DENYS" | while read VISITS IP; do
    if echo "$WHITELIST" | grep -q "$IP"; then
        echo "$IP is in the whitelist, skipping."
	elif iptables -L OUTPUT -v -n | grep -q "$IP"; then
        echo "$IP already exists."
    else
		iptables -A INPUT -d $IP -j DROP
		#iptables -A INPUT -p tcp -d $IP --dport 22 -j REJECT
		echo "$IP has been added."
		LATEST_DATE=$(cat ${LOGDIR}/${LOG_NAME} | grep -i "failed" | grep "from" | grep "$IP" | awk '{print $1, $2, $3}' | tail -n 1)
		echo "$VISITS $IP $LATEST_DATE [ $(date) ]" >> $LOGFILE
    fi
done
echo "Script completed.[ $(date) ]" >> $LOGFILE