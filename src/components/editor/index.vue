<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="html"
      :default-config="editorConfig"
      style="height: 500px; overflow-y: hidden"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    onBeforeUnmount,
    shallowRef,
    reactive,
    toRefs,
    watch,
    computed,
    onMounted,
  } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  // API 引用
  import { uploadFile } from '@/api/file';
  import { IDomEditor } from '@wangeditor/editor';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const html = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef<IDomEditor>();

  const state = reactive({
    toolbarConfig: {},
    editorConfig: {
      placeholder: '请输入内容...',
      MENU_CONF: {
        uploadImage: {
          // 自定义图片上传
          async customUpload(file: any, insertFn: any) {
            uploadFile(file).then((response) => {
              const url = response.data;
              insertFn(url);
            });
          },
        },
      },
    },
    defaultHtml: props.modelValue,
    mode: 'default',
  });

  const { toolbarConfig, editorConfig, defaultHtml, mode } = toRefs(state);

  const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };

  const setHtml = (ht: string) => {
    // html.value = `<p>${ht}</p>`;
    setTimeout(() => {
      // console.log('setHtml', ht);
      html.value = `<p>${ht}</p>`;
      // html.value = ht;
    }, 10);
  };
  defineExpose({ setHtml });

  function handleChange(editor: any) {
    // emit('update:modelValue', editor.getHtml());
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
