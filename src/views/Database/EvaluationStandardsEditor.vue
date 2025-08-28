<template>
  <div class="evaluation-standards-editor">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="title-section">
          <h2>评价标准设置</h2>
          <p>为「{{ templateName }}」设置详细的评价标准</p>
        </div>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          @click="generateAllStandards"
          :loading="generating"
        >
          <el-icon><MagicStick /></el-icon>
          AI生成全部标准
        </el-button>
      </div>
    </div>

    <!-- 评价标准表单 -->
    <div class="standards-content">
      <el-form
        ref="standardsFormRef"
        :model="standardsForm"
        :rules="standardsRules"
        label-width="140px"
        class="standards-form"
      >
        <!-- 教学目标评价标准 -->
        <div class="standard-section">
          <div class="section-header">
            <h3>教学目标评价标准</h3>
            <el-button
              size="small"
              @click="generateStandard('teachingGoals')"
              :loading="generating"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成
            </el-button>
          </div>
          <div class="level-grid">
            <el-form-item
              label="优秀 (90-100分)"
              prop="teachingGoalsStandard.excellent"
            >
              <el-input
                v-model="standardsForm.teachingGoalsStandard.excellent"
                type="textarea"
                :rows="3"
                placeholder="请输入优秀等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="良好 (80-89分)"
              prop="teachingGoalsStandard.good"
            >
              <el-input
                v-model="standardsForm.teachingGoalsStandard.good"
                type="textarea"
                :rows="3"
                placeholder="请输入良好等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="中等 (70-79分)"
              prop="teachingGoalsStandard.average"
            >
              <el-input
                v-model="standardsForm.teachingGoalsStandard.average"
                type="textarea"
                :rows="3"
                placeholder="请输入中等等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="较差 (60-69分)"
              prop="teachingGoalsStandard.poor"
            >
              <el-input
                v-model="standardsForm.teachingGoalsStandard.poor"
                type="textarea"
                :rows="3"
                placeholder="请输入较差等级的评价标准"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 教学内容评价标准 -->
        <div class="standard-section">
          <div class="section-header">
            <h3>教学内容评价标准</h3>
            <el-button
              size="small"
              @click="generateStandard('teachingContent')"
              :loading="generating"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成
            </el-button>
          </div>
          <div class="level-grid">
            <el-form-item
              label="优秀 (90-100分)"
              prop="teachingContentStandard.excellent"
            >
              <el-input
                v-model="standardsForm.teachingContentStandard.excellent"
                type="textarea"
                :rows="3"
                placeholder="请输入优秀等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="良好 (80-89分)"
              prop="teachingContentStandard.good"
            >
              <el-input
                v-model="standardsForm.teachingContentStandard.good"
                type="textarea"
                :rows="3"
                placeholder="请输入良好等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="中等 (70-79分)"
              prop="teachingContentStandard.average"
            >
              <el-input
                v-model="standardsForm.teachingContentStandard.average"
                type="textarea"
                :rows="3"
                placeholder="请输入中等等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="较差 (60-69分)"
              prop="teachingContentStandard.poor"
            >
              <el-input
                v-model="standardsForm.teachingContentStandard.poor"
                type="textarea"
                :rows="3"
                placeholder="请输入较差等级的评价标准"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 教学方法评价标准 -->
        <div class="standard-section">
          <div class="section-header">
            <h3>教学方法评价标准</h3>
            <el-button
              size="small"
              @click="generateStandard('teachingMethods')"
              :loading="generating"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成
            </el-button>
          </div>
          <div class="level-grid">
            <el-form-item
              label="优秀 (90-100分)"
              prop="teachingMethodsStandard.excellent"
            >
              <el-input
                v-model="standardsForm.teachingMethodsStandard.excellent"
                type="textarea"
                :rows="3"
                placeholder="请输入优秀等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="良好 (80-89分)"
              prop="teachingMethodsStandard.good"
            >
              <el-input
                v-model="standardsForm.teachingMethodsStandard.good"
                type="textarea"
                :rows="3"
                placeholder="请输入良好等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="中等 (70-79分)"
              prop="teachingMethodsStandard.average"
            >
              <el-input
                v-model="standardsForm.teachingMethodsStandard.average"
                type="textarea"
                :rows="3"
                placeholder="请输入中等等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="较差 (60-69分)"
              prop="teachingMethodsStandard.poor"
            >
              <el-input
                v-model="standardsForm.teachingMethodsStandard.poor"
                type="textarea"
                :rows="3"
                placeholder="请输入较差等级的评价标准"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 教学效果评价标准 -->
        <div class="standard-section">
          <div class="section-header">
            <h3>教学效果评价标准</h3>
            <el-button
              size="small"
              @click="generateStandard('teachingEffects')"
              :loading="generating"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成
            </el-button>
          </div>
          <div class="level-grid">
            <el-form-item
              label="优秀 (90-100分)"
              prop="teachingEffectsStandard.excellent"
            >
              <el-input
                v-model="standardsForm.teachingEffectsStandard.excellent"
                type="textarea"
                :rows="3"
                placeholder="请输入优秀等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="良好 (80-89分)"
              prop="teachingEffectsStandard.good"
            >
              <el-input
                v-model="standardsForm.teachingEffectsStandard.good"
                type="textarea"
                :rows="3"
                placeholder="请输入良好等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="中等 (70-79分)"
              prop="teachingEffectsStandard.average"
            >
              <el-input
                v-model="standardsForm.teachingEffectsStandard.average"
                type="textarea"
                :rows="3"
                placeholder="请输入中等等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="较差 (60-69分)"
              prop="teachingEffectsStandard.poor"
            >
              <el-input
                v-model="standardsForm.teachingEffectsStandard.poor"
                type="textarea"
                :rows="3"
                placeholder="请输入较差等级的评价标准"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 课堂管理评价标准 -->
        <div class="standard-section">
          <div class="section-header">
            <h3>课堂管理评价标准</h3>
            <el-button
              size="small"
              @click="generateStandard('classroomManagement')"
              :loading="generating"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成
            </el-button>
          </div>
          <div class="level-grid">
            <el-form-item
              label="优秀 (90-100分)"
              prop="classroomManagementStandard.excellent"
            >
              <el-input
                v-model="standardsForm.classroomManagementStandard.excellent"
                type="textarea"
                :rows="3"
                placeholder="请输入优秀等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="良好 (80-89分)"
              prop="classroomManagementStandard.good"
            >
              <el-input
                v-model="standardsForm.classroomManagementStandard.good"
                type="textarea"
                :rows="3"
                placeholder="请输入良好等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="中等 (70-79分)"
              prop="classroomManagementStandard.average"
            >
              <el-input
                v-model="standardsForm.classroomManagementStandard.average"
                type="textarea"
                :rows="3"
                placeholder="请输入中等等级的评价标准"
              />
            </el-form-item>
            <el-form-item
              label="较差 (60-69分)"
              prop="classroomManagementStandard.poor"
            >
              <el-input
                v-model="standardsForm.classroomManagementStandard.poor"
                type="textarea"
                :rows="3"
                placeholder="请输入较差等级的评价标准"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 底部操作按钮 -->
    <div class="footer-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveStandards" :loading="submitting">
        保存评价标准
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, MagicStick } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

