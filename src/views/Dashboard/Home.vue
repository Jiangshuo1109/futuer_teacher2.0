<template>
  <div class="dashboard-home">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>首页</h1>
      <p>欢迎使用未来教师智能分析平台</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">
          <el-icon :size="24"><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardStats.totalUsers }}</div>
          <div class="stat-label">系统用户总数</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +{{ dashboardStats.userGrowthRate }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon courseware-icon">
          <el-icon :size="24"><Folder /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardStats.coursewareCount }}</div>
          <div class="stat-label">课件库总数</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +{{ dashboardStats.coursewareGrowthRate }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon course-icon">
          <el-icon :size="24"><Reading /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardStats.totalCourses }}</div>
          <div class="stat-label">课程库总数</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +{{ dashboardStats.courseGrowthRate }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon model-icon">
          <el-icon :size="24"><Avatar /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardStats.studentModels }}</div>
          <div class="stat-label">学生模型总数</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +{{ dashboardStats.modelGrowthRate }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 教学任务完成进度 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>教学任务完成进度</h3>
        </div>
        <div class="chart-content">
          <div ref="taskProgressChartRef" class="chart"></div>
        </div>
      </div>

      <!-- 各任务学习人数统计 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>各任务学习人数统计</h3>
        </div>
        <div class="chart-content">
          <div ref="courseDistributionChartRef" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-grid">
        <div class="action-card" @click="handleQuickAction('publish')">
          <div class="action-icon">
            <el-icon :size="32" color="#409eff"><DocumentAdd /></el-icon>
          </div>
          <div class="action-title">发布教学任务</div>
        </div>

        <div class="action-card" @click="handleQuickAction('manage')">
          <div class="action-icon">
            <el-icon :size="32" color="#67c23a"><Management /></el-icon>
          </div>
          <div class="action-title">管理课程</div>
        </div>

        <div class="action-card" @click="handleQuickAction('users')">
          <div class="action-icon">
            <el-icon :size="32" color="#e6a23c"><UserFilled /></el-icon>
          </div>
          <div class="action-title">用户管理</div>
        </div>

        <div class="action-card" @click="handleQuickAction('model')">
          <div class="action-icon">
            <el-icon :size="32" color="#f56c6c"><Avatar /></el-icon>
          </div>
          <div class="action-title">学生模型</div>
        </div>
      </div>
    </div>

    <!-- 最新通知 -->
    <div class="notifications">
      <h3>最新通知</h3>
      <div class="notification-list">
        <div class="notification-item">
          <div class="notification-title">新的教学任务发布</div>
          <div class="notification-desc">
            《现代文阅读》课程新的教学任务已发布
          </div>
          <div class="notification-time">2小时前</div>
        </div>

        <div class="notification-item">
          <div class="notification-title">系统维护通知</div>
          <div class="notification-desc">系统将于今晚23:00-24:00进行维护</div>
          <div class="notification-time">4小时前</div>
        </div>

        <div class="notification-item">
          <div class="notification-title">课程资料更新</div>
          <div class="notification-desc">《古诗词鉴赏》课程资料已更新</div>
          <div class="notification-time">1天前</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  User,
  Document,
  Reading,
  TrendCharts,
  CaretTop,
  CaretBottom,
  DocumentAdd,
  Management,
  UserFilled,
  Avatar,
  Folder,
} from "@element-plus/icons-vue";
import * as echarts from "echarts";

const router = useRouter();
const taskProgressChartRef = ref<HTMLElement>();
const courseDistributionChartRef = ref<HTMLElement>();

// 仪表板统计数据（模拟从API获取）
const dashboardStats = reactive({
  totalUsers: 0,
  coursewareCount: 0,
  totalCourses: 0,
  studentModels: 0,
  userGrowthRate: 0,
  coursewareGrowthRate: 0,
  courseGrowthRate: 0,
  modelGrowthRate: 0,
});

// 模拟API数据获取
const fetchDashboardStats = async () => {
  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟从不同数据源获取的统计数据
    dashboardStats.totalUsers = 1247; // 从用户管理模块获取
    dashboardStats.coursewareCount = 324; // 从课件库模块获取
    dashboardStats.totalCourses = 156; // 从课程库模块获取
    dashboardStats.studentModels = 45; // 从学生模型库获取
    dashboardStats.userGrowthRate = 12;
    dashboardStats.coursewareGrowthRate = 18;
    dashboardStats.courseGrowthRate = 5;
    dashboardStats.modelGrowthRate = 15;
  } catch (error) {
    console.error("获取仪表板数据失败:", error);
    ElMessage.error("数据加载失败");
  }
};

