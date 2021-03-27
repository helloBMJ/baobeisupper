// 把对象数据按照某一个属性进行分类
export function sortPro(data, keys = []) {
  //keys可以传一个数组
  var c = [];
  var d = {};
  for (var element of data) {
    let element_keyStr = "";
    let element_key = [];
    let element_keyObj = {};
    for (var key of keys) {
      element_key.push(element[key]);
      element_keyObj[key] = element[key];
    }
    element_keyStr = element_key.join("_");
    if (!d[element_keyStr]) {
      c.push({
        ...element_keyObj,
        children: [element],
      });
      d[element_keyStr] = element;
    } else {
      for (var ele of c) {
        let isTrue = keys.some((key) => {
          return ele[key] != element[key];
        });
        if (!isTrue) {
          ele.children.push(element);
        }
      }
    }
  }
  return c;
}
// 传地址栏参数名称拿数据
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export function sortArr(arr, str) {
  var _arr = [],
    _t = [],
    // 临时的变量
    _tmp;

  // 按照特定的参数将数组排序将具有相同值得排在一起
  arr = arr.sort(function(a, b) {
    var s = a[str],
      t = b[str];

    return s < t ? -1 : 1;
  });

  if (arr.length) {
    _tmp = arr[0][str];
  }
  // console.log( arr );
  // 将相同类别的对象添加到统一个数组
  for (var i in arr) {
    if (arr[i][str] === _tmp) {
      _t.push(arr[i]);
    } else {
      _tmp = arr[i][str];
      _arr.push(_t);
      _t = [arr[i]];
    }
  }
  // 将最后的内容推出新数组
  _arr.push(_t);
  return _arr;
}
//获取字典数组
export function getDictionary(type) {
  let list = [];
  this.$http.dictionaryFind(type).then((res) => {
    if (res.status === 200) {
      res.data.data.map((item) => {
        list.push(item);
      });
    }
  });
  return list;
}

export function toTree(data) {
  let result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach((item) => {
    delete item.children;
  });
  let map = {};
  data.forEach((item) => {
    map[item.id] = item;
  });
  data.forEach((item) => {
    let parent = map[item.pid];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 *  @title 后台接口请求字典数据
 *  @per_page {200} 一页显示的总数量
 *  @description 页面需要字典数据类型多的情况下使用，other times use $getDictionaryList
 *  @method use this.$setDictionary(e=>{})
 * */

export function setDictionary(callback) {
  this.$http.queryDicData(1).then((res) => {
    if (res.status === 200) {
      const arr = [];
      res.data.forEach((item) => {
        const parent = arr.find((cur) => cur.name === item.name);
        if (parent) {
          parent.childs.push(item);
        } else {
          const obj = {
            name: item.name,
            childs: [item],
          };
          arr.push(obj);
        }
      });
      callback(arr);
    }
  });
}

export function gotoPath(path) {
  this.$router.push(path);
}

// 从数组匹配内容(匹配列表数据对应描述内容)
export function computedValueArr(arr, value) {
  return arr[value]["description"];
}
