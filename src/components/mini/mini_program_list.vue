<template>
  <el-container>
    <el-header class="div row">
      <div style="margin-left:10px">
        <div class="div row input-box">
          <el-button type="primary" @click="dialogVisible = true"
            >勾选需要上传的站点后点击</el-button
          >
          <!-- <el-button
            :disabled="submit_audit_status !== 0"
            type="success"
            @click="onlineCode"
            >上线</el-button
          > -->
          <el-input
            v-model="params.name"
            placeholder="请输入站点名称"
            @input="onInput"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
      </div>
    </el-header>
    <el-table
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width:100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="最新上传/提交/上线信息" type="expand" width="200">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="最新提交审核版本ID：">
              <span>{{ scope.row.submit_audit_id }}</span>
            </el-form-item>
            <el-form-item label="最新提交审核的审核状态：">
              <span>
                {{
                  scope.row.submit_audit_status === 0
                    ? "审核成功"
                    : scope.row.submit_audit_status === 1
                    ? "审核被拒绝"
                    : scope.row.submit_audit_status === 2
                    ? "审核中"
                    : scope.row.submit_audit_status === 3
                    ? "已撤回"
                    : "审核延后"
                }}
              </span>
              <el-button
                v-if="scope.row.submit_audit_status === 1"
                size="mini"
                type="danger"
                @click="findReason(scope.row)"
                >查看原因</el-button
              >
            </el-form-item>
            <el-form-item label="最新提交审核版本的更新时间：">
              <span>{{ scope.row.submit_audit_updated_at }}</span>
            </el-form-item>
            <el-form-item label="最新上传版本ID：">
              <span>{{ scope.row.last_version_id }}</span>
            </el-form-item>
            <el-form-item label="最新上传版本更新时间：">
              <span>{{ scope.row.last_updated_at }}</span>
            </el-form-item>
            <el-form-item label="最新上线版本ID：">
              <span>{{ scope.row.release_id }}</span>
            </el-form-item>
            <el-form-item label="最新版本上线时间：">
              <span>{{ scope.row.release_updated_at }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="站点ID"></el-table-column>
      <el-table-column prop="name" label="站点名称"></el-table-column>
      <el-table-column
        prop="submit_audit_user_version"
        label="最新提交审核版本号"
      ></el-table-column>
      <el-table-column
        prop="last_user_version"
        label="最新上传版本号"
      ></el-table-column>
      <el-table-column
        prop="release_user_version"
        label="最新上线版本号"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.submit_audit_status !== 0"
            type="success"
            @click="onlineCode(scope.row)"
            >上线</el-button
          >
          <el-button size="mini" type="primary" @click="templateList(scope.row)"
            >审核记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-footer>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.params.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="this.params.pagesize"
          layout="total , sizes, prev, pager, next, jumper"
          :total="this.params.total"
        ></el-pagination>
      </div>
    </el-footer>
    <el-dialog
      title="上传代码（最新上传模板的信息）"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form
        :model="form_template"
        label-position="left"
        label-width="100px"
        :rules="rules"
        ref="form_template"
      >
        <el-form-item
          label="站点ID"
          prop="website_id"
          v-if="multipleSelection.length === 1"
        >
          <el-input
            style="width:200px"
            v-model="multipleSelection[0].id"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板ID" prop="template_id">
          <el-input
            style="width:200px"
            v-model="form_template.template_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="user_version">
          <el-input
            style="width:200px"
            v-model="form_template.user_version"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="user_desc">
          <el-input
            style="width:500px;"
            rows="8"
            cols="20"
            type="textarea"
            v-model="form_template.user_desc"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="uploadTemplateCode('form_template')" type="primary"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 多选列表
      multipleSelection: [],
      params: {
        currentPage: 1,
        pagesize: 10,
        total: 0,
        row: 0,
        name: "",
      },
      // 上传
      dialogVisible: false,
      form_template: {
        template_id: "",
        ext_json: {
          ext: {
            website_id: "",
          },
        },
        user_version: "",
        user_desc: "",
      },
      rules: {
        template_id: [
          { required: true, message: "请输入模板ID", trigger: "blur" },
        ],
        user_version: [
          { required: true, message: "请输入版本号", trigger: "blur" },
        ],
        user_desc: [
          { required: true, message: "请输入版本描述", trigger: "blur" },
        ],
      },
      // 模板列表数据
      template_list: [],
      submit_audit_status: "",
    };
  },
  mounted() {
    this.getDataList();
    this.getTemplateList();
    // this.queryReview();
  },
  methods: {
    // 查询小程序审核状态
    queryReview() {
      this.$http.queryReview().then((res) => {
        if (res.status === 200) {
          this.submit_audit_status = res.data.status;
        }
      });
    },
    // 多选列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.form_template.template_id = this.template_list[0].template_id;
        this.form_template.user_version = this.template_list[0].user_version;
        this.form_template.user_desc = this.template_list[0].user_desc;
      } else {
        this.form_template.template_id = "";
        this.form_template.user_desc = "";
        this.form_template.user_version = "";
      }
    },
    // 根据分页设置的数据控制每页显示的数据条数及页码跳转页面刷新
    getPageData() {
      let start = (this.params.currentPage - 1) * this.params.pagesize;
      let end = start + this.params.pagesize;
      this.schArr = this.tableData.slice(start, end);
    },
    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.params.pagesize = val;
      this.getPageData();
      this.getDataList();
    },
    // 分页自带函数，当currentPage变化时会触发此函数
    handleCurrentChange(val) {
      this.params.currentPage = val;
      this.getPageData();
      this.getDataList();
    },
    getTemplateList() {
      this.$http.getCodeTemplateList({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.template_list = this.sortByKey(
            res.data.template_list,
            "template_id"
          );
        }
      });
    },
    // 排序
    //arr是传入的带数字的数组
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? 1 : x > y ? -1 : 0;
      });
    },
    getDataList() {
      this.$http.getMiniProgramList(this.params).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.currentPage = res.data.current_page;
          this.params.total = res.data.total;
          this.params.row = res.data.per_page;
        } else {
          this.$message({
            message: "请求数据列表失败",
            type: "error",
          });
        }
      });
    },
    onInput() {
      if (!this.params.name) {
        this.params.currentPage = 1;
        this.params.pagesize = 10;
        this.getDataList();
      }
    },
    search() {
      this.params.currentPage = 1;
      this.params.pagesize = 10;
      this.getDataList();
    },
    // 通过promise队列提交审核
    async promiseCreate(thing) {
      let promise = Promise.resolve();
      thing.forEach((item) => {
        promise = promise.then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              this.getAdminToken(item);
              resolve("ok");
            }, 1000);
          });
        });
      });
    },
    // 获取站点token并在获取上传数据
    getAdminToken(item) {
      this.$http.getWebsiteToken(item.id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          let ext_json = { ext: { website_id: item.id } };
          let data = {
            template_id: this.form_template.template_id,
            user_version: this.form_template.user_version,
            user_desc: this.form_template.user_desc,
            ext_json: JSON.stringify(ext_json),
          };
          this.$http.uploadTemplateCode(data).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$http.SubmitReview().then((res) => {
                if (res.status === 200) {
                  this.$message({
                    message: "上传成功",
                    type: "success",
                  });
                }
              });
            }
          });
          this.dialogVisible = false;
          this.$message({
            message: item.name + "上传成功",
            type: "success",
          });
        }
      });
    },
    // 点击提交按钮
    uploadTemplateCode(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.promiseCreate(this.multipleSelection);
        } else {
          return false;
        }
      });
    },
    onlineCode(row) {
      this.$http.getWebsiteToken(row.id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.$http.publishMini().then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "发布成功",
                type: "success",
              });
            }
          });
        }
      });
    },
    templateList(row) {
      this.$router.push(
        `/mini_site?website_id=${row.id}&website_name=${row.name}&isReview=1`
      );
    },
    findReason(row) {
      this.$router.push(`/review_audit_list?id=${row.submit_audit_id}`);
    },
  },
};
</script>

<style lang="scss">
.el-header {
  justify-content: flex-start;
}
.demo-table-expand {
  font-size: 0;
  .el-form-item__label {
    width: 220px;
    color: #99a9bf;
  }
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.el-button {
  margin-right: 10px;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
