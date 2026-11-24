import sourceHandle from '../../utils/sourceHandle';
import constant from '../../utils/constant';

/**
 * 相册数据服务类 - 处理数据加载和API调用
 */
class AlbumDataService {
  /**
   * 获取文章列表
   * @param {Object} pagination - 分页参数
   * @param {Array} articles - 文章数组
   * @returns {Promise} 加载结果的 Promise
   */
  getArticles(pagination, articles) {
    return fetch(`/aurora/search/works/pt?type=1&point=pt&start=${(pagination.current-1)*pagination.size}&num=${pagination.size}&keys=${pagination.keywords}`)
      .then(response => response.json())
      .then(res => {
        if (res) {
          const filteredArticles = res[0].filter(item => item.adm === 0);
          const total = res[1].total;
          
          // 构建图片对象
          const obj = filteredArticles.map(article => ({
            picUrl: article.poster,
            note: article.title
          }));
          
          return {
            title: "图册集",
            articles: [...articles, ...filteredArticles],
            albumItems: obj,
            pagination: { ...pagination, total }
          };
        }
        return {
          articles: [],
          albumItems: [],
          pagination
        };
      });
  }

  /**
   * 获取Aurora数据
   * @param {string} id - Aurora ID
   * @returns {Promise} 加载结果的 Promise
   */
  getAurora(id) {
    return fetch(`/aurora/get/work/pt/${id}`)
      .then(response => response.json())
      .then(res => {
        if (res) {
          const items = JSON.parse(res.picture);
          const obj = items[0].map((picUrl, index) => ({ 
            picUrl: picUrl, 
            note: items[1][index] 
          }));
          
          // 提取播放列表ID
          let playlistId = null;
          if (res.content?.match(/playlist=(\d+)/)) {
            playlistId = res.content.match(/playlist=(\d+)/)[1];
          }
          
          return {
            title: res.title,
            content: res.content,
            albumItems: obj,
            poster: res.poster,
            playlistId
          };
        }
        return null;
      });
  }

  /**
   * 获取随机图片
   * @param {Object} params - 参数对象
   * @returns {Object} 结果对象
   */
  getRandom(params) {
    const num = params.num || 20;
    const api = params.api || constant.ACGAPI[params.cannel || 0];
    
    const obj = new Array(num);
    for (let index = 0; index < obj.length; index++) {
      obj[index] = {
        picUrl: api + "?id=" + index,
        note: "这是随机图片"
      };
    }
    
    return {
      title: "随机二次元图片",
      albumItems: obj,
      poster: api
    };
  }

  /**
   * 获取网页图片
   * @param {string} url - 网页URL
   * @param {Object} query - 查询参数
   * @returns {Promise} 加载结果的 Promise
   */
  getWeb(url, query) {
    return fetch(`/api/scrape?url=${encodeURIComponent(url)}`, {
      method: 'GET',
    })
      .then(response => response.text())
      .then(html => {
        html = html?.replace(/<script.*?<\/script>/gs, '');
        const doc = $(html);
        let obj = [];
        const newHost = new URL(url).host;
        
        if (query.selector) {
          const images = sourceHandle.attr(doc, query.selector);
          obj = images.toArray().map((item, index) => ({
            note: item,
            picUrl: item?.replace(window.location.host, newHost),
            decodeImage: query.decodeImage,
            decode: function(albumItems, callback) {
              if (albumItems[index].decodeImage != "true") return;
              sourceHandle.decodeImage(item, function(newImage) {
                albumItems[index].decodeImage = false;
                albumItems[index].picUrl = newImage;
                if (albumItems[index+1]?.decode && albumItems.length > index + 1) {
                  albumItems[index+1].decode(albumItems, callback);
                } else if (callback) {
                  callback();
                }
              });
            }
          }));
        } else {
          const images = doc.find("img").toArray();
          obj = images.map((image) => {
            const src = $(image)?.attr("data-original") || image.src;
            return {
              note: image.alt,
              picUrl: src?.replace(window.location.host, newHost)
            };
          });
        }
        
        const title = $(html).filter('title').text();
        const poster = obj[Math.floor(obj.length / 2)]?.picUrl || '';
        
        return {
          title,
          albumItems: obj,
          poster,
          doc
        };
      });
  }

  /**
   * 获取原始数据
   * @param {string} keywords - 关键词
   * @returns {Promise} 加载结果的 Promise
   */
  getOrigin(keywords) {
    return import('../../assets/json/jmcomiccity.json').then(jmcomic => {
      if (!keywords) {
        return {
          albumItems: []
        };
      }
      
      const newHost = new URL(jmcomic.default.bookSourceUrl).host;
      
      return sourceHandle.ruleSearch(jmcomic.default, keywords).then((res) => {
        const list = sourceHandle.selector(res, jmcomic.default.ruleSearch.bookList);
        const objList = [];
        
        list[0].toArray().forEach((item) => {
          objList.push(sourceHandle.getBookPreview($(item), jmcomic.default.ruleSearch));
        });
        
        const obj = objList.map((image) => ({
          note: image.name,
          picUrl: image.coverUrl?.replace(window.location.host, newHost),
          click: (e) => {
            const url = jmcomic.default.contentUrl?.replace("${id}", image.id);
            const newUrl = `/album?type=web&url=${url}&selector=${jmcomic.default.ruleContent.items}&decodeImage=true`;
            window.open(newUrl, '_blank');
          }
        }));
        
        return {
          albumItems: obj
        };
      });
    });
  }

  /**
   * 获取动态相册
   * @param {Object} pagination - 分页参数
   * @param {Array} articles - 文章数组
   * @returns {Promise} 加载结果的 Promise
   */
  getDynamic(pagination, articles) {
    let secret = localStorage.getItem('secret') || "";
    if (!secret) {
      secret = prompt("请输入密码（可以猜一猜😀", "");
      localStorage.setItem('secret', secret);
    }
    
    if (secret != "3612") {
      return Promise.reject(new Error("密码错误"));
    }
    
    return fetch(`${constant.baseURL}/diary/listArticle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pagination)
    })
      .then(response => response.json())
      .then(res => {
        if (res.data) {
          const newArticles = [...articles, ...res.data.records];
          let obj = [];
          
          newArticles.forEach(article => {
            const items = JSON.parse(article.articleItems);
            obj.push(...items[0].map((picUrl, index) => ({ 
              picUrl: picUrl, 
              note: items[1][index] 
            })));
          });
          
          return {
            title: "动态相册",
            articles: newArticles,
            albumItems: obj,
            pagination: { ...pagination, total: res.data.total }
          };
        }
        return null;
      });
  }

  /**
   * 获取古诗
   * @returns {Promise} 加载结果的 Promise
   */
  getGuShi() {
    return fetch(constant.jinrishici)
      .then(response => response.json())
      .then(data => ({
        content: data.content,
        origin: data.origin,
        author: data.author,
        category: data.category
      }));
  }
}

export default new AlbumDataService(); 