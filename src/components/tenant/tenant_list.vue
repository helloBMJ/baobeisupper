<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width:100%" tooltip-effect="dark">
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="余额" prop="balance"></el-table-column>
        <el-table-column label="租户" prop="name"></el-table-column>
        <el-table-column label="有效期" prop="lease_start">
          <template slot-scope="scope">
            {{ scope.row.lease_start }}
            -
            {{ scope.row.lease_end }}
          </template>
        </el-table-column>
        <el-table-column label="站点模式" prop="allow_website_mode_categories">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.allow_website_mode_categories == 0
                  ? "分销报备"
                  : scope.row.allow_website_mode_categories == 1
                  ? "单楼盘"
                  : scope.row.allow_website_mode_categories == 2
                  ? "微房产"
                  : ""
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column
          prop="operating"
          label="操作"
          show-overflow-tooltip
          fixed="right"
          width="250"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="changeData(scope.row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="$gotoPath(`/topup_record?tenant_id=${scope.row.id}`)"
              >充值</el-button
            >
            <el-button type="danger" size="mini" @click="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="租户信息：">
          <el-input v-model="form_create.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="站点模式：" prop="allow_website_mode_categories">
          <el-select
            v-model="form_create.allow_website_mode_categories"
            disabled
            placeholder="请选择"
          >
            <el-option
              v-for="item in website_mode_category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期：">
          <el-date-picker
            v-model="time_value"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCreate" type="primary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
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
      dialogCreate: false,
      form_create: {},
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      time_value: [],
      website_mode_category_list: [],
    };
  },
  mounted() {
    this.$setDictionary((e) => {
      e.find((item) => {
        switch (item.name) {
          case "WEBSITE_MODE_CATEGORY":
            this.website_mode_category_list = item.childs;
            break;
        }
      });
    });
    this.getDataList();
  },
  methods: {
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
      this.$http.getTenantList({ params: this.params }).then((res) => {
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
        allow_website_mode_categories: "1",
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    changeData(row) {
      this.time_value = [];
      // console.log(row);
      this.dialogTitle = "updateData";
      this.dialogCreate = true;
      this.form_create = row;
      if (row.lease_start && row.lease_end) {
        this.time_value.push(
          this.form_create.lease_start,
          this.form_create.lease_end
        );
      }
    },
    deleteData(row) {
      this.$confirm("即将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteTenatList(row.id).then((res) => {
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
      this.form_create.lease_start = this.time_value[0];
      this.form_create.lease_end = this.time_value[1];
      if (this.dialogTitle === "addData") {
        this.$http.createTenantData(this.form_create).then((res) => {
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
        this.$http.updateTenantData(this.form_create).then((res) => {
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
  },
};
</script>

<style lang="scss">
.el-header {
  align-items: center;
  justify-content: space-between;
  height: auto;
}
</style>
