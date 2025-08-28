<template>
  <div class="college-management">
    <div class="page-header">
      <h2>学院管理</h2>
      <p>管理各个学院的基本信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增学院
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索学院名称"
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
        <el-table-column prop="name" label="学院名称" />
        <el-table-column prop="campus" label="所属校区" width="120" />
        <el-table-column prop="majorCount" label="专业数量" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="teacherCount" label="教师数量" width="100" />
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

interface College {
  id: number;
  name: string;
  campus: string;
  majorCount: number;
  studentCount: number;
  teacherCount: number;
  status: "active" | "inactive";
}

const loading = ref(false);
const searchKeyword = ref("");

const tableData = ref<College[]>([
  {
    id: 1,
    name: "计算机学院",
    campus: "主校区",
    majorCount: 5,
    studentCount: 2000,
    teacherCount: 80,
    status: "active",
  },
  {
    id: 2,
    name: "教育学院",
    campus: "主校区",
    majorCount: 3,
    studentCount: 1500,
    teacherCount: 60,
    status: "active",
  },
]);

const handleAdd = () => {
  ElMessage.info("新增学院功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleEdit = (row: College) => {
  ElMessage.info(`编辑学院: ${row.name}`);
};

const handleDelete = (row: College) => {
  ElMessage.info(`删除学院: ${row.name}`);
};
</script>

<style scoped>
.college-management {
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
