<template>
  <div class="ai-audio-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><Microphone /></el-icon>
            AI音频分析
          </h1>
          <p class="page-subtitle">基于人工智能的语音教学质量分析</p>
          <div class="audio-info">
            <el-tag type="info" size="large">学生：{{ studentName }}</el-tag>
            <el-tag type="primary" size="large">录音时长：{{ audioDuration }}</el-tag>
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
              <el-button type="primary" disabled class="nav-btn">
                <el-icon><Microphone /></el-icon>
                音频分析
              </el-button>
              <el-button @click="goToVideoAnalysis" class="nav-btn">
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
      <!-- 核心指标卡片 -->
      <div class="metrics-section">
        <div class="metrics-grid">
          <div class="metric-card glass-card" :class="{ active: activeMetric === 'mandarin' }" @click="setActiveMetric('mandarin')">
            <div class="metric-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">普通话</div>
              <div class="metric-value">{{ metrics.mandarin.value }}</div>
              <div class="metric-unit">{{ metrics.mandarin.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.mandarin.status)">
              {{ metrics.mandarin.status }}
            </div>
          </div>

          <div class="metric-card glass-card" :class="{ active: activeMetric === 'speed' }" @click="setActiveMetric('speed')">
            <div class="metric-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">语速</div>
              <div class="metric-value">{{ metrics.speed.value }}</div>
              <div class="metric-unit">{{ metrics.speed.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.speed.status)">
              {{ metrics.speed.status }}
            </div>
          </div>

          <div class="metric-card glass-card" :class="{ active: activeMetric === 'volume' }" @click="setActiveMetric('volume')">
            <div class="metric-icon">
              <el-icon><MagicStick /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">音量</div>
              <div class="metric-value">{{ metrics.volume.value }}</div>
              <div class="metric-unit">{{ metrics.volume.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.volume.status)">
              {{ metrics.volume.status }}
            </div>
          </div>

          <div class="metric-card glass-card" :class="{ active: activeMetric === 'keywords' }" @click="setActiveMetric('keywords')">
            <div class="metric-icon">
              <el-icon><Key /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">关键词</div>
              <div class="metric-value">{{ metrics.keywords.value }}</div>
              <div class="metric-unit">{{ metrics.keywords.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.keywords.status)">
              {{ metrics.keywords.status }}
            </div>
          </div>

          <div class="metric-card glass-card" :class="{ active: activeMetric === 'fillers' }" @click="setActiveMetric('fillers')">
            <div class="metric-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">口头禅</div>
              <div class="metric-value">{{ metrics.fillers.value }}</div>
              <div class="metric-unit">{{ metrics.fillers.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.fillers.status)">
              {{ metrics.fillers.status }}
            </div>
          </div>

          <div class="metric-card glass-card" :class="{ active: activeMetric === 'questions' }" @click="setActiveMetric('questions')">
            <div class="metric-icon">
              <el-icon><QuestionFilled /></el-icon>
            </div>
            <div class="metric-content">
              <div class="metric-title">提问</div>
              <div class="metric-value">{{ metrics.questions.value }}</div>
              <div class="metric-unit">{{ metrics.questions.unit }}</div>
            </div>
            <div class="metric-status" :class="getMetricStatusClass(metrics.questions.status)">
              {{ metrics.questions.status }}
            </div>
          </div>
        </div>
      </div>

      <!-- 图表分析区 -->
      <div class="chart-section">
        <div class="chart-card glass-card">
          <div class="card-header">
            <h3>{{ getChartTitle() }}</h3>
            <div class="chart-controls">
              <el-button-group>
                <el-button :type="timeRange === '5min' ? 'primary' : ''" @click="setTimeRange('5min')">近5分钟</el-button>
                <el-button :type="timeRange === '10min' ? 'primary' : ''" @click="setTimeRange('10min')">近10分钟</el-button>
                <el-button :type="timeRange === 'all' ? 'primary' : ''" @click="setTimeRange('all')">全部</el-button>
              </el-button-group>
            </div>
          </div>
          <div class="chart-container">
            <v-chart :option="chartOption" class="analysis-chart" @click="handleChartClick" />
          </div>
        </div>
      </div>

      <!-- 详细内容列表 -->
      <div class="details-section">
        <div class="details-card glass-card">
          <div class="card-header">
            <h3>{{ getDetailsTitle() }}</h3>
            <div class="details-summary">
              共找到 <span class="highlight">{{ currentDetails.length }}</span> 项内容
            </div>
          </div>
          <div class="details-list">
            <div 
              v-for="(item, index) in currentDetails" 
              :key="index"
              class="detail-item"
              :class="{ 'active': selectedDetailIndex === index }"
              @click="selectDetailItem(index)"
            >
              <div class="detail-header">
                <div class="detail-tags">
                  <el-tag 
                    v-for="tag in item.tags" 
                    :key="tag.text"
                    :type="tag.type"
                    size="small"
                    class="detail-tag"
                  >
                    {{ tag.text }}
                  </el-tag>
                </div>
                <div class="detail-time">
                  <el-icon><Clock /></el-icon>
                  {{ item.time }}
                </div>
              </div>
              <div class="detail-content">
                <p class="detail-text">{{ item.text }}</p>
                <div class="detail-actions">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click.stop="playAudioSegment(item)"
                    :loading="(item as any).isPlaying"
                  >
                    <el-icon><VideoPlay /></el-icon>
                    点击播放
                  </el-button>
                  <div class="detail-metrics" v-if="(item as any).metrics">
                    <span v-for="metric in (item as any).metrics" :key="metric.name" class="metric-chip">
                      {{ metric.name }}: {{ metric.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI语音分析报告 -->
      <div class="analysis-report-section">
        <div class="report-card glass-card">
          <div class="card-header">
            <h3>
              <el-icon class="header-icon"><Cpu /></el-icon>
              AI语音分析报告
            </h3>
            <div class="ai-badge">
              <el-icon><DataAnalysis /></el-icon>
              <span>智能分析</span>
            </div>
          </div>
          <div class="report-content">
            <div class="report-overview">
              <p class="report-summary">{{ aiAnalysisReport.summary }}</p>
            </div>
            <div class="report-dimensions">
              <div class="report-dimension" v-for="dimension in aiAnalysisReport.dimensions" :key="dimension.name">
                <h4 class="dimension-title">{{ dimension.name }}</h4>
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

    <!-- 音频播放器（隐藏） -->
    <audio ref="audioPlayer" @timeupdate="handleAudioTimeUpdate" @ended="handleAudioEnded"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, Download, Share, Microphone, ChatDotRound, Timer, MagicStick,
  Key, Warning, QuestionFilled, Clock, VideoPlay, Cpu, DataAnalysis, VideoCamera
} from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import { 
  TitleComponent, TooltipComponent, LegendComponent, 
  GridComponent, DataZoomComponent 
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
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  CanvasRenderer
])

// 接口定义
interface Metric {
  value: string | number
  unit: string
  status: string
}

interface MetricData {
  mandarin: Metric
  speed: Metric
  volume: Metric
  keywords: Metric
  fillers: Metric
  questions: Metric
}

interface DetailItem {
  time: string
  text: string
  tags: { text: string; type: string }[]
  metrics?: { name: string; value: string }[]
  audioStart?: number
  audioEnd?: number
  isPlaying?: boolean
  // 关键词相关
  keyword?: string
  // 口头禅相关
  filler?: string
  count?: number
  // 提问相关
  questionType?: string
}

interface AIAnalysisDimension {
  name: string
  analysis: string
  suggestions?: string[]
}

interface AIAnalysisReport {
  summary: string
  dimensions: AIAnalysisDimension[]
}

// 响应式数据
const route = useRoute()
const router = useRouter()
const audioPlayer = ref<HTMLAudioElement>()

// 从路由参数获取信息
const taskId = route.params.taskId as string
const studentId = route.params.studentId as string

// 基础数据
const studentName = ref('张明')
const audioDuration = ref('45:32')
const analysisTime = ref('2023-10-15 14:30')
const activeMetric = ref('mandarin')
const timeRange = ref('all')
const selectedDetailIndex = ref(-1)

// 核心指标数据
const metrics = ref<MetricData>({
  mandarin: { value: '良好', unit: '普通话', status: '良好' },
  speed: { value: 200, unit: '字/分钟', status: '适中' },
  volume: { value: 68, unit: 'dB', status: '适中' },
  keywords: { value: 7, unit: '个', status: '丰富' },
  fillers: { value: 5, unit: '个', status: '较少' },
  questions: { value: 24, unit: '个', status: '充分' }
})

// 生成图表数据
const generateChartData = (metric: string) => {
  const timeLabels = []
  const dataPoints = []
  
  // 根据不同指标生成数据
  switch (metric) {
    case 'keywords':
      // 基于实际关键词数据生成散点图数据
      return {
        timeLabels: ['00:00', '10:00', '20:00', '30:00', '40:00', '50:00'],
        scatterData: detailsData.keywords.map((item, index) => {
          const timeInMinutes = parseInt(item.time.split(':')[0]) + parseInt(item.time.split(':')[1]) / 60
          return [timeInMinutes, index + 1, item.keyword, item.text, item.time]
        })
      }
    
    case 'fillers':
      // 基于实际口头禅数据生成散点图数据
      return {
        timeLabels: ['00:00', '10:00', '20:00', '30:00', '40:00', '50:00'],
        scatterData: detailsData.fillers.map((item, _) => {
          const timeInMinutes = parseInt(item.time.split(':')[0]) + parseInt(item.time.split(':')[1]) / 60
          return [timeInMinutes, item.count, item.filler, item.text, item.time]
        })
      }
    
    case 'questions':
      // 基于实际提问数据生成散点图数据
      return {
        timeLabels: ['00:00', '10:00', '20:00', '30:00', '40:00', '50:00'],
        scatterData: detailsData.questions.map((item, index) => {
          const timeInMinutes = parseInt(item.time.split(':')[0]) + parseInt(item.time.split(':')[1]) / 60
          return [timeInMinutes, index + 1, item.questionType, item.text, item.time]
        })
      }
    
    case 'volume':
      // 基于实际音量数据生成折线图数据
      const volumeTimeLabels = detailsData.volume.map(item => item.time)
      const volumeDataPoints = detailsData.volume.map(item => parseInt(item.metrics?.[0]?.value.replace('dB', '') || '0'))
      return { timeLabels: volumeTimeLabels, dataPoints: volumeDataPoints }
    
    default:
      // 其他指标生成默认数据
      for (let i = 0; i <= 54; i += 6) {
        const minutes = Math.floor(i / 60)
        const seconds = i % 60
        timeLabels.push(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        
        switch (metric) {
          case 'speed':
            dataPoints.push(180 + Math.random() * 40)
            break
          case 'mandarin':
            dataPoints.push(80 + Math.random() * 20)
            break
          default:
            dataPoints.push(Math.random() * 100)
        }
      }
      return { timeLabels, dataPoints }
  }
}

// 图表配置
const chartOption = computed(() => {
  const chartData = generateChartData(activeMetric.value)
  
  // 根据不同指标配置不同的图表类型
  switch (activeMetric.value) {
    case 'keywords':
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#409eff',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          formatter: (params: any) => {
            const data = params.data
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">关键词: ${data[2]}</div>
                <div style="margin-bottom: 4px;">时间: ${data[4]}</div>
                <div style="color: #ccc; font-size: 12px;">${data[3]}</div>
              </div>
            `
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '时间(分钟)',
          min: 0,
          max: 55,
          axisLabel: {
            color: '#666',
            formatter: (value: number) => `${Math.floor(value)}:${String(Math.floor((value % 1) * 60)).padStart(2, '0')}`
          }
        },
        yAxis: {
          type: 'value',
          name: '关键词序号',
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: '关键词分布',
          type: 'scatter',
          data: chartData.scatterData,
          symbolSize: 15,
          itemStyle: {
            color: (params: any) => {
              const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585']
              return colors[params.dataIndex % colors.length]
            }
          }
        }]
      }
    
    case 'fillers':
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#e6a23c',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          formatter: (params: any) => {
            const data = params.data
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">口头禅: ${data[2]}</div>
                <div style="margin-bottom: 4px;">时间: ${data[4]}</div>
                <div style="margin-bottom: 4px;">出现次数: ${data[1]}次</div>
                <div style="color: #ccc; font-size: 12px;">${data[3]}</div>
              </div>
            `
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '时间(分钟)',
          min: 0,
          max: 55,
          axisLabel: {
            color: '#666',
            formatter: (value: number) => `${Math.floor(value)}:${String(Math.floor((value % 1) * 60)).padStart(2, '0')}`
          }
        },
        yAxis: {
          type: 'value',
          name: '出现次数',
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: '口头禅频率',
          type: 'scatter',
          data: chartData.scatterData,
          symbolSize: (data: number[]) => Math.max(data[1] / 2, 8),
          itemStyle: {
            color: '#e6a23c'
          }
        }]
      }
    
    case 'questions':
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#67c23a',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          formatter: (params: any) => {
            const data = params.data
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">提问类型: ${data[2]}</div>
                <div style="margin-bottom: 4px;">时间: ${data[4]}</div>
                <div style="color: #ccc; font-size: 12px; max-width: 300px; word-wrap: break-word;">${data[3]}</div>
              </div>
            `
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '时间(分钟)',
          min: 0,
          max: 55,
          axisLabel: {
            color: '#666',
            formatter: (value: number) => `${Math.floor(value)}:${String(Math.floor((value % 1) * 60)).padStart(2, '0')}`
          }
        },
        yAxis: {
          type: 'value',
          name: '提问序号',
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: '提问分布',
          type: 'scatter',
          data: chartData.scatterData,
          symbolSize: 18,
          itemStyle: {
            color: (params: any) => {
              const questionTypeColors = {
                '开放性问题': '#409eff',
                '理解性问题': '#67c23a',
                '分析性问题': '#e6a23c',
                '思辨性问题': '#f56c6c',
                '评价性问题': '#909399'
              }
              return questionTypeColors[params.data[2] as keyof typeof questionTypeColors] || '#409eff'
            }
          }
        }]
      }
    
    case 'volume':
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#409eff',
          borderWidth: 1,
          textStyle: { color: '#fff' },
          formatter: (params: any) => {
            const data = params[0]
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">音量: ${data.value}dB</div>
                <div style="margin-bottom: 4px;">时间: ${data.name}</div>
                <div style="color: #ccc; font-size: 12px;">点击查看详细内容</div>
              </div>
            `
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.timeLabels,
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          name: '音量(dB)',
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: '音量变化',
          type: 'line',
          data: chartData.dataPoints,
          smooth: true,
          lineStyle: {
            color: '#409eff',
            width: 3
          },
          itemStyle: {
            color: '#409eff',
            borderWidth: 2
          },
          symbolSize: 8,
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.1)'
          }
        }]
      }
    
    default:
      // 其他指标的默认配置
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#409eff',
          borderWidth: 1,
          textStyle: { color: '#fff' }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.timeLabels,
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666'
          }
        },
        series: [{
          name: getChartTitle(),
          type: 'line',
          data: chartData.dataPoints,
          smooth: true,
          lineStyle: {
            color: '#409eff',
            width: 2
          },
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.1)'
          }
        }]
      }
  }
})

