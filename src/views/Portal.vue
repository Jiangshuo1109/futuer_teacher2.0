<template>
  <div class="portal">
    <!-- 粒子背景动画 -->
    <div class="particles" ref="particlesRef" />

    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header__container">
        <div class="header__brand">
          <div class="header__logo">
            <div class="logo-icon">🎓</div>
          </div>
          <div class="header__title">
            <h1>未来教师智能分析平台</h1>
            <p>AI-Powered Future Teacher Training</p>
          </div>
        </div>

        <nav class="header__nav">
          <a href="#features" class="nav-link">核心功能</a>
          <a href="#stats" class="nav-link">平台数据</a>
          <el-button type="primary" @click="goLogin" class="header__login-btn">
            登录平台
          </el-button>
        </nav>
      </div>
    </header>

    <!-- 英雄区 -->
    <section class="hero">
      <div class="hero__bg">
        <div class="gradient-orb gradient-orb--1" />
        <div class="gradient-orb gradient-orb--2" />
        <div class="gradient-orb gradient-orb--3" />
      </div>

      <div class="hero__content">
        <div class="hero__badge" data-aos="fade-up">
          <span class="hero__badge-text">✨ AI驱动的未来教育</span>
        </div>

        <h1 class="hero__title" data-aos="fade-up" data-aos-delay="100">
          <span class="text-gradient">智能分析</span>
          <br />
          未来教师培养平台
        </h1>

        <p class="hero__subtitle" data-aos="fade-up" data-aos-delay="200">
          连接教学数据 · 释放AI价值 · 重塑师范教育
          <br />
          全流程数字化教学实训与智能评价解决方案
        </p>

        <div class="hero__actions" data-aos="fade-up" data-aos-delay="300">
          <el-button
            type="primary"
            size="large"
            class="hero__btn hero__btn--primary"
            @click="goLogin"
          >
            开始探索
            <el-icon class="hero__btn-icon"><ArrowRight /></el-icon>
          </el-button>
          <el-button
            size="large"
            class="hero__btn hero__btn--secondary"
            @click="scrollToFeatures"
          >
            了解更多
          </el-button>
        </div>
      </div>

      <!-- 浮动元素 -->
      <div class="hero__floats">
        <div
          class="float-element float-element--1"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <div class="float-element__icon">🎯</div>
          <div class="float-element__text">智能任务发布</div>
        </div>
        <div
          class="float-element float-element--2"
          data-aos="fade-right"
          data-aos-delay="500"
        >
          <div class="float-element__icon">📊</div>
          <div class="float-element__text">数据协同分析</div>
        </div>
        <div
          class="float-element float-element--3"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div class="float-element__icon">🤖</div>
          <div class="float-element__text">AI学生建模</div>
        </div>
      </div>
    </section>

    <!-- 核心能力卡片 -->
    <section class="capabilities" id="features">
      <div class="capabilities__container">
        <div class="section-header" data-aos="fade-up">
          <h2 class="section-header__title">
            <span class="text-gradient">六大核心能力</span>
          </h2>
          <p class="section-header__subtitle">构建完整的师范生培养数字化生态</p>
        </div>

        <div class="capabilities__grid">
          <div
            v-for="(capability, index) in capabilities"
            :key="capability.id"
            class="capability-card"
            :class="`capability-card--${capability.id}`"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
            @click="enterFeature(capability.path)"
          >
            <div class="capability-card__bg" />
            <div class="capability-card__icon">
              <component :is="capability.icon" />
            </div>
            <h3 class="capability-card__title">{{ capability.title }}</h3>
            <p class="capability-card__desc">{{ capability.description }}</p>
            <ul class="capability-card__features">
              <li v-for="feature in capability.features" :key="feature">
                <el-icon><Check /></el-icon>
                {{ feature }}
              </li>
            </ul>
            <div class="capability-card__hover">
              <el-button type="primary" class="capability-card__btn">
                立即体验
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats" id="stats" data-aos="fade-up">
      <div class="stats__container">
        <div class="stats__grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-item__value" :data-target="stat.rawValue">
              {{ stat.value }}
            </div>
            <div class="stat-item__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta" data-aos="fade-up">
      <div class="cta__container">
        <div class="cta__content">
          <h2 class="cta__title">
            准备好开启
            <span class="text-gradient">智能教育</span>
            之旅了吗？
          </h2>
          <p class="cta__desc">加入我们，体验AI驱动的师范生培养新模式</p>
          <div class="cta__actions">
            <el-button
              type="primary"
              size="large"
              class="cta__btn"
              @click="goLogin"
            >
              立即开始
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="cta__visual">
          <div class="cta__orb" />
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__content">
          <div class="footer__brand">
            <h3>未来教师智能分析平台</h3>
            <p>AI-Powered Future Teacher Training</p>
          </div>
          <div class="footer__links">
            <span>© {{ year }} 版权所有</span>
            <span class="footer__sep">·</span>
            <span>致力于教育数字化转型</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, nextTick } from "vue";
