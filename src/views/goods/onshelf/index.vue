<template>
  <div class="container1">
    <Breadcrumb :items="['menu.goods', 'menu.goods.onshelf']" />
    <div class="component-container bg-white rounded-2xl p4">
      <GoodsInfo ref="goodsInfoCardRef" v-model="goodsInfo" />
      <div class="flex justify-end">
        <el-button type="primary" @click="sumbmitOnshelf">上架</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  // API 依赖
  import { type GoodsRecord, onshelfGoods, getGoodsById } from '@/api/goods';
  import GoodsInfo from '../components/goods-info.vue';

  const goodsInfoCardRef = ref<InstanceType<typeof GoodsInfo>>();
  type PartialGoods = Partial<GoodsRecord>;

  const goodsInfo = ref<PartialGoods>({
    id: undefined,
    name: '',
    category: '',
    price: undefined,
    discountPrice: undefined,
    desc: '',
    stock: undefined,
    coverImgUrl: undefined,
    scollImages: [],
    shopId: '',
  });

  function onshelf() {
    ElMessageBox.confirm('是否要上架该商品？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    }).then(() => {
      onshelfGoods(goodsInfo.value)
        .then(() => {
          ElMessage.success('上架成功');
        })
        .catch(() => {
          ElMessage.error('上架失败');
        });
    });
  }

  function sumbmitOnshelf() {
    goodsInfoCardRef.value?.validate(() => {
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
