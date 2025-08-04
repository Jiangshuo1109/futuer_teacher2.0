<template>
  <div class="student-learning-status">
    <div class="page-header">
      <h2>师范生学习情况</h2>
      <p>查看任务「{{ taskName }}」的师范生学习情况</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="filterStatus" placeholder="全部状态" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="未开始" value="not_started" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索学生姓名"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table :data="filteredStudentData" style="width: 100%" v-loading="loading">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="120" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column label="学习进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="学习状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="lastActiveTime" label="最后活跃时间" width="160" />
        <el-table-column prop="totalTime" label="学习时长" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="AI综合教学评价" placement="top">
                <el-button type="primary" size="small" circle @click="handleAIEvaluation(row)">
                  <el-icon><TrendCharts /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="音频分析" placement="top">
                <el-button type="success" size="small" circle @click="handleAudioAnalysis(row)">
                  <el-icon><Microphone /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="视频分析" placement="top">
                <el-button type="warning" size="small" circle @click="handleVideoAnalysis(row)">
                  <el-icon><VideoCamera /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="查看详情" placement="top">
                <el-button type="info" size="small" circle @click="handleViewDetail(row)">
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, Search, TrendCharts, Microphone, VideoCamera, View } from '@element-plus/icons-vue'

// 接口定义
interface StudentLearning {
  studentId: string
  studentName: string
  className: string
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  startTime: string
  lastActiveTime: string
  totalTime: string
}

// 响应式数据
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 从路由参数获取任务信息
const taskId = route.params.taskId as string
const taskName = ref('Web前端开发基础')

// 模拟数据
const studentData = ref<StudentLearning[]>([
  {
    studentId: '2021001',
    studentName: '张三',
    className: '计算机21-1班',
    progress: 85,
    status: 'in_progress',
    startTime: '2024-01-15 09:00:00',
    lastActiveTime: '2024-01-20 14:30:00',
    totalTime: '12小时30分钟'
  },
  {
    studentId: '2021002',
    studentName: '李四',
    className: '计算机21-1班',
    progress: 100,
    status: 'completed',
    startTime: '2024-01-15 09:00:00',
    lastActiveTime: '2024-01-18 16:45:00',
    totalTime: '15小时20分钟'
  },
  {
    studentId: '2021003',
    studentName: '王五',
    className: '计算机21-2班',
    progress: 45,
    status: 'in_progress',
    startTime: '2024-01-16 10:30:00',
    lastActiveTime: '2024-01-19 11:20:00',
    totalTime: '8小时15分钟'
  },
  {
    studentId: '2021004',
    studentName: '赵六',
    className: '计算机21-2班',
    progress: 0,
    status: 'not_started',
    startTime: '',
    lastActiveTime: '',
    totalTime: '0分钟'
  }
])

// 计算属性
const filteredStudentData = computed(() => {
  let data = studentData.value
  
  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }
  
  if (searchKeyword.value) {
    data = data.filter(item => 
      item.studentName.includes(searchKeyword.value) ||
      item.studentId.includes(searchKeyword.value)
    )
  }
  
  total.value = data.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.slice(start, end)
})

// 方法
const getStatusType = (status: string) => {
  const statusMap = {
    'not_started': 'info',
    'in_progress': 'warning',
    'completed': 'success'
  }
  return statusMap[status as keyof typeof statusMap] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleAIEvaluation = (row: StudentLearning) => {
  console.log('点击AI综合教学评价按钮', { taskId, studentId: row.studentId })
  try {
    const targetRoute = `/dashboard/teaching/task/${taskId}/student/${row.studentId}/ai-evaluation`
    console.log('准备跳转到:', targetRoute)
    router.push(targetRoute)
    ElMessage.success(`正在跳转到学生 ${row.studentName} 的AI综合教学评价页面`)
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('页面跳转失败，请稍后重试')
  }
}

const handleAudioAnalysis = (row: StudentLearning) => {
  console.log('点击音频分析按钮', { taskId, studentId: row.studentId })
  try {
    const targetRoute = `/dashboard/teaching/task/${taskId}/student/${row.studentId}/audio-analysis`
    console.log('准备跳转到:', targetRoute)
    router.push(targetRoute)
    ElMessage.success(`正在跳转到学生 ${row.studentName} 的音频分析页面`)
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('页面跳转失败，请稍后重试')
  }
}

const handleVideoAnalysis = (row: StudentLearning) => {
  console.log('点击视频分析按钮', { taskId, studentId: row.studentId })
  try {
    const targetRoute = `/dashboard/teaching/task/${taskId}/student/${row.studentId}/video-analysis`
    console.log('准备跳转到:', targetRoute)
    router.push(targetRoute)
    ElMessage.success(`正在跳转到学生 ${row.studentName} 的视频分析页面`)
  } catch (error) {
    console.error('路由跳转失败:', error)
    ElMessage.error('页面跳转失败，请稍后重试')
  }
}

const handleViewDetail = (row: StudentLearning) => {
  ElMessage.info(`查看学生 ${row.studentName} 的详细信息`)
}

// 生命周期
onMounted(() => {
  // 初始化数据
  total.value = studentData.value.length
})
</script>

<style scoped>
.student-learning-status {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
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

.content-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>