<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
    </el-header>
    <el-main>
      <myTable :table-list="tableData" :header="table_header"></myTable>
    </el-main>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="类型：">
          <el-select
            @change="changeType"
            v-model="form_create.category"
            placeholder="请选择"
          >
            <el-option
              v-for="item in category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input
            v-model="form_create.name"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格区间：">
          <el-input
            v-model="min_price"
            step="1"
            min="0"
            type="number"
            style="width:95px"
            placeholder="请输入价格区间"
          ></el-input>
          <i>~</i>
          <el-input
            v-model="max_price"
            step="1"
            min="0"
            type="number"
            style="width:95px"
            placeholder="请输入价格区间"
          ></el-input>
          <el-tooltip placement="right-end">
            <div slot="content">
              例：<br />1：0~8000（最低价到最高）<br />
              2：8000~10000（8000到10000之间价格）<br />
              3：10000~（10000以上）
            </div>
            <i style="margin-left:20px" class="el-icon-warning-outline"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      dialogCreate: false,
      form_create: {},
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      params: {
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
      },
      min_price: 0,
      max_price: 8000,
      category_list: [],
      table_header: [
        { prop: "id", label: "ID", width: "100" },
        {
          label: "类型",
          render: (h, data) => {
            return <p>{data.row.category == 1 ? "总价" : "单价"}</p>;
          },
        },
        { prop: "name", label: "名称" },
        {
          label: "操作",
          fixed: "right",
          width: "250",
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
              </div>
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.$setDictionary((e) => {
      e.find((item) => {
        switch (item.name) {
          case "BUILD_PRICE_RANGE_CATEGORY":
            this.category_list = item.childs;
            break;
        }
      });
    });
    this.getDataList();
  },
  methods: {
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
      this.$http.getPriceRange({ params: this.params }).then((res) => {
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
        category: "1",
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    changeType(e) {
      if (e) {
        this.form_create.value = "";
      }
    },
    changeData(row) {
      this.dialogTitle = "updateData";
      this.dialogCreate = true;
      this.form_create = row;
      this.form_create.category = row.category + "";
      var arr = this.form_create.value.split(",");
      this.min_price = arr[0];
      this.max_price = arr[1];
    },
    onSubmit() {
      this.form_create.value = this.min_price + "," + this.max_price;
      if (this.dialogTitle === "addData") {
        this.$http.createPriceRange(this.form_create).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "创建成功",
              type: "success",
            });
          }
          this.getDataList();
          this.dialogCreate = false;
        });
      } else {
        this.$http.updatePriceRange(this.form_create).then((res) => {
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
    deleteData(row) {
      this.$confirm("即将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deletePriceRange(row.id).then((res) => {
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

<style lang="scss">
.el-input {
  width: 300px;
}
</style>
