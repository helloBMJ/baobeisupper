import axios from "axios";
import { Message, Loading } from "element-ui";

let loading; //定义loading变量

function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: "加载中……",
    background: "rgba(0, 0, 0, 0.1)",
  });
}
function endLoading() {
  //使用Element loading-close 方法
  loading.close();
}
class UserCenter {
  constructor() {
    this.$http = axios.create({
      baseURL: "/api",
      timeout: 10000,
    });

    // 请求拦截
    this.$http.interceptors.request.use(
      function(config) {
        // config.url.split("/")[6]
        const platformPath = config.url.split("/")[1];
        // console.log("url", platformPath);
        // var matchStr = "/super/admin/website/token/";
        // console.log(config.url.search(matchStr) != -1);
        let token = "";
        if (platformPath === "admin") {
          token = localStorage.getItem("admin_TOKEN");
          config.headers["Authorization"] = "Bearer " + token;
        }
        if (platformPath === "super") {
          token = localStorage.getItem("sup_TOKEN");
          config.headers["Authorization"] = "Bearer " + token;
        }
        // config.headers["Content-Type"] = "application/json";

        config.headers["Content-Type"] = "application/json";
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    this.$http.interceptors.response.use(
      (response) => {
        startLoading();
        if (response.status === 200) {
          endLoading();
        }
        // 提交失败
        // if (response.data.code == -1) {
        //   Message.error("登录已过期！");
        //   localStorage.removeItem("TOKEN");
        //   window.location.href = "/login";
        // router.push({
        //     path:"/login",
        //     querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
        // })
        //   return response;
        // }
        // if (response.data.code == 2) {
        //   eventBus.$emit("bindPhone", response.data);
        //   return response;
        // }
        // if (response.data.code == -10 || response.data.code == -5) {
        //   Message.warning(response.data.msg);
        //   setTimeout(() => {
        //     eventBus.$emit("closeTag");
        //     // router.push({
        //     //   path: "/member_upgrade"
        //     // });
        //   }, 1500);
        //   return response;
        // }
        return response;
      },
      (error) => {
        // console.log(error.response.data);
        if (error.response.status === undefined) {
          Message.error("请检查网络连接");
        }
        if (error.response.status === 422) {
          /**
           * @time 2020/10/21 添加注释
           * @description error返回报错信息是个数组则显示数组第一个内容
           * @description 反之打印报错信息
           * */

          if (error.response.data.message) {
            if (error.response.data.errors) {
              for (var key in error.response.data.errors) {
                Message.error(error.response.data.errors[key][0]);
              }
            } else {
              Message.error(error.response.data.message);
            }
          } else {
            Message.error("请检查内容后提交");
          }
        }
        if (error.response.status === 401) {
          window.localStorage.removeItem("sup_TOKEN");
          this.$router.push("/login");
        }
        if (error.response.status === 500) {
          Message.error("网络连接错误，请检查网络连接");
        }
        //报错的一个就够了
        return Promise.reject(error);
      }
    );
  }
  /**
   * 登录
   */
  login(data = {}) {
    return this.$http.post("/auth/super/admin/login/user_name", data);
  }
  // 获取登录后个人信息
  getAdmin() {
    return this.$http.get("/super/admin/my/query");
  }
  // 修改管理员密码
  updataAdmin(data) {
    return this.$http.post("/super/admin/my/update/password", data);
  }
  // 获取站点列表
  websiteList(params) {
    if (params.params.lease_start_date && params.params.lease_end_date) {
      return this.$http.get(
        `/super/admin/website/search?lease_start_date[start]=${params.params.lease_start_date}&lease_start_date[end]=${params.params.lease_end_date}&website_version_category=${params.params.website_version_category}&page=${params.params.page}`
      );
    } else {
      return this.$http.get(`/super/admin/website/search`, params);
    }
  }
  // 创建新的站点
  createWeb(data) {
    return this.$http.post("/super/admin/website/create", data);
  }
  // 删除站点
  deleteWeb(id) {
    return this.$http.get(`/super/admin/website/delete/${id}`);
  }
  // 修改站点信息
  updataWeb(data) {
    return this.$http.post("/super/admin/website/update", data);
  }
  // 获取站点信息展示
  queryWeb(id) {
    return this.$http.get(`/super/admin/website/query/${id}`);
  }
  // 发送手机验证码
  sendPhoneCode(data) {
    return this.$http.post("/auth/super/admin/send/sms/captcha", data);
  }
  // 手机号登录
  loginByphone(data) {
    return this.$http.post("/auth/super/admin/login/phone", data);
  }
  // 获取站点下面管理员列表
  getWebUser(data) {
    return this.$http.get(
      `/super/admin/admin_user/search?page=${data.currentPage}&website_id=${data.id}`
    );
  }
  // 创建站点下面的管理员
  createUser(data) {
    return this.$http.post("/admin/admin_user/create", data);
  }
  //删除站点管理员
  deleteWebUser(id) {
    return this.$http.get(`/admin/admin_user/delete/${id}`);
  }
  // 修改管理员信息
  editAdminMsg(data) {
    return this.$http.post("/admin/admin_user/update", data);
  }
  // 查询管理员信息
  queryAdminMsg(id) {
    return this.$http.get(`/super/admin/admin_user/query/${id}`);
  }
  // 获取帮助列表
  getHelpData(params) {
    return this.$http.get("/super/admin/help_center/search", params);
  }
  // 创建帮助信息
  createHelpData(data) {
    return this.$http.post("/super/admin/help_center/create", data);
  }
  // 删除某条帮助信息
  deleteHelp(id) {
    return this.$http.get(`/super/admin/help_center/delete/${id}`);
  }
  // 获取帮助信息
  getQueryHelp(id) {
    return this.$http.get(`/super/admin/help_center/query/${id}`);
  }
  // 修改信息
  updataHelp(data) {
    return this.$http.post("/super/admin/help_center/update", data);
  }
  // 字典查找类型
  dictionaryFind(type) {
    if (type) {
      return this.$http.get(`/common/dictionary/search?name=${type}`);
    } else {
      return this.$http.get(`/common/dictionary/search`);
    }
  }
  // 获取字典列表数据
  getDictionaryList(params) {
    return this.$http.get(`/common/dictionary/search`, params);
  }
  // 创建字典内容
  createDictionaryData(data) {
    return this.$http.post("/super/admin/dictionary/create", data);
  }
  // 查询字典内容
  queryDictionaryData(id) {
    return this.$http.get(`/common/dictionary/query/${id}`);
  }
  // 删除字典
  deleteDictionaryData(id) {
    return this.$http.get(`/super/admin/dictionary/delete/${id}`);
  }
  // 修改字典数据
  upDateDictionary(data) {
    return this.$http.post("/super/admin/dictionary/update", data);
  }
  // 点击获取站点后台token
  getWebsiteToken(website_id) {
    return this.$http.get(`/super/admin/website/token/${website_id}`);
  }
  // 获取代码模板列表
  getCodeTemplateList(params) {
    return this.$http.get(
      "/super/admin/wx_open/mini_program/code_template/get/template/list",
      params
    );
  }
  // 删除指定的模板id信息
  deletaTemplateData(id) {
    return this.$http.get(
      `/super/admin/wx_open/mini_program/code_template/delete/template?template_id=${id}`
    );
  }
  // 获取代码草稿箱列表
  getCodeDraftList() {
    return this.$http.get(
      "/super/admin/wx_open/mini_program/code_template/get/template/draft/list"
    );
  }
  // 将代码从草稿箱添加至模板列表
  addDraftToTemplate(id) {
    return this.$http.get(
      `/super/admin/wx_open/mini_program/code_template/add/to/template?draft_id=${id}`
    );
  }
  // 上传模板代码
  uploadTemplateCode(data) {
    return this.$http.post(`/admin/wx_open/mini_program/code/commit`, data);
  }
  // 已上传代码列表
  // alreadyCodeList(){
  //   return this.$http.get()
  // }
  // 获取二维码
  getQrCode() {
    return this.$http.get("/admin/wx_open/mini_program/code/get/qr_code", {
      responseType: "arraybuffer",
    });
  }
  // 提交审核
  SubmitReview() {
    return this.$http.post("/admin/wx_open/mini_program/code/submit/audit");
  }
  // 查询审核过程
  queryReview() {
    return this.$http.post(`/admin/wx_open/mini_program/code/get/audit/status`);
  }
  // 发布已通过审核的小程序
  publishMini() {
    return this.$http.get("/admin/wx_open/mini_program/code/release");
  }
  // 绑定体验者微信号
  bindTesterWechatId(data) {
    return this.$http.post("/admin/wx_open/mini_program/tester/bind", data);
  }
  // 解绑体验者
  unbindTesterWechatId(data) {
    return this.$http.post("/admin/wx_open/mini_program/tester/unbind", data);
  }
  // 查看体验者列表
  queryTesterList() {
    return this.$http.get("/admin/wx_open_mp/tester/search");
  }
  // 获取提交审核代码列表
  getReviewCodeList(params) {
    return this.$http.get("/admin/wx_open_mp/version/search", params);
  }
  // 获取授权公众号或小程序的授权信息
  getAuthorizationInfo(id) {
    return this.$http.get(`/admin/wx_open/public/auth_info/get/${id}`);
  }
  // 获取用户通知列表
  getUserNoticeList(params, name) {
    if (name) {
      return this.$http.get(
        `/admin/wx_open_mp/version/audit/notify/user/search?name=${name}`,
        params
      );
    } else {
      return this.$http.get(
        `/admin/wx_open_mp/version/audit/notify/user/search`,
        params
      );
    }
  }
  // 创建通知用户
  createUserNotice(data) {
    return this.$http.post(
      "/admin/wx_open_mp/version/audit/notify/user/create",
      data
    );
  }
  // 修改通知用户
  updateUserNotice(data) {
    return this.$http.post(
      "/admin/wx_open_mp/version/audit/notify/user/update",
      data
    );
  }
  // 查询通知用户信息
  queryUserNotice(id) {
    return this.$http.get(
      `/admin/wx_open_mp/version/audit/notify/user/query/${id}`
    );
  }
  //删除通知用户信息
  deleteUserNotice(id) {
    return this.$http.get(
      `/admin/wx_open_mp/version/audit/notify/user/delete/${id}`
    );
  }
  // /admin/wx_open_mp/version/all/audit/status/
  queryAuditStatus(status) {
    return this.$http.get(
      `/admin/wx_open_mp/version/all/audit/status/${status}`
    );
  }
  // 获取审核记录列表
  getReviewRecordingList(id) {
    return this.$http.get(`/admin/wx_open_mp/version/all/audit/status/${id}`);
  }
  // 获取已开通微信小程序站点
  getMiniProgramList(params) {
    return this.$http.get(
      `/super/admin/website/search/wx_open/mp?page=${params.currentPage}&per_page=${params.pagesize}&name=${params.name}`
    );
  }
  // 获取报错信息图片列表 ，注意图片格式
  getErrorImg(params) {
    return this.$http.post(
      `/admin/wx_open/public/material/get/permanent/assets`,
      params,
      { responseType: "arraybuffer" }
    );
  }
  // 获取oss列表数据
  getOssList(params) {
    return this.$http.get("/super/admin/package/oss_storage/search", params);
  }
  // 创建oss套餐
  createOss(data) {
    return this.$http.post("/super/admin/package/oss_storage/create", data);
  }
  // 删除oss套餐
  deleteOss(id) {
    return this.$http.get(`/super/admin/package/oss_storage/delete/${id}`);
  }
  // 查询oss
  queryOss(id) {
    return this.$http.get(`/super/admin/package/oss_storage/query/${id}`);
  }
  // 修改oss
  updateOss(data) {
    return this.$http.post("/super/admin/package/oss_storage/update", data);
  }
  // 设置上架下架
  updateOssStatus(id, status) {
    return this.$http.get(
      `/super/admin/package/oss_storage/update/status/${id}/${status}`
    );
  }
  // 获取sms列表数据
  getSmsList(params) {
    return this.$http.get("/super/admin/package/sms/search", params);
  }
  // 创建sms套餐
  createSms(data) {
    return this.$http.post("/super/admin/package/sms/create", data);
  }
  // 删除sms套餐
  deleteSms(id) {
    return this.$http.get(`/super/admin/package/sms/delete/${id}`);
  }
  // 修改sms
  updateSms(data) {
    return this.$http.post("/super/admin/package/sms/update", data);
  }
  // 设置上下架
  updateSmsStatus(id, status) {
    return this.$http.get(
      `/super/admin/package/sms/update/status/${id}/${status}`
    );
  }
  // 获取腾房云站点
  getTfySiteList(params) {
    return this.$http.get("/super/admin/website/search/tfy", params);
  }
  // 绑定分销报备&腾房云站点
  bindTfySite(data) {
    return this.$http.post("/admin/sys_conf/tfy/put", data);
  }
  // 获取当月小程序可提交次数
  getQueryQuota() {
    return this.$http.get("/admin/wx_open/mini_program/code/query/quota");
  }
  // 查询权限表
  getPermissionList(id, value) {
    return this.$http.get(
      `/super/admin/permission/all/${id}?website_mode_category=${value}`
    );
  }
  // 删除权限表
  deletePermission(id) {
    return this.$http.get(`/super/admin/permission/delete/${id}`);
  }
  // 创建权限
  createPermission(data) {
    return this.$http.post("/super/admin/permission/create", data);
  }
  // 修改权限
  updataPermission(data) {
    return this.$http.post("/super/admin/permission/update", data);
  }
  // 获取站点角色列表
  getWebsiteRoles(params) {
    return this.$http.get("/admin/role/search", params);
  }
  // 创建站点角色
  createWebsiteRole(data) {
    return this.$http.post("/admin/role/create", data);
  }
  // 修改站点角色
  updataWebsiteRole(data) {
    return this.$http.post("/admin/role/update", data);
  }
  // 删除站点角色
  deleteWebsiteRole(id) {
    return this.$http.get(`/admin/role/delete/${id}`);
  }
  // 从新分配权限
  resetPermission(data) {
    return this.$http.post("/admin/role/permission/reset/all", data);
  }
  // 获取角色权限列表
  getRolePermissionList(id) {
    return this.$http.get(`/admin/role/permission/all/${id}`);
  }
  // 撤销权限
  revokePermission(data) {
    return this.$http.post("/admin/role/permission/revoke", data);
  }
  // 添加权限
  givePermission(data) {
    return this.$http.post("/admin/role/permission/give", data);
  }
  // 给管理员绑定角色
  giveUserRole(data) {
    return this.$http.post("/admin/admin_user/role/revoke", data);
  }
  // 绑定管理员角色 重置
  resetUserRole(data) {
    return this.$http.post("/admin/admin_user/role/reset/all", data);
  }
  // 查询管理员绑定角色
  queryAdminRoles(id) {
    return this.$http.get(`/admin/admin_user/role/all/${id}`);
  }
  // 查询所有字典数据
  queryDicData(website_id) {
    return this.$http.get(`/common/dictionary/all?website_id=${website_id}`);
  }
  // 查看套餐列表
  getModeCategoryList(params) {
    return this.$http.get("/super/admin/website/mode_category/search", params);
  }
  // 修改套餐
  updataModeCategory(data) {
    return this.$http.post("/super/admin/website/mode_category/update", data);
  }
  // 添加套餐
  createModeCategory(data) {
    return this.$http.post("/super/admin/website/mode_category/create", data);
  }
  // 删除套餐
  deleteModeCategory(id) {
    return this.$http.get(`/super/admin/website/mode_category/delete/${id}`);
  }
  // 创建租户信息
  createTenantData(data) {
    return this.$http.post("/super/admin/tenant/create", data);
  }
  // 获取租户信息列表
  getTenantList(params) {
    return this.$http.get("/super/admin/tenant/search", params);
  }
  // 删除租户列表
  deleteTenatList(id) {
    return this.$http.get(`/super/admin/tenant/delete/${id}`);
  }
  // 修改租户信息
  updateTenantData(data) {
    return this.$http.post("/super/admin/tenant/update", data);
  }
  // 添加充值记录
  createTopupRecord(data) {
    return this.$http.post("/super/admin/tenant/top_up_record/create", data);
  }
  // 充值记录列表
  getTopupRecord(params) {
    return this.$http.get("/super/admin/tenant/top_up_record/search", params);
  }
  // 获取租户站点token
  getTenantToken(id) {
    return this.$http.get(`/super/admin/tenant/token/${id}`);
  }
  // 添加提交审核中新增撤销审核
  revocationReview() {
    return this.$http.get("/admin/wx_open/mini_program/code/undo/code/audit");
  }
  // 查询免责声明
  querydisclaimer(category) {
    return this.$http.get(`/super/admin/disclaimer/query/category/${category}`);
  }
  // 创建免责声明
  createDisclaimerData(data) {
    return this.$http.post("/super/admin/disclaimer/put", data);
  }
}

export default new UserCenter();
