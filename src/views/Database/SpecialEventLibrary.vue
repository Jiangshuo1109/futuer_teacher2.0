<template>
  <div class="special-event-library">
    <div class="page-header">
      <h2>特殊事件库</h2>
      <p>维护教学任务发布时的特殊事件</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加事件
          </el-button>
          <el-button @click="handleBatchImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedType" placeholder="事件类型" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="课堂突发" value="classroom" />
            <el-option label="技术故障" value="technical" />
            <el-option label="学生行为" value="student" />
            <el-option label="环境变化" value="environment" />
          </el-select>
          <el-select v-model="selectedLevel" placeholder="严重程度" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部程度" value="" />
            <el-option label="轻微" value="low" />
            <el-option label="中等" value="medium" />
            <el-option label="严重" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索事件名称或描述"
            style="width: 250px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="事件编号" width="120" />
        <el-table-column prop="name" label="事件名称" min-width="150" />
        <el-table-column prop="type" label="事件类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="严重程度" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" size="small">
              {{ getLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="事件描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="frequency" label="发生频率" width="100">
          <template #default="{ row }">
            <span class="frequency-text">{{ row.frequency }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="hasExample" label="示例图" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.exampleImage" type="success" size="small">有</el-tag>
            <el-tag v-else type="info" size="small">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleView(row)">
              查看
            </el-button>
            <el-button type="success" size="small" text @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" text @click="handleCopy(row)">
              复制
            </el-button>
            <el-button 
              :type="row.status === 'active' ? 'warning' : 'success'" 
              size="small" 
              text 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
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

    <!-- 添加/编辑事件对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="resetForm"
    >
      <el-form :model="eventForm" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="事件编号" prop="code">
              <el-input v-model="eventForm.code" placeholder="自动生成" :disabled="!!eventForm.id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件名称" prop="name">
              <el-input v-model="eventForm.name" placeholder="请输入事件名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="事件类型" prop="type">
              <el-select v-model="eventForm.type" placeholder="请选择事件类型" style="width: 100%">
                <el-option label="课堂突发" value="classroom" />
                <el-option label="技术故障" value="technical" />
                <el-option label="学生行为" value="student" />
                <el-option label="环境变化" value="environment" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="严重程度" prop="level">
              <el-select v-model="eventForm.level" placeholder="请选择严重程度" style="width: 100%">
                <el-option label="轻微" value="low" />
                <el-option label="中等" value="medium" />
                <el-option label="严重" value="high" />
                <el-option label="紧急" value="urgent" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="发生频率" prop="frequency">
          <el-slider
            v-model="eventForm.frequency"
            :min="0"
            :max="100"
            :step="5"
            show-input
            :format-tooltip="(val) => `${val}%`"
          />
          <div class="form-tip">表示该事件在教学过程中的发生概率</div>
        </el-form-item>
        
        <el-form-item label="事件描述" prop="description">
          <el-input
            v-model="eventForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述该特殊事件的具体情况、影响范围等"
          />
        </el-form-item>
        
        <el-form-item label="处理建议">
          <el-input
            v-model="eventForm.suggestion"
            type="textarea"
            :rows="3"
            placeholder="请输入针对该事件的处理建议和应对策略（可选）"
          />
        </el-form-item>
        
        <el-form-item label="示例图片">
          <el-upload
            class="example-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :on-success="handleImageSuccess"
          >
            <img v-if="eventForm.exampleImage" :src="eventForm.exampleImage" class="example-image" />
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">点击上传示例图片</div>
            </div>
          </el-upload>
          <div class="form-tip">上传能够说明该事件的示例图片，支持 JPG、PNG 格式，大小不超过 2MB</div>
        </el-form-item>
        
        <el-form-item label="关键词标签">
          <el-select
            v-model="eventForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键词标签"
            style="width: 100%"
          >
          </el-select>
          <div class="form-tip">添加相关的关键词标签，便于搜索和分类</div>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="eventForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 事件详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="特殊事件详情"
      width="800px"
    >
      <div v-if="currentEvent" class="event-detail">
        <div class="detail-header">
          <div class="event-basic-info">
            <h2>{{ currentEvent.name }}</h2>
            <div class="event-meta">
              <el-tag :type="getTypeTagType(currentEvent.type)" size="large">
                {{ getTypeLabel(currentEvent.type) }}
              </el-tag>
              <el-tag :type="getLevelTagType(currentEvent.level)" size="large" style="margin-left: 8px">
                {{ getLevelLabel(currentEvent.level) }}
              </el-tag>
              <el-tag :type="currentEvent.status === 'active' ? 'success' : 'info'" size="large" style="margin-left: 8px">
                {{ currentEvent.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </div>
          </div>
          <div v-if="currentEvent.exampleImage" class="event-image">
            <img :src="currentEvent.exampleImage" alt="示例图片" class="detail-image" />
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="事件编号">{{ currentEvent.code }}</el-descriptions-item>
            <el-descriptions-item label="发生频率">{{ currentEvent.frequency }}%</el-descriptions-item>
            <el-descriptions-item label="使用次数">{{ currentEvent.usageCount }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentEvent.createTime }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ currentEvent.updateTime }}</el-descriptions-item>
            <el-descriptions-item label="创建者">{{ currentEvent.creator || '系统管理员' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h3>事件描述</h3>
          <div class="description-content">
            {{ currentEvent.description }}
          </div>
        </div>
        
        <div v-if="currentEvent.suggestion" class="detail-section">
          <h3>处理建议</h3>
          <div class="suggestion-content">
            {{ currentEvent.suggestion }}
          </div>
        </div>
        
        <div v-if="currentEvent.tags && currentEvent.tags.length" class="detail-section">
          <h3>关键词标签</h3>
          <div class="tags-container">
            <el-tag v-for="tag in currentEvent.tags" :key="tag" size="large" style="margin: 4px">
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>使用统计</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-number">{{ currentEvent.usageCount }}</div>
                <div class="stat-label">总使用次数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-number">{{ currentEvent.frequency }}%</div>
                <div class="stat-label">发生频率</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-number">{{ currentEvent.monthlyUsage || 0 }}</div>
                <div class="stat-label">本月使用</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-number">{{ currentEvent.weeklyUsage || 0 }}</div>
                <div class="stat-label">本周使用</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Refresh, Search } from '@element-plus/icons-vue'

interface SpecialEvent {
  id: number
  code: string
  name: string
  type: string
  level: string
  description: string
  suggestion?: string
  exampleImage?: string
  frequency: number
  tags?: string[]
  usageCount: number
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
  creator?: string
  monthlyUsage?: number
  weeklyUsage?: number
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedLevel = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('添加特殊事件')
const currentEvent = ref<SpecialEvent | null>(null)
const formRef = ref()

const eventForm = reactive({
  id: null as number | null,
  code: '',
  name: '',
  type: '',
  level: '',
  description: '',
  suggestion: '',
  exampleImage: '',
  frequency: 10,
  tags: [] as string[],
  status: 'active' as 'active' | 'inactive'
})

const formRules = {
  name: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
  level: [{ required: true, message: '请选择严重程度', trigger: 'change' }],
  description: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
  frequency: [{ required: true, message: '请设置发生频率', trigger: 'blur' }]
}

const tableData = ref<SpecialEvent[]>([
  {
    id: 1,
    code: 'SE001',
    name: '学生突然身体不适',
    type: 'classroom',
    level: 'medium',
    description: '学生在课堂上突然出现身体不适症状，如头晕、恶心等，需要及时处理',
    suggestion: '立即停止授课，安排学生休息，必要时联系校医或家长',
    exampleImage: 'https://via.placeholder.com/400x300?text=Student+Illness',
    frequency: 15,
    tags: ['身体不适', '紧急处理', '课堂管理'],
    usageCount: 23,
    status: 'active',
    createTime: '2024-01-15',
    updateTime: '2024-01-20',
    creator: '张教授',
    monthlyUsage: 8,
    weeklyUsage: 2
  },
  {
    id: 2,
    code: 'SE002',
    name: '投影设备故障',
    type: 'technical',
    level: 'low',
    description: '课堂投影设备出现故障，无法正常显示教学内容',
    suggestion: '切换到备用设备，或调整教学方式为板书教学',
    frequency: 25,
    tags: ['设备故障', '技术问题', '教学调整'],
    usageCount: 45,
    status: 'active',
    createTime: '2024-01-10',
    updateTime: '2024-01-18',
    creator: '李教授',
    monthlyUsage: 15,
    weeklyUsage: 4
  },
  {
    id: 3,
    code: 'SE003',
    name: '火警警报响起',
    type: 'environment',
    level: 'urgent',
    description: '教学过程中火警警报突然响起，需要立即组织学生疏散',
    suggestion: '立即停止教学，按照疏散预案组织学生有序撤离',
    frequency: 2,
    tags: ['紧急疏散', '安全事故', '应急处理'],
    usageCount: 3,
    status: 'active',
    createTime: '2024-01-08',
    updateTime: '2024-01-16',
    creator: '王教授',
    monthlyUsage: 1,
    weeklyUsage: 0
  }
])

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    classroom: '课堂突发',
    technical: '技术故障',
    student: '学生行为',
    environment: '环境变化'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string) => {
  const tagMap: Record<string, string> = {
    classroom: 'primary',
    technical: 'warning',
    student: 'success',
    environment: 'info'
  }
  return tagMap[type] || 'info'
}

const getLevelLabel = (level: string) => {
  const levelMap: Record<string, string> = {
    low: '轻微',
    medium: '中等',
    high: '严重',
    urgent: '紧急'
  }
  return levelMap[level] || level
}

const getLevelTagType = (level: string) => {
  const tagMap: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger'
  }
  return tagMap[level] || 'info'
}

const generateEventCode = () => {
  const timestamp = Date.now().toString().slice(-6)
  return `SE${timestamp}`
}

const handleAdd = () => {
  dialogTitle.value = '添加特殊事件'
  eventForm.code = generateEventCode()
  dialogVisible.value = true
}

const handleEdit = (row: SpecialEvent) => {
  dialogTitle.value = '编辑特殊事件'
  Object.assign(eventForm, row)
  dialogVisible.value = true
}

const handleView = (row: SpecialEvent) => {
  currentEvent.value = row
  detailDialogVisible.value = true
}

const handleCopy = (row: SpecialEvent) => {
  dialogTitle.value = '复制特殊事件'
  Object.assign(eventForm, { ...row, id: null, code: generateEventCode(), name: `${row.name}(副本)` })
  dialogVisible.value = true
}

const handleDelete = async (row: SpecialEvent) => {
  try {
    await ElMessageBox.confirm(`确定要删除特殊事件 "${row.name}" 吗？`, '确认删除', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleToggleStatus = async (row: SpecialEvent) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确定要${action}特殊事件 "${row.name}" 吗？`, `确认${action}`, {
      type: 'warning'
    })
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch {
    ElMessage.info(`已取消${action}`)
  }
}

const handleBatchImport = () => {
  ElMessage.info('批量导入功能开发中')
}

const handleExport = () => {
  ElMessage.info('导出数据功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    ElMessage.success(eventForm.id ? '修改成功' : '添加成功')
    dialogVisible.value = false
    resetForm()
  } catch {
    ElMessage.error('请检查表单信息')
  }
}

const resetForm = () => {
  Object.assign(eventForm, {
    id: null,
    code: '',
    name: '',
    type: '',
    level: '',
    description: '',
    suggestion: '',
    exampleImage: '',
    frequency: 10,
    tags: [],
    status: 'active'
  })
  formRef.value?.resetFields()
}

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleImageSuccess = (response: any, file: any) => {
  eventForm.exampleImage = URL.createObjectURL(file.raw)
}
</script>

<style scoped>
.special-event-library {
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

.frequency-text {
  color: #409eff;
  font-weight: 500;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.example-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 200px;
  height: 150px;
}

.example-uploader:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c939d;
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.example-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.event-basic-info {
  flex: 1;
}

.event-basic-info h2 {
  margin: 0 0 12px 0;
  color: #303133;
}

.event-meta {
  display: flex;
  align-items: center;
}

.event-image {
  width: 200px;
  flex-shrink: 0;
}

.detail-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-content {
  margin-bottom: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.description-content,
.suggestion-content {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  color: #606266;
}

.tags-container {
  min-height: 40px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}
</style>