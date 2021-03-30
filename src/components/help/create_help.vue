<template>
  <el-container>
    <el-form :model="form" label-position="left">
      <el-form-item label="帮助标题">
        <el-input placeholder="请输入" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="帮助内容">
        <UE
          @input="inputUe"
          :value="ueditor.value"
          :config="ueditor.config"
          ref="ue"
        ></UE>
      </el-form-item>
      <el-form-item label="排序">
        <el-input
          type="number"
          placeholder="请输入"
          v-model="form.sort"
        ></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="goBack">返回列表</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
/* eslint-disable */
import UE from "@/components/ueditor";
export default {
  components: { UE },
  data() {
    return {
      form: {
        title: "",
        content: "",
        sort: "",
      },
      ueditor: {
        value: "",
        config: {
          initialFrameWidth: "100%",
        },
      },
      ue: "ue",
    };
  },
  methods: {
    inputUe(obj) {
      // 编辑器内容有变动，具体处理自行修改
      this.form.content = obj.content;
    },
    onSubmit() {
      if (!this.form.title || !this.form.content || !this.form.sort) {
        this.$message({
          message: "请输入内容后提交",
          type: "error",
        });
      } else {
        this.$http.createHelpData(this.form).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "创建成功",
              type: "success",
            });
            this.$gotoPath("/help_list");
          } else {
            this.$message({
              message: "创建失败",
              type: "error",
            });
          }
        });
      }
    },
    goBack() {
      this.$gotoPath("/help_list");
    },
  },
};
</script>

<style></style>
