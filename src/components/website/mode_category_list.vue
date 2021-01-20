<template>
  <el-container>
    <el-header class="div row">
      <el-button @click="createData" type="primary">添加</el-button>
      <div class="div row search-box">
        <el-input
          @input="onInput"
          v-model="params.name"
          placeholder="请输入套餐名称"
        ></el-input>
      </div>
    </el-header>
    <el-main>
      <el-table :data="tableData" tooltip-effect="dark" style="width:100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form
              label-width="120px"
              label-position="left"
              class="demo-table-expand"
            >
              <el-form-item label="官方指导价：">
                <span>{{ scope.row.official_price }}元</span>
              </el-form-item>
              <el-form-item label="一级代理价：">
                <span>{{ scope.row.one_level_price }}元</span>
              </el-form-item>
              <el-form-item label="一级最低定价：">
                <span>{{ scope.row.one_level_min_top_up_amount }}元</span>
              </el-form-item>
              <el-form-item label="二级代理价：">
                <span>{{ scope.row.second_level_price }}元</span>
              </el-form-item>
              <el-form-item label="二级最低定价：">
                <span>{{ scope.row.second_level_min_top_up_amount }}元</span>
              </el-form-item>
              <el-form-item label="收费模式：">
                <span>{{ formmatCost(scope.row.cost_duration_category) }}</span>
              </el-form-item>
              <el-form-item label="收费时长：">
                <span>{{ scope.row.cost_duration_day }}天</span>
              </el-form-item>
              <el-form-item label="置业顾问：">
                <span
                  >已{{
                    formmatSwitch(scope.row.config_support_project_manager)
                  }}</span
                >
              </el-form-item>
              <el-form-item label="分销报备：">
                <span
                  >已{{
                    formmatSwitch(scope.row.config_support_reported)
                  }}</span
                >
              </el-form-item>
              <el-form-item label="在线获客：">
                <span
                  >已{{
                    formmatSwitch(scope.row.config_support_online_get_customer)
                  }}</span
                >
              </el-form-item>
              <el-form-item label="即时通讯：">
                <span>已{{ formmatSwitch(scope.row.config_support_im) }}</span>
              </el-form-item>
              <el-form-item label="在线直播">
                <span
                  >已{{
                    formmatSwitch(scope.row.config_support_online_live)
                  }}</span
                >
              </el-form-item>
              <el-form-item label="描述信息">
                <span>{{ scope.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="套餐名称" prop="name"></el-table-column>
        <el-table-column label="站点类型" prop="website_mode_category">
          <template slot-scope="scope">
            {{
              scope.row.website_mode_category == 0
                ? "分销报备"
                : scope.row.website_mode_category == 1
                ? "单楼盘"
                : "微房产"
            }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column
          prop="operating"
          label="操作"
          show-overflow-tooltip
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="changeData(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
    </el-main>
    <!-- 弹出添加窗口 -->
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogCreate">
      <el-form
        :model="form_create"
        :rules="create_rules"
        ref="form_create"
        label-width="100px"
      >
        <el-form-item label="站点模式：" prop="website_mode_category">
          <el-select
            v-model="form_create.website_mode_category"
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
        <el-form-item label="产品版本：" prop="name">
          <el-input
            v-model="form_create.name"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="官方指导价：" prop="official_price">
          <el-input
            type="number"
            v-model="form_create.official_price"
            placeholder="请输入价格"
            min="0"
          >
            <template slot="append">元</template></el-input
          >
        </el-form-item>
        <el-form-item label="一级代理价：" prop="one_level_price">
          <el-input
            type="number"
            v-model="form_create.one_level_price"
            placeholder="请输入价格"
            min="0"
          >
            <template slot="append">元</template></el-input
          >
        </el-form-item>
        <el-form-item label="二级代理价：" prop="second_level_price">
          <el-input
            type="number"
            v-model="form_create.second_level_price"
            placeholder="请输入价格"
            min="0"
          >
            <template slot="append">元</template></el-input
          >
        </el-form-item>
        <el-form-item label="收费模式：">
          <el-select
            v-model="form_create.cost_duration_category"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cost_duration_category_list"
              :key="item.value"
              :label="item.description"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="收费时长：" prop="cost_duration_day">
          <el-input
            type="number"
            v-model="form_create.cost_duration_day"
            placeholder="请输入天数"
            min="0"
            step="1"
          >
            <template slot="append">天</template></el-input
          >
        </el-form-item> -->
        <div class="div row">
          <el-form-item label="置业顾问：">
            <el-radio-group
              v-model="form_create.config_support_project_manager"
            >
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分销报备：">
            <el-radio-group v-model="form_create.config_support_reported">
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="div row">
          <el-form-item label="即时通讯：">
            <el-radio-group v-model="form_create.config_support_im">
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="在线获客：">
            <el-radio-group
              v-model="form_create.config_support_online_get_customer"
            >
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="div row">
          <el-form-item label="私有流量管理：">
            <el-radio-group v-model="form_create.config_support_private_flow">
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="在线直播：">
            <el-radio-group v-model="form_create.config_support_online_live">
              <el-radio-button
                v-for="item in switch_box"
                :key="item.value"
                :label="item.value"
                >{{ item.description }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="详细描述：">
          <el-input
            type="textarea"
            v-model="form_create.description"
            rows="4"
            placeholder="描述信息"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreate">确认</el-button>
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
      titleMap: {
        addData: "添加数据",
        updateData: "修改数据",
      },
      dialogTitle: "",
      dialogCreate: false,
      form_create: {},
      create_rules: {
        name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
        official_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        one_level_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        second_level_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        cost_duration_day: [
          { required: true, message: "请输入天数", trigger: "blur" },
        ],
      },
      website_mode_category_list: [],
      cost_duration_category_list: [],
      switch_box: [
        { description: "开启", value: "1" },
        { description: "关闭", value: "0" },
      ],
      params: {
        page: 1,
        per_page: 10,
        total: 0,
        row: 0,
        name: "",
      },
    };
  },
  mounted() {
    this.getDataList();
    this.$setDictionary((e) => {
      e.find((item) => {
        switch (item.name) {
          case "WEBSITE_MODE_CATEGORY":
            this.website_mode_category_list = item.childs;
            break;
          case "WEBSITE_COST_DURATION_CATEGORY":
            this.cost_duration_category_list = item.childs;
            break;
        }
      });
    });
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
      this.$http.getModeCategoryList({ params: this.params }).then((res) => {
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
        website_mode_category: "0",
        config_support_project_manager: "0",
        config_support_reported: "0",
        config_support_im: "0",
        config_support_online_get_customer: "0",
        config_support_private_flow: "0",
        config_support_online_live: "0",
      };
      this.dialogTitle = "addData";
      this.dialogCreate = true;
    },
    changeData(row) {
      this.dialogTitle = "updateData";
      this.dialogCreate = true;
      this.form_create = row;
      this.form_create.website_mode_category = row.website_mode_category + "";
      this.form_create.cost_duration_category = row.cost_duration_category + "";
    },
    deleteData(row) {
      this.$confirm("此操作将删除该套餐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.deleteModeCategory(row.id).then((res) => {
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
    formmatCost(cost) {
      let item = this.cost_duration_category_list.find((item) => {
        return item.value == cost;
      });
      if (item) {
        return item.description;
      }
    },
    formmatSwitch(value) {
      let item = this.switch_box.find((item) => {
        return item.value == value;
      });
      if (item) {
        return item.description;
      }
    },
    onInput(e) {
      this.params.name = e;
      this.params.currentPage = 1;
      this.params.pagesize = 10;
      this.getDataList();
    },
    onCreate() {
      if (this.dialogTitle === "addData") {
        this.$http.createModeCategory(this.form_create).then((res) => {
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
      if (this.dialogTitle === "updateData") {
        this.$http.updataModeCategory(this.form_create).then((res) => {
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
span {
  color: #999;
}
</style>
