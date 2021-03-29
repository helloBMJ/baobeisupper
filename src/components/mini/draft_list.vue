<template>
  <el-container>
    <el-header>
      <div v-if="$route.query.website_id">
        <p>站点ID：{{ $route.query.website_id }}</p>
        <p>站点名称：{{ $route.query.website_name }}</p>
      </div>
      <p>
        微信开发者工具上传最新代码进入草稿箱后，需要将代码添加至模板列表后，进入模板列表显示最新提交记录
      </p>
    </el-header>
    <el-tabs>
      <el-table
        ref="multipleTable"
        :data="tabelData"
        border
        tooltip-effect="dark"
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="draft_id" label="草稿ID" width="100">
        </el-table-column>
        <el-table-column width="200" prop="create_time" label="创建时间">
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="addTemplate(scope.row)"
              type="success"
              size="mini"
              >添加至模板</el-button
            >
            <el-button
              @click="templateList(scope.row)"
              type="primary"
              size="mini"
              >模板列表</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tabelData: [],
      multipleTable: [],
    };
  },
  mounted() {
    if (this.$route.query.website_id) {
      this.getWebsiteToken();
    } else {
      this.getDataList();
    }
  },
  methods: {
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.$route.query.website_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.getDataList();
        }
      });
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getDataList() {
      this.$http.getCodeDraftList().then((res) => {
        if (res.status === 200) {
          this.tabelData = res.data.draft_list;
        }
      });
    },
    addTemplate(row) {
      this.$http.addDraftToTemplate(row.draft_id).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.templateList();
        }
      });
    },
    templateList() {
      if (this.$route.query.website_id) {
        this.$gotoPath(
          `/mini_site?website_id=${this.$route.query.website_id}&website_name=${this.$route.query.website_name}`
        );
      } else {
        this.$gotoPath(`/mini_site`);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-header {
  font-size: 18px;
  font-weight: 600;
}
.el-button {
  margin: 4px;
}
.el-table {
  margin-top: 40px;
}
</style>
