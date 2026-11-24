<template>
  <div>
    <!-- 登陆和注册 -->
    <div v-if="$common.isEmpty(currentUser)"
         class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                :src="$constant.two_poem_image[Math.floor(Math.random() * $constant.two_poem_image.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="in-up" id="loginAndRegist">
        <div class="form-container sign-up-container">
          <div class="myCenter">
            <h1>注册</h1>
            <input v-model="username" type="text" placeholder="用户名">
            <input v-model="password" type="password" placeholder="密码">
            <button @click="regist()">> 注册</button>
            <span @click="signIn()">去登录</span>
          </div>
        </div>
        <div class="form-container sign-in-container">
          <div class="myCenter">
            <h1>登录</h1>
            <input v-model="account" type="text" placeholder="用户名/邮箱/手机号">
            <input v-model="password" type="password" placeholder="密码">
            <a href="#" @click="changeDialog('找回密码')">忘记密码？</a>
            <button @click="login()">>登录</button>
            <span @click="signUp()">去注册</span>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel myCenter overlay-left">
              <h1>已有帐号？</h1>
              <p>请登录🚀</p>
              <button class="ghost" @click="signIn()">登录</button>
            </div>
            <div class="overlay-panel myCenter overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册吧😃</p>
              <button class="ghost" @click="signUp()">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                :src="$constant.two_poem_image[Math.floor(Math.random() * $constant.two_poem_image.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="shadow-box-mini user-info" style="display: flex">
        <div class="user-left">
          <div>
            <el-avatar class="user-avatar" @click="changeDialog('修改头像')" :size="60"
                       :src="currentUser.avatar"></el-avatar>
          </div>
          <div class="myCenter" style="margin-top: 12px">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input v-model="currentUser.username"></el-input>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.phoneNumber)">
                  {{ currentUser.phoneNumber }} <span class="changeInfo" @click="changeDialog('修改手机号')">修改（功能未接入）</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定手机号')">绑定手机号（功能未接入）</span></div>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.email)">
                  {{ currentUser.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentUser.gender">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input v-model="currentUser.introduction"
                          maxlength="60"
                          type="textarea"
                          show-word-limit></el-input>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <proButton :info="'提交'"
                       @click="submitUserInfo()"
                       :before="$constant.before_color_2"
                       :after="$constant.after_color_2">
            </proButton>
          </div>
        </div>
        <div class="user-right">

        </div>
      </div>
    </div>


    <el-dialog :title="dialogTitle"
               v-model="showDialog"
               width="30%"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div class="myCenter" style="flex-direction: column">
        <div>
          <div v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
            <div style="margin-bottom: 5px">手机号：</div>
            <el-input v-model="phoneNumber"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
            <div style="margin-bottom: 5px">邮箱：</div>
            <el-input v-model="email"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadImage :prefix="'userAvatar'" @addImage="addPicture" :maxSize="1"
                            :maxNumber="1"></uploadImage>
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div class="myCenter" style="margin-bottom: 12px">
              <el-radio-group v-model="passwordFlag">
                <el-radio :label="1" style="margin-right: 10px">手机号</el-radio>
                <el-radio :label="2">邮箱</el-radio>
              </el-radio-group>
            </div>
            <div v-if="passwordFlag === 1">
              <div style="margin-bottom: 5px">手机号：</div>
              <el-input v-model="phoneNumber"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input v-model="password"></el-input>
            </div>
            <div v-else-if="passwordFlag === 2">
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input v-model="password"></el-input>
            </div>
          </div>
        </div>
        <div style="display: flex;margin-top: 30px" v-show="dialogTitle !== '修改头像'">
          <proButton :info="codeString"
                     v-show="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号' || dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱' || dialogTitle === '找回密码'"
                     @click="getCode()"
                     :before="$constant.before_color_1"
                     :after="$constant.after_color_1"
                     style="margin-right: 20px">
          </proButton>
          <proButton :info="'提交'"
                     @click="submitDialog()"
                     :before="$constant.before_color_2"
                     :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '../store';
import { ElMessage } from 'element-plus';
import proButton from "./common/proButton.vue";
import uploadImage from "./common/uploadImage.vue";

// 注入依赖
const $http = inject('$http');
const $common = inject('$common');
const $constant = inject('$constant');

// 路由和store
const router = useRouter();
const store = useMainStore();

// 响应式状态
const currentUser = computed(() => store.currentUser);
const username = ref("");
const account = ref("");
const password = ref("");
const phoneNumber = ref("");
const email = ref("");
const avatar = ref("");
const showDialog = ref(false);
const code = ref("");
const dialogTitle = ref("");
const codeString = ref("验证码");
const passwordFlag = ref(null);
const intervalCode = ref(null);

// 方法
const addPicture = (res) => {
  avatar.value = res;
  submitDialog();
};

const signUp = () => {
  document.querySelector("#loginAndRegist").classList.add('right-panel-active');
};

const signIn = () => {
  document.querySelector("#loginAndRegist").classList.remove('right-panel-active');
};

const login = () => {
  if ($common.isEmpty(account.value) || $common.isEmpty(password.value)) {
    ElMessage({
      message: "请输入账号或密码！",
      type: "error"
    });
    return;
  }

  let user = {
    account: account.value.trim(),
    password: $common.encrypt(password.value.trim())
  };

  $http.post($constant.baseURL + "/user/login", user, false, false)
    .then((res) => {
      if (!$common.isEmpty(res.data)) {
        store.loadCurrentUser(res.data);
        localStorage.setItem("userToken", res.data.accessToken);
        account.value = "";
        password.value = "";
        router.push({path: '/'});
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
};

const regist = () => {
  if ($common.isEmpty(username.value) || $common.isEmpty(password.value)) {
    ElMessage({
      message: "请输入用户名或密码！",
      type: "error"
    });
    return;
  }

  if (username.value.indexOf(" ") !== -1 || password.value.indexOf(" ") !== -1) {
    ElMessage({
      message: "用户名或密码不能包含空格！",
      type: "error"
    });
    return;
  }

  let user = {
    username: username.value.trim(),
    password: $common.encrypt(password.value.trim())
  };

  $http.post($constant.baseURL + "/user/regist", user)
    .then((res) => {
      if (!$common.isEmpty(res.data)) {
        store.loadCurrentUser(res.data);
        localStorage.setItem("userToken", res.data.accessToken);
        username.value = "";
        password.value = "";
        router.push({path: '/'});
        let userToken = $common.encrypt(localStorage.getItem("userToken"));
        window.open($constant.imBaseURL + "?userToken=" + userToken);
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
};

const submitUserInfo = () => {
  if (!checkParameters()) {
    return;
  }

  let user = {
    username: currentUser.value.username,
    gender: currentUser.value.gender
  };

  if (!$common.isEmpty(currentUser.value.introduction)) {
    user.introduction = currentUser.value.introduction.trim();
  }

  ElMessage.confirm('确认保存？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    $http.post($constant.baseURL + "/user/updateUserInfo", user)
      .then((res) => {
        if (!$common.isEmpty(res.data)) {
          store.loadCurrentUser(res.data);
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
        }
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: "error"
        });
      });
  }).catch(() => {
    ElMessage({
      type: 'success',
      message: '已取消保存!'
    });
  });
};

const checkParams = (params) => {
  if (dialogTitle.value === "修改手机号" || dialogTitle.value === "绑定手机号" || (dialogTitle.value === "找回密码" && passwordFlag.value === 1)) {
    params.flag = 1;
    if ($common.isEmpty(phoneNumber.value)) {
      ElMessage({
        message: "请输入手机号！",
        type: "error"
      });
      return false;
    }
    if (!(/^1[345789]\d{9}$/.test(phoneNumber.value))) {
      ElMessage({
        message: "手机号格式有误！",
        type: "error"
      });
      return false;
    }
    params.place = phoneNumber.value;
    return true;
  } else if (dialogTitle.value === "修改邮箱" || dialogTitle.value === "绑定邮箱" || (dialogTitle.value === "找回密码" && passwordFlag.value === 2)) {
    params.flag = 2;
    if ($common.isEmpty(email.value)) {
      ElMessage({
        message: "请输入邮箱！",
        type: "error"
      });
      return false;
    }
    if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email.value))) {
      ElMessage({
        message: "邮箱格式有误！",
        type: "error"
      });
      return false;
    }
    params.place = email.value;
    return true;
  }
  return false;
};

const checkParameters = () => {
  if ($common.isEmpty(currentUser.value.username)) {
    ElMessage({
      message: "请输入用户名！",
      type: "error"
    });
    return false;
  }

  if (currentUser.value.username.indexOf(" ") !== -1) {
    ElMessage({
      message: "用户名不能包含空格！",
      type: "error"
    });
    return false;
  }
  return true;
};

const changeDialog = (value) => {
  if (value === "修改头像") {
    if ($common.isEmpty(currentUser.value.email)) {
      ElMessage({
        message: "请先绑定邮箱！",
        type: "error"
      });
      return;
    }
  }
  dialogTitle.value = value;
  showDialog.value = true;
};

const submitDialog = () => {
  if (dialogTitle.value === "修改头像") {
    if ($common.isEmpty(avatar.value)) {
      ElMessage({
        message: "请上传头像！",
        type: "error"
      });
    } else {
      let user = {
        avatar: avatar.value.trim()
      };

      $http.post($constant.baseURL + "/user/updateUserInfo", user)
        .then((res) => {
          if (!$common.isEmpty(res.data)) {
            store.loadCurrentUser(res.data);
            clearDialog();
            ElMessage({
              message: "修改成功！",
              type: "success"
            });
          }
        })
        .catch((error) => {
          ElMessage({
            message: error.message,
            type: "error"
          });
        });
    }
  } else if (dialogTitle.value === "修改手机号" || dialogTitle.value === "绑定手机号" || dialogTitle.value === "修改邮箱" || dialogTitle.value === "绑定邮箱") {
    updateSecretInfo();
  } else if (dialogTitle.value === "找回密码") {
    if (passwordFlag.value !== 1 && passwordFlag.value !== 2) {
      ElMessage({
        message: "请选择找回方式！",
        type: "error"
      });
    } else {
      updateSecretInfo();
    }
  }
};

const updateSecretInfo = () => {
  if ($common.isEmpty(code.value)) {
    ElMessage({
      message: "请输入验证码！",
      type: "error"
    });
    return;
  }
  if ($common.isEmpty(password.value)) {
    ElMessage({
      message: "请输入密码！",
      type: "error"
    });
    return;
  }
  let params = {
    code: code.value.trim(),
    password: $common.encrypt(password.value.trim())
  };
  if (!checkParams(params)) {
    return;
  }

  if (dialogTitle.value === "找回密码") {
    $http.post($constant.baseURL + "/user/updateForForgetPassword", params, false, false)
      .then((res) => {
        clearDialog();
        ElMessage({
          message: "修改成功，请重新登陆！",
          type: "success"
        });
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: "error"
        });
      });
  } else {
    $http.post($constant.baseURL + "/user/updateSecretInfo", params, false, false)
      .then((res) => {
        if (!$common.isEmpty(res.data)) {
          store.loadCurrentUser(res.data);
          clearDialog();
          ElMessage({
            message: "修改成功！",
            type: "success"
          });
        }
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: "error"
        });
      });
  }
};

