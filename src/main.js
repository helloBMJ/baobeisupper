// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import {
  sortPro,
  GetQueryString,
  sortArr,
  getDictionary,
  toTree,
  setDictionary,
  gotoPath,
} from "./utils/tools";
// 引入工具类
import "element-ui/lib/theme-chalk/index.css";

import http from "@/utils/http";
import "../public/static/ueditor/ueditor.config.js";
import "../public/static/ueditor/ueditor.all.min.js";
import "../public/static/ueditor/lang/zh-cn/zh-cn.js";
import "../public/static/ueditor/ueditor.parse.min.js";

// 引入图标
import "./assets/icon/iconfont.css";
// 请求数据
Vue.prototype.$http = http;
Vue.prototype.$sortPro = sortPro;
Vue.prototype.$GetQueryString = GetQueryString;
Vue.prototype.$sortArr = sortArr;
Vue.prototype.$getDictionary = getDictionary;
Vue.prototype.$setDictionary = setDictionary;
Vue.prototype.$toTree = toTree;
Vue.prototype.$gotoPath = gotoPath;
// 过滤时间戳格式
Vue.filter("time", (time) => {
  return new Date(parseInt(time) * 1000)
    .toLocaleString()
    .replace(/:\d{1,2}$/, " ");
});
Vue.use(ElementUI);
// 监视是否登录，没有登录返回到登录界面
router.beforeEach((to, from, next) => {
  let token = window.localStorage.sup_TOKEN;
  if (!token && to.path !== "/login") {
    router.push({
      path: "/login",
    });
    // next()
  } else {
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
});
