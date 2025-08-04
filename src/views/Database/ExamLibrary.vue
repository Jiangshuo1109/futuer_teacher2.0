<template>
  <div class="exam-library">
    <div class="page-header">
      <h2>试卷库</h2>
      <p>管理考试试卷资源</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            创建试卷
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入试卷
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedType" placeholder="试卷类型" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="期中考试" value="midterm" />
            <el-option label="期末考试" value="final" />
            <el-option label="随堂测试" value="quiz" />
            <el-option label="作业" value="homework" />
          </el-select>
          <el-select v-model="selectedSubject" placeholder="学科分类" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部学科" value="" />
            <el-option label="计算机" value="计算机" />
            <el-option label="教育学" value="教育学" />
            <el-option label="数学" value="数学" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索试卷名称"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="试卷标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="100" />
        <el-table-column prop="questionCount" label="题目数" width="80" />
        <el-table-column prop="totalScore" label="总分" width="80" />
        <el-table-column prop="duration" label="时长(分钟)" width="100" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="{ row }">
            <el-tag 
              :type="row.difficulty === '简单' ? 'success' : row.difficulty === '中等' ? 'warning' : 'danger'"
              size="small"
            >
              {{ row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" width="120" />
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : 'info'">
              {{ row.status === 'published' ? '已发布' : row.status === 'draft' ? '草稿' : '审核中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handlePreview(row)">
              预览
            </el-button>
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" text @click="handleCopy(row)">
              复制
            </el-button>
            <el-button type="success" size="small" text @click="handleExport(row)">
              导出
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload, Refresh, Search } from '@element-plus/icons-vue'

interface Exam {
  id: number
  title: string
  type: string
  subject: string
  questionCount: number
  totalScore: number
  duration: number
  difficulty: string
  creator: string
  usageCount: number
  status: 'published' | 'draft' | 'reviewing'
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedSubject = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const tableData = ref<Exam[]>([
  {
    id: 1,
    title: 'Java程序设计期末考试',
    type: 'final',
    subject: '计算机',
    questionCount: 50,
    totalScore: 100,
    duration: 120,
    difficulty: '中等',
    creator: '张教授',
    usageCount: 15,
    status: 'published',
    createTime: '2024-01-15'
  },
  {
    id: 2,
    title: '数据结构随堂测试',
    type: 'quiz',
    subject: '计算机',
    questionCount: 20,
    totalScore: 50,
    duration: 45,
    difficulty: '简单',
    creator: '李教授',
    usageCount: 8,
    status: 'published',
    createTime: '2024-01-12'
  },
  {
    id: 3,
    title: '教育心理学期中考试',
    type: 'midterm',
    subject: '教育学',
    questionCount: 40,
    totalScore: 100,
    duration: 90,
    difficulty: '困难',
    creator: '王教授',
    usageCount: 3,
    status: 'draft',
    createTime: '2024-01-10'
  }
])

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    midterm: '期中考试',
    final: '期末考试',
    quiz: '随堂测试',
    homework: '作业'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    final: 'danger',
    midterm: 'warning',
    quiz: 'primary',
    homework: 'success'
  }
  return typeMap[type] || 'info'
}

const handleCreate = () => {
  ElMessage.info('创建试卷功能开发中')
}

const handleImport = () => {
  ElMessage.info('导入试卷功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handlePreview = (row: Exam) => {
  ElMessage.info(`预览试卷: ${row.title}`)
}

const handleEdit = (row: Exam) => {
  ElMessage.info(`编辑试卷: ${row.title}`)
}

const handleCopy = (row: Exam) => {
  ElMessage.info(`复制试卷: ${row.title}`)
}

const handleExport = (row: Exam) => {
  ElMessage.success(`导出试卷: ${row.title}`)
}

const handleDelete = (row: Exam) => {
  ElMessage.info(`删除试卷: ${row.title}`)
}
</script>

<style scoped>
.exam-library {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #606266;
  margin: 0;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>