// 微应用注册配置
const microApps = [
  {
    name: 'ablaze-admin', // 子应用名称
    entry: process.env.NODE_ENV === 'production' 
      ? 'https://cos.roginx.ink/www/admin/index.html' // 生产环境从COS加载，明确指定index.html
      : '//127.0.0.1:9000', // 开发环境本地加载
    container: '#subapp-container', // 子应用挂载的DOM节点
    activeRule: '/admin', // 激活子应用的路由规则
    props: {
      // 传递给子应用的数据
      mainAppData: {
        authToken: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
      }
    },
    // 添加超时配置
    timeoutThreshold: 30000, // 30秒超时
    // 自定义fetch配置
    customFetch(url, options = {}) {
      // 确保options和headers存在
      options = options || {};
      options.headers = options.headers || {};
      
      // 对于COS上的资源，添加特殊处理
      if (url.includes('cos.roginx.ink')) {
        return fetch(url, {
          ...options,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            ...options.headers,
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      return fetch(url, options);
    }
  }
  // 可以在这里注册更多子应用
];

export default microApps; 