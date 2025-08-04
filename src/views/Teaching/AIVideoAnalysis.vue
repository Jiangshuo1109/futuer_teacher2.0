<template>
  <div class="ai-video-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><VideoCamera /></el-icon>
            AI视频分析
          </h1>
          <p class="page-subtitle">基于人工智能的视频教学质量分析</p>
          <div class="video-info">
            <el-tag type="info" size="large">学生：{{ studentName }}</el-tag>
            <el-tag type="primary" size="large">视频时长：{{ videoDuration }}</el-tag>
            <el-tag type="success" size="large">分析时间：{{ analysisTime }}</el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="handleBack" class="action-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="analysis-nav">
            <el-button-group>
              <el-button @click="goToAudioAnalysis" class="nav-btn">
                <el-icon><Microphone /></el-icon>
                音频分析
              </el-button>
              <el-button type="primary" disabled class="nav-btn">
                <el-icon><VideoCamera /></el-icon>
                视频分析
              </el-button>
              <el-button @click="goToEvaluation" class="nav-btn">
                <el-icon><Cpu /></el-icon>
                综合评价
              </el-button>
            </el-button-group>
          </div>
          <div class="action-buttons">
            <el-button type="primary" @click="handleExport" class="action-btn">
              <el-icon><Download /></el-icon>
              导出报告
            </el-button>
            <el-button type="success" @click="handleShare" class="action-btn">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 视频播放器和分析面板 -->
      <div class="video-analysis-container">
        <div class="video-analysis-content glass-card">
          <div class="video-analysis-layout">
            <!-- 左侧：视频播放器 -->
            <div class="video-player-section">
              <div class="video-player-header">
                <h3>
                  <el-icon class="video-icon"><VideoCamera /></el-icon>
                  教学视频回放
                </h3>
                <div class="video-controls">
                  <el-button-group size="small">
                    <el-button @click="togglePlay" :type="isPlaying ? 'danger' : 'success'">
                      <el-icon><VideoPlay v-if="!isPlaying" /><VideoPause v-else /></el-icon>
                      {{ isPlaying ? '暂停' : '播放' }}
                    </el-button>
                    <el-button @click="handleFullscreen">
                      <el-icon><FullScreen /></el-icon>
                      全屏
                    </el-button>
                  </el-button-group>
                </div>
              </div>
              <div class="video-player-container">
                <div class="video-placeholder">
                  <el-icon class="placeholder-icon"><VideoCamera /></el-icon>
                  <p class="placeholder-text">教学视频演示</p>
                  <div class="video-progress">
                    <div class="progress-info">
                      <span>{{ currentTime }}</span>
                      <span>{{ videoDuration }}</span>
                    </div>
                    <el-slider v-model="videoProgress" :max="100" />
                  </div>
                </div>
              </div>
              <div class="video-meta">
                <div class="meta-item">
                  <span class="meta-label">分辨率：</span>
                  <span class="meta-value">1920x1080</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">帧率：</span>
                  <span class="meta-value">30fps</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">编码：</span>
                  <span class="meta-value">H.264</span>
                </div>
              </div>
            </div>

            <!-- 右侧：分析面板 -->
            <div class="analysis-panel-section">
              <el-tabs v-model="activeTab" class="analysis-tabs">
                <!-- 教学姿态 -->
                <el-tab-pane label="教学姿态" name="posture">
                  <div class="tab-content">
                    <div class="analysis-summary">
                      <div class="summary-score">
                        <span class="score-value">{{ analysisData.posture.score }}</span>
                        <span class="score-label">分</span>
                      </div>
                      <div class="summary-rating">
                        <el-rate v-model="analysisData.posture.rating" disabled />
                        <span class="rating-text">{{ getRatingText(analysisData.posture.rating) }}</span>
                      </div>
                    </div>
                    <div class="posture-metrics">
                      <div class="metric-item" v-for="metric in analysisData.posture.metrics" :key="metric.name">
                        <div class="metric-header">
                          <span class="metric-name">{{ metric.name }}</span>
                          <span class="metric-value">{{ metric.value }}%</span>
                        </div>
                        <el-progress :percentage="metric.value" :color="getProgressColor(metric.value)" />
                      </div>
                    </div>
                    <div class="chart-container">
                      <v-chart :option="postureChartOption" class="analysis-chart" />
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 面部表情 -->
                <el-tab-pane label="面部表情" name="expression">
                  <div class="tab-content">
                    <div class="analysis-summary">
                      <div class="summary-score">
                        <span class="score-value">{{ analysisData.expression.score }}</span>
                        <span class="score-label">分</span>
                      </div>
                      <div class="summary-rating">
                        <el-rate v-model="analysisData.expression.rating" disabled />
                        <span class="rating-text">{{ getRatingText(analysisData.expression.rating) }}</span>
                      </div>
                    </div>
                    <div class="expression-distribution">
                      <div class="expression-item" v-for="expr in analysisData.expression.distribution" :key="expr.type">
                        <div class="expression-info">
                          <div class="expression-icon" :class="expr.type">
                            <el-icon><component :is="getExpressionIcon(expr.type)" /></el-icon>
                          </div>
                          <div class="expression-details">
                            <span class="expression-name">{{ expr.name }}</span>
                            <span class="expression-percentage">{{ expr.percentage }}%</span>
                          </div>
                        </div>
                        <div class="expression-bar">
                          <div class="expression-fill" :class="expr.type" :style="{ width: expr.percentage + '%' }"></div>
                        </div>
                      </div>
                    </div>
                    <div class="chart-container">
                      <v-chart :option="expressionChartOption" class="analysis-chart" />
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 板书分析 -->
                <el-tab-pane label="板书分析" name="blackboard">
                  <div class="tab-content">
                    <div class="analysis-summary">
                      <div class="summary-score">
                        <span class="score-value">{{ analysisData.blackboard.score }}</span>
                        <span class="score-label">分</span>
                      </div>
                      <div class="summary-rating">
                        <el-rate v-model="analysisData.blackboard.rating" disabled />
                        <span class="rating-text">{{ getRatingText(analysisData.blackboard.rating) }}</span>
                      </div>
                    </div>
                    <div class="blackboard-carousel">
                      <el-carousel :interval="4000" height="200px">
                        <el-carousel-item v-for="(screenshot, index) in blackboardScreenshots" :key="index">
                          <div class="screenshot-container">
                            <div class="screenshot-placeholder">
                              <el-icon class="screenshot-icon"><PictureRounded /></el-icon>
                              <p>板书截图 {{ index + 1 }}</p>
                              <span class="screenshot-time">{{ screenshot.time }}</span>
                            </div>
                          </div>
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                    <div class="blackboard-metrics">
                      <div class="metrics-grid">
                        <div class="metric-card" v-for="metric in analysisData.blackboard.metrics" :key="metric.name">
                          <div class="metric-icon">
                            <el-icon><EditPen /></el-icon>
                          </div>
                          <div class="metric-content">
                            <div class="metric-name">{{ metric.name }}</div>
                            <div class="metric-value">{{ metric.value }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 课堂互动 -->
                <el-tab-pane label="课堂互动" name="interaction">
                  <div class="tab-content">
                    <div class="analysis-summary">
                      <div class="summary-score">
                        <span class="score-value">{{ analysisData.interaction.score }}</span>
                        <span class="score-label">分</span>
                      </div>
                      <div class="summary-rating">
                        <el-rate v-model="analysisData.interaction.rating" disabled />
                        <span class="rating-text">{{ getRatingText(analysisData.interaction.rating) }}</span>
                      </div>
                    </div>
                    <div class="interaction-stats">
                      <div class="stats-grid">
                        <div class="stat-item" v-for="stat in analysisData.interaction.stats" :key="stat.name">
                          <div class="stat-icon">
                            <el-icon><component :is="stat.icon" /></el-icon>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ stat.value }}</div>
                            <div class="stat-name">{{ stat.name }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="chart-container">
                      <v-chart :option="interactionChartOption" class="analysis-chart" />
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>

      <!-- AI综合视频分析报告 -->
      <div class="ai-report-section">
        <div class="ai-report-card glass-card">
          <div class="card-header">
            <h3>
              <el-icon class="header-icon"><Cpu /></el-icon>
              AI综合视频分析报告
            </h3>
            <div class="ai-badge">
              <el-icon><DataAnalysis /></el-icon>
              <span>智能分析</span>
            </div>
          </div>
          <div class="report-content">
            <div class="report-overview">
              <div class="overall-score">
                <span class="score-number">{{ overallScore }}</span>
                <span class="score-text">综合得分</span>
              </div>
              <div class="report-summary">
                <p>{{ aiReportSummary }}</p>
              </div>
            </div>
            <div class="report-dimensions">
              <div class="dimension-card" v-for="dimension in aiReportDimensions" :key="dimension.name">
                <div class="dimension-header">
                  <h4 class="dimension-title">{{ dimension.name }}</h4>
                  <span class="dimension-score">{{ dimension.score }}分</span>
                </div>
                <p class="dimension-analysis">{{ dimension.analysis }}</p>
                <div class="dimension-suggestions" v-if="dimension.suggestions">
                  <h5>改进建议：</h5>
                  <ul>
                    <li v-for="suggestion in dimension.suggestions" :key="suggestion">{{ suggestion }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, Download, Share, VideoCamera, VideoPlay, VideoPause, FullScreen,
  EditPen, PictureRounded, Cpu, DataAnalysis, Sunny, User, ChatDotRound,
  QuestionFilled, View, Trophy, Microphone
} from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { 
  TitleComponent, TooltipComponent, LegendComponent, 
  GridComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

// 注册组件
defineOptions({
  components: {
    VChart
  }
})

// 注册ECharts组件
use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])

