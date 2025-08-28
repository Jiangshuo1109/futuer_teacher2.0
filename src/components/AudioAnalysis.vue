<template>
  <div class="audio-analysis">
    <!-- 数据分布图表区域 -->
    <div class="charts-section">
      <!-- 第一行：两个图表卡片 -->
      <div class="chart-row-two">
        <!-- 普通话水平分布饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>普通话水平分布</h3>
            <p>各等级人数占比</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="mandarinPieOption"
                :init-options="{ renderer: 'canvas' }"
                autoresize
              />
            </div>
            <div v-else class="chart-loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>数据加载中...</p>
            </div>
          </div>
        </div>

        <!-- 语速区间分布条形图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>语速区间分布</h3>
            <p>不同语速区间的人数分布</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="speedDistributionOption"
                :init-options="{ renderer: 'canvas' }"
                autoresize
              />
            </div>
            <div v-else class="chart-loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>数据加载中...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行：三个卡片 -->
      <div class="chart-row-three">
        <!-- 高频关键词展示 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>高频关键词</h3>
            <p>点击查看使用该词的学生信息</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="keyword-grid">
              <div
                v-for="(keyword, index) in audioData.keywordStats.topKeywords"
                :key="index"
                class="keyword-item"
                :style="{ fontSize: getKeywordSize(keyword.frequency) + 'px' }"
                @click="handleKeywordClick(keyword)"
              >
                <span class="keyword-text">{{ keyword.word }}</span>
                <span class="keyword-count">({{ keyword.frequency }})</span>
              </div>
            </div>
            <div v-else class="chart-loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>数据加载中...</p>
            </div>
          </div>
        </div>

        <!-- 口头禅展示 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>口头禅统计</h3>
            <p>点击查看使用该词的学生信息</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="filler-grid">
              <div
                v-for="(filler, index) in audioData.fillerStats.commonFillers"
                :key="index"
                class="filler-item"
                :style="{ fontSize: getFillerSize(filler.frequency) + 'px' }"
                @click="handleFillerClick(filler)"
              >
                <span class="filler-text">{{ filler.filler }}</span>
                <span class="filler-count">({{ filler.frequency }})</span>
              </div>
            </div>
            <div v-else class="chart-loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>数据加载中...</p>
            </div>
          </div>
        </div>

        <!-- 提问类型分析 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>提问类型分析</h3>
            <p>不同类型问题的使用情况</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="questionTypeOption"
                :init-options="{ renderer: 'canvas' }"
                autoresize
              />
            </div>
            <div v-else class="chart-loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>数据加载中...</p>
            </div>
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
            <h3>AI音频分析报告</h3>
          </div>
          <p>基于音频数据的整体分析报告</p>
        </div>
        <div class="ai-report-content">
          <div class="report-summary">
            <h4>语音表现总览</h4>
            <p>
              本次任务中，师范生在语音表达方面整体表现良好。普通话水平优秀率达到{{
                Math.round(
                  (audioData.mandarinStats.excellent /
                    (audioData.mandarinStats.excellent +
                      audioData.mandarinStats.good +
                      audioData.mandarinStats.average +
                      audioData.mandarinStats.poor)) *
                    100,
                )
              }}%， 平均语速{{
                audioData.speedStats.averageSpeed
              }}字/分钟，处于合理范围内。 平均音量{{
                audioData.volumeStats.averageVolume
              }}dB，音量控制适当。
            </p>
          </div>

          <div class="report-details">
            <h4>详细分析</h4>
            <div class="analysis-items">
              <div class="analysis-item">
                <h5>语音质量</h5>
                <p>
                  {{
                    audioData.mandarinStats.excellent
                  }}位师范生普通话达到优秀水平，发音标准，语调自然。建议对普通话水平一般和较差的{{
                    audioData.mandarinStats.average +
                    audioData.mandarinStats.poor
                  }}位师范生进行针对性训练。
                </p>
              </div>

              <div class="analysis-item">
                <h5>语速控制</h5>
                <p>
                  平均语速{{
                    audioData.speedStats.averageSpeed
                  }}字/分钟，符合教学语速标准。语速分布较为均匀，大部分师范生能够合理控制讲课节奏。
                </p>
              </div>

              <div class="analysis-item">
                <h5>教学用词</h5>
                <p>
                  关键词使用丰富，平均每人使用{{
                    audioData.keywordStats.averagePerStudent
                  }}个教学关键词。但口头禅使用较多，平均每人{{
                    audioData.fillerStats.averagePerStudent
                  }}次，需要注意减少"嗯"、"然后"等口头禅。
                </p>
              </div>

              <div class="analysis-item">
                <h5>课堂互动</h5>
                <p>
                  提问互动积极，平均每人提问{{
                    audioData.questionStats.averagePerStudent
                  }}个问题。开放性问题使用较多，有利于启发学生思考。
                </p>
              </div>
            </div>
          </div>

          <div class="report-suggestions">
            <h4>改进建议</h4>
            <ul class="suggestion-list">
              <li>加强普通话训练，特别是语音标准度相对较弱的师范生。</li>
              <li>继续保持良好的语速控制，注意根据教学内容调节讲话节奏。</li>
              <li>减少口头禅使用，增强语言表达的流畅性和专业性。</li>
              <li>增加互动式提问，特别是判断性和选择性问题的使用。</li>
              <li>丰富教学语言，适当增加教学关键词的使用频率。</li>
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
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { ChatDotRound, Loading } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 注册ECharts组件
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// Props
interface TaskAudioData {
  mandarinStats: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  speedStats: {
    averageSpeed: number;
    minSpeed: number;
    maxSpeed: number;
    distribution: { range: string; count: number }[];
  };
  volumeStats: {
    averageVolume: number;
    distribution: { range: string; count: number }[];
  };
  keywordStats: {
    totalKeywords: number;
    averagePerStudent: number;
    topKeywords: { word: string; frequency: number; students: string[] }[];
  };
  fillerStats: {
    totalFillers: number;
    averagePerStudent: number;
    commonFillers: { filler: string; frequency: number; students: string[] }[];
  };
  questionStats: {
    totalQuestions: number;
    averagePerStudent: number;
    questionTypes: { type: string; count: number }[];
  };
  timeDistribution: {
    studentName: string;
    duration: number;
    rank: number;
  }[];
}

