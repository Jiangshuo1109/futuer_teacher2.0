<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>管理系统中的所有用户信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="filterRole" placeholder="选择角色" style="width: 120px; margin-right: 8px">
            <el-option label="全部" value="" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table
        :data="filteredTableData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'teacher' ? 'primary' : 'success'">
              {{ row.role === 'teacher' ? '教师' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="warning" size="small" text @click="handleResetPassword(row)">
              重置密码
            </el-button>
            <el-button 
              :type="row.status === 'active' ? 'danger' : 'success'"
              size="small" 
              text 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, User } from '@element-plus/icons-vue'

interface User {
  id: number
  username: string
  realName: string
  role: 'teacher' | 'student'
  email: string
  phone: string
  avatar?: string
  status: 'active' | 'inactive'
  lastLogin: string
}

const loading = ref(false)
const searchKeyword = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const tableData = ref<User[]>([
  {
    id: 1,
    username: 'teacher001',
    realName: '王明华',
    role: 'teacher',
    email: 'teacher001@example.com',
    phone: '13800138001',
    status: 'active',
    lastLogin: '2024-01-15 09:30:00'
  },
  {
    id: 2,
    username: 'student001',
    realName: '李同学',
    role: 'student',
    email: 'student001@example.com',
    phone: '13800138002',
    status: 'active',
    lastLogin: '2024-01-15 10:15:00'
  },
  {
    id: 3,
    username: 'teacher002',
    realName: '李晓雯',
    role: 'teacher',
    email: 'teacher002@example.com',
    phone: '13800138003',
    status: 'active',
    lastLogin: '2024-01-14 16:20:00'
  },
  {
    id: 4,
    username: 'student002',
    realName: '赵同学',
    role: 'student',
    email: 'student002@example.com',
    phone: '13800138004',
    status: 'inactive',
    lastLogin: '2024-01-10 14:30:00'
  }
])

const filteredTableData = computed(() => {
  let filtered = tableData.value
  
  if (filterRole.value) {
    filtered = filtered.filter(item => item.role === filterRole.value)
  }
  
  if (searchKeyword.value) {
    filtered = filtered.filter(item => 
      item.username.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.realName.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.email.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  return filtered
})

const handleAdd = () => {
  ElMessage.info('新增用户功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleEdit = (row: User) => {
  ElMessage.info(`编辑用户: ${row.realName}`)
}

const handleResetPassword = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 "${row.realName}" 的密码吗？`,
      '重置密码确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('密码重置成功，新密码已发送到用户邮箱')
  } catch {
    // 用户取消
  }
}

const handleToggleStatus = async (row: User) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${row.realName}" 吗？`,
      `${action}用户确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`用户${action}成功`)
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

onMounted(() => {
  total.value = tableData.value.length
})
</script>

<style scoped>
.user-management {
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
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>