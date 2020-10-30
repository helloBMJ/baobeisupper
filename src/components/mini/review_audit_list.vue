<template>
  <el-container>
    <el-header>
      <el-tag type="warning" size="medium "
        >失败原因：当审核被拒绝时，返回拒绝原因，当审核延后时，返回延后原因</el-tag
      >
    </el-header>
    <!-- @expand-change 当用户展开某一行时调用该接口 -->
    <el-table
      :data="tableData"
      border
      style="width:100%"
      @expand-change="getImg"
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="website_id" label="站点ID"></el-table-column>
      <el-table-column
        prop="wx_open_mp_version_id"
        label="审核ID"
      ></el-table-column>
      <el-table-column label="审核记录" type="expand" width="100">
        <template slot-scope="scope">
          <h3 class="label">失败原因：</h3>
          <p v-html="scope.row.reason"></p>
          <h3 class="label">拒绝原因截图：</h3>
          <div class="img-box">
            <img
              v-for="(item, index) in img_arr"
              :key="index"
              :src="item"
              alt=""
            />
          </div>
        </template>
      </el-table-column>
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
      url: "",
      img_arr: [],
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
    getImg(row) {
      this.img_arr = [];
      if (row.audit_status === 1) {
        let arr = row.screenshot.split("|");
        // 拒绝原因截图有时不止一张，处理后存入新数组
        arr.map((item) => {
          this.$http
            .getErrorImg({ media_id: item, access_token_type: 1 })
            .then((res) => {
              if (res.status === 200) {
                this.url = `
            data: image/jpeg;base64,${btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}
            `;
              }
              this.img_arr.push(this.url);
            });
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-header {
}
.label {
  color: #99a9bf;
  margin: 10px 0;
}
.img-box {
  img {
    width: 200px;
    height: 400px;
  }
}
</style>
