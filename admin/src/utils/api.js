import http from './request';
import constant from './constant';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

/**
 * 获取正确的API前缀
 * 在微前端环境中，避免重复的/api前缀
 */
const getApiPrefix = () => {
  // 在微前端环境中，主应用已经有/api前缀，子应用不需要再添加
  // if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  //   return '';
  // }
  // 非微前端环境，使用常量中定义的baseURL
  return constant.baseURL;
};

/**
 * API接口封装
 */
const api = {
  /**
   * 获取键值对
   * @param {Object} data - 包含 key 的对象
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  kv: {
    getValue(data) {
      return http.get(`${getApiPrefix()}/kv/key-value/query`, data, false, true);
    },

    /**
     * 设置键值对
     * @param {Object} data - 包含 key 和 value 的对象
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    setValue(data) {
      return http.post(`${getApiPrefix()}/kv/key-value`, data, false, true, true);
    },

    /**
     * 删除键值对
     * @param {Object} data - 包含 id 的对象
     * @returns {Promise} - HTTP DELETE请求的Promise对象
     */
    deleteValue(data) {
      return http.delete(`${getApiPrefix()}/kv/key-value/${data.id}`, {}, false, true);
    },

    /**
     * 获取键值对列表
     * @param {Object} data - 查询条件
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    getList(data) {
      return http.get(`${getApiPrefix()}/kv/key-value`, data, false, true);
    }
  },

  /**
   * 管理员相关接口
   */
  admin: {
    /**
     * 管理员登录
     * @param {Object} data - 登录信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    login(data) {
      // 使用旧系统的登录接口
      return http.post(`${getApiPrefix()}/user/login`, {
        account: data.account || data.username,
        password: data.password,
        isAdmin: true
      }, true);
    },

    /**
     * 获取管理员信息
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    getInfo() {
      return http.get(`${getApiPrefix()}/admin/info`, {}, true);
    }
  },

  /**
   * 用户管理相关接口
   */
  user: {
    /**
     * 获取用户列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getList(params) {
      return http.post(`${getApiPrefix()}/admin/user/list`, params, true);
    },

    /**
     * 修改用户状态
     * @param {Object} params - 用户ID和状态标志
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    changeStatus(params) {
      return http.get(`${getApiPrefix()}/admin/user/changeUserStatus`, params, true);
    },

    /**
     * 修改用户类型
     * @param {Object} data - 用户ID和类型信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    changeType(data) {
      return http.post(`${getApiPrefix()}/admin/user/changeUserType`, data, true);
    }
  },

  /**
   * 文章管理相关接口
   */
  article: {
    /**
     * 获取文章列表（普通管理员）
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getUserList(params) {
      return http.post(`${getApiPrefix()}/admin/article/user/list`, params, true);
    },

    /**
     * 获取文章列表（超级管理员）
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getBossList(params) {
      return http.post(`${getApiPrefix()}/admin/article/boss/list`, params, true);
    },

    /**
     * 修改文章状态
     * @param {Object} params - 文章ID和状态信息
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    changeStatus(params) {
      return http.get(`${getApiPrefix()}/admin/article/changeArticleStatus`, params, true);
    },

    /**
     * 删除文章
     * @param {Object} params - 文章ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    delete(params) {
      return http.get(`${getApiPrefix()}/article/deleteArticle`, params, true);
    },

    /**
     * 获取文章详情
     * @param {Object} params - 文章ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    getDetail(params) {
      return http.get(`${getApiPrefix()}/article/getArticleById`, params, true);
    },

    /**
     * 保存文章
     * @param {Object} data - 文章信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    save(data) {
      return http.post(`${getApiPrefix()}/article/saveArticle`, data, true);
    }
  },

  /**
   * 评论管理相关接口
   */
  comment: {
    /**
     * 获取评论列表（普通管理员）
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getUserList(params) {
      return http.post(`${getApiPrefix()}/admin/comment/user/list`, params, true);
    },

    /**
     * 获取评论列表（超级管理员）
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getBossList(params) {
      return http.post(`${getApiPrefix()}/admin/comment/boss/list`, params, true);
    },

    /**
     * 删除评论（普通管理员）
     * @param {Object} params - 评论ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    userDelete(params) {
      return http.get(`${getApiPrefix()}/admin/comment/user/deleteComment`, params, true);
    },

    /**
     * 删除评论（超级管理员）
     * @param {Object} params - 评论ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    bossDelete(params) {
      return http.get(`${getApiPrefix()}/admin/comment/boss/deleteComment`, params, true);
    }
  },

  /**
   * 分类和标签相关接口
   */
  category: {
    /**
     * 获取所有分类和标签
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    getSortAndLabel() {
      return new Promise((resolve, reject) => {
        http.get(`${getApiPrefix()}/webInfo/listSortAndLabel`)
          .then(res => {
            // 确保返回的数据格式正确
            if (res && res.data) {
              resolve({
                code: res.code || 200,
                data: res.data,
                message: res.message || '获取成功'
              });
            } else {
              resolve({
                code: res.code || 200,
                data: { sorts: [], labels: [], collections: [] },
                message: res.message || '暂无数据'
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    /**
     * 获取分类列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getSortList(params) {
      return http.post(`${getApiPrefix()}/admin/sort/list`, params, true);
    },

    /**
     * 添加分类
     * @param {Object} data - 分类信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    addSort(data) {
      return http.post(`${getApiPrefix()}/admin/sort/add`, data, true);
    },

    /**
     * 修改分类
     * @param {Object} data - 分类信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    updateSort(data) {
      return http.post(`${getApiPrefix()}/admin/sort/update`, data, true);
    },

    /**
     * 删除分类
     * @param {Object} params - 分类ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    deleteSort(params) {
      return http.get(`${getApiPrefix()}/admin/sort/delete`, params, true);
    },

    /**
     * 获取标签列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getLabelList(params) {
      return http.post(`${getApiPrefix()}/admin/label/list`, params, true);
    },

    /**
     * 添加标签
     * @param {Object} data - 标签信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    addLabel(data) {
      return http.post(`${getApiPrefix()}/admin/label/add`, data, true);
    },

    /**
     * 修改标签
     * @param {Object} data - 标签信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    updateLabel(data) {
      return http.post(`${getApiPrefix()}/admin/label/update`, data, true);
    },

    /**
     * 删除标签
     * @param {Object} params - 标签ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    deleteLabel(params) {
      return http.get(`${getApiPrefix()}/admin/label/delete`, params, true);
    }
  },

  /**
   * 资源管理相关接口
   */
  resource: {
    /**
     * 获取资源列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getList(params) {
      return http.post(`${getApiPrefix()}/admin/resource/list`, params, true);
    },

    /**
     * 添加资源
     * @param {Object} data - 资源信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    add(data) {
      return http.post(`${getApiPrefix()}/admin/resource/add`, data, true);
    },

    /**
     * 修改资源
     * @param {Object} data - 资源信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    update(data) {
      return http.post(`${getApiPrefix()}/admin/resource/update`, data, true);
    },

    /**
     * 删除资源
     * @param {Object} params - 资源ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    delete(params) {
      return http.get(`${getApiPrefix()}/admin/resource/delete`, params, true);
    },

    /**
     * 获取资源路径列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getPathList(params) {
      return http.post(`${getApiPrefix()}/admin/resource/path/list`, params, true);
    },

    /**
     * 添加资源路径
     * @param {Object} data - 资源路径信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    addPath(data) {
      return http.post(`${getApiPrefix()}/admin/resource/path/add`, data, true);
    },

    /**
     * 修改资源路径
     * @param {Object} data - 资源路径信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    updatePath(data) {
      return http.post(`${getApiPrefix()}/admin/resource/path/update`, data, true);
    },

    /**
     * 删除资源路径
     * @param {Object} params - 资源路径ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    deletePath(params) {
      return http.get(`${getApiPrefix()}/admin/resource/path/delete`, params, true);
    }
  },

  /**
   * 网站信息相关接口
   */
  webInfo: {
    /**
     * 获取网站信息
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    get() {
      return http.get(`${getApiPrefix()}/admin/webinfo`);
    },

    /**
     * 更新网站信息
     * @param {Object} data - 网站信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    update(data) {
      return http.post(`${getApiPrefix()}/admin/webinfo`, data);
    }
  },

  /**
   * 动态管理相关接口
   */
  shuoshuo: {
    /**
     * 获取动态列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getList(params) {
      return http.post(`${getApiPrefix()}/admin/shuoshuo/list`, params, true);
    },

    /**
     * 添加动态
     * @param {Object} data - 动态信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    add(data) {
      return http.post(`${getApiPrefix()}/admin/shuoshuo/add`, data, true);
    },

    /**
     * 修改动态
     * @param {Object} data - 动态信息
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    update(data) {
      return http.post(`${getApiPrefix()}/admin/shuoshuo/update`, data, true);
    },

    /**
     * 删除动态
     * @param {Object} params - 动态ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    delete(params) {
      return http.get(`${getApiPrefix()}/admin/shuoshuo/delete`, params, true);
    }
  },

  /**
   * 留言管理相关接口
   */
  treeHole: {
    /**
     * 获取留言列表
     * @param {Object} params - 分页和过滤参数
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    getList(params) {
      return http.post(`${getApiPrefix()}/admin/treeHole/boss/list`, params, true);
    },

    /**
     * 删除留言
     * @param {Object} params - 留言ID
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    delete(params) {
      return http.get(`${getApiPrefix()}/webInfo/deleteTreeHole`, params, true);
    }
  },

  /**
   * 文件上传相关接口
   */
  upload: {
    /**
     * 上传文件
     * @param {FormData} formData - 包含文件的FormData对象
     * @returns {Promise} - HTTP POST请求的Promise对象
     */
    file(formData) {
      return http.upload(`${getApiPrefix()}/admin/upload`, formData);
    },

    /**
     * 获取七牛云上传token
     * @returns {Promise} - HTTP GET请求的Promise对象
     */
    getQiniuToken() {
      return http.get(`${getApiPrefix()}/admin/qiniu/token`);
    }
  }
};

export default api; 