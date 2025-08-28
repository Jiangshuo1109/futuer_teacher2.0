<template>
  <div class="video-analysis">
    <!-- 视频指标统计卡片区域 -->
    <div class="metrics-section">
      <div class="metrics-cards">
        <!-- 教学姿态统计 -->
        <div class="metric-card posture-card">
          <div class="metric-header">
            <div class="metric-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="metric-title">
              <h4>教学姿态</h4>
              <p>姿态稳定性与表现力</p>
            </div>
          </div>
          <div class="metric-content">
            <div class="posture-stats">
              <div class="stat-group">
                <h5>稳定性</h5>
                <div class="stat-items">
                  <div class="stat-item excellent">
                    <span class="stat-label">优秀</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.stability.excellent }}人</span
                    >
                  </div>
                  <div class="stat-item good">
                    <span class="stat-label">良好</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.stability.good }}人</span
                    >
                  </div>
                  <div class="stat-item average">
                    <span class="stat-label">一般</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.stability.average }}人</span
                    >
                  </div>
                  <div class="stat-item poor">
                    <span class="stat-label">较差</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.stability.poor }}人</span
                    >
                  </div>
                </div>
              </div>
              <div class="stat-group">
                <h5>手势表达</h5>
                <div class="stat-items">
                  <div class="stat-item excellent">
                    <span class="stat-label">优秀</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.gesture.excellent }}人</span
                    >
                  </div>
                  <div class="stat-item good">
                    <span class="stat-label">良好</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.gesture.good }}人</span
                    >
                  </div>
                  <div class="stat-item average">
                    <span class="stat-label">一般</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.gesture.average }}人</span
                    >
                  </div>
                  <div class="stat-item poor">
                    <span class="stat-label">较差</span>
                    <span class="stat-value"
                      >{{ videoData.postureStats.gesture.poor }}人</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 面部表情统计 -->
        <div class="metric-card expression-card">
          <div class="metric-header">
            <div class="metric-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="metric-title">
              <h4>面部表情</h4>
              <p>表情状态分布统计</p>
            </div>
          </div>
          <div class="metric-content">
            <div class="expression-stats">
              <div class="expression-item happy">
                <span class="expression-label">愉悦</span>
                <span class="expression-value"
                  >{{ videoData.expressionStats.happy.toFixed(1) }}%</span
                >
              </div>
              <div class="expression-item confident">
                <span class="expression-label">自信</span>
                <span class="expression-value"
                  >{{ videoData.expressionStats.confident.toFixed(1) }}%</span
                >
              </div>
              <div class="expression-item focused">
                <span class="expression-label">专注</span>
                <span class="expression-value"
                  >{{ videoData.expressionStats.focused.toFixed(1) }}%</span
                >
              </div>
              <div class="expression-item neutral">
                <span class="expression-label">平静</span>
                <span class="expression-value"
                  >{{ videoData.expressionStats.neutral.toFixed(1) }}%</span
                >
              </div>
              <div class="expression-item concerned">
                <span class="expression-label">担忧</span>
                <span class="expression-value"
                  >{{ videoData.expressionStats.concerned.toFixed(1) }}%</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 板书分析统计 -->
        <div class="metric-card blackboard-card">
          <div class="metric-header">
            <div class="metric-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="metric-title">
              <h4>板书分析</h4>
              <p>板书质量与布局评估</p>
            </div>
          </div>
          <div class="metric-content">
            <div class="blackboard-stats">
              <div class="stat-group">
                <h5>清晰度</h5>
                <div class="stat-items">
                  <div class="stat-item excellent">
                    <span class="stat-label">优秀</span>
                    <span class="stat-value"
                      >{{ videoData.blackboardStats.clarity.excellent }}人</span
                    >
                  </div>
                  <div class="stat-item good">
                    <span class="stat-label">良好</span>
                    <span class="stat-value"
                      >{{ videoData.blackboardStats.clarity.good }}人</span
                    >
                  </div>
                  <div class="stat-item average">
                    <span class="stat-label">一般</span>
                    <span class="stat-value"
                      >{{ videoData.blackboardStats.clarity.average }}人</span
                    >
                  </div>
                  <div class="stat-item poor">
                    <span class="stat-label">较差</span>
                    <span class="stat-value"
                      >{{ videoData.blackboardStats.clarity.poor }}人</span
                    >
                  </div>
                </div>
              </div>
              <div class="color-usage">
                <h5>颜色使用</h5>
                <div class="color-stats">
                  <div class="color-item">
                    <span class="color-label">单色</span>
                    <span class="color-value"
                      >{{ videoData.blackboardStats.colorUsage.single }}人</span
                    >
                  </div>
                  <div class="color-item">
                    <span class="color-label">多色</span>
                    <span class="color-value"
                      >{{
                        videoData.blackboardStats.colorUsage.multiple
                      }}人</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 课堂互动统计 -->
        <div class="metric-card interaction-card">
          <div class="metric-header">
            <div class="metric-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="metric-title">
              <h4>课堂互动</h4>
              <p>师生互动质量分析</p>
            </div>
          </div>
          <div class="metric-content">
            <div class="interaction-stats">
              <div class="interaction-item">
                <span class="interaction-label">平均提问</span>
                <span class="interaction-value"
                  >{{
                    videoData.interactionStats.averageQuestions.toFixed(1)
                  }}次</span
                >
              </div>
              <div class="interaction-item">
                <span class="interaction-label">眼神交流</span>
                <span class="interaction-value"
                  >{{
                    videoData.interactionStats.averageEyeContact.toFixed(1)
                  }}%</span
                >
              </div>
              <div class="interaction-item">
                <span class="interaction-label">学生回应</span>
                <span class="interaction-value"
                  >{{
                    videoData.interactionStats.averageResponses.toFixed(1)
                  }}次</span
                >
              </div>
              <div class="interaction-item">
                <span class="interaction-label">参与度</span>
                <span class="interaction-value"
                  >{{
                    videoData.interactionStats.averageParticipation.toFixed(1)
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据分布图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 教学姿态分布饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>教学姿态稳定性分布</h3>
            <p>各等级人数占比</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="postureStabilityOption"
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

        <!-- 面部表情分布饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>面部表情分布</h3>
            <p>各表情状态占比</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="expressionDistributionOption"
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

      <div class="chart-row">
        <!-- 板书质量分布柱状图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>板书质量分布</h3>
            <p>清晰度和布局评估</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="blackboardQualityOption"
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

        <!-- 课堂互动指标雷达图 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>课堂互动指标</h3>
            <p>多维度互动质量评估</p>
          </div>
          <div class="chart-container">
            <div v-if="!loading" class="chart-wrapper">
              <v-chart
                class="chart"
                :option="interactionRadarOption"
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
            <el-icon class="ai-icon"><VideoCamera /></el-icon>
            <h3>AI视频分析报告</h3>
          </div>
          <p>基于视频数据的整体分析报告</p>
        </div>
        <div class="ai-report-content">
          <div class="report-summary">
            <h4>视频表现总览</h4>
            <p>
              本次任务中，师范生在视频表现方面整体良好。教学姿态稳定性优秀率达到{{
                Math.round(
                  (videoData.postureStats.stability.excellent /
                    (videoData.postureStats.stability.excellent +
                      videoData.postureStats.stability.good +
                      videoData.postureStats.stability.average +
                      videoData.postureStats.stability.poor)) *
                    100,
                )
              }}%， 面部表情以愉悦（{{
                videoData.expressionStats.happy.toFixed(1)
              }}%）和自信（{{
                videoData.expressionStats.confident.toFixed(1)
              }}%）为主， 板书清晰度优秀率{{
                Math.round(
                  (videoData.blackboardStats.clarity.excellent /
                    (videoData.blackboardStats.clarity.excellent +
                      videoData.blackboardStats.clarity.good +
                      videoData.blackboardStats.clarity.average +
                      videoData.blackboardStats.clarity.poor)) *
                    100,
                )
              }}%， 平均课堂互动参与度{{
                videoData.interactionStats.averageParticipation.toFixed(1)
              }}%。
            </p>
          </div>

          <div class="report-details">
            <h4>详细分析</h4>
            <div class="analysis-items">
              <div class="analysis-item">
                <h5>教学姿态</h5>
                <p>
                  {{
                    videoData.postureStats.stability.excellent
                  }}位师范生姿态稳定性达到优秀水平，手势表达自然得体。建议对姿态表现一般的{{
                    videoData.postureStats.stability.average +
                    videoData.postureStats.stability.poor
                  }}位师范生加强形体训练。
                </p>
              </div>

              <div class="analysis-item">
                <h5>面部表情</h5>
                <p>
                  师范生面部表情丰富，愉悦表情占比{{
                    videoData.expressionStats.happy.toFixed(1)
                  }}%，自信表情占比{{
                    videoData.expressionStats.confident.toFixed(1)
                  }}%，整体表现积极向上，有利于营造良好的课堂氛围。
                </p>
              </div>

              <div class="analysis-item">
                <h5>板书质量</h5>
                <p>
                  板书清晰度整体良好，{{
                    videoData.blackboardStats.clarity.excellent
                  }}位师范生达到优秀水平。{{
                    videoData.blackboardStats.colorUsage.multiple
                  }}位师范生使用多色板书，有助于突出重点内容。
                </p>
              </div>

              <div class="analysis-item">
                <h5>课堂互动</h5>
                <p>
                  平均提问次数{{
                    videoData.interactionStats.averageQuestions.toFixed(1)
                  }}次，眼神交流时间占比{{
                    videoData.interactionStats.averageEyeContact.toFixed(1)
                  }}%，师生互动较为活跃，课堂参与度良好。
                </p>
              </div>
            </div>
          </div>

          <div class="report-suggestions">
            <h4>改进建议</h4>
            <ul class="suggestion-list">
              <li>加强教学姿态训练，提升整体形象和表现力。</li>
              <li>保持积极的面部表情，增强课堂感染力。</li>
              <li>优化板书布局设计，合理使用颜色突出重点。</li>
              <li>增加师生互动频次，提高学生参与度。</li>
              <li>加强眼神交流技巧，建立良好的师生关系。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import {
  VideoCamera,
  User,
  Star,
  Document,
  ChatDotRound,
  Loading,
} from "@element-plus/icons-vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, RadarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
} from "echarts/components";
import VChart from "vue-echarts";

// 注册ECharts组件
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
]);

