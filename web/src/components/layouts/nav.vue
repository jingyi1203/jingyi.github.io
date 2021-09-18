<template>
  <div class="wraper">
    <div class="nav-wraper">
      <div class="logo-bg">
        <img src="../../assets/image_logo@2x.png" alt="" />
        <div
          class="logo-bg jianbian"
          src="../../assets/image_jianbian@2x.png"
        ></div>
      </div>
      <div class="nav-left">
        <h5 @click="$router.push('/')">
          <div class="logo"></div>

          <!-- 文史库 -->
        </h5>
        <ul class="nav-menu">
          <li
            v-for="item in menuItem"
            :key="item.path"
            @click="routerTo(item.path)"
            :class="{
              active:
                currentPath === item.path || currentPath === item.otherPath
            }"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="nav-right">
        <div class="nav-upload" @click="uploads">
          <img src="../../assets/ic_upload@2x.png" alt="" />
          <span>上传文史资料</span>
        </div>
        <el-button v-if="!isLogin" class="nav-login" @click="login">
          登录
        </el-button>
        <div v-else class="login-show">
          <el-dropdown @command="dropClick">
            <div class="el-dropdown-link">
              <div class="user-photo">
                <img
                  :src="
                    (userInfo && userInfo.avatar) ||
                      require('../../assets/defaultPhoto.png')
                  "
                  alt=""
                />
              </div>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">个人中心</el-dropdown-item>
              <el-dropdown-item :command="2">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-dialog
      class="login-dialog"
      title="提示"
      :visible.sync="dialogVisibleLogin"
      width="514px"
    >
      <div class="dialog-close" @click="closeDialog">
        <img src="../../assets/ic_close@2x (1).png" alt="" />
      </div>
      <p>
        观海账号登录
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            clearable
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
        </el-form-item> -->
        <el-form-item>
          <el-button
            class="sub-btn"
            type="primary"
            @click="submitForm('ruleForm')"
            >登&emsp;&emsp;录</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisibleLogin: false,
      rememberPassword: false,
      userInfo: {},
      ruleForm: {
        username: "",
        password: ""
      },
      menuItem: [
        { title: "史料库", path: "/", otherPath: "/uploads" },
        { title: "史志库", path: "/shiZhiku" }
      ],
      rules: {
        username: [{ required: true, message: "请填写账号", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }]
      }
    };
  },
  computed: {
    currentPath() {
      return this.$store.state.path || "/";
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  },
  created() {
    if (localStorage.token) {
      this.$store.commit("isLogin", true);
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    } else {
      this.$store.commit("isLogin", false);
    }
  },
  methods: {
    routerTo(path) {
      this.$router.push(path);
    },
    login() {
      this.dialogVisibleLogin = true;
    },
    closeDialog() {
      this.dialogVisibleLogin = false;
    },
    dropClick(type) {
      if (type === 1) {
        this.$router.push("/userCenter");
      } else if (type === 2) {
        this.loginout();
      }
    },
    loginout() {
      this.$store.commit("isLogin", false);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      this.$router.push("/");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$post("/api/auth", this.ruleForm)
            .then(res => {
              if (res) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("userInfo", JSON.stringify(res.user));
                this.$store.commit("isLogin", true);
                this.$message.success("登录成功");
                this.ruleForm.password = "";
                this.dialogVisibleLogin = false;
              }
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    uploads() {
      if (this.isLogin) {
        this.$router.push("/uploads");
      } else {
        this.$message.warning("登录后才可以上传文件");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login-show {
  margin-left: 40px;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  i {
    color: #fff;
  }
}
.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  // border: 1px solid darkgoldenrod;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.login-dialog {
  position: relative;
  .dialog-close {
    cursor: pointer;
    position: absolute;
    right: 16px;
    top: 16px;
    width: 24px;
    height: 24px;
    img {
      width: 100%;
    }
  }
  & ::v-deep .el-dialog__header {
    display: none;
  }
  & ::v-deep .el-dialog__body {
    padding: 40px 72px;
    box-sizing: border-box;
    border-radius: 6px;
    p {
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 32px;
      text-align: center;
      margin-bottom: 40px;
    }
  }
  & ::v-deep .el-form-item {
    margin-bottom: 18px;
  }
  & ::v-deep .sub-btn {
    height: 48px;
    background: linear-gradient(
      270deg,
      rgba(201, 183, 150, 1) 0%,
      rgba(179, 150, 105, 1) 100%
    );
    width: 100%;
    border-radius: 24px;
    font-size: 18px;
    border: none;
  }
}
.wraper {
  position: absolute;
  width: 100vw;
}
.nav-wraper {
  position: fixed;
  width: 100vw;
  top: 0;
  z-index: 100;
  .logo-bg {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
    }
    // border: 1px solid darkcyan;
  }
  .jianbian {
    width: 24px;
    left: 60px;
  }
  height: 60px;
  padding: 0 40px 0 24px;
  display: flex;
  box-sizing: border-box;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 1) 0%,
    rgba(34, 34, 34, 1) 100%
  );
  color: #fff;
  .nav-left {
    display: flex;
    flex: 1;
    h5 {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
      line-height: 60px;
      cursor: pointer;
      .logo {
        width: 25px;
        height: 44px;
        // border: 1px solid #fff;
        margin-right: 14px;
      }
    }
    .nav-menu {
      margin-left: 108px;
      display: flex;
      li {
        padding: 20px 0;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        margin-right: 32px;
        cursor: pointer;
        border-bottom: 4px solid rgba(34, 34, 34, 1);
        &.active {
          border-bottom: 4px solid rgba(201, 183, 150, 1);
          color: rgba(201, 183, 150, 1);
        }
      }
    }
  }
  .nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    .nav-upload {
      height: 28px;
      cursor: pointer;
      img {
        width: 28px;
        height: 28px;
        margin-right: 12px;

        vertical-align: middle;
      }
      span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 28px;
      }
    }
    .nav-login {
      height: 40px;
      background: linear-gradient(
        270deg,
        rgba(201, 183, 150, 1) 0%,
        rgba(179, 150, 105, 1) 100%
      );
      border-radius: 4px;
      border: none;
      color: #fff;
      margin-left: 40px;
    }
  }
}
</style>
