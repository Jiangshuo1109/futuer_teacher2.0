<template>
  <div class="courseware-library">
    <div class="page-header">
      <h2>课件库</h2>
      <p>管理教学课件资源</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon>
            上传课件
          </el-button>
          <el-button @click="handleBatchUpload">
            <el-icon><FolderAdd /></el-icon>
            批量上传
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedType" placeholder="文件类型" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="PPT" value="ppt" />
            <el-option label="PDF" value="pdf" />
            <el-option label="Word" value="word" />
            <el-option label="视频" value="video" />
          </el-select>
          <el-select v-model="selectedSubject" placeholder="学科分类" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部学科" value="" />
            <el-option label="计算机" value="计算机" />
            <el-option label="教育学" value="教育学" />
            <el-option label="数学" value="数学" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课件名称"
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
        <el-table-column label="课件" min-width="250">
          <template #default="{ row }">
            <div class="courseware-info">
              <el-icon class="file-icon" :class="getFileIconClass(row.type)">
                <Document v-if="row.type === 'pdf'" />
                <VideoPlay v-else-if="row.type === 'video'" />
                <Files v-else />
              </el-icon>
              <div class="file-details">
                <div class="file-name">{{ row.name }}</div>
                <div class="file-meta">{{ row.size }} | {{ row.uploadTime }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="getTypeTagType(row.type)">
              {{ row.type.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="100" />
        <el-table-column prop="uploader" label="上传者" width="120" />
        <el-table-column prop="downloadCount" label="下载次数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'approved' ? '已审核' : row.status === 'pending' ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handlePreview(row)">
              预览
            </el-button>
            <el-button type="success" size="small" text @click="handleDownload(row)">
              下载
            </el-button>
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              编辑
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
import { Upload, FolderAdd, Refresh, Search, Document, VideoPlay, Files } from '@element-plus/icons-vue'

interface Courseware {
  id: number
  name: string
  type: string
  subject: string
  size: string
  uploader: string
  downloadCount: number
  status: 'approved' | 'pending' | 'rejected'
  uploadTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedSubject = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const tableData = ref<Courseware[]>([
  {
    id: 1,
    name: 'Java基础语法.pptx',
    type: 'ppt',
    subject: '计算机',
    size: '2.5MB',
    uploader: '张教授',
    downloadCount: 45,
    status: 'approved',
    uploadTime: '2024-01-15'
  },
  {
    id: 2,
    name: '数据结构讲义.pdf',
    type: 'pdf',
    subject: '计算机',
    size: '1.8MB',
    uploader: '李教授',
    downloadCount: 32,
    status: 'approved',
    uploadTime: '2024-01-12'
  },
  {
    id: 3,
    name: '教学方法视频.mp4',
    type: 'video',
    subject: '教育学',
    size: '125MB',
    uploader: '王教授',
    downloadCount: 18,
    status: 'pending',
    uploadTime: '2024-01-10'
  }
])

const getFileIconClass = (type: string) => {
  const typeMap: Record<string, string> = {
    pdf: 'text-red-500',
    ppt: 'text-orange-500',
    word: 'text-blue-500',
    video: 'text-purple-500'
  }
  return typeMap[type] || 'text-gray-500'
}

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    pdf: 'danger',
    ppt: 'warning',
    word: 'primary',
    video: 'success'
  }
  return typeMap[type] || 'info'
}

const handleUpload = () => {
  ElMessage.info('上传课件功能开发中')
}

const handleBatchUpload = () => {
  ElMessage.info('批量上传功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handlePreview = (row: Courseware) => {
  ElMessage.info(`预览课件: ${row.name}`)
}

const handleDownload = (row: Courseware) => {
  ElMessage.success(`开始下载: ${row.name}`)
}

const handleEdit = (row: Courseware) => {
  ElMessage.info(`编辑课件: ${row.name}`)
}

const handleDelete = (row: Courseware) => {
  ElMessage.info(`删除课件: ${row.name}`)
}
</script>

<style scoped>
.courseware-library {
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

.courseware-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 24px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 12px;
  color: #909399;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>