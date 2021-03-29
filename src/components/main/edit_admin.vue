<template>
  <el-container>
    <el-form
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input
          placeholder="请输入用户名"
          v-model="form.user_name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="手机号码">
        <el-input placeholder="请输入联系方式" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="form.password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password_confirmation" label="确认密码">
        <el-input
          placeholder="请确认密码"
          type="password"
          v-model="form.password_confirmation"
        ></el-input>
      </el-form-item>
      <div class="btn-box">
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="goBack">返回站点列表</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-container>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.password_confirmation !== "") {
          this.$refs.form.validateField("password_confirmation");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(value);
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      form: {
        id: "",
        website_id: "",
        user_name: "",
        phone: "",
        password: "",
        password_confirmation: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password_confirmation: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.form.website_id = parseInt(this.$route.query.website_id);
    this.form.id = parseInt(this.$route.query.id);
    this.getWebsiteToken();
  },
  methods: {
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.form.website_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.getDataQuery();
        }
      });
    },
    goBack() {
      this.$gotoPath(`edit_list?id=${this.form.website_id}`);
    },
    getDataQuery() {
      this.$http.queryAdminMsg(this.form.id).then((res) => {
        if (res.status === 200) {
          this.form = res.data;
        }
      });
    },
    onSubmit() {
      this.$http.editAdminMsg(this.form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$gotoPath(`edit_list?id=${this.form.website_id}`);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
</style>
