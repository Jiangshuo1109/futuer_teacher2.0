<template>
  <div class="evaluation-system-library">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>教学评价体系库</h2>
      <p>管理教学评价模板，支持评价标准设置和课程关联</p>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        创建评价模板
      </el-button>
      <el-button type="default" @click="refreshData">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索评价模板名称或标签"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 评价模板列表 -->
    <div class="content-card">
      <el-table
        :data="filteredTemplateList"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="模板名称" min-width="200">
          <template #default="{ row }">
            <div class="template-name">
              <span>{{ row.name }}</span>
              <el-tag v-if="row.isDefault" type="success" size="small"
                >默认</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="250"
          show-overflow-tooltip
        />
        <el-table-column prop="courseCount" label="关联课程" width="100">
          <template #default="{ row }">
            <el-link type="primary" @click="viewCourses(row)"
              >{{ row.courseCount }}门</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              style="margin-right: 4px"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="toggleStatus(row)"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="default" size="small" @click="viewDetail(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="default" size="small" @click="editTemplate(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="default" size="small" @click="setStandards(row)">
              <el-icon><Setting /></el-icon>
              评价标准
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteTemplate(row.id)"
            >
              <el-icon><Delete /></el-icon>
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

    <!-- 创建/编辑评价模板对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="isEdit ? '编辑评价模板' : '创建评价模板'"
      width="900px"
      :before-close="handleCreateDialogClose"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="120px"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="createForm.name"
            placeholder="请输入评价模板名称"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入评价模板描述"
          />
        </el-form-item>

        <!-- 评价维度字段 -->
        <div class="evaluation-fields">
          <h4>评价维度字段</h4>

          <el-form-item label="教学目标" prop="teachingGoals">
            <el-input
              v-model="createForm.teachingGoals"
              placeholder="请输入教学目标字段名称"
            />
          </el-form-item>

          <el-form-item label="教学内容" prop="teachingContent">
            <el-input
              v-model="createForm.teachingContent"
              placeholder="请输入教学内容字段名称"
            />
          </el-form-item>

          <el-form-item label="教学方法" prop="teachingMethods">
            <el-input
              v-model="createForm.teachingMethods"
              placeholder="请输入教学方法字段名称"
            />
          </el-form-item>

          <el-form-item label="教学效果" prop="teachingEffects">
            <el-input
              v-model="createForm.teachingEffects"
              placeholder="请输入教学效果字段名称"
            />
          </el-form-item>

          <el-form-item label="课堂管理" prop="classroomManagement">
            <el-input
              v-model="createForm.classroomManagement"
              placeholder="请输入课堂管理字段名称"
            />
          </el-form-item>
        </div>

        <el-form-item label="关联课程" prop="courseIds">
          <el-select
            v-model="createForm.courseIds"
            multiple
            placeholder="请选择关联课程"
            style="width: 100%"
          >
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="createForm.tags"
            multiple
            filterable
            allow-create
            placeholder="请输入或选择标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="createForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCreateDialogClose">取消</el-button>
          <el-button type="primary" @click="submitCreate" :loading="submitting">
            {{ submitting ? "保存中..." : "确认" }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 评价模板详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="评价模板详情" width="800px">
      <div v-if="currentTemplate" class="template-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="模板名称">{{
            currentTemplate.name
          }}</el-descriptions-item>
          <el-descriptions-item label="关联课程"
            >{{ currentTemplate.courseCount }}门</el-descriptions-item
          >
          <el-descriptions-item label="状态">
            <el-tag :type="currentTemplate.enabled ? 'success' : 'danger'">
              {{ currentTemplate.enabled ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="默认模板">
            <el-tag :type="currentTemplate.isDefault ? 'success' : 'info'">
              {{ currentTemplate.isDefault ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{
            currentTemplate.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{
            currentTemplate.description
          }}</el-descriptions-item>
        </el-descriptions>

        <div class="evaluation-dimensions" style="margin-top: 20px">
          <h4>评价维度</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="教学目标">{{
              currentTemplate.teachingGoals
            }}</el-descriptions-item>
            <el-descriptions-item label="教学内容">{{
              currentTemplate.teachingContent
            }}</el-descriptions-item>
            <el-descriptions-item label="教学方法">{{
              currentTemplate.teachingMethods
            }}</el-descriptions-item>
            <el-descriptions-item label="教学效果">{{
              currentTemplate.teachingEffects
            }}</el-descriptions-item>
            <el-descriptions-item label="课堂管理">{{
              currentTemplate.classroomManagement
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="tags-section">
          <h4>标签</h4>
          <el-tag
            v-for="tag in currentTemplate.tags"
            :key="tag"
            style="margin-right: 8px; margin-bottom: 8px"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-dialog>

    <!-- 关联课程对话框 -->
    <el-dialog v-model="showCoursesDialog" title="关联课程列表" width="600px">
      <el-table :data="relatedCourses" stripe>
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="code" label="课程代码" width="120" />
        <el-table-column prop="credits" label="学分" width="80" />
        <el-table-column prop="type" label="课程类型" width="100" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Refresh,
  Search,
  View,
  Edit,
  Delete,
  Setting,
} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

// 接口定义
interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  teachingGoals: string;
  teachingContent: string;
  teachingMethods: string;
  teachingEffects: string;
  classroomManagement: string;
  courseIds: string[];
  courseCount: number;
  tags: string[];
  enabled: boolean;
  isDefault: boolean;
  createTime: string;
  standards?: EvaluationStandards;
}

interface EvaluationStandards {
  teachingGoalsStandard: StandardLevels;
  teachingContentStandard: StandardLevels;
  teachingMethodsStandard: StandardLevels;
  teachingEffectsStandard: StandardLevels;
  classroomManagementStandard: StandardLevels;
}

interface StandardLevels {
  excellent: string; // 优秀
  good: string; // 良好
  average: string; // 中等
  poor: string; // 较差
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: string;
}

const router = useRouter();

// 响应式数据
const loading = ref(false);
const submitting = ref(false);

const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const showCreateDialog = ref(false);
const showDetailDialog = ref(false);
const showCoursesDialog = ref(false);

const isEdit = ref(false);
const currentTemplate = ref<EvaluationTemplate | null>(null);
const relatedCourses = ref<Course[]>([]);

const createFormRef = ref<FormInstance>();

// 表单数据
const createForm = reactive({
  name: "",
  description: "",
  teachingGoals: "",
  teachingContent: "",
  teachingMethods: "",
  teachingEffects: "",
  classroomManagement: "",
  courseIds: [] as string[],
  tags: [] as string[],
  isDefault: false,
});

// 验证规则
const createRules: FormRules = {
  name: [{ required: true, message: "请输入评价模板名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  teachingGoals: [
    { required: true, message: "请输入教学目标字段名称", trigger: "blur" },
  ],
  teachingContent: [
    { required: true, message: "请输入教学内容字段名称", trigger: "blur" },
  ],
  teachingMethods: [
    { required: true, message: "请输入教学方法字段名称", trigger: "blur" },
  ],
  teachingEffects: [
    { required: true, message: "请输入教学效果字段名称", trigger: "blur" },
  ],
  classroomManagement: [
    { required: true, message: "请输入课堂管理字段名称", trigger: "blur" },
  ],
};

// 模拟数据
const templateList = ref<EvaluationTemplate[]>([
  {
    id: "1",
    name: "师范生教学技能评价模板",
    description:
      "针对师范生教学技能的综合评价模板，包含教学设计、课堂实施、教学反思等维度",
    teachingGoals: "教学目标",
    teachingContent: "教学内容",
    teachingMethods: "教学方法与基本功",
    teachingEffects: "教学效果",
    classroomManagement: "课堂管理",
    courseIds: ["1", "2", "3"],
    courseCount: 3,
    tags: ["师范生", "教学技能", "综合评价"],
    enabled: true,
    isDefault: true,
    createTime: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    name: "实习教师课堂表现评价模板",
    description: "专门用于评价实习教师在真实课堂环境中的教学表现",
    teachingGoals: "教学目标",
    teachingContent: "教学内容",
    teachingMethods: "教学方法与基本功",
    teachingEffects: "教学效果",
    classroomManagement: "课堂管理",
    courseIds: ["4", "5"],
    courseCount: 2,
    tags: ["实习教师", "课堂表现"],
    enabled: true,
    isDefault: false,
    createTime: "2024-01-10 14:20:00",
  },
]);

const courseList = ref<Course[]>([
  { id: "1", name: "教育学原理", code: "EDU101", credits: 3, type: "必修" },
  { id: "2", name: "心理学基础", code: "PSY101", credits: 3, type: "必修" },
  { id: "3", name: "教学设计", code: "TED201", credits: 2, type: "专业" },
  { id: "4", name: "课堂管理", code: "CMG201", credits: 2, type: "专业" },
  { id: "5", name: "教育技术学", code: "ETL301", credits: 2, type: "选修" },
]);

const availableTags = ref([
  "师范生",
  "实习教师",
  "教学技能",
  "课堂表现",
  "综合评价",
  "教学设计",
  "课堂实施",
  "教学反思",
  "专业发展",
]);

// 计算属性
const filteredTemplateList = computed(() => {
  if (!searchKeyword.value) {
    return templateList.value;
  }
  return templateList.value.filter(
    (item) =>
      item.name.includes(searchKeyword.value) ||
      item.tags.some((tag) => tag.includes(searchKeyword.value)),
  );
});

// 方法
const refreshData = () => {
  ElMessage.success("数据已刷新");
  // 这里可以调用API刷新数据
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const toggleStatus = (id: string) => {
  const template = templateList.value.find((item) => item.id === id);
  if (template) {
    template.enabled = !template.enabled;
    ElMessage.success(`评价模板已${template.enabled ? "启用" : "禁用"}`);
  }
};

const viewDetail = (template: EvaluationTemplate) => {
  currentTemplate.value = template;
  showDetailDialog.value = true;
};

const viewCourses = (template: EvaluationTemplate) => {
  relatedCourses.value = courseList.value.filter((course) =>
    template.courseIds.includes(course.id),
  );
  showCoursesDialog.value = true;
};

const editTemplate = (template: EvaluationTemplate) => {
  isEdit.value = true;
  Object.assign(createForm, {
    name: template.name,
    description: template.description,
    teachingGoals: template.teachingGoals,
    teachingContent: template.teachingContent,
    teachingMethods: template.teachingMethods,
    teachingEffects: template.teachingEffects,
    classroomManagement: template.classroomManagement,
    courseIds: [...template.courseIds],
    tags: [...template.tags],
    isDefault: template.isDefault,
  });
  showCreateDialog.value = true;
};

const setStandards = (template: EvaluationTemplate) => {
  // 跳转到评价标准编辑页面，传递模板ID
  router.push({
    name: "EvaluationStandardsEditor",
    query: {
      templateId: template.id,
      templateName: template.name,
    },
  });
};

const deleteTemplate = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这个评价模板吗？删除后无法恢复。",
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const index = templateList.value.findIndex((item) => item.id === id);
    if (index > -1) {
      templateList.value.splice(index, 1);
      ElMessage.success("评价模板删除成功");
    }
  } catch {
    ElMessage.info("已取消删除");
  }
};

const submitCreate = async () => {
  if (!createFormRef.value) return;

  try {
    await createFormRef.value.validate();
    submitting.value = true;

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isEdit.value) {
      // 编辑逻辑
      const template = templateList.value.find(
        (t) => t.id === currentTemplate.value?.id,
      );
      if (template) {
        Object.assign(template, {
          name: createForm.name,
          description: createForm.description,
          teachingGoals: createForm.teachingGoals,
          teachingContent: createForm.teachingContent,
          teachingMethods: createForm.teachingMethods,
          teachingEffects: createForm.teachingEffects,
          classroomManagement: createForm.classroomManagement,
          courseIds: [...createForm.courseIds],
          courseCount: createForm.courseIds.length,
          tags: [...createForm.tags],
          isDefault: createForm.isDefault,
        });
      }
      ElMessage.success("评价模板更新成功");
    } else {
      // 创建新评价模板
      const newTemplate: EvaluationTemplate = {
        id: Date.now().toString(),
        name: createForm.name,
        description: createForm.description,
        teachingGoals: createForm.teachingGoals,
        teachingContent: createForm.teachingContent,
        teachingMethods: createForm.teachingMethods,
        teachingEffects: createForm.teachingEffects,
        classroomManagement: createForm.classroomManagement,
        courseIds: [...createForm.courseIds],
        courseCount: createForm.courseIds.length,
        tags: [...createForm.tags],
        enabled: true,
        isDefault: createForm.isDefault,
        createTime: new Date().toLocaleString("zh-CN"),
      };

      if (createForm.isDefault) {
        templateList.value.forEach((item) => (item.isDefault = false));
      }

      templateList.value.unshift(newTemplate);
      ElMessage.success("评价模板创建成功");
    }

    handleCreateDialogClose();
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitting.value = false;
  }
};

const handleCreateDialogClose = () => {
  showCreateDialog.value = false;
  isEdit.value = false;
  createFormRef.value?.resetFields();
  Object.assign(createForm, {
    name: "",
    description: "",
    teachingGoals: "",
    teachingContent: "",
    teachingMethods: "",
    teachingEffects: "",
    classroomManagement: "",
    courseIds: [],
    tags: [],
    isDefault: false,
  });
};

onMounted(() => {
  total.value = templateList.value.length;
});
</script>

<style scoped>
.evaluation-system-library {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.page-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  margin-left: auto;
  width: 300px;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.system-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.template-toolbar {
  margin-bottom: 16px;
}

.evaluation-dimensions {
  margin-top: 20px;
}

.evaluation-dimensions h4 {
  margin: 0 0 16px 0;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.system-detail {
  margin-bottom: 20px;
}

.tags-section {
  margin-top: 20px;
}

.tags-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
