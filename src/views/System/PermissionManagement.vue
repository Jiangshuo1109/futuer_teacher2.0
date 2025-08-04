<template>
  <div class="permission-management">
    <div class="page-header">
      <h2>权限管理</h2>
      <p>管理系统中的功能权限和访问控制</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增权限
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索权限名称"
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
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="权限名称" width="200" />
        <el-table-column prop="code" label="权限编码" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'menu' ? 'primary' : 'success'">
              {{ row.type === 'menu' ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'

interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button'
  path?: string
  status: 'active' | 'inactive'
  children?: Permission[]
}

const loading = ref(false)
const searchKeyword = ref('')

const tableData = ref<Permission[]>([
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    type: 'menu',
    path: '/dashboard/system',
    status: 'active',
    children: [
      {
        id: 11,
        name: '角色管理',
        code: 'system:role',
        type: 'menu',
        path: '/dashboard/system/role',
        status: 'active'
      },
      {
        id: 12,
        name: '权限管理',
        code: 'system:permission',
        type: 'menu',
        path: '/dashboard/system/permission',
        status: 'active'
      }
    ]
  },
  {
    id: 2,
    name: '组织管理',
    code: 'organization',
    type: 'menu',
    path: '/dashboard/organization',
    status: 'active',
    children: [
      {
        id: 21,
        name: '用户管理',
        code: 'organization:user',
        type: 'menu',
        path: '/dashboard/organization/user',
        status: 'active'
      }
    ]
  }
])

const handleAdd = () => {
  ElMessage.info('新增权限功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleEdit = (row: Permission) => {
  ElMessage.info(`编辑权限: ${row.name}`)
}

const handleDelete = (row: Permission) => {
  ElMessage.info(`删除权限: ${row.name}`)
}
</script>

<style scoped>
.permission-management {
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
</style>