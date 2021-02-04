import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
// 在VUE中路由遇到Error: Avoided redundant navigation to current location:报错路由重复，
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

import login from "@/page/login";
export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: "/list",
      meta: { needLogin: true },
    },
    {
      path: "/",
      component: (resolve) => require(["@/page/home"], resolve),
      children: [
        {
          path: "/list",
          component: (resolve) => require(["@/components/main/list"], resolve),
          // 判断是否需要登录
          meta: { title: "站点列表" },
          name: "站点列表",
        },
        {
          path: "/tfy_list",
          component: (resolve) =>
            require(["@/components/main/tfy_list"], resolve),
          meta: { title: "腾房云站点列表" },
          name: "腾房云站点列表",
        },
        {
          path: "/add_list",
          component: (resolve) =>
            require(["@/components/main/add_list"], resolve),
          // 判断是否需要登录
          meta: { title: "创建站点" },
          name: "创建站点",
        },
        {
          path: "/updata_web",
          component: (resolve) =>
            require(["@/components/main/updata_web"], resolve),
          // 判断是否需要登录
          meta: { title: "修改站点信息" },
          name: "修改站点信息",
        },
        {
          path: "/edit_list",
          component: (resolve) =>
            require(["@/components/main/edit_list"], resolve),
          // 判断是否需要登录
          meta: { title: "编辑站点列表信息" },
          name: "编辑站点列表信息",
        },
        {
          path: "/add_admin_list",
          component: (resolve) =>
            require(["@/components/main/add_admin_list"], resolve),
          // 判断是否需要登录
          meta: { title: "创建管理员" },
          name: "创建管理员",
        },
        {
          path: "/edit_admin",
          component: (resolve) =>
            require(["@/components/main/edit_admin"], resolve),
          // 判断是否需要登录
          meta: { title: "修改管理员信息" },
          name: "修改管理员信息",
        },
        {
          path: "/help_list",
          component: (resolve) => require(["@/components/help/list"], resolve),
          // 判断是否需要登录
          meta: { title: "帮助列表" },
          name: "帮助列表",
        },
        {
          path: "/create_help",
          component: (resolve) =>
            require(["@/components/help/create_help"], resolve),
          // 判断是否需要登录
          meta: { title: "创建帮助信息" },
          name: "创建帮助信息",
        },
        {
          path: "/edit_help",
          component: (resolve) =>
            require(["@/components/help/edit_help"], resolve),
          // 判断是否需要登录
          meta: { title: "修改信息" },
          name: "修改信息",
        },
        {
          path: "/dictionary_list",
          component: (resolve) =>
            require(["@/components/dictionary/dictionary_list"], resolve),
          // 判断是否需要登录
          meta: { title: "字典列表" },
          name: "字典列表",
        },
        {
          path: "/edit_dictionary",
          component: (resolve) =>
            require(["@/components/dictionary/edit_dictionary"], resolve),
          // 判断是否需要登录
          meta: { title: "编辑字典" },
          name: "编辑字典",
        },
        {
          path: "/mini_site",
          component: (resolve) =>
            require(["@/components/mini/mini_site"], resolve),
          meta: { title: "小程序模板列表" },
          name: "小程序模板列表",
        },
        {
          path: "/draft_list",
          component: (resolve) =>
            require(["@/components/mini/draft_list"], resolve),
          meta: { title: "小程序代码草稿箱" },
          name: "小程序代码草稿箱",
        },
        {
          path: "/already_code_list",
          component: (resolve) =>
            require(["@/components/mini/already_code_list"], resolve),
          meta: { title: "已上传代码列表" },
          name: "已上传代码列表",
        },
        {
          path: "/authorization_list",
          component: (resolve) =>
            require(["@/components/mini/authorization_list"], resolve),
          meta: { title: "授权信息列表" },
          name: "授权信息列表",
        },
        {
          path: "/review_status_list",
          component: (resolve) =>
            require(["@/components/mini/review_status_list"], resolve),
          meta: { title: "用户通知列表" },
          name: "用户通知列表",
        },
        {
          path: "/review_audit_list",
          component: (resolve) =>
            require(["@/components/mini/review_audit_list"], resolve),
          meta: { title: "审核记录列表" },
          name: "审核记录列表",
        },
        {
          path: "/mini_program_list",
          component: (resolve) =>
            require(["@/components/mini/mini_program_list"], resolve),
          meta: { title: "已开通小程序站点" },
          name: "已开通小程序站点",
        },
        {
          path: "/oss_list",
          component: (resolve) =>
            require(["@/components/package/oss_list"], resolve),
          meta: { title: "oss管理" },
          name: "oss管理",
        },
        {
          path: "/sms_list",
          component: (resolve) =>
            require(["@/components/package/sms_list"], resolve),
          meta: { title: "短信管理" },
          name: "短信管理",
        },
        {
          path: "/permission_list",
          component: (resolve) =>
            require(["@/components/permission/permission_list"], resolve),
          meta: { title: "权限管理" },
          name: "权限管理",
        },
        {
          path: "/role_list",
          component: (resolve) =>
            require(["@/components/permission/role_list"], resolve),
          meta: { title: "角色权限" },
          name: "角色权限",
        },
        {
          path: "/mode_category_list",
          component: (resolve) =>
            require(["@/components/website/mode_category_list"], resolve),
          meta: { title: "版本列表" },
          name: "版本列表",
        },
        {
          path: "/tenant_list",
          component: (resolve) =>
            require(["@/components/tenant/tenant_list"], resolve),
          meta: { title: "租赁列表" },
          name: "租赁列表",
        },
        {
          path: "/topup_record",
          component: (resolve) =>
            require(["@/components/tenant/topup_record"], resolve),
          meta: { title: "充值记录" },
          name: "充值记录",
        },
        {
          path: "/disclaimer_list",
          component: (resolve) =>
            require(["@/components/help/disclaimer_list"], resolve),
          meta: { title: "免责声明" },
          name: "免责声明",
        },
      ],
    },
    {
      path: "/login",
      name: "登录",
      component: login,
    },
  ],
});
