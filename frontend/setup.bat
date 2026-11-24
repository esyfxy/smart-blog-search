@echo off
echo 正在安装项目依赖...
call npm install
if %errorlevel% neq 0 (
  echo 安装依赖失败，请检查Node.js版本是否 >= 16.0.0
  pause
  exit /b 1
)
echo 依赖安装完成！
echo 正在启动开发服务器...
call npm run dev
pause 