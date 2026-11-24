#!/bin/bash
echo "正在安装项目依赖..."
npm install
if [ $? -ne 0 ]; then
  echo "安装依赖失败，请检查Node.js版本是否 >= 16.0.0"
  exit 1
fi
echo "依赖安装完成！"
echo "正在启动开发服务器..."
npm run dev 