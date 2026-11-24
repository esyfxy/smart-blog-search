<template>
  <div>
    <div class="flex flex-col items-center justify-center h-full">
      <DatePicker
        class="v-date-picker"
        color="red"
        :is-dark="isDark()"
        is-range
        v-model="vCalendarData.selectedDate"
        @update:model-value="handleChange"
      />
      <div class="w-full max-w-400px text-18px bg-background flex flex-col items-center justify-end rounded-md shadow-md mt-2 py-4 my-3">
        <h1 class="mb-auto mt-0 leading-none">Todos</h1>
        <ul class="w-full list-none px-3.5 overflow-x-hidden mt-8">
          <li @click="updateTask(index,{id:task.id,status:task.status=='doing'?'done':'doing'})" 
              v-for="(task, index) in taskList" 
              :key="index" 
              class="flex items-center leading-normal relative px-3 py-0 transition-transform duration-500 ease-in-out"
              :class="{'todo--completed':task.status=='done'}">
            <span class="todo__content">{{ task.title }}</span>
            <i @click.stop="showDesc=index" class="fa fa-list-ul ml-2.5"></i>
            <i @click.stop="addTask=task,showEdit=index" class="fa fa-pencil-square-o ml-2.5" aria-hidden="true"></i>
          </li>
        </ul>
        <div class="w-3/4 relative my-4">
          <input class="add-todo__input" v-model="addTask.title" placeholder="添加一个任务标题...">
          <button class="add-todo__btn" @click="saveTask()"><i class="fa fa-plus"></i></button>
        </div>
      </div>
      
      <!-- 编辑弹窗 - INS风格 -->
      <div v-if="showEdit!=-1" @click="showEdit=-1" class="ins-modal-overlay">
        <div @click.stop class="ins-edit-modal">
          <!-- 头部 -->
          <div class="ins-modal-header">
            <h2 class="ins-modal-title">编辑任务</h2>
            <button @click="showEdit=-1" class="ins-close-btn">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <!-- 内容区域 -->
          <div class="ins-modal-content">
            <div class="ins-form-group" v-for="(value, key) in addTask" :key="key">
              <label class="ins-form-label">{{ getFieldLabel(key) }}</label>
              <div class="ins-form-input-wrapper">
            <el-date-picker
              v-if="(key === 'startTime' || key === 'endTime') || (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/))"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              v-model="addTask[key]"
                  class="ins-date-picker"
                  placeholder="选择日期时间"
            ></el-date-picker>
            <el-input
                  v-else-if="key === 'description'"
                  type="textarea"
                  :rows="3"
                  v-model="addTask[key]"
                  class="ins-textarea"
                  placeholder="请输入任务描述..."
                ></el-input>
                <el-input
                  v-else-if="typeof value === 'string'"
                  v-model="addTask[key]"
                  class="ins-input"
                  :placeholder="`请输入${getFieldLabel(key)}...`"
                ></el-input>
                <el-input-number 
                  v-else-if="typeof value === 'number' && key !== 'id' && key !== 'dependencyId'" 
                  v-model="addTask[key]"
                  class="ins-number-input"
                  :min="0"
                  :max="10"
                ></el-input-number>
                <el-input
                  v-else-if="typeof value === 'number' && (key === 'id' || key === 'dependencyId')"
              v-model="addTask[key]"
                  class="ins-input"
                  :placeholder="`请输入${getFieldLabel(key)}...`"
            ></el-input>
                <el-select
                  v-else-if="key === 'status'"
                  v-model="addTask[key]"
                  class="ins-select"
                  placeholder="选择状态"
                >
                  <el-option label="进行中" value="doing"></el-option>
                  <el-option label="已完成" value="done"></el-option>
                </el-select>
                <el-input v-else v-model="addTask[key]" class="ins-input" placeholder="请输入内容..."></el-input>
              </div>
            </div>
          </div>
          
          <!-- 底部按钮 -->
          <div class="ins-modal-footer">
            <button @click="showEdit=-1" class="ins-cancel-btn">取消</button>
            <button @click="updateTask(showEdit,addTask),showEdit=-1" class="ins-save-btn">
              <i class="fa fa-check"></i>
              保存
            </button>
          </div>
        </div>
      </div>
      
      <!-- 详情弹窗 - INS风格 -->
      <div v-if="showDesc!=-1" @click="showDesc=-1" class="ins-modal-overlay">
        <div @click.stop class="ins-detail-modal">
          <!-- 头部 -->
          <div class="ins-modal-header">
            <h2 class="ins-modal-title">任务详情</h2>
            <button @click="showDesc=-1" class="ins-close-btn">
              <i class="fa fa-times"></i>
            </button>
          </div>
          
          <!-- 内容区域 -->
          <div class="ins-modal-content">
            <div class="ins-detail-card">
              <div class="ins-detail-header">
                <h3 class="ins-detail-title">{{taskList[showDesc].title}}</h3>
                <span class="ins-status-badge" :class="`ins-status-${taskList[showDesc].status}`">
                  {{ taskList[showDesc].status === 'done' ? '已完成' : '进行中' }}
                </span>
              </div>
              
              <div class="ins-detail-info">
                <div class="ins-info-item">
                  <i class="fa fa-clock-o ins-info-icon"></i>
                  <div class="ins-info-content">
                    <span class="ins-info-label">开始时间</span>
                    <span class="ins-info-value">{{ formatDisplayDate(taskList[showDesc].startTime) }}</span>
                  </div>
                </div>
                
                <div class="ins-info-item">
                  <i class="fa fa-flag-checkered ins-info-icon"></i>
                  <div class="ins-info-content">
                    <span class="ins-info-label">结束时间</span>
                    <span class="ins-info-value">{{ formatDisplayDate(taskList[showDesc].endTime) }}</span>
                  </div>
                </div>
                
                <div class="ins-info-item">
                  <i class="fa fa-user ins-info-icon"></i>
                  <div class="ins-info-content">
                    <span class="ins-info-label">执行者</span>
                    <span class="ins-info-value">{{ taskList[showDesc].executor }}</span>
                  </div>
                </div>
                
                <div class="ins-info-item">
                  <i class="fa fa-exclamation-triangle ins-info-icon"></i>
                  <div class="ins-info-content">
                    <span class="ins-info-label">紧急程度</span>
                    <span class="ins-info-value">{{ getUrgencyText(taskList[showDesc].urgency) }}</span>
          </div>
        </div>
      </div>
      
              <div class="ins-detail-description">
                <h4 class="ins-desc-title">任务描述</h4>
                <div class="ins-desc-content" v-html="taskList[showDesc].description"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css'; // 导入v-calendar样式