// 接口定义
interface AnalysisData {
  posture: {
    score: number
    rating: number
    metrics: { name: string; value: number }[]
  }
  expression: {
    score: number
    rating: number
    distribution: { type: string; name: string; percentage: number }[]
  }
  blackboard: {
    score: number
    rating: number
    metrics: { name: string; value: string }[]
  }
  interaction: {
    score: number
    rating: number
    stats: { name: string; value: string; icon: any }[]
  }
}

// 响应式数据
const route = useRoute()
const router = useRouter()

// 从路由参数获取信息
const taskId = route.params.taskId as string
const studentId = route.params.studentId as string

// 基础数据
const studentName = ref('张明')
const videoDuration = ref('45:30')
const analysisTime = ref('2023-10-15 15:30')
const activeTab = ref('posture')
const isPlaying = ref(false)
const videoProgress = ref(35)
const currentTime = ref('15:45')
const overallScore = ref(88)

// 板书截图数据
const blackboardScreenshots = ref([
  { time: '05:15', url: '' },
  { time: '12:30', url: '' },
  { time: '18:45', url: '' },
  { time: '25:20', url: '' },
  { time: '32:10', url: '' }
])

// 分析数据
const analysisData = ref<AnalysisData>({
  posture: {
    score: 85,
    rating: 4,
    metrics: [
      { name: '站姿稳定性', value: 88 },
      { name: '手势自然度', value: 82 },
      { name: '身体朝向', value: 90 },
      { name: '移动合理性', value: 78 }
    ]
  },
  expression: {
    score: 90,
    rating: 5,
    distribution: [
      { type: 'happy', name: '愉悦', percentage: 45 },
      { type: 'confident', name: '自信', percentage: 30 },
      { type: 'focused', name: '专注', percentage: 15 },
      { type: 'neutral', name: '平静', percentage: 8 },
      { type: 'concerned', name: '担忧', percentage: 2 }
    ]
  },
  blackboard: {
    score: 82,
    rating: 4,
    metrics: [
      { name: '规范字', value: '95%' },
      { name: '行间距', value: '合理' },
      { name: '色彩数', value: '3种' },
      { name: '行水平', value: '良好' }
    ]
  },
  interaction: {
    score: 87,
    rating: 4,
    stats: [
      { name: '提问次数', value: '12', icon: QuestionFilled },
      { name: '眼神交流', value: '85%', icon: View },
      { name: '学生回应', value: '18', icon: ChatDotRound },
      { name: '参与度', value: '92%', icon: Trophy }
    ]
  }
})

