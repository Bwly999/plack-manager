<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.visualization', 'menu.visualization.dataAnalysis']"
    />
    <a-space direction="vertical" :size="12" fill>
      <a-space direction="vertical" :size="16" fill>
        <div class="space-unit">
          <PublicOpinion />
        </div>
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item
              :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16 }"
            >
              <ContentPublishRatio />
            </a-grid-item>
            <a-grid-item
              :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }"
            >
              <UserActions style="margin-bottom: 16px" chart-type="bar" />
              <UserActions chart-type="pie" />
            </a-grid-item>
          </a-grid>
        </div>
        <div>
          <ContentPublishingSource />
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import PublicOpinion from './components/public-opinion.vue';
  import ContentPeriodAnalysis from './components/content-period-analysis.vue';
  import ContentPublishRatio from './components/content-publish-ratio.vue';
  import PopularAuthor from './components/popular-author.vue';
  import ContentPublishingSource from './components/content-publishing-source.vue';
  import UserActions from './components/user-actions.vue';
</script>

<script lang="ts">
  export default {
    name: 'DataAnalysis',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    margin-bottom: 20px;
  }

  .space-unit {
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  .title-fix {
    margin: 0 0 12px 0;
    font-size: 14;
  }
  :deep(.section-titile) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
</style>