// 初始化教学任务完成进度图表
const initTaskProgressChart = () => {
  if (!taskProgressChartRef.value) return;

  const chart = echarts.init(taskProgressChartRef.value);

  // 模拟教学任务完成进度数据（实际应从教学任务模块API获取）
  const taskData = [
    { name: "文言文翻译练习", progress: 95, total: 100 },
    { name: "古诗词背诵默写", progress: 92, total: 100 },
    { name: "语文综合素养", progress: 88, total: 100 },
    { name: "现代文阅读理解", progress: 85, total: 100 },
    { name: "作文写作训练", progress: 78, total: 100 },
  ].sort((a, b) => b.progress - a.progress); // 按完成率从高到低排序

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data = params[0];
        return `${data.name}<br/>完成进度: ${data.value}%`;
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
        formatter: "{value}%",
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
      data: taskData.map((item) => item.name),
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
        name: "完成进度",
        type: "bar",
        data: taskData.map((item) => item.progress),
        itemStyle: {
          color: function (params: any) {
            const progress = params.value;
            if (progress >= 90) return "#67c23a"; // 绿色 - 优秀
            if (progress >= 80) return "#409eff"; // 蓝色 - 良好
            if (progress >= 70) return "#e6a23c"; // 橙色 - 一般
            return "#f56c6c"; // 红色 - 需改进
          },
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          formatter: "{c}%",
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

  chart.setOption(option);

  // 响应式调整
  window.addEventListener("resize", () => {
    chart.resize();
  });
};

// 初始化各任务学习人数统计图表
const initCourseDistributionChart = () => {
  if (!courseDistributionChartRef.value) return;

  const chart = echarts.init(courseDistributionChartRef.value);

  // 模拟各任务学习人数数据（实际应从教学任务模块API获取）
  const taskStudentData = [
    { name: "现代文阅读理解", students: 45, color: "#409eff" },
    { name: "古诗词背诵默写", students: 38, color: "#67c23a" },
    { name: "作文写作训练", students: 32, color: "#e6a23c" },
    { name: "文言文翻译练习", students: 28, color: "#f56c6c" },
    { name: "语文综合素养", students: 25, color: "#909399" },
    { name: "课堂教学设计", students: 22, color: "#606266" },
  ];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data = params[0];
        return `${data.name}<br/>学习人数: ${data.value}人`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: taskStudentData.map((item) => item.name),
      axisLabel: {
        fontSize: 11,
        interval: 0,
        rotate: 45,
        color: "rgba(255, 255, 255, 0.8)",
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: "学习人数",
      nameTextStyle: {
        fontSize: 12,
      },
      axisLabel: {
        fontSize: 11,
        formatter: "{value}人",
        color: "rgba(255, 255, 255, 0.8)",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "学习人数",
        type: "bar",
        data: taskStudentData.map((item) => ({
          value: item.students,
          itemStyle: {
            color: item.color,
          },
        })),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}人",
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

  chart.setOption(option);

  // 响应式调整
  window.addEventListener("resize", () => {
    chart.resize();
  });
};

// 处理快捷操作
const handleQuickAction = (action: string) => {
  switch (action) {
    case "publish":
      router.push("/dashboard/teaching/publish");
      break;
    case "manage":
      router.push("/dashboard/database/course");
      break;
    case "users":
      router.push("/dashboard/organization/user");
      break;
    case "model":
      router.push("/dashboard/database/student-model");
      break;
  }
};

// 组件挂载后初始化数据和图表
onMounted(async () => {
  await nextTick();
  await fetchDashboardStats();
  initTaskProgressChart();
  initCourseDistributionChart();
});
</script>

<style scoped>
.dashboard-home {
  padding: 0;
  position: relative;
}

.welcome-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
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

.welcome-section h1 {
  font-size: 28px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
}

.welcome-text {
  color: var(--text-secondary);
  margin: 0;
  font-size: 16px;
  position: relative;
  z-index: 1;
}

/* 统计卡片样式优化 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.8),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03),
    rgba(16, 185, 129, 0.02)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 16px 32px rgba(59, 130, 246, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-icon::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), transparent);
  transition: opacity 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-card:hover .stat-icon::before {
  opacity: 0.8;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.courseware-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 8px 16px rgba(240, 147, 251, 0.3);
}

.course-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8px 16px rgba(79, 172, 254, 0.3);
}

.completion-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 8px 16px rgba(67, 233, 123, 0.3);
}

.model-icon {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  box-shadow: 0 8px 16px rgba(255, 154, 158, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}

/* 图表区域样式优化 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.chart-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.chart-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05),
    rgba(16, 185, 129, 0.03)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.6),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-card:hover::before {
  opacity: 1;
}

.chart-card:hover::after {
  opacity: 1;
}

.chart-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.06)
  );
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 16px 32px rgba(59, 130, 246, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.15);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.chart-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 1px;
}

.chart-header h3 {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-legend {
  display: flex;
  gap: var(--spacing-md);
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.chart-content {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.chart {
  width: 100%;
  height: 320px;
  position: relative;
  z-index: 1;
}

.quick-actions {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  backdrop-filter: blur(20px);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.quick-actions::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03),
    rgba(16, 185, 129, 0.02)
  );
  pointer-events: none;
}

.quick-actions h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  position: relative;
  z-index: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.action-card {
  padding: 32px 24px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08),
    rgba(16, 185, 129, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.8),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-8px) scale(1.03);
  box-shadow:
    0 20px 40px rgba(59, 130, 246, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.2);
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:hover::after {
  opacity: 1;
}

.action-icon {
  margin-bottom: 20px;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.action-card:hover .action-icon {
  transform: scale(1.2) rotate(5deg);
}

.action-title {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.action-card:hover .action-title {
  color: #60a5fa;
}

.notifications {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.notifications::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03),
    rgba(16, 185, 129, 0.02)
  );
  pointer-events: none;
}

.notifications h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  position: relative;
  z-index: 1;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.notification-item {
  padding: var(--spacing-md);
  border-left: 3px solid var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.notification-item:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateX(4px);
}

.notification-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