// AI分析报告
const aiReportSummary = ref('通过AI视频分析，该教师在教学过程中表现出良好的专业素养。姿态稳定自然，手势运用恰当，能够有效地与学生进行眼神交流。表情丰富，以积极正面的情绪为主，有助于营造良好的课堂氛围。板书清晰工整，布局合理。课堂互动频率适中，能够及时回应学生的问题和反馈。整体教学效果良好。')

const aiReportDimensions = ref([
  {
    name: '教学姿态',
    score: 85,
    analysis: '教师姿态稳定自然，手势运用恰当，身体朝向合理，能够有效传达教学内容。',
    suggestions: ['建议增加更多的肢体语言变化', '可以适当走动以增强互动效果']
  },
  {
    name: '面部表情',
    score: 90,
    analysis: '表情丰富自然，以积极正面为主，能够有效吸引学生注意力，营造良好的学习氛围。',
    suggestions: ['保持现有的表情状态', '在重点内容时可以更加生动']
  },
  {
    name: '板书质量',
    score: 82,
    analysis: '板书清晰工整，布局合理，字迹规范，有助于学生理解和记录。',
    suggestions: ['可以增加更多的图表和示例', '建议使用不同颜色区分重点']
  },
  {
    name: '课堂互动',
    score: 87,
    analysis: '互动频率适中，能够及时回应学生问题，眼神交流充分，学生参与度高。',
    suggestions: ['可以增加开放性问题', '鼓励更多学生主动参与']
  }
])