import { useMainStore } from '../../store';
  
export default {
  components: {
    DatePicker
  },

  setup() {
    const { proxy } = getCurrentInstance();
    const store = useMainStore();
    const card = ref(null);
    const vCalendarData = reactive({
      selectedDate: {
        start: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
      }
    });
    const wallpaperIndex = ref(0);
    const showEdit = ref(-1);
    const showDesc = ref(-1);
    const wallpapers = ref([]);
    const collects = ref({});
    const taskList = ref([]);

    // 日期格式化函数 - 需要在 addTask 初始化之前定义
    function formatDateToString(fdate) {
      if (!fdate) return '';
      let date = new Date(fdate);
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '';
      }
      let year = date.getFullYear().toString().padStart(4, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      let hour = date.getHours().toString().padStart(2, '0');
      let minute = date.getMinutes().toString().padStart(2, '0');
      let second = date.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    const addTask = reactive({
      "title": "每日提交代码",
      "dependencyId": 0,
      "description": "这里是简介",
      "status": "doing",
      "startTime": formatDateToString(new Date()),
      "endTime": formatDateToString(new Date()),
      "urgency": 1,
      "executor": "0",
    });

    // 在组件创建时调用
    const handleChange = (newDate) => {
      const startDate = new Date(newDate.start);
      startDate.setHours(0, 0, 0, 0); // 将时间部分设置为 0
      const endDate = new Date(newDate.end);
      endDate.setHours(23, 59, 59, 999); // 将时间部分设置为 0
      getTasks({startTime: formatDateToString(startDate), endTime: formatDateToString(endDate)});
    };

    // 组件创建后执行
    onMounted(() => {
      const current = new Date();
      vCalendarData.selectedDate.start = new Date(current);
      vCalendarData.selectedDate.start.setDate(current.getDate() - 3);
      vCalendarData.selectedDate.end = new Date(current);
      vCalendarData.selectedDate.end.setDate(current.getDate() + 3);
      handleChange(vCalendarData.selectedDate);
    });

    function isDark() {
      return document.documentElement.getAttribute('theme') == 'dark';
    }

    function saveTask(task) {
      task = task ?? addTask;
      proxy.$http.post(proxy.$constant.baseURL + "/todolist/saveTask", task, true)
        .then((res) => {
          if (res.code == 200) {
            // 使用服务器返回的数据（包含生成的ID等）
            if (res.data) {
              taskList.value.push(res.data);
            } else {
              // 如果服务器没有返回数据，重新获取任务列表
              handleChange(vCalendarData.selectedDate);
            }
            // 重置addTask对象
            addTask.title = "";
            addTask.dependencyId = 0;
            addTask.description = "这里是简介";
            addTask.status = "doing";
            addTask.startTime = formatDateToString(new Date());
            addTask.endTime = formatDateToString(new Date());
            addTask.urgency = 1;
            addTask.executor = "0";
          }
        })
        .catch((error) => {
          proxy.$message({
            message: error.message,
            type: "error"
          });
        });
    }

    function updateTask(index, task) {
      proxy.$http.post(proxy.$constant.baseURL + "/todolist/updateTask", task, true)
        .then((res) => {
          if (res.code == 200) {
            taskList.value[index].status = res.data.status;
          }
        })
        .catch((error) => {
          proxy.$message({
            message: error.message,
            type: "error"
          });
        });
    }

    function getTasks(selectedDate) {
      proxy.$http.post(proxy.$constant.baseURL + "/todolist/listTask", selectedDate)
        .then((res) => {
          if (!proxy.$common.isEmpty(res)) {
            taskList.value = res.data;
          }
        })
        .catch((error) => {
          proxy.$message({
            message: error.message,
            type: "error"
          });
        });
    }


    function getFieldLabel(key) {
      const labels = {
        'title': '任务标题',
        'description': '任务描述',
        'status': '任务状态',
        'startTime': '开始时间',
        'endTime': '结束时间',
        'urgency': '紧急程度',
        'executor': '执行者',
        'dependencyId': '依赖ID'
      };
      return labels[key] || key;
    }

    function formatDisplayDate(dateString) {
      if (!dateString) return '未设置';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function getUrgencyText(urgency) {
      const urgencyMap = {
        1: '低',
        2: '中',
        3: '高',
        4: '紧急',
        5: '非常紧急'
      };
      return urgencyMap[urgency] || '未设置';
    }

    return {
      card,
      vCalendarData,
      wallpaperIndex,
      showEdit,
      showDesc,
      wallpapers,
      collects,
      taskList,
      addTask,
      isDark,
      saveTask,
      updateTask,
      getTasks,
      handleChange,
      formatDateToString,
      getFieldLabel,
      formatDisplayDate,
      getUrgencyText
    };
  }
}
</script>

<style scoped>
.todo__content {
  position: relative;
  opacity: 1;
  text-transform: capitalize;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.25s ease-out;
}

.todo__content:after {
  content: '';
  position: absolute;
  display: block;
  width: calc( 100% + .5em);
  left: -.25em;
  height: 2px;
  top: 50%;
  border-radius: 1px;
  background: var(--fontColor);
  transform-origin: center right;
  transform: scaleX(0);
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.todo--completed:after {
  font-family: FontAwesome;
  content: "\f00c";
  position: absolute;
  right: .75rem;
  color: #2ecc71;
  opacity: 1;
  transform: scale(1);
}

.todo--completed .todo__content {
  opacity: 0.5;
}

.todo--completed .todo__content:after {
  transform: scaleX(1);
  transform-origin: center left;
}

.add-todo__input {
  width: 100%;
  border-radius: 5px;
  padding: .5rem 1rem;
  background: #e8ebed;
  margin: 0;
  outline: 0;
  border: 2px solid #e8ebed;
  transition: background .25s ease-out;
}

.add-todo__input:focus {
  background: none;
}

.add-todo__btn {
  text-align: center;
  color: #fafafa;
  line-height: 1;
  position: absolute;
  font-size: 120%;
  right: 0;
  top: 50%;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  background: #2ecc71;
  opacity: 0;
  transform: translate(0, -50%) scale(0) rotate(180deg);
  transition: transform, opacity, 0.5s cubic-bezier(0.87, -0.41, 0.19, 1.44);
}

.add-todo__input:focus + .add-todo__btn {
  opacity: 1;
  transform: translate(50%, -50%) scale(1) rotate(0deg);
}

.add-todo__btn:focus {
  opacity: 1;
  transform: translate(50%, -50%) scale(1.1) rotate(0deg);
}

.add-todo__btn:active {
  opacity: 1;
  transition: transform, opacity, 0.1s cubic-bezier(0.87, -0.41, 0.19, 1.44);
  transform: translate(50%, -50%) scale(0.95) rotate(0deg);
}

.cursor {
  margin-left: 1px;
  animation: hideToShow 0.7s infinite;
  font-weight: 200;
}

@keyframes hideToShow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* INS风格弹窗样式 */
.ins-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ins-edit-modal,
.ins-detail-modal {
  background: var(--background);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ins-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.ins-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--fontColor);
  margin: 0;
}

.ins-close-btn {
  background: none;
  border: none;
  color: var(--fontColor);
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.ins-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.ins-modal-content {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.ins-form-group {
  margin-bottom: 12px;
}

.ins-form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--fontColor);
  margin-bottom: 8px;
  opacity: 0.9;
}

.ins-form-input-wrapper {
  position: relative;
}

.ins-input,
.ins-textarea,
.ins-date-picker,
.ins-number-input,
.ins-select {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--fontColor);
  font-size: 14px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.ins-input:focus,
.ins-textarea:focus {
  outline: none;
  border-color: #007AFF;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.ins-textarea {
  resize: vertical;
  min-height: 80px;
}

.ins-modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.ins-cancel-btn,
.ins-save-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ins-cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--fontColor);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ins-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.ins-save-btn {
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.ins-save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

/* 详情弹窗样式 */
.ins-detail-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ins-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ins-detail-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--fontColor);
  margin: 0;
  flex: 1;
}

