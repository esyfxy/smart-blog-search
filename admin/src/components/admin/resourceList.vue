<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select v-model="pagination.resourceType" placeholder="资源类型" class="handle-select mr-2 ">
          <el-option key="10" label="表情包" value="internetMeme"></el-option>
          <el-option key="1" label="用户头像" value="userAvatar"></el-option>
          <el-option key="2" label="文章封面" value="articleCover"></el-option>
          <el-option key="3" label="文章图片" value="articlePicture"></el-option>
          <el-option key="5" label="网站头像" value="webAvatar"></el-option>
          <el-option key="4" label="背景图片" value="webBackgroundImage"></el-option>
          <el-option key="6" label="随机头像" value="randomAvatar"></el-option>
          <el-option key="7" label="随机封面" value="randomCover"></el-option>
          <el-option key="8" label="画笔图片" value="graffiti"></el-option>
          <el-option key="9" label="评论图片" value="commentPicture"></el-option>
          <el-option key="11" label="聊天群头像" value="im/groupAvatar"></el-option>
          <el-option key="12" label="群聊天图片" value="im/groupMessage"></el-option>
          <el-option key="13" label="朋友聊天图片" value="im/friendMessage"></el-option>
        </el-select>
        <el-button type="primary" @click="search()">
          <el-icon><Search /></el-icon>搜索
        </el-button>
        <el-button type="primary" @click="addResources()">新增资源</el-button>
      </div>
      <el-table :data="resources" border class="table w-full" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'"
                    disable-transitions>
              {{scope.row.status === false ? '禁用' : '启用'}}
            </el-tag>
            <el-switch @click="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="路径" align="center">
          <template #default="scope">
            <el-image :preview-src-list="[scope.row.path]" class="table-td-thumb" :src="scope.row.path"
                      fit="cover"></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" style="color: var(--orangeRed)"
                       @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination mt-5 text-right">
        <el-pagination background layout="total, prev, pager, next"
                       :current-page="pagination.current"
                       :page-size="pagination.size"
                       :total="pagination.total"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="图片"
               v-model="resourceDialog"
               width="25%"
               :append-to-body="true"
               destroy-on-close
               center>
      <div>
        <div style="margin-bottom: 15px">
          <uploadPicture 
            :isAdmin="true" 
            :prefix="pagination.resourceType" 
            @addPicture="addPicture" 
            :maxSize="5"
            :maxNumber="10">
          </uploadPicture>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Delete } from '@element-plus/icons-vue';
import uploadPicture from "./common/uploadPicture.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');

// 响应式状态
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: ""
});
const resources = ref([]);
const resourceDialog = ref(false);

// 生命周期钩子
onMounted(() => {
  getResources();
});

// 方法
const handleDelete = (item) => {
  ElMessageBox.confirm('确认删除资源？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    http.post(constant.baseURL + "/resource/deleteResource", {path: item.path}, true, false)
      .then(() => {
        pagination.current = 1;
        getResources();
        ElMessage.success("删除成功！");
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }).catch(() => {
    ElMessage.success('已取消删除!');
  });
};

const addPicture = (res) => {
  // 处理上传图片后的操作
};

const addResources = () => {
  if (common.isEmpty(pagination.resourceType)) {
    ElMessage.error("请选择资源类型！");
    return;
  }
  resourceDialog.value = true;
};

const search = () => {
  pagination.total = 0;
  pagination.current = 1;
  getResources();
};

const getResources = () => {
  http.post(constant.baseURL + "/resource/listResource", pagination, true)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        resources.value = res.data.records;
        pagination.total = res.data.total;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const changeStatus = (item) => {
  http.get(constant.baseURL + "/resource/changeResourceStatus", {
    id: item.id,
    flag: item.status
  }, true)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const handlePageChange = (val) => {
  pagination.current = val;
  getResources();
};
</script>

<style scoped>
.handle-box {
  @apply mb-5;
}

.handle-select {
  width: 200px;
}

.table {
  @apply w-full text-sm;
}

.mr-2 {
  @apply mr-2.5;
}


.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.pagination {
  @apply mt-5 text-right;
}
</style>
