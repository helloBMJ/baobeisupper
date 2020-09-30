<template>
  <el-container>
    <el-header>
      <h4>小程序审核通过</h4>
      <div class="div row input-box">
        <el-input
          @change="search"
          v-model="name"
          placeholder="请输入查找用户名称"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
        <el-button type="success" @click="createUserNotice"
          >添加通知用户</el-button
        >
      </div>
    </el-header>
    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column
        prop="status"
        label="是否开启通知"
        :formatter="formatStatus"
      ></el-table-column>
      <el-table-column prop="website_id" label="站点ID"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="wx_open_id" label="公众号"></el-table-column>
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
    <el-dialog @close="closeDialog" :visible.sync="dialogUser" title="创建">
      <el-form :model="create_Notice" label-position="left" label-width="150px">
        <el-form-item label="用户名：">
          <el-input
            placeholder="请输入"
            v-model="create_Notice.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="公众号open_id：">
          <el-input
            style="width:400px"
            placeholder="请输入"
            v-model="create_Notice.wx_open_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否开启通知：">
          <el-switch
            v-model="create_Notice.status"
            active-color="#13ce66"
            inactive-color="#eeeeee"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            rows="3"
            placeholder="请输入"
            v-model="create_Notice.remark"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      params: {
        currentPage: 1,
        pagesize: 10,
        total: 0,
        row: 0,
      },
      tableData: [],
      create_Notice: {
        name: "",
        wx_open_id: "",
        // 用户通知状态  0 ：通知  1：不通知
        status: 0,
        remark: "",
      },
      dialogUser: false,
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    search() {
      this.params.currentPage = 1;
      this.params.pagesize = 10;
      this.getDataList();
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
      this.$http
        .getUserNoticeList({ params: this.params }, this.name)
        .then((res) => {
          if (res.status === 200) {
            this.tableData = res.data.data;
            this.params.page = res.data.current_page;
            this.params.total = res.data.total;
            this.params.row = res.data.per_page;
          }
        });
    },
    onSubmit() {
      if (!this.create_Notice.id) {
        this.$http.createUserNotice(this.create_Notice).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getDataList();
            this.dialogUser = false;
          }
        });
      } else {
        this.$http.updateUserNotice(this.create_Notice).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getDataList();
            this.dialogUser = false;
          }
        });
      }
    },
    createUserNotice() {
      this.dialogUser = true;
    },
    changeData(row) {
      this.dialogUser = true;
      this.create_Notice.name = row.name;
      this.create_Notice.id = row.id;
      this.create_Notice.wx_open_id = row.wx_open_id;
      this.create_Notice.remark = row.remark;
      this.create_Notice.status = row.status;
    },
    closeDialog() {
      this.create_Notice = {};
    },
    deleteData(row) {
      this.$confirm("此操作将删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteUserNotice(row.id).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消删除",
          });
        });
    },
    formatStatus(row) {
      let status = row.status === 0 ? "开启" : "关闭";
      return status;
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
.input-box {
  margin: 20px 0;
}
.el-table {
  margin-top: 50px;
}
</style>
