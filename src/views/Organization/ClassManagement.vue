<template>
  <div class="class-management">
    <div class="page-header">
      <h2>班级管理</h2>
      <p>管理各个班级的基本信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增班级
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedMajor"
            placeholder="选择专业"
            style="width: 150px; margin-right: 8px"
            clearable
          >
            <el-option label="全部专业" value="" />
            <el-option label="计算机科学与技术" value="计算机科学与技术" />
            <el-option label="软件工程" value="软件工程" />
            <el-option label="学前教育" value="学前教育" />
          </el-select>
          <el-select
            v-model="selectedGrade"
            placeholder="选择年级"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部年级" value="" />
            <el-option label="2021级" value="2021" />
            <el-option label="2022级" value="2022" />
            <el-option label="2023级" value="2023" />
            <el-option label="2024级" value="2024" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索班级名称"
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
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="major" label="所属专业" width="150" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="studentCount" label="学生数量" width="100" />
        <el-table-column prop="advisor" label="班主任" width="120" />
        <el-table-column prop="classroom" label="教室" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
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
              type="info"
              size="small"
              text
              @click="handleViewStudents(row)"
            >
              学生
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

interface Class {
  id: number;
  name: string;
  major: string;
  grade: string;
  studentCount: number;
  advisor: string;
  classroom: string;
  status: "active" | "inactive";
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedMajor = ref("");
const selectedGrade = ref("");

const tableData = ref<Class[]>([
  {
    id: 1,
    name: "计科2021-1班",
    major: "计算机科学与技术",
    grade: "2021",
    studentCount: 42,
    advisor: "陈建国",
    classroom: "A101",
    status: "active",
  },
  {
    id: 2,
    name: "计科2021-2班",
    major: "计算机科学与技术",
    grade: "2021",
    studentCount: 40,
    advisor: "刘雅琴",
    classroom: "A102",
    status: "active",
  },
  {
    id: 3,
    name: "软工2022-1班",
    major: "软件工程",
    grade: "2022",
    studentCount: 38,
    advisor: "张志强",
    classroom: "B201",
    status: "active",
  },
  {
    id: 4,
    name: "学前2023-1班",
    major: "学前教育",
    grade: "2023",
    studentCount: 35,
    advisor: "赵美丽",
    classroom: "C301",
    status: "active",
  },
]);

const handleAdd = () => {
  ElMessage.info("新增班级功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleEdit = (row: Class) => {
  ElMessage.info(`编辑班级: ${row.name}`);
};

const handleViewStudents = (row: Class) => {
  ElMessage.info(`查看班级学生: ${row.name}`);
};

const handleDelete = (row: Class) => {
  ElMessage.info(`删除班级: ${row.name}`);
};
</script>

<style scoped>
.class-management {
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
