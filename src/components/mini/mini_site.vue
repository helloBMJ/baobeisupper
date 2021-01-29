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
              : review_status === 3
              ? "已撤回"
              : review_status === 4
              ? "审核延后"
              : review_status === 5
              ? "未提交审核"
              : ""
          }}
        </i>
        <!-- <el-button type="success" @click="draftList">小程序代码草稿箱</el-button> -->
        <br />
        <div>
          <i>quoto剩余量：{{ query_quota.rest }}；</i>
          <i>当月分配quoto：{{ query_quota.limit }}；</i>
          <i>剩余加急次数：{{ query_quota.speedup_rest }}；</i>
          <i>当月分配加急次数：{{ query_quota.speedup_limit }}；</i>
        </div>
        <el-button type="primary" @click="SubmitReview">{{
          btn_txt
        }}</el-button>
        <el-popover
          placement="top-start"
          title="体验版二维码"
          width="200"
          trigger="click"
        >
          <el-image
            style="width: 180px; height: 180px"
            :src="url"
            fit="fit"
          ></el-image>
          <el-button slot="reference" type="primary" @click="getQrCode"
            >获取体验版二维码</el-button
          >
        </el-popover>
        <el-button slot="reference" type="success" @click="queryTesterList"
          >体验者列表</el-button
        >
        <el-button @click="goReviewStatusList" type="success"
          >通知用户列表</el-button
        >
        <el-button @click="uploadSuccessReview" type="primary"
          >提交审核</el-button
        >
        <el-button
          @click="revocationReview"
          v-if="review_status === 2"
          type="danger"
          >撤销审核</el-button
        >
        <el-button
          v-if="review_status === 0"
          @click="publishMini"
          type="success"
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
        ref="form_template"
      >
        <el-form-item label="模板ID" prop="template_id">
          <el-input
            style="width:200px"
            v-model="form_template.template_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="站点ID" prop="website_id">
          <el-input
            style="width:200px"
            v-model="form_template.ext_json.ext.website_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="站点模式" prop="mode">
          <el-radio
            v-for="item in website_mode_category_list"
            :key="item.id"
            v-model="form_template.ext_json.ext.mode"
            :label="item.value"
            @change="changeMode"
            >{{ item.description }}</el-radio
          >
        </el-form-item>
        <el-form-item label="pages路径">
          <el-tag
            style="margin:5px"
            v-for="(item, index) in form_template.ext_json.pages"
            :key="index"
            type="success"
            >{{ item }}</el-tag
          >
        </el-form-item>
        <el-form-item label="tabbar路径">
          <div
            class="p-label"
            v-for="(item, index) in form_template.ext_json.tabBar.list"
            :key="index"
          >
            <el-input style="width:100%" v-model="item.pagePath" size="mini">
              <template slot="prepend">pagePath：</template>
            </el-input>
            <el-input style="width:100%" v-model="item.text" size="mini">
              <template slot="prepend">text：</template>
            </el-input>
            <el-input style="width:100%" v-model="item.iconPath" size="mini">
              <template slot="prepend">iconPath：</template>
            </el-input>
            <el-input
              style="width:100%"
              v-model="item.selectedIconPath"
              size="mini"
            >
              <template slot="prepend">selectedIconPath：</template>
            </el-input>
          </div>
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
    <el-dialog title="体验者列表" :visible.sync="dialogVisibleList" width="60%">
      <el-input
        style="width:180px"
        v-model="wechatid"
        placeholder="请输入体验者微信号"
      ></el-input>
      <el-button type="primary" @click="bindTesterWechatId">添加</el-button>
      <el-table :data="testerList" border style="width:100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column
          prop="wechat_id"
          label="体验者微信号"
        ></el-table-column>
        <el-table-column prop="user_str" label="标识"></el-table-column>
        <el-table-column prop="created_at" label="添加时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="unbindTester(scope.row)"
              size="mini"
              >解除绑定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
      dialogVisibleList: false,
      form_template: {
        template_id: "",
        ext_json: {
          ext: {
            website_id: "",
            mode: "0",
          },
          pages: [
            "index/index",
            "index/project",
            "index/message",
            "index/mine",
          ],
          tabBar: {
            list: [
              {
                pagePath: "index/index",
                text: "首页",
                iconPath: "static/tab_icon/index-select.png",
                selectedIconPath: "static/tab_icon/index.png",
              },
              {
                pagePath: "index/project",
                text: "项目",
                iconPath: "static/tab_icon/ic_xiangmu_nor.png",
                selectedIconPath: "static/tab_icon/ic_xiangmu.png",
              },
              {
                pagePath: "index/message",
                text: "消息",
                iconPath: "static/tab_icon/message-select.png",
                selectedIconPath: "static/tab_icon/message.png",
              },
              {
                pagePath: "index/mine",
                text: "我的",
                iconPath: "static/tab_icon/main-select.png",
                selectedIconPath: "static/tab_icon/main.png",
              },
            ],
          },
        },
        user_version: "",
        user_desc: "",
      },
      auditid: "",
      review_status: "",
      // 体验者id
      wechatid: "",
      testerList: [],
      isReview: 1,
      reviewList: [],
      btn_txt: "模板列表",
      // 体验版二维码地址
      url: "",
      // 获取当月加急
      query_quota: {},
      website_mode_category_list: this.$getDictionary("WEBSITE_MODE_CATEGORY"),
      // 默认显示分销报备
    };
  },
  mounted() {
    this.website_id = this.$route.query.website_id;
    if (this.$route.query.website_id) {
      this.getWebsiteToken();
      this.getQueryQuota();
    } else {
      this.getCodeTemplateList();
    }
    if (this.$route.query.isReview) {
      this.isReview = parseInt(this.$route.query.isReview);
    }
  },
  methods: {
    // 获取当月的提审和加急次数
    getQueryQuota() {
      this.$http.getQueryQuota().then((res) => {
        if (res.status === 200) {
          this.query_quota = res.data;
        }
      });
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.website_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.getCodeTemplateList();
          this.SubmitReview();
        }
      });
    },
    getCodeTemplateList() {
      this.$http.getCodeTemplateList({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tabelData = res.data.template_list;
        }
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
      this.$message({
        message: "正在上传...",
        type: "success",
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .getWebsiteToken(this.form_template.ext_json.ext.website_id)
            .then((res) => {
              if (res.status === 200) {
                // 将token存在本地
                localStorage.setItem("admin_TOKEN", res.data.token);
                // 对比接口中token是否一致，一致提交
                if (res.data.token === localStorage.getItem("admin_TOKEN")) {
                  let ext_json = {
                    ext: {
                      website_id: this.form_template.ext_json.ext.website_id,
                      mode: this.form_template.ext_json.ext.mode,
                    },
                    pages: this.form_template.ext_json.pages,
                    tabBar: this.form_template.ext_json.tabBar,
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
                      this.dialogVisible = false;
                    }
                  });
                } else {
                  this.$message({
                    message: "提交站点不一致,请从新提交",
                    type: "error",
                  });
                }
              }
            });
        } else {
          return false;
        }
      });
    },
    // 上传成功显示提交审核
    uploadSuccessReview() {
      this.$message({
        message: "正在提交...",
        type: "success",
      });
      // 上传代码成功后直接提交代码到审核列表
      this.$http.SubmitReview().then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.auditid = res.data.auditid;
          this.queryReview();
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
            if (res.data.data[0].audit_id) {
              this.queryReview();
            }
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
          : row.audit_status === 4
          ? "审核延后"
          : row.audit_status === 5
          ? "未提交审核"
          : "";
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
    // 获取体验版二维码
    // 获取体验版二维码
    getQrCode() {
      this.$http.getQrCode().then((res) => {
        if (res.status === 200) {
          this.url = `data: image/jpeg;base64,${btoa(
            new Uint8Array(res.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`;
        }
      });
    },
    // 绑定体验者微信号
    bindTesterWechatId() {
      if (!this.wechatid) {
        this.$message({
          message: "请输入微信号后提交",
          type: "danger",
        });
        return;
      }
      this.$http.bindTesterWechatId({ wechatid: this.wechatid }).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "绑定成功",
            type: "success",
          });
          this.wechatid = "";
          this.queryTesterList();
        }
      });
    },
    // 查看体验者列表
    queryTesterList() {
      this.dialogVisibleList = true;
      this.$http.queryTesterList().then((res) => {
        if (res.status === 200) {
          this.testerList = res.data.data.filter((item) => {
            return item.status === 1;
          });
        }
      });
    },
    // 解除体验者绑定
    unbindTester(row) {
      this.$confirm("此操作将解绑该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .unbindTesterWechatId({
            wechatid: row.wechat_id,
            userstr: row.user_str,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "解绑成功",
                type: "success",
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "success",
              message: "已取消解绑",
            });
          });
      });
    },

    goReviewStatusList() {
      this.$router.push(`/review_status_list?website_id=${this.website_id}`);
    },
    // 改变小程序类型触发
    changeMode(e) {
      if (e == 0) {
        this.form_template.ext_json.window = {};
        this.form_template.ext_json.tabBar.color = "";
        this.form_template.ext_json.pages = [
          "index/index",
          "index/project",
          "index/message",
          "index/mine",
        ];
        this.form_template.ext_json.tabBar.list = [
          {
            pagePath: "index/index",
            text: "首页",
            iconPath: "static/tab_icon/index-select.png",
            selectedIconPath: "static/tab_icon/index.png",
          },
          {
            pagePath: "index/project",
            text: "项目",
            iconPath: "static/tab_icon/ic_xiangmu_nor.png",
            selectedIconPath: "static/tab_icon/ic_xiangmu.png",
          },
          {
            pagePath: "index/message",
            text: "消息",
            iconPath: "static/tab_icon/message-select.png",
            selectedIconPath: "static/tab_icon/message.png",
          },
          {
            pagePath: "index/mine",
            text: "我的",
            iconPath: "static/tab_icon/main-select.png",
            selectedIconPath: "static/tab_icon/main.png",
          },
        ];
      } else if (e == 1) {
        this.form_template.ext_json.window = {};
        this.form_template.ext_json.tabBar.color = "#999";
        this.form_template.ext_json.pages = [
          "only_build/pages/index/index",
          "only_build/pages/index/house_type",
          "only_build/pages/index/dynamic",
          "only_build/pages/index/loushu",
          "only_build/pages/index/mine",
        ];
        this.form_template.ext_json.tabBar.list = [
          {
            pagePath: "only_build/pages/index/index",
            text: "首页",
            iconPath: "static/only/home.png",
            selectedIconPath: "static/only/home_active.png",
          },
          {
            pagePath: "only_build/pages/index/house_type",
            text: "户型",
            iconPath: "static/only/build.png",
            selectedIconPath: "static/only/build_active.png",
          },
          {
            pagePath: "only_build/pages/index/dynamic",
            text: "动态",
            iconPath: "static/only/dynamic.png",
            selectedIconPath: "static/only/dynamic_active.png",
          },
          {
            pagePath: "only_build/pages/index/loushu",
            text: "楼书",
            iconPath: "static/only/build_book.png",
            selectedIconPath: "static/only/build_book_active.png",
          },
          {
            pagePath: "only_build/pages/index/mine",
            text: "我的",
            iconPath: "static/only/mine.png",
            selectedIconPath: "static/only/mine_active.png",
          },
        ];
      } else {
        this.form_template.ext_json.window = {
          navigationBarBackgroundColor: "#35A7F4",
          navigationBarTextStyle: "white",
        };
        this.form_template.ext_json.pages = [
          "weifangchan/pages/index/index",
          "weifangchan/pages/index/find_room",
          "weifangchan/pages/index/find",
          "weifangchan/pages/index/mine",
        ];
        this.form_template.ext_json.tabBar.color = "#ccc";
        this.form_template.ext_json.tabBar.list = [
          {
            pagePath: "weifangchan/pages/index/index",
            text: "首页",
            iconPath: "static/wei/shouye.png",
            selectedIconPath: "static/wei/shouye-active.png",
          },
          {
            pagePath: "weifangchan/pages/index/find_room",
            text: "找房",
            iconPath: "static/wei/zhaofang.png",
            selectedIconPath: "static/wei/zhaofang-active.png",
          },
          {
            pagePath: "weifangchan/pages/index/find",
            text: "发现",
            iconPath: "static/wei/faxian.png",
            selectedIconPath: "static/wei/faxian-active.png",
          },
          {
            pagePath: "weifangchan/pages/index/mine",
            text: "我的",
            iconPath: "static/wei/wode.png",
            selectedIconPath: "static/wei/wode-active.png",
          },
        ];
      }
    },
    // 撤销审核
    revocationReview() {
      this.$confirm("此操作将撤销审核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.revocationReview().then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "已撤销!",
              });
              this.getCodeTemplateList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
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
  margin-top: 60px;
}
.el-button {
  margin: 10px 4px;
}
.p-label {
  margin: 4px 0;
  padding: 10px 0;
}
</style>
