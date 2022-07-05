<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" title="每类新闻的用户行为总览">
      <div class="flex">
        <Chart
          v-for="(v, i) in renderData"
          :key="i"
          style="width: 100%; height: 300px"
          :option="generateChartOption(v)"
        />
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { getUserAllNewsTypeProportion } from '@/api/statistics';
  import { ref } from 'vue';
  import { EChartsOption } from 'echarts';

  const seriesData = ref<any[]>([]);
  const { loading } = useLoading(false);
  function generateSeries(data: {
    newsType: string;
    browseCount: number;
    favorCount: number;
    collectCount: number;
  }) {
    const chartData = [
      {
        name: '浏览',
        value: data.browseCount,
        itemStyle: {
          color: '#22d3ee',
        },
      },
      {
        name: '喜欢',
        value: data.favorCount,
        itemStyle: {
          color: '#f87171',
        },
      },
      {
        name: '收藏',
        value: data.collectCount,
        itemStyle: {
          color: '#65a30d',
        },
      },
    ];
    const res = {
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      label: {
        formatter: '{d}% ',
        color: '#4E5969',
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
      },
      data: chartData,
    };
    return res;
  }

  interface optionsFn {
    (isDark: boolean): EChartsOption;
  }

  function generateChartOption(el: {
    newsType: string;
    browseCount: number;
    favorCount: number;
    collectCount: number;
  }) {
    const series = generateSeries(el);
    const { chartOption } = useChartOption(((isDark) => {
      const graphicElementStyle = {
        textAlign: 'center',
        fill: isDark ? 'rgba(255,255,255,0.7)' : '#4E5969',
        fontSize: 14,
        lineWidth: 10,
        fontWeight: 'bold',
      };
      return {
        legend: {
          left: 'center',
          // data: ['UGC原创', '国外网站', '转载文章', '行业报告', '其他'],
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          textStyle: {
            color: isDark ? 'rgba(255,255,255,0.7)' : '#4E5969',
          },
          itemStyle: {
            borderWidth: 0,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                text: el.newsType,
                ...graphicElementStyle,
              },
            },
          ],
        },
        series,
      };
    }) as optionsFn);
    return chartOption.value;
  }
  const renderData = ref();
  const fetchData = async () => {
    const { data } = await getUserAllNewsTypeProportion({ n: 7 });
    renderData.value = data;
    data.forEach((el) => {
      seriesData.value.push(generateSeries(el));
    });
    console.log(seriesData.value);
  };
  fetchData();
</script>

<style scoped lang="less"></style>
