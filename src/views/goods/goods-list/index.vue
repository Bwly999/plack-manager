<script setup lang="ts">
  import { reactive, ref, onMounted, toRefs } from 'vue';
  import { ElTable, ElMessage, ElMessageBox } from 'element-plus';
  import { useRouter } from 'vue-router';

  import {
    Search,
    Position,
    Edit,
    Refresh,
    Delete,
    View,
  } from '@element-plus/icons-vue';
  import type { GoodsRecord, GoodsParams } from '@/api/goods';
  import { listGoodsPages, deleteGoods } from '@/api/goods';
  import { moneyFormatter } from '@/utils/filter';
  import { listCategory } from '@/api/category';
  import { useUserStore } from '@/store';

  const dataTableRef = ref(ElTable);
  const router = useRouter();

  const state = reactive({
    // 遮罩层
    loading: true,
    // 选中数组
    ids: [],
    // 非单个禁用
    single: true,
    // 非多个禁用
    multiple: true,
    total: 0,
    queryParams: {
      page: 1,
      pageSize: 10,
    } as GoodsParams,
    goodsList: [] as GoodsRecord[],
    categoryOptions: [],
    goodDetail: undefined,
    dialogVisible: false,
  });

  const {
    loading,
    multiple,
    queryParams,
    goodsList,
    categoryOptions,
    goodDetail,
    total,
    dialogVisible,
  } = toRefs(state);

  const userStore = useUserStore();

  function handleQuery() {
    state.loading = true;
    listGoodsPages(userStore.shop?.id || '', state.queryParams)
      .then(({ data }) => {
        state.goodsList = data.content;
        state.total = data.totalElements;
        state.loading = false;
      })
      .finally(() => {
        state.loading = false;
      });
  }

  function resetQuery() {
    state.queryParams = {
      page: 1,
      pageSize: 10,
      name: undefined,
      category: undefined,
    };
    handleQuery();
  }

  function handleGoodsView(detail: any) {
    state.goodDetail = detail;
    state.dialogVisible = true;
  }

  function handleAdd() {
    router.push({ path: 'onshelf' });
  }

  function handleUpdate(row: any) {
    router.push({
      path: 'change',
      query: { goodsId: row.id },
    });
  }

  function handleDelete(row: any) {
    const ids = row.id || state.ids.join(',');
    ElMessageBox.confirm('是否确认删除选中的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        return deleteGoods(ids);
      })
      .then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
  }

  function handleRowClick(row: any) {
    dataTableRef.value.toggleRowSelection(row);
  }

  function handleSelectionChange(selection: any) {
    state.ids = selection.map((item: { id: any }) => item.id);
    state.single = selection.length !== 1;
    state.multiple = !selection.length;
  }

  onMounted(() => {
    listCategory().then((response: any) => {
      categoryOptions.value = response.data?.map((item: any) => {
        return {
          label: item,
          value: item,
        };
      });
    });
    handleQuery();
  });
</script>

<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
  export default {
    name: 'Goods',
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.goods', 'menu.goods.list']" />
    <div class="bg-white rounded-2xl p4">
      <el-form ref="queryForm" class="mt-4" :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.name"
            placeholder="商品名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader
            v-model="queryParams.category"
            placeholder="商品分类"
            :props="{ emitPath: false }"
            :options="categoryOptions"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery"
            >查询</el-button
          >
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item class="">
          <el-button type="success" :icon="Position" @click="handleAdd"
            >发布商品</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="goodsList"
        border
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" min-width="5%" center />
        <el-table-column type="expand" width="40" label="">
          <template #default="props">
            <!-- <el-table :data="props.row.skuList" border>
              <el-table-column align="center" label="商品编码" prop="skuSn" />
              <el-table-column align="center" label="商品规格" prop="name" />
              <el-table-column label="图片" prop="coverImgUrl">
                <template #default="scope">
                  <img :src="scope.row.coverImgUrl" width="40" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="现价" prop="price">
                <template #default="scope">{{
                  moneyFormatter(scope.row.price)
                }}</template>
              </el-table-column>
              <el-table-column align="center" label="库存" prop="stockNum" />
            </el-table> -->

            <!-- <el-card> -->
            <div text-left font-bold>
              <p>
                商品编号: <a font-normal> {{ props.row.id }} </a>
              </p>
              <p>
                商品名: <a font-normal>{{ props.row.name }}</a>
              </p>
              <div>
                <p>封面:</p>
                <img :src="props.row.coverImgUrl" inline width="160" />
              </div>
              <div label="详情图片" prop="coverImgUrl">
                <p>详情图片:</p>
                <div>
                  <img
                    v-for="(imgUrl, i) in props.row.scollImages"
                    :key="i"
                    :src="imgUrl"
                    width="160"
                  />
                </div>
              </div>
              <p>
                现价: <a font-normal>{{ moneyFormatter(props.row.price) }}</a>
              </p>
              <p>
                库存: <a font-normal>{{ props.row.stock }}</a>
              </p>
            </div>
            <!-- </el-card> -->
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" min-width="140" />
        <el-table-column label="商品图片">
          <template #default="scope">
            <el-popover placement="right" :width="400" trigger="hover">
              <img :src="scope.row.coverImgUrl" width="400" height="400" />
              <template #reference>
                <img
                  :src="scope.row.coverImgUrl"
                  style="max-height: 60px; max-width: 60px"
                />
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品类目" prop="category" min-width="100" />
        <el-table-column align="center" label="价格" prop="price">
          <template #default="scope">{{
            moneyFormatter(scope.row.price)
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="折扣价" prop="discountPrice">
          <template #default="scope">{{
            moneyFormatter(scope.row.discountPrice)
          }}</template>
        </el-table-column>

        <el-table-column label="销量" prop="monthSale" min-width="100" />
        <el-table-column label="重量" prop="weight" min-width="100" />
        <el-table-column label="库存" prop="stock" min-width="100" />
        <el-table-column label="详情" prop="detail">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="View"
              circle
              plain
              @click.stop="handleGoodsView(scope.row.desc)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              plain
              @click.stop="handleUpdate(scope.row)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              @click.stop="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页工具条 -->
      <pagination
        v-if="total > 0"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="handleQuery"
      />
      <el-dialog
        v-model="dialogVisible"
        width="70%"
        height="70%"
        title="商品详情"
      >
        <div class="goods-detail-box" v-html="goodDetail" />
        <!-- <div class="goods-detail-box">
          {{ goodDetail }}
        </div> -->
      </el-dialog>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