// 详细内容数据
const detailsData = {
  mandarin: [
    {
      time: '02:15',
      text: '那么现在大家都已经很累了啊，今天要来讲新的内容。请大家准备好你们的课本。',
      tags: [{ text: '语速适中', type: 'success' }, { text: '42dB', type: 'info' }],
      audioStart: 135,
      audioEnd: 142
    },
    {
      time: '08:30',
      text: '学生需要准备各个话题并进行讨论。作业要求能够影响师地表达自己的观点，并能够根据同伴的发言进行应对和交流。',
      tags: [{ text: '语速', type: 'success' }, { text: '背景', type: 'info' }],
      audioStart: 510,
      audioEnd: 520
    }
  ],
  speed: [
    {
      time: '01:30',
      text: '今天我们学习新的课程内容，希望大家能够认真听讲...',
      tags: [{ text: '语速过快', type: 'warning' }],
      metrics: [{ name: '语速', value: '220字/分' }],
      audioStart: 90,
      audioEnd: 95
    }
  ],
  volume: [
    {
      time: '02:15',
      text: '那么现在大家都已经很累了啊，今天要来讲新的内容。请大家准备好你们的课本。',
      tags: [{ text: '音量', type: 'success' }, { text: '42dB', type: 'info' }],
      audioStart: 135,
      audioEnd: 142,
      metrics: [{ name: '音量', value: '42dB' }]
    },
    {
      time: '05:45',
      text: '请大家注意这个知识点，这是重点内容，希望同学们能够认真记录。',
      tags: [{ text: '音量', type: 'success' }, { text: '68dB', type: 'primary' }],
      audioStart: 345,
      audioEnd: 350,
      metrics: [{ name: '音量', value: '68dB' }]
    },
    {
      time: '12:00',
      text: '请大家注意这个知识点，这是重点内容...',
      tags: [{ text: '音量', type: 'success' }, { text: '78dB', type: 'warning' }],
      audioStart: 720,
      audioEnd: 725,
      metrics: [{ name: '音量', value: '78dB' }]
    },
    {
      time: '18:30',
      text: '现在我们来总结一下今天学习的主要内容。',
      tags: [{ text: '音量', type: 'success' }, { text: '65dB', type: 'info' }],
      audioStart: 1110,
      audioEnd: 1115,
      metrics: [{ name: '音量', value: '65dB' }]
    },
    {
      time: '24:15',
      text: '大家还有什么问题吗？可以举手提问。',
      tags: [{ text: '音量', type: 'success' }, { text: '70dB', type: 'primary' }],
      audioStart: 1455,
      audioEnd: 1460,
      metrics: [{ name: '音量', value: '70dB' }]
    }
  ],
  keywords: [
    {
      time: '02:30',
      text: '学习、理解、应用',
      tags: [{ text: '关键词', type: 'primary' }, { text: '李白', type: 'success' }],
      audioStart: 150,
      audioEnd: 155,
      keyword: '李白'
    },
    {
      time: '05:45',
      text: '诗仙、诗歌、艺术',
      tags: [{ text: '关键词', type: 'primary' }, { text: '诗仙', type: 'success' }],
      audioStart: 345,
      audioEnd: 350,
      keyword: '诗仙'
    },
    {
      time: '12:15',
      text: '这样、送别、古代',
      tags: [{ text: '关键词', type: 'primary' }, { text: '这样', type: 'info' }],
      audioStart: 735,
      audioEnd: 740,
      keyword: '这样'
    },
    {
      time: '18:20',
      text: '这个、古代、文学',
      tags: [{ text: '关键词', type: 'primary' }, { text: '这个', type: 'warning' }],
      audioStart: 1100,
      audioEnd: 1105,
      keyword: '这个'
    },
    {
      time: '25:10',
      text: '那个、情感、表达',
      tags: [{ text: '关键词', type: 'primary' }, { text: '那个', type: 'info' }],
      audioStart: 1510,
      audioEnd: 1515,
      keyword: '那个'
    },
    {
      time: '32:45',
      text: '断句、修辞、技巧',
      tags: [{ text: '关键词', type: 'primary' }, { text: '断句', type: 'success' }],
      audioStart: 1965,
      audioEnd: 1970,
      keyword: '断句'
    }
  ],
  fillers: [
    {
      time: '03:20',
      text: '然后，呃，我们继续，就是说，这个概念...',
      tags: [{ text: '口头禅', type: 'warning' }, { text: '然后', type: 'info' }],
      audioStart: 200,
      audioEnd: 205,
      filler: '然后',
      count: 32
    },
    {
      time: '08:15',
      text: '那么，嗯，大家都明白了吗，就是这样...',
      tags: [{ text: '口头禅', type: 'warning' }, { text: '嗯啊', type: 'warning' }],
      audioStart: 495,
      audioEnd: 500,
      filler: '嗯啊',
      count: 30
    },
    {
      time: '15:20',
      text: '这样，对吧，我们来看一下，就是...',
      tags: [{ text: '口头禅', type: 'warning' }, { text: '这样', type: 'info' }],
      audioStart: 920,
      audioEnd: 925,
      filler: '这样',
      count: 28
    },
    {
      time: '22:10',
      text: '这个，怎么说呢，就是那种感觉...',
      tags: [{ text: '口头禅', type: 'warning' }, { text: '这个', type: 'warning' }],
      audioStart: 1330,
      audioEnd: 1335,
      filler: '这个',
      count: 24
    },
    {
      time: '28:45',
      text: '那个，大家看一下，就是这样的...',
      tags: [{ text: '口头禅', type: 'warning' }, { text: '那个', type: 'info' }],
      audioStart: 1725,
      audioEnd: 1730,
      filler: '那个',
      count: 20
    }
  ],
  questions: [
    {
      time: '04:15',
      text: '在中国古代，为什么写月的诗特别多？什么情况？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '开放性', type: 'primary' }],
      audioStart: 255,
      audioEnd: 260,
      questionType: '开放性问题'
    },
    {
      time: '09:30',
      text: '"床前明月光"中的床，它的意思是什么？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '理解性', type: 'info' }],
      audioStart: 570,
      audioEnd: 575,
      questionType: '理解性问题'
    },
    {
      time: '14:20',
      text: '这诗被称为"妙绝古今"，它的妙就在么意味？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '分析性', type: 'warning' }],
      audioStart: 860,
      audioEnd: 865,
      questionType: '分析性问题'
    },
    {
      time: '20:10',
      text: '李白，被誉为诗仙，不出世的天才，天才是什么样的？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '思辨性', type: 'primary' }],
      audioStart: 1210,
      audioEnd: 1215,
      questionType: '思辨性问题'
    },
    {
      time: '26:45',
      text: '如果只看这四句节选，知道它写了什么事吗？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '理解性', type: 'info' }],
      audioStart: 1605,
      audioEnd: 1610,
      questionType: '理解性问题'
    },
    {
      time: '33:20',
      text: '它最大的艺术特色是比兴手法的运用，大家有没有异议？',
      tags: [{ text: '互动提问', type: 'success' }, { text: '评价性', type: 'success' }],
      audioStart: 2000,
      audioEnd: 2005,
      questionType: '评价性问题'
    }
  ]
}

