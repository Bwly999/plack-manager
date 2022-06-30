<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    type OrderParams,
    type OrderRecord,
    listOrderPages,
  } from '@/api/order';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  const generateFormModel = (): OrderParams => {
    return {
      state: undefined,
      goodsId: undefined,
      payWay: undefined,
    };
  };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OrderRecord[]>([]);
  const formModel = ref(generateFormModel());
  const basePagination = {
    page: 1,
    pageSize: 20,
    total: 0,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const payWayOptions = computed<SelectOptionData[]>(() => [
    {
      label: '微信支付',
      value: 0,
    },
    {
      label: '线下到付',
      value: 1,
    },
  ]);
  const stateOptions = computed<SelectOptionData[]>(() => [
    {
      label: '未支付',
      value: 0,
    },
    {
      label: '已支付',
      value: 1,
    },
    {
      label: '待收货',
      value: 2,
    },
    // {
    //   label: '待退款',
    //   value: 3,
    // },
  ]);
  const fetchData = async (params: OrderParams = { page: 1, pageSize: 20 }) => {
    setLoading(true);
    try {
      const { data } = await listOrderPages(params);
      renderData.value = data.content;
      pagination.page = params.page || 1;
      pagination.total = data.totalElements;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as OrderParams);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const payWayMap = new Map();
  payWayMap.set(0, '微信支付');
  payWayMap.set(1, '线下到付');

  const stateMap = new Map();
  stateMap.set(0, { label: '未支付' });
  stateMap.set(1, { label: '已支付' });
  stateMap.set(2, { label: '待收货' });
</script>

<script lang="ts">
  export default {
    name: 'OrderList',
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.order', 'menu.order.list']" />
    <a-card class="general-card pt-6">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="goodsId" label="商品编号">
                  <a-input
                    v-model="formModel.goodsId"
                    placeholder="请输入商品编号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="goodsName" label="商品名">
                  <a-input
                    v-model="formModel.goodsName"
                    placeholder="请输入商品名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="payWay" label="支付方式">
                  <a-select
                    v-model="formModel.payWay"
                    :options="payWayOptions"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="state" label="订单状态">
                  <a-select
                    v-model="formModel.state"
                    :options="stateOptions"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ '查询' }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ '重置' }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="订单编号" data-index="id" />
          <a-table-column title="商品名" data-index="goods.name" />
          <!-- <a-table-column
            :title="$t('searchTable.columns.contentType')"
            data-index="contentType"
          >
            <template #cell="{ record }">
              <a-space>
                <a-avatar
                  v-if="record.contentType === 'img'"
                  :size="16"
                  shape="square"
                >
                  <img
                    alt="avatar"
                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
                  />
                </a-avatar>
                <a-avatar
                  v-else-if="record.contentType === 'horizontalVideo'"
                  :size="16"
                  shape="square"
                >
                  <img
                    alt="avatar"
                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
                  />
                </a-avatar>
                <a-avatar v-else :size="16" shape="square">
                  <img
                    alt="avatar"
                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
                  />
                </a-avatar>
                {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
              </a-space>
            </template>
          </a-table-column> -->
          <a-table-column title="商品图" data-index="coverImgUrl">
            <template #cell="{ record }">
              <img :src="record.goods.coverImgUrl" w-20 />
            </template>
          </a-table-column>
          <a-table-column title="支付方式" data-index="payWay">
            <template #cell="{ record }">
              {{ payWayMap.get(record.payWay) }}
            </template>
          </a-table-column>
          <a-table-column title="购买数量" data-index="payNumber" />
          <a-table-column title="创建时间" data-index="createdTime" />
          <a-table-column title="状态" data-index="state">
            <template #cell="{ record }">
              <span v-if="record.state === 0" class="circle"></span>
              <span v-else class="circle pass"></span>
              {{ stateMap.get(record.state).label }}
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations">
            <template #cell>
              <a-button v-permission="['admin']" type="text" size="small">
                {{ $t('searchTable.columns.operations.view') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
