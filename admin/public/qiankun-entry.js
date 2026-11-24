/**
 * qiankun-entry.js - 专门为qiankun微前端创建的入口文件
 * 这个文件会被部署到CDN，并被qiankun直接加载
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['ablaze-admin'] = {}));
}(this, (function (exports) { 'use strict';

  // 定义生命周期函数
  function bootstrap() {
    console.log('[ablaze-admin] bootstrap from qiankun-entry.js');
    return Promise.resolve();
  }

  function mount(props) {
    console.log('[ablaze-admin] mount from qiankun-entry.js', props);
    // 如果主应用已经加载，尝试调用主应用的mount函数
    if (window.mount) {
      return window.mount(props);
    }
    return Promise.resolve();
  }

  function unmount() {
    console.log('[ablaze-admin] unmount from qiankun-entry.js');
    // 如果主应用已经加载，尝试调用主应用的unmount函数
    if (window.unmount) {
      return window.unmount();
    }
    return Promise.resolve();
  }

  function update(props) {
    console.log('[ablaze-admin] update from qiankun-entry.js', props);
    // 如果主应用已经加载，尝试调用主应用的update函数
    if (window.update) {
      return window.update(props);
    }
    return Promise.resolve();
  }

  // 导出生命周期函数
  exports.bootstrap = bootstrap;
  exports.mount = mount;
  exports.unmount = unmount;
  exports.update = update;

  Object.defineProperty(exports, '__esModule', { value: true });

}))); 