// AI分析报告
const aiAnalysisReport = ref<AIAnalysisReport>({
  summary: '本次音频分析显示，教师整体语音表现良好。普通话发音标准，语速适中，音量控制得当。在课堂互动方面表现积极，提问频率合理。建议减少口头禅的使用，增强语言表达的流畅性。',
  dimensions: [
    {
      name: '普通话水平',
      analysis: '发音标准，语调自然，基本无明显方言影响。整体普通话水平达到二级甲等标准。',
      suggestions: ['继续保持标准发音', '注意语调的抑扬顿挫']
    },
    {
      name: '语速控制',
      analysis: '平均语速200字/分钟，符合教学要求。在重点内容讲解时能够适当放慢语速。',
      suggestions: ['保持当前语速节奏', '在难点处可以再慢一些']
    },
    {
      name: '音量控制',
      analysis: '音量适中，能够确保后排学生清楚听到。在强调重点时音量有所提高。',
      suggestions: ['继续保持音量控制', '可适当增加音量变化']
    },
    {
      name: '课堂互动',
      analysis: '提问频率合理，平均每2分钟一个问题。能够给学生充分的思考和回答时间。',
      suggestions: ['增加开放性问题', '鼓励学生主动提问']
    }
  ]
})

// 计算属性
const currentDetails = computed(() => {
  return detailsData[activeMetric.value as keyof typeof detailsData] || []
})

