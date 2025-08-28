<template>
  <div class="table-test-all-page">
    <div class="page-header">
      <h1>所有模块表格深色主题测试</h1>
      <p>验证所有模块的表格组件在深色主题下的显示效果</p>
    </div>

    <!-- 教学平台体系库 -->
    <div class="module-section">
      <h2>教学平台体系库</h2>
      <div class="content-card">
        <el-table :data="evaluationData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="模板名称" min-width="200" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="courseCount" label="关联课程" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 客户端版本库 -->
    <div class="module-section">
      <h2>客户端版本库</h2>
      <div class="content-card">
        <el-table :data="clientVersionData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="version" label="版本号" width="120" />
          <el-table-column prop="platform" label="平台" width="100">
            <template #default="{ row }">
              <el-tag :type="getPlatformType(row.platform)" size="small">{{ row.platform }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="releaseDate" label="发布日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><Download /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 学生模型库 -->
    <div class="module-section">
      <h2>学生模型库</h2>
      <div class="content-card">
        <el-table :data="studentModelData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="模型名称" min-width="200" />
          <el-table-column prop="type" label="模型类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getModelType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="accuracy" label="准确率" width="100">
            <template #default="{ row }">
              <el-progress :percentage="row.accuracy" :stroke-width="8" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle>
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 特殊事件库 -->
    <div class="module-section">
      <h2>特殊事件库</h2>
      <div class="content-card">
        <el-table :data="specialEventData" style="width: 100%" v-loading="loading">
          <el-table-column prop="code" label="事件编号" width="120" />
          <el-table-column prop="name" label="事件名称" min-width="150" />
          <el-table-column prop="type" label="事件类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getEventType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="严重程度" width="100">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.level)" size="small">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="frequency" label="发生频率" width="100" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 课件库 -->
    <div class="module-section">
      <h2>课件库</h2>
      <div class="content-card">
        <el-table :data="coursewareData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="课件" min-width="250">
            <template #default="{ row }">
              <div class="courseware-info">
                <el-image :src="row.thumbnail" class="courseware-thumbnail" />
                <div class="courseware-details">
                  <div class="courseware-name">{{ row.name }}</div>
                  <div class="courseware-desc">{{ row.description }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="getCoursewareType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="subject" label="学科" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="success" size="small" circle>
                  <el-icon><Download /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 题库 -->
    <div class="module-section">
      <h2>题库</h2>
      <div class="content-card">
        <el-table :data="questionData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="题目" min-width="300" />
          <el-table-column prop="type" label="题型" width="100">
            <template #default="{ row }">
              <el-tag :type="getQuestionType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="100">
            <template #default="{ row }">
              <el-tag :type="getDifficultyType(row.difficulty)" size="small">{{ row.difficulty }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="subject" label="学科" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 组织管理 -->
    <div class="module-section">
      <h2>组织管理</h2>
      <div class="content-card">
        <el-table :data="organizationData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" min-width="200" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getOrgType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" />
          <el-table-column prop="count" label="数量" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 系统管理 -->
    <div class="module-section">
      <h2>系统管理</h2>
      <div class="content-card">
        <el-table :data="systemData" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" min-width="200" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getSystemType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="300" />
          <el-table-column prop="permissions" label="权限" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" circle>
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button type="warning" size="small" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" size="small" circle>
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  View, Edit, Delete, Download, VideoPlay 
} from '@element-plus/icons-vue'

const loading = ref(false)

// 教学平台体系库数据
const evaluationData = ref([
  { id: 1, name: '数学教学评价模板', type: '数学', courseCount: 15, status: 'active' },
  { id: 2, name: '英语教学评价模板', type: '英语', courseCount: 12, status: 'draft' },
  { id: 3, name: '物理教学评价模板', type: '物理', courseCount: 8, status: 'active' },
  { id: 4, name: '化学教学评价模板', type: '化学', courseCount: 10, status: 'completed' },
  { id: 5, name: '计算机教学评价模板', type: '计算机', courseCount: 20, status: 'active' }
])

// 客户端版本库数据
const clientVersionData = ref([
  { id: 1, version: 'v2.1.0', platform: 'Windows', releaseDate: '2025-01-15', status: 'active' },
  { id: 2, version: 'v2.0.8', platform: 'macOS', releaseDate: '2025-01-10', status: 'active' },
  { id: 3, version: 'v2.1.1', platform: 'Linux', releaseDate: '2025-01-12', status: 'draft' },
  { id: 4, version: 'v2.0.9', platform: 'Android', releaseDate: '2025-01-08', status: 'active' },
  { id: 5, version: 'v2.1.2', platform: 'iOS', releaseDate: '2025-01-14', status: 'completed' }
])

// 学生模型库数据
const studentModelData = ref([
  { id: 1, name: '学习能力评估模型', type: '评估模型', accuracy: 85, status: 'active' },
  { id: 2, name: '学习风格识别模型', type: '识别模型', accuracy: 92, status: 'active' },
  { id: 3, name: '学习进度预测模型', type: '预测模型', accuracy: 78, status: 'draft' },
  { id: 4, name: '学习行为分析模型', type: '分析模型', accuracy: 88, status: 'active' },
  { id: 5, name: '学习效果评估模型', type: '评估模型', accuracy: 90, status: 'completed' }
])

// 特殊事件库数据
const specialEventData = ref([
  { id: 1, code: 'EV001', name: '课堂冲突事件', type: '冲突事件', level: '中等', frequency: '偶尔', status: 'active' },
  { id: 2, code: 'EV002', name: '学习困难事件', type: '学习事件', level: '轻微', frequency: '经常', status: 'active' },
  { id: 3, code: 'EV003', name: '设备故障事件', type: '技术事件', level: '严重', frequency: '很少', status: 'draft' },
  { id: 4, code: 'EV004', name: '迟到早退事件', type: '纪律事件', level: '轻微', frequency: '偶尔', status: 'active' },
  { id: 5, code: 'EV005', name: '考试作弊事件', type: '违纪事件', level: '严重', frequency: '很少', status: 'completed' }
])

// 课件库数据
const coursewareData = ref([
  { id: 1, name: '高等数学第一章', description: '函数与极限', type: 'PPT', subject: '数学', status: 'active', thumbnail: 'https://via.placeholder.com/60x40' },
  { id: 2, name: '大学英语听力', description: '英语听力训练', type: '音频', subject: '英语', status: 'active', thumbnail: 'https://via.placeholder.com/60x40' },
  { id: 3, name: '物理实验指导', description: '力学实验', type: '视频', subject: '物理', status: 'draft', thumbnail: 'https://via.placeholder.com/60x40' },
  { id: 4, name: '程序设计基础', description: 'C语言入门', type: '文档', subject: '计算机', status: 'active', thumbnail: 'https://via.placeholder.com/60x40' },
  { id: 5, name: '化学实验安全', description: '实验室安全规范', type: 'PPT', subject: '化学', status: 'completed', thumbnail: 'https://via.placeholder.com/60x40' }
])

// 题库数据
const questionData = ref([
  { id: 1, title: '什么是函数？', type: '选择题', difficulty: '简单', subject: '数学', status: 'active' },
  { id: 2, title: '英语时态有哪些？', type: '填空题', difficulty: '中等', subject: '英语', status: 'active' },
  { id: 3, title: '牛顿第一定律是什么？', type: '简答题', difficulty: '简单', subject: '物理', status: 'draft' },
  { id: 4, title: 'C语言的基本数据类型', type: '选择题', difficulty: '中等', subject: '计算机', status: 'active' },
  { id: 5, title: '化学元素周期表', type: '填空题', difficulty: '困难', subject: '化学', status: 'completed' }
])

// 组织管理数据
const organizationData = ref([
  { id: 1, name: '主校区', type: '校区', address: '北京市海淀区', count: 15000, status: 'active' },
  { id: 2, name: '计算机学院', type: '学院', address: '主校区A楼', count: 2000, status: 'active' },
  { id: 3, name: '数学系', type: '系部', address: '主校区B楼', count: 500, status: 'draft' },
  { id: 4, name: '物理学院', type: '学院', address: '主校区C楼', count: 1200, status: 'active' },
  { id: 5, name: '化学学院', type: '学院', address: '主校区D楼', count: 800, status: 'completed' }
])

// 系统管理数据
const systemData = ref([
  { id: 1, name: '超级管理员', type: '角色', description: '系统最高权限管理员', permissions: '全部', status: 'active' },
  { id: 2, name: '教师管理员', type: '角色', description: '教师相关功能管理', permissions: '教师模块', status: 'active' },
  { id: 3, name: '学生管理员', type: '角色', description: '学生相关功能管理', permissions: '学生模块', status: 'draft' },
  { id: 4, name: '课程管理权限', type: '权限', description: '课程增删改查权限', permissions: '课程管理', status: 'active' },
  { id: 5, name: '用户管理权限', type: '权限', description: '用户信息管理权限', permissions: '用户管理', status: 'completed' }
])

// 获取标签类型
const getTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    '数学': 'primary',
    '英语': 'success',
    '物理': 'warning',
    '化学': 'danger',
    '计算机': 'info'
  }
  return typeMap[type] || 'info'
}

