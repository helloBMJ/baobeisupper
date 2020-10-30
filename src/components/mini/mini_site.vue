<template>
  <el-container>
    <el-header>
      <div v-if="$route.query.website_id">
        <i>站点ID：{{ $route.query.website_id }}；</i>
        <i>站点名称：{{ $route.query.website_name }}；</i>
        <i>
          审核状态：{{
            review_status === 0
              ? "审核成功"
              : review_status === 1
              ? "审核拒绝"
              : review_status === 2
              ? "审核中"
              : "已撤回"
          }}
        </i>
        <!-- <el-button type="success" @click="draftList">小程序代码草稿箱</el-button> -->
        <br />

        <el-button type="primary" @click="SubmitReview">{{
          btn_txt
        }}</el-button>

        <el-button
          v-if="review_status === 0"
          @click="publishMini"
          type="primary"
          >上线小程序</el-button
        >
      </div>
    </el-header>
    <el-table
      v-if="isReview === 1"
      ref="multipleTable"
      :data="tabelData"
      border
      tooltip-effect="dark"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="template_id"
        label="模板ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="200">
        <template slot-scope="scope">
          <p>{{ scope.row.create_time | time }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_version"
        label="版本号"
        width="100"
      ></el-table-column>
      <el-table-column prop="user_desc" label="项目备注"></el-table-column>
      <el-table-column
        prop="source_miniprogram_appid"
        label="小程序ID"
      ></el-table-column>
      <el-table-column
        prop="source_miniprogram"
        label="小程序名称"
      ></el-table-column>
      <el-table-column prop="developer" label="上传者名称"></el-table-column>
      <el-table-column label="操作" fixed="right" v-if="isReview">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="uploadCode(scope.row)"
            >上传代码</el-button
          >

          <el-button type="danger" size="mini" @click="deleteData(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="isReview === 0"
      :data="reviewList"
      border
      tooltip-effect="dark"
      style="width:100%"
    >
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="template_id" label="模板ID">
        <template slot-scope="scope">
          <p>{{ scope.row.template_id }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="website_id" label="提交站点ID"> </el-table-column>
      <el-table-column prop="user_version" label="提交版本号">
      </el-table-column>
      <el-table-column prop="user_desc" label="版本描述"> </el-table-column>
      <el-table-column prop="status" label="代码状态" :formatter="status">
      </el-table-column>
      <el-table-column
        prop="audit_status"
        label="审核状态"
        :formatter="audit_status"
      >
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间">
        <template slot-scope="scope">
          <p>{{ scope.row.created_at }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="reviewRecording(scope.row.id)" type="primary"
            >审核记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="上传代码" :visible.sync="dialogVisible" width="60%">
      <el-form
        :model="form_template"
        label-position="left"
        label-width="100px"
        :rules="rules"
        ref="form_template"
      >
        <el-form-item label="模板ID" prop="template_id">
          <el-input
            style="width:200px"
            v-model="form_template.template_id"
          ></el-input>
        </el-form-item>
        <div class="row div normal">
          <i class="">*</i>
          <el-form-item label="站点ID" prop="website_id">
            <el-input
              style="width:200px"
              v-model="form_template.ext_json.ext.website_id"
            ></el-input>
          </el-form-item>
        </div>
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
      website_id: "",
      params: {
        currentPage: 1,
        pagesize: 10,
        total: 0,
        row: 0,
      },
      tabelData: [],
      multipleSelection: [],
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
      auditid: "",
      review_status: "",
      wechatid: "",
      testerList: [],
      isReview: 1,
      reviewList: [],
      btn_txt: "模板列表",
    };
  },
  mounted() {
    this.website_id = this.$route.query.website_id;
    if (this.$route.query.website_id) {
      this.getWebsiteToken();
      this.queryReview();
    } else {
      this.getCodeTemplateList();
    }
    if (this.$route.query.isReview) {
      this.isReview = parseInt(this.$route.query.isReview);
      this.SubmitReview();
    }
  },
  methods: {
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.website_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          setTimeout(() => {
            this.getCodeTemplateList();
          }, 1000);
        }
      });
    },
    getCodeTemplateList() {
      this.$http.getCodeTemplateList({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tabelData = this.sortByKey(
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
    uploadCode(row) {
      this.dialogVisible = true;
      this.form_template.template_id = row.template_id;
      this.form_template.user_version = row.user_version;
      this.form_template.user_desc = row.user_desc;
      this.form_template.ext_json.ext.website_id = this.$route.query.website_id;
    },
    deleteData(row) {
      this.$confirm("此操作将删除该模板，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deletaTemplateData(row.template_id).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getCodeTemplateList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 上传代码
    uploadTemplateCode(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form_template.ext_json.ext.website_id) {
            this.$message({
              message: "请输入站点ID",
              type: "error",
            });
            return;
          }
          let ext_json = {
            ext: {
              website_id: this.form_template.ext_json.ext.website_id,
            },
          };
          let data = {
            template_id: this.form_template.template_id,
            ext_json: JSON.stringify(ext_json),
            user_version: this.form_template.user_version,
            user_desc: this.form_template.user_desc,
          };
          this.$http.uploadTemplateCode(data).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.getCodeTemplateList();
              this.queryReview();
              // 上传代码成功后直接提交代码到审核列表
              this.$http.SubmitReview().then((res) => {
                if (res.status === 200) {
                  this.auditid = res.data.auditid;
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    // 提交代码审核
    SubmitReview() {
      if (this.isReview === 0) {
        this.btn_txt = "审核列表";
        this.isReview = 1;
        this.getCodeTemplateList();
      } else if (this.isReview === 1) {
        this.isReview = 0;
        this.btn_txt = "模板列表";
        this.$http.getReviewCodeList().then((res) => {
          if (res.status === 200) {
            this.reviewList = res.data.data;
          }
        });
      }
    },
    // 过滤状态
    audit_status(row) {
      let audit_status =
        row.audit_status === 0
          ? "审核通过"
          : row.audit_status === 1
          ? "审核不通过"
          : row.audit_status === 2
          ? "审核中"
          : row.audit_status === 3
          ? "已撤回"
          : "审核延后";
      return audit_status;
    },
    status(row) {
      let status =
        row.status === 0 ? "提交代码" : row.status === 1 ? "提交审核" : "上线";
      return status;
    },
    // 查询审核状态
    queryReview() {
      this.$http.queryReview().then((res) => {
        if (res.status === 200) {
          this.review_status = res.data.status;
        }
      });
    },
    // 发布小程序
    publishMini() {
      this.$http.publishMini().then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "发布成功",
            type: "success",
          });
        }
      });
    },

    reviewRecording(id) {
      this.$router.push(`/review_audit_list?id=${id}`);
    },
    // 小程序草稿箱
    // draftList() {
    //   this.$router.push("/draft_list");
    // },
  },
};
</script>

<style scoped lang="scss">
.normal {
  line-height: 38px;
}
i {
  font-style: normal;
  color: #f56c6c;
  margin-right: 4px;
}
.el-header {
  font-size: 18px;
  font-weight: 600;
}
.el-table {
  margin-top: 30px;
}
.el-button {
  margin: 10px 4px;
}
</style>
