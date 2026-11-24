// build.js - 自定义构建脚本
import { execSync } from 'child_process';

try {
  // 执行vite构建
  console.log('开始构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('项目构建完成');
} catch (error) {
  console.error('构建过程中发生错误:', error.message);
  process.exit(1);
} 