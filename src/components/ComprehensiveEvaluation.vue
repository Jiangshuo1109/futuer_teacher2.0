<template>
  <div class="comprehensive-evaluation">
    <!-- 核心指标卡片 -->
    <div class="metrics-cards">
      <div class="metric-card">
        <div class="metric-icon">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ evaluationData.averageScore }}</div>
          <div class="metric-label">平均得分</div>
          <div class="metric-unit">分</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon progress-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ evaluationData.completionRate }}%</div>
          <div class="metric-label">任务完成进度</div>
          <div class="metric-unit">已完成</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon excellent-icon">
          <el-icon><Medal /></el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ evaluationData.excellentRate }}%</div>
          <div class="metric-label">优秀率</div>
          <div class="metric-unit">≥90分</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon pass-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ evaluationData.passRate }}%</div>
          <div class="metric-label">及格率</div>
          <div class="metric-unit">≥60分</div>
        </div>
      </div>
    </div>

    <!-- 综合评价概览和成绩排行 -->
    <div class="overview-section">
      <div class="radar-section">
        <div class="section-card">
          <div class="card-header">
            <h3>综合评价概览</h3>
            <p>六个维度的综合评价对比</p>
          </div>
          <div class="radar-container">
            <v-chart :option="radarOption" class="radar-chart" />
          </div>
        </div>
      </div>

      <div class="ranking-section">
        <div class="section-card">
          <div class="card-header">
            <h3>师范生成绩排行</h3>
            <p>前十名师范生成绩展示</p>
          </div>
          <div class="ranking-chart">
            <v-chart :option="rankingOption" class="ranking-chart-container" />
          </div>
        </div>
      </div>
    </div>

    <!-- 成绩分布图 -->
    <div class="distribution-section">
      <div class="section-card">
        <div class="card-header">
          <h3>成绩分布图</h3>
          <p>任务中所有师范生成绩的分布情况</p>
        </div>
        <div class="distribution-chart">
          <v-chart
            :option="distributionOption"
            class="distribution-chart-container"
          />
        </div>
        <div class="distribution-stats">
          <div class="stat-item">
            <span class="stat-label">最高分:</span>
            <span class="stat-value">96.5</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最低分:</span>
            <span class="stat-value">58.2</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">标准差:</span>
            <span class="stat-value">12.8</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">中位数:</span>
            <span class="stat-value">84.5</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 师范生课堂用时分布图 -->
    <div class="time-distribution-section">
      <div class="section-card">
        <div class="card-header">
          <h3>师范生课堂用时分布图</h3>
          <p>每个学生的用时情况排行</p>
        </div>
        <div class="time-distribution-chart">
          <v-chart
            :option="timeDistributionOption"
            class="time-chart-container"
          />
        </div>
        <div class="time-stats">
          <div class="stat-item">
            <span class="stat-label">平均用时:</span>
            <span class="stat-value">{{ averageTime }}分钟</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最长用时:</span>
            <span class="stat-value">{{ maxTime }}分钟</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最短用时:</span>
            <span class="stat-value">{{ minTime }}分钟</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">标准差:</span>
            <span class="stat-value">{{ timeStandardDeviation }}分钟</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI智能分析报告 -->
    <div class="ai-report-section">
      <div class="section-card ai-report-card">
        <div class="card-header">
          <div class="ai-header">
            <el-icon class="ai-icon"><ChatDotRound /></el-icon>
            <h3>AI智能分析报告</h3>
          </div>
          <p>基于任务整体数据的AI分析报告和改进建议</p>
        </div>
        <div class="ai-report-content">
          <div class="report-summary">
            <h4>总体评价</h4>
            <p>
              本次任务整体表现良好，师范生的综合教学能力得到了较好的体现。平均得分{{
                evaluationData.averageScore
              }}分， 优秀率达到{{ evaluationData.excellentRate }}%，及格率{{
                evaluationData.passRate
              }}%， 完成率{{ evaluationData.completionRate }}%。
            </p>
          </div>

          <div class="report-dimensions">
            <h4>维度分析</h4>
            <ul class="dimension-points">
              <li>
                <strong>教学设计:</strong>
                表现优秀，平均分88.5分，师范生在教学目标设定和教学活动设计方面能力较强。
              </li>
              <li>
                <strong>教学实施:</strong>
                需要提升，平均分84.2分，在课堂组织和教学节奏控制方面有改进空间。
              </li>
              <li>
                <strong>教学评价:</strong>
                表现良好，平均分86.8分，师范生能够较好地运用多元化评价方式。
              </li>
              <li>
                <strong>教学反思:</strong>
                相对薄弱，平均分82.1分，建议加强对教学过程的深度反思训练。
              </li>
              <li>
                <strong>师生互动:</strong>
                表现突出，平均分87.3分，师范生的互动技巧和沟通能力较强。
              </li>
              <li>
                <strong>教学语言:</strong>
                表现稳定，平均分86.1分，语言表达清晰，逻辑性较强。
              </li>
            </ul>
          </div>

          <div class="report-suggestions">
            <h4>改进建议</h4>
            <ul class="suggestion-list">
              <li>针对教学实施环节，建议增加课堂管理和时间控制的专项训练。</li>
              <li>
                加强教学反思能力培养，鼓励师范生进行深度的教学反思和总结。
              </li>
              <li>继续发挥师生互动方面的优势，进一步提升课堂氛围营造能力。</li>
              <li>建议组织优秀师范生分享经验，促进整体水平提升。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart, BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {
  TrendCharts,
  Clock,
  Medal,
  CircleCheck,
  ChatDotRound,
  Setting,
  VideoPlay,
  Document,
  User,
  Star,
  DataLine,
} from "@element-plus/icons-vue";

