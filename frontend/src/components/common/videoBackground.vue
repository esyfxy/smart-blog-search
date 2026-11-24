<template>
  <div ref="fullVideoHeader" class="full-video-header">
    <label class="switch hoverOpa" style="z-index: 99;position:absolute;right:5vw;top:80px" title="切换背景视频">
      <input type="checkbox" :checked="showPosterVideo" @change="updateShowPosterVideo($event.target.checked)">
      <span class="slider"></span>
    </label>
    <div v-if="showControls" class="video-controls">
      <button class="video-control-btn" @click="changeVideo(-1)" title="上一个视频">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button class="video-control-btn" @click="changeVideo(1)" title="下一个视频">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>
    <video 
      ref="video" 
      class="background-image index-full-video" 
      autoplay="autoplay" 
      muted="muted" 
      loop="loop"
      :src="videoSource" 
      :poster="posterImage">
    </video>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'VideoBackground',
  props: {
    // 是否显示视频
    showPosterVideo: {
      type: Boolean,
      default: true
    },
    // 视频列表
    videoList: {
      type: Array,
      default: () => []
    },
    // 当前视频索引
    videoIndex: {
      type: Number,
      default: 0
    },
    // 背景图片
    posterImage: {
      type: String,
      default: ''
    },
    // 是否显示控制按钮
    showControls: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:showPosterVideo', 'update:videoIndex'],
  setup(props, { emit }) {
    const video = ref(null);
    const fullVideoHeader = ref(null);
    
    // 计算视频源
    const videoSource = computed(() => {
      if (!props.showPosterVideo || !props.videoList.length) return '';
      return props.videoList[props.videoIndex % props.videoList.length];
    });
    
    // 更新showPosterVideo
    const updateShowPosterVideo = (value) => {
      emit('update:showPosterVideo', value);
    };
    
    // 切换视频
    const changeVideo = (direction) => {
      if (!props.videoList.length) return;
      
      let newIndex = props.videoIndex + direction;
      
      // 循环处理
      if (newIndex < 0) newIndex = props.videoList.length - 1;
      if (newIndex >= props.videoList.length) newIndex = 0;
      
      emit('update:videoIndex', newIndex);
      
      // 确保视频重新加载并播放
      if (video.value) {
        setTimeout(() => {
          video.value.load();
          video.value.play().catch(err => console.error('视频播放失败:', err));
        }, 50);
      }
    };
    
    return {
      video,
      fullVideoHeader,
      videoSource,
      changeVideo,
      updateShowPosterVideo
    };
  }
}
</script>

<style scoped>
.full-video-header {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.index-full-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.switch {
  position: absolute;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(204, 204, 204, 0.5);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: rgba(33, 150, 243, 0.5);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.video-controls {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.video-control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.video-control-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.video-control-btn i {
  font-size: 18px;
}
</style> 