const getCode = () => {
  if (codeString.value === "验证码") {
    // 获取验证码
    let params = {};
    if (!checkParams(params)) {
      return;
    }

    let url;
    if (dialogTitle.value === "找回密码") {
      url = "/user/getCodeForForgetPassword";
    } else {
      url = "/user/getCodeForBind";
    }

    $http.get($constant.baseURL + url, params)
      .then((res) => {
        ElMessage({
          message: "验证码已发送，请注意查收！",
          type: "success"
        });
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: "error"
        });
      });
    codeString.value = "30";
    intervalCode.value = setInterval(() => {
      if (codeString.value === "0") {
        clearInterval(intervalCode.value)
        codeString.value = "验证码";
      } else {
        codeString.value = (parseInt(codeString.value) - 1) + "";
      }
    }, 1000);
  } else {
    ElMessage({
      message: "请稍后再试！",
      type: "warning"
    });
  }
};

const clearDialog = () => {
  password.value = "";
  phoneNumber.value = "";
  email.value = "";
  avatar.value = "";
  showDialog.value = false;
  code.value = "";
  dialogTitle.value = "";
  passwordFlag.value = null;
};
</script>

<style scoped>

  .in-up-container {
    height: 100vh;
    position: relative;
  }

  .in-up {
    opacity: 0.9;
    border-radius: 10px;
    box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
    position: relative;
    overflow: hidden;
    width: 750px;
    max-width: 100%;
    min-height: 450px;
  }

  .in-up p {
    font-size: 14px;
    letter-spacing: 1px;
    margin: 20px 0 30px 0;
  }

  .in-up a {
    color: var(--black);
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
  }

  .form-container {
    position: absolute;
    height: 100%;
    transition: all 0.5s ease-in-out;
  }
  .form-container span{
    padding: 20px;
    display: none;
    text-decoration: underline;
  }
  .sign-in-container {
    left: 0;
    width: 50%;
  }

  .sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
  }

  .form-container div {
    background: var(--white);
    flex-direction: column;
    padding: 0 8%;
    height: 100%;
  }

  .form-container input {
    background: var(--maxLightGray);
    border-radius: 2px;
    border: none;
    padding: 12px 15px;
    margin: 10px 0;
    width: 100%;
    outline: none;
  }

  .in-up button {
    border-radius: 2rem;
    border: none;
    background: var(--lightRed);
    color: var(--white);
    font-size: 16px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 2px;
    cursor: pointer;
  }

  .in-up button:hover {
    animation: scale 0.8s ease-in-out;
  }

  .in-up button.ghost {
    background: transparent;
    border: 1px solid var(--white);
  }

  .sign-up-container button {
    margin-top: 20px;
  }

  .overlay-container {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
  }

  .overlay {
    background: var(--gradualRed);
    color: var(--white);
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
  }

  .overlay-panel {
    position: absolute;
    top: 0;
    flex-direction: column;
    height: 100%;
    width: 50%;
    transition: all 0.5s ease-in-out;
  }

  .overlay-right {
    right: 0;
    transform: translateY(0);
  }

  .overlay-left {
    transform: translateY(-20%);
  }

  .in-up.right-panel-active .sign-in-container {
    transform: translateY(100%);
  }

  .in-up.right-panel-active .overlay-container {
    transform: translateX(-100%);
  }

  .in-up.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
  }

  .in-up.right-panel-active .overlay {
    transform: translateX(50%);
  }

  .in-up.right-panel-active .overlay-left {
    transform: translateY(0);
  }

  .in-up.right-panel-active .overlay-right {
    transform: translateY(20%);
  }

  .user-container {
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .user-info {
    backdrop-filter: blur(2px);
    width: 85%;
    z-index: 10;
    margin-top: 70px;
    height: calc(100vh - 90px);
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
  }

  .user-left {
    width: 50%;
    background: var(--maxMaxWhiteMask);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 20px;
  }

  .user-right {
    width: 50%;
    background: var(--maxWhiteMask);
    padding: 20px;
  }

  .user-title {
    text-align: right;
    user-select: none;
  }

  .user-content {
    text-align: left;
  }

  .user-title div {
    height: 55px;
    line-height: 55px;
    text-align: center;
  }

  .user-content > div {
    height: 55px;
    display: flex;
    align-items: center;
  }

  .user-content :deep(.el-input__inner,) .user-content :deep(.el-textarea__inner) {
    border: none;
    background: var(--whiteMask);
  }

  .user-content :deep(.el-input__count) {
    background: var(--transparent);
    user-select: none;
  }

  .changeInfo {
    color: var(--white);
    font-size: 0.75rem;
    cursor: pointer;
    background: var(--themeBackground);
    padding: 3px;
    border-radius: 0.2rem;
    user-select: none;
  }

  @media screen and (max-width: 920px) {
    .user-info {
      width: 90%;
    }

    .user-left {
      width: 100%;
    }

    .user-right {
      display: none;
    }
  }
  @media screen and (max-width: 768px) {
    .sign-up-container{
      transform: translateX(0%) !important;
    }
    .form-container{
      width:100%;
    }
    .form-container span{
      display: block;
    }
    .overlay-container{
      display: none;
    }
  }
</style>