// 方法
const setActiveMetric = (metric: string) => {
  activeMetric.value = metric
  selectedDetailIndex.value = -1
}

const setTimeRange = (range: string) => {
  timeRange.value = range
}

const getMetricStatusClass = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '优秀': 'status-excellent',
    '良好': 'status-good',
    '适中': 'status-normal',
    '较少': 'status-good',
    '丰富': 'status-excellent',
    '充分': 'status-excellent'
  }
  return statusMap[status] || 'status-normal'
}

const getChartTitle = () => {
  const titles: { [key: string]: string } = {
    mandarin: '普通话水平变化趋势',
    speed: '语速变化趋势',
    volume: '音量变化趋势',
    keywords: '关键词分布图',
    fillers: '口头禅频率统计',
    questions: '提问时间分布'
  }
  return titles[activeMetric.value] || '数据分析'
}

const getDetailsTitle = () => {
  const titles: { [key: string]: string } = {
    mandarin: '普通话详细分析',
    speed: '语速详细分析',
    volume: '音量详细分析',
    keywords: '关键词详细分析',
    fillers: '口头禅详细分析',
    questions: '提问详细分析'
  }
  return titles[activeMetric.value] || '详细内容'
}

const selectDetailItem = (index: number) => {
  selectedDetailIndex.value = index
}