import {
  ArrowRight,
  Check,
  DocumentCopy,
  DataAnalysis,
  UserFilled,
  FolderOpened,
  Trophy,
  Avatar,
} from "@element-plus/icons-vue";

const router = useRouter();
const year = new Date().getFullYear();
const particlesRef = ref<HTMLElement>();

// 统计数据
type StatItem = { label: string; value: string; rawValue: number };
const stats = ref<StatItem[]>([
  { label: "累计课堂数据", value: "3.5M+", rawValue: 3500000 },
  { label: "AI模型数量", value: "25+", rawValue: 25 },
  { label: "师范生用户", value: "50K+", rawValue: 50000 },
  { label: "平台可用性", value: "99.9%", rawValue: 99.9 },
]);

// 六大核心能力（基于附图）
type CapabilityItem = {
  id: string;
  title: string;
  description: string;
  features: string[];
  path: string;
  icon: any;
};

const capabilities = ref<CapabilityItem[]>([
  {
    id: "task-management",
    title: "教学任务及追踪",
    description: "全流程教学任务管理，实时追踪师范生学习进度",
    features: [
      "智能任务发布与分配",
      "实时进度监控",
      "多维度学习轨迹",
      "个性化学习经历",
    ],
    path: "/dashboard/teaching/task-publish",
    icon: DocumentCopy,
  },
  {
    id: "data-collaboration",
    title: "虚拟实验数据协同",
    description: "打通虚拟实验平台，实现数据无缝对接与协同分析",
    features: [
      "实验数据无缝对接",
      "跨平台数据整合",
      "智能数据分析",
      "协同实验环境",
    ],
    path: "/dashboard/database/course",
    icon: DataAnalysis,
  },
  {
    id: "ai-student-modeling",
    title: "AI学生模型智能体",
    description: "基于重要的AI学生模型库，模拟真实学习与动场景",
    features: [
      "多样化学生AI模型",
      "智能行为模拟",
      "个性化反馈制",
      "动态模型优化",
    ],
    path: "/dashboard/database/student-model",
    icon: UserFilled,
  },
  {
    id: "resource-management",
    title: "数据资源管理",
    description: "全方位数据资源管理，支撑教学活动各个环节",
    features: ["课程资源库管理", "课件素材维护", "语义知识图谱", "存档事件库"],
    path: "/dashboard/database/courseware",
    icon: FolderOpened,
  },
  {
    id: "evaluation-system",
    title: "教学评价体系",
    description: "科学完善的教学评价体系，多维度评价教学效果",
    features: [
      "六维度评价模型",
      "智能评价算法",
      "可视化评价报告",
      "持续改进建议",
    ],
    path: "/dashboard/database/evaluation-system",
    icon: Trophy,
  },
  {
    id: "ability-profiling",
    title: "教学能力画像",
    description: "基于AI分析的多维度教学能力画像，精准识别优势与不足",
    features: ["多能力分析", "智能画像生成", "成长轨迹追踪", "个性化提升方案"],
    path: "/dashboard/teaching/task/:taskId/student/:studentId/ai-evaluation",
    icon: Avatar,
  },
]);

// 粒子动画
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
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
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

// 页面交互
const goLogin = () => {
  router.push({ path: "/login" });
};

const enterFeature = (path: string) => {
  router.push(path);
};

const scrollToFeatures = () => {
  const el = document.getElementById("features");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

onMounted(async () => {
  await nextTick();
  initParticles();

  // 初始化AOS动画库（如果已安装）
  if (typeof window !== "undefined" && (window as any).AOS) {
    (window as any).AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }
});
</script>

<style scoped>
/* 全局重置与基础样式 */
.portal {
  position: relative;
  overflow-x: hidden;
  background: #0a0e27;
  color: #ffffff;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.header__logo::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
}

.logo-icon {
  font-size: 24px;
  z-index: 1;
}

.header__title h1 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.header__title p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 2px 0 0 0;
  line-height: 1;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.header__login-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.header__login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
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

/* 渐变文字效果 */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 英雄区 */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px 0 24px; /* 顶部增加导航栏高度 */
}

.hero__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      800px 400px at 20% 30%,
      rgba(59, 130, 246, 0.15),
      transparent
    ),
    radial-gradient(
      600px 300px at 80% 70%,
      rgba(16, 185, 129, 0.15),
      transparent
    ),
    radial-gradient(
      900px 500px at 50% 50%,
      rgba(6, 182, 212, 0.1),
      transparent
    ),
    linear-gradient(135deg, #0a0e27 0%, #0f172a 50%, #111827 100%);
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: float 6s ease-in-out infinite;
}

