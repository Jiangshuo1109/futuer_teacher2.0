<template>
  <div class="my-tasks">
    <div class="page-header">
      <h2>我的教学任务</h2>
      <p>查看接收到的教学任务，创建自定义任务，追踪学习进度</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card total">
        <div class="stat-icon">
          <el-icon><List /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">总任务</div>
        </div>
      </div>
      <div class="stat-card completed">
        <div class="stat-icon">
          <el-icon><Check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      <div class="stat-card received">
        <div class="stat-icon">
          <el-icon><Download /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.received }}</div>
          <div class="stat-label">接收任务</div>
        </div>
      </div>
      <div class="stat-card custom">
        <div class="stat-icon">
          <el-icon><Star /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.custom }}</div>
          <div class="stat-label">自定义任务</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 教学任务成绩排行 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>教学任务成绩排行</h3>
          <div class="chart-legend">
            <span class="legend-item">
              <span
                class="legend-color"
                style="background-color: #67c23a"
              ></span>
              优秀 (90-100分)
            </span>
            <span class="legend-item">
              <span
                class="legend-color"
                style="background-color: #409eff"
              ></span>
              良好 (80-89分)
            </span>
            <span class="legend-item">
              <span
                class="legend-color"
                style="background-color: #e6a23c"
              ></span>
              及格 (60-79分)
            </span>
          </div>
        </div>
        <div class="chart-container">
          <v-chart :option="scoreRankingChartOption" style="height: 300px" />
        </div>
      </div>

      <!-- 任务状态分布饼图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>任务状态分布</h3>
          <div class="status-summary">
            <span class="summary-text">总计: {{ stats.total }}个任务</span>
          </div>
        </div>
        <div class="chart-container">
          <v-chart :option="pieChartOption" style="height: 300px" />
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="createCustomTask">
            <el-icon><Plus /></el-icon>
            创建自定义任务
          </el-button>
          <el-button type="default" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button type="default" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出记录
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedStatus"
            placeholder="任务状态"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部状态" value="" />
            <el-option label="已完成" value="completed" />
            <el-option label="进行中" value="in-progress" />
            <el-option label="已逾期" value="overdue" />
            <el-option label="已提交" value="submitted" />
          </el-select>
          <el-select
            v-model="selectedType"
            placeholder="任务类型"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部类型" value="" />
            <el-option label="接收任务" value="received" />
            <el-option label="自定义任务" value="custom" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索任务标题"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table :data="filteredTasks" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="任务ID" width="80" />
        <el-table-column prop="title" label="任务标题" min-width="200" />
        <el-table-column prop="source" label="任务来源" width="120">
          <template #default="{ row }">
            <el-tag :type="row.source === 'custom' ? 'warning' : 'info'">
              {{ row.source === "custom" ? "自定义" : "接收任务" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="course" label="课程" width="120" />
        <el-table-column prop="teacher" label="发布教师" width="100" />

        <el-table-column prop="deadline" label="截止时间" width="120" />
        <el-table-column prop="submitTime" label="提交时间" width="120">
          <template #default="{ row }">
            <span v-if="row.submitTime">{{ row.submitTime }}</span>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{
              getStatusLabel(row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="查看详情" placement="top">
                <el-button
                  type="info"
                  size="small"
                  circle
                  @click="viewTask(row)"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                content="继续学习"
                placement="top"
                v-if="row.status === 'in-progress'"
              >
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="continueTask(row)"
                >
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                content="编辑"
                placement="top"
                v-if="row.source === 'custom'"
              >
                <el-button
                  type="warning"
                  size="small"
                  circle
                  @click="editTask(row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <!-- AI分析按钮组 - 仅在已完成状态显示 -->
              <template v-if="row.status === 'completed'">
                <el-tooltip content="AI综合分析" placement="top">
                  <el-button
                    type="success"
                    size="small"
                    circle
                    @click="viewAIEvaluation(row)"
                  >
                    <el-icon><DataAnalysis /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="AI音频分析" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click="viewAIAudioAnalysis(row)"
                  >
                    <el-icon><Microphone /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="AI视频分析" placement="top">
                  <el-button
                    type="warning"
                    size="small"
                    circle
                    @click="viewAIVideoAnalysis(row)"
                  >
                    <el-icon><VideoCamera /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  List,
  Check,
  Clock,
  Star,
  Plus,
  Refresh,
  Download,
  Search,
  View,
  VideoPlay,
  Edit,
  DataAnalysis,
  Microphone,
  VideoCamera,
} from "@element-plus/icons-vue";
import { use } from "echarts/core";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

interface Task {
  id: number;
  title: string;
  source: "received" | "custom";
  course: string;
  teacher: string;
  progress: number;
  deadline: string;
  submitTime?: string;
  status: "completed" | "in-progress" | "overdue" | "submitted";
  description?: string;
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedStatus = ref("");
const selectedType = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const taskData = ref<Task[]>([
  {
    id: 1,
    title: "现代文阅读理解练习",
    source: "received",
    course: "现代文阅读",
    teacher: "张教授",
    progress: 85,
    deadline: "2024-01-25",
    submitTime: "2024-01-20",
    status: "completed",
  },
  {
    id: 2,
    title: "古诗词背诵默写",
    source: "received",
    course: "古诗词鉴赏",
    teacher: "王明华",
    progress: 60,
    deadline: "2024-01-28",
    status: "in-progress",
  },
  {
    id: 3,
    title: "作文写作训练",
    source: "custom",
    course: "作文指导",
    teacher: "自己",
    progress: 30,
    deadline: "2024-02-01",
    status: "in-progress",
    description: "对本学期教学实践进行深度反思",
  },
  {
    id: 4,
    title: "文言文翻译练习",
    source: "received",
    course: "文言文阅读",
    teacher: "赵教授",
    progress: 0,
    deadline: "2024-01-20",
    status: "overdue",
  },
  {
    id: 5,
    title: "语文综合素养提升",
    source: "custom",
    course: "语文综合",
    teacher: "自己",
    progress: 100,
    deadline: "2024-01-22",
    submitTime: "2024-01-21",
    status: "submitted",
    description: "设计一套完整的多媒体教学方案",
  },
]);

const stats = computed(() => {
  const tasks = taskData.value;
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    received: tasks.filter((t) => t.source === "received").length,
    custom: tasks.filter((t) => t.source === "custom").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    submitted: tasks.filter((t) => t.status === "submitted").length,
  };
});

// 过滤后的任务数据
const filteredTasks = computed(() => {
  let filtered = taskData.value;

  // 状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter((task) => task.status === selectedStatus.value);
  }

  // 类型筛选
  if (selectedType.value) {
    filtered = filtered.filter((task) => task.source === selectedType.value);
  }

  // 搜索筛选
  if (searchKeyword.value) {
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        task.course.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    );
  }

  total.value = filtered.length;
  return filtered;
});

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    "in-progress": "进行中",
    submitted: "已提交",
    completed: "已完成",
    overdue: "已逾期",
  };
  return statusMap[status] || status;
};

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    "in-progress": "warning",
    submitted: "primary",
    completed: "success",
    overdue: "danger",
  };
  return statusMap[status] || "info";
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleExport = () => {
  ElMessage.info("导出记录功能开发中");
};