use([
  CanvasRenderer,
  RadarChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
]);

// Props
interface TaskEvaluationData {
  averageScore: number;
  completionRate: number;
  excellentRate: number;
  passRate: number;
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  dimensionScores: {
    name: string;
    averageScore: number;
    historicalAverage: number;
  }[];
  topStudents: {
    studentId: string;
    studentName: string;
    score: number;
    avatar?: string;
  }[];
}

const props = defineProps<{
  taskId: string;
  evaluationData: TaskEvaluationData;
  loading: boolean;
}>();

// 维度分析数据
const dimensionAnalysis = [
  {
    name: "教学设计",
    icon: "Setting",
    level: "excellent",
    analysis:
      "师范生在教学设计方面表现优秀，能够合理设定教学目标，科学安排教学环节，教学活动设计富有创新性和针对性。",
  },
  {
    name: "教学实施",
    icon: "VideoPlay",
    level: "good",
    analysis:
      "教学实施环节整体良好，但在课堂节奏控制和突发情况处理方面还需要进一步提升，建议加强实践训练。",
  },
  {
    name: "教学评价",
    icon: "Document",
    level: "excellent",
    analysis:
      "师范生能够运用多元化评价方式，注重过程性评价与结果性评价相结合，评价标准明确，反馈及时有效。",
  },
  {
    name: "教学反思",
    icon: "User",
    level: "average",
    analysis:
      "教学反思能力有待加强，部分师范生的反思停留在表面，缺乏深度分析，建议提供更多反思工具和方法指导。",
  },
  {
    name: "师生互动",
    icon: "Star",
    level: "excellent",
    analysis:
      "师生互动表现突出，师范生能够营造良好的课堂氛围，提问技巧娴熟，能够有效激发学生参与热情。",
  },
  {
    name: "教学语言",
    icon: "DataLine",
    level: "good",
    analysis:
      "教学语言表达清晰流畅，逻辑性强，语速适中，但在语言的感染力和启发性方面还有提升空间。",
  },
];

// 雷达图配置
const radarOption = computed(() => ({
  radar: {
    indicator: props.evaluationData.dimensionScores.map((item) => ({
      name: item.name,
      max: 100,
    })),
    shape: "polygon",
    splitNumber: 5,
    axisName: {
      color: "#606266",
      fontSize: 12,
    },
    splitLine: {
      lineStyle: {
        color: "#e4e7ed",
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["#f9f9f9", "#ffffff"],
      },
    },
  },
  series: [
    {
      type: "radar",
      data: [
        {
          value: props.evaluationData.dimensionScores.map(
            (item) => item.averageScore,
          ),
          name: "当前任务",
          areaStyle: {
            color: "rgba(64, 158, 255, 0.2)",
          },
          lineStyle: {
            color: "#409eff",
          },
          itemStyle: {
            color: "#409eff",
          },
        },
        {
          value: props.evaluationData.dimensionScores.map(
            (item) => item.historicalAverage,
          ),
          name: "历史平均",
          areaStyle: {
            color: "rgba(103, 194, 58, 0.2)",
          },
          lineStyle: {
            color: "#67c23a",
          },
          itemStyle: {
            color: "#67c23a",
          },
        },
      ],
    },
  ],
  legend: {
    data: ["当前任务", "历史平均"],
    bottom: 255,
    left: "right",
    orient: "horizontal",
    itemWidth: 25,
    itemHeight: 14,
    itemGap: 20,
    width: "100%",
    padding: [5, 0],
    textStyle: {
      fontSize: 12,
      color: "#666",
    },
    show: true,
    selectedMode: false,
  },
  tooltip: {
    trigger: "item",
  },
}));

