<template>
  <el-container>
    <el-header class="div row">
      <div class="div row">
        <el-button type="primary" @click="createdWeb">创建站点</el-button>
        <el-button type="success" @click="miniProgram"
          >已开通小程序列表</el-button
        >
      </div>
      <div class="div row input-box">
        <el-input
          v-model="params.name"
          placeholder="请输入站点名称"
          @input="onInput"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </div>
    </el-header>
    <div class="select-box div row">
      <el-select
        v-model="params.website_version_category"
        placeholder="请选择版本"
      >
        <el-option
          v-for="item in website_version_category_list"
          :key="item.value"
          :label="item.description"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="time_value"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
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
        width="50"
      ></el-table-column>
      <el-table-column prop="logo" label="logo">
        <template slot-scope="scope">
          <img
            :src="scope.row.logo"
            width="60px"
            height="30px"
            :alt="scope.row.name"
          />
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            label-position="left"
            label-width="200px"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="公司名称：">
              <span>{{ scope.row.website_company_name }}</span>
            </el-form-item>
            <el-form-item label="联系人：">
              <span>{{ scope.row.website_contact_name }}</span>
            </el-form-item>
            <el-form-item label="联系方式：">
              <span>{{ scope.row.website_contact_phone }}</span>
            </el-form-item>
            <el-form-item label="城市名称：">
              <span>{{ scope.row.website_city_name }}</span>
            </el-form-item>
            <el-form-item label="版本类型名称：">
              <span v-if="scope.row.website_version_category">{{
                scope.row.website_version_category === 0 ? "试用版" : "正式版"
              }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="站点" width="auto">
        <template slot-scope="scope">
          <el-tag @click="openSite(scope.row)"
            >{{ scope.row.name }} （{{ scope.row.id }}）</el-tag
          >
        </template>
        <!-- </el-table-column>
        <el-table-column prop="url" label="站点链接" width="auto">-->
      </el-table-column>
      <el-table-column prop="id" label="站点模式" width="auto">
        <template slot-scope="scope">
          <el-tag style="margin:4px" type="success">{{
            scope.row.website_mode_category === 0
              ? "分销报备"
              : scope.row.website_mode_category === 1
              ? "单楼盘"
              : "微房产"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="wx_pub_app_id" label="公众号" width="auto">
        <template slot-scope="scope">
          <el-tag
            @click="authWxPubAppId(scope.row.wx_pub_app_id)"
            type="success"
            class="bang"
            v-if="scope.row.wx_pub_app_id"
            >已授权</el-tag
          >
          <el-tag type="danger" class="weibang" v-else>未授权</el-tag>
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
            >已授权</el-tag
          >
          <el-tag type="danger" class="weibang" v-else>未授权</el-tag>
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
        width="350"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-dropdown style="margin-right:10px">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeData(scope.row)"
                >修改</el-dropdown-item
              >
              <el-dropdown-item @click.native="deleteData(scope.row)"
                >删除</el-dropdown-item
              >
              <el-dropdown-item @click.native="editData(scope.row)"
                >管理员列表</el-dropdown-item
              >
              <el-dropdown-item @click.native="roleData(scope.row)"
                >角色</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="scope.row.wx_mini_program_app_id"
            type="success"
            size="mini"
            @click="authorization(scope.row)"
            >小程序管理</el-button
          >
          <el-button type="primary" size="mini" @click="bindSite(scope.row)">{{
            scope.row.tfy_app_id === "" ? "绑定腾房云站点" : "修改腾房云站点"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.params.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="this.params.per_page"
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
        row: 0,
        name: "",
        website_version_category: "",
        lease_start_date: "",
        lease_end_date: "",
      },
      // 版本筛选
      website_version_category_list: [
        { description: "正式版", value: 1 },
        { description: "试用版", value: 0 },
      ],
      time_value: [],
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

    // 获取列表数据
    getDataList() {
      if (this.params.lease_start_date === "") {
        delete this.params.lease_start_date;
      }
      if (this.params.lease_end_date === "") {
        delete this.params.lease_end_date;
      }
      if (this.params.website_version_category === "") {
        delete this.params.website_version_category;
      }
      this.$http.websiteList({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.page = res.data.current_page;
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
      if (this.time_value) {
        this.params.lease_start_date = this.time_value[0];
        this.params.lease_end_date = this.time_value[1];
      }
      this.params.page = 1;
      this.params.pagesize = 10;
      this.getDataList();
    },
    onInput() {
      if (this.params.name === "") {
        this.params.page = 1;
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
    miniProgram() {
      this.$router.push("/mini_program_list");
    },
    bindSite(row) {
      this.$router.push(`/tfy_list?site_id=${row.id}`);
    },
    roleData(row) {
      this.$router.push(`/role_list?id=${row.id}`);
    },
    // 跳转进站点
    openSite(row) {
      this.$http.getWebsiteToken(row.id).then((res) => {
        if (res.status === 200) {
          // 获取站点token，id存本地
          localStorage.setItem("TOKEN", res.data.token);
          localStorage.setItem("website_id", row.id);
          var tempwindow = window.open("_blank");
          // 判断是否存在接跳转连接
          if (localStorage.getItem("TOKEN")) {
            tempwindow.location =
              "https://yun.tfcs.cn/admin/?website_id=" + row.id;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
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
.select-box {
  justify-content: flex-start;
  margin-bottom: 10px;
  .el-select {
    margin: 0 10px;
  }
}
</style>
