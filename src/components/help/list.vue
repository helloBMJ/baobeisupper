<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="createdHelp">添加</el-button>
    </el-header>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="id" label="帮助ID" width="auto"></el-table-column>
      <el-table-column prop="sort" label="排序" width="auto"></el-table-column>
      <el-table-column
        prop="title"
        label="标题内容"
        width="auto"
      ></el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="auto"
      ></el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间"
        width="auto"
      ></el-table-column>
      <el-table-column
        prop="operating"
        label="操作"
        show-overflow-tooltip
        width="auto"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="changeData(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" @click="deleteData(scope.row)"
            >删除</el-button
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
        page: 1,
        per_page: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 根据分页设置的数据控制每页显示的数据条数及页码跳转页面刷新
    getPageData() {
      let start = (this.params.page - 1) * this.params.per_page;
      let end = start + this.params.per_page;
      this.schArr = this.tableData.slice(start, end);
    },
    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.params.per_page = val;
      this.getPageData();
      this.getDataList();
    },
    // 分页自带函数，当page变化时会触发此函数
    handleCurrentChange(val) {
      this.params.page = val;
      this.getPageData();
      this.getDataList();
    },
    getDataList() {
      this.$http.getHelpData({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.page = res.data.current_page;
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
    createdHelp() {
      this.$gotoPath("/create_help");
    },
    changeData(row) {
      this.$gotoPath(`/edit_help?id=${row.id}`);
    },
    deleteData(row) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteHelp(row.id).then((res) => {
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
  },
};
</script>

<style></style>
