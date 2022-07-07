<script lang="ts" setup>
  import { type PartialNews, updateNews } from '@/api/news';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref } from 'vue';
  import NewsInfo from '../components/news-info.vue';

  const newsInfo = ref<PartialNews>({});
  newsInfo.value.content = '11111111111';

  const newsInfoCardRef = ref<InstanceType<typeof NewsInfo>>();

  function changeGoods() {
    const { id } = newsInfo.value;
    console.log(newsInfo.value);
    if (!id) {
      ElMessageBox.alert('该新闻信息不存在');
      return;
    }
    ElMessageBox.confirm('确认要修改该新闻吗？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    }).then(() => {
      updateNews(id, newsInfo.value).then(() => {
        ElMessage.success('修改成功');
      });
    });
  }

  function submitChange() {
    newsInfoCardRef.value?.validate(() => {
      console.log('newsInfoCardRef.value.validate');
      changeGoods();
    });
  }
</script>

<template>
  <div class="container1">
    <Breadcrumb :items="['menu.news', 'menu.news.change']" />
    <div class="container bg-white rounded-2xl p4 md:p4 lg:p4">
      <NewsInfo ref="newsInfoCardRef" v-model="newsInfo" class="" />
      <div class="flex justify-end">
        <el-button type="primary" @click="submitChange">修改</el-button>
      </div>
    </div>
  </div>
</template>

<style>
  .container1 {
    padding: 0 20px 20px 20px;
  }
</style>
