<template>
  <div class="main-layout">
    <!-- 背景粒子动画 -->
    <div class="particles" ref="particlesRef" />

    <!-- 背景装饰 -->
    <div class="layout-bg">
      <div class="gradient-orb gradient-orb--1" />
      <div class="gradient-orb gradient-orb--2" />
      <div class="gradient-orb gradient-orb--3" />
    </div>

    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- 系统标题 -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">🎓</div>
          <div v-show="!isCollapsed" class="logo-text">
            <div class="logo-title">
              <span class="text-gradient">未来教师</span>
            </div>
            <div class="logo-subtitle">智能分析平台</div>
          </div>
        </div>
        <el-button text @click="toggleSidebar" class="collapse-btn">
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
            <el-breadcrumb-item :to="{ path: '/dashboard/home' }">
              <span class="breadcrumb-item">首页</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPageTitle">
              <span class="breadcrumb-item">{{ currentPageTitle }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-actions">
          <!-- 通知 -->
          <div
            class="notification-wrapper"
            @click="notificationPanelVisible = true"
          >
            <el-badge :value="3" class="notification-badge">
              <div class="notification-btn">
                <el-icon :size="18"><Bell /></el-icon>
              </div>
            </el-badge>
          </div>

          <!-- 用户信息 -->
          <el-dropdown @command="handleUserAction">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ username }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
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
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
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
  Expand,
} from "@element-plus/icons-vue";
import NotificationPanel from "@/components/NotificationPanel.vue";

const route = useRoute();
const router = useRouter();
const particlesRef = ref<HTMLElement>();

const isCollapsed = ref(false);
const username = ref("");
const userAvatar = ref("");
const notificationPanelVisible = ref(false);

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 当前页面标题
const currentPageTitle = computed(() => {
  return route.meta?.title?.toString().split(" - ")[0] || "";
});

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 处理用户操作
const handleUserAction = async (command: string) => {
  switch (command) {
    case "profile":
      ElMessage.info("个人中心功能开发中");
      break;
    case "settings":
      ElMessage.info("系统设置功能开发中");
      break;
    case "logout":
      try {
        await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 清除本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        localStorage.removeItem("username");

        ElMessage.success("退出登录成功");
        router.push("/login");
      } catch {
        // 用户取消退出
      }
      break;
  }
};

// 粒子动画初始化
const initParticles = () => {
  if (!particlesRef.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1";

  particlesRef.value.appendChild(canvas);

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }> = [];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  };

  animate();
};

// 初始化用户信息
onMounted(async () => {
  username.value = localStorage.getItem("username") || "用户";
  // 这里可以根据用户类型设置不同的头像
  const userType = localStorage.getItem("userType");
  userAvatar.value =
    userType === "teacher" ? "/teacher-avatar.png" : "/student-avatar.png";

  await nextTick();
  initParticles();
});
</script>

<style scoped>
/* 全局重置与基础样式 */
.main-layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #0f172a 50%, #111827 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

/* 粒子背景 */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 背景装饰 */
.layout-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      800px 400px at 20% 30%,
      rgba(59, 130, 246, 0.08),
      transparent
    ),
    radial-gradient(
      600px 300px at 80% 70%,
      rgba(16, 185, 129, 0.08),
      transparent
    ),
    radial-gradient(
      900px 500px at 50% 50%,
      rgba(6, 182, 212, 0.05),
      transparent
    );
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 8s ease-in-out infinite;
}

.gradient-orb--1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.15),
    rgba(147, 51, 234, 0.15)
  );
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.gradient-orb--2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(
    45deg,
    rgba(16, 185, 129, 0.12),
    rgba(6, 182, 212, 0.12)
  );
  top: 60%;
  right: 10%;
  animation-delay: 3s;
}

.gradient-orb--3 {
  width: 180px;
  height: 180px;
  background: linear-gradient(
    45deg,
    rgba(168, 85, 247, 0.1),
    rgba(236, 72, 153, 0.1)
  );
  bottom: 20%;
  left: 40%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

/* 渐变文字效果 */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 侧边栏样式 */
.sidebar {
  width: 250px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.sidebar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(16, 185, 129, 0.03) 100%
  );
  pointer-events: none;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
  overflow: hidden;
}

.logo-icon::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
  overflow: hidden;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.logo-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  line-height: 1;
}

.collapse-btn {
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #3b82f6;
  transform: scale(1.05);
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 80px);
  overflow-y: auto;
  background: transparent;
  position: relative;
  z-index: 1;
}

/* 菜单项样式重写 */
:deep(.el-menu) {
  background: transparent !important;
  border: none !important;
}

:deep(.el-menu-item) {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border-radius: 8px !important;
  margin: 4px 8px !important;
  transition: all 0.3s ease !important;
}

:deep(.el-menu-item:hover) {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
  transform: translateX(4px) !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2),
    rgba(16, 185, 129, 0.1)
  ) !important;
  color: #ffffff !important;
  border-left: 3px solid #3b82f6 !important;
}

:deep(.el-sub-menu__title) {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border-radius: 8px !important;
  margin: 4px 8px !important;
  transition: all 0.3s ease !important;
}

:deep(.el-sub-menu__title:hover) {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
}

:deep(.el-sub-menu .el-menu) {
  background: rgba(0, 0, 0, 0.1) !important;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 40px !important;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 5;
}

.header {
  height: 80px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
}

.header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.02),
    rgba(16, 185, 129, 0.02)
  );
  pointer-events: none;
}

.breadcrumb {
  flex: 1;
  position: relative;
  z-index: 1;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #3b82f6;
}

:deep(.el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.4) !important;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.notification-wrapper {
  cursor: pointer;
  position: relative;
}

.notification-badge {
  transition: transform 0.3s ease;
}

.notification-badge:hover {
  transform: scale(1.05);
}

:deep(.notification-badge .el-badge__content) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border: 2px solid rgba(10, 14, 39, 0.8) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4) !important;
  backdrop-filter: blur(10px) !important;
  min-width: 18px !important;
  height: 18px !important;
  line-height: 14px !important;
}

.notification-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.notification-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: translateY(-1px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  border: 2px solid rgba(59, 130, 246, 0.3);
  transition: border-color 0.3s ease;
}

.user-info:hover .user-avatar {
  border-color: #3b82f6;
}

.username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

:deep(.user-dropdown) {
  background: rgba(10, 14, 39, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

:deep(.user-dropdown .el-dropdown-menu__item) {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease !important;
}

:deep(.user-dropdown .el-dropdown-menu__item:hover) {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.content::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(59, 130, 246, 0.03),
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(16, 185, 129, 0.03),
      transparent 50%
    );
  pointer-events: none;
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
