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
  import {
    type News,
    type NewsParam,
    listNewsPage,
    listNewsCategory,
    deleteNews,
  } from '@/api/news';

  const dataTableRef = ref(ElTable);
  const router = useRouter();

  interface CategoryOption {
    label: string;
    value: string;
  }
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
    } as NewsParam,
    newsList: [] as News[],
    categoryOptions: [] as CategoryOption[],
    goodDetail: undefined,
    dialogVisible: false,
  });

  const {
    loading,
    multiple,
    queryParams,
    newsList,
    categoryOptions,
    goodDetail,
    total,
    dialogVisible,
  } = toRefs(state);

  const userStore = useUserStore();

  function handleQuery() {
    state.loading = true;
    listNewsPage(state.queryParams)
      .then(({ data }) => {
        state.newsList = data.records;
        state.total = data.total;
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
    };
    handleQuery();
  }

  function handleGoodsView(detail: any) {
    state.goodDetail = detail;
    state.dialogVisible = true;
  }

  function handleAdd() {
    router.push({ path: 'add' });
  }

  function handleUpdate(row: any) {
    router.push({
      path: 'change',
      query: { goodsId: row.id },
    });
  }

  function handleDelete(row: any) {
    const id = row.id || state.ids.join(',');
    ElMessageBox.confirm('是否确认删除选中的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        return deleteNews(id);
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
    listNewsCategory().then((response) => {
      categoryOptions.value = response.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    });
    handleQuery();
  });

  function sortBrowse({
    column,
    prop,
    order,
  }: {
    column: string;
    prop: string;
    order: string;
  }) {
    const ascSign = 'ascending';
    const descSign = 'descending';
    queryParams.value.browseOrder = undefined;
    queryParams.value.favorOrder = undefined;
    queryParams.value.collectOrder = undefined;
    if (prop === 'browseCount') {
      if (order === ascSign) queryParams.value.browseOrder = 'asc';
      else if (order === descSign) queryParams.value.browseOrder = 'desc';
    } else if (prop === 'favorCount') {
      if (order === ascSign) queryParams.value.favorOrder = 'asc';
      else if (order === descSign) queryParams.value.favorOrder = 'desc';
    } else if (prop === 'collectCount') {
      if (order === ascSign) queryParams.value.collectOrder = 'asc';
      else if (order === descSign) queryParams.value.collectOrder = 'desc';
    }

    handleQuery();
    console.log(queryParams.value);

    console.log(column, prop, order);
  }
</script>

<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
  export default {
    name: 'NewsList',
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.news', 'menu.news.list']" />
    <div class="bg-white rounded-2xl p4">
      <el-form class="mt-4" :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.title"
            placeholder="新闻标题"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader
            v-model="queryParams.type"
            placeholder="新闻类别"
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
            >新闻发布</el-button
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
        :data="newsList"
        border
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @sort-change="sortBrowse"
      >
        <el-table-column type="selection" min-width="5%" center />
        <el-table-column label="新闻标题" prop="newsTitle" min-width="140" />
        <el-table-column
          label="新闻类别"
          prop="newsType"
          min-width="100"
          sortable
        >
          <template #default="scope">
            {{ scope.row.newsType }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="作者" prop="author">
          <template #default="scope">
            {{ scope.row.author }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="浏览数"
          sortable="custom"
          prop="browseCount"
        >
          <template #default="scope">
            {{ scope.row.browseCount }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="喜欢数"
          prop="favorCount"
          sortable="custom"
        >
          <template #default="scope">
            {{ scope.row.favorCount }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="收藏数"
          prop="collectCount"
          sortable="custom"
        >
          <template #default="scope">
            {{ scope.row.collectCount }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="monthSale" min-width="100" />
        <el-table-column label="详情" prop="cotent">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="View"
              circle
              plain
              @click.stop="handleGoodsView(scope.row.content)"
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
        title="新闻内容"
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
