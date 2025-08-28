<template>
  <div class="course-library">
    <div class="page-header">
      <h2>课程库</h2>
      <p>管理教学课程资源</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增课程
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部分类" value="" />
            <el-option label="语文" value="语文" />
            <el-option label="现代文阅读" value="现代文阅读" />
            <el-option label="古诗词鉴赏" value="古诗词鉴赏" />
            <el-option label="作文指导" value="作文指导" />
          </el-select>
          <el-select
            v-model="selectedLevel"
            placeholder="选择难度"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部难度" value="" />
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索课程名称"
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
        <el-table-column prop="name" label="课程名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="level" label="难度" width="80">
          <template #default="{ row }">
            <el-tag
              :type="
                row.level === '初级'
                  ? 'success'
                  : row.level === '中级'
                    ? 'warning'
                    : 'danger'
              "
              size="small"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="学时" width="80" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="studentCount" label="学习人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 'published'
                  ? 'success'
                  : row.status === 'draft'
                    ? 'warning'
                    : 'info'
              "
            >
              {{
                row.status === "published"
                  ? "已发布"
                  : row.status === "draft"
                    ? "草稿"
                    : "审核中"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button type="info" size="small" text @click="handleCopy(row)">
              复制
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Upload, Refresh, Search } from "@element-plus/icons-vue";

interface Course {
  id: number;
  name: string;
  category: string;
  level: string;
  duration: number;
  teacher: string;
  studentCount: number;
  status: "published" | "draft" | "reviewing";
  createTime: string;
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedCategory = ref("");
const selectedLevel = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const tableData = ref<Course[]>([
  {
    id: 1,
    name: "现代文阅读",
    category: "语文",
    level: "初级",
    duration: 64,
    teacher: "张教授",
    studentCount: 120,
    status: "published",
    createTime: "2024-01-15",
  },
  {
    id: 2,
    name: "古诗词鉴赏",
    category: "语文",
    level: "中级",
    duration: 48,
    teacher: "李教授",
    studentCount: 85,
    status: "published",
    createTime: "2024-01-10",
  },
  {
    id: 3,
    name: "作文指导",
    category: "语文",
    level: "初级",
    duration: 32,
    teacher: "王教授",
    studentCount: 200,
    status: "draft",
    createTime: "2024-01-08",
  },
  {
    id: 4,
    name: "文言文阅读",
    category: "语文",
    level: "初级",
    duration: 40,
    teacher: "赵教授",
    studentCount: 150,
    status: "published",
    createTime: "2024-01-12",
  },
  {
    id: 5,
    name: "语言文字运用",
    category: "语文",
    level: "中级",
    duration: 36,
    teacher: "陈教授",
    studentCount: 95,
    status: "reviewing",
    createTime: "2024-01-25",
  },
]);

const handleAdd = () => {
  ElMessage.info("新增课程功能开发中");
};

const handleImport = () => {
  ElMessage.info("批量导入功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleView = (row: Course) => {
  ElMessage.info(`查看课程: ${row.name}`);
};

const handleEdit = (row: Course) => {
  ElMessage.info(`编辑课程: ${row.name}`);
};

const handleCopy = (row: Course) => {
  ElMessage.info(`复制课程: ${row.name}`);
};

const handleDelete = (row: Course) => {
  ElMessage.info(`删除课程: ${row.name}`);
};
</script>

<style scoped>
.course-library {
  padding: 0;
  position: relative;
}

.page-header {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05),
    rgba(16, 185, 129, 0.03)
  );
  pointer-events: none;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
}

.page-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 15px;
  position: relative;
  z-index: 1;
}

/* 使用全局content-card样式，移除重复定义 */

/* 表格样式增强 - 移除重复样式，使用全局深色主题样式 */

/* 按钮样式增强 */
:deep(.el-button--primary) {
  background: var(--gradient-primary) !important;
  border: none !important;
  transition: all 0.3s ease !important;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

:deep(.el-button) {
  border-radius: var(--radius-md) !important;
  transition: all 0.3s ease !important;
}

:deep(.el-button:hover) {
  transform: translateY(-1px) !important;
}

/* 标签样式增强 */
:deep(.el-tag) {
  border-radius: var(--radius-md) !important;
  backdrop-filter: blur(10px) !important;
  font-weight: 500 !important;
}

/* 选择器和输入框样式 */
:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid var(--border-primary) !important;
  border-radius: var(--radius-md) !important;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid var(--border-primary) !important;
  border-radius: var(--radius-md) !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.3) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}
</style>
