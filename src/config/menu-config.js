module.exports = [
  {
    name: "站点管理",
    id: "1",
    icon: "icon-zhandian",
    sub: [
      {
        name: "list",
        componentName: "list",
        title: "站点列表",
        icon: "icon-chazhaobiaodanliebiao",
      },
      {
        name: "add_list",
        componentName: "add_list",
        title: "创建站点",
        icon: "icon-chuangjian",
      },
      // {
      //   name: "already_code_list",
      //   componentName: "already_code_list",
      //   title: "已上传代码列表",
      // },
      {
        name: "oss_list",
        componentName: "oss_list",
        title: "oss管理",
        icon: "el-icon-money",
      },
      {
        name: "sms_list",
        componentName: "sms_list",
        title: "短信管理",
        icon: "el-icon-money",
      },
      {
        name: "draft_list",
        componentName: "draft_list",
        title: "小程序代码草稿箱",
        icon: "icon-xiaochengxu",
      },
    ],
  },
  {
    name: "帮助信息",
    id: "2",
    icon: "icon-bangzhu",
    sub: [
      {
        name: "help_list",
        componentName: "help_list",
        title: "帮助列表",
        icon: "icon-ic_dictionary",
      },
      {
        name: "create_help",
        componentName: "create_help",
        title: "创建帮助信息",
        icon: "icon-chuangjiangongdan",
      },
    ],
  },
  {
    name: "字典管理",
    id: "3",
    icon: "icon-ic_dictionary",
    sub: [
      {
        name: "dictionary_list",
        componentName: "dictionary_list",
        title: "字典列表",
        icon: "icon-zidian",
      },
    ],
  },
  // {
  //   name: "",
  //   id: "",
  //   sub: []
  // },
];
