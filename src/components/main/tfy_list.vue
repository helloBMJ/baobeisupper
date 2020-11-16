<template>
  <el-container>
    <el-header class="div row">
      <div class="div row input-box">
        <el-input
          v-model="params.keywords"
          placeholder="请输入站点名称"
          @input="onInput"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </div>
    </el-header>
    <el-main>
      <el-table :data="tableData" tooltip-effect="dark" style="width:100%">
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="网站名称" prop="ter_name"></el-table-column
        ><el-table-column label="网站地址" prop="ter_domain"></el-table-column>
        <el-table-column label="网站logo" prop="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="网站IP" prop="ter_server_ip"></el-table-column>
        <el-table-column label="APPID" prop="ter_appid"></el-table-column>
        <el-table-column
          label="ter_appsecret"
          prop="ter_appsecret"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="bindTfy(scope.row)" type="success" size="mini"
              >绑定</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          @prev-click="prevClick"
          @next-click="nextClick"
          :current-page="params.page"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      params: {
        page: 1,
        row: 10,
        keywords: "",
      },
    };
  },
  mounted() {
    if (this.$route.query.site_id) {
      this.getSiteToken();
    }
  },
  methods: {
    getDataList() {
      this.$http.getTfySiteList({ params: this.params }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.list;
        }
      });
    },
    getSiteToken() {
      this.$http.getWebsiteToken(this.$route.query.site_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          setTimeout(() => {
            this.getDataList();
          }, 200);
        }
      });
    },
    prevClick(val) {
      this.params.page = val;
      this.getDataList();
    },
    nextClick(val) {
      this.params.page = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getDataList();
    },
    bindTfy(row) {
      this.$http
        .bindTfySite({
          app_id: row.ter_appid,
          app_secret: row.ter_appsecret,
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "绑定成功",
              type: "success",
            });
          }
        });
    },
    onInput() {
      if (this.params.keywords === "") {
        this.params.page = 1;
        this.getDataList();
      }
    },
    search() {
      this.params.page = 1;
      this.getDataList();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  justify-content: space-between;
  align-items: center;
}
</style>