// 排行榜图表配置
const rankingOption = computed(() => ({
  grid: {
    left: "15%",
    right: "10%",
    top: "10%",
    bottom: "10%",
  },
  xAxis: {
    type: "value",
    max: 100,
    axisLabel: {
      formatter: "{value}分",
    },
  },
  yAxis: {
    type: "category",
    data: props.evaluationData.topStudents
      .map((student) => student.studentName)
      .reverse(),
    axisLabel: {
      fontSize: 12,
    },
  },
  series: [
    {
      type: "bar",
      data: props.evaluationData.topStudents
        .map((student) => student.score)
        .reverse(),
      itemStyle: {
        color: (params: any) => {
          const colors = [
            "#f56c6c",
            "#e6a23c",
            "#409eff",
            "#67c23a",
            "#909399",
          ];
          return colors[Math.floor(params.dataIndex / 2)] || "#909399";
        },
        borderRadius: [0, 4, 4, 0],
      },
      label: {
        show: true,
        position: "right",
        formatter: "{c}分",
        fontSize: 12,
      },
    },
  ],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter: (params: any) => {
      return `${params[0].name}: ${params[0].value}分`;
    },
  },
}));

// 分布图配置
const distributionOption = computed(() => ({
  grid: {
    left: "10%",
    right: "10%",
    top: "15%",
    bottom: "15%",
  },
  xAxis: {
    type: "category",
    data: props.evaluationData.scoreDistribution.map((item) => item.range),
    axisLabel: {
      fontSize: 12,
    },
  },
  yAxis: [
    {
      type: "value",
      name: "人数",
      axisLabel: {
        formatter: "{value}人",
      },
    },
    {
      type: "value",
      name: "百分比",
      axisLabel: {
        formatter: "{value}%",
      },
    },
  ],
  series: [
    {
      name: "人数",
      type: "bar",
      data: props.evaluationData.scoreDistribution.map((item) => item.count),
      itemStyle: {
        color: "#409eff",
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: "百分比",
      type: "line",
      yAxisIndex: 1,
      data: props.evaluationData.scoreDistribution.map(
        (item) => item.percentage,
      ),
      lineStyle: {
        color: "#67c23a",
        width: 3,
      },
      itemStyle: {
        color: "#67c23a",
      },
    },
  ],
  legend: {
    data: ["人数", "百分比"],
    top: "5%",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
}));

// 课堂用时分布数据
const timeDistributionData = [
  { studentName: "李明轩", duration: 45.2, rank: 1 },
  { studentName: "张雨涵", duration: 42.8, rank: 2 },
  { studentName: "陈思琪", duration: 41.5, rank: 3 },
  { studentName: "刘浩然", duration: 39.7, rank: 4 },
  { studentName: "王欣怡", duration: 38.9, rank: 5 },
  { studentName: "赵子涵", duration: 37.2, rank: 6 },
  { studentName: "孙佳琪", duration: 36.8, rank: 7 },
  { studentName: "周思远", duration: 35.1, rank: 8 },
  { studentName: "吴雨桐", duration: 34.6, rank: 9 },
  { studentName: "郑浩宇", duration: 33.9, rank: 10 },
  { studentName: "马晓雯", duration: 32.5, rank: 11 },
  { studentName: "林志强", duration: 31.8, rank: 12 },
  { studentName: "黄美丽", duration: 30.9, rank: 13 },
  { studentName: "徐建国", duration: 29.7, rank: 14 },
  { studentName: "朱小红", duration: 28.3, rank: 15 },
];

// 课堂用时统计
const averageTime = computed(() => {
  const total = timeDistributionData.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  return (total / timeDistributionData.length).toFixed(1);
});

const maxTime = computed(() => {
  return Math.max(...timeDistributionData.map((item) => item.duration)).toFixed(
    1,
  );
});

const minTime = computed(() => {
  return Math.min(...timeDistributionData.map((item) => item.duration)).toFixed(
    1,
  );
});

const timeStandardDeviation = computed(() => {
  const avg = parseFloat(averageTime.value);
  const variance =
    timeDistributionData.reduce((sum, item) => {
      return sum + Math.pow(item.duration - avg, 2);
    }, 0) / timeDistributionData.length;
  return Math.sqrt(variance).toFixed(1);
});

// 课堂用时分布图配置
const timeDistributionOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter: (params: any) => {
      return `${params[0].name}: ${params[0].value}分钟`;
    },
  },
  grid: {
    left: "15%",
    right: "10%",
    top: "10%",
    bottom: "15%",
  },
  xAxis: {
    type: "category",
    data: timeDistributionData.map((item) => item.studentName),
    axisLabel: {
      fontSize: 11,
      rotate: 45,
      interval: 0,
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}分钟",
    },
    name: "用时(分钟)",
    nameTextStyle: {
      fontSize: 12,
      color: "#666",
    },
  },
  series: [
    {
      type: "bar",
      data: timeDistributionData.map((item) => item.duration),
      itemStyle: {
        color: (params: any) => {
          // 根据排名设置颜色
          if (params.dataIndex < 3) return "#67c23a"; // 前三名绿色
          if (params.dataIndex < 8) return "#409eff"; // 4-8名蓝色
          if (params.dataIndex < 12) return "#e6a23c"; // 9-12名橙色
          return "#f56c6c"; // 其他红色
        },
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        position: "top",
        formatter: "{c}分钟",
        fontSize: 10,
      },
      markLine: {
        data: [
          {
            type: "average",
            name: "平均值",
            lineStyle: {
              color: "#909399",
              type: "dashed",
            },
            label: {
              formatter: "平均: {c}分钟",
            },
          },
        ],
      },
    },
  ],
}));