const getPlatformType = (platform: string) => {
  const platformMap: Record<string, string> = {
    'Windows': 'primary',
    'macOS': 'success',
    'Linux': 'warning',
    'Android': 'danger',
    'iOS': 'info'
  }
  return platformMap[platform] || 'info'
}

const getModelType = (type: string) => {
  const typeMap: Record<string, string> = {
    '评估模型': 'primary',
    '识别模型': 'success',
    '预测模型': 'warning',
    '分析模型': 'danger'
  }
  return typeMap[type] || 'info'
}

const getEventType = (type: string) => {
  const typeMap: Record<string, string> = {
    '冲突事件': 'danger',
    '学习事件': 'warning',
    '技术事件': 'info',
    '纪律事件': 'primary',
    '违纪事件': 'danger'
  }
  return typeMap[type] || 'info'
}

const getLevelType = (level: string) => {
  const levelMap: Record<string, string> = {
    '轻微': 'success',
    '中等': 'warning',
    '严重': 'danger'
  }
  return levelMap[level] || 'info'
}

const getCoursewareType = (type: string) => {
  const typeMap: Record<string, string> = {
    'PPT': 'primary',
    '音频': 'success',
    '视频': 'warning',
    '文档': 'info'
  }
  return typeMap[type] || 'info'
}

