<template>
    <!-- 雷达图 -->
  <div ref="myDiv" class="radar-echart"/>
</template>

<script>
// import * as echarts from 'echarts'
import * as echarts from 'echarts/core' //引入echarts核心模块
import { RadarChart  } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default {
  created() {}, //钩子函数初始化页面还没渲染完毕
  mounted() {
    // 页面加载完毕事件
    const myChart = echarts.init(this.$refs.myDiv)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '工作绩效雷达图'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '出错率', max: 100 },
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [50, 60, 30, 80, 60],
              name: '张三'
            },
          ]
        }
      ]
    })
  }
}
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>