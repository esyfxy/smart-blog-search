// 子应用生命周期函数
(function(global) {
  // 定义生命周期函数
  global.bootstrap = async function() {
    console.log('[ablaze-admin] bootstrap from entry.js');
    return Promise.resolve();
  };

  global.mount = async function(props) {
    console.log('[ablaze-admin] mount from entry.js', props);
    return Promise.resolve();
  };

  global.unmount = async function() {
    console.log('[ablaze-admin] unmount from entry.js');
    return Promise.resolve();
  };

  global.update = async function(props) {
    console.log('[ablaze-admin] update from entry.js', props);
    return Promise.resolve();
  };

  // 如果是 CommonJS 环境
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = {
      bootstrap: global.bootstrap,
      mount: global.mount,
      unmount: global.unmount,
      update: global.update
    };
  }
  // 如果是 AMD 环境
  else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        bootstrap: global.bootstrap,
        mount: global.mount,
        unmount: global.unmount,
        update: global.update
      };
    });
  }
  // 如果是全局变量
  else {
    global.lifecycles = {
      bootstrap: global.bootstrap,
      mount: global.mount,
      unmount: global.unmount,
      update: global.update
    };
  }
})(window); 