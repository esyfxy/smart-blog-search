<template>
  <div>
    <div class="search-box">
      <el-input class="my-input" type="number" v-model="pagination.source"
                placeholder="文章ID" @keyup.enter="searchComments()"></el-input>
      <el-button type="primary" @click="searchComments()">
        <el-icon><Search /></el-icon>搜索
      </el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table :data="comments" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="source" label="文章ID" align="center"></el-table-column>
      <el-table-column prop="userId" label="发表用户ID" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column prop="commentContent" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="commentInfo" label="评论额外信息" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" link style="color: #ff4500" @click="handleDelete(scope.row)">
            <el-icon><Delete /></el-icon>删除
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
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Delete } from '@element-plus/icons-vue';
import { useMainStore } from '../../store';
import api from '../../utils/api';

// 注入依赖
const common = inject('$common');
const store = useMainStore();

// 响应式状态
const isBoss = ref(store.currentAdmin.isBoss);
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  source: null
});
const comments = ref([]);

// 生命周期钩子
onMounted(() => {
  getComments();
});

// 方法
const clearSearch = () => {
  pagination.current = 1;
  pagination.size = 10;
  pagination.total = 0;
  pagination.source = null;
  getComments();
};

const getComments = () => {
  const fetchComments = isBoss.value 
    ? api.comment.getBossList(pagination)
    : api.comment.getUserList(pagination);
  
  fetchComments
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        comments.value = res.data.records;
        pagination.total = res.data.total;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const handlePageChange = (val) => {
  pagination.current = val;
  getComments();
};

const searchComments = () => {
  pagination.total = 0;
  pagination.current = 1;
  getComments();
};

const handleDelete = (item) => {
  ElMessageBox.confirm('删除评论后，所有该评论的回复均不可见。确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  }).then(() => {
    const deleteComment = isBoss.value
      ? api.comment.bossDelete({id: item.id})
      : api.comment.userDelete({id: item.id});
    
    deleteComment
      .then(() => {
        pagination.current = 1;
        getComments();
        ElMessage.success("删除成功！");
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }).catch(() => {
    ElMessage.info('已取消删除!');
  });
};
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.my-input {
  width: 140px;
  margin-right: 10px;
}

.my-input :deep(input::-webkit-inner-spin-button) {
  appearance: none;
}

.table {
  width: 100%;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
