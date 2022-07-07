<template>
  <div class="container1">
    <Breadcrumb :items="['menu.news', 'menu.news.add']" />
    <div class="component-container bg-white rounded-2xl p4">
      <NewsInfo ref="newsInfoCardRef" v-model="newsInfo" />
      <div class="flex justify-end">
        <el-button type="primary" @click="sumbmitOnshelf">新增</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  // API 依赖
  import { type PartialNews, createNews } from '@/api/news';
  import NewsInfo from '../components/news-info.vue';

  const newsInfoCardRef = ref<InstanceType<typeof NewsInfo>>();

  const newsInfo = ref<PartialNews>({
    newsTitle: undefined,
    newsType: undefined,
    author: undefined,
    content: '11111111111111',
  });

  function onshelf() {
    ElMessageBox.confirm('是否新增该新闻？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    }).then(() => {
      createNews(newsInfo.value)
        .then(() => {
          ElMessage.success('新增成功');
        })
        .catch(() => {
          ElMessage.error('新增失败');
        });
    });
  }

  function sumbmitOnshelf() {
    newsInfoCardRef.value?.validate(() => {
      onshelf();
    });
  }
</script>

<style lang="scss" scoped>
  .container1 {
    padding: 0 20px 20px 20px;
  }
  .component-container {
    &__main {
      margin: 20px auto;

      .button {
        margin-left: 10px;
      }
    }

    &__footer {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }
  }
</style>
