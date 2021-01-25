<template>
  <el-main>
    <el-header class="div row">
      <el-button type="primary" @click="createData">添加</el-button>
      <el-select
        v-model="website_mode_value"
        style="margin-left:10px"
        @change="changeMode"
      >
        <el-option
          v-for="item in website_mode_category_list"
          :key="item.id"
          :label="item.description"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-header>
    <el-table
      :default-sort="{ prop: 'sort', order: 'descending' }"
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="权限名称（唯一）"></el-table-column>
      <el-table-column prop="title" label="权限标题"></el-table-column>
      <el-table-column prop="menu" label="菜单类型">
        <template slot-scope="scope">
          <p>{{ scope.row.menu === 1 ? "是" : "否" }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="operating"
        label="操作"
        show-overflow-tooltip
        fixed="right"
        width="300"
      >
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="changeData(scope.row)"
            >修改</el-button
          >
          <el-button type="primary" size="mini" @click="createNext(scope.row)"
            >添加下级</el-button
          >
          <el-button type="danger" size="mini" @click="deleteData(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="titleMap[dialogTitle]"
      :visible.sync="dialogCreate"
      width="50%"
    >
      <el-form :model="form_create" label-width="100px">
        <el-form-item prop="pid" label="上级id">
          <el-input
            :disabled="next_pid"
            v-model="form_create.pid"
            placeholder="请输入上级id,设置0为一级"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="权限名称">
          <el-input
            v-model="form_create.name"
            placeholder="请输入权限名称（唯一）"
          ></el-input>
        </el-form-item>
        <el-form-item prop="title" label="权限标题">
          <el-input
            v-model="form_create.title"
            placeholder="请输入权限名称（可重复）"
          ></el-input>
        </el-form-item>
        <el-form-item prop="menu" label="菜单">
          <el-switch
            v-model="form_create.menu"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <el-form-item prop="website_mode_category" label="站点模式">
          <!-- <el-radio
            v-for="item in website_mode_category_list"
            :key="item.id"
            v-model="form_create.website_mode_category"
            :label="item.value"
            >{{ item.description }}</el-radio
          > -->
          <el-checkbox-group
            v-model="website_mode_value_list"
            @change="onChange"
          >
            <el-checkbox
              v-for="item in website_mode_category_list"
              :key="item.id"
              :label="item.value"
              >{{ item.description }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input
            v-model="form_create.sort"
            placeholder="数值越大越靠前"
            type="number"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="extend" label="扩展数据">
          <el-input
            type="textarea"
            v-model="form_create.extend"
            placeholder="扩展数据json字符串"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreate">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      permission_id: 1,
      tableData: [],
      form_create: {
        system_id: 1,
      },
      dialogCreate: false,
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      next_pid: false,
      website_mode_category_list: this.$getDictionary("WEBSITE_MODE_CATEGORY"),
      filters_list: [
        { text: "分销报备", value: 0 },
        { text: "单楼盘", value: 1 },
        { text: "微房产", value: 2 },
      ],
      website_mode_value: "0",
      website_mode_value_list: ["0"],
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$http
        .getPermissionList(this.permission_id, this.website_mode_value)
        .then((res) => {
          if (res.status === 200) {
            this.tableData = this.$toTree(res.data);
          }
        });
    },
    createData() {
      this.form_create = {
        system_id: 1,
        website_mode_category: "0",
        menu: 1,
        sort: 0,
        pid: 0,
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    onChange(e) {
      this.form_create.website_mode_category = e.toString();
    },
    onCreate() {
      if (this.dialogTitle === "addData") {
        this.$http.createPermission(this.form_create).then((res) => {
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
        this.$http.updataPermission(this.form_create).then((res) => {
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
      this.next_pid = true;
      this.form_create = row;
      this.website_mode_value_list = row.website_mode_category.split(",");
      console.log(row.menu);
      if (row.menu == 1) {
        this.form_create.menu = true;
      } else {
        this.form_create.menu = false;
      }
    },
    createNext(row) {
      this.form_create = {
        system_id: 1,
        menu: 0,
        sort: 0,
        website_mode_category: "0",
      };
      this.next_pid = true;
      this.dialogTitle = "addData";
      this.form_create.pid = row.id;
      this.dialogCreate = true;
    },
    deleteData(row) {
      this.$confirm("此操作将删除该设置，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deletePermission(row.id).then((res) => {
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
    changeMode(e) {
      this.website_mode_value = e;
      this.getDataList();
    },
  },
};
</script>

<style lang="scss">
.el-header {
  align-items: center;
  justify-content: flex-start;
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
