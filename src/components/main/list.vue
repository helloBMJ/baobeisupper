<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createdWeb">创建站点</el-button>
      <div class="div row input-box">
        <el-input
          v-model="company_name"
          placeholder="请输入站点名称"
          @input="onInput"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </div>
    </el-header>
    <el-table
      ref="multipleTable"
      :row-key="getRowKey"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        prop="id"
        label="站点ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="name" label="站点名称" width="auto">
        <!-- </el-table-column>
        <el-table-column prop="url" label="站点链接" width="auto">-->
      </el-table-column>
      <el-table-column prop="wx_pub_app_id" label="公众号" width="auto">
        <template slot-scope="scope">
          <el-tag
            @click="authWxPubAppId(scope.row.wx_pub_app_id)"
            type="success"
            class="bang"
            v-if="scope.row.wx_pub_app_id"
            >{{ scope.row.wx_pub_app_id }}</el-tag
          >
          <el-tag type="danger" class="weibang" v-else>暂未授权公众号</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="wx_mini_program_app_id"
        label="小程序"
        width="auto"
      >
        <template slot-scope="scope">
          <el-tag
            @click="authWxMiniAppId(scope.row.wx_mini_program_app_id)"
            type="success"
            class="bang"
            v-if="scope.row.wx_mini_program_app_id"
            >{{ scope.row.wx_mini_program_app_id }}</el-tag
          >
          <el-tag type="danger" class="weibang" v-else
            >暂未授权微信小程序</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="auto"
      ></el-table-column>
      <el-table-column
        prop="operating"
        label="操作"
        show-overflow-tooltip
        width="600"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="changeData(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" @click="deleteData(scope.row)"
            >删除</el-button
          >
          <el-button type="success" size="mini" @click="editData(scope.row)"
            >管理员列表</el-button
          >
          <el-button
            v-if="scope.row.wx_mini_program_app_id"
            type="success"
            size="mini"
            @click="authorization(scope.row)"
            >小程序授权</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.params.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="this.params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.params.total"
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
      multipleSelection: [],
      params: {
        currentPage: 1,
        pagesize: 10,
        total: 0,
        row: 0,
      },
      company_name: "",
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    changeData(row) {
      this.$router.push(`/updata_web?id=${row.id}`);
    },
    editData(row) {
      this.$router.push(`/edit_list?id=${row.id}`);
    },
    deleteData(row) {
      this.$confirm("此操作将删除该站点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteWeb(row.id).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getDataList();
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
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 取消全选
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
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

    // 获取列表数据
    getDataList() {
      this.$http
        .websiteList(
          this.params.currentPage,
          this.params.pagesize,
          this.company_name
        )
        .then((res) => {
          if (res.status === 200) {
            this.tableData = res.data.data;
            this.params.currentPage = res.data.current_page;
            this.params.total = res.data.total;
            this.params.row = res.data.per_page;
          } else {
            this.$message({
              message: "请求数据列表失败！",
              type: "error",
            });
          }
        });
    },
    createdWeb() {
      this.$router.push("/add_list");
    },
    search() {
      this.params.currentPage = 1;
      this.params.pagesize = 10;
      this.getDataList();
    },
    onInput() {
      if (this.company_name === "") {
        this.params.currentPage = 1;
        this.params.pagesize = 10;
        this.getDataList();
      }
    },
    authorization(row) {
      this.$router.push(
        `/draft_list?website_id=${row.id}&website_name=${row.name}`
      );
      // this.$router.push(`/mini_site?website_id=${row.id}`);
    },
    authWxPubAppId(id) {
      this.$router.push(`/authorization_list?wxpubappid=${id}`);
    },
    authWxMiniAppId(id) {
      this.$router.push(`/authorization_list?wxminiappid=${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.el-tag {
  cursor: pointer;
}
.el-header {
  justify-content: space-between;
  align-items: center;
}
.el-button {
  border: none;
  border-radius: 4px;
}
.el-input {
  border-left: none;
  width: 200px;
}
</style>