.gradient-orb--1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.3),
    rgba(147, 51, 234, 0.3)
  );
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.gradient-orb--2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(
    45deg,
    rgba(16, 185, 129, 0.25),
    rgba(6, 182, 212, 0.25)
  );
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.gradient-orb--3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(
    45deg,
    rgba(168, 85, 247, 0.2),
    rgba(236, 72, 153, 0.2)
  );
  bottom: 30%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.hero__badge-text {
  font-size: 14px;
  color: #93c5fd;
  font-weight: 500;
}

.hero__title {
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero__subtitle {
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__btn {
  height: 56px;
  padding: 0 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hero__btn--primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
}

.hero__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
}

.hero__btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.hero__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.hero__btn-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.hero__btn:hover .hero__btn-icon {
  transform: translateX(4px);
}

/* 浮动元素 */
.hero__floats {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: floatElement 8s ease-in-out infinite;
}

.float-element--1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.float-element--2 {
  bottom: 30%;
  left: 5%;
  animation-delay: 2s;
}

.float-element--3 {
  top: 50%;
  right: 5%;
  animation-delay: 4s;
}

@keyframes floatElement {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.float-element__icon {
  font-size: 24px;
  width: 32px;
  text-align: center;
}

.float-element__text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  white-space: nowrap;
}

/* 核心能力区 */
.capabilities {
  padding: 120px 0;
  background: linear-gradient(180deg, #0a0e27 0%, #111827 100%);
  position: relative;
}

.capabilities__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-header__title {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section-header__subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.capabilities__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.capability-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  height: 100%;
  backdrop-filter: blur(10px);
}

.capability-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.5),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.capability-card:hover::before {
  opacity: 1;
}

.capability-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
}

.capability-card__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05),
    rgba(16, 185, 129, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.capability-card:hover .capability-card__bg {
  opacity: 1;
}

.capability-card__icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.capability-card__icon::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
}

.capability-card__title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.3;
}

.capability-card__desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 20px;
}

.capability-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.capability-card__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.capability-card__features li:last-child {
  margin-bottom: 0;
}

.capability-card__features .el-icon {
  color: #10b981;
  font-size: 14px;
}

.capability-card__hover {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.capability-card:hover .capability-card__hover {
  opacity: 1;
  transform: translateY(0);
}

.capability-card__btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  font-weight: 600;
}

/* 统计数据 */
.stats {
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.02);
}

.stats__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-item {
  text-align: center;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-item__value {
  font-size: 36px;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-item__label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* CTA区域 */
.cta {
  padding: 120px 0;
  background: linear-gradient(135deg, #0a0e27 0%, #111827 100%);
  position: relative;
  overflow: hidden;
}

.cta__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 80px;
  align-items: center;
}

.cta__content {
  max-width: 600px;
}

.cta__title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.cta__desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta__actions {
  display: flex;
  gap: 16px;
}

.cta__btn {
  height: 56px;
  padding: 0 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
}

.cta__visual {
  position: relative;
  width: 200px;
  height: 200px;
}

.cta__orb {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #06b6d4, #10b981);
  border-radius: 50%;
  filter: blur(20px);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* 页脚 */
.footer {
  padding: 40px 0;
  background: #030712;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer__brand h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.footer__brand p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.footer__links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.footer__sep {
  color: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .capabilities__grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }

  .cta__container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }

  .cta__visual {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .header__container {
    padding: 0 16px;
  }

  .header__title h1 {
    font-size: 16px;
  }

  .header__title p {
    display: none;
  }

  .header__nav {
    gap: 16px;
  }

  .nav-link {
    display: none;
  }

  .header__login-btn {
    padding: 0 16px;
    font-size: 13px;
  }

  .hero {
    padding: 80px 16px 0 16px;
    min-height: 80vh;
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }

  .hero__btn {
    width: 100%;
    max-width: 280px;
  }

  .float-element {
    display: none;
  }

  .capabilities {
    padding: 80px 0;
  }

  .capabilities__container,
  .stats__container,
  .cta__container,
  .footer__container {
    padding: 0 16px;
  }

  .capability-card {
    padding: 24px;
  }

  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-item {
    padding: 24px 16px;
  }

  .footer__content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .capabilities__grid {
    grid-template-columns: 1fr;
  }

  .stats__grid {
    grid-template-columns: 1fr;
  }

  .hero__btn {
    height: 48px;
    font-size: 14px;
  }

  .cta__btn {
    height: 48px;
    font-size: 14px;
  }
}
</style>
