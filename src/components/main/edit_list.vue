<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="addUser">添加管理员</el-button>
    </el-header>
    <myTable :table-list="tableData" :header="table_header"></myTable>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <myPagination
          :total="params.total"
          :pagesize="params.pagesize"
          :currentPage="params.currentPage"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></myPagination>
      </div>
    </el-footer>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="create_form" label-width="100px">
        <el-form-item label="角色名称:" prop="role_name">
          <el-select
            v-model="create_form.role_names"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in roles_list"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submitData"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import myPagination from "@/components/my_pagination";
import myTable from "@/components/my_table";
export default {
  components: {
    myPagination,
    myTable,
  },
  data() {
    return {
      tableData: [],
      params: {
        currentPage: 1,
        pagesize: 10,
        total: 0,
        row: 0,
        id: 0,
      },
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      dialogCreate: false,
      create_form: {
        id: "",
        role_names: [],
      },
      roles_list: [],
      table_header: [
        { prop: "id", label: "用户ID", width: "100" },
        { prop: "user_name", label: "用户名" },
        { prop: "phone", label: "联系方式" },
        { prop: "created_at", label: "创建时间" },
        {
          label: "操作",
          fixed: "right",
          width: "400",
          render: (h, data) => {
            return (
              <div>
                <el-button
                  type="success"
                  size="mini"
                  onClick={() => {
                    this.changeData(data.row);
                  }}
                >
                  管理员信息
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  onClick={() => {
                    this.bindRole(data.row);
                  }}
                >
                  绑定角色
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  onClick={() => {
                    this.deleteData(data.row);
                  }}
                >
                  删除
                </el-button>
              </div>
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.params.id = this.$route.query.id;
    this.getWebsiteToken();
  },
  methods: {
    getWebsiteRoles() {
      this.$http.getWebsiteRoles({ per_page: 100 }).then((res) => {
        if (res.status === 200) {
          this.roles_list = res.data.data;
        }
      });
    },
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.$route.query.id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.getDataList();
          this.getWebsiteRoles();
        }
      });
    },
    changeData(row) {
      this.$router.push(
        `/edit_admin?id=${row.id}&website_id=${row.website_id}`
      );
    },
    // editData(row) {
    //   this.$router.push(`/edit_list?id=${row.id}`);
    // },
    deleteData(row) {
      this.$confirm("此操作将删除该站点管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteWebUser(row.id).then((res) => {
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

    // 取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
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
    // 获取列表数据
    getDataList() {
      this.$http.getWebUser(this.params).then((res) => {
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
    // 绑定角色
    bindRole(row) {
      this.create_form.role_names = [];
      this.dialogTitle = "addData";
      this.dialogCreate = true;
      this.create_form.id = row.id;
      this.queryAdminRoles();
    },
    queryAdminRoles() {
      this.$http.queryAdminRoles(this.create_form.id).then((res) => {
        if (res.status === 200) {
          res.data.roles.map((item) => {
            this.create_form.role_names.push(item.name);
          });
        }
      });
    },
    submitData() {
      this.$http.resetUserRole(this.create_form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.dialogCreate = false;
        }
      });
    },
    addUser() {
      this.$gotoPath(`/add_admin_list?id=${this.params.id}`);
    },
  },
};
</script>

<style></style>
