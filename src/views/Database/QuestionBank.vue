<template>
  <div class="question-bank">
    <div class="page-header">
      <h2>题库</h2>
      <p>管理考试题目资源</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增题目
          </el-button>
          <el-button type="default" @click="handleImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button type="default" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedType"
            placeholder="题目类型"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部类型" value="" />
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="填空题" value="blank" />
            <el-option label="简答题" value="short" />
            <el-option label="论述题" value="essay" />
          </el-select>
          <el-select
            v-model="selectedSubject"
            placeholder="学科分类"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部学科" value="" />
            <el-option label="计算机" value="计算机" />
            <el-option label="教育学" value="教育学" />
            <el-option label="数学" value="数学" />
          </el-select>
          <el-select
            v-model="selectedDifficulty"
            placeholder="难度等级"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目内容"
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
        <el-table-column prop="content" label="题目内容" min-width="300">
          <template #default="{ row }">
            <div class="question-content">
              <div class="question-text">{{ row.content }}</div>
              <div class="question-meta">
                <el-tag size="small" :type="getTypeTagType(row.type)">
                  {{ getTypeLabel(row.type) }}
                </el-tag>
                <span class="score">{{ row.score }}分</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="100" />
        <el-table-column prop="chapter" label="章节" width="120" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="{ row }">
            <el-tag
              :type="
                row.difficulty === '简单'
                  ? 'success'
                  : row.difficulty === '中等'
                    ? 'warning'
                    : 'danger'
              "
              size="small"
            >
              {{ row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" width="120" />
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 'approved'
                  ? 'success'
                  : row.status === 'pending'
                    ? 'warning'
                    : 'danger'
              "
            >
              {{
                row.status === "approved"
                  ? "已审核"
                  : row.status === "pending"
                    ? "待审核"
                    : "已拒绝"
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

interface Question {
  id: number;
  content: string;
  type: string;
  subject: string;
  chapter: string;
  difficulty: string;
  score: number;
  creator: string;
  usageCount: number;
  status: "approved" | "pending" | "rejected";
  createTime: string;
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedType = ref("");
const selectedSubject = ref("");
const selectedDifficulty = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const tableData = ref<Question[]>([
  {
    id: 1,
    content: "下列哪个不是Java的基本数据类型？",
    type: "single",
    subject: "计算机",
    chapter: "Java基础",
    difficulty: "简单",
    score: 2,
    creator: "张教授",
    usageCount: 25,
    status: "approved",
    createTime: "2024-01-15",
  },
  {
    id: 2,
    content: "请简述面向对象编程的三大特性。",
    type: "short",
    subject: "计算机",
    chapter: "面向对象",
    difficulty: "中等",
    score: 10,
    creator: "李教授",
    usageCount: 18,
    status: "approved",
    createTime: "2024-01-12",
  },
  {
    id: 3,
    content: "建构主义学习理论的核心观点是什么？",
    type: "essay",
    subject: "教育学",
    chapter: "学习理论",
    difficulty: "困难",
    score: 15,
    creator: "王教授",
    usageCount: 5,
    status: "pending",
    createTime: "2024-01-10",
  },
]);

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
    blank: "填空题",
    short: "简答题",
    essay: "论述题",
  };
  return typeMap[type] || type;
};

const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    single: "primary",
    multiple: "success",
    judge: "warning",
    blank: "info",
    short: "danger",
    essay: "danger",
  };
  return typeMap[type] || "info";
};

const handleAdd = () => {
  ElMessage.info("新增题目功能开发中");
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

const handleView = (row: Question) => {
  ElMessage.info(`查看题目: ${row.content.substring(0, 20)}...`);
};

const handleEdit = (row: Question) => {
  ElMessage.info(`编辑题目: ${row.content.substring(0, 20)}...`);
};

const handleCopy = (row: Question) => {
  ElMessage.info(`复制题目: ${row.content.substring(0, 20)}...`);
};

const handleDelete = (row: Question) => {
  ElMessage.info(`删除题目: ${row.content.substring(0, 20)}...`);
};
</script>

<style scoped>
.question-bank {
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

.question-content {
  padding: 8px 0;
}

.question-text {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.5;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