// 接口定义
interface StandardLevels {
  excellent: string; // 优秀
  good: string; // 良好
  average: string; // 中等
  poor: string; // 较差
}

interface EvaluationStandards {
  teachingGoalsStandard: StandardLevels;
  teachingContentStandard: StandardLevels;
  teachingMethodsStandard: StandardLevels;
  teachingEffectsStandard: StandardLevels;
  classroomManagementStandard: StandardLevels;
}

interface TemplateInfo {
  id: string;
  name: string;
  teachingGoals: string;
  teachingContent: string;
  teachingMethods: string;
  teachingEffects: string;
  classroomManagement: string;
}

const router = useRouter();
const route = useRoute();

// 响应式数据
const submitting = ref(false);
const generating = ref(false);
const templateName = ref("");
const templateInfo = ref<TemplateInfo | null>(null);
const standardsFormRef = ref<FormInstance>();

// 表单数据
const standardsForm = reactive<EvaluationStandards>({
  teachingGoalsStandard: {
    excellent: "",
    good: "",
    average: "",
    poor: "",
  },
  teachingContentStandard: {
    excellent: "",
    good: "",
    average: "",
    poor: "",
  },
  teachingMethodsStandard: {
    excellent: "",
    good: "",
    average: "",
    poor: "",
  },
  teachingEffectsStandard: {
    excellent: "",
    good: "",
    average: "",
    poor: "",
  },
  classroomManagementStandard: {
    excellent: "",
    good: "",
    average: "",
    poor: "",
  },
});

