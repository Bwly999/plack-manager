<script lang="ts" setup>
  import { listCategory } from '@/api/category';
  import { type GoodsRecord, getGoodsById } from '@/api/goods';
  import { ElForm } from 'element-plus';
  import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
  import { useRouter } from 'vue-router';

  import SingleUpload from '@/components/single-upload/index.vue';
  import Editor from '@/components/editor/index.vue';

  type PartialGoods = Partial<GoodsRecord>;
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    modelValue: PartialGoods;
  }>();

  const goodsInfo = computed({
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
      name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
      price: [{ required: true, message: '请填写价格', trigger: 'blur' }],
      //   discountPrice: [
      //     { required: true, message: '请填写优惠价', trigger: 'blur' },
      //   ],
      category: [
        { required: true, message: '请选择商品分类', trigger: 'blur' },
      ],
      stock: [{ required: true, message: '请填写库存', trigger: 'blur' }],
    },
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
    listCategory().then(({ data }) => {
      state.categoryOptions = data;
    });
    const { ...othersQuery } = router.currentRoute.value.query;
    console.log(othersQuery);
    const goodsId = othersQuery?.goodsId as string;
    if (goodsId) {
      getGoodsById(goodsId).then((resp) => {
        const data = resp.data as PartialGoods;
        goodsInfo.value = data;
        const mainPicUrl = data.coverImgUrl;
        if (mainPicUrl) {
          state.pictures[0].url = mainPicUrl;
        }
        const { scollImages } = data;
        if (scollImages && scollImages.length > 0) {
          for (let i = 1; i <= scollImages.length; i += 1) {
            state.pictures[i].url = scollImages[i - 1];
          }
        }
      });
    }
  }

  /**
   * 切换主图
   */
  function changeMainPicture(changeIndex: number) {
    const currMainPicture = JSON.parse(JSON.stringify(state.pictures[0]));
    const nextMainPicture = JSON.parse(
      JSON.stringify(state.pictures[changeIndex])
    );

    state.pictures[0].url = nextMainPicture.url;
    state.pictures[changeIndex].url = currMainPicture.url;
  }

  const price = ref<number>();
  const discountPrice = ref<number>();

  // 当图改变时 修改goodsInfo中的图片
  watch(
    pictures,
    (newValue: { url: string }[]) => {
      console.log(newValue);
      goodsInfo.value.coverImgUrl = newValue[0]?.url;
      goodsInfo.value.scollImages = newValue
        .slice(1)
        .filter((item) => item.url)
        .map((item) => item.url);
    },
    { deep: true, immediate: true }
  );

  watch(price, (newValue: number | undefined) => {
    if (newValue !== undefined)
      goodsInfo.value.price = Math.floor(newValue * 100);
  });

  watch(discountPrice, (newValue: number | undefined) => {
    if (newValue !== undefined)
      goodsInfo.value.discountPrice = Math.floor(newValue * 100);
  });

  onMounted(() => {
    loadData();
  });
</script>

<template>
  <div class="component-container__main">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="goodsInfo"
      label-width="120px"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="goodsInfo.name" style="width: 400px" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="goodsInfo.category" style="width: 400px" clearable>
          <el-option
            v-for="(item, i) in categoryOptions"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品产地" prop="originPlace">
        <el-input v-model="goodsInfo.originPlace" style="width: 400px" />
      </el-form-item>

      <el-form-item label="商品重量" prop="weight">
        <el-input v-model="goodsInfo.weight" style="width: 400px">
          <template #append>斤</template>
        </el-input>
      </el-form-item>

      <el-form-item label="商品等级" prop="level">
        <el-input v-model="goodsInfo.level" style="width: 400px" />
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model="price" type="number" style="width: 400px">
          <template #append>元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="优惠价" prop="discountPrice">
        <el-input v-model="discountPrice" type="number" style="width: 400px">
          <template #append>元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input v-model="goodsInfo.stock" style="width: 400px" />
      </el-form-item>

      <el-form-item label="商品展示视频">
        <el-card
          style="
            width: 170px;
            display: inline-block;
            margin-left: 10px;
            text-align: center;
          "
          :body-style="{ padding: '10px' }"
        >
          <single-upload
            v-model="goodsInfo.videoUrl"
            :show-close="true"
            accept="video/*"
          />

          <div>
            <!-- 占位 -->
            <el-link type="info" />
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="商品相册">
        <el-card
          v-for="(item, index) in pictures"
          :key="index"
          style="
            width: 170px;
            display: inline-block;
            margin-left: 10px;
            text-align: center;
          "
          :body-style="{ padding: '10px' }"
        >
          <single-upload v-model="item.url" :show-close="true" />

          <div v-if="item.url">
            <el-link v-if="index === 0" type="danger" class="button"
              >商品主图</el-link
            >
            <el-link
              v-else
              type="info"
              class="button"
              @click="changeMainPicture(index)"
              >设为主图</el-link
            >
          </div>

          <div v-else>
            <!-- 占位 -->
            <el-link type="info" />
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="商品详情">
        <editor v-model="goodsInfo.desc" style="height: 600px" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .component-container__main {
    margin: 20px auto;

    .button {
      margin-left: 10px;
    }
  }
</style>