.ins-status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ins-status-doing {
  background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
  color: white;
}

.ins-status-done {
  background: linear-gradient(135deg, #34C759 0%, #28A745 100%);
  color: white;
}

.ins-detail-info {
  margin-bottom: 12px;
}

.ins-info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.ins-info-item:last-child {
  border-bottom: none;
}

.ins-info-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: #007AFF;
  font-size: 14px;
}

.ins-info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ins-info-label {
  font-size: 12px;
  color: var(--fontColor);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ins-info-value {
  font-size: 14px;
  color: var(--fontColor);
  font-weight: 500;
}

.ins-detail-description {
  margin-top: 12px;
}

.ins-desc-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fontColor);
  margin: 0 0 12px 0;
}

.ins-desc-content {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 12px;
  color: var(--fontColor);
  line-height: 1.6;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 响应式设计 */
@media screen and (max-width: 620px) {
  .v-date-picker {
    width: 90vw;
  }
  
  .ins-edit-modal,
  .ins-detail-modal {
    width: 95vw;
    max-width: none;
    margin: 20px;
    max-height: 85vh;
  }
  
  .ins-modal-header {
    padding: 16px 20px;
  }
  
  .ins-modal-content {
    padding: 20px;
  }
  
  .ins-modal-footer {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .ins-cancel-btn,
  .ins-save-btn {
    width: 100%;
  }
  
  .ins-detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .ins-detail-title {
    font-size: 18px;
  }
  
  .ins-info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .ins-info-icon {
    margin-right: 0;
    margin-bottom: 4px;
  }
}

@media screen and (max-width: 480px) {
  .ins-edit-modal,
  .ins-detail-modal {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .ins-modal-content {
    max-height: calc(100vh - 140px);
  }
}
</style>