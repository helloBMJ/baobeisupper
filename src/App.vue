<template>
  <!-- 
  ymm
  13299923366
  jinke888
 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {}
};
</script>

<style lang="scss">
.el-main {
  border-top: 1px solid #f0f0f0;
}
.div {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  &.row {
    flex-direction: row;
  }
}
* {
  padding: 0;
  margin: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
}
ul,
ol {
  list-style: none;
}
#app {
  height: 100%;
}
</style>
