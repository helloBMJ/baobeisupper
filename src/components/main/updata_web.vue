<template>
  <el-container>
    <el-form
      :model="form"
      label-position="left"
      label-width="100px"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="website_company_name">
        <el-input
          placeholder="请输入公司名称"
          v-model="form.website_company_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="website_contact_name">
        <el-input
          placeholder="请输入联系人名称"
          v-model="form.website_contact_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="website_contact_phone">
        <el-input
          maxlength="11"
          type="number"
          placeholder="联系电话"
          v-model="form.website_contact_phone"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="城市名称" prop="website_city_name">
        <el-input
          placeholder="请输入站点所在城市"
          v-model="form.website_city_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="版本类型" prop="website_version_category">
        <el-radio
          v-for="item in website_version_category_list"
          :key="item.value"
          v-model="form.website_version_category"
          :label="item.value"
          >{{ item.description }}</el-radio
        >
      </el-form-item>
      <el-form-item label="版本模式" prop="website_mode_category">
        <el-radio
          v-for="item in website_mode_category_list"
          :key="item.id"
          v-model="form.website_mode_category"
          :label="item.value"
          >{{ item.description }}</el-radio
        >
      </el-form-item>
      <el-form-item label="使用时长">
        <el-date-picker
          v-model="time_value"
          type="daterange"
          range-separator="至"
          :start-placeholder="form.lease_start"
          :end-placeholder="form.lease_end"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
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
    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };

    return {
      form: {
        id: "",
        name: "",
        website_company_name: "",
        website_contact_name: "",
        website_contact_phone: "",
        website_city_name: "",
        website_version_category: "",
        // 使用开始和结束时间
        lease_start: "",
        lease_end: "",
        // 0:试用版，1：正式版,
        website_mode_category: "",
      },
      website_version_category_list: [
        { value: 0, description: "试用版" },
        { value: 1, description: "正式版" },
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        website_company_name: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        website_contact_name: [
          { required: true, message: "请输入联系人名称", trigger: "blur" },
        ],
        website_city_name: [
          { required: true, message: "请输入城市名称", trigger: "blur" },
        ],
        website_contact_phone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
        website_version_category: [
          { required: true, message: "请输入联系人名称", trigger: "blur" },
        ],
      },
      time_value: [],
      website_mode_category_list: this.$getDictionary("WEBSITE_MODE_CATEGORY"),
    };
  },
  mounted() {
    this.form.id = this.$route.query.id;
    this.getDataList();
  },
  methods: {
    // 获取列表展示
    getDataList() {
      this.$http.queryWeb(this.form.id).then((res) => {
        if (res.status === 200) {
          this.form = res.data;
          this.form.website_mode_category = this.form.website_mode_category.toString();
        }
      });
    },
    goBack() {
      this.$gotoPath("/list");
    },
    onSubmit() {
      this.form.lease_start = this.time_value[0];
      this.form.lease_end = this.time_value[1];
      if (!this.form.name) {
        this.$message({
          message: "请输入内容后提交",
          type: "error",
        });
      } else {
        this.$http.updataWeb(this.form).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$gotoPath("/list");
          } else {
            this.$message({
              message: "修改失败",
              type: "error",
            });
          }
        });
      }
    },
  },
};
</script>

<style></style>
