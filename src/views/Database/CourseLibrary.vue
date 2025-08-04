<template>
  <div class="course-library">
    <div class="page-header">
      <h2>课程库</h2>
      <p>管理教学课程资源</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增课程
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedCategory" placeholder="选择分类" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部分类" value="" />
            <el-option label="计算机" value="计算机" />
            <el-option label="教育学" value="教育学" />
            <el-option label="数学" value="数学" />
          </el-select>
          <el-select v-model="selectedLevel" placeholder="选择难度" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部难度" value="" />
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程名称"
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
        <el-table-column prop="name" label="课程名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="level" label="难度" width="80">
          <template #default="{ row }">
            <el-tag 
              :type="row.level === '初级' ? 'success' : row.level === '中级' ? 'warning' : 'danger'"
              size="small"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="学时" width="80" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="studentCount" label="学习人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : 'info'">
              {{ row.status === 'published' ? '已发布' : row.status === 'draft' ? '草稿' : '审核中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" text @click="handleCopy(row)">
              复制
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

interface Course {
  id: number
  name: string
  category: string
  level: string
  duration: number
  teacher: string
  studentCount: number
  status: 'published' | 'draft' | 'reviewing'
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedLevel = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const tableData = ref<Course[]>([
  {
    id: 1,
    name: 'Java程序设计基础',
    category: '计算机',
    level: '初级',
    duration: 64,
    teacher: '张教授',
    studentCount: 120,
    status: 'published',
    createTime: '2024-01-15'
  },
  {
    id: 2,
    name: '数据结构与算法',
    category: '计算机',
    level: '中级',
    duration: 48,
    teacher: '李教授',
    studentCount: 85,
    status: 'published',
    createTime: '2024-01-10'
  },
  {
    id: 3,
    name: '教育心理学',
    category: '教育学',
    level: '初级',
    duration: 32,
    teacher: '王教授',
    studentCount: 200,
    status: 'draft',
    createTime: '2024-01-08'
  }
])

const handleAdd = () => {
  ElMessage.info('新增课程功能开发中')
}

const handleImport = () => {
  ElMessage.info('批量导入功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleView = (row: Course) => {
  ElMessage.info(`查看课程: ${row.name}`)
}

const handleEdit = (row: Course) => {
  ElMessage.info(`编辑课程: ${row.name}`)
}

const handleCopy = (row: Course) => {
  ElMessage.info(`复制课程: ${row.name}`)
}

const handleDelete = (row: Course) => {
  ElMessage.info(`删除课程: ${row.name}`)
}
</script>

<style scoped>
.course-library {
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