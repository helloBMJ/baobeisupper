<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
      <div class="div row search-box">
        <el-input
          @input="onInput"
          v-model="params.name"
          placeholder="请输入角色名称"
        ></el-input>
        <el-button @input="search" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </el-header>
    <el-main>
      <myTable :table-list="tableData" :header="table_header"></myTable>
      <el-footer>
        <!-- 分页 -->
        <div class="pagination-box">
          <myPagination
            :total="params.total"
            :pagesize="params.per_page"
            :currentPage="params.page"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          ></myPagination>
        </div>
      </el-footer>
    </el-main>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="角色名称：" prop="name">
          <el-input
            v-model="form_create.name"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="switch_type"
          label="初始化授权："
          prop="init_permission"
        >
          <el-switch
            v-model="form_create.init_permission"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreate">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="权限分配" :visible.sync="dialogRole">
      <el-form :model="permission_form">
        <el-form-item label="权限分配：" class="tree-box">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-tree
            style="margin-left:80px"
            :data="permission_list"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :default-expanded-keys="default_expanded_keys"
            @check="checkChange"
            @check-change="checkChangeVal"
            :props="defaultProps"
            :indent="0"
            check-strictly
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="选择后重置权限：">
          <el-button type="primary" @click="resetPer" size="mini"
            >重置权限</el-button
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
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
        name: "",
      },
      form_create: {},
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      dialogCreate: false,
      switch_type: true,
      permission_list: [],
      // 重置权限
      permission_form: {
        id: "",
        permission_names: [],
      },
      // 撤销
      revoke_permission_form: {
        id: "",
        permission_name: "",
      },
      // 分配
      give_permission_form: {
        id: "",
        permission_name: "",
      },
      dialogRole: false,
      role_permission_list: [],
      filter_permission_list: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      submit_permission: false,
      default_expanded_keys: [],
      // 获取全部权限
      check_permission_list: [],
      // 全选非全选择
      checkAll: false,
      table_header: [
        { prop: "id", label: "ID", width: "100" },
        { prop: "website_id", label: "站点id" },
        { prop: "name", label: "角色名称" },
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
                  修改
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  onClick={() => {
                    this.onShow(data.row);
                  }}
                >
                  分配
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
    this.getWebsiteToken();
  },
  methods: {
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.$route.query.id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          this.queryWebsiteInfo();
        }
      });
    },
    queryWebsiteInfo() {
      this.$http.queryWeb(this.$route.query.id).then((res) => {
        if (res.status === 200) {
          this.getDataList();
          this.getPermissionList(res.data.website_mode_category);
        }
      });
    },
    // 获取权限列表
    getPermissionList(value) {
      this.$http.getPermissionList(1, value).then((res) => {
        if (res.status === 200) {
          this.permission_list = this.$toTree(res.data);
          this.check_permission_list = res.data;
        }
      });
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
    // 分页自带函数，当currentPage变化时会触发此函数
    handleCurrentChange(val) {
      this.params.page = val;
      this.getPageData();
      this.getDataList();
    },
    getDataList() {
      if (!this.params.name) {
        delete this.params.name;
      }
      this.tableData = [];
      this.$http.getWebsiteRoles({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.page = res.data.current_page;
          this.params.total = res.data.total;
          this.params.row = res.data.per_page;
        }
      });
    },
    createData() {
      this.form_create = {
        init_permission: 0,
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
      this.switch_type = true;
    },
    onInput() {
      if (this.company_name === "") {
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
    onCreate() {
      if (this.dialogTitle === "addData") {
        this.$http.createWebsiteRole(this.form_create).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "创建成功",
              type: "success",
            });
            this.getDataList();
            this.dialogCreate = false;
          }
        });
      } else {
        this.$http.updataWebsiteRole(this.form_create).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getDataList();
            this.dialogCreate = false;
          }
        });
      }
    },
    changeData(row) {
      this.dialogTitle = "updateData";
      this.dialogCreate = true;
      this.form_create = row;
      this.switch_type = false;
    },
    deleteData(row) {
      this.$confirm("此操作将删除该角色，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteWebsiteRole(row.id).then((res) => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功",
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
    onShow(row) {
      this.permission_form.id = row.id;
      this.revoke_permission_form.id = row.id;
      this.give_permission_form.id = row.id;
      this.expandChange(row.id);
      this.dialogRole = true;
    },
    submitPermission() {
      if (this.permission_form.permission_names.length === 0) {
        this.$message({
          message: "请选择后提交",
          type: "error",
        });
        return;
      }
    },
    // 渲染按钮
    // renderContent(h, { node, data }) {
    //   this.submit_permission = true;
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label}</span>
    //       <span>
    //         {node.checked === true && this.submit_permission === true ? (
    //           <el-button
    //             size="mini"
    //             type="text"
    //             on-click={() => this.revokePermission(node, data)}
    //           >
    //             撤销权限
    //           </el-button>
    //         ) : (
    //           ""
    //         )}
    //       </span>
    //     </span>
    //   );
    // },
    // givePermission(data, node) {
    //   if (node.checked === true) {
    //     this.$http
    //       .givePermission({
    //         id: this.give_permission_form.id,
    //         permission_name: data.name,
    //       })
    //       .then((res) => {
    //         if (res.status === 200) {
    //           this.$message({
    //             message: "添加成功",
    //             type: "success",
    //           });
    //           this.submit_permission = false;
    //           this.expandChange(this.give_permission_form.id);
    //         }
    //       });
    //   }
    // },
    // 删除权限
    // revokePermission(node, data) {
    //   this.give_permission_form.permission_name = data.name;
    //   this.$http.revokePermission(this.give_permission_form).then((res) => {
    //     if (res.status === 200) {
    //       this.$message({
    //         message: "已撤销",
    //         type: "success",
    //       });
    //       this.expandChange(this.give_permission_form.id);
    //     }
    //   });
    // },
    // 设置权限
    // 点击展开列
    expandChange(id) {
      this.default_expanded_keys = [];
      this.$http.getRolePermissionList(id).then((res) => {
        if (res.status === 200) {
          this.role_permission_list = res.data;
          this.role_permission_list.map((item) => {
            this.default_expanded_keys.push(item.id);
          });
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.default_expanded_keys);
          });

          // this.$refs.tree.setCheckedKeys(
          //   this.role_permission_list.map((item) => {
          //     return item.id;
          //   })
          // );
        }
      });
    },
    resetPer() {
      this.$http.resetPermission(this.permission_form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: "重置成功",
            type: "success",
          });
        }
      });
    },
    checkChangeVal(node, check) {
      if (check) {
        this.permission_form.permission_names.push(node.name);
      } else {
        this.permission_form.permission_names = [];
      }
    },
    checkChange(data, node) {
      this.permission_form.permission_names = node.checkedNodes.map((item) => {
        return item.name;
      });
    },
    handleCheckAllChange() {
      if (this.checkAll) {
        this.$refs.tree.setCheckedNodes(this.check_permission_list);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
  },
};
</script>

<style lang="scss">
.el-header {
  align-items: center;
  justify-content: space-between;
  .search-box {
    align-items: center;
    .el-input {
      width: 300px;
    }
  }
}
.demo-table-expand {
  font-size: 0;
  align-items: center;
  display: flex;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.el-radio {
  margin: 5px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree {
  height: 350px;
  overflow-y: auto !important;
  .el-tree-node__content span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
// 添加虚线tree
.el-tree-node {
  position: relative;
  padding-left: 16px;
}
//节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
.el-tree-node__expand-icon.is-leaf {
  display: none;
}
.el-tree-node__children {
  padding-left: 16px;
}

.el-tree-node :last-child:before {
  height: 38px;
}

.el-tree > .el-tree-node:before {
  border-left: none;
}

.el-tree > .el-tree-node:after {
  border-top: none;
}

.el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.el-tree-node:before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.el-tree-node:after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 12px;
  width: 24px;
}
</style>
