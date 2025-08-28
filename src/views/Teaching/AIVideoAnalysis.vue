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
            <el-tag type="primary" size="large"
              >视频时长：{{ videoDuration }}</el-tag
            >
            <el-tag type="success" size="large"
              >分析时间：{{ analysisTime }}</el-tag
            >
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
      <!-- 视频播放器区域 -->
      <div class="video-player-section">
        <div class="video-player-card glass-card">
          <div class="video-player-header">
            <h3>
              <el-icon class="video-icon"><VideoCamera /></el-icon>
              教学视频回放
            </h3>
            <div class="video-controls">
              <el-button-group size="small">
                <el-button
                  @click="togglePlay"
                  :type="isPlaying ? 'danger' : 'success'"
                >
                  <el-icon
                    ><VideoPlay v-if="!isPlaying" /><VideoPause v-else
                  /></el-icon>
                  {{ isPlaying ? "暂停" : "播放" }}
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
      </div>

      <!-- AI视频分析组件 -->
      <VideoAnalysis :video-data="videoAnalysisData" :loading="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ArrowLeft,
  Download,
  Share,
  VideoCamera,
  VideoPlay,
  VideoPause,
  FullScreen,
  Microphone,
} from "@element-plus/icons-vue";
import VideoAnalysis from "@/components/VideoAnalysis.vue";

// 响应式数据
const route = useRoute();
const router = useRouter();

// 从路由参数获取信息
const taskId = route.params.taskId as string;
const studentId = route.params.studentId as string;

// 基础数据
const studentName = ref("张明");
const videoDuration = ref("45:30");
const analysisTime = ref("2025-08-20 15:30");
const isPlaying = ref(false);
const videoProgress = ref(35);
const currentTime = ref("15:45");

// VideoAnalysis组件的数据
const videoAnalysisData = ref({
  taskId: "task_001",
  taskName: "小学数学课堂教学",
  postureStats: {
    stability: {
      excellent: 8,
      good: 5,
      average: 2,
      poor: 0,
    },
    gesture: {
      excellent: 6,
      good: 7,
      average: 2,
      poor: 0,
    },
  },
  expressionStats: {
    happy: 35.2,
    confident: 28.8,
    focused: 22.1,
    neutral: 10.5,
    concerned: 3.4,
  },
  blackboardStats: {
    clarity: {
      excellent: 9,
      good: 4,
      average: 2,
      poor: 0,
    },
    colorUsage: {
      single: 6,
      multiple: 9,
    },
  },
  interactionStats: {
    averageQuestions: 8.5,
    averageEyeContact: 75.3,
    averageResponses: 6.2,
    averageParticipation: 82.7,
  },
});

// 事件处理
const handleBack = () => {
  router.back();
};

const handleExport = () => {
  ElMessage.success("视频分析报告导出成功");
};

const handleShare = () => {
  ElMessage.success("分享链接已复制到剪贴板");
};

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  ElMessage.info(isPlaying.value ? "开始播放视频" : "视频已暂停");
};

const handleFullscreen = () => {
  ElMessage.info("进入全屏模式");
};

// 页面跳转方法
const goToAudioAnalysis = () => {
  router.push(
    `/dashboard/teaching/task/${taskId}/student/${studentId}/audio-analysis`,
  );
};

const goToEvaluation = () => {
  router.push(
    `/dashboard/teaching/task/${taskId}/student/${studentId}/ai-evaluation`,
  );
};

// 数据获取函数
const fetchVideoAnalysisData = async () => {
  try {
    console.log("获取视频分析数据", { taskId, studentId });
    // 模拟数据获取
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 根据studentId更新学生姓名
    const studentNames = ["李明轩", "张雨涵", "陈思琪", "刘浩然", "王欣怡"];
    const index = parseInt(studentId) % studentNames.length;
    studentName.value = studentNames[index] || "未知学生";

    ElMessage.success("视频分析数据加载完成");
  } catch (error) {
    console.error("获取视频分析数据失败:", error);
    ElMessage.error("数据加载失败，请稍后重试");
  }
};

// 生命周期
onMounted(() => {
  console.log("AIVideoAnalysis页面挂载", { taskId, studentId });
  fetchVideoAnalysisData();
});
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

/* 视频播放器区域 */
.video-player-section {
  margin-bottom: 24px;
}

.video-player-card {
  padding: 24px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-video-analysis {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .video-player-container {
    min-height: 250px;
  }

  .video-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
