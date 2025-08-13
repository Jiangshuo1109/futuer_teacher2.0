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
      <div class="stat-card in-progress">
        <div class="stat-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.inProgress }}</div>
          <div class="stat-label">进行中</div>
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
      <!-- 学习进度趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>学习进度趋势</h3>
        </div>
        <div class="chart-container">
          <v-chart :option="progressChartOption" style="height: 300px" />
        </div>
      </div>

      <!-- 任务完成分布饼图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>任务完成分布</h3>
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
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出记录
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedStatus" placeholder="任务状态" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="已完成" value="completed" />
            <el-option label="进行中" value="in-progress" />
            <el-option label="已逾期" value="overdue" />
            <el-option label="已提交" value="submitted" />
          </el-select>
          <el-select v-model="selectedType" placeholder="任务类型" style="width: 120px; margin-right: 8px" clearable>
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
              {{ row.source === 'custom' ? '自定义' : '接收任务' }}
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
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="查看详情" placement="top">
                <el-button type="info" size="small" circle @click="viewTask(row)">
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="继续学习" placement="top" v-if="row.status === 'in-progress'">
                <el-button type="primary" size="small" circle @click="continueTask(row)">
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top" v-if="row.source === 'custom'">
                <el-button type="warning" size="small" circle @click="editTask(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <!-- AI分析按钮组 - 仅在已完成状态显示 -->
              <template v-if="row.status === 'completed'">
                <el-tooltip content="AI综合分析" placement="top">
                  <el-button type="success" size="small" circle @click="viewAIEvaluation(row)">
                    <el-icon><DataAnalysis /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="AI音频分析" placement="top">
                  <el-button type="primary" size="small" circle @click="viewAIAudioAnalysis(row)">
                    <el-icon><Microphone /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="AI视频分析" placement="top">
                  <el-button type="warning" size="small" circle @click="viewAIVideoAnalysis(row)">
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
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { List, Check, Clock, Star, Plus, Refresh, Download, Search, View, VideoPlay, Edit, DataAnalysis, Microphone, VideoCamera } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([LineChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

interface Task {
  id: number
  title: string
  source: 'received' | 'custom'
  course: string
  teacher: string
  progress: number
  deadline: string
  submitTime?: string
  status: 'completed' | 'in-progress' | 'overdue' | 'submitted'
  description?: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const taskData = ref<Task[]>([
  {
    id: 1,
    title: '现代文阅读理解练习',
    source: 'received',
    course: '现代文阅读',
    teacher: '张教授',
    progress: 85,
    deadline: '2024-01-25',
    submitTime: '2024-01-20',
    status: 'completed'
  },
  {
    id: 2,
    title: '古诗词背诵默写',
    source: 'received',
    course: '古诗词鉴赏',
    teacher: '王明华',
    progress: 60,
    deadline: '2024-01-28',
    status: 'in-progress'
  },
  {
    id: 3,
    title: '作文写作训练',
    source: 'custom',
    course: '作文指导',
    teacher: '自己',
    progress: 30,
    deadline: '2024-02-01',
    status: 'in-progress',
    description: '对本学期教学实践进行深度反思'
  },
  {
    id: 4,
    title: '文言文翻译练习',
    source: 'received',
    course: '文言文阅读',
    teacher: '赵教授',
    progress: 0,
    deadline: '2024-01-20',
    status: 'overdue'
  },
  {
    id: 5,
    title: '语文综合素养提升',
    source: 'custom',
    course: '语文综合',
    teacher: '自己',
    progress: 100,
    deadline: '2024-01-22',
    submitTime: '2024-01-21',
    status: 'submitted',
    description: '设计一套完整的多媒体教学方案'
  }
])

const stats = computed(() => {
  const tasks = taskData.value
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    custom: tasks.filter(t => t.source === 'custom').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    submitted: tasks.filter(t => t.status === 'submitted').length
  }
})

// 过滤后的任务数据
const filteredTasks = computed(() => {
  let filtered = taskData.value
  
  // 状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter(task => task.status === selectedStatus.value)
  }
  
  // 类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(task => task.source === selectedType.value)
  }
  
  // 搜索筛选
  if (searchKeyword.value) {
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      task.course.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  total.value = filtered.length
  return filtered
})

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'in-progress': '进行中',
    'submitted': '已提交',
    'completed': '已完成',
    'overdue': '已逾期'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    'in-progress': 'warning',
    'submitted': 'primary',
    'completed': 'success',
    'overdue': 'danger'
  }
  return statusMap[status] || 'info'
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleExport = () => {
  ElMessage.info('导出记录功能开发中')
}

const createCustomTask = () => {
  ElMessage.info('创建自定义任务功能开发中')
}

const viewTask = (row: Task) => {
  ElMessage.info(`查看任务详情: ${row.title}`)
}

const continueTask = (row: Task) => {
  ElMessage.info(`继续学习: ${row.title}`)
}

const editTask = (row: Task) => {
  ElMessage.info(`编辑任务: ${row.title}`)
}

const viewResult = (row: Task) => {
  ElMessage.info(`查看结果: ${row.title}`)
}

// 路由实例
const router = useRouter()

// AI分析方法
const viewAIEvaluation = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/ai-evaluation`
  })
}

const viewAIAudioAnalysis = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/audio-analysis`
  })
}

const viewAIVideoAnalysis = (row: Task) => {
  router.push({
    path: `/dashboard/teaching/task/${row.id}/student/2/video-analysis`
  })
}

// ECharts 配置
const progressChartOption = computed(() => ({
  title: {
    text: '学习进度趋势',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}'
  },
  legend: {
    data: ['完成进度', '新增任务'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1/15', '1/16', '1/17', '1/18', '1/19', '1/20', '1/21']
  },
  yAxis: {
    type: 'value',
    name: '任务数量',
    min: 0,
    max: 3
  },
  series: [
    {
      name: '完成进度',
      type: 'line',
      data: [0.8, 1.2, 1.8, 2.1, 2.5, 2.8, 3.0],
      smooth: true,
      lineStyle: {
        color: '#67c23a',
        width: 3
      },
      itemStyle: {
        color: '#67c23a'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
          ]
        }
      }
    },
    {
      name: '新增任务',
      type: 'line',
      data: [1.2, 1.5, 1.3, 1.8, 1.6, 1.4, 1.2],
      smooth: true,
      lineStyle: {
        color: '#409eff',
        width: 3
      },
      itemStyle: {
        color: '#409eff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ]
        }
      }
    }
  ]
}))

const pieChartOption = computed(() => ({
  title: {
    text: '任务完成分布',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['已完成', '进行中', '已逾期', '已提交']
  },
  series: [
    {
      name: '任务状态',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: stats.value.completed, name: '已完成', itemStyle: { color: '#67c23a' } },
        { value: stats.value.inProgress, name: '进行中', itemStyle: { color: '#e6a23c' } },
        { value: stats.value.overdue, name: '已逾期', itemStyle: { color: '#f56c6c' } },
        { value: stats.value.submitted, name: '已提交', itemStyle: { color: '#409eff' } }
      ]
    }
  ]
}))
</script>

<style scoped>
.my-tasks {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #409eff, #337ecc);
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, #67c23a, #529b2e);
}

.stat-card.in-progress .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #b88230);
}

.stat-card.custom .stat-icon {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 图表区域样式 */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.toolbar {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

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