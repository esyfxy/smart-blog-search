import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

/**
 * 相册服务类 - 处理图片布局和初始化
 */
class AlbumService {
  constructor() {
    this.masonry = null;
    this.masonryInterval = null;
    this.options = {
      gutter: 10,
      columnWidth: '.grid-item',
      itemSelector: '.grid-item',
      percentPosition: true,
    };
  }

  /**
   * 初始化 Masonry 布局
   * @param {HTMLElement} targetRef - 目标元素
   * @param {boolean} isTypeRoute - 是否为类型路由
   * @param {Function} onLoadingChange - 加载状态变化回调
   * @returns {Promise} 初始化完成的 Promise
   */
  initMasonry(targetRef, isTypeRoute, onLoadingChange) {
    if (!targetRef) {
      console.error('目标元素不存在');
      return Promise.reject('目标元素不存在');
    }
    
    onLoadingChange(true);
    this.clearMasonry();
    this.masonry = new Masonry(targetRef, this.options);
    this.masonryInterval = setInterval(() => {
      console.log('Masonry Layout')
      this.masonry.layout();
      this.masonry.getItemElements().forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
          if (!img.complete) {
            // 如果图片还没有加载完成，则等待图片加载完成后再判断图片宽度
            img.onload = () => {
              if (img.naturalWidth < 160 || img.naturalHeight < 100) {
                if (isTypeRoute) this.masonry.remove(item);
              }
            };
          } else if (img.naturalWidth < 160 || img.naturalHeight < 100) {
            if (isTypeRoute) this.masonry.remove(item);
          }
        }
      });
    }, 1250);

    // 监听图片加载完成事件，重新布局
    return new Promise((resolve) => {
      imagesLoaded(targetRef, () => {
        console.log('所有图片加载完成');
        if (this.masonry) {
          this.masonry.destroy();
        }
        this.masonry = new Masonry(targetRef, this.options);
        onLoadingChange(false);
        resolve(true);
      });
    });
  }

  /**
   * 清除 Masonry 实例
   */
  clearMasonry() {
    if (this.masonryInterval) {
      clearInterval(this.masonryInterval);
      this.masonryInterval = null;
    }

    if (this.masonry) {
      this.masonry.destroy();
      this.masonry = null;
    }
  }

  /**
   * 更新 Masonry 布局
   */
  updateLayout() {
    if (this.masonry) {
      this.masonry.layout();
    }
  }

  /**
   * 初始化 lightGallery
   * @param {HTMLElement} targetRef - 目标元素
   * @returns {Object|null} lightGallery 实例
   */
  initLightGallery(targetRef) {
    if (!targetRef) {
      console.error('目标元素不存在');
      return null;
    }

    try {
      // 如果已经存在实例，先销毁
      if (window.dynamicGallery) {
        window.dynamicGallery.destroy();
        window.dynamicGallery = null;
      }
      // 初始化 lightGallery
      window.dynamicGallery = lightGallery(targetRef, {
        selector: '.grid-item',
        plugins: [lgHash, lgRotate, lgVideo, lgZoom, lgFullscreen, lgAutoplay, lgComment],
        mode: 'lg-slide',
        cssEasing: 'ease',
        commentBox: true,
        fbComments: true,
        galleryId: 1,
        speed: 300
      });

      return window.dynamicGallery;
    } catch (error) {
      console.error('初始化 lightGallery 失败:', error);
      return null;
    }
  }

  /**
   * 销毁 lightGallery 实例
   */
  destroyLightGallery() {
    if (window.dynamicGallery) {
      try {
        window.dynamicGallery.destroy();
        window.dynamicGallery = null;
      } catch (error) {
        console.error('销毁 lightGallery 失败:', error);
      }
    }
  }

  /**
   * 检查图片 URL
   * @param {Object} item - 图片项
   * @param {boolean} isNSFW - 是否为 NSFW 内容
   * @returns {string} 处理后的图片 URL
   */
  checkImageUrl(item, isNSFW) {
    let src = item.picUrl;
    let note = item.note;
    
    if (note?.slice(0, 4) == "NSFW" && !isNSFW) {
      return 'https://gd-hbimg.huaban.com/9d4628a3c336c8c816366d7f8b6a7937cd2b3b74c9bd4-KYmhYR_fw658webp';
    } else {
      return src?.indexOf('qiniu.roginx.ink') !== -1 ? src + '-album' : src;
    }
  }
}

export default new AlbumService(); 