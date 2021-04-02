<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
    </el-header>
    <el-main>
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
    </el-main>
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form :model="form_create" label-width="100px">
        <el-form-item label="类型：">
          <el-select v-model="form_create.category" placeholder="请选择">
            <el-option
              v-for="item in category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            v-model="form_create.sort"
            placeholder="请输入"
            type="number"
            step="1"
            min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="key：">
          <el-select
            @change="changeKey"
            v-model="form_create.key"
            placeholder="请选择"
          >
            <el-option
              v-for="item in key_category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="value：" v-if="form_create.key">
          <el-select v-model="form_create.value" placeholder="请选择">
            <el-option
              v-for="item in category_value_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标名称">
          <el-input v-model="form_create.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="图标：">
          <el-upload
            :headers="myHeader"
            :action="build_type_img"
            :on-success="handleSuccess"
            list-type="picture-card"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <img
              width="148px"
              height="148px"
              :src="form_create.icon"
              v-if="form_create.icon"
              alt=""/>
            <i v-else class="el-icon-plus"></i
          ></el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import config from "@/utils/config";
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
      category_list: [{ description: "找房", value: 1 }],
      key_category_list: [
        { description: "楼盘特色", value: "build_feature" },
        { description: "楼盘状态", value: "build_status" },
      ],
      build_type_img: `/api/common/file/upload/admin?category=${config.BUILD_LABELS_CATEGORY}`,
      dialogVisible: false,
      dialogImageUrl: "",
      build_status_list: [],
      build_feature_list: [],
      category_value_list: [],
      table_header: [
        { prop: "id", label: "ID", width: "80" },
        {
          label: "key",
          render: (h, data) => {
            return (
              <div>
                {data.row.key === "build_status" ? "楼盘特色" : "楼盘特色"}
              </div>
            );
          },
        },
        {
          label: "value",
          formatter: (row) => {
            if (row.key === "build_status") {
              let arr = this.build_status_list.filter((item) => {
                if (row.value == item.value) {
                  return item.description;
                }
              });
              if (arr[0].description) {
                return arr[0].description;
              }
            } else {
              let arr = this.build_feature_list.filter((item) => {
                if (row.value == item.value) {
                  return item.description;
                }
              });
              if (arr[0].description) {
                return arr[0].description;
              }
            }
          },
        },
        { prop: "name", label: "名称" },
        {
          label: "图标",
          render: (h, data) => {
            return <img src={data.row.icon} width="50px" />;
          },
        },
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
  computed: {
    // 获取请求头
    myHeader() {
      return {
        Authorization: "Bearer " + window.localStorage.getItem("TOKEN"),
      };
    },
  },
  mounted() {
    this.$setDictionary((e) => {
      e.find((item) => {
        switch (item.name) {
          case "BUILD_STATUS":
            this.build_status_list = item.childs;
            break;
          case "BUILD_FEATURE":
            this.build_feature_list = item.childs;
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
    changeKey(e) {
      if (e === "build_status") {
        this.category_value_list = this.build_status_list;
      } else {
        this.category_value_list = this.build_feature_list;
      }
    },
    createData() {
      this.form_create = {
        category: "1",
        sort: 0,
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    // 上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response.url;
      this.dialogVisible = true;
    },
    handleSuccess(response) {
      this.form_create.icon = response.url;
    },
    getDataList() {
      this.$http.getCustomNavLink({ params: this.params }).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data;
          this.params.page = res.data.current_page;
          this.params.total = res.data.total;
          this.params.row = res.data.per_page;
        }
      });
    },
    onSubmit() {
      if (this.dialogTitle === "addData") {
        this.$http.createCustomNavLink(this.form_create).then((res) => {
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
        this.$http.updateCustomNavLink(this.form_create).then((res) => {
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
      if (row.key === "build_status") {
        this.category_value_list = this.build_status_list;
      } else {
        this.category_value_list = this.build_feature_list;
      }
    },
    deleteData(row) {
      this.$confirm("即将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteCustomNavLink(row.id).then((res) => {
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

<style></style>