const createCustomTask = () => {
  ElMessage.info("创建自定义任务功能开发中");
};

const viewTask = (row: Task) => {
  ElMessage.info(`查看任务详情: ${row.title}`);
};

const continueTask = (row: Task) => {
  ElMessage.info(`继续学习: ${row.title}`);
};

const editTask = (row: Task) => {
  ElMessage.info(`编辑任务: ${row.title}`);
};

const viewResult = (row: Task) => {
  ElMessage.info(`查看结果: ${row.title}`);
};

// 路由实例
const router = useRouter();

// AI分析方法
const viewAIEvaluation = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/ai-evaluation`,
  });
};

const viewAIAudioAnalysis = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/audio-analysis`,
  });
};

const viewAIVideoAnalysis = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/video-analysis`,
  });
};

// 生成教学任务成绩排行数据
const generateScoreRankingData = () => {
  const taskScores = [
    { name: "现代文阅读理解", score: 92, level: "excellent" },
    { name: "古诗词背诵默写", score: 88, level: "good" },
    { name: "作文写作训练", score: 85, level: "good" },
    { name: "文言文翻译练习", score: 78, level: "pass" },
    { name: "语文综合素养", score: 95, level: "excellent" },
    { name: "课堂教学设计", score: 82, level: "good" },
    { name: "学生互动管理", score: 76, level: "pass" },
    { name: "教学反思总结", score: 90, level: "excellent" },
  ];

  // 按分数排序
  return taskScores.sort((a, b) => b.score - a.score);
};

// ECharts 配置
const scoreRankingChartOption = computed(() => {
  const scoreData = generateScoreRankingData();

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const data = params[0];
        const levelMap: Record<string, string> = {
          excellent: "优秀",
          good: "良好",
          pass: "及格",
        };
        const item = scoreData[data.dataIndex];
        return `${data.name}<br/>成绩: ${data.value}分<br/>等级: ${levelMap[item.level]}`;
      },
    },
    grid: {
      left: "25%",
      right: "10%",
      top: "10%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: {
        fontSize: 11,
        formatter: "{value}分",
        color: "rgba(255, 255, 255, 0.8)",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "category",
      data: scoreData.map((item) => item.name),
      axisLabel: {
        fontSize: 11,
        interval: 0,
        color: "rgba(255, 255, 255, 0.8)",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        name: "任务成绩",
        type: "bar",
        data: scoreData.map((item) => item.score),
        itemStyle: {
          color: function (params: any) {
            const item = scoreData[params.dataIndex];
            const colorMap: Record<string, string> = {
              excellent: "#67c23a",
              good: "#409eff",
              pass: "#e6a23c",
            };
            return colorMap[item.level] || "#909399";
          },
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          formatter: "{c}分",
          fontSize: 11,
          color: "rgba(255, 255, 255, 0.8)",
        },
        barWidth: "60%",
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
});

const pieChartOption = computed(() => {
  // 基于实际任务数据计算状态分布（去掉已提交状态）
  const statusData = [
    {
      value: stats.value.completed,
      name: "已完成",
      itemStyle: { color: "#67c23a" },
      percentage: ((stats.value.completed / stats.value.total) * 100).toFixed(
        1,
      ),
    },
    {
      value: taskData.value.filter((t) => t.status === "in-progress").length,
      name: "进行中",
      itemStyle: { color: "#e6a23c" },
      percentage: (
        (taskData.value.filter((t) => t.status === "in-progress").length /
          stats.value.total) *
        100
      ).toFixed(1),
    },
    {
      value: stats.value.overdue,
      name: "已逾期",
      itemStyle: { color: "#f56c6c" },
      percentage: ((stats.value.overdue / stats.value.total) * 100).toFixed(1),
    },
  ].filter((item) => item.value > 0); // 只显示有数据的状态

  return {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        return `${params.seriesName}<br/>${params.name}: ${params.value}个 (${params.percent}%)`;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
      textStyle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
      },
      formatter: (name: string) => {
        const item = statusData.find((d) => d.name === name);
        return `${name} ${item?.value || 0}个`;
      },
    },
    series: [
      {
        name: "任务状态",
        type: "pie",
        radius: ["45%", "75%"],
        center: ["65%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{d}%",
          fontSize: 11,
          color: "rgba(255, 255, 255, 0.8)",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "14",
            fontWeight: "bold",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
        },
        data: statusData,
      },
    ],
  };
});
</script>

<style scoped>
.my-tasks {
  padding: var(--spacing-lg);
  background: transparent;
  min-height: 100vh;
  position: relative;
}

.page-header {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05),
    rgba(16, 185, 129, 0.03)
  );
  pointer-events: none;
}

.page-header h2 {
  margin: 0 0 8px 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 28px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.page-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 16px;
  position: relative;
  z-index: 1;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.5),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.stat-icon::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #409eff, #337ecc);
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, #67c23a, #529b2e);
}

.stat-card.received .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #b88230);
}

.stat-card.custom .stat-icon {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 600;
}

/* 图表区域样式 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.02),
    rgba(16, 185, 129, 0.02)
  );
  pointer-events: none;
}

.chart-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-primary);
  position: relative;
  z-index: 1;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-legend {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.status-summary {
  display: flex;
  align-items: center;
}

.summary-text {
  font-size: 13px;
  color: var(--text-tertiary);
  background: rgba(59, 130, 246, 0.1);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 320px;
  z-index: 1;
}

/* 使用全局content-card样式，移除重复定义 */

.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #606266;
  min-width: 35px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.text-gray {
  color: #909399;
}

.score {
  font-weight: 600;
  color: #67c23a;
}

.no-score {
  color: #909399;
  font-size: 12px;
}

.text-red-500 {
  color: #f56c6c;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  margin: 0;
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .my-tasks {
    padding: 16px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .pie-chart-container {
    flex-direction: column;
    gap: 20px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
