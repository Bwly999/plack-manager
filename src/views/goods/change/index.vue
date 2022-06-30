<script lang="ts" setup>
  import { type PartialGoods, updateGoods } from '@/api/goods';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref } from 'vue';
  import GoodsInfo from '../components/goods-info.vue';

  const goodsInfo = ref<PartialGoods>({});

  const goodsInfoCardRef = ref();

  function changeGoods() {
    const { id } = goodsInfo.value;
    console.log(goodsInfo.value);
    if (!id) {
      ElMessageBox.alert('该商品信息不存在');
      return;
    }
    ElMessageBox.confirm('确认要修改商品信息吗？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    }).then(() => {
      updateGoods(id, goodsInfo.value).then(() => {
        ElMessage.success('修改成功');
      });
    });
  }

  function submitChange() {
    goodsInfoCardRef.value.validate(() => {
      console.log('goodsInfoCardRef.value.validate');
      changeGoods();
    });
  }
</script>

<template>
  <div class="container1">
    <Breadcrumb :items="['menu.goods', 'menu.goods.change']" />
    <div class="container bg-white rounded-2xl p4">
      <GoodsInfo ref="goodsInfoCardRef" v-model="goodsInfo" class="" />
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
