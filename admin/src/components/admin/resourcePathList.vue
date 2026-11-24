<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select v-model="pagination.resourceType" placeholder="资源路径类型" class="handle-select mr-2 ">
          <el-option
            v-for="(item, i) in resourceTypes"
            :key="i"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="pagination.resourceStatus" placeholder="状态" class="handle-select mr-2 ">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" @click="search()">
          <el-icon><Search /></el-icon>搜索
        </el-button>
        <el-button type="primary" @click="addResourcePathDialog = true">新增资源路径</el-button>
      </div>
      <el-table :data="resourcePaths" border class="table w-full" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="url" label="链接" align="center"></el-table-column>

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
        <el-table-column label="封面" align="center">
          <template #default="scope">
            <el-image :preview-src-list="[scope.row.cover]" class="table-td-thumb" :src="scope.row.cover"
                      fit="cover"></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
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
               v-model="coverDialog"
               width="25%"
               :append-to-body="true"
               destroy-on-close
               center>
      <div>
        <div style="margin-bottom: 15px">
          <uploadPicture 
            :isAdmin="true" 
            :prefix="resourcePath.type" 
            @addPicture="addPicture" 
            :maxSize="5"
            :maxNumber="1">
          </uploadPicture>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="资源路径"
               v-model="addResourcePathDialog"
               width="50%"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div>
        <div>
          <div style="margin-bottom: 5px">标题：</div>
          <el-input v-model="resourcePath.title"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">简介：</div>
          <el-input v-model="resourcePath.introduction"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">封面：</div>
          <el-input v-model="resourcePath.cover"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">链接：</div>
          <el-input v-model="resourcePath.url"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">资源类型：</div>
          <el-select v-model="resourcePath.type" placeholder="资源路径类型" class="handle-select mr-2 ">
            <el-option
              v-for="(item, i) in resourceTypes"
              :key="i"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div style="margin-top: 10px;margin-bottom: 5px">备注：</div>
          <el-input v-model="resourcePath.remark" type="textarea"></el-input>
        </div>
        <div class="flex justify-center mt-7">
          <el-button type="primary" @click="addResourcePathCover()" class="mr-5">
            上传封面
          </el-button>
          <el-button type="success" @click="addResourcePath()">
            提交
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Edit, Delete } from '@element-plus/icons-vue';
import uploadPicture from "./common/uploadPicture.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');

// 响应式状态
const resourceTypes = ref([{label: "友链", value: "friendUrl"}]);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "",
  resourceStatus: null
});
const resourcePaths = ref([]);
const coverDialog = ref(false);
const addResourcePathDialog = ref(false);
const isUpdate = ref(false);
const resourcePath = reactive({
  title: "",
  introduction: "",
  cover: "",
  url: "",
  type: "",
  remark: ""
});

// 生命周期钩子
onMounted(() => {
  getResourcePaths();
});

// 方法
const addPicture = (res) => {
  resourcePath.cover = res;
  coverDialog.value = false;
};

const addResourcePathCover = () => {
  if (addResourcePathDialog.value === false) {
    return;
  }
  if (common.isEmpty(resourcePath.type)) {
    ElMessage.error("请选择资源类型！");
    return;
  }
  coverDialog.value = true;
};

const addResourcePath = () => {
  if (common.isEmpty(resourcePath.title) || common.isEmpty(resourcePath.type)) {
    ElMessage.error("标题和资源类型不能为空！");
    return;
  }
  http.post(constant.baseURL + "/webInfo/" + (isUpdate.value ? "updateResourcePath" : "saveResourcePath"), resourcePath, true)
    .then(() => {
      ElMessage.success("保存成功！");
      addResourcePathDialog.value = false;
      clearDialog();
      search();
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const search = () => {
  pagination.total = 0;
  pagination.current = 1;
  getResourcePaths();
};

const getResourcePaths = () => {
  http.post(constant.baseURL + "/webInfo/listResourcePath", pagination, true)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        resourcePaths.value = res.data.records;
        pagination.total = res.data.total;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const changeStatus = (item) => {
  http.post(constant.baseURL + "/webInfo/updateResourcePath", item, true)
    .then(() => {
      ElMessage.success("修改成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const handlePageChange = (val) => {
  pagination.current = val;
  getResourcePaths();
};

const handleDelete = (item) => {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    http.get(constant.baseURL + "/webInfo/deleteResourcePath", {id: item.id}, true)
      .then(() => {
        search();
        ElMessage.success("删除成功！");
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }).catch(() => {
    ElMessage.success('已取消删除!');
  });
};

const handleEdit = (item) => {
  Object.assign(resourcePath, JSON.parse(JSON.stringify(item)));
  addResourcePathDialog.value = true;
  isUpdate.value = true;
};

const clearDialog = () => {
  isUpdate.value = false;
  addResourcePathDialog.value = false;
  Object.assign(resourcePath, {
    title: "",
    introduction: "",
    cover: "",
    url: "",
    type: "",
    remark: ""
  });
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

. {
  @apply .5;
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