// Props接口，保持与其他组件一致
interface TaskVideoData {
  postureStats: {
    stability: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
    gesture: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
    orientation: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
    movement: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
  };
  expressionStats: {
    happy: number;
    confident: number;
    focused: number;
    neutral: number;
    concerned: number;
  };
  blackboardStats: {
    clarity: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
    layout: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
    colorUsage: {
      single: number;
      multiple: number;
    };
  };
  interactionStats: {
    averageQuestions: number;
    averageEyeContact: number;
    averageResponses: number;
    averageParticipation: number;
  };
}

const props = defineProps<{
  taskId: string;
  videoData: TaskVideoData;
  loading: boolean;
}>();

// 教学姿态稳定性分布饼图配置
const postureStabilityOption = computed(() => ({
  title: {
    text: "姿态稳定性",
    left: "center",
    textStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c}人 ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      fontSize: 12,
    },
  },
  series: [
    {
      name: "姿态稳定性",
      type: "pie",
      radius: "60%",
      center: ["50%", "60%"],
      data: [
        {
          value: props.videoData.postureStats.stability.excellent,
          name: "优秀",
          itemStyle: { color: "#67C23A" },
        },
        {
          value: props.videoData.postureStats.stability.good,
          name: "良好",
          itemStyle: { color: "#409EFF" },
        },
        {
          value: props.videoData.postureStats.stability.average,
          name: "一般",
          itemStyle: { color: "#E6A23C" },
        },
        {
          value: props.videoData.postureStats.stability.poor,
          name: "较差",
          itemStyle: { color: "#F56C6C" },
        },
      ],
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

// 面部表情分布饼图配置
const expressionDistributionOption = computed(() => ({
  title: {
    text: "表情分布",
    left: "center",
    textStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c}%",
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: {
      fontSize: 12,
    },
  },
  series: [
    {
      name: "面部表情",
      type: "pie",
      radius: "60%",
      center: ["50%", "60%"],
      data: [
        {
          value: props.videoData.expressionStats.happy,
          name: "愉悦",
          itemStyle: { color: "#FF6B9D" },
        },
        {
          value: props.videoData.expressionStats.confident,
          name: "自信",
          itemStyle: { color: "#4ECDC4" },
        },
        {
          value: props.videoData.expressionStats.focused,
          name: "专注",
          itemStyle: { color: "#45B7D1" },
        },
        {
          value: props.videoData.expressionStats.neutral,
          name: "平静",
          itemStyle: { color: "#96CEB4" },
        },
        {
          value: props.videoData.expressionStats.concerned,
          name: "担忧",
          itemStyle: { color: "#FFEAA7" },
        },
      ],
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

// 板书质量分布柱状图配置
const blackboardQualityOption = computed(() => ({
  title: {
    text: "板书质量评估",
    left: "center",
    textStyle: {
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    data: ["清晰度"],
    top: "10%",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "20%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["优秀", "良好", "一般", "较差"],
    axisLabel: {
      fontSize: 12,
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      fontSize: 12,
    },
  },
  series: [
    {
      name: "清晰度",
      type: "bar",
      data: [
        {
          value: props.videoData.blackboardStats.clarity.excellent,
          itemStyle: { color: "#67C23A" },
        },
        {
          value: props.videoData.blackboardStats.clarity.good,
          itemStyle: { color: "#409EFF" },
        },
        {
          value: props.videoData.blackboardStats.clarity.average,
          itemStyle: { color: "#E6A23C" },
        },
        {
          value: props.videoData.blackboardStats.clarity.poor,
          itemStyle: { color: "#F56C6C" },
        },
      ],
      barWidth: "60%",
    },
  ],
}));

// 课堂互动指标雷达图配置
const interactionRadarOption = computed(() => {
  // 动态计算最大值，确保数据不会超出范围
  const maxQuestions = Math.max(
    15,
    Math.ceil(props.videoData.interactionStats.averageQuestions * 1.2),
  );
  const maxEyeContact = 100;
  const maxResponses = Math.max(
    20,
    Math.ceil(props.videoData.interactionStats.averageResponses * 1.2),
  );
  const maxParticipation = 100;

  return {
    title: {
      text: "互动指标",
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const data = params.data;
        const indicators = ["提问频次", "眼神交流", "学生回应", "参与度"];
        const units = ["次", "%", "次", "%"];
        let result = `${data.name}<br/>`;
        data.value.forEach((value: number, index: number) => {
          result += `${indicators[index]}: ${value.toFixed(1)}${units[index]}<br/>`;
        });
        return result;
      },
    },
    radar: {
      indicator: [
        { name: "提问频次", max: maxQuestions },
        { name: "眼神交流", max: maxEyeContact },
        { name: "学生回应", max: maxResponses },
        { name: "参与度", max: maxParticipation },
      ],
      center: ["50%", "60%"],
      radius: "60%",
      splitNumber: 4,
      axisName: {
        fontSize: 12,
        color: "#666",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      splitArea: {
        show: false,
      },
    },
    series: [
      {
        name: "课堂互动",
        type: "radar",
        data: [
          {
            value: [
              props.videoData.interactionStats.averageQuestions,
              props.videoData.interactionStats.averageEyeContact,
              props.videoData.interactionStats.averageResponses,
              props.videoData.interactionStats.averageParticipation,
            ],
            name: "平均水平",
            itemStyle: {
              color: "#409EFF",
            },
            areaStyle: {
              color: "rgba(64, 158, 255, 0.3)",
            },
            lineStyle: {
              width: 2,
            },
          },
        ],
      },
    ],
  };
});
</script>

<style scoped>
.video-analysis {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

/* 视频指标统计卡片区域 */
.metrics-section {
  margin-bottom: 32px;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: #333;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.metric-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.posture-card .metric-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.expression-card .metric-icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.blackboard-card .metric-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.interaction-card .metric-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.metric-title h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.metric-title p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.metric-content {
  color: #2c3e50;
}

/* 教学姿态统计样式 */
.posture-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-group h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
}

.stat-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.stat-item.excellent {
  background: rgba(103, 194, 58, 0.1);
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.stat-item.good {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
}

.stat-item.average {
  background: rgba(230, 162, 60, 0.1);
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.stat-item.poor {
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
}

/* 面部表情统计样式 */
.expression-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expression-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
}

.expression-item.happy {
  background: rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.3);
}

.expression-item.confident {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
}

.expression-item.focused {
  background: rgba(69, 183, 209, 0.1);
  border: 1px solid rgba(69, 183, 209, 0.3);
}

.expression-item.neutral {
  background: rgba(150, 206, 180, 0.1);
  border: 1px solid rgba(150, 206, 180, 0.3);
}

.expression-item.concerned {
  background: rgba(255, 234, 167, 0.1);
  border: 1px solid rgba(255, 234, 167, 0.3);
}

.expression-label {
  font-weight: 500;
}

.expression-value {
  font-weight: 600;
  font-size: 16px;
}

/* 板书分析统计样式 */
.blackboard-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-usage h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
}

.color-stats {
  display: flex;
  gap: 12px;
}

.color-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 8px;
  font-size: 13px;
}

.color-label {
  font-weight: 500;
}

.color-value {
  font-weight: 600;
}

/* 课堂互动统计样式 */
.interaction-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.interaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(67, 233, 123, 0.1);
  border: 1px solid rgba(67, 233, 123, 0.3);
  border-radius: 10px;
  font-size: 14px;
}

.interaction-label {
  font-weight: 500;
}

.interaction-value {
  font-weight: 600;
  font-size: 16px;
}

/* 图表区域样式 */
.charts-section {
  margin-bottom: 32px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: #333;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.chart-header {
  margin-bottom: 20px;
  text-align: center;
}

.chart-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.chart-header p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.chart-container {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
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
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.chart-loading p {
  margin: 0;
  font-size: 14px;
}

/* AI分析报告样式 */
.ai-report-section {
  margin-top: 32px;
}

.section-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #333;
}

.card-header {
  margin-bottom: 24px;
  text-align: center;
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.ai-icon {
  font-size: 28px;
  margin-right: 12px;
  color: #667eea;
}

.card-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.card-header p {
  margin: 0;
  font-size: 16px;
  color: #7f8c8d;
}

.ai-report-content {
  color: #2c3e50;
}

.report-summary {
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.report-summary h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.report-summary p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #34495e;
}

.report-details {
  margin-bottom: 32px;
}

.report-details h4 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.analysis-items {
  display: grid;
  gap: 20px;
}

.analysis-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.analysis-item h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.analysis-item p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #34495e;
}

.report-suggestions h4 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.suggestion-list {
  margin: 0;
  padding-left: 20px;
  color: #34495e;
}

.suggestion-list li {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-analysis {
    padding: 16px;
  }

  .metrics-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .chart-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metric-card,
  .chart-card,
  .section-card {
    padding: 20px;
  }

  .chart-container {
    height: 300px;
  }
}
</style>
