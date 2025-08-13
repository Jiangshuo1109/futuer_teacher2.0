<template>
  <el-drawer
    v-model="drawerVisible"
    title="系统通知"
    direction="rtl"
    size="360px"
    @closed="onClose"
  >
    <div class="notification-panel">
      <div v-if="notifications.length === 0" class="empty-state">
        <el-icon><Bell /></el-icon>
        <p>暂无新的通知</p>
      </div>
      <div v-else>
        <div class="toolbar">
          <el-button type="primary" link @click="markAllAsRead">全部已读</el-button>
          <el-button type="primary" link @click="clearAll">清空通知</el-button>
        </div>
        <ul class="notification-list">
          <li
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="onNotificationClick(notification)"
          >
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            <div v-if="!notification.read" class="unread-dot"></div>
          </li>
        </ul>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const drawerVisible = ref(props.visible)

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: '新的教学任务',
    message: '《现代文阅读》课程有新的教学任务已发布，请及时查看。',
    time: '2小时前',
    read: false
  },
  {
    id: 2,
    title: '任务即将截止',
    message: '《古诗词鉴赏》课程的任务"诗词赏析报告"将于明天截止。',
    time: '1天前',
    read: false
  },
  {
    id: 3,
    title: '成绩已发布',
    message: '《作文指导》课程的"写作练习"成绩已发布，快去看看吧！',
    time: '3天前',
    read: true
  }
])

watch(() => props.visible, (newVal) => {
  drawerVisible.value = newVal
})

const onClose = () => {
  emit('update:visible', false)
}

const onNotificationClick = (notification: Notification) => {
  notification.read = true
  ElMessage.info(`查看通知: ${notification.title}`)
}

const markAllAsRead = () => {
  notifications.value.forEach(n => (n.read = true))
  ElMessage.success('所有通知已标记为已读')
}

const clearAll = () => {
  notifications.value = []
  ElMessage.success('所有通知已清空')
}
</script>

<style scoped>
.notification-panel {
  padding: 0 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.unread {
  font-weight: 600;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.notification-message {
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
  margin-left: 16px;
}
</style>