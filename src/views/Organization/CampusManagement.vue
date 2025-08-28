<template>
  <div class="campus-management">
    <div class="page-header">
      <h2>校区管理</h2>
      <p>管理学校的各个校区信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增校区
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索校区名称"
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
        <el-table-column prop="name" label="校区名称" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="collegeCount" label="学院数量" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Refresh, Search } from "@element-plus/icons-vue";

interface Campus {
  id: number;
  name: string;
  address: string;
  collegeCount: number;
  studentCount: number;
  status: "active" | "inactive";
}

const loading = ref(false);
const searchKeyword = ref("");

const tableData = ref<Campus[]>([
  {
    id: 1,
    name: "主校区",
    address: "北京市海淀区学院路1号",
    collegeCount: 15,
    studentCount: 12000,
    status: "active",
  },
  {
    id: 2,
    name: "东校区",
    address: "北京市朝阳区东三环北路2号",
    collegeCount: 8,
    studentCount: 6000,
    status: "active",
  },
]);

const handleAdd = () => {
  ElMessage.info("新增校区功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleEdit = (row: Campus) => {
  ElMessage.info(`编辑校区: ${row.name}`);
};

const handleDelete = (row: Campus) => {
  ElMessage.info(`删除校区: ${row.name}`);
};
</script>

<style scoped>
.campus-management {
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
