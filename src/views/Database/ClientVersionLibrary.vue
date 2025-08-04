<template>
  <div class="client-version-library">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>客户端版本库</h2>
      <p>管理客户端版本，支持上传新版本、查看版本历史和下载客户端</p>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="showUploadDialog = true">
        <el-icon><Upload /></el-icon>
        上传新版本
      </el-button>
      <el-button @click="refreshVersions">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 版本时间轴 -->
    <div class="timeline-container">
      <el-timeline>
        <el-timeline-item
          v-for="version in versionList"
          :key="version.id"
          :timestamp="version.updateTime"
          placement="top"
        >
          <el-card class="version-card">
            <div class="version-header">
              <div class="version-info">
                <h3>{{ version.versionName }}</h3>
                <el-tag :type="getVersionType(version.isLatest)">{{ version.isLatest ? '最新版本' : '历史版本' }}</el-tag>
              </div>
              <div class="version-actions">
                <el-button type="primary" size="small" @click="downloadVersion(version)">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
                <el-button size="small" @click="viewVersionDetail(version)">
                  <el-icon><View /></el-icon>
                  详情
                </el-button>
                <el-button type="danger" size="small" @click="deleteVersion(version.id)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
            <div class="version-content">
              <p><strong>版本号：</strong>{{ version.version }}</p>
              <p><strong>文件大小：</strong>{{ version.fileSize }}</p>
              <p><strong>下载次数：</strong>{{ version.downloadCount }}</p>
              <div class="update-content">
                <strong>更新内容：</strong>
                <div class="content-text">{{ version.updateContent }}</div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 上传新版本对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="上传新版本"
      width="600px"
      :before-close="handleUploadDialogClose"
    >
      <el-form
        ref="uploadFormRef"
        :model="uploadForm"
        :rules="uploadRules"
        label-width="100px"
      >
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="uploadForm.versionName" placeholder="请输入版本名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="uploadForm.version" placeholder="请输入版本号，如：1.0.0" />
        </el-form-item>
        <el-form-item label="更新内容" prop="updateContent">
          <el-input
            v-model="uploadForm.updateContent"
            type="textarea"
            :rows="4"
            placeholder="请输入更新内容描述"
          />
        </el-form-item>
        <el-form-item label="客户端文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            accept=".exe,.dmg,.deb,.rpm,.zip"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .exe, .dmg, .deb, .rpm, .zip 格式文件，大小不超过 500MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleUploadDialogClose">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="uploading">
            {{ uploading ? '上传中...' : '确认上传' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 版本详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="版本详情"
      width="500px"
    >
      <div v-if="currentVersion" class="version-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="版本名称">{{ currentVersion.versionName }}</el-descriptions-item>
          <el-descriptions-item label="版本号">{{ currentVersion.version }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">{{ currentVersion.fileSize }}</el-descriptions-item>
          <el-descriptions-item label="下载次数">{{ currentVersion.downloadCount }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentVersion.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="文件路径">{{ currentVersion.filePath }}</el-descriptions-item>
        </el-descriptions>
        <div class="update-content-detail">
          <h4>更新内容：</h4>
          <div class="content-box">{{ currentVersion.updateContent }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Refresh, Download, View, Delete, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'

// 接口定义
interface ClientVersion {
  id: string
  versionName: string
  version: string
  updateContent: string
  updateTime: string
  fileSize: string
  downloadCount: number
  filePath: string
  isLatest: boolean
}

// 响应式数据
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const uploading = ref(false)
const currentVersion = ref<ClientVersion | null>(null)
const uploadFormRef = ref<FormInstance>()
const uploadRef = ref()

// 上传表单
const uploadForm = reactive({
  versionName: '',
  version: '',
  updateContent: '',
  file: null as File | null
})

// 表单验证规则
const uploadRules: FormRules = {
  versionName: [
    { required: true, message: '请输入版本名称', trigger: 'blur' }
  ],
  version: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    { pattern: /^\d+\.\d+\.\d+$/, message: '版本号格式不正确，请使用如：1.0.0', trigger: 'blur' }
  ],
  updateContent: [
    { required: true, message: '请输入更新内容', trigger: 'blur' }
  ],
  file: [
    { required: true, message: '请选择客户端文件', trigger: 'change' }
  ]
}

// 版本列表（模拟数据）
const versionList = ref<ClientVersion[]>([
  {
    id: '1',
    versionName: '未来教师实习实训系统 v2.1.0',
    version: '2.1.0',
    updateContent: '1. 新增AI智能评价功能\n2. 优化用户界面体验\n3. 修复已知bug\n4. 提升系统性能',
    updateTime: '2024-01-15 14:30:00',
    fileSize: '125.6 MB',
    downloadCount: 1250,
    filePath: '/downloads/future-teacher-v2.1.0.exe',
    isLatest: true
  },
  {
    id: '2',
    versionName: '未来教师实习实训系统 v2.0.5',
    version: '2.0.5',
    updateContent: '1. 修复登录问题\n2. 优化数据库连接\n3. 更新依赖包',
    updateTime: '2024-01-10 10:15:00',
    fileSize: '123.2 MB',
    downloadCount: 890,
    filePath: '/downloads/future-teacher-v2.0.5.exe',
    isLatest: false
  },
  {
    id: '3',
    versionName: '未来教师实习实训系统 v2.0.0',
    version: '2.0.0',
    updateContent: '1. 全新界面设计\n2. 重构核心功能\n3. 提升系统稳定性',
    updateTime: '2024-01-01 09:00:00',
    fileSize: '120.8 MB',
    downloadCount: 2100,
    filePath: '/downloads/future-teacher-v2.0.0.exe',
    isLatest: false
  }
])

// 方法
const getVersionType = (isLatest: boolean) => {
  return isLatest ? 'success' : 'info'
}

const refreshVersions = () => {
  ElMessage.success('版本列表已刷新')
  // 这里可以调用API刷新数据
}

const downloadVersion = (version: ClientVersion) => {
  // 模拟下载
  ElMessage.success(`开始下载 ${version.versionName}`)
  // 实际项目中这里应该调用下载API
  version.downloadCount++
}

const viewVersionDetail = (version: ClientVersion) => {
  currentVersion.value = version
  showDetailDialog.value = true
}

const deleteVersion = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个版本吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟删除
    const index = versionList.value.findIndex(v => v.id === id)
    if (index > -1) {
      versionList.value.splice(index, 1)
      ElMessage.success('版本删除成功')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleFileChange = (file: UploadFile) => {
  uploadForm.file = file.raw as File
}

const beforeUpload = (file: File) => {
  const isValidType = ['application/x-msdownload', 'application/octet-stream', 'application/zip'].includes(file.type) ||
    file.name.endsWith('.exe') || file.name.endsWith('.dmg') || file.name.endsWith('.deb') || file.name.endsWith('.rpm') || file.name.endsWith('.zip')
  
  if (!isValidType) {
    ElMessage.error('文件格式不正确！')
    return false
  }
  
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过 500MB！')
    return false
  }
  
  return true
}

const submitUpload = async () => {
  if (!uploadFormRef.value) return
  
  try {
    await uploadFormRef.value.validate()
    
    if (!uploadForm.file) {
      ElMessage.error('请选择要上传的文件')
      return
    }
    
    uploading.value = true
    
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建新版本记录
    const newVersion: ClientVersion = {
      id: Date.now().toString(),
      versionName: uploadForm.versionName,
      version: uploadForm.version,
      updateContent: uploadForm.updateContent,
      updateTime: new Date().toLocaleString('zh-CN'),
      fileSize: (uploadForm.file.size / 1024 / 1024).toFixed(1) + ' MB',
      downloadCount: 0,
      filePath: `/downloads/${uploadForm.file.name}`,
      isLatest: true
    }
    
    // 将之前的最新版本标记为历史版本
    versionList.value.forEach(v => v.isLatest = false)
    
    // 添加新版本到列表开头
    versionList.value.unshift(newVersion)
    
    ElMessage.success('版本上传成功！')
    handleUploadDialogClose()
  } catch (error) {
    console.error('上传失败:', error)
  } finally {
    uploading.value = false
  }
}

const handleUploadDialogClose = () => {
  showUploadDialog.value = false
  uploadFormRef.value?.resetFields()
  uploadForm.file = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

onMounted(() => {
  // 组件挂载时可以加载数据
})
</script>

<style scoped>
.client-version-library {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.timeline-container {
  max-width: 800px;
}

.version-card {
  margin-bottom: 16px;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.version-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.version-actions {
  display: flex;
  gap: 8px;
}

.version-content p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.update-content {
  margin-top: 12px;
}

.content-text {
  margin-top: 8px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-line;
  color: #303133;
  font-size: 14px;
  line-height: 1.5;
}

.version-detail {
  margin-bottom: 20px;
}

.update-content-detail {
  margin-top: 20px;
}

.update-content-detail h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.content-box {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-line;
  color: #303133;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>