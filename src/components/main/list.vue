<template>
  <el-container>
    <el-header class="div row">
      <div class="div row">
        <el-button type="primary" @click="createdWeb">创建站点</el-button>
        <el-button type="success" @click="miniProgram"
          >已开通小程序列表</el-button
        >
        <el-button type="primary" @click="$router.push('/custom_nav_link')"
          >自定义链接跳转</el-button
        >
        <el-button type="success" @click="$router.push('/price_range_list')"
          >价格管理</el-button
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
        <el-button type="success" @click="draw_slider = true"
          >高级搜索</el-button
        >
      </div>
    </el-header>
    <myTable :table-list="tableData" :header="table_header"></myTable>
    <el-footer>
      <!-- 分页 -->
      <div class="pagination-box">
        <myPagination
          :currentPage="params.page"
          :total="params.total"
          :pagesize="params.per_page"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></myPagination>
      </div>
    </el-footer>
    <el-drawer
      custom-class="draw-slider"
      title="高级搜索"
      :visible.sync="draw_slider"
      :wrapperClosable="false"
    >
      <el-input
        v-model="params.website_company_name"
        placeholder="站点公司名称"
      ></el-input>
      <el-input
        v-model="params.website_contact_name"
        placeholder="站点联系人名称"
      ></el-input>
      <el-input
        v-model="params.website_contact_phone"
        placeholder="站点联系人电话"
      ></el-input>
      <el-input
        v-model="params.website_city_name"
        placeholder="站点城市名称"
      ></el-input>
      <el-select
        v-model="params.website_version_category"
        placeholder="请选择版本"
        clearable
      >
        <el-option
          v-for="item in website_version_category_list"
          :key="item.value"
          :label="item.description"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="params.website_mode_category"
        placeholder="请选择小程序模式"
        clearable
      >
        <el-option
          v-for="item in website_mode_category_list"
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
      <div class="div row">
        <el-button type="danger" @click="resetVal">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-drawer>
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
        website_version_category: "",
        "lease_start_date[start]": "",
        "lease_start_date[end]": "",
        website_mode_category: "",
        website_company_name: "",
        website_contact_name: "",
        website_contact_phone: "",
        website_city_name: "",
      },
      // 版本筛选
      website_version_category_list: [
        { description: "正式版", value: "1" },
        { description: "试用版", value: "0" },
      ],
      website_mode_category_list: [
        { description: "分销报备", value: "0" },
        { description: "单楼盘", value: "1" },
        { description: "微房产", value: "2" },
      ],
      time_value: [],
      draw_slider: false,
      table_header: [
        {
          expand: "expand",
          render: (h, data) => {
            return (
              <el-form
                label-position="left"
                label-width="120px"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="公司名称：">
                  <span>{data.row.website_company_name}</span>
                </el-form-item>
                <el-form-item label="联系人：">
                  <span>{data.row.website_contact_name}</span>
                </el-form-item>
                <el-form-item label="联系方式：">
                  <span>{data.row.website_contact_phone}</span>
                </el-form-item>
                <el-form-item label="城市名称：">
                  <span>{data.row.website_city_name}</span>
                </el-form-item>
                <el-form-item label="版本类型名称：">
                  <span>
                    {data.row.website_version_category === 0
                      ? "试用版"
                      : "正式版"}
                  </span>
                </el-form-item>
              </el-form>
            );
          },
        },
        {
          label: "logo",
          render: (h, data) => {
            return (
              <el-popover width="500px" trigger="hover" placement="right">
                <el-image
                  style="width:300px;height:300px"
                  fit="contain"
                  src={data.row.logo}
                />
                <img
                  slot="reference"
                  src={data.row.logo}
                  style="max-height:50px;max-width:100px"
                />
              </el-popover>
            );
          },
        },
        {
          label: "站点",
          render: (h, data) => {
            return (
              <el-tag
                onClick={() => {
                  this.openSite(data.row);
                }}
              >
                （{data.row.id}）{data.row.name}
              </el-tag>
            );
          },
        },
        {
          label: "站点模式",
          render: (h, data) => {
            return (
              <el-tag
                type={
                  data.row.website_mode_category === 0
                    ? "primary"
                    : data.row.website_mode_category === 1
                    ? "success"
                    : "danger"
                }
              >
                {data.row.website_mode_category === 0
                  ? "分销报备"
                  : data.row.website_mode_category === 1
                  ? "单楼盘"
                  : "微房产"}
              </el-tag>
            );
          },
        },
        {
          label: "公众号",
          render: (h, data) => {
            return (
              <div>
                {data.row.wx_pub_app_id ? (
                  <el-tag
                    type="success"
                    onClick={() => {
                      this.authWxPubAppId(data.row);
                    }}
                  >
                    已授权
                  </el-tag>
                ) : (
                  <el-tag type="danger">未授权</el-tag>
                )}
              </div>
            );
          },
        },
        {
          label: "小程序",
          render: (h, data) => {
            return (
              <div>
                {data.row.wx_mini_program_app_id ? (
                  <el-tag
                    type="success"
                    onClick={() => {
                      this.authWxMiniAppId(data.row);
                    }}
                  >
                    已授权
                  </el-tag>
                ) : (
                  <el-tag type="danger">未授权</el-tag>
                )}
              </div>
            );
          },
        },
        {
          prop: "created_at",
          label: "创建时间",
        },
        {
          label: "操作",
          width: "350",
          fixed: "right",
          render: (h, data) => {
            return (
              <div>
                <el-dropdown style="margin-right:10px">
                  <el-button type="primary" size="mini">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      nativeOnClick={() => {
                        this.changeData(data.row);
                      }}
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      nativeOnClick={() => {
                        this.deleteData(data.row);
                      }}
                    >
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item
                      nativeOnClick={() => {
                        this.editData(data.row);
                      }}
                    >
                      管理员列表
                    </el-dropdown-item>
                    <el-dropdown-item
                      nativeOnClick={() => {
                        this.roleData(data.row);
                      }}
                    >
                      角色
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                {data.row.wx_mini_program_app_id ? (
                  <el-button
                    type="success"
                    size="mini"
                    onClick={() => {
                      this.authorization(data.row);
                    }}
                  >
                    小程序管理
                  </el-button>
                ) : (
                  " "
                )}
                <el-button
                  type="primary"
                  size="mini"
                  onClick={() => {
                    this.bindSite(data.row);
                  }}
                >
                  {data.row.tfy_app_id === ""
                    ? "绑定腾房云站点"
                    : "修改腾房云站点"}
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
    changeData(row) {
      this.$gotoPath(`/updata_web?id=${row.id}`);
    },
    editData(row) {
      this.$gotoPath(`/edit_list?id=${row.id}`);
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
      if (!this.params["lease_start_date[start]"]) {
        delete this.params["lease_start_date[start]"];
      }
      if (!this.params["lease_start_date[end]"]) {
        delete this.params["lease_start_date[end]"];
      }
      if (!this.params.website_version_category) {
        delete this.params.website_version_category;
      }
      if (!this.params.website_mode_category) {
        delete this.params.website_mode_category;
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
      this.$gotoPath("/add_list");
    },
    search() {
      if (this.time_value === null) {
        this.params["lease_start_date[start]"] = "";
        this.params["lease_start_date[end]"] = "";
      } else {
        this.params["lease_start_date[start]"] = this.time_value[0];
        this.params["lease_start_date[end]"] = this.time_value[1];
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
    authWxPubAppId(row) {
      this.$gotoPath(
        `/authorization_list?wxpubappid=${row.wx_pub_app_id}&website_id=${row.id}`
      );
    },
    authWxMiniAppId(row) {
      this.$gotoPath(
        `/authorization_list?wxminiappid=${row.wx_mini_program_app_id}&website_id=${row.id}`
      );
    },
    miniProgram() {
      this.$gotoPath("/mini_program_list");
    },
    bindSite(row) {
      this.$gotoPath(`/tfy_list?site_id=${row.id}`);
    },
    roleData(row) {
      this.$gotoPath(`/role_list?id=${row.id}`);
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
    resetVal() {
      this.time_value = [];
      this.params = {
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
        name: "",
        website_version_category: "",
        "lease_start_date[start]": "",
        "lease_start_date[end]": "",
        website_mode_category: "",
        website_company_name: "",
        website_contact_name: "",
        website_contact_phone: "",
        website_city_name: "",
      };
    },
  },
};
</script>

<style lang="scss">
.draw-slider {
  padding: 20px;
  .el-input {
    display: block;
    margin: 10px;
  }
  .el-select {
    display: block;
  }
  .el-button {
    margin-top: 10px;
    display: block;
    text-align: end;
  }
}
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
