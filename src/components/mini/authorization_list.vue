<template>
  <el-container>
    <el-header>
      <el-button @click="drawer = true" type="primary">展开侧边栏</el-button>
      <el-button
        v-if="$route.query.wxminiappid"
        type="success"
        @click="isqrimg = true"
        >小程序二维码</el-button
      >
      <el-button
        v-if="$route.query.wxpubappid"
        type="success"
        @click="isqrimg = true"
        >公众号二维码</el-button
      >
      <el-dialog title="二维码" width="100" :visible.sync="isqrimg">
        <img width="300" :src="qr_code" alt="" />
      </el-dialog>
      <el-drawer direction="ltr" :visible.sync="drawer" :with-header="false">
        <div class="header ">
          <div class="div row" style="line-height: 80px;">
            <el-avatar
              :size="80"
              :src="authorizer_info.head_img"
              :alt="authorizer_info.nick_name"
            ></el-avatar>
            <h4 style="margin-left:10px">
              公众号：{{ authorizer_info.user_name }}
            </h4>
          </div>
          <div style="margin:8px">
            <el-tag v-if="authorizer_info.open_store === 1" type="success"
              >已开通微信门店功能</el-tag
            >
            <el-tag v-if="authorizer_info.open_card === 1" type="success"
              >已开通微信卡券功能</el-tag
            >
            <el-tag v-if="authorizer_info.open_pay === 1" type="success"
              >已开通微信支付功能</el-tag
            ><el-tag v-if="authorizer_info.open_shake === 1" type="success"
              >已开通微信摇一摇功能 </el-tag
            ><el-tag v-if="authorizer_info.open_scan === 1" type="success"
              >已开通微信扫商品功能</el-tag
            >
          </div>

          <el-input
            style="width:auto"
            :disabled="true"
            v-model="authorizer_info.nick_name"
            v-if="$route.query.wxpubappid"
          >
            <template slot="prepend">授权公众号名称：</template>
          </el-input>
          <el-input
            style="width:auto"
            :disabled="true"
            v-model="authorizer_info.nick_name"
            v-else
          >
            <template slot="prepend">小程序名称：</template>
          </el-input>
          <el-input
            style="width:auto"
            :disabled="true"
            v-model="$route.query.wxpubappid"
            v-if="$route.query.wxpubappid"
          >
            <template slot="prepend">授权公众号ID：</template>
          </el-input>
          <el-input
            style="width:auto"
            :disabled="true"
            v-model="$route.query.wxminiappid"
            v-else
          >
            <template slot="prepend">授权小程序ID：</template>
          </el-input>
          <el-input
            style="width:auto;"
            :disabled="true"
            v-model="authorizer_info.principal_name"
          >
            <template slot="prepend">关联公司：</template>
          </el-input>

          <el-input
            style="width:auto"
            :disabled="true"
            v-model="authorizer_info.signature"
          >
            <template slot="prepend">公众号签名：</template>
          </el-input>
          <el-input
            style="width:auto"
            :disabled="true"
            v-model="service_type_info"
          >
            <template slot="prepend">公众号类型：</template>
          </el-input>
          <el-input
            style="width:auto"
            :disabled="true"
            v-model="verify_type_info"
          >
            <template slot="prepend">公众号认证类型：</template>
          </el-input>
        </div>
      </el-drawer>
    </el-header>
    <el-table
      :data="authorization_info"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="id" label="权限集ID" width="100"></el-table-column>
      <el-table-column
        prop="description"
        label="权限集描述"
        width="auto"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="权限集名称"
        width="auto"
      ></el-table-column>
      <el-table-column prop="mutual" label="权限集互斥" width="auto">
        <template slot-scope="scope">
          <p>{{ scope.row.mutual === false ? "否" : "是" }}</p>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      authWxPubAppId: "",
      authorization_info: [],
      authorizer_info: {},
      drawer: false,
      verify_type_info: "",
      service_type_info: "",
      isqrimg: false,
      qr_code: "",
    };
  },
  mounted() {
    if (this.$route.query) {
      this.authWxPubAppId =
        this.$route.query.wxpubappid || this.$route.query.wxminiappid;
    }
    this.getWebsiteToken();
  },
  methods: {
    getWebsiteToken() {
      this.$http.getWebsiteToken(this.$route.query.website_id).then((res) => {
        if (res.status === 200) {
          localStorage.setItem("admin_TOKEN", res.data.token);
          if (this.authWxPubAppId) {
            this.getAuthWxPubAppId();
          }
        }
      });
    },
    getAuthWxPubAppId() {
      this.$http.getAuthorizationInfo(this.authWxPubAppId).then((res) => {
        if (res.status === 200) {
          this.authorization_info = res.data.authorization_info.func_info.map(
            (item) => {
              return item.funcscope_category;
            }
          );
          this.authorizer_info = res.data.authorizer_info;
          this.getCommonProxy();
          switch (this.authorizer_info.service_type_info.id) {
            case 0:
              this.service_type_info = "订阅号";
              break;
            case 1:
              this.service_type_info = "由历史老帐号升级后的订阅号";
              break;
            default:
              this.service_type_info = "服务号";
              break;
          }
          switch (this.authorizer_info.verify_type_info.id) {
            case 0:
              this.verify_type_info = "微信认证";
              break;
            case 1:
              this.verify_type_info = "新浪微博认证";
              break;
            case 2:
              this.verify_type_info = "腾讯微博认证";
              break;
            case 3:
              this.verify_type_info = "已资质认证通过但还未通过名称认证";
              break;
            case 4:
              this.verify_type_info =
                "已资质认证通过、还未通过名称认证，但通过了新浪微博认证";
              break;
            case 5:
              this.verify_type_info =
                "已资质认证通过、还未通过名称认证，但通过了腾讯微博认证";
              break;
            default:
              this.verify_type_info = "未认证";
              break;
          }
        }
      });
    },
    // 小程序二维码不显示问题
    getCommonProxy() {
      var data = {
        url: this.authorizer_info.qrcode_url,
        method: "get",
      };
      this.$http.getImgCommonProxy(data).then((res) => {
        if (res.status === 200) {
          this.qr_code = ` data: image/jpeg;base64,${btoa(
            new Uint8Array(res.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  .el-input {
    margin: 6px;
  }
}
</style>
