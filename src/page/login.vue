<template>
  <div class="login-container">
    <el-form
      :model="ruleForm2"
      :rules="rules2"
      status-icon
      ref="ruleForm2"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <div class="div row header">
        <h3 class="title">报备总控</h3>
        <el-button type="primary" @click="switchLog"
          >点击切换登录方式</el-button
        >
      </div>
      <div v-if="login_method" style="margin-top:10%">
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm2.username"
            auto-complete="off"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm2.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            type="text"
            v-model="ruleForm2.captcha"
            auto-complete="off"
            placeholder="验证码"
          ></el-input>
        </el-form-item>
        <div class="captcha-box div row">
          <img
            :src="
              `https://yun.tfcs.cn/api/auth/super/admin/login/captcha?time=${captchaImg}`
            "
            alt=""
          />
          <el-button type="primary" size="mini" @click="changeCaptcha"
            >点击更换验证码</el-button
          >
        </div>
        <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit"
            >登录</el-button
          >
        </el-form-item>
      </div>
      <div class="root" v-else>
        <el-form
          :model="Register"
          ref="RegisterForm"
          label-width="0"
          class="RegisterForm"
        >
          <el-form-item prop="phone">
            <el-input
              v-model="Register.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="验证码" class="code">
            <el-input
              v-model="Register.sendcode"
              placeholder="请输入验证码"
            ></el-input>
            <el-button
              type="button"
              @click="sendcode"
              :disabled="disabled"
              v-if="disabled == false"
              >发送验证码
            </el-button>
            <el-button
              type="button"
              @click="sendcode"
              :disabled="disabled"
              v-if="disabled == true"
              >{{ btntxt }}
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              :disabled="disabledTel"
              type="primary"
              @click="submitForm"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- <valid-code :value.sync="validCode"></valid-code> -->
    </el-form>
  </div>
</template>

<script>
// import axios from "axios";
// import validCode from "@/components/validCode";
// import { mapMutations } from "vuex";

//先引入登录接口
export default {
  data() {
    return {
      //登录状态
      isLogin: false,
      // 加载状态
      logining: false,
      ruleForm2: {
        // 测试账号
        username: "",
        // 测试密码
        password: "",
        captcha: "",
      },
      rules2: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      // https://fenxiao.zaodaoxiao.com/api/auth/admin/login/captcha
      captchaImg: null,
      checked: false,
      // 登录方式切换 0，yonghu   1,shouji
      login_method: true,
      Register: {
        phone: "",
        sendcode: "",
      },
      disabled: false,
      time: 0,
      btntxt: "重新发送",
      disabledTel: false,
    };
  },
  mounted() {
    this.changeCaptcha();
  },
  components: {
    // validCode
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true;
          if (
            // 测试账号
            this.ruleForm2.username === "" ||
            // 测试密码
            this.ruleForm2.password === ""
          ) {
            this.logining = false;
            this.$alert("用户名或密码输入错误", "警告", {
              confirmButtonText: "ok",
            });
            this.isLogin = false;
          } else {
            // let token = "Bearer " + localStorage.getItem("TOKEN");
            this.$http
              .login({
                user_name: this.ruleForm2.username,
                password: this.ruleForm2.password,
                captcha: this.ruleForm2.captcha,
              })
              .then((res) => {
                if (res.status === 200) {
                  //登陆成功后调用第2步store里面的login方法，并将username传递过去，并跳转到home主页面
                  localStorage.setItem("sup_TOKEN", res.data.token);
                  localStorage.setItem("user_name", this.ruleForm2.username);
                  this.$message({
                    message: "登录成功！",
                    type: "success",
                  });
                  this.$store.commit("login", res.data.token);
                  this.$router.push("/list");
                }
              });
            // this.$router.push({ path: "/home" });
            this.changeCaptcha();
          }
        } else {
          this.$message({
            message: "请输入内容后提交",
            type: "error",
          });
          return false;
        }
      });
    },
    changeCaptcha() {
      this.captchaImg = parseInt(Math.random() * (10000 + 1), 10);
      // this.captchaImg = `https://yun.tfcs.cn/api/auth/super/admin/login/captcha?${time}`;
    },
    switchLog() {
      this.login_method = !this.login_method;
    },
    //手机验证发送验证码
    sendcode() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.Register.phone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true,
        });
        return;
      }
      if (!reg.test(this.Register.phone)) {
        this.$message({
          message: "请输入正确的手机号",
          center: true,
        });
        return;
      } else {
        // console.log(this.Register.phone);
        this.$http
          .sendPhoneCode({
            phone: this.Register.phone,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "发送成功",
                type: "success",
                center: true,
              });
              this.time = 60;
              this.disabled = true;
              this.timer();
            }
          });
      }
    },
    //60S倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btntxt = "获取验证码";
        this.disabled = false;
      }
    },
    submitForm() {
      if (!this.Register.phone) {
        this.$message({
          message: "请输入手机号",
          type: "error",
        });
        return;
      } else if (!this.Register.sendcode) {
        this.$message({
          message: "请输入验证码",
          type: "error",
        });
      } else {
        this.$http
          .loginByphone({
            phone: this.Register.phone,
            captcha: this.Register.sendcode,
          })
          .then((res) => {
            if (res.status === 200) {
              //登陆成功后调用第2步store里面的login方法，并将username传递过去，并跳转到home主页面
              localStorage.setItem("sup_TOKEN", res.data.token);
              localStorage.setItem("user_name", this.ruleForm2.username);
              this.$message({
                message: "登录成功！",
                type: "success",
              });
              this.$store.commit("login", res.data.token);
              this.$router.push("/list");
            }
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
.captcha-box {
  img {
    margin-right: 20px;
  }
}
.header {
  justify-content: space-between;
  align-items: center;
}
.root {
  background-size: 100% 100%;
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  form {
    width: 100%;
    margin-top: 10%;
    .code {
      .el-input {
        width: 55%;
        border-radius: 0px;
        float: left;
        display: inline-block;
      }
      .el-button {
        width: 45%;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: 0px;
        float: left;
        display: inline-block;
      }
    }
    .el-button--primary {
      width: 100%;
      border: none;
    }
  }
}
</style>
