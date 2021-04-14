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
      <myTable :table-list="tableData" :header="table_header"></myTable>
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
import myTable from "@/components/my_table";
export default {
  components: {
    myTable,
  },
  data() {
    return {
      tableData: [],
      params: {
        page: 1,
        row: 10,
        keywords: "",
      },
      table_header: [
        { prop: "id", label: "ID", width: "100" },
        { prop: "ter_name", label: "网站名称" },
        {
          label: "网站地址",
          render: (h, data) => {
            return (
              <el-link href={data.row.ter_domain} target="_blank">
                {data.row.ter_domain}
              </el-link>
            );
          },
        },
        {
          label: "网站logo",
          render: (h, data) => {
            return <img width="200px" src={data.row.logo} />;
          },
        },
        { prop: "ter_server_ip", label: "网站IP" },
        { prop: "ter_appid", label: "APPID" },
        { prop: "ter_appsecret", label: "ter_appsecret" },
        {
          label: "操作",
          fixed: "right",
          width: "100",
          render: (h, data) => {
            return (
              <el-button
                onClick={() => {
                  this.bindTfy(data.row);
                }}
                type="success"
                size="mini"
              >
                绑定
              </el-button>
            );
          },
        },
      ],
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
