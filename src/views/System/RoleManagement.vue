<template>
  <div class="role-management">
    <div class="page-header">
      <h2>角色管理</h2>
      <p>管理系统中的用户角色和权限分配</p>
    </div>

    <div class="content-card">
      <!-- 操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色名称"
            style="width: 200px"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table
        :data="filteredTableData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="userCount" label="用户数量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              text
              @click="handlePermission(row)"
            >
              权限
            </el-button>
            <el-button
              type="danger"
              size="small"
              text
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
import { Plus, Refresh, Search } from '@element-plus/icons-vue'

interface Role {
  id: number
  name: string
  code: string
  description: string
  userCount: number
  status: 'active' | 'inactive'
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟数据
const tableData = ref<Role[]>([
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '系统超级管理员，拥有所有权限',
    userCount: 1,
    status: 'active',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '系统管理员',
    code: 'admin',
    description: '系统管理员，负责系统配置和用户管理',
    userCount: 3,
    status: 'active',
    createTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '教师',
    code: 'teacher',
    description: '教师角色，可以发布和管理教学任务',
    userCount: 25,
    status: 'active',
    createTime: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    name: '学生',
    code: 'student',
    description: '学生角色，可以参与教学任务和实训',
    userCount: 156,
    status: 'active',
    createTime: '2024-01-04 10:00:00'
  },
  {
    id: 5,
    name: '访客',
    code: 'guest',
    description: '访客角色，只有基本的查看权限',
    userCount: 0,
    status: 'inactive',
    createTime: '2024-01-05 10:00:00'
  }
])

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchKeyword.value) {
    return tableData.value
  }
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 刷新数据
const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

// 新增角色
const handleAdd = () => {
  ElMessage.info('新增角色功能开发中')
}

// 编辑角色
const handleEdit = (row: Role) => {
  ElMessage.info(`编辑角色: ${row.name}`)
}

// 权限管理
const handlePermission = (row: Role) => {
  ElMessage.info(`管理角色权限: ${row.name}`)
}

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟删除操作
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 初始化数据
onMounted(() => {
  total.value = tableData.value.length
})
</script>

<style scoped>
.role-management {
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    width: 100%;
  }
  
  .toolbar-right .el-input {
    width: 100% !important;
  }
}
</style>