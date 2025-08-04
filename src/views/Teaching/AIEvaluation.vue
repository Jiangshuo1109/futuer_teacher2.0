<template>
  <div class="ai-evaluation">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><Cpu /></el-icon>
            AI综合教学评价
          </h1>
          <p class="page-subtitle">基于人工智能的多维度教学质量分析</p>
          <div class="student-info">
            <el-tag type="info" size="large">学生：{{ studentName }}</el-tag>
            <el-tag type="primary" size="large">评价时间：{{ evaluationTime }}</el-tag>
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
              <el-button @click="goToVideoAnalysis" class="nav-btn">
                <el-icon><VideoCamera /></el-icon>
                视频分析
              </el-button>
              <el-button type="primary" disabled class="nav-btn">
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
      <!-- 顶部横向四个卡片 -->
      <div class="top-cards-section">
        <div class="top-cards-grid">
          <!-- 总得分卡片 -->
          <div class="top-card glass-card">
            <div class="card-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-title">总得分</div>
              <div class="card-value">{{ totalScore }}</div>
              <div class="card-unit">分</div>
            </div>
          </div>

          <!-- 综合评级卡片 -->
          <div class="top-card glass-card">
            <div class="card-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-title">综合评级</div>
              <div class="card-value">{{ getScoreLevelText(totalScore) }}</div>
              <div class="card-unit">等级</div>
            </div>
          </div>

          <!-- 班级排名卡片 -->
          <div class="top-card glass-card">
            <div class="card-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-title">班级排名</div>
              <div class="card-value">{{ classRanking }}</div>
              <div class="card-unit">名次</div>
            </div>
          </div>

          <!-- 超出平均分卡片 -->
          <div class="top-card glass-card">
            <div class="card-icon">
              <el-icon><ArrowUp /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-title">超出平均分</div>
              <div class="card-value">+{{ scoreComparison }}</div>
              <div class="card-unit">分</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合评价概览 -->
      <div class="overview-section">
        <div class="overview-card glass-card">
          <div class="card-header">
            <h3>综合评价概览</h3>
            <div class="header-subtitle">各维度得分雷达图分析</div>
          </div>
          <div class="overview-content">
            <!-- 雷达图 -->
            <div class="radar-container">
              <v-chart :option="radarChartOption" class="radar-chart" />
            </div>
            <!-- 维度得分列表 -->
            <div class="dimensions-list">
              <div class="dimension-item" v-for="item in teachingDimensions" :key="item.name">
                <div class="dimension-info">
                  <span class="dimension-name">{{ item.name }}</span>
                  <span class="dimension-score">{{ item.score }}分</span>
                </div>
                <div class="dimension-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: item.score + '%', background: getProgressGradient(item.score) }"
                    ></div>
                  </div>
                  <span class="progress-text">班级平均：{{ item.average }}分</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细评价分析 -->
      <div class="detailed-section">
        <div class="section-header">
          <h3>详细评价分析</h3>
          <div class="header-subtitle">六个维度详细评价</div>
        </div>
        <div class="detailed-grid">
          <div class="detailed-card glass-card" v-for="item in detailedEvaluation" :key="item.category">
            <div class="detailed-header">
              <h4 class="detailed-title">{{ item.category }}</h4>
              <div class="detailed-rating">
                <el-tag :type="getScoreType(item.score)" class="rating-badge">
                  {{ getScoreText(item.score) }}
                </el-tag>
              </div>
            </div>
            <p class="detailed-content">{{ item.content }}</p>
            <div class="detailed-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: item.score + '%', background: getProgressGradient(item.score) }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI智能分析报告 -->
      <div class="analysis-section">
        <div class="analysis-card glass-card">
          <div class="card-header">
            <h3>
              <el-icon class="header-icon"><Cpu /></el-icon>
              AI智能分析报告
            </h3>
            <div class="ai-badge">
              <el-icon><DataAnalysis /></el-icon>
              <span>智能分析</span>
            </div>
          </div>
          <div class="analysis-content">
            <div class="analysis-overview">
              <p class="analysis-summary">{{ aiAnalysisText }}</p>
            </div>
            <div class="analysis-dimensions">
              <div class="analysis-dimension" v-for="dimension in aiAnalysisDimensions" :key="dimension.name">
                <h4 class="dimension-title">{{ dimension.name }}</h4>
                <p class="dimension-analysis">{{ dimension.analysis }}</p>
                <div class="dimension-tags">
                  <el-tag 
                    v-for="tag in dimension.tags" 
                    :key="tag.text" 
                    :type="tag.type" 
                    size="small"
                    class="analysis-tag"
                  >
                    {{ tag.text }}
                  </el-tag>
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
  ArrowLeft, Download, TrendCharts, User, Clock, 
  Cpu, DataAnalysis, Lightbulb, Star, ArrowUp, ArrowDown, Minus, Share,
  Microphone, VideoCamera
} from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
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
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
])

