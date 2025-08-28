<template>
  <div class="semantic-library">
    <div class="page-header">
      <h2>语义库</h2>
      <p>管理和维护教学语义信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加语义
          </el-button>
          <el-button type="default" @click="handleBatchImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button type="default" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
          <el-button type="default" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="selectedCategory"
            placeholder="语义分类"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部分类" value="" />
            <el-option label="教学行为" value="teaching" />
            <el-option label="学习行为" value="learning" />
            <el-option label="情感表达" value="emotion" />
            <el-option label="知识概念" value="concept" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索语义名称或描述"
            style="width: 250px"
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
        <el-table-column prop="name" label="语义名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryTagType(row.category)" size="small">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="语义描述"
          min-width="300"
          show-overflow-tooltip
        />
        <el-table-column prop="keywords" label="关键词" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="keyword in row.keywords"
              :key="keyword"
              size="small"
              style="margin-right: 4px"
            >
              {{ keyword }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
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
              type="success"
              size="small"
              text
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              :type="row.status === 'active' ? 'warning' : 'success'"
              size="small"
              text
              @click="handleToggleStatus(row)"
            >
              {{ row.status === "active" ? "禁用" : "启用" }}
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

    <!-- 添加/编辑语义对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form
        :model="semanticForm"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="语义名称" prop="name">
          <el-input v-model="semanticForm.name" placeholder="请输入语义名称" />
        </el-form-item>
        <el-form-item label="语义分类" prop="category">
          <el-select
            v-model="semanticForm.category"
            placeholder="请选择语义分类"
            style="width: 100%"
          >
            <el-option label="教学行为" value="teaching" />
            <el-option label="学习行为" value="learning" />
            <el-option label="情感表达" value="emotion" />
            <el-option label="知识概念" value="concept" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-select
            v-model="semanticForm.keywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键词，按回车添加"
            style="width: 100%"
          >
          </el-select>
          <div class="form-tip">输入关键词后按回车键添加，可添加多个关键词</div>
        </el-form-item>
        <el-form-item label="语义描述" prop="description">
          <el-input
            v-model="semanticForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入详细的语义描述"
          />
        </el-form-item>
        <el-form-item label="示例用法">
          <el-input
            v-model="semanticForm.example"
            type="textarea"
            :rows="3"
            placeholder="请输入语义的示例用法（可选）"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="semanticForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 语义详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="语义详情" width="700px">
      <div v-if="currentSemantic" class="semantic-detail">
        <div class="detail-section">
          <h3>基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="语义名称">{{
              currentSemantic.name
            }}</el-descriptions-item>
            <el-descriptions-item label="分类">
              <el-tag :type="getCategoryTagType(currentSemantic.category)">
                {{ getCategoryLabel(currentSemantic.category) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag
                :type="currentSemantic.status === 'active' ? 'success' : 'info'"
              >
                {{ currentSemantic.status === "active" ? "启用" : "禁用" }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="使用次数">{{
              currentSemantic.usageCount
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              currentSemantic.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{
              currentSemantic.updateTime
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h3>关键词</h3>
          <div class="keywords-container">
            <el-tag
              v-for="keyword in currentSemantic.keywords"
              :key="keyword"
              size="large"
              style="margin: 4px"
            >
              {{ keyword }}
            </el-tag>
          </div>
        </div>

        <div class="detail-section">
          <h3>语义描述</h3>
          <div class="description-content">
            {{ currentSemantic.description }}
          </div>
        </div>

        <div v-if="currentSemantic.example" class="detail-section">
          <h3>示例用法</h3>
          <div class="example-content">
            {{ currentSemantic.example }}
          </div>
        </div>

        <div class="detail-section">
          <h3>使用统计</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">{{ currentSemantic.usageCount }}</div>
                <div class="stat-label">总使用次数</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">
                  {{ currentSemantic.monthlyUsage || 0 }}
                </div>
                <div class="stat-label">本月使用</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-number">
                  {{ currentSemantic.weeklyUsage || 0 }}
                </div>
                <div class="stat-label">本周使用</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Upload,
  Download,
  Refresh,
  Search,
} from "@element-plus/icons-vue";

interface Semantic {
  id: number;
  name: string;
  category: string;
  description: string;
  keywords: string[];
  example?: string;
  usageCount: number;
  status: "active" | "inactive";
  createTime: string;
  updateTime: string;
  monthlyUsage?: number;
  weeklyUsage?: number;
}

const loading = ref(false);
const searchKeyword = ref("");
const selectedCategory = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const dialogVisible = ref(false);
const detailDialogVisible = ref(false);
const dialogTitle = ref("添加语义");
const currentSemantic = ref<Semantic | null>(null);
const formRef = ref();

const semanticForm = reactive({
  id: null as number | null,
  name: "",
  category: "",
  description: "",
  keywords: [] as string[],
  example: "",
  status: "active" as "active" | "inactive",
});

const formRules = {
  name: [{ required: true, message: "请输入语义名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择语义分类", trigger: "change" }],
  description: [{ required: true, message: "请输入语义描述", trigger: "blur" }],
  keywords: [
    { required: true, message: "请至少添加一个关键词", trigger: "change" },
  ],
};

const tableData = ref<Semantic[]>([
  {
    id: 1,
    name: "提问行为",
    category: "teaching",
    description: "教师在课堂上向学生提出问题，引导学生思考和回答的教学行为",
    keywords: ["提问", "问题", "引导", "思考"],
    example: '"同学们，你们认为这个问题应该怎么解决？"',
    usageCount: 156,
    status: "active",
    createTime: "2024-01-15",
    updateTime: "2024-01-20",
    monthlyUsage: 45,
    weeklyUsage: 12,
  },
  {
    id: 2,
    name: "积极回应",
    category: "learning",
    description: "学生对教师提问或教学内容表现出积极的回应和参与",
    keywords: ["回应", "积极", "参与", "互动"],
    example: "学生主动举手回答问题，表现出浓厚的学习兴趣",
    usageCount: 89,
    status: "active",
    createTime: "2024-01-10",
    updateTime: "2024-01-18",
    monthlyUsage: 28,
    weeklyUsage: 8,
  },
  {
    id: 3,
    name: "困惑表达",
    category: "emotion",
    description: "学生在学习过程中遇到困难时表现出的困惑和不理解的情感状态",
    keywords: ["困惑", "不理解", "疑问", "困难"],
    usageCount: 67,
    status: "active",
    createTime: "2024-01-08",
    updateTime: "2024-01-16",
    monthlyUsage: 20,
    weeklyUsage: 5,
  },
]);

const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    teaching: "教学行为",
    learning: "学习行为",
    emotion: "情感表达",
    concept: "知识概念",
  };
  return categoryMap[category] || category;
};

const getCategoryTagType = (category: string) => {
  const tagMap: Record<string, string> = {
    teaching: "primary",
    learning: "success",
    emotion: "warning",
    concept: "info",
  };
  return tagMap[category] || "info";
};

const handleAdd = () => {
  dialogTitle.value = "添加语义";
  dialogVisible.value = true;
};

const handleEdit = (row: Semantic) => {
  dialogTitle.value = "编辑语义";
  Object.assign(semanticForm, row);
  dialogVisible.value = true;
};

const handleView = (row: Semantic) => {
  currentSemantic.value = row;
  detailDialogVisible.value = true;
};

const handleDelete = async (row: Semantic) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除语义 "${row.name}" 吗？`,
      "确认删除",
      {
        type: "warning",
      },
    );
    ElMessage.success("删除成功");
  } catch {
    ElMessage.info("已取消删除");
  }
};

const handleToggleStatus = async (row: Semantic) => {
  const action = row.status === "active" ? "禁用" : "启用";
  try {
    await ElMessageBox.confirm(
      `确定要${action}语义 "${row.name}" 吗？`,
      `确认${action}`,
      {
        type: "warning",
      },
    );
    row.status = row.status === "active" ? "inactive" : "active";
    ElMessage.success(`${action}成功`);
  } catch {
    ElMessage.info(`已取消${action}`);
  }
};

const handleBatchImport = () => {
  ElMessage.info("批量导入功能开发中");
};

const handleExport = () => {
  ElMessage.info("导出数据功能开发中");
};

const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    ElMessage.success(semanticForm.id ? "修改成功" : "添加成功");
    dialogVisible.value = false;
    resetForm();
  } catch {
    ElMessage.error("请检查表单信息");
  }
};

const resetForm = () => {
  Object.assign(semanticForm, {
    id: null,
    name: "",
    category: "",
    description: "",
    keywords: [],
    example: "",
    status: "active",
  });
  formRef.value?.resetFields();
};
</script>

<style scoped>
.semantic-library {
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

/* 使用全局content-card样式，移除重复定义 */

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.semantic-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.keywords-container {
  min-height: 40px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.description-content,
.example-content {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  color: #606266;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}
</style>
