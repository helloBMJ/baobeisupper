<template>
  <el-col :span="24" class="toolbar" style="text-align: center;">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-col>
</template>
<script>
export default {
  props: {
    total: {
      default: 0, // 列表内所有数据的长度
      type: Number,
    },
    currentPage: {
      default: 1, // 初始页
      type: Number,
    },
    pagesize: {
      default: 10, // 当前页面内的列表行数
      type: Number,
    },
  },
  methods: {
    // 初始页page、初始每页数据数pagesize和数据data
    // 更换每页列内不同的行数：更新列表数据
    handleSizeChange: function(pagesize) {
      this.$emit("handleSizeChange", pagesize);
    },
    // 换页：更新列表数据
    handleCurrentChange: function(currentPage) {
      this.$emit("handleCurrentChange", currentPage);
    },
  },
};
</script>
