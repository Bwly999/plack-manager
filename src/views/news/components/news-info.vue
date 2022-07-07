<script lang="ts" setup>
  import {
    type PartialNews,
    type News,
    getNewsById,
    listNewsCategory,
  } from '@/api/news';
  import { ElForm, FormRules } from 'element-plus';
  import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
  import { useRouter } from 'vue-router';

  import Editor from '@/components/editor/index.vue';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    modelValue: PartialNews;
  }>();

  const newsInfo = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  const dataFormRef = ref(ElForm);

  const state = reactive({
    categoryOptions: [] as Array<any>,
    rules: {
      newsTitle: [
        { required: true, message: '请填写新闻标题', trigger: 'blur' },
      ],
      // author: [{ required: true, message: '请填写价格', trigger: 'blur' }],
      category: [
        { required: true, message: '请选择新闻分类', trigger: 'blur' },
      ],
      content: [{ required: true, message: '请填写新闻内容', trigger: 'blur' }],
    } as FormRules,
  });

  const { categoryOptions, rules } = toRefs(state);

  function validate(callback: () => void) {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        callback();
      }
    });
  }

  defineExpose({ validate });

  const router = useRouter();
  const content = ref('');
  const editorRef = ref<InstanceType<typeof Editor>>();
  function loadData() {
    listNewsCategory().then(({ data }) => {
      state.categoryOptions = data;
    });
    const { ...othersQuery } = router.currentRoute.value.query;
    console.log(othersQuery);
    const goodsId = othersQuery?.goodsId as string;
    if (goodsId) {
      getNewsById(goodsId).then((resp) => {
        const data = resp.data as News;
        newsInfo.value = data;
        editorRef.value?.setHtml(data.content);
        // content.value = data.content || '';
        // console.log(content.value);
      });
    }
  }

  watch(content, (...args) => {
    console.log(args);
  });

  onMounted(() => {
    loadData();
  });
</script>

<template>
  <div class="component-container__main">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="newsInfo"
      label-width="120px"
    >
      <el-form-item label="新闻标题" prop="newsTitle">
        <el-input v-model="newsInfo.newsTitle" style="width: 400px" />
      </el-form-item>
      <el-form-item label="新闻作者" prop="author">
        <el-input v-model="newsInfo.author" style="width: 400px" />
      </el-form-item>
      <el-form-item label="新闻类别" prop="newsType">
        <el-select v-model="newsInfo.newsType" style="width: 400px" clearable>
          <el-option
            v-for="(item, i) in categoryOptions"
            :key="i"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="新闻内容" prop="content">
        <!-- <el-form-item label="新闻内容"> -->
        <editor
          ref="editorRef"
          v-model="newsInfo.content"
          style="height: 600px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .component-container__main {
    // @apply md:m1px lg:mx-20px my-auto

    .button {
      margin-left: 10px;
    }
  }
</style>