// 接口定义
interface TeachingDimension {
  name: string
  score: number
  average: number
}

interface DetailedEvaluation {
  category: string
  content: string
  score: number
}

interface AIAnalysisDimension {
  name: string
  analysis: string
  tags: { text: string; type: string }[]
}

interface TimelineItem {
  time: string
  title: string
  description: string
  type: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'normal' | 'large'
  score?: number
  metrics?: {
    name: string
    value: string
    type: 'success' | 'warning' | 'danger' | 'info'
  }[]
}

// 响应式数据
const route = useRoute()
const router = useRouter()

// 从路由参数获取信息
const taskId = route.params.taskId as string
const studentId = route.params.studentId as string

// 基础数据
const studentName = ref('张明')
const evaluationTime = ref('2023-10-15')
const totalScore = ref(92)
const scoreComparison = ref(15)
const classRanking = ref('1/20')

// 教学维度数据
const teachingDimensions = ref<TeachingDimension[]>([
  { 
    name: '教学目标分析', 
    score: 92, 
    average: 80
  },
  { 
    name: '教学内容分析', 
    score: 88, 
    average: 75
  },
  { 
    name: '教学方法分析', 
    score: 95, 
    average: 85
  },
  { 
    name: '教学基本功分析', 
    score: 90, 
    average: 82
  },
  { 
    name: '教学效果分析', 
    score: 85, 
    average: 78
  },
  { 
    name: '课堂管理分析', 
    score: 91, 
    average: 81
  }
])

// AI分析文本
const aiAnalysisText = ref(
  '本报告提供了教学表现的综合分析，基于音频和视频数据。教师在清晰度和知识传递方面表现卓越，有效地向学生传达信息。参与度和互动性也很强，营造了积极的学习环境。评估方法适当，反馈机制完善。总体而言，教师表现值得称赞，在班级中排名靠前。建议进一步增强参与技巧并完善评估策略，以更好地满足学生的个性化需求。'
)

// AI分析维度数据
const aiAnalysisDimensions = ref<AIAnalysisDimension[]>([
  {
    name: '教学目标分析',
    analysis: '教学目标设定清晰明确，符合课程标准要求，能够体现知识、能力、情感态度价值观三维目标的有机统一。目标表述具体可测，符合学生认知水平。',
    tags: [
      { text: '目标明确', type: 'success' },
      { text: '符合标准', type: 'success' },
      { text: '三维统一', type: 'primary' }
    ]
  },
  {
    name: '教学内容分析',
    analysis: '教学内容选择恰当，重点突出，难点处理得当。内容组织逻辑清晰，层次分明，能够体现学科特点和知识结构。',
    tags: [
      { text: '重点突出', type: 'success' },
      { text: '逻辑清晰', type: 'success' },
      { text: '结构合理', type: 'primary' }
    ]
  },
  {
    name: '教学方法分析',
    analysis: '教学方法选择合理，能够灵活运用多种教学策略。注重启发式教学，能够调动学生积极性，体现学生主体地位。',
    tags: [
      { text: '策略多样', type: 'success' },
      { text: '启发引导', type: 'success' },
      { text: '学生主体', type: 'primary' }
    ]
  },
  {
    name: '教学基本功分析',
    analysis: '教学语言规范流畅，表达清晰准确。板书设计合理，字迹工整。教态自然大方，具有较强的亲和力和感染力。',
    tags: [
      { text: '语言流畅', type: 'success' },
      { text: '板书合理', type: 'success' },
      { text: '教态自然', type: 'primary' }
    ]
  },
  {
    name: '教学效果分析',
    analysis: '教学效果良好，学生参与度高，课堂气氛活跃。能够有效达成教学目标，学生学习兴趣浓厚，知识掌握情况良好。',
    tags: [
      { text: '参与度高', type: 'success' },
      { text: '目标达成', type: 'success' },
      { text: '兴趣浓厚', type: 'primary' }
    ]
  },
  {
    name: '课堂管理分析',
    analysis: '课堂管理有序，能够有效维持课堂纪律。师生关系和谐，能够及时处理课堂突发情况，营造良好的学习氛围。',
    tags: [
      { text: '秩序良好', type: 'success' },
      { text: '关系和谐', type: 'success' },
      { text: '氛围积极', type: 'primary' }
    ]
  }
])

