<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-form">
        <!-- 头部图标和标题 -->
        <div class="login-header">
          <div class="logo">
            <img src="https://www.deepvrai.com/logo/logo-site.png" alt="Logo" class="logo-image" />
          </div>
          <h2 class="title">未来教师智能分析平台</h2>
          <p class="subtitle">培养未来时代的优秀教师</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form-content"
          size="large"
        >
          <!-- 用户类型选择 -->
          <div class="user-type-tabs">
            <el-button
              :type="userType === 'teacher' ? 'primary' : 'default'"
              @click="userType = 'teacher'"
              class="type-btn"
            >
              <el-icon><User /></el-icon>
              教师登录验证
            </el-button>
            <el-button
              :type="userType === 'student' ? 'primary' : 'default'"
              @click="userType = 'student'"
              class="type-btn"
            >
              <el-icon><UserFilled /></el-icon>
              学生—认证登录
            </el-button>
          </div>

          <!-- 用户名输入 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入工号或学号"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住密码和忘记密码 -->
          <div class="form-options">
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部版权信息 -->
        <div class="login-footer">
          <p>© 2025 未来教师智能分析平台 v1.0</p>
          <div class="footer-links">
            <el-link>使用协议</el-link>
            <el-divider direction="vertical" />
            <el-link>技术支持</el-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部附加信息 -->
    <div class="bottom-info">
      <span>🎯 培养卓越师资人才</span>
      <span>🚀 引领教育创新发展</span>
      <span>💡 智慧教学，精准育人</span>
      <span>🌟 打造未来教育生态</span>
      <span>🔥 全方位实训体验</span>
      <span>⚡ 24小时在线服务</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, UserFilled, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const userType = ref('teacher')
const rememberPassword = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 保存token到localStorage
      localStorage.setItem('token', 'mock-token-' + Date.now())
      localStorage.setItem('userType', userType.value)
      localStorage.setItem('username', loginForm.username)
      
      if (rememberPassword.value) {
        localStorage.setItem('rememberedPassword', loginForm.password)
      }
      
      ElMessage.success('登录成功')
      router.push('/dashboard/home')
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
    loading.value = false
  }
}

// 页面加载时检查是否有记住的密码
onMounted(() => {
  const rememberedPassword = localStorage.getItem('rememberedPassword')
  if (rememberedPassword) {
    loginForm.password = rememberedPassword
    rememberPassword.value = true
  }
})
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login-form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.login-form {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  margin-bottom: 16px;
}

.logo-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin-bottom: 0;
}

.user-type-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.type-btn {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  font-size: 14px;
}

.type-btn .el-icon {
  margin-right: 4px;
}

.login-form-content {
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

.login-footer p {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}

.bottom-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  max-width: 90%;
}

.bottom-info span {
  white-space: nowrap;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.bottom-info span:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form {
    width: 90%;
    max-width: 400px;
    padding: 30px 20px;
  }
  
  .bottom-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>