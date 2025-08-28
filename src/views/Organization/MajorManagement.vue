<template>
  <div class="major-management">
    <div class="page-header">
      <h2>专业管理</h2>
      <p>管理各个专业的基本信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增专业
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedCollege"
            placeholder="选择学院"
            style="width: 150px; margin-right: 8px"
            clearable
          >
            <el-option label="全部学院" value="" />
            <el-option label="计算机学院" value="计算机学院" />
            <el-option label="教育学院" value="教育学院" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索专业名称"
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
        <el-table-column prop="name" label="专业名称" />
        <el-table-column prop="code" label="专业代码" width="120" />
        <el-table-column prop="college" label="所属学院" width="120" />
        <el-table-column prop="classCount" label="班级数量" width="100" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="duration" label="学制" width="80" />
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

interface Major {
  id: number;
  name: string;
  code: string;
  college: string;
  classCount: number;
  studentCount: number;
  duration: string;
  status: "active" | "inactive";
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedCollege = ref("");

const tableData = ref<Major[]>([
  {
    id: 1,
    name: "计算机科学与技术",
    code: "CS001",
    college: "计算机学院",
    classCount: 8,
    studentCount: 320,
    duration: "4年",
    status: "active",
  },
  {
    id: 2,
    name: "软件工程",
    code: "SE001",
    college: "计算机学院",
    classCount: 6,
    studentCount: 240,
    duration: "4年",
    status: "active",
  },
  {
    id: 3,
    name: "学前教育",
    code: "ED001",
    college: "教育学院",
    classCount: 4,
    studentCount: 160,
    duration: "4年",
    status: "active",
  },
]);

const handleAdd = () => {
  ElMessage.info("新增专业功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleEdit = (row: Major) => {
  ElMessage.info(`编辑专业: ${row.name}`);
};

const handleDelete = (row: Major) => {
  ElMessage.info(`删除专业: ${row.name}`);
};
</script>

<style scoped>
.major-management {
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
</style>
