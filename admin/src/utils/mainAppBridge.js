/**
 * 主应用桥接工具
 * 用于在子应用中访问主应用的状态和方法
 */

// 获取主应用的store
export const getMainStore = () => {
  return window.mainStore || null;
};

// 获取主应用的工具
export const getMainUtils = () => {
  return window.mainUtils || null;
};

// 获取主应用的HTTP服务
export const getHttp = () => {
  const mainUtils = getMainUtils();
  return mainUtils?.http || null;
};

// 获取主应用的常量
export const getConstant = () => {
  const mainUtils = getMainUtils();
  return mainUtils?.constant || null;
};

// 获取主应用的通用工具
export const getCommon = () => {
  const mainUtils = getMainUtils();
  return mainUtils?.common || null;
};

// 获取当前管理员信息
export const getCurrentAdmin = () => {
  const mainStore = getMainStore();
  return mainStore?.state?.currentAdmin || {};
};

// 设置当前管理员信息
export const setCurrentAdmin = (admin) => {
  const mainStore = getMainStore();
  if (mainStore) {
    // 检查是否为Pinia store
    if (mainStore.loadCurrentAdmin) {
      // Pinia store直接调用action
      mainStore.loadCurrentAdmin(admin);
    } else if (mainStore.commit) {
      // Vuex store使用commit
      mainStore.commit('loadCurrentAdmin', admin);
    } else if (mainStore.state) {
      // 直接设置状态
      mainStore.state.currentAdmin = admin;
    }
  }
};

// 跳转到主应用
export const navigateToMainApp = (path = '/') => {
  window.location.href = path;
};

// 检查是否在微前端环境中运行
export const isInQiankun = () => {
  return window.__POWERED_BY_QIANKUN__ === true;
};

export default {
  getMainStore,
  getMainUtils,
  getHttp,
  getConstant,
  getCommon,
  getCurrentAdmin,
  setCurrentAdmin,
  navigateToMainApp,
  isInQiankun
}; 