// 表单验证规则
const standardsRules: FormRules = {
  "teachingGoalsStandard.excellent": [
    {
      required: true,
      message: "请输入教学目标优秀等级评价标准",
      trigger: "blur",
    },
  ],
  "teachingGoalsStandard.good": [
    {
      required: true,
      message: "请输入教学目标良好等级评价标准",
      trigger: "blur",
    },
  ],
  "teachingGoalsStandard.average": [
    {
      required: true,
      message: "请输入教学目标中等等级评价标准",
      trigger: "blur",
    },
  ],
  "teachingGoalsStandard.poor": [
    {
      required: true,
      message: "请输入教学目标较差等级评价标准",
      trigger: "blur",
    },
  ],
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 模拟AI生成单个维度的评价标准
const generateStandard = async (dimension: string) => {
  if (!templateInfo.value) {
    ElMessage.warning("模板信息不完整，无法生成评价标准");
    return;
  }

  generating.value = true;
  try {
    // 模拟AI生成延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const dimensionMap: Record<string, keyof EvaluationStandards> = {
      teachingGoals: "teachingGoalsStandard",
      teachingContent: "teachingContentStandard",
      teachingMethods: "teachingMethodsStandard",
      teachingEffects: "teachingEffectsStandard",
      classroomManagement: "classroomManagementStandard",
    };

    const standardKey = dimensionMap[dimension];
    if (standardKey) {
      // 模拟生成的评价标准
      const mockStandards = {
        teachingGoalsStandard: {
          excellent:
            "教学目标明确具体，符合课程标准和学生实际；目标表述准确，层次清晰；能够有效指导教学活动的开展。",
          good: "教学目标较为明确，基本符合课程要求；目标表述比较准确，层次较清晰；能够指导教学活动。",
          average:
            "教学目标基本明确，符合基本要求；目标表述一般，层次不够清晰；对教学活动指导作用有限。",
          poor: "教学目标不够明确，不符合课程要求；目标表述模糊，层次混乱；对教学活动缺乏有效指导。",
        },
        teachingContentStandard: {
          excellent:
            "教学内容准确无误，重点突出，难点处理得当；内容安排合理，逻辑清晰；与教学目标高度匹配。",
          good: "教学内容基本准确，重点比较突出，难点处理较好；内容安排较合理，逻辑较清晰；与教学目标匹配度较高。",
          average:
            "教学内容基本准确，重点不够突出，难点处理一般；内容安排基本合理，逻辑性一般；与教学目标基本匹配。",
          poor: "教学内容存在错误，重点不突出，难点处理不当；内容安排不合理，逻辑混乱；与教学目标匹配度低。",
        },
        teachingMethodsStandard: {
          excellent:
            "教学方法多样化，选择恰当，运用熟练；能够激发学生学习兴趣，促进学生主动参与；教学手段现代化程度高。",
          good: "教学方法较为多样，选择比较恰当，运用较熟练；能够调动学生学习积极性；教学手段较为现代化。",
          average:
            "教学方法基本多样，选择基本恰当，运用一般；对学生学习积极性调动有限；教学手段一般。",
          poor: "教学方法单一，选择不当，运用不熟练；难以调动学生学习积极性；教学手段落后。",
        },
        teachingEffectsStandard: {
          excellent:
            "学生学习效果显著，知识掌握牢固，能力提升明显；课堂氛围活跃，师生互动良好；教学目标达成度高。",
          good: "学生学习效果较好，知识掌握较牢固，能力有所提升；课堂氛围较活跃，师生互动较好；教学目标达成度较高。",
          average:
            "学生学习效果一般，知识掌握基本牢固，能力提升有限；课堂氛围一般，师生互动不够；教学目标基本达成。",
          poor: "学生学习效果不佳，知识掌握不牢固，能力提升不明显；课堂氛围沉闷，师生互动少；教学目标达成度低。",
        },
        classroomManagementStandard: {
          excellent:
            "课堂纪律良好，学生注意力集中；时间安排合理，节奏把握恰当；突发情况处理及时有效。",
          good: "课堂纪律较好，学生注意力较集中；时间安排较合理，节奏把握较好；突发情况处理较及时。",
          average:
            "课堂纪律基本良好，学生注意力一般；时间安排基本合理，节奏把握一般；突发情况处理能力一般。",
          poor: "课堂纪律较差，学生注意力不集中；时间安排不合理，节奏把握不当；突发情况处理能力差。",
        },
      };

      standardsForm[standardKey] = mockStandards[standardKey];
      ElMessage.success(`${getDimensionName(dimension)}评价标准生成成功`);
    }
  } catch (error) {
    ElMessage.error("生成评价标准失败，请重试");
  } finally {
    generating.value = false;
  }
};

