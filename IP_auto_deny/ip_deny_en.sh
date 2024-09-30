#!/bin/bash
#Function: Script to monitor failed login attempts and block offending IPs
#Description: Get the log of failed login attempts in the system log file (/var/log/secure). 
#			  If it meets the blocking rules determined by the script, the IP in the log will be configured to set the blocking rules in iptables.
#			  All operations of the script are recorded in the script log (logipdeny.log).
#			  Blocking rules of the script:
#			  - The number of failed login attempts exceeds the maximum number of allowed error connections set
#			  - Outside the whitelist of the script
#Version: 1.0
#WebLink:https://github.com/nikoni233/scripts/tree/main/IP_auto_deny
#
#
# The Script Basic Parameters
FAILCOUNT=7	# Maximum number of failed login attempts
WHITELIST_FILE="whiteip.conf"	# Whitelist Path
WHITELIST_FILE_DEF="192.168.255.1"	# Default. (if whitelist not exist)
#
#
# Check if secure log exists
LOGDIR=/var/log
ls -l ${LOGDIR}/secure* >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "Secure Log does not exist."
	exit 1
fi
# Check if whitelist file exists
ls -l ${WHITELIST_FILE} >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "$WHITELIST_FILE def:$WHITELIST_FILE_DEF"
	echo "$WHITELIST_FILE_DEF" > $WHITELIST_FILE
fi
LOGFILE="logipdeny.log"	# Script Log path
# Check if log file exists
ls -l ${LOGFILE} >/dev/null 2>&1
if [ "$?" != "0" ];then
	echo "VISITS IP LastVisitTime AddRuleTime" > $LOGFILE
fi
#
#
#Select the secure log file, the user enters file name
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
# Display the IP and failure times of failed login attempts in the console
echo "VISITS IP"
echo "$DENYS" | while read VISITS IP; do
    if echo "$WHITELIST" | grep -q "$IP"; then
    	echo "$VISITS $IP (whitelist)"
    else
    	echo "$VISITS $IP"
    fi
done
# Add the IP that meets the ban rules to the blacklist.
# Record the operation in the script log.
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