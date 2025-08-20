<template>
  <div class="task-learning-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="task-info">
          <h1 class="task-title">{{ taskInfo.taskName }}</h1>
          <div class="task-meta">
            <el-tag type="info" size="small">{{ taskInfo.status === 'active' ? '进行中' : '已完成' }}</el-tag>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              发布时间：{{ taskInfo.publishTime }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              参与人数：{{ taskInfo.participantCount }}人
            </span>
            <span class="meta-item">
              <el-icon><Document /></el-icon>
              完成人数：{{ taskInfo.completedCount }}人
            </span>
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              截止时间：{{ taskInfo.deadline }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
          <el-button type="primary" @click="handleShare">
            <el-icon><Share /></el-icon>
            分享数据
          </el-button>
          <el-button @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="content-area">
      <el-tabs v-model="activeTab" type="card" class="analysis-tabs">
        <el-tab-pane label="AI综合评价" name="comprehensive">
          <comprehensive-evaluation
            :task-id="taskId"
            :evaluation-data="evaluationData"
            :loading="loading"
          />
        </el-tab-pane>
        <el-tab-pane label="AI音频分析" name="audio">
          <audio-analysis
            :task-id="taskId"
            :audio-data="audioData"
            :loading="loading"
          />
        </el-tab-pane>
        <el-tab-pane label="AI视频分析" name="video">
          <video-analysis
            :task-id="taskId"
            :video-data="videoData"
            :loading="loading"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock, User, Document, Calendar, Download, Share, ArrowLeft } from '@element-plus/icons-vue'
import ComprehensiveEvaluation from '@/components/ComprehensiveEvaluation.vue'
import AudioAnalysis from '@/components/AudioAnalysis.vue'
import VideoAnalysis from '@/components/VideoAnalysis.vue'

// 接口定义
interface TaskInfo {
  taskId: string
  taskName: string
  publishTime: string
  deadline: string
  participantCount: number
  completedCount: number
  status: 'active' | 'completed' | 'expired'
  description: string
}

interface TaskEvaluationData {
  averageScore: number
  completionRate: number
  excellentRate: number
  passRate: number
  scoreDistribution: {
    range: string
    count: number
    percentage: number
  }[]
  dimensionScores: {
    name: string
    averageScore: number
    historicalAverage: number
  }[]
  topStudents: {
    studentId: string
    studentName: string
    score: number
    avatar?: string
  }[]
}

interface TaskAudioData {
  mandarinStats: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  speedStats: {
    averageSpeed: number
    minSpeed: number
    maxSpeed: number
    distribution: { range: string, count: number }[]
  }
  volumeStats: {
    averageVolume: number
    distribution: { range: string, count: number }[]
  }
  keywordStats: {
    totalKeywords: number
    averagePerStudent: number
    topKeywords: { word: string, frequency: number, students: string[] }[]
  }
  fillerStats: {
    totalFillers: number
    averagePerStudent: number
    commonFillers: { filler: string, frequency: number, students: string[] }[]
  }
  questionStats: {
    totalQuestions: number
    averagePerStudent: number
    questionTypes: { type: string, count: number }[]
  }
  timeDistribution: {
    studentName: string
    duration: number
    rank: number
  }[]
}

interface TaskVideoData {
  postureStats: {
    stability: { excellent: number, good: number, average: number, poor: number }
    gesture: { excellent: number, good: number, average: number, poor: number }
    orientation: { excellent: number, good: number, average: number, poor: number }
    movement: { excellent: number, good: number, average: number, poor: number }
  }
  expressionStats: {
    happy: number
    confident: number
    focused: number
    neutral: number
    concerned: number
  }
  blackboardStats: {
    clarity: { excellent: number, good: number, average: number, poor: number }
    layout: { excellent: number, good: number, average: number, poor: number }
    colorUsage: { single: number, multiple: number }
  }
  interactionStats: {
    averageQuestions: number
    averageEyeContact: number
    averageResponses: number
    averageParticipation: number
  }
}

// 路由和响应式数据
const route = useRoute()
const router = useRouter()
const taskId = ref(route.params.taskId as string)
const activeTab = ref('comprehensive')
const loading = ref(false)

// 任务基本信息
const taskInfo = ref<TaskInfo>({
  taskId: taskId.value,
  taskName: '现代文阅读理解练习',
  publishTime: '2025-08-15 14:00:00',
  deadline: '2025-08-25 23:59:59',
  participantCount: 32,
  completedCount: 28,
  status: 'active',
  description: '通过现代文阅读材料，练习师范生的阅读理解和教学分析能力'
})

// 模拟数据
const evaluationData = ref<TaskEvaluationData>({
  averageScore: 85.2,
  completionRate: 87.5,
  excellentRate: 34.4,
  passRate: 87.5,
  scoreDistribution: [
    { range: '90-100', count: 11, percentage: 34.4 },
    { range: '80-89', count: 9, percentage: 28.1 },
    { range: '70-79', count: 8, percentage: 25.0 },
    { range: '60-69', count: 3, percentage: 9.4 },
    { range: '0-59', count: 1, percentage: 3.1 }
  ],
  dimensionScores: [
    { name: '教学设计', averageScore: 88.5, historicalAverage: 82.3 },
    { name: '教学实施', averageScore: 84.2, historicalAverage: 80.1 },
    { name: '教学评价', averageScore: 86.8, historicalAverage: 83.5 },
    { name: '教学反思', averageScore: 82.1, historicalAverage: 78.9 },
    { name: '师生互动', averageScore: 87.3, historicalAverage: 81.7 },
    { name: '教学语言', averageScore: 86.1, historicalAverage: 84.2 }
  ],
  topStudents: [
    { studentId: '2021001', studentName: '李明轩', score: 96.5, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
    { studentId: '2021002', studentName: '张雨涵', score: 94.8, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
    { studentId: '2021003', studentName: '陈思琪', score: 93.2, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
    { studentId: '2021004', studentName: '刘浩然', score: 92.1, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
    { studentId: '2021005', studentName: '王欣怡', score: 91.5, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }
  ]
})

const audioData = ref<TaskAudioData>({
  mandarinStats: {
    excellent: 18,
    good: 8,
    average: 4,
    poor: 2
  },
  speedStats: {
    averageSpeed: 156,
    minSpeed: 120,
    maxSpeed: 200,
    distribution: [
      { range: '120-140', count: 8 },
      { range: '140-160', count: 12 },
      { range: '160-180', count: 8 },
      { range: '180-200', count: 4 }
    ]
  },
  volumeStats: {
    averageVolume: 72,
    distribution: [
      { range: '60-70', count: 6 },
      { range: '70-80', count: 18 },
      { range: '80-90', count: 6 },
      { range: '90-100', count: 2 }
    ]
  },
  keywordStats: {
    totalKeywords: 1248,
    averagePerStudent: 39,
    topKeywords: [
      { word: '同学们', frequency: 156, students: ['李明轩', '张雨涵', '陈思琪', '刘浩然', '王欣怡'] },
      { word: '理解', frequency: 142, students: ['李明轩', '张雨涵', '陈思琪', '刘浩然'] },
      { word: '分析', frequency: 128, students: ['张雨涵', '陈思琪', '刘浩然', '王欣怡'] },
      { word: '文章', frequency: 118, students: ['李明轩', '陈思琪', '王欣怡'] },
      { word: '作者', frequency: 98, students: ['李明轩', '张雨涵', '刘浩然'] },
      { word: '思考', frequency: 87, students: ['张雨涵', '陈思琪', '王欣怡'] },
      { word: '问题', frequency: 76, students: ['李明轩', '刘浩然', '王欣怡'] },
      { word: '知识', frequency: 65, students: ['张雨涵', '陈思琪', '刘浩然'] }
    ]
  },
  fillerStats: {
    totalFillers: 328,
    averagePerStudent: 10.3,
    commonFillers: [
      { filler: '嗯', frequency: 89, students: ['李明轩', '张雨涵', '陈思琪'] },
      { filler: '然后', frequency: 76, students: ['刘浩然', '王欣怡', '李明轩'] },
      { filler: '这个', frequency: 58, students: ['张雨涵', '陈思琪'] },
      { filler: '那个', frequency: 42, students: ['刘浩然', '王欣怡'] },
      { filler: '就是说', frequency: 32, students: ['李明轩', '张雨涵'] },
      { filler: '呃', frequency: 28, students: ['陈思琪', '王欣怡'] },
      { filler: '额', frequency: 23, students: ['刘浩然', '李明轩'] }
    ]
  },
  questionStats: {
    totalQuestions: 256,
    averagePerStudent: 8,
    questionTypes: [
      { type: '开放性问题', count: 128 },
      { type: '判断性问题', count: 78 },
      { type: '选择性问题', count: 50 }
    ]
  },
  timeDistribution: [
    { studentName: '李明轩', duration: 45.2, rank: 1 },
    { studentName: '张雨涵', duration: 42.8, rank: 2 },
    { studentName: '陈思琪', duration: 41.5, rank: 3 },
    { studentName: '刘浩然', duration: 39.7, rank: 4 },
    { studentName: '王欣怡', duration: 38.9, rank: 5 },
    { studentName: '赵子涵', duration: 37.2, rank: 6 },
    { studentName: '孙佳琪', duration: 36.8, rank: 7 },
    { studentName: '周思远', duration: 35.1, rank: 8 },
    { studentName: '吴雨桐', duration: 34.6, rank: 9 },
    { studentName: '郑浩宇', duration: 33.9, rank: 10 }
  ]
})

const videoData = ref<TaskVideoData>({
  postureStats: {
    stability: { excellent: 15, good: 10, average: 5, poor: 2 },
    gesture: { excellent: 12, good: 13, average: 6, poor: 1 },
    orientation: { excellent: 18, good: 8, average: 4, poor: 2 },
    movement: { excellent: 14, good: 11, average: 5, poor: 2 }
  },
  expressionStats: {
    happy: 45.6,
    confident: 28.3,
    focused: 18.9,
    neutral: 5.8,
    concerned: 1.4
  },
  blackboardStats: {
    clarity: { excellent: 16, good: 9, average: 5, poor: 2 },
    layout: { excellent: 14, good: 11, average: 6, poor: 1 },
    colorUsage: { single: 20, multiple: 12 }
  },
  interactionStats: {
    averageQuestions: 8.2,
    averageEyeContact: 76.5,
    averageResponses: 24.3,
    averageParticipation: 82.1
  }
})

// 事件处理方法
const handleBack = () => {
  router.back()
}

const handleExport = () => {
  ElMessage.success('报告导出功能开发中...')
}

const handleShare = () => {
  ElMessage.success('数据分享功能开发中...')
}

// 根据taskId加载数据
const loadTaskData = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 实际应用中这里会调用API获取真实数据
    loading.value = false
  } catch (error) {
    ElMessage.error('数据加载失败')
    loading.value = false
  }
}

onMounted(() => {
  loadTaskData()
})
</script>

<style scoped>
.task-learning-analysis {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  margin: 20px 20px 24px 20px;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.meta-item .el-icon {
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.header-actions .el-button {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 500;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.header-actions .el-button--primary {
  background: rgba(64, 158, 255, 0.8);
  border-color: #409eff;
}

.content-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin: 0 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  min-height: 0;
}

.analysis-tabs {
  height: 100%;
}

.analysis-tabs :deep(.el-tabs__content) {
  height: auto;
  overflow: visible;
}

.analysis-tabs :deep(.el-tab-pane) {
  height: auto;
  overflow-y: visible;
}

.analysis-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
  border-bottom: 2px solid #f0f2f5;
}

.analysis-tabs :deep(.el-tabs__nav) {
  border: none;
}

.analysis-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 16px 32px;
  border: 2px solid transparent;
  border-radius: 12px 12px 0 0;
  margin-right: 8px;
  background: rgba(248, 249, 250, 0.8);
  color: #606266;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.analysis-tabs :deep(.el-tabs__item.is-active) {
  background: rgba(255, 255, 255, 0.95);
  color: #409eff;
  border-color: #409eff;
  border-bottom-color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.analysis-tabs :deep(.el-tabs__item:hover) {
  background: rgba(236, 245, 255, 0.9);
  color: #409eff;
  backdrop-filter: blur(8px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .task-title {
    font-size: 24px;
  }
  
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .header-actions {
    flex-wrap: wrap;
    width: 100%;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .analysis-tabs :deep(.el-tabs__item) {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
