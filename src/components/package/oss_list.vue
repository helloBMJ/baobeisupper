<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
      <div class="div row search-box">
        <el-input
          @input="onInput"
          v-model="params.name"
          placeholder="请输入套餐名称"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
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
            :currentPage="params.currentPage"
            :total="params.total"
            :pagesize="params.pagesize"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
          ></myPagination>
        </div>
      </el-footer>
    </el-main>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="套餐名称：" prop="name">
          <el-input
            v-model="form_create.name"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="套餐描述：" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入套餐描述"
            rows="4"
            v-model="form_create.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="套餐状态：" prop="status">
          <el-radio-group v-model="form_create.status">
            <el-radio-button
              v-for="item in goods_status"
              :key="item.value"
              :label="item.value"
              >{{ item.desc }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="位置排序：" prop="sort">
          <el-input type="number" v-model="form_create.sort"></el-input>
        </el-form-item>
        <el-form-item label="设置价格：" prop="price">
          <el-input
            :disabled="updateContent"
            type="number"
            v-model="form_create.price"
            ><template slot="append">元</template></el-input
          >
        </el-form-item>
        <el-form-item label="储存空间：" prop="oss_storage_space">
          <el-input
            :disabled="updateContent"
            type="number"
            v-model="form_create.oss_storage_space"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreate">确定</el-button>
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
      goods_status: [
        { desc: "上架", value: 1 },
        { desc: "下架", value: 0 },
      ],
      dialogCreate: false,
      form_create: {},
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      updateContent: false,
      table_header: [
        {
          label: "折叠内容",
          expand: "expand",
          width: "100",
          render: (h, data) => {
            return (
              <el-form
                label-width="100px"
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="套餐描述：">
                  <span>{data.row.description}</span>
                </el-form-item>
                <el-form-item label="创建时间：">
                  <span>{data.row.created_at}</span>
                </el-form-item>
                <el-form-item label="修改时间：">
                  <span>{data.row.updated_at}</span>
                </el-form-item>
              </el-form>
            );
          },
        },
        { prop: "id", label: "ID", width: "80" },
        { prop: "name", label: "套餐名称" },
        { prop: "oss_storage_space", label: "oss储存空间" },
        { prop: "price", label: "价格/元" },
        { prop: "sort", label: "排序" },
        {
          label: "状态",
          render: (h, data) => {
            return <p>{data.row.status === 1 ? "上架" : "下架"}</p>;
          },
        },
        {
          label: "操作",
          width: "250",
          fixed: "right",
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
                  type="danger"
                  size="mini"
                  onClick={() => {
                    this.deleteData(data.row);
                  }}
                >
                  删除
                </el-button>
                <el-button
                  type={data.row.status === 1 ? "success" : "primary"}
                  size="mini"
                  onClick={() => {
                    this.updateStatus(data.row);
                  }}
                >
                  {data.row.status === 1 ? "下架" : "上架"}
                </el-button>
              </div>
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
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
    getDataList() {
      if (!this.params.name) {
        delete this.params.name;
      }
      this.tableData = [];
      this.$http.getOssList({ params: this.params }).then((res) => {
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
        status: "1",
        sort: 0,
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
      this.updateContent = false;
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
    changeData(row) {
      this.dialogTitle = "updateData";
      this.dialogCreate = true;
      this.form_create = row;
      this.updateContent = true;
    },
    deleteData(row) {
      this.$confirm("此操作将删除该套餐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteOss(row.id).then((res) => {
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
    onCreate() {
      if (this.dialogTitle === "addData") {
        this.$http.createOss(this.form_create).then((res) => {
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
        this.$http.updateOss(this.form_create).then((res) => {
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
    updateStatus(row) {
      if (row.status === 1) {
        this.$http.updateOssStatus(row.id, 0).then((res) => {
          if (res.status === 200) {
            this.getDataList();
            this.$message({
              message: "已下架",
              type: "success",
            });
          }
        });
      } else {
        this.$http.updateOssStatus(row.id, 1).then((res) => {
          if (res.status === 200) {
            this.getDataList();
            this.$message({
              message: "已上架",
              type: "success",
            });
          }
        });
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
</style>
