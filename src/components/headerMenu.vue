<template>
  <div class="header div row">
    <div class="left">
      <img src="https://images.tengfangyun.com/tf/images/logo.png" alt />
    </div>

    <div class="right div row">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in levelList" :key="item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="right_r div row">
        <div class="admin div row">
          <!-- 头像 -->
          <el-avatar
            :size="40"
            src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg"
            @error="errorHandler"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
          <el-dropdown @command="handleCommand">
            <el-button split-button type="primary" class="el-dropdown-link">
              {{ admin_list.user_name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <el-button type="success" @click="bingWx">绑定微信</el-button> -->
        <el-button type="danger" @click="loginOut">退出登录</el-button>
      </div>
      <el-dialog title="修改密码" :visible.sync="dialogPassword">
        <el-form
          :rules="rules3"
          ref="form_password"
          status-icon
          :model="form_password"
        >
          <el-form-item
            label="请输入原密码"
            label-width="200px"
            prop="old_password"
          >
            <el-input v-model="form_password.old_password"></el-input>
          </el-form-item>
          <el-form-item
            label="请输入新密码"
            label-width="200px"
            prop="new_password"
          >
            <el-input v-model="form_password.new_password"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            label-width="200px"
            prop="new_password_confirmation"
          >
            <el-input
              v-model="form_password.new_password_confirmation"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPassword = false">取 消</el-button>
          <el-button type="primary" @click="isModify">确 定</el-button>
        </div>
      </el-dialog>
      <!-- <el-button>通知中心</el-button>
      <el-select v-model="value" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>-->
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    var validatePass5 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form_password.new_password_confirmation !== "") {
          this.$refs.form_password.validateField("new_password_confirmation");
        }
        callback();
      }
    };
    var validatePass6 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form_password.new_password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      value: "",
      options: [],
      levelList: [],
      admin_list: {},
      dialogPassword: false,
      form_password: {
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
      password_loading: false,
      rules3: {
        old_password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        new_password: [{ validator: validatePass5, trigger: "blur" }],
        new_password_confirmation: [
          { validator: validatePass6, trigger: "blur" },
        ],
      },
      auth_code: "",
      expires_in: "",
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
    this.getadmin();
  },
  mounted() {
    // if (this.GetQueryString("auth_code") && this.GetQueryString("expires_in")) {
    //   this.auth_code = this.GetQueryString("auth_code");
    //   this.expires_in = this.GetQueryString("expires_in");
    //   this.sendCode();
    // }
  },
  methods: {
    ...mapMutations(["login"]),
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => item.name);
      const first = matched[0];
      if (
        first &&
        first.name.trim().toLocaleLowerCase() !== "home".toLocaleLowerCase()
      ) {
        matched = [{ path: "/home", meta: { title: "云报备" } }].concat(
          matched
        );
      }
      this.levelList = matched;
    },
    loginOut() {
      // this.$store.commit("login", ""); //更新userInfo
      // localStorage.removeItem("TOKEN");
      // localStorage.removeItem("user_name");
      // this.$router.push("/login");

      // 注销后 清除session信息 ，并返回登录页
      window.localStorage.removeItem("TOKEN");
      localStorage.removeItem("user_name");
      this.$router.push("/login");
    },
    // 头像展示
    errorHandler() {
      return true;
    },
    // 获取信息展示
    getadmin() {
      this.$http.getAdmin().then((res) => {
        if (res.status === 200) {
          this.admin_list = res.data;
        }
      });
    },
    handleCommand() {
      this.dialogPassword = true;
    },
    isModify() {
      this.$http.updataAdmin(this.form_password).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialogPassword = false;
        }
      });
    },
    // bingWx() {
    //   let url = "https://fenxiao.zaodaoxiao.com/admin";
    //   this.$http.openWX(url).then((res) => {
    //     if (res.status === 200) {
    //       window.location.href = res.data.url;
    //     }
    //   });
    // },
    // sendCode() {
    //   this.$http
    //     .sendWxCode({
    //       auth_code: this.auth_code,
    //       expires_in: this.expires_in,
    //     })
    //     .then((res) => {
    //       if (res.status === 200) {
    //         this.$message({
    //           message: "授权成功",
    //           type: "success",
    //         });
    //       } else {
    //         this.$message({
    //           message: "授权失败",
    //           type: "error",
    //         });
    //       }
    //     });
    // },
    // // 截取地址栏参数
    // GetQueryString(name) {
    //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //   var r = window.location.search.substr(1).match(reg);
    //   if (r != null) return unescape(r[2]);
    //   return null;
    // },
  },
};
</script>

<style lang="scss">
.header {
  .el-breadcrumb {
    color: #fff;
  }
  align-items: center;
  width: 100%;
  background: #fff;
  justify-content: space-between;
  .left {
    width: 200px;
    margin: auto 0;
    font-size: 32px;
    color: #2366a8;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin: 8px 30px;
    p {
      color: #9c9fa6;
      margin: auto 10px;
    }
    .el-button {
      padding: 5px;
      height: 34px;
      margin: auto 5px;
    }
    .el-select {
      width: 250px;
      border: none;
      border-radius: 0;
      .el-select {
        height: 30px;
      }
    }
  }
  .admin {
    align-items: center;
    .el-avatar {
      margin: 0 10px;
    }
  }
}
</style>