// 详细评价数据
const detailedEvaluation = ref<DetailedEvaluation[]>([
  {
    category: '教学目标分析',
    content: '教学目标设定清晰明确，符合课程标准要求，能够体现知识、能力、情感态度价值观三维目标的有机统一。目标表述具体可测，符合学生认知水平。',
    score: 92
  },
  {
    category: '教学内容分析',
    content: '教学内容选择恰当，重点突出，难点处理得当。内容组织逻辑清晰，层次分明，能够体现学科特点和知识结构。',
    score: 88
  },
  {
    category: '教学方法分析',
    content: '教学方法选择合理，能够灵活运用多种教学策略。注重启发式教学，能够调动学生积极性，体现学生主体地位。',
    score: 95
  },
  {
    category: '教学基本功分析',
    content: '教学语言规范流畅，表达清晰准确。板书设计合理，字迹工整。教态自然大方，具有较强的亲和力和感染力。',
    score: 90
  },
  {
    category: '教学效果分析',
    content: '教学效果良好，学生参与度高，课堂气氛活跃。能够有效达成教学目标，学生学习兴趣浓厚，知识掌握情况良好。',
    score: 85
  },
  {
    category: '课堂管理分析',
    content: '课堂管理有序，能够有效维持课堂纪律。师生关系和谐，能够及时处理课堂突发情况，营造良好的学习氛围。',
    score: 91
  }
])



// ECharts雷达图配置
const radarChartOption = computed(() => ({
  title: {
    text: '',
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#409eff',
    borderWidth: 1,
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['个人表现', '班级平均'],
    bottom: 10,
    textStyle: {
      color: '#666'
    }
  },
  radar: {
    indicator: [
      { name: '教学目标分析', max: 100 },
      { name: '教学内容分析', max: 100 },
      { name: '教学方法分析', max: 100 },
      { name: '教学基本功分析', max: 100 },
      { name: '教学效果分析', max: 100 },
      { name: '课堂管理分析', max: 100 }
    ],
    center: ['50%', '50%'],
    radius: '65%',
    axisName: {
      color: '#666',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#e6e6e6'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(64, 158, 255, 0.05)', 'rgba(64, 158, 255, 0.1)']
      }
    }
  },
  series: [
    {
      name: '教学评价',
      type: 'radar',
      data: [
        {
          value: teachingDimensions.value.map(item => item.score),
          name: '个人表现',
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.3)'
          },
          lineStyle: {
            color: '#409eff',
            width: 2
          },
          itemStyle: {
            color: '#409eff'
          }
        },
        {
          value: teachingDimensions.value.map(item => item.average),
          name: '班级平均',
          areaStyle: {
            color: 'rgba(103, 194, 58, 0.2)'
          },
          lineStyle: {
            color: '#67c23a',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#67c23a'
          }
        }
      ]
    }
  ]
}))

// 工具方法
const getScoreLevel = (score: number): string => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const getScoreLevelText = (score: number): string => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  return '待提高'
}

const getScoreType = (score: number): string => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 70) return 'warning'
  return 'danger'
}

const getScoreGrade = (score: number): string => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  return 'D'
}

const getScoreText = (score: number): string => {
  if (score >= 90) return '优'
  if (score >= 80) return '良'
  if (score >= 70) return '中'
  return '差'
}

