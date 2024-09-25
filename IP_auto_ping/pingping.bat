@echo off
setlocal enabledelayedexpansion

set "input_file=ipip.txt"
set "output_file=reachable_ips.txt"
set "reachable_ips="
set "count=0"

rem 逐行读取文件中的 IP 地址
for /f "delims=" %%i in (%input_file%) do (
    echo Pinging %%i...
    ping -n 1 %%i >nul
    if !errorlevel! == 0 (
        set "reachable_ips=!reachable_ips! %%i"
        set /a count+=1
    )
)

rem 输出能 ping 通的 IP 数量和具体 IP 地址
echo.
echo Total reachable IPs: !count!
echo Reachable IPs: 
for %%j in (!reachable_ips!) do echo %%j

rem 将能 ping 通的 IP 地址保存到文件
(
    for %%j in (!reachable_ips!) do (
        echo %%j
    )
) > %output_file%
echo Reachable IPs have been saved to %output_file%.



endlocal

timeout /t 10