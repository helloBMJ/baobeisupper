<template>
  <el-container>
    <el-form :model="form_dic" :rules="rules" label-width="100px">
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form_dic.description"
          placeholder="请填写中文描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input
          v-model="form_dic.value"
          type="text"
          placeholder="作为键值使用"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input
          v-model="form_dic.sort"
          type="number"
          placeholder="字典排序使用"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form_dic.name"
          placeholder="建议填写大写英文描述(USER_STATUS)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCreate">确定</el-button>
        <el-button type="success" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form_dic: {
        id: "",
        name: "",
        value: "",
        sort: "",
        description: "",
      },
      rules: {
        description: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入内容", trigger: "blur" }],
        value: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.form_dic.id = this.$route.query.id;
    this.getDicInfo();
  },
  methods: {
    getDicInfo() {
      this.$http.queryDictionaryData(this.form_dic.id).then((res) => {
        if (res.status === 200) {
          this.form_dic = res.data;
        }
      });
    },
    onCreate() {
      if (
        !this.form_dic.name ||
        !this.form_dic.value ||
        !this.form_dic.description
      ) {
        this.$message({
          message: "请输入内容提交",
          type: "error",
        });
        return;
      }
      this.$http.upDateDictionary(this.form_dic).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$router.go(-1);
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.el-input {
  width: 500px;
}
</style>