const getProgressGradient = (score: number): string => {
  if (score >= 90) return 'linear-gradient(90deg, #67c23a, #85ce61)'
  if (score >= 80) return 'linear-gradient(90deg, #409eff, #66b1ff)'
  if (score >= 70) return 'linear-gradient(90deg, #e6a23c, #ebb563)'
  return 'linear-gradient(90deg, #f56c6c, #f78989)'
}

const getTrendClass = (trend: string): string => {
  return `trend-${trend}`
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return ArrowUp
    case 'down': return ArrowDown
    default: return Minus
  }
}

const getTrendText = (trend: string): string => {
  switch (trend) {
    case 'up': return '上升'
    case 'down': return '下降'
    default: return '稳定'
  }
}

const getComparisonClass = (diff: number): string => {
  if (diff > 0) return 'comparison-positive'
  if (diff < 0) return 'comparison-negative'
  return 'comparison-neutral'
}

const getComparisonText = (diff: number): string => {
  if (diff > 0) return `+${diff.toFixed(1)}分`
  if (diff < 0) return `${diff.toFixed(1)}分`
  return '持平'
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleExport = () => {
  ElMessage.success('评价报告导出成功')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

// 页面跳转方法
const goToAudioAnalysis = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/audio-analysis`)
}

const goToVideoAnalysis = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/video-analysis`)
}

