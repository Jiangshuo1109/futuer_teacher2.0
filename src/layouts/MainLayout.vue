<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- 系统标题 -->
      <div class="sidebar-header">
        <div class="logo">
          <img src="https://www.deepvrai.com/logo/logo-site.png" alt="Logo" class="logo-image" />
          <span v-show="!isCollapsed" class="logo-text">未来教师实习评估平台</span>
        </div>
        <el-button
          text
          @click="toggleSidebar"
          class="collapse-btn"
        >
          <el-icon>
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </el-button>
      </div>

      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
      >
        <!-- 首页 -->
        <el-menu-item index="/dashboard/home">
          <el-icon><House /></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <!-- 系统管理 -->
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/dashboard/system/role">
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/system/permission">
            <span>权限管理</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 组织管理 -->
        <el-sub-menu index="organization">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>组织管理</span>
          </template>
          <el-menu-item index="/dashboard/organization/campus">
            <span>校区管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/organization/college">
            <span>学院管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/organization/major">
            <span>专业管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/organization/class">
            <span>班级管理</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/organization/user">
            <span>用户管理</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 教学数据库 -->
        <el-sub-menu index="database">
          <template #title>
            <el-icon><DataBoard /></el-icon>
            <span>教学数据库</span>
          </template>
          <el-menu-item index="/dashboard/database/course">
            <span>课程库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/courseware">
            <span>课件库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/question">
            <span>题库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/semantic">
            <span>语义库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/special-event">
            <span>特殊事件库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/student-model">
            <span>学生模型库</span>
          </el-menu-item>

          <el-menu-item index="/dashboard/database/client-version">
            <span>客户端版本库</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/database/evaluation-system">
            <span>教学评价体系库</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 教学任务 -->
        <el-sub-menu index="teaching">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>教学任务</span>
          </template>
          <el-menu-item index="/dashboard/teaching/task-publish">
            <span>教学任务发布</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/teaching/my-tasks">
            <span>我的教学任务</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPageTitle">{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-actions">
          <!-- 通知 -->
          <el-badge :value="3" class="notification" @click="notificationPanelVisible = true">
            <el-button text>
              <el-icon :size="18"><Bell /></el-icon>
            </el-button>
          </el-badge>
          
          <!-- 用户信息 -->
          <el-dropdown @command="handleUserAction">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ username }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="content">
        <router-view />
      </div>
    </div>

    <!-- 通知面板 -->
    <NotificationPanel v-model:visible="notificationPanelVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  House,
  Setting,
  OfficeBuilding,
  DataBoard,
  Document,
  Bell,
  ArrowDown,
  SwitchButton,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import NotificationPanel from '@/components/NotificationPanel.vue'

const route = useRoute()
const router = useRouter()

const isCollapsed = ref(false)
const username = ref('')
const userAvatar = ref('')
const notificationPanelVisible = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前页面标题
const currentPageTitle = computed(() => {
  return route.meta?.title?.toString().split(' - ')[0] || ''
})

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 处理用户操作
const handleUserAction = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
        localStorage.removeItem('username')
        
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch {
        // 用户取消退出
      }
      break
  }
}

// 初始化用户信息
onMounted(() => {
  username.value = localStorage.getItem('username') || '用户'
  // 这里可以根据用户类型设置不同的头像
  const userType = localStorage.getItem('userType')
  userAvatar.value = userType === 'teacher' ? '/teacher-avatar.png' : '/student-avatar.png'
})
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e4e7ed;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.collapse-btn {
  padding: 8px;
  border-radius: 4px;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.breadcrumb {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100vh;
  }
  
  .sidebar.collapsed {
    left: -250px;
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>