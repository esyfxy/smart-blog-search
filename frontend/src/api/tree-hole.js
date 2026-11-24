import http from '../utils/request';

/**
 * 获取树洞消息列表
 * @returns {Promise} 返回树洞消息列表的Promise
 */
export function listTreeHole() {
  return http.get('/webInfo/listTreeHole');
}

/**
 * 保存树洞消息
 * @param {Object} treeHole - 树洞消息对象
 * @param {string} treeHole.message - 消息内容
 * @param {string} [treeHole.avatar] - 头像URL
 * @returns {Promise} 返回保存结果的Promise
 */
export function saveTreeHole(treeHole) {
  return http.post('/webInfo/saveTreeHole', treeHole);
} 