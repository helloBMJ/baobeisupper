<template>
  <el-container>
    <el-form :model="form" label-position="left">
      <el-form-item label="站点名称">
        <el-input v-model="form.name"></el-input>
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
    return {
      form: {
        id: "",
        name: ""
      }
    };
  },
  mounted() {
    this.form.id = this.$route.query.id;
    this.getDataList();
  },
  methods: {
    // 获取列表展示
    getDataList() {
      this.$http.queryWeb(this.form.id).then(res => {
        if (res.status === 200) {
          this.form = res.data;
        }
      });
    },
    goBack() {
      this.$router.push("/list");
    },
    onSubmit() {
      if (!this.form.name) {
        this.$message({
          message: "请输入内容后提交",
          type: "error"
        });
      } else {
        this.$http.updataWeb(this.form).then(res => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$router.push("/list");
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        });
      }
    }
  }
};
</script>

<style></style>
