<template>
  <div class="anime">
	<div class="anime_poster" >
		<div class="anime_score_div">
			<span class="anime_title anime-line" @click="intoAnime()">{{fitem.subject.name_cn||fitem.subject.name}}</span>
			<span class="anime-line">{{fitem.subject.date}}</span>
			<span class="anime-line">番剧评分：{{fitem.subject.score+' / 10'}}</span>
			<span class="anime-line">我的评分：{{fitem.rate+' / 10'}}</span>
		</div>
		<img :src="fitem.subject.images.common" alt="封面">
	</div>
	<div class="anime_progress">
		<font class="anime_p_font">{{progressText}}</font>
		<div class="anime_p_value" :style="progressStyle"></div>
	</div>
	<!-- <div class="anime_time">{{fitem.subject.air_date}}</div> -->
	<!-- <div class="anime_context" v-html="fitem.prectx"></div> -->
	</div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { formatDate } from '../../utils/tools.js';

// 定义props
const props = defineProps({
  fitem: {
    type: Object,
    required: true,
    default: () => ({
      subject: {
        name: '',
        name_cn: '',
        images: { common: '' },
        eps: 0,
        score: 0
      },
      rate: 0,
      ep_status: 0,
      type: 0
    })
  }
});

// 计算属性
const progressText = computed(() => {
  return `进度：${props.fitem.type == 2 ? props.fitem.subject.eps : props.fitem.ep_status} / ${props.fitem.subject.eps}`;
});

const progressStyle = computed(() => {
  if (props.fitem.type == 2) {
    return 'width: 100%';
  }
  const percentage = (props.fitem.ep_status / props.fitem.subject.eps) * 100;
  return `width: ${percentage}%`;
});

// 方法
const intoAnime = () => {
  if (props.fitem.subject && props.fitem.subject.id) {
    window.open("https://bgm.tv/subject/" + props.fitem.subject.id);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.anime{
	position: relative;
	display: block;
	box-sizing: border-box;
    width: 160px;
	overflow: hidden;
	text-align: center;
    border-radius: .4em;
	animation: zoomIn 0.8s ease-in-out;
	box-shadow: 0 0 6px rgb(0 0 0 / 20%);
	transition: .5s;
}
.anime:hover{
	transform: translateY(-10px);
	transition: .5s;
	box-shadow: 0 8px 10px rgb(0 0 0 / 50%);
}
.anime_title{
	width: 100%;
    font-size: 1rem;
    font-weight: 550;
	cursor: pointer;
	max-height:40px;
	line-height: 20px;
	overflow: hidden;
    letter-spacing: 1px;
	transition: .5s;
}
.anime-line{
	text-shadow: 1px 1px 4px #000;
}
.anime_poster{
	width:160px;
	height:200px;
	object-fit: cover;
	overflow: hidden;
	position: relative;
}
.anime_poster img{
	width:100%;
	height:100%;
	transition: .5s;
}
.anime_score_div{
    position: absolute;
    width: 100%;
    color: #FFF;
	padding: 5px;
	background: #00000000;
	box-sizing: border-box;
    text-align: left;
    display: flex;
    flex-direction: column;
	bottom: -60px;
	transition: .5s;
	z-index: 1;
}
.anime_poster:hover img{
	transform: scale(1.25);
	transition: .5s;
}
.anime_poster:hover > .anime_score_div{
	bottom: 0;
	background: #00000099;
	backdrop-filter: saturate(5) blur(2px);
	border-radius: 5px 5px 0 0;
	transition: .5s;
}
.anime_time{
	color:#037125;
	font-size: 0.85em;
}
.anime_progress{
	position: relative;
	width: 100%;
	height:20px;
	background:#ccc;
}
.anime_p_font{
	position: absolute;
	top:0;
	width:100%;
	left:0;
	color:#222;
}
.anime_p_value{
	height:100%;
	background: lightpink;
}
.anime_click{
	color:#095186f5;
	font-size: 0.8em;
}
.anime_context{
	overflow:hidden;
	width:100%;
	color:#666;
	font-size:15px;
	font-weight:500;
	letter-spacing: 0.4px;
	line-height:25px;
	flex:1;
}
.anime_keywords{
	display: flex;
	flex-wrap: wrap;
	list-style: none;
}
.anime_keywords li{
	color: #FFF;
	height: 1.8rem;
	line-height: 1.8rem;
	padding: 0 .4rem;
	border-radius: .4rem;
	cursor: pointer;
	display: block;
	font-size: .85rem;
	background: rgb(53, 88, 0);
	transition: .5s ease;
	margin:.2rem .3rem;
}
.anime_keywords li:hover{
	transition: .5s ease;
	background: lightgreen;
}
</style>
