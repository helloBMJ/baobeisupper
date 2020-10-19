module.exports = {
  runtimeCompiler: true,
  publicPath:
    process.env.NODE_ENV === "development" ? "/super_admin/" : "/super_admin/",
  productionSourceMap: false,
  outputDir: "dist/super_admin",
  // assetsDir: "static",
  css: {
    loaderOptions: {
      less: {
        // 这里的选项会传递给 less-loader
        javascriptEnabled: false,
      },
    },
  },
  devServer: {
    host: "webfenxiao.tfcs.cn",
    https: true,
    // 运行项目自动打开浏览器
    open: true,
    disableHostCheck: true,
    port: 8081,
    proxy: {
      "/api": {
        target: "https://yun.tfcs.cn",
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "腾房云分销报备总控";
      return args;
    });
  },
};
