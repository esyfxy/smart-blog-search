<template>
  <div>
    <div class="handle-box">
      <el-select v-model="pagination.recommendStatus" placeholder="是否推荐" style="width: 120px" class="mr2">
        <el-option key="1" label="是" :value="true"></el-option>
        <el-option key="2" label="否" :value="false"></el-option>
      </el-select>
      <el-select style="width: 140px" class="mr2" v-model="pagination.sortId" placeholder="请选择分类">
        <el-option
          v-for="item in sorts"
          :key="item.id"
          :label="item.sortName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select style="width: 140px" class="mr2" v-model="pagination.labelId" placeholder="请选择标签">
        <el-option
          v-for="item in labelsTemp"
          :key="item.id"
          :label="item.labelName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="pagination.keywords" placeholder="文章标题" class="handle-input mr2"></el-input>
      <el-button type="primary" @click="searchArticles()">
        <el-icon><Search /></el-icon>搜索
      </el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" @click="$router.push({path: '/postEdit'})">新增文章</el-button>
    </div>
    <el-table :data="articles" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="username" label="作者" align="center"></el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" align="center"></el-table-column>
      <el-table-column prop="sort.sortName" label="分类" align="center"></el-table-column>
      <el-table-column prop="label.labelName" label="标签" align="center"></el-table-column>
      <el-table-column prop="viewCount" label="浏览量" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column label="是否可见" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.viewStatus === false ? 'danger' : 'success'"
                  disable-transitions>
            {{scope.row.viewStatus === false ? '不可见' : '可见'}}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 1)" v-model="scope.row.viewStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template #default="scope">
          <el-image class="table-td-thumb" :src="scope.row.articleCover" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="是否启用评论" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.commentStatus === false ? 'danger' : 'success'"
                  disable-transitions>
            {{scope.row.commentStatus === false ? '否' : '是'}}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 2)" v-model="scope.row.commentStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.recommendStatus === false ? 'danger' : 'success'"
                  disable-transitions>
            {{scope.row.recommendStatus === false ? '否' : '是'}}
          </el-tag>
          <el-switch @click="changeStatus(scope.row, 3)" v-model="scope.row.recommendStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="commentCount" label="评论数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="pagination.current"
                     :page-size="pagination.size"
                     :total="pagination.total"
                     @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useMainStore } from '../../store';
import api from '../../utils/api';

// 注入依赖
const common = inject('$common');
const router = useRouter();
const store = useMainStore();

// 响应式状态
const isBoss = ref(false);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  keywords: "",
  recommendStatus: null,
  sortId: null,
  labelId: null
});
const articles = ref([]);
const sorts = ref([]);
const labels = ref([]);
const labelsTemp = ref([]);
const collections = ref([]);

// 监听分类变化
watch(() => pagination.sortId, (newVal) => {
  pagination.labelId = null;
  if(!common.isEmpty(newVal) && !common.isEmpty(labels.value)){
    labelsTemp.value = labels.value.filter(l => l.sortId === newVal);
  }
});

// 生命周期钩子
onMounted(() => {
  if (store && store.currentAdmin) {
    isBoss.value = store.currentAdmin.isBoss;
  }
  getArticles();
  getSortAndLabel();
});

// 方法
const getSortAndLabel = () => {
  api.category.getSortAndLabel()
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        sorts.value = res.data.sorts;
        labels.value = res.data.labels;
        collections.value = res.data.collections;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const clearSearch = () => {
  pagination.current = 1;
  pagination.size = 10;
  pagination.total = 0;
  pagination.keywords = "";
  pagination.recommendStatus = null;
  pagination.sortId = null;
  pagination.labelId = null;
  getArticles();
};

const getArticles = () => {
  const fetchArticles = isBoss.value 
    ? api.article.getBossList(pagination)
    : api.article.getUserList(pagination);
    
  fetchArticles
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        articles.value = res.data.records;
        pagination.total = res.data.total;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const handlePageChange = (val) => {
  pagination.current = val;
  getArticles();
};

const searchArticles = () => {
  pagination.total = 0;
  pagination.current = 1;
  getArticles();
};

const changeStatus = (article, flag) => {
  let param;
  if (flag === 1) {
    param = {
      articleId: article.id,
      viewStatus: article.viewStatus
    }
  } else if (flag === 2) {
    param = {
      articleId: article.id,
      commentStatus: article.commentStatus
    }
  } else if (flag === 3) {
    param = {
      articleId: article.id,
      recommendStatus: article.recommendStatus
    }
  }
  api.article.changeStatus(param)
    .then(() => {
      if (flag === 1) {
        ElMessage({
          duration: 0,
          showClose: true,
          message: "修改成功！注意，文章不可见时必须设置密码才能访问！",
          type: "warning"
        });
      } else {
        ElMessage.success("修改成功！");
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const handleDelete = (item) => {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    api.article.delete({id: item.id})
      .then(() => {
        pagination.current = 1;
        getArticles();
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
  router.push({path: '/postEdit', query: {id: item.id}});
};
</script>

<style scoped>

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 160px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .mrb10 {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }

  .pagination {
    margin: 20px 0;
    text-align: right;
  }

  .el-switch {
    margin: 5px;
  }
</style>
