<template>
  <div class="p-ueditor">
    <div ref="editorId"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editor: null,
      id: "editor" + new Date().getTime(),
    };
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    value: function(val) {
      this.editor.setContent(val);
    },
  },
  methods: {
    resetContent() {
      this.editor.setContent("");
    },
  },
  mounted() {
    this.$nextTick(function f1() {
      // 保证 this.$el 已经插入文档
      this.$refs.editorId.id = this.id; //创建动态id
      this.editor = window.UE.getEditor(this.id, this.config);
      this.editor.ready(
        function f2() {
          this.editor.setContent(this.value);
          this.editor.addListener(
            "contentChange",
            function() {
              const wordCount = this.editor.getContentLength(true);
              const content = this.editor.getContent();
              const plainTxt = this.editor.getPlainTxt();
              const htmlCont = this.editor.getAllHtml();
              // 编辑器内容有变动,通知父组件
              this.$emit("input", {
                wordCount: wordCount,
                content: content,
                plainTxt: plainTxt,
                htmlCont: htmlCont,
              });
            }.bind(this)
          );
          // editor初始化后操作
          this.$emit("ready", this.editor);
        }.bind(this)
      );
    });
  },
};
</script>
