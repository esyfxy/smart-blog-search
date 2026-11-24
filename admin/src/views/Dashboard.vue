<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20">
          <div class="user-info">
            <el-avatar :size="80" :src="adminInfo.avatar"></el-avatar>
            <div class="user-info-cont">
              <div class="user-info-name">{{ adminInfo.username }}</div>
              <div>{{ adminInfo.role || '超级管理员' }}</div>
            </div>
          </div>
          <div class="user-info-list">
            <span>上次登录时间：<div class="user-info-time">{{ formatDate(adminInfo.lastLoginTime) }}</div></span>
            <span>上次登录地点：<div class="user-info-location">{{ adminInfo.lastLoginLocation || '未知' }}</div></span>
          </div>
        </el-card>
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>系统信息</span>
            </div>
          </template>
          <el-table :data="sysInfo" style="width: 100%">
            <el-table-column prop="key" label="参数"></el-table-column>
            <el-table-column prop="value" label="值"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon"><User /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ stats.userCount || 0 }}</div>
                  <div>用户数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon"><Document /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ stats.postCount || 0 }}</div>
                  <div>文章数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ stats.commentCount || 0 }}</div>
                  <div>评论数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height: 403px;">
          <template #header>
            <div class="clearfix">
              <span>最近访问</span>
            </div>
          </template>
          <el-table :data="visitData" style="width: 100%">
            <el-table-column prop="ip" label="访问IP"></el-table-column>
            <el-table-column prop="location" label="地点"></el-table-column>
            <el-table-column prop="time" label="访问时间"></el-table-column>
            <el-table-column prop="page" label="访问页面"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { User, Document, ChatDotRound } from '@element-plus/icons-vue';
import { getCurrentAdmin } from '../utils/mainAppBridge';

// 获取HTTP服务
const http = inject('$http');

// 管理员信息
const adminInfo = ref({
  username: '管理员',
  role: '超级管理员',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  lastLoginTime: new Date(),
  lastLoginLocation: '未知'
});

// 系统统计数据
const stats = ref({
  userCount: 0,
  postCount: 0,
  commentCount: 0
});

// 系统信息
const sysInfo = ref([
  { key: '系统版本', value: 'v1.0.0' },
  { key: '运行环境', value: 'Vue 3 + Vite' },
  { key: '上线时间', value: '2023-01-01' },
  { key: '服务器地址', value: 'https://www.roginx.ink' }
]);

// 访问数据
const visitData = ref([]);

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取统计数据
const getStats = async () => {
  if (http) {
    try {
      const res = await http.get('/admin/stats');
      if (res && res.code === 200) {
        stats.value = res.data;
      }
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  }
};

// 获取访问数据
const getVisitData = async () => {
  if (http) {
    try {
      const res = await http.get('/admin/visits');
      if (res && res.code === 200) {
        visitData.value = res.data || [];
      }
    } catch (error) {
      console.error('获取访问数据失败', error);
      // 模拟数据
      visitData.value = [
        { ip: '192.0.2.1', location: '北京', time: '2023-01-01 12:00:00', page: '首页' },
        { ip: '192.0.2.2', location: '上海', time: '2023-01-01 13:00:00', page: '文章页' },
        { ip: '192.0.2.3', location: '广州', time: '2023-01-01 14:00:00', page: '关于页' }
      ];
    }
  }
};

// 页面加载时获取数据
onMounted(() => {
  // 获取管理员信息
  const admin = getCurrentAdmin();
  if (admin && admin.username) {
    adminInfo.value = admin;
  }
  
  // 获取统计数据
  getStats();
  
  // 获取访问数据
  getVisitData();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.mgb20 {
  margin-bottom: 20px;
}
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}
.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}
.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}
.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
  margin-top: 10px;
}
.user-info-list span {
  margin-left: 70px;
}
.user-info-time, .user-info-location {
  display: inline-block;
  margin-left: 10px;
  color: #666;
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}
.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}
.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}
.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.grid-num {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}
</style> 