const handleChartClick = (params: any) => {
  const dataIndex = params.dataIndex
  
  // 根据不同的图表类型处理点击事件
  switch (activeMetric.value) {
    case 'volume':
      // 音量图表点击 - 直接根据dataIndex对应到详细列表
      if (dataIndex !== undefined && currentDetails.value[dataIndex]) {
        selectDetailItem(dataIndex)
        const detailElement = document.querySelector(`.detail-item:nth-child(${dataIndex + 1})`)
        if (detailElement) {
          detailElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        ElMessage.success(`跳转到时间点: ${currentDetails.value[dataIndex].time}`)
      }
      break
    
    case 'keywords':
    case 'fillers':
    case 'questions':
      // 散点图点击 - 根据点击的数据找到对应的详细项
      if (params.data && params.data[4]) {
        const clickedTime = params.data[4] // 时间信息在数组第5个位置
        const detailIndex = currentDetails.value.findIndex(item => item.time === clickedTime)
        if (detailIndex !== -1) {
          selectDetailItem(detailIndex)
          const detailElement = document.querySelector(`.detail-item:nth-child(${detailIndex + 1})`)
          if (detailElement) {
            detailElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          ElMessage.success(`跳转到时间点: ${clickedTime}`)
        }
      }
      break
    
    default:
      // 其他图表的默认处理
      if (dataIndex !== undefined && currentDetails.value[dataIndex]) {
        selectDetailItem(dataIndex)
        const detailElement = document.querySelector(`.detail-item:nth-child(${dataIndex + 1})`)
        if (detailElement) {
          detailElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      break
  }
}

const playAudioSegment = async (item: DetailItem) => {
  if (!audioPlayer.value) return
  
  try {
    (item as any).isPlaying = true
    // 这里应该加载真实的音频文件
    // audioPlayer.value.src = `audio-segments/${item.time}.mp3`
    // audioPlayer.value.currentTime = item.audioStart || 0
    // await audioPlayer.value.play()
    
    // 模拟播放
    await new Promise(resolve => setTimeout(resolve, 2000))
    ;(item as any).isPlaying = false
    ElMessage.success(`播放音频片段: ${item.time}`)
  } catch (error) {
    ;(item as any).isPlaying = false
    ElMessage.error('音频播放失败')
  }
}

const handleAudioTimeUpdate = () => {
  // 处理音频时间更新，同步图表指示器
}

const handleAudioEnded = () => {
  // 处理音频播放结束
  currentDetails.value.forEach(item => {
    (item as any).isPlaying = false
  })
}

const handleBack = () => {
  router.back()
}

const handleExport = () => {
  ElMessage.success('音频分析报告导出成功')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

// 页面跳转方法
const goToVideoAnalysis = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/video-analysis`)
}

const goToEvaluation = () => {
  router.push(`/dashboard/teaching/task/${taskId}/student/${studentId}/ai-evaluation`)
}

// 数据获取函数
const fetchAudioAnalysisData = async () => {
  try {
    console.log('获取音频分析数据', { taskId, studentId })
    // 这里应该调用API获取真实数据
    
    // 模拟数据获取
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据studentId更新学生姓名
    const studentNames = ['李明轩', '张雨涵', '陈思琪', '刘浩然', '王欣怡']
    const index = parseInt(studentId) % studentNames.length
    studentName.value = studentNames[index] || '未知学生'
    
    ElMessage.success('音频分析数据加载完成')
  } catch (error) {
    console.error('获取音频分析数据失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}

// 生命周期
onMounted(() => {
  console.log('AIAudioAnalysis页面挂载', { taskId, studentId })
  fetchAudioAnalysisData()
})

onUnmounted(() => {
  // 清理音频播放器
  if (audioPlayer.value) {
    audioPlayer.value.pause()
  }
})
</script>

<style scoped>
/* 全局样式 */
.ai-audio-analysis {
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

.audio-info {
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

/* 指标卡片 */
.metrics-section {
  margin-bottom: 30px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.metric-card {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.metric-card.active {
  border: 2px solid #409eff;
  transform: translateY(-2px);
}

.metric-card.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #67c23a);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 12px;
}

.metric-content {
  margin-bottom: 12px;
}

.metric-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 2px;
}

.metric-unit {
  font-size: 12px;
  color: #95a5a6;
}

.metric-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  text-align: center;
}

.status-excellent {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.status-good {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.status-normal {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

/* 图表区域 */
.chart-section {
  margin-bottom: 30px;
}

.chart-card {
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

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-container {
  height: 400px;
  margin-top: 16px;
}

.analysis-chart {
  width: 100%;
  height: 100%;
}

/* 详细内容区域 */
.details-section {
  margin-bottom: 30px;
}

.details-card {
  padding: 24px;
}

.details-summary {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.highlight {
  color: #409eff;
  font-weight: 600;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.detail-item {
  padding: 20px;
  background: rgba(64, 158, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(64, 158, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(64, 158, 255, 0.08);
  transform: translateX(4px);
}

.detail-item.active {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-tag {
  font-size: 12px;
}

.detail-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-text {
  line-height: 1.6;
  color: #5a6c7d;
  margin: 0;
  font-size: 14px;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-metrics {
  display: flex;
  gap: 12px;
}

.metric-chip {
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
  border-radius: 12px;
}

/* AI分析报告 */
.analysis-report-section {
  margin-bottom: 30px;
}

.report-card {
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

.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-overview {
  padding: 20px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #409eff;
}

.report-summary {
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

.report-dimension {
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
@media (max-width: 1400px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .report-dimensions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-audio-analysis {
    padding: 12px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
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
  
  .chart-container {
    height: 300px;
  }
  
  .glass-card {
    padding: 16px;
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

.metric-card:nth-child(1) { animation-delay: 0.1s; }
.metric-card:nth-child(2) { animation-delay: 0.2s; }
.metric-card:nth-child(3) { animation-delay: 0.3s; }
.metric-card:nth-child(4) { animation-delay: 0.4s; }
.metric-card:nth-child(5) { animation-delay: 0.5s; }
.metric-card:nth-child(6) { animation-delay: 0.6s; }
</style>