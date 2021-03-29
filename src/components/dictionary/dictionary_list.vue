<template>
  <el-container>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
      <div class="div row search-box">
        <el-input
          @input="onInput"
          v-model="params.match_name"
          placeholder="请输入字典名称"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
      </div>
    </el-header>
    <el-main>
      <el-table
        :default-sort="{ prop: 'id', order: 'descending' }"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column
          label="字典名称"
          prop="name"
          width="300px"
        ></el-table-column>
        <el-table-column label="字典描述" prop="description" width="200px">
          <template slot-scope="scope">
            <el-button class="point" @click="onPoint(scope.row)">{{
              scope.row.description
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="sort"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="值"
          prop="value"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="onPoint(scope.row)"
              >修改</el-button
            >
            <el-button size="mini" type="danger" @click="onDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="字典内容" prop="desc">
          <template slot-scope="scope">
            <el-button
              class="point"
              v-for="(item, index) in scope.row.item"
              :key="index"
              @click="onPoint(item)"
            >
              {{ item.description }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box">
        <myPagination
          :currentPage="params.page"
          :pagesize="params.per_page"
          :total="params.total"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></myPagination>
      </div>
    </el-main>
    <!-- 弹出框 -->
    <el-dialog
      :title="titleMap[dialogTitle]"
      custom-class="dia-detail"
      :visible.sync="dialogVisibleDic"
    >
      <el-form :model="form_dic" :rules="rules" label-width="100px">
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form_dic.description"
            placeholder="请填写中文描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input
            v-model="form_dic.value"
            type="text"
            placeholder="作为键值使用"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            v-model="form_dic.sort"
            type="number"
            placeholder="字典排序使用"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form_dic.name"
            placeholder="建议填写大写英文描述(USER_STATUS)"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form_dic.remark"
            placeholder="备注信息"
            type="textarea"
            :rows="6"
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
export default {
  components: {
    myPagination,
  },
  data() {
    return {
      tableData: [],
      params: {
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
        match_name: "",
      },
      dialogVisibleDic: false,
      form_dic: {},
      rules: {
        description: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入内容", trigger: "blur" }],
        value: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
    };
  },
  mounted() {
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
      if (!this.params.match_name) {
        delete this.params.match_name;
      }
      this.tableData = [];
      this.$http.getDictionaryList({ params: this.params }).then((res) => {
        if (res.status === 200) {
          // 对数组进行操作分类
          this.tableData = res.data.data;
          // var map = {};
          // for (var i = 0; i < res.data.data.length; i++) {
          //   var ai = res.data.data[i];
          //   if (!map[ai.name]) {
          //     this.tableData.push({
          //       name: ai.name,
          //       desc: ai.description,
          //       item: [ai],
          //     });
          //     map[ai.name] = ai;
          //   } else {
          //     for (var j = 0; j < this.tableData.length; j++) {
          //       var dj = this.tableData[j];
          //       if (dj.name == ai.name) {
          //         dj.item.push(ai);
          //         break;
          //       }
          //     }
          //   }
          // }
          this.params.page = res.data.current_page;
          this.params.total = res.data.total;
          this.params.row = res.data.per_page;
        }
      });
    },
    onPoint(item) {
      this.form_dic = item;
      this.dialogTitle = "updateData";
      this.dialogVisibleDic = true;
      // this.$router.push(`/edit_dictionary?id=${item.id}`);
    },
    createData() {
      this.form_dic = {
        sort: 0,
      };
      this.dialogTitle = "addData";
      this.dialogVisibleDic = true;
    },
    onCreate() {
      if (
        !this.form_dic.name ||
        !this.form_dic.value ||
        !this.form_dic.description
      ) {
        this.$message({
          message: "请输入内容提交",
          type: "error",
        });
        return;
      }

      if (this.dialogTitle === "addData") {
        this.$http.createDictionaryData(this.form_dic).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "创建成功",
              type: "success",
            });
            this.getDataList();
            // for (var key in this.form_dic) {
            //   this.form_dic[key] = "";
            // }
          }
        });
      } else {
        this.$http.upDateDictionary(this.form_dic).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getDataList();
            // for (var key in this.form_dic) {
            //   this.form_dic[key] = "";
            // }
          }
        });
      }
    },
    onInput(e) {
      this.params.match_name = e;
      if (!this.params.match_name) {
        this.getDataList();
      }
    },
    search() {
      this.params.page = 1;
      this.getDataList();
    },
    onDelete(id) {
      this.$confirm("此操作将删除该字典, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteDictionaryData(id).then((res) => {
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

<style scoped lang="scss">
.point:nth-child(odd) {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #d9ecff;
}
.point:nth-child(even) {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
.point {
  cursor: pointer;
  &:hover {
    background: #409eff;
    color: #fff;
  }
}

.el-header {
  align-items: center;
  justify-content: space-between;
  .search-box {
    align-items: center;
    .el-input {
      width: 500px;
    }
  }
}
</style>
