<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" title="近日用户行为统计">
      <Chart height="122px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { getUserVisitNum } from '@/api/statistics';
  import useChartOption from '@/hooks/chart-option';
  import useLoading from '@/hooks/loading';
  import { ref } from 'vue';

  const props = defineProps({
    chartType: {
      type: String,
      default: '',
    },
  });
  const barChartOptionsFactory = () => {
    const data = ref<any[]>([]);
    const labelData = ref<any[]>([]);
    const { chartOption } = useChartOption((isDark) => {
      return {
        grid: {
          left: 44,
          right: 20,
          top: 0,
          bottom: 20,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            // formatter(value: number, idx: number) {
            //   if (idx === 0) return String(value);
            //   return `${Number(value) / 1000}k`;
            // },
          },
          splitLine: {
            lineStyle: {
              color: isDark ? '#484849' : '#E5E8EF',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: labelData.value,
          axisLabel: {
            show: true,
            color: '#4E5969',
          },
          axisTick: {
            show: true,
            length: 2,
            lineStyle: {
              color: '#A9AEB8',
            },
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: isDark ? '#484849' : '#A9AEB8',
            },
          },
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        series: [
          {
            data: data.value,
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              color: '#4086FF',
              borderRadius: 4,
            },
          },
        ],
      };
    });
    return {
      labelData,
      data,
      chartOption,
    };
  };

  const pieChartOptionsFactory = () => {
    const data = ref<any>([]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          // right: 0,
          top: 0,
          // bottom: 0,
        },
        legend: {
          show: true,
          top: 'auto',
          right: '0',
          orient: 'vertical',
          icon: 'circle',
          itemWidth: 3,
          itemHeight: 3,
          textStyle: {
            color: '#4E5969',
          },
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            name: '总计',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              show: false,
            },
            data,
          },
        ],
      };
    });
    return {
      data,
      chartOption,
    };
  };

  const { loading, setLoading } = useLoading(true);
  const {
    chartOption: barChartOption,
    data: barData,
    labelData: barLabelData,
  } = barChartOptionsFactory();
  const {
    chartOption: pieChartOption,
    data: pieData,
    // xData: pieXData,
  } = pieChartOptionsFactory();
  const chartOption = ref({});

  const fetchData = async (n: number) => {
    try {
      const { data: apiData } = await getUserVisitNum({ n });
      if (props.chartType === 'bar') {
        apiData.forEach((el) => {
          barLabelData.value.push(el.connectType);
          barData.value.push(el.count);
        });
        chartOption.value = barChartOption.value;
      } else if (props.chartType === 'pie') {
        apiData.forEach((el) => {
          pieData.value.push({
            name: el.connectType,
            value: el.count,
          });
        });
        chartOption.value = pieChartOption.value;
      }
    } catch (err) {
      //
    } finally {
      setLoading(false);
    }
  };
  fetchData(7);
</script>

<style scoped lang="less"></style>
