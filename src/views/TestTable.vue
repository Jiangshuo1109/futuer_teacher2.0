<template>
  <div class="test-table-page">
    <div class="page-header">
      <h1>表格深色模式测试</h1>
      <p>验证表格组件在深色主题下的显示效果</p>
    </div>

    <div class="content-card">
      <div class="card-header">
        <h3>教学任务列表</h3>
        <div class="header-actions">
          <el-button type="primary" @click="addTask">
            <el-icon><Plus /></el-icon>
            新建任务
          </el-button>
          <el-button @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="name" label="任务名称" min-width="200" />
        <el-table-column prop="course" label="所属课程" width="150" />
        <el-table-column prop="creator" label="创建人" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" circle @click="viewTask(row)">
                <el-icon><View /></el-icon>
              </el-button>
              <el-button type="warning" size="small" circle @click="editTask(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" size="small" circle @click="deleteTask(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, View, Edit, Delete } from '@element-plus/icons-vue'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 模拟表格数据
const tableData = ref([
  {
    id: 1,
    name: '数学教学任务设计',
    course: '高等数学',
    creator: '张老师',
    createTime: '2025-01-15 10:30',
    status: 'active',
    type: '教学任务'
  },
  {
    id: 2,
    name: '英语口语训练',
    course: '大学英语',
    creator: '李老师',
    createTime: '2025-01-14 14:20',
    status: 'draft',
    type: '教学任务'
  },
  {
    id: 3,
    name: '物理实验指导',
    course: '大学物理',
    creator: '王老师',
    createTime: '2025-01-13 09:15',
    status: 'completed',
    type: '教学任务'
  },
  {
    id: 4,
    name: '计算机编程基础',
    course: '程序设计',
    creator: '陈老师',
    createTime: '2025-01-12 16:45',
    status: 'active',
    type: '教学任务'
  },
  {
    id: 5,
    name: '化学实验安全培训',
    course: '无机化学',
    creator: '刘老师',
    createTime: '2025-01-11 11:30',
    status: 'draft',
    type: '教学任务'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'success',
    draft: 'info',
    completed: 'primary'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    active: '进行中',
    draft: '草稿',
    completed: '已完成'
  }
  return labelMap[status] || '未知'
}

// 添加任务
const addTask = () => {
  ElMessage.success('新建任务功能')
}

// 刷新数据
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

// 查看任务
const viewTask = (row: any) => {
  ElMessage.info(`查看任务: ${row.name}`)
}

// 编辑任务
const editTask = (row: any) => {
  ElMessage.warning(`编辑任务: ${row.name}`)
}

// 删除任务
const deleteTask = (row: any) => {
  ElMessage.error(`删除任务: ${row.name}`)
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
.test-table-page {
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

.content-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-table-page {
    padding: 16px;
  }

  .content-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
