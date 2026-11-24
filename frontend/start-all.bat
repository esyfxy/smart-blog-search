@echo off
echo 正在启动主应用和子应用...

start cmd /k "cd %~dp0 && npm run dev"
start cmd /k "cd %~dp0..\ablaze-admin && npm run dev"

echo 应用启动完成！
echo 主应用: http://localhost:9000
echo 子应用: http://localhost:8090
echo 访问管理后台: http://localhost:9000/admin

pause 