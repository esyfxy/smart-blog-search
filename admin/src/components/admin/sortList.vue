<template>
  <div>
    <el-tag effect="dark" class="my-tag">
      <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
        <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
        <path
          d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
          fill="#FFAA44"></path>
        <path
          d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
          fill="#11AA66"></path>
        <path
          d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
          fill="#FFFFFF"></path>
      </svg>
      分类管理
    </el-tag>
    <div class="handle-box mb-5">
      <el-button type="primary" @click="sortDialog = true">
        <el-icon>
          <Plus/>
        </el-icon>
        新增分类
      </el-button>
    </div>
    <div class="container w-full px-0">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table :data="sortInfoArray" border class="table w-full mb-6" header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="sortName" label="分类名称" width="120" align="center"></el-table-column>
            <el-table-column prop="sortDescription" label="分类描述" min-width="400" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column label="分类类型" width="120" align="center">
              <template #default="scope">
                <el-tag type="success" disable-transitions>
                  {{ scope.row.sortType === 0 ? '导航栏分类' : '普通分类' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="80" align="center"></el-table-column>
            <el-table-column label="操作" width="240" align="center" fixed="right">
              <template #default="scope">
                <div class="flex justify-center space-x-2">
                  <el-button type="text" @click="editSort(scope.row)">编辑</el-button>
                  <el-button type="text" @click="insertLabel(scope.row)">添加标签</el-button>
                  <el-button type="text" @click="sayLabel(scope.row)">查看标签</el-button>
                  <el-button type="text" class="delete-btn" @click="deleteHandle(scope.row.id, 1)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="12">
          <div v-if="sort.id" class="label-container">
            <el-tag type="success" disable-transitions class="mb-4">
              {{ sort.sortName }} 的标签列表
            </el-tag>
            <el-empty v-if="!sort.labelList || sort.labelList.length === 0" description="暂无标签数据"></el-empty>
            <el-table v-else :data="sort.labelList" border class="table w-full mb-6 label-table" header-cell-class-name="table-header">
              <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
              <el-table-column prop="labelName" label="标签名称" width="120" align="center"></el-table-column>
              <el-table-column prop="labelDescription" label="标签描述" min-width="200" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="scope">
                  <div class="flex justify-center space-x-2">
                    <el-button type="text" @click="editLabel(scope.row)">编辑</el-button>
                    <el-button type="text" class="delete-btn" @click="deleteHandle(scope.row.id, 2)">
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="分类信息" v-model="sortDialog" width="30%" :before-close="handleClose" destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入分类名称" v-model="sortForHttp.sortName">
          <template #prepend>分类名称</template>
        </el-input>
        <el-input placeholder="请输入分类描述" v-model="sortForHttp.sortDescription">
          <template #prepend>分类描述</template>
        </el-input>
        <el-select v-model="sortForHttp.sortType" placeholder="请选择分类类型">
          <el-option label="导航栏分类" :value="0"></el-option>
          <el-option label="普通分类" :value="1"></el-option>
        </el-select>
        <el-input placeholder="请输入优先级" v-model="sortForHttp.priority" v-if="sortForHttp.sortType === 0">
          <template #prepend>优先级</template>
        </el-input>
      </div>

      <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="saveSortEdit()">确 定</el-button>
          </span>
      </template>
    </el-dialog>

    <el-dialog title="标签信息" v-model="labelDialog" width="30%" :before-close="handleClose" destroy-on-close
               center>
      <div class="my-dialog">
        <el-input placeholder="请输入标签名称" v-model="labelForHttp.labelName">
          <template #prepend>标签名称</template>
        </el-input>
        <el-input placeholder="请输入标签描述" v-model="labelForHttp.labelDescription">
          <template #prepend>标签描述</template>
        </el-input>
      </div>

      <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import api from '../../utils/api';

// 注入依赖
const common = inject('$common');

// 响应式状态
const sortDialog = ref(false);
const labelDialog = ref(false);
const sortInfo = ref([]);
const sortInfoArray = computed(() => {
  return Array.isArray(sortInfo.value) ? sortInfo.value : [];
});
const sort = ref({});
const sortForHttp = reactive({
  id: null,
  sortName: "",
  sortDescription: "",
  sortType: null,
  priority: null
});
const labelForHttp = reactive({
  id: null,
  sortId: null,
  labelName: "",
  labelDescription: ""
});

// 生命周期钩子
onMounted(() => {
  getSortInfo();
});

// 方法
const deleteHandle = (id, flag) => {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    if (flag === 1) {
      api.category.deleteSort({id})
        .then(() => {
          ElMessage.success("删除成功！");
          getSortInfo();
          sort.value = {};
        })
        .catch((error) => {
          ElMessage.error(error.message);
        });
    } else if (flag === 2) {
      api.category.deleteLabel({id})
      .then(() => {
        ElMessage.success("删除成功！");
        getSortInfo();
        // 重新获取当前分类的标签列表
        if (sort.value && sort.value.id) {
          refreshCurrentSort(sort.value.id);
        }
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
    }
  }).catch(() => {
    ElMessage.success('已取消删除!');
  });
};

const saveSortEdit = () => {
  if (common.isEmpty(sortForHttp.sortType) ||
    common.isEmpty(sortForHttp.sortName) ||
    common.isEmpty(sortForHttp.sortDescription)) {
    ElMessage.error("请完善所有分类信息！");
    return;
  }

  if (sortForHttp.sortType === 0 && common.isEmpty(sortForHttp.priority)) {
    ElMessage.error("导航栏分类必须输入优先级！");
    return;
  }

  const saveOrUpdate = common.isEmpty(sortForHttp.id)
    ? api.category.addSort(sortForHttp)
    : api.category.updateSort(sortForHttp);

  saveOrUpdate
    .then(() => {
      ElMessage.success("保存成功！");
      getSortInfo();
      handleClose();
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const saveLabelEdit = () => {
  if (common.isEmpty(labelForHttp.labelName) ||
    common.isEmpty(labelForHttp.labelDescription)) {
    ElMessage.error("请完善所有标签信息！");
    return;
  }

  const saveOrUpdate = common.isEmpty(labelForHttp.id)
    ? api.category.addLabel(labelForHttp)
    : api.category.updateLabel(labelForHttp);

  saveOrUpdate
    .then(() => {
      ElMessage.success("保存成功！");
      getSortInfo();
      handleClose();
      
      // 如果当前有选中的分类，刷新它的标签列表
      if (sort.value && sort.value.id) {
        refreshCurrentSort(sort.value.id);
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const editSort = (sortData) => {
  sortDialog.value = true;
  sortForHttp.id = sortData.id;
  sortForHttp.sortName = sortData.sortName;
  sortForHttp.sortDescription = sortData.sortDescription;
  sortForHttp.sortType = sortData.sortType;
  sortForHttp.priority = sortData.priority;
};

const editLabel = (label) => {
  labelDialog.value = true;
  labelForHttp.id = label.id;
  labelForHttp.sortId = label.sortId;
  labelForHttp.labelName = label.labelName;
  labelForHttp.labelDescription = label.labelDescription;
};

const insertLabel = (sortData) => {
  labelForHttp.sortId = sortData.id;
  labelDialog.value = true;
};

const handleClose = () => {
  labelForHttp.id = null;
  labelForHttp.sortId = null;
  labelForHttp.labelName = "";
  labelForHttp.labelDescription = "";
  
  sortForHttp.id = null;
  sortForHttp.sortName = "";
  sortForHttp.sortDescription = "";
  sortForHttp.sortType = null;
  sortForHttp.priority = null;
  
  sortDialog.value = false;
  labelDialog.value = false;
};

const sayLabel = (sortData) => {
  // 直接从API获取最新的分类数据，确保标签列表是最新的
  refreshCurrentSort(sortData.id);
};

// 刷新当前选中分类的数据
const refreshCurrentSort = (sortId) => {
  api.category.getSortDetail({ id: sortId })
    .then((res) => {
      if (res && res.data) {
        sort.value = res.data;
        // 确保labelList是数组
        if (!Array.isArray(sort.value.labelList)) {
          sort.value.labelList = [];
        }
      }
    })
    .catch((error) => {
      ElMessage.error(error.message || '获取分类详情失败');
    });
};

const getSortInfo = () => {
  api.category.getSortAndLabel()
    .then((res) => {
      if (res && res.data) {
        // 确保数据是有效的对象或数组
        sortInfo.value = Array.isArray(res.data) ? res.data : 
                        (res.data.sorts || res.data.result || []);
      } else {
        sortInfo.value = [];
      }
    })
    .catch((error) => {
      ElMessage.error(error.message || '获取分类信息失败');
      sortInfo.value = [];
    });
};
</script>

<style>
.my-tag {
  @apply mb-10 w-full text-left border-none h-40px leading-40px text-16px;
  background: var(--lightYellow);
  color: var(--black);
}

.handle-box {
  @apply mb-5;
}

.container {
  @apply w-full p-0;
}

.table {
  @apply w-full text-14px mb-5;
}

.my-dialog > div {
  @apply my-3 mx-0;
}

.my-dialog :deep(input::-webkit-inner-spin-button) {
  appearance: none;
}

/* 删除按钮样式 */
.delete-btn {
  color: #ff4500 !important;
}

/* 表格内容过长时显示省略号并支持悬停显示全部 */
.el-table .cell {
  @apply whitespace-normal break-words;
}

/* 标签表格容器 */
.label-container {
  @apply relative z-10;
}

/* 标签表格 */
.label-table {
  @apply z-20;
}

/* 确保表格显示在最上层 */
.el-table {
  @apply relative z-10;
}

/* 修复el-empty组件样式 */
.el-empty {
  @apply my-10;
}
</style>
