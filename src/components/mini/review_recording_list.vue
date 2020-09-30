<template>
  <el-container>
    <el-header>
      <el-tag type="warning" size="medium "
        >失败原因：当审核被拒绝时，返回拒绝原因，当审核延后时，返回延后原因</el-tag
      >
    </el-header>
    <el-table :data="tableData" border style="width:100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="website_id" label="站点ID"></el-table-column>
      <el-table-column
        prop="wx_open_mp_version_id"
        label="审核ID"
      ></el-table-column>
      <el-table-column prop="reason" label="失败原因"></el-table-column>
      <el-table-column
        prop="screenshot"
        label="审核拒绝时小程序屏幕截图"
      ></el-table-column>
      <el-table-column prop="audit_status" label="审核状态">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.audit_status === 0
                ? "审核成功"
                : scope.row.audit_status === 1
                ? "审核被拒绝"
                : scope.row.audit_status === 2
                ? "审核中"
                : scope.row.audit_status === 3
                ? "已撤回"
                : "审核延后"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      review_id: "",
      tableData: [],
    };
  },
  mounted() {
    this.review_id = this.$route.query.id;
    this.getReviewRecordingList();
  },
  methods: {
    getReviewRecordingList() {
      this.$http.getReviewRecordingList(this.review_id).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-header {
}
</style>