// 图表配置
const postureChartOption = computed(() => ({
  title: {
    text: '姿态评分趋势',
    left: 'center',
    textStyle: { fontSize: 14 }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textStyle: { color: '#fff' }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '25%'
  },
  xAxis: {
    type: 'category',
    data: ['0min', '10min', '20min', '30min', '40min']
  },
  yAxis: {
    type: 'value',
    min: 70,
    max: 100
  },
  series: [{
    name: '姿态评分',
    type: 'line',
    data: [85, 88, 82, 90, 86],
    smooth: true,
    lineStyle: { color: '#409eff', width: 3 },
    itemStyle: { color: '#409eff' },
    areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
  }]
}))

const expressionChartOption = computed(() => ({
  title: {
    text: '表情分布',
    left: 'center',
    textStyle: { fontSize: 14 }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}% ({d}%)'
  },
  series: [{
    name: '表情分布',
    type: 'pie',
    radius: '60%',
    data: analysisData.value.expression.distribution.map(item => ({
      value: item.percentage,
      name: item.name,
      itemStyle: { color: getExpressionColor(item.type) }
    }))
  }]
}))

const interactionChartOption = computed(() => ({
  title: {
    text: '互动频率',
    left: 'center',
    textStyle: { fontSize: 14 }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '25%'
  },
  xAxis: {
    type: 'category',
    data: ['0-10min', '10-20min', '20-30min', '30-40min']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '互动次数',
    type: 'bar',
    data: [3, 4, 2, 3],
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#67c23a' },
          { offset: 1, color: '#85ce61' }
        ]
      }
    }
  }]
}))

// 工具方法
const getRatingText = (rating: number): string => {
  const texts = ['', '待提高', '一般', '良好', '优秀', '卓越']
  return texts[rating] || '未评级'
}

const getProgressColor = (percentage: number): string => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 80) return '#409eff'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getExpressionIcon = (type: string) => {
  const iconMap: { [key: string]: any } = {
    'happy': Sunny,
    'confident': Trophy,
    'focused': User,
    'neutral': User,
    'concerned': User
  }
  return iconMap[type] || Sunny
}

const getExpressionColor = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    'happy': '#67c23a',
    'confident': '#409eff',
    'focused': '#e6a23c',
    'neutral': '#909399',
    'concerned': '#f56c6c'
  }
  return colorMap[type] || '#409eff'
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleExport = () => {
  ElMessage.success('视频分析报告导出成功')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  ElMessage.info(isPlaying.value ? '开始播放视频' : '视频已暂停')
}

const handleFullscreen = () => {
  ElMessage.info('进入全屏模式')
}

// 页面跳转方法
const goToAudioAnalysis = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/audio-analysis`)
}

const goToEvaluation = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/ai-evaluation`)
}

