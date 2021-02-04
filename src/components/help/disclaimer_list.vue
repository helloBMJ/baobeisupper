<template>
  <el-container>
    <el-form :model="create_form" label-width="100px">
      <el-form-item label="选择类型：">
        <el-select
          @change="onChange"
          v-model="create_form.category"
          placeholder="请选择"
        >
          <el-option
            v-for="item in category_list"
            :key="item.value"
            :label="item.description"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="免责声明：">
        <el-input
          type="textarea"
          rows="10"
          placeholder="请输入免责声明内容"
          v-model="create_form.content"
        ></el-input>
      </el-form-item>
      <el-form-item
        ><el-button type="primary" @click="onCreate"
          >确定</el-button
        ></el-form-item
      >
    </el-form>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      create_form: {
        category: "1",
      },
      category_list: [],
    };
  },
  mounted() {
    this.$setDictionary((e) => {
      e.find((item) => {
        switch (item.name) {
          case "DISCLAIMER_CATEGORY":
            this.category_list = item.childs;
            break;
        }
      });
    });
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$http.querydisclaimer(this.create_form.category).then((res) => {
        if (res.status === 200) {
          this.create_form = res.data;
          this.create_form.category = res.data.category + "";
        }
      });
    },
    onCreate() {
      if (!this.create_form.content) {
        this.$message({
          message: "请输入内容",
          type: "error",
        });
        return;
      }
      this.$http.createDisclaimerData(this.create_form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "创建成功",
            type: "success",
          });
        }
      });
    },
    onChange(e) {
      this.create_form.category = e;
      this.getDataList();
    },
  },
};
</script>

<style></style>
