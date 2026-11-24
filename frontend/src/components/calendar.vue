<template>
  <div class="calendar-container" style="
    height: 100vh;
    display: block;">
    <todos style="width: 100%;height: 100%;display:flex;justify-content: center;align-items: center;" class="calendar-todos"></todos>
    <!-- 页脚 -->
    <div style="background: var(--favoriteBg)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import { asyncComponent } from '../utils/common';

  import myFooter from "./common/myFooter.vue";;
  // import DatePicker from 'v-calendar/lib/components/date-picker.umd'
  import todos from './common/todos.vue';
  // Vue.component('v-date-picker', DatePicker)
  // Register components in your 'main.js'
  export default {
    components: {
      // "v-date-picker":DatePicker,
      todos,
      myFooter
    },

    data() {
      return {
        card: null,
        vCalendarData:{
          selectedDate:{start:new Date(),end:new Date()}
        },
        wallpaperIndex:0,
        showEdit:true,
        wallpapers:[],
        collects: {},
        taskList:[],
        addTask:{
          "title": "s",
          "dependencyId": 0,
          "description": "这里是简介",
          "status": "doing",
          "startTime": this.formatDateToString(new Date()),
          "endTime": this.formatDateToString(new Date()),
          "urgency": 1,
          "executor": "0",
        },
      }
    },

    computed: {},

    watch: {

    },

    created() {
    },

    mounted() {
      this.getTasks(this.handleChange({start:new Date(),end:new Date()}))
    },

    methods: {
      isDark(){
        return document.documentElement.getAttribute('theme')=='dark';
      },
      saveTask(task) {
        task = task??this.addTask;
        this.$http.post(this.$constant.baseURL + "/todolist/saveTask", task, true)
          .then((res) => {
            if (res.code == 200) {
              this.addTask.title = "";
              this.taskList.push(task);
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      updateTask(task) {
        this.$http.post(this.$constant.baseURL + "/todolist/updateTask", task,true)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getTasks(selectedDate) {
        this.$http.post(this.$constant.baseURL + "/todolist/listTask", selectedDate)
          .then((res) => {
            if (!this.$common.isEmpty(res)) {
              this.taskList = res.data
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      handleChange(newDate){
        const startDate = new Date(newDate.start);
        startDate.setHours(0, 0, 0, 0); // 将时间部分设置为 0
        const endDate = new Date(newDate.end);
        endDate.setHours(23, 59, 59, 999); // 将时间部分设置为 0
        this.getTasks({startTime:this.formatDateToString(startDate),endTime:this.formatDateToString(endDate)})
      },
      formatDateToString(fdate){
        let date = new Date(fdate); // 获取当前时间
        let year = date.getFullYear().toString().padStart(4, '0'); // 年份
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份
        let day = date.getDate().toString().padStart(2, '0'); // 日期
        let hour = date.getHours().toString().padStart(2, '0'); // 小时
        let minute = date.getMinutes().toString().padStart(2, '0'); // 分钟
        let second = date.getSeconds().toString().padStart(2, '0'); // 秒钟
        let datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // 生成日期时间字符串
        return datetimeString
      }
    }
  }
</script>

<style scoped> :deep(.calendar-todos) .todos-container{
    flex-direction: row;
    justify-content: space-around;
    width: 720px;
    align-items: flex-start;
    height: unset;
  } :deep(.calendar-todos) .todo-app{
    margin:0;
  }
  .calendar-container {
    padding-top: 50px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "liga", "kern";
  }
  @keyframes move-video {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(calc(-100% + 400px));
    }
    100% {
      transform: translateY(0%);
    }
  }
  @media screen and (max-width: 620px) {
    .index-video {
      width: auto;
      height: 400px;
    }
    @keyframes move-video {
      0% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(calc(-100% + 100vw - 50px));
      }
      100% {
        transform: translateX(0);
      }
    }
    .card-container {
      margin-top: 0;
    }
  }
  .calendar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff9068;
    background: linear-gradient(45deg, #fd746c , #ff9068);
    height: 100%;
  }
  .todo-app {
    font-size: 18px;
    margin-top: 50px;
    min-width: 380px;
    max-width: 50%;
    min-height: 480px;
    max-height: 600px;
    background: var(--background);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(25,25,25,.25);
    padding: 2rem;
  }
  .todo-title {
    margin-bottom: auto;
    margin-top: 0;
    line-height: 1;
  }
  .todo-list {
    font-size: 100%;
    list-style: none;
    width: 100%;
    padding: .6em;
    overflow-x: hidden;
    margin-top: 2.5em;
  }
  .todo {
  line-height: 1.5;
  position: relative;
  padding: 0 2.5rem 0 .75rem;
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.todo:after {
  font-family: FontAwesome;
  content: "\f00c";
  position: absolute;
  right: .75rem;
  color: #2ecc71;
  opacity: 0;
  transform: scale(0);
  transition: transform, opacity, 0.25s cubic-bezier(0.55, 0, 0.1, 1);
}

.todo + .todo {
  margin-top: .5rem;
  padding-top: .5rem;
}

.todo + .todo:before {
  content: '';
  background: #e8ebed;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 2px;
}

.todo__content {
  position: relative;
  opacity: 1;
  text-transform: capitalize;
  cursor: pointer;
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
  background: #2E2E2E;
  transform-origin: center right;
  transform: scaleX(0);
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.todo.todo--completed:after {
  opacity: 1;
  transform: scale(1);
}

.todo.todo--completed .todo__content {
  opacity: 0.5;
}

.todo.todo--completed .todo__content:after {
  transform: scaleX(1);
  transform-origin: center left;
}
.todo-enter {
  opacity: 0;
  padding-top: 0;
  margin-top: 0;
  max-height: 0;
  transform: translateX(-100%);
  transition: opacity 500ms ease-out, transform 750ms cubic-bezier(0.87, -0.41, 0.19, 1.44), max-height 500ms ease-out, padding 500ms ease-out, margin 500ms ease-out;
}

.todo-enter.todo-enter-active {
  opacity: 1;
  max-height: 100px;
  transform: translateX(0);
}

.todo-leave {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 500ms ease-out, transform 750ms cubic-bezier(0.87, -0.41, 0.19, 1.44), max-height 500ms ease-out, padding 500ms ease-out, margin 500ms ease-out;
}

.todo-leave.todo-leave-active {
  opacity: 0;
  padding-top: 0;
  margin-top: 0;
  max-height: 0;
  transform: translateX(100%);
}

.add-todo {
  width: 80%;
  position: relative;
  margin: .5rem 0;
}

.add-todo__btn {
  text-align: center;
  color: #fafafa;
  line-height: 1;
  position: absolute;
  font-size: 150%;
  right: 0;
  top: 50%;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  background: #2ecc71;
  opacity: 0;
  transform: translate(0, -50%) scale(0) rotate(180deg);
  transition: transform, opacity, 0.5s cubic-bezier(0.87, -0.41, 0.19, 1.44);
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

.add-todo__input:focus + .add-todo__btn {
  opacity: 1;
  transform: translate(50%, -50%) scale(1) rotate(0deg);
}

.filters .filter__link {
  margin: 0 1em;
  font-size: 150%;
}

.filters .fa-list-ul {
  color: #3498db;
}

.filters .fa-times {
  color: #e74c3c;
}

.filters .fa-check {
  color: #2ecc71;
}

.filters .filter__link i {
  transition: transform 0.5s cubic-bezier(0.87, -0.41, 0.19, 1.44);
}

.filters .filter__link i:hover {
  transform: scale(1.1);
}

.filters .filter__link i:active {
  transform: scale(0.95);
}
  @media screen and (max-width: 620px) {
    .calendar-todos{
      margin-top:100px;
    }
    .v-calendar{
      margin: 80px 0px 20px 0;
    }
    .v-date-picker{
      width: 90vw;
    } :deep(.calendar-todos) .todo-app{
      margin-top:20px;
  } :deep(.todos-container){
      align-items: center !important;
      flex-direction: column !important;
    }
    .todo-app{
      margin-top: 0;
    }
    .card-container {
      margin-top: 0;
    }
  }

  @media screen and (max-width: 900px) {
    .favorite-item {
      width: calc(100% / 3 - 20px);
    }
  }

  @media screen and (max-width: 700px) {
    .favorite-item {
      width: calc(100% / 2 - 20px);
    }
  }

  @media screen and (max-width: 400px) {
    .favorite-item {
      width: calc(100% - 20px);
    }
  }
</style>