// 数据获取函数
const fetchVideoAnalysisData = async () => {
  try {
    console.log('获取视频分析数据', { taskId, studentId })
    // 模拟数据获取
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据studentId更新学生姓名
    const studentNames = ['张三', '李四', '王五', '赵六', '钱七']
    const index = parseInt(studentId) % studentNames.length
    studentName.value = studentNames[index] || '未知学生'
    
    ElMessage.success('视频分析数据加载完成')
  } catch (error) {
    console.error('获取视频分析数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}

// 生命周期
onMounted(() => {
  console.log('AIVideoAnalysis页面挂载', { taskId, studentId })
  fetchVideoAnalysisData()
})
</script>

<style scoped>
/* 全局样式 */
.ai-video-analysis {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 玻璃态效果 */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 页面头部 */
.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #409eff;
  font-size: 32px;
}

.page-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 16px 0;
}

.video-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.analysis-nav {
  display: flex;
  align-items: center;
}

.nav-btn {
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
}

/* 主要内容 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 视频分析容器 */
.video-analysis-container {
  margin-bottom: 30px;
}

.video-analysis-content {
  padding: 24px;
}

.video-analysis-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  min-height: 600px;
}

/* 视频播放器区域 */
.video-player-section {
  display: flex;
  flex-direction: column;
}

.video-player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.video-player-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-icon {
  color: #409eff;
}

.video-player-container {
  flex: 1;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  min-height: 400px;
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 20px;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.video-progress {
  width: 100%;
  max-width: 300px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.video-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #5a6c7d;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.meta-label {
  font-weight: 600;
}

/* 分析面板区域 */
.analysis-panel-section {
  display: flex;
  flex-direction: column;
}

.analysis-tabs {
  height: 100%;
}

.tab-content {
  padding: 16px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 12px;
}

.summary-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
}

.score-label {
  font-size: 16px;
  color: #7f8c8d;
}

.summary-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

/* 姿态指标 */
.posture-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

/* 表情分析 */
.expression-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expression-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expression-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expression-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.expression-icon.happy { background: #67c23a; }
.expression-icon.confident { background: #409eff; }
.expression-icon.focused { background: #e6a23c; }
.expression-icon.neutral { background: #909399; }
.expression-icon.concerned { background: #f56c6c; }

.expression-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expression-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.expression-percentage {
  font-size: 14px;
  color: #7f8c8d;
}

.expression-bar {
  height: 6px;
  background: #f5f7fa;
  border-radius: 3px;
  overflow: hidden;
}

.expression-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.expression-fill.happy { background: #67c23a; }
.expression-fill.confident { background: #409eff; }
.expression-fill.focused { background: #e6a23c; }
.expression-fill.neutral { background: #909399; }
.expression-fill.concerned { background: #f56c6c; }

/* 板书分析 */
.blackboard-carousel {
  margin-bottom: 20px;
}

.screenshot-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-placeholder {
  text-align: center;
  color: #7f8c8d;
}

.screenshot-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.screenshot-time {
  font-size: 12px;
  color: #409eff;
}

.blackboard-metrics {
  margin-top: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
}

.metric-card .metric-icon {
  width: 32px;
  height: 32px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-card .metric-content {
  flex: 1;
}

.metric-card .metric-name {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 2px;
}

.metric-card .metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

/* 课堂互动 */
.interaction-stats {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(103, 194, 58, 0.05);
  border-radius: 8px;
}

.stat-item .stat-icon {
  width: 32px;
  height: 32px;
  background: #67c23a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-item .stat-content {
  flex: 1;
}

.stat-item .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #67c23a;
  margin-bottom: 2px;
}

.stat-item .stat-name {
  font-size: 12px;
  color: #7f8c8d;
}

/* 图表容器 */
.chart-container {
  height: 250px;
  flex: 1;
}

.analysis-chart {
  width: 100%;
  height: 100%;
}

/* AI分析报告 */
.ai-report-section {
  margin-bottom: 30px;
}

.ai-report-card {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: #409eff;
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-overview {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #409eff;
}

.overall-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}

.score-text {
  font-size: 14px;
  color: #7f8c8d;
}

.report-summary {
  flex: 1;
}

.report-summary p {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0;
  font-size: 15px;
}

.report-dimensions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.dimension-card {
  padding: 20px;
  background: rgba(103, 194, 58, 0.05);
  border-radius: 12px;
  border-left: 4px solid #67c23a;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dimension-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.dimension-score {
  font-size: 16px;
  font-weight: 700;
  color: #67c23a;
}

.dimension-analysis {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.dimension-suggestions h5 {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.dimension-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.dimension-suggestions li {
  line-height: 1.5;
  color: #5a6c7d;
  font-size: 14px;
  margin-bottom: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .video-analysis-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .report-dimensions {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-video-analysis {
    padding: 12px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: flex-end;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .video-player-container {
    min-height: 250px;
  }
  
  .glass-card {
    padding: 16px;
  }
  
  .report-overview {
    flex-direction: column;
    text-align: center;
  }
  
  .video-meta {
    flex-direction: column;
    gap: 8px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>