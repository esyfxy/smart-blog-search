
JMshake.prototype.canvas = null;
JMshake.prototype.stop = false;
function JMshake(canvas,audio){
    this.canvas = canvas;//canvas
    this.audio = audio;
}
JMshake.prototype.init = function(){

}
JMshake.prototype.eventBing = function(){

}
JMshake.prototype.loadMusic = function(){
    var that = this;
    var context = that.canvas.getContext("2d");
    var WIDTH = that.canvas.width;
    var HEIGHT = that.canvas.height;
    
    //part3: 分析器
    var AudCtx = new AudioContext();//音频内容
    var analyser = AudCtx.createAnalyser();
    var src = AudCtx.createMediaElementSource(that.audio);
    src.connect(analyser);
    analyser.connect(AudCtx.destination);
    analyser.fftSize = 256;//快速傅里叶变换, 必须为2的N次方
    var bufferLength = analyser.frequencyBinCount;// = fftSize * 0.5
    
    //part4: 变量
    var barWidth = WIDTH / bufferLength;//间隔1px
    var barHeight;
    var dataArray = new Uint8Array(bufferLength);//8位无符号定长数组
    
    //part5: 动态监听
    function renderFrame() {
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.fillRect(0, 0, WIDTH, HEIGHT);//画布拓展全屏,动态调整
        analyser.getByteFrequencyData(dataArray);//获取当前时刻的音频数据
        //part6: 绘画声压条
        function rearrangeArray(arr) {
            return arr.slice().sort((a, b) => b - a);
        }
        let dataArray2 = rearrangeArray(dataArray);
        let x =0;
        for (var i = 0; i < bufferLength; i++) {

            var data = dataArray2[i]; // 音频数据的强度值，范围为 0~255
            var percentH = i / bufferLength; // 横向比例
            var barHeight = data / 2;
            // 计算 RGB 颜色
            var r = 233;
            var g = 0 ; // 增加绿色通道的值
            var b = 200 * (1-percentH); // 增加蓝色通道的值
            // 计算透明度
            var alpha = data / 150; // 根据音频数据的强度值计算透明度
            // 绘制声压条
            x += barWidth;
            context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            context.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        }
        that.animation = requestAnimationFrame(renderFrame);
    }
    that.audio.oncanplaythrough = function Draw() {
        window.cancelAnimationFrame(that.animation);
        delete that.animation;
        renderFrame();
    }

}