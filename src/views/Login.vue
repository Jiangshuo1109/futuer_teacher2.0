<template>
  <div class="login-container">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- 返回首页按钮 -->
    <el-button class="back-to-home" @click="goHome" type="text">
      <el-icon><ArrowLeft /></el-icon>
      返回首页
    </el-button>

    <!-- 主要内容区域 -->
    <div class="login-content">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo">
            <div class="logo-container">
              <div class="logo-icon">🎓</div>
              <div class="logo-glow"></div>
            </div>
          </div>
          
          <h1 class="brand-title">
            <span class="title-line">未来教师</span>
            <span class="title-line highlight">智能分析平台</span>
          </h1>
          
          <p class="brand-description">
            AI驱动的师范生培养新体验
          </p>
          
          <div class="feature-highlights">
            <div class="feature-item" v-for="(feature, index) in features" :key="index">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-text">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <div class="login-card">
          <div class="card-header">
            <h2 class="welcome-title">欢迎回来</h2>
            <p class="welcome-subtitle">请选择身份并登录您的账户</p>
          </div>

          <!-- 用户类型选择 -->
          <div class="user-type-selector">
            <div
              class="type-option"
              :class="{ active: userType === 'teacher' }"
              @click="userType = 'teacher'"
            >
              <div class="type-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="type-content">
                <span class="type-label">教师登录</span>
                <span class="type-desc">教职工专用通道</span>
              </div>
            </div>
            <div
              class="type-option"
              :class="{ active: userType === 'student' }"
              @click="userType = 'student'"
            >
              <div class="type-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="type-content">
                <span class="type-label">学生登录</span>
                <span class="type-desc">师范生专用通道</span>
              </div>
            </div>
          </div>

          <!-- 登录表单 -->
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <div class="form-group">
              <label class="form-label">用户名</label>
              <el-input
                v-model="loginForm.username"
                :placeholder="
                  userType === 'teacher' ? '请输入教师工号' : '请输入学生学号'
                "
                size="large"
                class="form-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><User /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入登录密码"
                size="large"
                class="form-input"
                show-password
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon class="input-icon"><Lock /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="form-options">
              <el-checkbox v-model="rememberPassword" class="remember-checkbox">
                记住登录状态
              </el-checkbox>
              <el-button
                type="text"
                class="forgot-link"
                @click="handleForgotPassword"
              >
                忘记密码？
              </el-button>
            </div>

            <el-button
              type="primary"
              size="large"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
              native-type="submit"
            >
              <span v-if="!loading">立即登录</span>
              <span v-else>登录中...</span>
              <el-icon class="button-icon"><ArrowRight /></el-icon>
            </el-button>
          </el-form>

          <!-- 底部信息 -->
          <div class="card-footer">
            <div class="footer-links">
              <el-button type="text" size="small">用户协议</el-button>
              <span class="divider">·</span>
              <el-button type="text" size="small">隐私政策</el-button>
              <span class="divider">·</span>
              <el-button type="text" size="small">技术支持</el-button>
            </div>
            <p class="copyright">© 2025 未来教师智能分析平台</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, UserFilled, Lock, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const userType = ref("teacher");
const rememberPassword = ref(false);

// 特性展示
const features = ref([
  {
    icon: "🎯",
    title: "智能任务发布",
    description: "AI驱动的教学任务智能分配与追踪"
  },
  {
    icon: "📊",
    title: "全方位数据分析",
    description: "深度挖掘教学数据，提供精准分析报告"
  },
  {
    icon: "🤖",
    title: "AI学生建模",
    description: "基于机器学习的个性化学生能力建模"
  },
  {
    icon: "🏆",
    title: "科学评价体系",
    description: "多维度、全方位的教学效果评价机制"
  }
]);

// 登录表单数据
const loginForm = reactive({
  username: "",
  password: "",
});

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

// 返回首页
const goHome = () => {
  router.push("/");
};

