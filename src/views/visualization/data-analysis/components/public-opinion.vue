<template>
  <a-card
    class="general-card"
    :title="$t('dataAnalysis.title.publicOpinion')"
    :header-style="{ paddingBottom: '12px' }"
  >
    <a-grid :cols="24" :col-gap="12" :row-gap="12">
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          title="浏览总次数"
          quota="浏览"
          chart-type="line"
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #284991 0%, #122B62 100%)'
              : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          title="喜欢总次数"
          quota="喜欢"
          chart-type="bar"
          :card-style="{
            background: isDark
              ? ' linear-gradient(180deg, #3D492E 0%, #263827 100%)'
              : 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          title="收藏总次数"
          quota="收藏"
          chart-type="line"
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)'
              : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          :title="$t('dataAnalysis.card.title.totalShare')"
          quota="share"
          chart-type="pie"
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
              : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
          }"
        />
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>
  import useThemes from '@/hooks/themes';
  import ChainItem from './chain-item.vue';

  const { isDark } = useThemes();
</script>
