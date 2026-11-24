<template>
    <section class="main">
        <div class="container">
            <div class="drag-box">
                <div class="drag-box-item" ref="drag_box_item_pictures">
                    <div class="item-title">{{point=='pt'?'图片':'视频'}}集</div>
                     <draggable
                        :list="list"
                        class="list-group"
                        draggable=".drag-item"
                        @start="dragging = true"
                        @end="dragging = false"
                    >
                        <div class="drag-item"  v-for="item in list" :key="item.src">
                            <video  v-if="point=='av'?true:false" class='drag-object' :src="item.src" onerror="this.src = 'https://ae01.alicdn.com/kf/Hb6aba101d8ff4d17a7d0c5d7e349690dB.gif';this.onerror=null;"></video>
                            <el-image v-if="point=='pt'?true:false"
                                :class="'drag-object'"
                                fit="cover"
                                :src="item.src"
                                :data-src="item.src"
                                :preview-src-list="[item.src]">
                            </el-image>
                            <!-- <img  class="drag-object" :data-src="item.src" src="https://ae01.alicdn.com/kf/He2ac615faca74f3fba82050b09d2c36ch.gif" onerror="this.src = 'https://ae01.alicdn.com/kf/Hb6aba101d8ff4d17a7d0c5d7e349690dB.gif';this.onerror=null;" alt=""> -->
                            <div class="drag-delete-button" @click="removeItem(item)">x</div>
                            <el-input class="drag-object-text" v-model="item.text" placeholder="添加描述.."></el-input>
                        </div>
                        <div class="drag-add">
                            <svg @click.stop.right="v_if.addItemsVisible = true" @click="v_if.uploadVisible = true"  t="1564625226383" class="drag-object" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1980" width="200" height="200"><path d="M915.746268 0h-807.911811C48.273134 0 0 48.482772 0 107.834457v807.911811c0 59.561323 48.482772 107.834457 107.834457 107.834456h807.911811c59.561323 0 107.834457-48.482772 107.834456-107.834456v-807.911811c0-59.343622-48.482772-107.834457-107.834456-107.834457z m56.634456 915.746268c0 31.139276-25.495181 56.634457-56.634456 56.634456h-807.911811c-31.139276 0-56.634457-25.495181-56.634457-56.634456v-807.911811c0-31.139276 25.495181-56.634457 56.634457-56.634457h807.911811c31.139276 0 56.634457 25.495181 56.634456 56.634457v807.911811z m-267.288189-429.451087H537.293606V318.488189a25.688693 25.688693 0 0 0-25.704819-25.704819A25.688693 25.688693 0 0 0 485.875906 318.488189v167.806992H318.068913c-14.215055 0-25.704819 11.497827-25.704819 25.495181a25.688693 25.688693 0 0 0 25.704819 25.704819H485.875906v167.806992a25.688693 25.688693 0 0 0 25.704818 25.704819 25.688693 25.688693 0 0 0 25.704819-25.704819V537.495181H705.108661a25.688693 25.688693 0 0 0 25.704819-25.704819c0-14.206992-11.497827-25.495181-25.704819-25.495181z" fill="#1296db" p-id="1981"></path></svg>
                        </div>
                    </draggable>
                </div>
            </div>
        </div>
        <el-dialog title="选择文件" :append-to-body="true" v-dialogDrag center v-model="v_if.uploadVisible" width="80%">
            <el-upload
            list-type="picture-card"
            multiple
            ref="upload"
            :action="constant.qiniuUrl"
            :data="qiniuParam"
            :file-list="data.fileList"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :auto-upload = "false">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="primary" @click="commitFileList();">确 定</el-button>
        </el-dialog>
        <el-dialog title="输入链接(*,*)" :append-to-body="true" v-dialogDrag center v-model="v_if.addItemsVisible" width="50%">
            <el-input v-model="data.addSrcItems" @change="addSrcItems(data.addSrcItems)"></el-input>
        </el-dialog>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, inject, defineProps, defineEmits, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useMainStore } from '../../store';
import draggable from 'vuedraggable';

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');
const store = useMainStore();

// Props
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: true
    },
    object: {
        type: [String, Array, Object],
        default: ''
    },
    point: {
        type: String,
        default: 'pt'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    prefix: {
        type: String,
        default: ""
    },
    maxSize: {
        type: Number,
        default: 5
    },
    maxNumber: {
        type: Number,
        default: 5
    }
});

// Emits
const emit = defineEmits(['addPicture']);

// 响应式状态
const list = ref([]);
const data = reactive({
    addSrcItems: "",
    fileList: []
});
const isClosed = ref(!props.isEdit);
const v_if = reactive({
    uploadVisible: false,
    addItemsVisible: false,
});
const qiniuParam = reactive({
    token: "",
    key: ""
});
const dragging = ref(true);
const upload = ref(null);

