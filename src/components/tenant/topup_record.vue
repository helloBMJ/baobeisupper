<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
    </el-header>
    <el-main>
      <myTable :table-list="tableData" :header="table_header"></myTable>
    </el-main>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <myPagination
          :total="params.total"
          :currentPage="params.currentPage"
          :pagesize="params.pagesize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></myPagination>
      </div>
    </el-footer>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="付款金额：">
          <el-input
            v-model="form_create.amount"
            step="1"
            type="number"
            placeholder="请输入付款金额"
            ><template slot="append">元</template></el-input
          >
        </el-form-item>
        <el-form-item label="付款模式：">
          <el-select
            v-model="form_create.pyament_category"
            disabled
            placeholder="请选择"
          >
            <el-option
              v-for="item in pyament_category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易单号：">
          <el-input
            v-model="form_create.trade_no"
            placeholder="请输入交易单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付日期：">
          <el-date-picker
            v-model="form_create.payment_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收款人：">
          <el-input
            v-model="form_create.payee_name"
            placeholder="请输入收款人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款备注：">
          <el-input
            type="textarea"
            v-model="form_create.remark"
            rows="4"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item
          ><el-button type="primary" @click="onCreate"
            >确认</el-button
          ></el-form-item
        >
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
      dialogCreate: false,
      params: {
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
        tenant_id: "",
      },
      form_create: {},
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      pyament_category_list: [{ value: "0", description: "线下付款" }],
      table_header: [
        { prop: "id", label: "ID", width: "80" },
        {
          label: "付款模式",
          render: (h, data) => {
            return <p>{data.row.pyament_category == 0 ? "线下付款" : ""}</p>;
          },
        },
        { prop: "amount", label: "付款金额/元" },
        { prop: "trade_no", label: "交易单号" },
        { prop: "payee_name", label: "收款人" },
        { prop: "payment_date", label: "支付日期" },
        { prop: "remark", label: "备注" },
        { prop: "created_at", label: "创建日期" },
      ],
    };
  },
  mounted() {
    this.params.tenant_id = this.$route.query.tenant_id;
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.tableData = [];
      this.$http.getTopupRecord({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.page = res.data.current_page;
          this.params.total = res.data.total;
          this.params.row = res.data.per_page;
        }
      });
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
    createData() {
      this.form_create = {
        tenant_id: this.params.tenant_id,
        pyament_category: "0", //线下付款
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    onCreate() {
      if (this.dialogTitle === "addData") {
        this.$http.createTopupRecord(this.form_create).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "创建成功",
              type: "success",
            });
            this.getDataList();
            this.dialogCreate = false;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-header {
  align-items: center;
  justify-content: space-between;
  height: auto;
}
.el-input,
.el-select {
  width: 300px;
}
</style>