// 生成全部评价标准
const generateAllStandards = async () => {
  if (!templateInfo.value) {
    ElMessage.warning("模板信息不完整，无法生成评价标准");
    return;
  }

  try {
    await ElMessageBox.confirm(
      "确定要使用AI生成全部评价标准吗？这将覆盖当前已填写的内容。",
      "确认生成",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    generating.value = true;

    // 依次生成所有维度的评价标准
    const dimensions = [
      "teachingGoals",
      "teachingContent",
      "teachingMethods",
      "teachingEffects",
      "classroomManagement",
    ];
    for (const dimension of dimensions) {
      await generateStandard(dimension);
      // 添加短暂延迟，避免过快生成
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    ElMessage.success("全部评价标准生成完成");
  } catch {
    // 用户取消操作
  } finally {
    generating.value = false;
  }
};

// 获取维度名称
const getDimensionName = (dimension: string): string => {
  const nameMap: Record<string, string> = {
    teachingGoals: "教学目标",
    teachingContent: "教学内容",
    teachingMethods: "教学方法",
    teachingEffects: "教学效果",
    classroomManagement: "课堂管理",
  };
  return nameMap[dimension] || dimension;
};

// 保存评价标准
const saveStandards = async () => {
  if (!standardsFormRef.value) return;

  try {
    await standardsFormRef.value.validate();

    submitting.value = true;

    // 模拟保存延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success("评价标准保存成功");
    router.back();
  } catch (error) {
    ElMessage.error("请完善必填的评价标准");
  } finally {
    submitting.value = false;
  }
};

// 初始化数据
const initData = () => {
  const templateId = route.query.templateId as string;
  const name = route.query.templateName as string;

  if (templateId && name) {
    templateName.value = name;
    // 这里应该根据templateId获取模板详细信息
    templateInfo.value = {
      id: templateId,
      name: name,
      teachingGoals: "培养学生的数学思维能力和解决问题的能力",
      teachingContent: "二次函数的图像与性质",
      teachingMethods: "讲授法、讨论法、实验法相结合",
      teachingEffects: "学生能够掌握二次函数的基本概念和性质",
      classroomManagement: "维护良好的课堂秩序，营造积极的学习氛围",
    };
  } else {
    ElMessage.error("缺少必要参数，即将返回上一页");
    setTimeout(() => {
      router.back();
    }, 2000);
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.evaluation-standards-editor {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 16px;
}

.title-section h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  color: #303133;
}

.title-section p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.standards-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.standard-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.standard-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.level-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1200px) {
  .level-grid {
    grid-template-columns: 1fr;
  }
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.footer-actions .el-button {
  min-width: 120px;
}
</style>