// 忘记密码处理
const handleForgotPassword = () => {
  ElMessage.info("请联系管理员重置密码");
};

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    // 模拟登录请求
    setTimeout(() => {
      // 保存token到localStorage
      localStorage.setItem("token", "mock-token-" + Date.now());
      localStorage.setItem("userType", userType.value);
      localStorage.setItem("username", loginForm.username);

      if (rememberPassword.value) {
        localStorage.setItem("rememberedPassword", loginForm.password);
      }

      ElMessage.success("登录成功，正在跳转...");
      router.push("/dashboard/home");
      loading.value = false;
    }, 1500);
  } catch (error) {
    console.error("表单验证失败:", error);
    loading.value = false;
  }
};

// 页面加载时初始化
onMounted(async () => {
  await nextTick();

  // 检查是否有记住的密码
  const rememberedPassword = localStorage.getItem("rememberedPassword");
  if (rememberedPassword) {
    loginForm.password = rememberedPassword;
    rememberPassword.value = true;
  }
});
</script>

<style scoped>
/* 全局容器 */
.login-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 动态背景 */
.animated-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  inset: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 10%;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: 10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: 15s;
}

.shape-5 {
  width: 250px;
  height: 250px;
  bottom: 40%;
  right: 5%;
  animation-delay: 8s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(180deg) scale(1.1);
    opacity: 0.6;
  }
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
}

/* 返回首页按钮 */
.back-to-home {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.back-to-home:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 主要内容区域 */
.login-content {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 60px;
  max-width: 1300px;
  width: 100%;
  padding: 40px;
  align-items: center;
}

/* 品牌区域 */
.brand-section {
  padding: 40px 0;
}

.brand-content {
  max-width: 500px;
}

.brand-logo {
  margin-bottom: 40px;
}

.logo-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 48px;
  z-index: 2;
  position: relative;
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.brand-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
}

.title-line {
  display: block;
  color: #ffffff;
}

.title-line.highlight {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
  line-height: 1.5;
}

/* 特性展示 */
.feature-highlights {
  display: grid;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.feature-text h4 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.feature-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
}

/* 登录区域 */
.login-section {
  display: flex;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(40px);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.3),
    0 12px 24px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

/* 卡片头部 */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 用户类型选择 */
.user-type-selector {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
}

.type-option:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.type-option.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.type-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  color: #3b82f6;
  font-size: 20px;
}

.type-option.active .type-icon {
  background: #3b82f6;
  color: white;
}

.type-content {
  flex: 1;
}

.type-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

/* 登录表单 */
.login-form {
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.form-input {
  border-radius: 12px;
  height: 52px;
}

.form-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.form-input :deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(59, 130, 246, 0.4);
}

.form-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.12);
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-input :deep(.el-input__inner) {
  color: #ffffff;
  font-size: 16px;
}

.form-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.input-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.remember-checkbox {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.8);
}

.forgot-link {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
  color: #60a5fa;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.button-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.login-button:hover .button-icon {
  transform: translateX(4px);
}

/* 卡片底部 */
.card-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-links .el-button {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  padding: 0;
}

.divider {
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
}

.copyright {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .login-content {
    grid-template-columns: 1fr 450px;
    gap: 60px;
    padding: 30px;
  }
}

@media (max-width: 1024px) {
  .login-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px;
  }

  .brand-section {
    text-align: center;
    padding: 20px 0;
  }

  .brand-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .feature-highlights {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .login-content {
    padding: 16px;
  }

  .login-card {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .welcome-title {
    font-size: 28px;
  }

  .brand-title {
    font-size: 40px;
  }

  .feature-highlights {
    grid-template-columns: 1fr;
  }

  .back-to-home {
    top: 20px;
    left: 20px;
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .brand-title {
    font-size: 32px;
  }

  .type-option {
    padding: 16px;
  }

  .type-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .feature-item {
    padding: 16px;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>