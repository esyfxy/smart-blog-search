export default {
    selector(doc,eleStr){
        let sqs = eleStr?.split("||");
        doc = $(doc);
        let elements = []
        for (let index0 = 0; index0 < sqs.length; index0++) {
            let selector = "";
            let sq = sqs[index0]?.split("@");
            for (let index = 0; index < sq.length; index++) {
                let regex = /^(\w+)\.([\w\s-]+)(?:\.(\d+))?$/ 
                let parm = sq[index].match(regex);
                console.log("啊实打",parm);
                if(!parm){
                    selector = sq[index]
                } else {
                    if(parm[1]=="tag"){
                        selector = selector + parm[2];
                        if(parm[3]) {
                            selector = selector + `:eq(${parm[3]})`
                        }
                    }
                    if(parm[1]=="class" || parm[1]==""){
                        selector = selector + `[class*='${parm[2]}']`
                        if(parm[3]) {
                            selector = selector + `:eq(${parm[3]})`
                        }
                    }
                    if(parm[2]=="id"){
                        selector = selector + `[id*='${parm[2]}']`
                    }
                }
                selector = selector + " ";
                elements.push(doc.find(selector))
            }
        }
        return elements
    },
    /**
     * 从一个个书中获取属性
     */
    attr(doc,attrStr){
        doc = $(doc);
        let res = "";
        let sqs = attrStr?.split("||");
        for (let index0 = 0; index0 < sqs.length; index0++) {
            let selector = "";
            let sq = sqs[index0]?.split("@");
            for (let index = 0; index < sq.length-1; index++) {
                let regex = /^(\w+)\.([\w\s-]+)(?:\.(\d+))?$/ 
                let parm = sq[index].match(regex);
                if(!parm){
                    selector = sq[index]
                } else {
                    if(parm[1]=="tag"){
                        selector = selector + parm[2];
                        if(parm[3]) {
                            selector = selector + `:eq(${parm[3]})`
                        }
                    }
                    if(parm[1]=="class" || parm[1]==""){
                        selector = selector + `[class*='${parm[2]}']`
                        if(parm[3]) {
                            selector = selector + `:eq(${parm[3]})`
                        }
                    }
                    if(parm[2]=="id"){
                        selector = selector + `[id*='${parm[2]}']`
                    }
                }
                selector = selector + " ";
                console.log("选择器",selector);
                if(sq[sq.length-1]){
                    if(sq[sq.length-1]=="text"){
                        let result =  $(doc).find(selector);
                        if(result.length>1) {
                            res = result.map(function(index, item) {
                                return $(item)?.text()
                            });
                        } else {
                            res = $(doc).find(selector)?.text()
                        }
                    } else {
                        let result =  $(doc).find(selector);
                        if(result.length>1) {
                            res = result.map(function(index, item) {
                                return $(item)?.attr(sq[sq.length-1])
                            });
                        } else {
                            res = $(doc).find(selector)?.attr(sq[sq.length-1])
                        }
                    }
                }
            }
        }
        return res;
    },
    getBookPreview(doc,str){
        return {
            "bookItem": doc,
            "bookUrl": this.attr(doc,str.bookUrl),
            "realUrl": this.attr(doc,str.realUrl),
            "coverUrl": this.attr(doc,str.coverUrl),
            // "kind": this.attr(doc,str.kind),
            "name": this.attr(doc,str.name),
            "id":this.attr(doc,str.bookUrl)?.match(str.id)?.[1]
        }
    },
    getBookContent(doc,str){
        return {
            "content":this.selector(doc,str),
        }
    },
    getBookInfo(doc,str){
        return {
            "bookItem": doc,
            "coverUrl": this.attr(doc,str.coverUrl),
            // "init": "",
            "intro": this.attr(doc,str.intro),
            "kind": this.attr(doc,str.kind),
            "name": this.attr(doc,str.name),
        }
    },
    //返回搜索页面
    ruleSearch(source,key){
        return fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: source.searchUrl.replace("{{key}}",key)??this.$route.query.url })
        })
        .then(response => response.text())
        .then(html => {
            const doc = $(html);
            return doc;
        })
        .catch(error => console.error(error));
    },
    ruleBookInfo(source,key){
        return fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: source.bookSourceUrl + key ?? this.$route.query.url })
        })
        .then(response => response.text())
        .then(html => {
            const doc = $(html);
            return doc;
        })
        .catch(error => console.error(error));
    },
    ruleContent(source,key){
        return fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: source.bookSourceUrl + key ?? this.$route.query.url })
        })
        .then(response => response.text())
        .then(html => {
            const doc = $(html);
            return doc;
        })
        .catch(error => console.error(error));
    },
    async decodeImage(photoUrl , asyncFun) {
        const regexString = "\\/(\\d+)\\/(\\d+)\\.webp";
        const matches = photoUrl.match(regexString);
        let chapterId = matches?.[1];
        let photoId = matches?.[2];
        if(!chapterId) { return asyncFun(photoUrl); }
        let outputImage = new Image();
        if(chapterId <= 220971) {
            log.info("✖️:[{}]小于220971, [{}]不需要切割", chapterId, photoName);
            return asyncFun(photoUrl);
        }
        try {
          let md5c = CryptoJS.MD5(chapterId + photoId).toString();
          let c = parseInt(md5c.charAt(md5c.length - 1), 16);
          c >= 10 ? c = c-1 : c = c;
          chapterId >= 421926 ? c = c : c = c + 8
          let mod; chapterId >= 421926 ? mod = 8 : mod = 10;
          const rule = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
          let piece; chapterId >= 268850? piece= rule[c % mod] : piece=10;
          const response = await fetch(photoUrl);
          const buffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
          const blob = new Blob([uint8Array], { type: 'image/webp' });
          const blobUrl = URL.createObjectURL(blob);
          outputImage.src = blobUrl;
          let thi = this
          outputImage.onload = async function() {
            asyncFun(await thi.reverseImage(outputImage, chapterId, piece));
            outputImage.onload = null;
          };
        } catch (error) {
          console.error('解密图片失败:', error);
        }
      },
    reverseImage(bufferedImage, chapterId, piece) {
        if (piece === 1) {
          return bufferedImage;
        }
        const height = bufferedImage.height;
        const width = bufferedImage.width;
        const preImgHeight = Math.floor(height / piece);
        if (preImgHeight === 0) {
          return bufferedImage;
        }
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        for (let i = 0; i < piece; i++) {
          let subCanvas = document.createElement('canvas');
          let subContext = subCanvas.getContext('2d');
          subCanvas.width = width;
          subCanvas.height = preImgHeight;
          if (i === piece - 1) {
            subContext.drawImage(bufferedImage, 0, i * preImgHeight, width, height - i * preImgHeight, 0, 0, width, height - i * preImgHeight);
          } else {
            subContext.drawImage(bufferedImage, 0, i * preImgHeight, width, preImgHeight, 0, 0, width, preImgHeight);
          }
          context.drawImage(subCanvas, 0, height - (i + 1) * preImgHeight);
        }
          return canvas.toDataURL('image/webp');
      }
}