const props = defineProps<{
  taskId: string;
  audioData: TaskAudioData;
  loading: boolean;
}>();

// 普通话水平分布饼图
const mandarinPieOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}人 ({d}%)",
  },
  legend: {
    bottom: "0%",
    left: "center",
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: props.audioData.mandarinStats.excellent,
          name: "优秀",
          itemStyle: { color: "#67c23a" },
        },
        {
          value: props.audioData.mandarinStats.good,
          name: "良好",
          itemStyle: { color: "#409eff" },
        },
        {
          value: props.audioData.mandarinStats.average,
          name: "一般",
          itemStyle: { color: "#e6a23c" },
        },
        {
          value: props.audioData.mandarinStats.poor,
          name: "较差",
          itemStyle: { color: "#f56c6c" },
        },
      ],
    },
  ],
}));

// 语速分布柱状图
const speedDistributionOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.audioData.speedStats.distribution.map((item) => item.range),
    axisLabel: {
      fontSize: 12,
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}人",
    },
  },
  series: [
    {
      type: "bar",
      data: props.audioData.speedStats.distribution.map((item) => item.count),
      itemStyle: {
        color: "#409eff",
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        position: "top",
        formatter: "{c}人",
      },
    },
  ],
}));

// 提问类型分析图
const questionTypeOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}个 ({d}%)",
  },
  legend: {
    bottom: "0%",
    left: "center",
  },
  series: [
    {
      type: "pie",
      radius: "60%",
      data: props.audioData.questionStats.questionTypes.map((item) => ({
        value: item.count,
        name: item.type,
      })),
      itemStyle: {
        borderRadius: 8,
        borderColor: "#fff",
        borderWidth: 2,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
}));