// 监听props变化
watch(() => props.isEdit, (newVal, oldVal) => {
    if (newVal) {
        return;
    }
    emit("addPicture", returnObject());
});

// 生命周期钩子
onMounted(() => {
    if ((!props.isAdmin && !common.isEmpty(store.currentUser)) || (props.isAdmin && !common.isEmpty(store.currentAdmin))) {
        getUpToken();
    }
    
    let list_data = [];
    try {
        if (props.object && typeof props.object === 'string' && props.object.trim() !== '') {
            const parsedObject = JSON.parse(props.object);
            if (Array.isArray(parsedObject) && parsedObject[0]) {
                parsedObject[0].forEach((element, index) => {
                    list_data.push({src: element, text: parsedObject[1][index]});
                });
                list.value = list_data;
            }
        } else {
            list.value = [];
        }
    } catch (error) {
        console.error("JSON解析错误:", error);
        list.value = [];
    }
});

// 方法
const getUpToken = () => {
    http.get(constant.baseURL + "/qiniu/getUpToken", {}, props.isAdmin)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                qiniuParam.token = res.data;
            }
        })
        .catch((error) => {
            ElMessage.error(error.message);
        });
};

const handleSuccess = (response, file, fileList) => {
    qiniuParam.key = "";
    let url = constant.qiniuDownload + response.key;
    list.value.push({src: url, text: ""});
    common.saveResource(null, props.prefix, url, props.isAdmin);
};

const handleChange = (file, fileList) => {
    let flag = false;
    if (file.size > props.maxSize * 1024 * 1024) {
        ElMessage.warning(`图片最大为${props.maxSize}M！`);
        flag = true;
    }

    if (flag) {
        fileList.splice(fileList.size - 1, 1);
    }
};

const beforeUpload = (file) => {
    if (common.isEmpty(qiniuParam.token)) {
        ElMessage.warning("上传出错！");
        return false;
    }
    qiniuParam.key = props.prefix + "/" + (!common.isEmpty(store.currentUser.username) ? 
        (store.currentUser.username.replace(/[^a-zA-Z]/g, '') + store.currentUser.id) : 
        (store.currentAdmin.username.replace(/[^a-zA-Z]/g, '') + store.currentAdmin.id)) + 
        new Date().getTime() + Math.floor(Math.random() * 1000);
};

const removeItem = (item) => {
    let index = list.value.indexOf(item);
    if (index == -1) return;
    list.value.splice(index, 1);
};

const returnObject = () => {
    let pics = [];
    let texts = [];
    list.value.forEach(element => {
        pics.push(element.src);
        texts.push(element.text);
    });
    return JSON.stringify([pics, texts]);
};

const commitFileList = () => {
    ElMessage.confirm('将上传文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        upload.value.submit();
    }).catch((e) => {
        ElMessage.error(e);
    });
};

const addSrcItems = (items) => {
    items.split(",").forEach(element => {
        list.value.push({src: element, text: ""});
    });
    data.addSrcItems = "";
};
</script>

<style scoped>
    section.main .container{
        padding: 0px;
    }
    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        background-color: #eff1f5;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
        max-height:80vh;
        overflow-y: scroll;
        
    }
    .drag-box-item::-webkit-scrollbar{
        display: none;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .drag-item{
        display: inline-block;
        position: relative;
        border: 1px #e1e4e8 solid;
        padding: 5px;
        margin: 5px  8px;
        list-style: none;
        border: 1px solid #209eff3d;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 160px;
        box-sizing: content-box;
    }
    .drag-add{
        display: inline-block;
        position: relative;
        padding: 5px;
        margin: 20px  10px;
        list-style: none;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 160px;
        height:100px;
    }
    .drag-add  svg{
        height:50% !important;
        width:50% !important;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
    }

    .drag-add:hover svg path{
        fill:#d4237a;
        transition: .5s;
    }
    .drag-add path{
        transition:0.3s ;
        cursor:pointer;
        transition: .5s;
    }
    .drag-object-text{
        margin-top: 5px;
    }
    .drag-object {
        object-fit: cover;
        width: 160px;
        height:100px;
        display: block;
    }
    .drag-item .drag-delete-button{
        content: "×";
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 10;
        text-align: center;
        border-radius: 50%;
        line-height: 32px;
        font-size: 1.5em;
        color: #eee;
        -webkit-transition:  .3s ease-in;
        transition:  .3s ease-in;
        transform: translate(50%,-40%);
        background: #209eff3d;
        opacity: 0;
        pointer-events: all;
        cursor: pointer;
    }
    .drag-item:hover .drag-delete-button{
        -webkit-transition:  .3s ease-in;
        transition:  .3s ease-in;
        background: #20a0ff;
        opacity: 1;
    }
    .drag-item:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>
