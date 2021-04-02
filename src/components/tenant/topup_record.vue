<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        border
        style="width:100%"
      >
        <el-table-column label="ID" prop="id" width="50"></el-table-column>
        <el-table-column label="付款模式" prop="payment_category">
          <template slot-scope="scope">{{
            scope.row.payment_category == 0 ? "线下付款" : ""
          }}</template>
        </el-table-column>
        <el-table-column label="付款金额/元" prop="amount"></el-table-column>
        <el-table-column label="交易单号" prop="trade_no"></el-table-column>
        <el-table-column label="收款人" prop="payee_name"></el-table-column>
        <el-table-column label="支付日期" prop="payment_date"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="创建日期" prop="created_at"></el-table-column>
      </el-table>
    </el-main>
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
export default {
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
