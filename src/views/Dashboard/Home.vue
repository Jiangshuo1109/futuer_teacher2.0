<template>
  <div class="dashboard-home">
    <!-- 欢迎信息 -->
    <div class="welcome-section">
      <h1>首页</h1>
      <p class="welcome-text">欢迎使用未来教师智能分析平台</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">
          <el-icon :size="24"><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">1234</div>
          <div class="stat-label">总用户数</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +12%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon task-icon">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">89</div>
          <div class="stat-label">活跃任务</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +5%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon course-icon">
          <el-icon :size="24"><Reading /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">156</div>
          <div class="stat-label">课程数量</div>
          <div class="stat-trend negative">
            <el-icon><CaretBottom /></el-icon>
            -2%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon completion-icon">
          <el-icon :size="24"><TrendCharts /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">92%</div>
          <div class="stat-label">完成率</div>
          <div class="stat-trend positive">
            <el-icon><CaretTop /></el-icon>
            +3%
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 任务完成情况 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>任务完成情况</h3>
        </div>
        <div class="chart-content">
          <div ref="taskChartRef" class="chart"></div>
        </div>
      </div>

      <!-- 用户活跃度 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户活跃度</h3>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color" style="background-color: #409eff"></span>
              教师
            </span>
            <span class="legend-item">
              <span class="legend-color" style="background-color: #67c23a"></span>
              学生
            </span>
          </div>
        </div>
        <div class="chart-content">
          <div ref="userChartRef" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-grid">
        <div class="action-card" @click="handleQuickAction('publish')">
          <div class="action-icon">
            <el-icon :size="32" color="#409eff"><Plus /></el-icon>
          </div>
          <div class="action-title">发布教学任务</div>
        </div>
        
        <div class="action-card" @click="handleQuickAction('manage')">
          <div class="action-icon">
            <el-icon :size="32" color="#67c23a"><Setting /></el-icon>
          </div>
          <div class="action-title">管理课程</div>
        </div>
        
        <div class="action-card" @click="handleQuickAction('users')">
          <div class="action-icon">
            <el-icon :size="32" color="#e6a23c"><UserFilled /></el-icon>
          </div>
          <div class="action-title">添加用户</div>
        </div>
        
        <div class="action-card" @click="handleQuickAction('model')">
          <div class="action-icon">
            <el-icon :size="32" color="#f56c6c"><DataBoard /></el-icon>
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
          <div class="notification-desc">《现代文阅读》课程新的教学任务已发布</div>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Document,
  Reading,
  TrendCharts,
  CaretTop,
  CaretBottom,
  Plus,
  Setting,
  UserFilled,
  DataBoard
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const taskChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()

// 初始化任务完成情况图表
const initTaskChart = () => {
  if (!taskChartRef.value) return
  
  const chart = echarts.init(taskChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已完成', '总数']
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        data: [80, 95, 75, 90, 85, 70, 85],
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '总数',
        type: 'bar',
        data: [100, 100, 100, 100, 100, 100, 100],
        itemStyle: {
          color: '#e4e7ed'
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化用户活跃度图表
const initUserChart = () => {
  if (!userChartRef.value) return
  
  const chart = echarts.init(userChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '教师',
        type: 'line',
        smooth: true,
        data: [300, 280, 350, 400, 380, 420, 500],
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.1)'
        }
      },
      {
        name: '学生',
        type: 'line',
        smooth: true,
        data: [150, 180, 160, 200, 190, 220, 180],
        itemStyle: {
          color: '#67c23a'
        },
        areaStyle: {
          color: 'rgba(103, 194, 58, 0.1)'
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 处理快捷操作
const handleQuickAction = (action: string) => {
  switch (action) {
    case 'publish':
      router.push('/dashboard/teaching/publish')
      break
    case 'manage':
      ElMessage.info('管理课程功能开发中')
      break
    case 'users':
      router.push('/dashboard/organization/user')
      break
    case 'model':
      ElMessage.info('学生模型功能开发中')
      break
  }
}

// 组件挂载后初始化图表
onMounted(async () => {
  await nextTick()
  initTaskChart()
  initUserChart()
})
</script>

<style scoped>
.dashboard-home {
  padding: 0;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-section h1 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.welcome-text {
  color: #606266;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.task-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.course-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.completion-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-trend.negative {
  color: #f56c6c;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.chart {
  width: 100%;
  height: 300px;
}

.quick-actions {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
}

.action-icon {
  margin-bottom: 12px;
}

.action-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.notifications {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.notifications h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  padding: 12px;
  border-left: 3px solid #409eff;
  background: #f8f9fa;
  border-radius: 4px;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #909399;
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