const getQuestionType = (type: string) => {
  const typeMap: Record<string, string> = {
    '选择题': 'primary',
    '填空题': 'success',
    '简答题': 'warning',
    '计算题': 'danger'
  }
  return typeMap[type] || 'info'
}

const getDifficultyType = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return difficultyMap[difficulty] || 'info'
}

const getOrgType = (type: string) => {
  const typeMap: Record<string, string> = {
    '校区': 'primary',
    '学院': 'success',
    '系部': 'warning',
    '班级': 'info'
  }
  return typeMap[type] || 'info'
}

const getSystemType = (type: string) => {
  const typeMap: Record<string, string> = {
    '角色': 'primary',
    '权限': 'success',
    '菜单': 'warning',
    '功能': 'info'
  }
  return typeMap[type] || 'info'
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': 'success',
    'draft': 'info',
    'completed': 'primary'
  }
  return statusMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    'active': '启用',
    'draft': '草稿',
    'completed': '完成'
  }
  return labelMap[status] || '未知'
}
</script>

<style scoped>
.table-test-all-page {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f172a 100%);
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.module-section {
  margin-bottom: 40px;
}

.module-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #3b82f6;
}

.content-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.courseware-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.courseware-thumbnail {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.courseware-details {
  flex: 1;
}

.courseware-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.courseware-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-test-all-page {
    padding: 16px;
  }

  .content-card {
    padding: 16px;
  }

  .module-section h2 {
    font-size: 20px;
  }

  .page-header h1 {
    font-size: 24px;
  }
}
</style>
