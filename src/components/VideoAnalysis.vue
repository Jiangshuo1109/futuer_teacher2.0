<template>
  <div class="video-analysis">
    <div class="placeholder-content">
      <div class="placeholder-icon">
        <el-icon><VideoCamera /></el-icon>
      </div>
      <h3>AI视频分析</h3>
      <p>视频分析功能正在开发中，敬请期待...</p>
      <div class="feature-preview">
        <div class="feature-item">
          <el-icon><User /></el-icon>
          <span>教学姿态分析</span>
        </div>
        <div class="feature-item">
          <el-icon><Star /></el-icon>
          <span>面部表情识别</span>
        </div>
        <div class="feature-item">
          <el-icon><Document /></el-icon>
          <span>板书分析</span>
        </div>
        <div class="feature-item">
          <el-icon><ChatDotRound /></el-icon>
          <span>课堂互动统计</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import {
  VideoCamera,
  User,
  Star,
  Document,
  ChatDotRound
} from '@element-plus/icons-vue'

// Props接口，保持与其他组件一致
interface TaskVideoData {
  postureStats: any
  expressionStats: any
  blackboardStats: any
  interactionStats: any
}

const props = defineProps<{
  taskId: string
  videoData: TaskVideoData
  loading: boolean
}>()
</script>

<style scoped>
.video-analysis {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.placeholder-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
}

.placeholder-icon {
  font-size: 80px;
  color: #409eff;
  margin-bottom: 24px;
}

.placeholder-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.placeholder-content p {
  font-size: 16px;
  color: #606266;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.feature-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #606266;
  font-size: 14px;
  transition: all 0.3s;
}

.feature-item:hover {
  background: #ecf5ff;
  color: #409eff;
  transform: translateY(-2px);
}

.feature-item .el-icon {
  font-size: 20px;
  color: #409eff;
}

@media (max-width: 768px) {
  .feature-preview {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .placeholder-icon {
    font-size: 60px;
  }
  
  .placeholder-content h3 {
    font-size: 20px;
  }
  
  .placeholder-content p {
    font-size: 14px;
  }
}
</style>