// 数据获取函数
const fetchEvaluationData = async () => {
  try {
    console.log('获取AI评价数据', { taskId, studentId })
    // 这里应该调用API获取真实数据
    // const response = await api.getAIEvaluation(taskId, studentId)
    
    // 模拟数据获取
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据studentId更新学生姓名
    const studentNames = ['张三', '李四', '王五', '赵六', '钱七']
    const index = parseInt(studentId) % studentNames.length
    studentName.value = studentNames[index] || '未知学生'
    
    console.log('AI评价数据获取成功', {
      studentName: studentName.value,
      totalScore: totalScore.value
    })
    
    ElMessage.success('AI评价数据加载完成')
  } catch (error) {
    console.error('获取AI评价数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}

// 生命周期
onMounted(() => {
  console.log('AIEvaluation页面挂载', { taskId, studentId })
  fetchEvaluationData()
})
</script>

<style scoped>
/* 全局样式 */
.ai-evaluation {
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

.student-info {
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

/* 顶部横向四个卡片 */
.top-cards-section {
  margin-bottom: 30px;
}

.top-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.top-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.top-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-icon {
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

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 4px;
}

.card-unit {
  font-size: 12px;
  color: #95a5a6;
}

/* 概览部分 */
.overview-grid {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 24px;
}

/* 综合得分卡片 */
.score-card {
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

.score-tag {
  font-weight: 600;
}

.score-display {
  text-align: center;
  margin-bottom: 24px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}

.score-suffix {
  font-size: 18px;
  color: #7f8c8d;
  margin-left: 4px;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
}

.detail-label {
  font-size: 14px;
  color: #7f8c8d;
}

.detail-value {
  font-weight: 600;
  font-size: 14px;
}

.rank-excellent {
  color: #67c23a;
}

.trend-up {
  color: #67c23a;
}

/* 雷达图卡片 */
.radar-card {
  padding: 24px;
}

.radar-legend {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.student {
  background: #409eff;
}

.legend-dot.average {
  background: #67c23a;
}

.radar-container {
  height: 350px;
  margin-top: 16px;
}

.radar-chart {
  width: 100%;
  height: 100%;
}

/* 综合评价概览 */
.overview-section {
  margin-bottom: 30px;
}

.overview-card {
  padding: 24px;
}

.overview-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.radar-container {
  height: 400px;
}

.radar-chart {
  width: 100%;
  height: 100%;
}

.dimensions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-item {
  padding: 16px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.dimension-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.dimension-name {
  font-weight: 600;
  color: #2c3e50;
}

.dimension-score {
  font-weight: 700;
  color: #409eff;
}

.dimension-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #7f8c8d;
  white-space: nowrap;
}

/* 分项得分卡片 */
.breakdown-card {
  padding: 24px;
}

.header-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  padding: 16px;
  background: rgba(64, 158, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  display: block;
  margin-bottom: 4px;
}

.item-description {
  font-size: 12px;
  color: #7f8c8d;
}

.item-score-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-score {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
}

.trend-icon {
  font-size: 16px;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.trend-stable {
  color: #e6a23c;
}

.item-progress {
  margin-bottom: 8px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
  min-width: 35px;
}

.comparison-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.comparison-text {
  color: #7f8c8d;
}

.comparison-positive {
  color: #67c23a;
  font-weight: 600;
}

.comparison-negative {
  color: #f56c6c;
  font-weight: 600;
}

.comparison-neutral {
  color: #e6a23c;
  font-weight: 600;
}

/* AI智能分析报告 */
.analysis-section {
  margin-bottom: 30px;
}

.analysis-card {
  padding: 24px;
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

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-overview {
  padding: 20px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #409eff;
}

.analysis-summary {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0;
  font-size: 15px;
}

.analysis-dimensions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.analysis-dimension {
  padding: 20px;
  background: rgba(103, 194, 58, 0.05);
  border-radius: 12px;
  border-left: 4px solid #67c23a;
}

.dimension-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.dimension-analysis {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.dimension-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.analysis-tag {
  font-size: 12px;
}

.analysis-text {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.analysis-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.analysis-description {
  flex: 1;
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0;
  font-size: 15px;
}

.analysis-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.highlight-item.strength {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.highlight-item.improvement {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

/* 详细评价分析 */
.detailed-section {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 0.3s ease;
}

.detailed-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.detailed-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}

.detailed-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.detailed-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .detailed-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .detailed-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
  
  .detailed-section {
    padding: 16px;
  }
}

.detailed-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.detailed-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.detailed-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 20px;
  font-weight: 700;
}

.score-value.excellent {
  color: #67c23a;
}

.score-value.good {
  color: #409eff;
}

.score-value.average {
  color: #e6a23c;
}

.score-value.poor {
  color: #f56c6c;
}

.score-label {
  font-size: 14px;
  color: #7f8c8d;
}

.detailed-rating {
  display: flex;
  align-items: center;
}

.rating-badge {
  font-weight: 600;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
}

.detailed-content {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0 0 16px 0;
  font-size: 14px;
}

.detailed-progress {
  margin-top: 12px;
}

.evaluation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.evaluation-item {
  padding: 20px;
  background: rgba(64, 158, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.1);
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.evaluation-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.evaluation-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.evaluation-text {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0 0 16px 0;
  font-size: 14px;
}

.evaluation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-badge {
  font-weight: 600;
}

.score-progress {
  flex: 1;
  margin-left: 16px;
}

/* 时间轴 */
.timeline-card {
  padding: 24px;
}

.timeline-content {
  margin-top: 16px;
}

.timeline-item-content {
  padding: 16px;
  background: rgba(64, 158, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.1);
}

.timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.timeline-description {
  color: #5a6c7d;
  line-height: 1.5;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.timeline-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-tag {
  font-size: 12px;
}

.timeline-score {
  display: flex;
  justify-content: flex-end;
}

.score-tag {
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .top-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .overview-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .evaluation-grid {
    grid-template-columns: 1fr;
  }
  
  .detailed-grid {
    grid-template-columns: 1fr;
  }
  
  .analysis-dimensions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-evaluation {
    padding: 12px;
  }
  
  .top-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .top-card {
    padding: 16px;
  }
  
  .card-value {
    font-size: 24px;
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
  
  .score-number {
    font-size: 36px;
  }
  
  .glass-card {
    padding: 16px;
  }
  
  .radar-container {
    height: 300px;
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

.breakdown-item:nth-child(1) { animation-delay: 0.1s; }
.breakdown-item:nth-child(2) { animation-delay: 0.2s; }
.breakdown-item:nth-child(3) { animation-delay: 0.3s; }
.breakdown-item:nth-child(4) { animation-delay: 0.4s; }
.breakdown-item:nth-child(5) { animation-delay: 0.5s; }
.breakdown-item:nth-child(6) { animation-delay: 0.6s; }
</style>