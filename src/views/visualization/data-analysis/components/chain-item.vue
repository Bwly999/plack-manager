<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card :bordered="false" :style="cardStyle">
      <div class="content-wrap">
        <div class="content">
          <a-statistic
            :title="title"
            :value="renderData.count"
            :value-from="0"
            animation
            show-group-separator
          />
          <div class="desc">
            <a-typography-text type="secondary" class="label">
              {{ $t('dataAnalysis.card.yesterday') }}
            </a-typography-text>
            <a-typography-text
              :type="renderData.growth >= 0 ? 'success' : 'danger'"
            >
              {{ renderData.growth }}

              <icon-arrow-rise
                v-if="renderData.growth >= 0"
                class="text-green"
              />
              <icon-arrow-down v-else />
            </a-typography-text>
          </div>
        </div>
        <div class="chart">
          <Chart v-if="!loading" :option="chartOption" />
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, PropType, CSSProperties } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    queryPublicOpinionAnalysis,
    PublicOpinionAnalysis,
    PublicOpinionAnalysisRes,
  } from '@/api/visualization';
  import useChartOption from '@/hooks/chart-option';
  import { getUserSummary, UserSummaryParam } from '@/api/statistics';

  const barChartOptionsFactory = () => {
    const xData = ref<any[]>([]);
    const data = ref<any>([]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: xData,
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        series: {
          name: 'total',
          data,
          type: 'bar',
          barWidth: 7,
          itemStyle: {
            borderRadius: 2,
          },
        },
      };
    });
    return {
      xData,
      data,
      chartOption,
    };
  };

  const lineChartOptionsFactory = () => {
    const data = ref<number[][]>([[]]);
    const xData = ref<any[]>([]);
    const { chartOption } = useChartOption(() => {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: xData,
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        series: [
          {
            data: data.value[0],
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
              color: '#165DFF',
              width: 3,
            },
          },
        ],
      };
    });
    return {
      xData,
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
          right: 0,
          top: 0,
          bottom: 0,
        },
        legend: {
          show: true,
          top: 'center',
          right: '0',
          orient: 'vertical',
          icon: 'circle',
          itemWidth: 6,
          itemHeight: 6,
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

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    quota: {
      type: String,
      default: '',
    },
    chartType: {
      type: String,
      default: '',
    },
    cardStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => {
        return {};
      },
    },
  });

  const { loading, setLoading } = useLoading(true);
  const {
    chartOption: lineChartOption,
    data: lineData,
    xData: lineXData,
  } = lineChartOptionsFactory();
  const {
    chartOption: barChartOption,
    data: barData,
    xData: barXData,
  } = barChartOptionsFactory();
  const {
    chartOption: pieChartOption,
    data: pieData,
    // xData: pieXData,
  } = pieChartOptionsFactory();
  const renderData = ref<any>({
    count: 0,
    growth: 0,
    chartData: [],
  });
  const chartOption = ref({});
  const fetchData1 = async (params: PublicOpinionAnalysis) => {
    try {
      const { data } = await queryPublicOpinionAnalysis(params);
      renderData.value = data;
      const { chartData } = data;
      if (props.chartType === 'bar') {
        chartData.forEach((el, idx) => {
          barData.value.push({
            value: el.y,
            itemStyle: {
              color: idx % 2 ? '#2CAB40' : '#86DF6C',
            },
          });
        });
        chartOption.value = barChartOption.value;
      } else if (props.chartType === 'line') {
        chartData.forEach((el) => {
          if (el.name === '2021') {
            lineData.value[0].push(el.y);
          } else {
            lineData.value[1].push(el.y);
          }
        });
        chartOption.value = lineChartOption.value;
      } else {
        chartData.forEach((el) => {
          pieData.value.push(el);
        });
        chartOption.value = pieChartOption.value;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (params: UserSummaryParam) => {
    try {
      const { data } = await getUserSummary(params);
      const count = data
        .map((x) => x.count)
        .reduce((prev, cur) => prev + cur, 0);
      let growth = 0;
      if (data.length >= 2) {
        growth = data[data.length - 1].count - data[data.length - 2].count;
      } else if (data.length === 1) {
        growth = data[0].count;
      }
      renderData.value = {
        count,
        growth,
      };
      if (props.chartType === 'bar') {
        data.forEach((el, idx) => {
          barXData.value.push(el.date);
          barData.value.push({
            value: el.count,
            itemStyle: {
              color: idx % 2 ? '#2CAB40' : '#86DF6C',
            },
          });
        });
        chartOption.value = barChartOption.value;
      } else if (props.chartType === 'line') {
        data.forEach((el, idx) => {
          // if (lineData.value)
          lineXData.value.push(el.date);
          // lineData.value[idx].push(el.count);
          lineData.value[0].push(el.count);
        });
        chartOption.value = lineChartOption.value;
      } else {
        // chartData.forEach((el) => {
        //   pieData.value.push(el);
        // });
        // chartOption.value = pieChartOption.value;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData({ n: 7, type: props.quota });
</script>

<style scoped lang="less">
  :deep(.arco-card) {
    border-radius: 4px;
  }
  :deep(.arco-card-body) {
    width: 100%;
    height: 134px;
    padding: 0;
  }
  .content-wrap {
    width: 100%;
    padding: 16px;
    white-space: nowrap;
  }
  :deep(.content) {
    float: left;
    width: 108px;
    height: 102px;
  }
  :deep(.arco-statistic) {
    .arco-statistic-title {
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
    }
    .arco-statistic-content {
      margin-top: 10px;
    }
  }

  .chart {
    float: right;
    width: calc(100% - 108px);
    height: 90px;
    vertical-align: bottom;
  }

  .label {
    padding-right: 8px;
    font-size: 12px;
  }
</style>
