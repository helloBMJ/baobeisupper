<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
/* eslint-disable */

export default {
  name: "ue",
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    value: {
      handler: function(val) {
        this.editor.setContent(val);
      },
    },
  },
  props: {
    value: "",
    config: {},
  },
  created() {},
  mounted() {
    const _this = this;
    this.editor = window.UE.getEditor("editor", this.config);
    // 初始化UE
    this.editor.addListener("ready", function() {
      setTimeout(() => {
        _this.editor.setContent(_this.value);
      }, 600);
      // 确保UE加载完成后，放入内容。
    });
  },
  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent();
    },
  },
  destroyed() {
    this.editor.destroy();
  },
};
</script>