// 关键词大小计算
const getKeywordSize = (frequency: number) => {
  const maxFreq = Math.max(
    ...props.audioData.keywordStats.topKeywords.map((k) => k.frequency),
  );
  const minSize = 14;
  const maxSize = 28;
  return minSize + (frequency / maxFreq) * (maxSize - minSize);
};

// 口头禅大小计算
const getFillerSize = (frequency: number) => {
  const maxFreq = Math.max(
    ...props.audioData.fillerStats.commonFillers.map((f) => f.frequency),
  );
  const minSize = 14;
  const maxSize = 28;
  return minSize + (frequency / maxFreq) * (maxSize - minSize);
};

// 点击事件处理函数
const handleKeywordClick = (keyword: {
  word: string;
  frequency: number;
  students: string[];
}) => {
  if (keyword.students && keyword.students.length > 0) {
    const studentList = keyword.students.join("、");
    ElMessage({
      message: `关键词"${keyword.word}"使用学生：${studentList}`,
      type: "info",
      duration: 5000,
      showClose: true,
    });
  }
};

const handleFillerClick = (filler: {
  filler: string;
  frequency: number;
  students: string[];
}) => {
  if (filler.students && filler.students.length > 0) {
    const studentList = filler.students.join("、");
    ElMessage({
      message: `口头禅"${filler.filler}"使用学生：${studentList}`,
      type: "warning",
      duration: 5000,
      showClose: true,
    });
  }
};
</script>

<style scoped>
.audio-analysis {
  height: 100%;
  overflow-y: auto;
  padding: 0;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 32px;
}

/* 第一行：两个图表卡片 */
.chart-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* 第二行：三个卡片 */
.chart-row-three {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 400px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 为三列布局中的卡片优化高度 */
.chart-row-three .chart-card {
  height: 380px;
}

.chart-header {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.chart-header p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.chart-container {
  flex: 1;
  position: relative;
  min-height: 0;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.loading-icon {
  font-size: 32px;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 关键词网格 */
.keyword-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  align-content: flex-start;
}

.keyword-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.keyword-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
}

.keyword-text {
  font-weight: bold;
}

.keyword-count {
  font-size: 0.8em;
  opacity: 0.9;
}

/* 口头禅网格 */
.filler-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  align-content: flex-start;
}

.filler-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f56c6c, #e6a23c);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}

.filler-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(245, 108, 108, 0.4);
}

.filler-text {
  font-weight: bold;
}

.filler-count {
  font-size: 0.8em;
  opacity: 0.9;
}

/* AI报告区域 */
.ai-report-section {
  margin-bottom: 32px;
}

.ai-report-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
  border: none;
  margin-top: 32px;
  height: auto;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.ai-report-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
}

.report-summary,
.report-details,
.report-suggestions {
  margin-bottom: 24px;
}

.report-summary h4,
.report-details h4,
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

.analysis-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.analysis-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #409eff;
}

.analysis-item h5 {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.analysis-item p {
  font-size: 13px;
  line-height: 1.5;
  color: #606266;
  margin: 0;
}

.suggestion-list {
  margin: 0;
  padding-left: 20px;
}

.suggestion-list li {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-row-three {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .chart-row-two,
  .chart-row-three {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .chart-card {
    height: 350px;
  }

  .analysis-items {
    grid-template-columns: 1fr;
  }

  .keyword-grid,
  .filler-grid {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .chart-card {
    height: 300px;
    padding: 16px;
  }

  .chart-header h3 {
    font-size: 14px;
  }

  .chart-header p {
    font-size: 12px;
  }
}
</style>