// 工具方法
const getLevelText = (level: string) => {
  const levelMap: Record<string, string> = {
    excellent: "优秀",
    good: "良好",
    average: "一般",
    poor: "较差",
  };
  return levelMap[level] || level;
};
</script>

<style scoped>
.comprehensive-evaluation {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

/* 核心指标卡片 */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.metric-icon.progress-icon {
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
}

.metric-icon.excellent-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.metric-icon.pass-icon {
  background: linear-gradient(135deg, #909399, #b3b6bc);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 16px;
  color: #606266;
  margin-bottom: 4px;
}

.metric-unit {
  font-size: 12px;
  color: #909399;
}

/* 概览和排行区域 */
.overview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  min-height: 420px;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 500px;
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.radar-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 320px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-chart {
  width: 100%;
  height: 300px;
}

.dimension-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.dimension-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 12px;
}

.dimension-name {
  color: #303133;
  font-weight: 500;
}

.dimension-scores {
  display: flex;
  gap: 8px;
}

.current-score {
  color: #409eff;
  font-weight: 600;
}

.historical-score {
  color: #909399;
}

.ranking-chart,
.distribution-chart {
  flex: 1;
}

.ranking-chart-container,
.distribution-chart-container {
  width: 100%;
  height: 100%;
}

/* 成绩分布区域 */
.distribution-section {
  margin-bottom: 32px;
}

.distribution-section .section-card {
  height: 450px;
}

.distribution-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 课堂用时分布区域 */
.time-distribution-section {
  margin-top: 48px;
  margin-bottom: 32px;
}

.time-distribution-section .section-card {
  height: auto;
  min-height: 450px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.time-distribution-chart {
  flex: 1;
  margin-bottom: 20px;
  height: 350px;
  overflow: hidden;
}

.time-chart-container {
  width: 100%;
  height: 350px;
}

.time-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}

.time-stats .stat-item {
  text-align: center;
}

.time-stats .stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.time-stats .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* AI报告区域 */
.ai-report-section {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.ai-report-card {
  height: auto;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
  border: none;
  position: relative;
  isolation: isolate;
  margin-top: 32px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  font-size: 24px;
  color: #409eff;
}

.ai-report-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
}

.report-summary,
.report-dimensions,
.report-suggestions {
  margin-bottom: 24px;
}

.report-summary h4,
.report-dimensions h4,
.report-suggestions h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.report-summary p {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin: 0;
}

.dimension-points,
.suggestion-list {
  margin: 0;
  padding-left: 20px;
}

.dimension-points li,
.suggestion-list li {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 8px;
}

.dimension-points strong {
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .overview-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 16px;
  }

  .dimension-list {
    grid-template-columns: 1fr;
  }

  .distribution-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
