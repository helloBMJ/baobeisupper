<template>
  <el-container>
    <el-form :model="form" label-position="left">
      <el-form-item label="帮助标题">
        <el-input placeholder="请输入" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="帮助内容">
        <el-form-item label="帮助内容">
          <UE :value="ueditor.value" :config="ueditor.config" ref="ue"></UE>
        </el-form-item>
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
        id: "",
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
  mounted() {
    this.form.id = parseInt(this.$route.query.id);
    this.getQueryHelp();
  },
  methods: {
    getQueryHelp() {
      this.$http.getQueryHelp(this.form.id).then((res) => {
        if (res.status === 200) {
          this.form = res.data;
          this.ueditor.value = this.form.content;
        } else {
          this.$message({
            message: "获取失败",
            type: "error",
          });
        }
      });
    },
    onSubmit() {
      this.form.content = this.$refs.ue.getUEContent();
      if (!this.form.title || !this.form.content || !this.form.sort) {
        this.$message({
          message: "请输入内容后提交",
          type: "error",
        });
      } else {
        this.$http.updataHelp(this.form).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$gotoPath("/help_list");
          } else {
            this.$message({
              message: "修改失败",
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
