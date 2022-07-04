<script lang="ts" setup>
  import { listCategory } from '@/api/category';
  import {
    type PartialNews,
    type News,
    getNewsById,
    listNewsCategory,
  } from '@/api/news';
  import { ElForm, FormRules } from 'element-plus';
  import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
  import { useRouter } from 'vue-router';

  import SingleUpload from '@/components/single-upload/index.vue';
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
    // 商品图册
    pictures: [
      { url: undefined },
      { url: undefined },
      { url: undefined },
      { url: undefined },
      { url: undefined },
    ] as Array<any>,
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

  const { categoryOptions, pictures, rules } = toRefs(state);

  function validate(callback: () => void) {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        callback();
      }
    });
  }

  defineExpose({ validate });

  const router = useRouter();
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
        // const mainPicUrl = data.coverImgUrl;
        // if (mainPicUrl) {
        //   state.pictures[0].url = mainPicUrl;
        // }
        // const { scollImages } = data;
        // if (scollImages && scollImages.length > 0) {
        //   for (let i = 1; i <= scollImages.length; i += 1) {
        //     state.pictures[i].url = scollImages[i - 1];
        //   }
        // }
      });
    }
  }

  /**
   * 切换主图
   */
  // function changeMainPicture(changeIndex: number) {
  //   const currMainPicture = JSON.parse(JSON.stringify(state.pictures[0]));
  //   const nextMainPicture = JSON.parse(
  //     JSON.stringify(state.pictures[changeIndex])
  //   );

  //   state.pictures[0].url = nextMainPicture.url;
  //   state.pictures[changeIndex].url = currMainPicture.url;
  // }

  // 当图改变时 修改newsInfo中的图片
  // watch(
  //   pictures,
  //   (newValue: { url: string }[]) => {
  //     console.log(newValue);
  //     newsInfo.value.coverImgUrl = newValue[0]?.url;
  //     newsInfo.value.scollImages = newValue
  //       .slice(1)
  //       .filter((item) => item.url)
  //       .map((item) => item.url);
  //   },
  //   { deep: true, immediate: true }
  // );

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
        <editor v-model="newsInfo.content" style="height: 600px" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .component-container__main[px-720] {
    @apply md:m1px lg:mx-20px my-auto

    .button {
      margin-left: 10px;
    }
  }
</style>
