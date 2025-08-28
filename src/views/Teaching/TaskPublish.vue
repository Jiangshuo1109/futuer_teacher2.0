<template>
  <div class="task-publish">
    <div class="page-header">
      <h2>教学任务发布</h2>
      <p>发布和管理教学任务</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            新建任务
          </el-button>
          <el-button type="default" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="filterStatus"
            placeholder="全部状态"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部状态" value="" />
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="进行中" value="active" />
            <el-option label="已完成" value="completed" />
          </el-select>
          <el-select
            v-model="filterCourse"
            placeholder="全部课程"
            style="width: 120px; margin-right: 8px"
            clearable
          >
            <el-option label="全部课程" value="" />
            <el-option label="现代文阅读" value="modern" />
            <el-option label="古诗词鉴赏" value="poetry" />
            <el-option label="作文指导" value="writing" />
            <el-option label="文言文阅读" value="classical" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索任务名称"
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
        :data="filteredTableData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="taskNumber" label="序号" width="80" />
        <el-table-column
          prop="taskName"
          label="任务名称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="courseName" label="所属课程" width="120" />
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column prop="publishTime" label="发布时间" width="120">
          <template #default="{ row }">
            <span>{{ row.publishTime || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止时间" width="120" />
        <el-table-column prop="taskStatus" label="任务状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.taskStatus)" size="small">
              {{ getStatusLabel(row.taskStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="taskType" label="任务类型" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.taskType === '教学任务' ? 'primary' : 'success'"
              size="small"
            >
              {{ row.taskType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip
                content="安排人员"
                placement="top"
                v-if="row.taskStatus === 'draft'"
              >
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="handleAssignPersonnel(row)"
                >
                  <el-icon><UserFilled /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                content="发布"
                placement="top"
                v-if="row.taskStatus === 'draft'"
              >
                <el-button
                  type="success"
                  size="small"
                  circle
                  @click="handlePublish(row)"
                >
                  <el-icon><Promotion /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                content="任务学情分析"
                placement="top"
                v-if="
                  row.taskStatus === 'active' || row.taskStatus === 'completed'
                "
              >
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="handleLearningAnalysis(row)"
                >
                  <el-icon><TrendCharts /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="查看" placement="top">
                <el-button
                  type="info"
                  size="small"
                  circle
                  @click="handleView(row)"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip
                content="修改"
                placement="top"
                v-if="row.taskStatus !== 'completed'"
              >
                <el-button
                  type="warning"
                  size="small"
                  circle
                  @click="handleEdit(row)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  circle
                  @click="handleDelete(row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
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

    <!-- 创建任务对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建教学任务"
      width="800px"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="taskForm"
        :rules="taskRules"
        ref="taskFormRef"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务编号" prop="taskNumber">
              <el-input
                v-model="taskForm.taskNumber"
                disabled
                placeholder="系统自动生成"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName">
              <el-input
                v-model="taskForm.taskName"
                placeholder="请输入任务名称"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属课程" prop="courseId">
              <el-select
                v-model="taskForm.courseId"
                placeholder="请选择课程"
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学评价体系" prop="evaluationSystemId">
              <el-select
                v-model="taskForm.evaluationSystemId"
                placeholder="请选择评价体系"
                style="width: 100%"
              >
                <el-option
                  v-for="system in evaluationSystems"
                  :key="system.id"
                  :label="system.name"
                  :value="system.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="学生模型选择" prop="studentModels">
          <div class="student-models">
            <div
              v-for="model in studentModelList"
              :key="model.id"
              class="student-model-item"
              :class="{ selected: taskForm.studentModels.includes(model.id) }"
              @click="toggleStudentModel(model.id)"
            >
              <el-avatar :src="model.avatar" :size="50" />
              <div class="model-info">
                <div class="model-name">{{ model.name }}</div>
                <div class="model-desc">{{ model.description }}</div>
                <div
                  v-if="
                    taskForm.studentModels.includes(model.id) &&
                    modelSeatAssignments[model.id]
                  "
                  class="seat-info"
                >
                  座位: {{ getSeatLabel(modelSeatAssignments[model.id]) }}
                </div>
              </div>
              <el-icon
                v-if="taskForm.studentModels.includes(model.id)"
                class="selected-icon"
                ><Check
              /></el-icon>
            </div>
          </div>
        </el-form-item>

        <!-- 座位选择区域 -->
        <el-form-item
          v-if="taskForm.studentModels.length > 0"
          label="座位安排"
          prop="seatAssignments"
        >
          <div class="seat-assignment-section">
            <div class="assignment-header">
              <h4>为选中的学生模型分配座位</h4>
              <p class="assignment-tip">
                点击座位为学生模型分配位置，每个学生模型只能选择一个座位
              </p>
            </div>

            <!-- 当前选择的学生模型 -->
            <div class="selected-models">
              <div class="model-tabs">
                <div
                  v-for="modelId in taskForm.studentModels"
                  :key="modelId"
                  class="model-tab"
                  :class="{ active: currentSelectedModel === modelId }"
                  @click="currentSelectedModel = modelId"
                >
                  <el-avatar :src="getModelById(modelId)?.avatar" :size="30" />
                  <span class="model-tab-name">{{
                    getModelById(modelId)?.name
                  }}</span>
                  <span v-if="modelSeatAssignments[modelId]" class="seat-badge">
                    {{ getSeatLabel(modelSeatAssignments[modelId]) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 教室座位图 -->
            <div class="classroom-layout">
              <div class="classroom-header">
                <div class="podium">讲台</div>
              </div>

              <div class="seats-grid">
                <div v-for="row in 5" :key="row" class="seat-row">
                  <div class="row-label">{{ row }}</div>
                  <div
                    v-for="col in 8"
                    :key="col"
                    class="seat"
                    :class="getSeatClass(row, col)"
                    @click="assignSeat(row, col)"
                  >
                    {{ col }}
                    <div v-if="getSeatOccupant(row, col)" class="seat-occupant">
                      <el-avatar
                        :src="getSeatOccupant(row, col)?.avatar"
                        :size="20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="seat-legend">
                <div class="legend-item">
                  <div class="legend-seat available"></div>
                  <span>可选座位</span>
                </div>
                <div class="legend-item">
                  <div class="legend-seat occupied"></div>
                  <span>已分配</span>
                </div>
                <div class="legend-item">
                  <div class="legend-seat selected"></div>
                  <span>当前选择</span>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="特殊事件选择" prop="specialEvents">
          <el-select
            v-model="taskForm.specialEvents"
            multiple
            placeholder="请选择特殊事件"
            style="width: 100%"
          >
            <el-option
              v-for="event in specialEventList"
              :key="event.id"
              :label="event.name"
              :value="event.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="taskForm.deadline"
            type="datetime"
            placeholder="请选择截止时间"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </el-form-item>

        <el-form-item label="任务描述">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入任务描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="handleSaveDraft"
            >保存草稿</el-button
          >
          <el-button type="success" @click="handleCreateAndPublish"
            >创建并发布</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 安排人员弹窗 -->
    <el-dialog
      v-model="showAssignDialog"
      title="安排人员"
      width="800px"
      @close="handleCloseAssignDialog"
    >
      <div class="assign-personnel-dialog">
        <div class="dialog-header">
          <h4>任务：{{ currentTask?.taskName }}</h4>
          <div class="search-filters">
            <el-input
              v-model="studentSearchKeyword"
              placeholder="搜索学生姓名或学号"
              style="width: 200px; margin-right: 10px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select
              v-model="selectedClass"
              placeholder="选择班级"
              style="width: 150px"
              clearable
            >
              <el-option label="全部班级" value="" />
              <el-option
                v-for="cls in classList"
                :key="cls.id"
                :label="cls.name"
                :value="cls.id.toString()"
              />
            </el-select>
          </div>
        </div>

        <div class="student-selection">
          <div class="selection-header">
            <el-checkbox
              :model-value="
                selectedStudents.length === filteredStudentList.length &&
                filteredStudentList.length > 0
              "
              :indeterminate="
                selectedStudents.length > 0 &&
                selectedStudents.length < filteredStudentList.length
              "
              @change="handleSelectAllStudents"
            >
              全选 ({{ selectedStudents.length }}/{{
                filteredStudentList.length
              }})
            </el-checkbox>
          </div>

          <div class="student-list">
            <el-checkbox-group v-model="selectedStudents">
              <div
                v-for="student in filteredStudentList"
                :key="student.id"
                class="student-item"
              >
                <el-checkbox :label="student.id">
                  <div class="student-info">
                    <span class="student-name">{{ student.name }}</span>
                    <span class="student-number">{{
                      student.studentNumber
                    }}</span>
                    <span class="student-class">{{
                      classList.find((c) => c.id === student.classId)?.name
                    }}</span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseAssignDialog">取消</el-button>
          <el-button type="primary" @click="handleConfirmAssign">
            确认安排 ({{ selectedStudents.length }}人)
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import {
  Plus,
  Refresh,
  Search,
  Check,
  UserFilled,
  Promotion,
  View,
  Edit,
  Delete,
  TrendCharts,
} from "@element-plus/icons-vue";

// 接口定义
interface Task {
  taskNumber: number;
  taskName: string;
  courseName: string;
  creator: string;
  createTime: string;
  publishTime?: string;
  deadline: string;
  taskStatus: "draft" | "published" | "active" | "completed";
  progress: number;
  taskType: "教学任务" | "自定义任务";
  courseId: number;
  evaluationSystemId: number;
  studentModels: number[];
  specialEvents: number[];
  description?: string;
}

interface Course {
  id: number;
  name: string;
}

interface EvaluationSystem {
  id: number;
  name: string;
}

interface StudentModel {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

interface SpecialEvent {
  id: number;
  name: string;
  description: string;
}

interface TaskForm {
  taskNumber: string;
  taskName: string;
  courseId: number | null;
  evaluationSystemId: number | null;
  studentModels: number[];
  specialEvents: number[];
  deadline: Date | null;
  description: string;
  seatAssignments: Record<number, string>; // modelId -> seatPosition (e.g., "1-3")
}

interface SeatPosition {
  row: number;
  col: number;
}

interface Student {
  id: number;
  name: string;
  studentNumber: string;
  classId: number;
  className: string;
  avatar?: string;
}

interface Class {
  id: number;
  name: string;
  studentCount: number;
}

// 路由
const router = useRouter();

// 响应式数据
const loading = ref(false);
const searchKeyword = ref("");
const filterStatus = ref("");
const filterCourse = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const showCreateDialog = ref(false);
const showAssignDialog = ref(false);
const taskFormRef = ref<FormInstance>();
const currentTask = ref<Task | null>(null);
const selectedStudents = ref<number[]>();
const studentSearchKeyword = ref("");
const selectedClass = ref("");

// 座位分配相关
const currentSelectedModel = ref<number | null>(null);
const modelSeatAssignments = ref<Record<number, string>>({});

// 表格数据
const tableData = ref<Task[]>([
  {
    taskNumber: 1,
    taskName: "现代文阅读理解练习",
    courseName: "现代文阅读",
    creator: "张教授",
    createTime: "2024-01-20 10:30:00",
    publishTime: "2024-01-20 14:00:00",
    deadline: "2024-01-25 23:59:59",
    taskStatus: "active",
    progress: 75,
    taskType: "教学任务",
    courseId: 1,
    evaluationSystemId: 1,
    studentModels: [1, 2],
    specialEvents: [1],
  },
  {
    taskNumber: 2,
    taskName: "古诗词背诵默写",
    courseName: "古诗词鉴赏",
    creator: "王明华",
    createTime: "2024-01-19 16:20:00",
    deadline: "2024-01-28 23:59:59",
    taskStatus: "draft",
    progress: 0,
    taskType: "教学任务",
    courseId: 1,
    evaluationSystemId: 2,
    studentModels: [1, 3],
    specialEvents: [],
  },
  {
    taskNumber: 3,
    taskName: "作文写作训练",
    courseName: "作文指导",
    creator: "王教授",
    createTime: "2024-01-19 09:15:00",
    publishTime: "2024-01-19 15:30:00",
    deadline: "2024-01-26 23:59:59",
    taskStatus: "completed",
    progress: 100,
    taskType: "教学任务",
    courseId: 2,
    evaluationSystemId: 1,
    studentModels: [2, 3],
    specialEvents: [2],
  },
]);

// 基础数据
const courseList = ref<Course[]>([
  { id: 1, name: "现代文阅读" },
  { id: 2, name: "古诗词鉴赏" },
  { id: 3, name: "作文指导" },
  { id: 4, name: "文言文阅读" },
]);

const evaluationSystems = ref<EvaluationSystem[]>([
  { id: 1, name: "综合教学评价体系" },
  { id: 2, name: "实践技能评价体系" },
  { id: 3, name: "创新能力评价体系" },
]);

const studentModelList = ref<StudentModel[]>([
  {
    id: 1,
    name: "小明",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    description: "活跃学生，善于提问",
  },
  {
    id: 2,
    name: "小红",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    description: "认真学习，成绩优秀",
  },
  {
    id: 3,
    name: "小李",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    description: "思维敏捷，创新能力强",
  },
]);

const specialEventList = ref<SpecialEvent[]>([
  { id: 1, name: "突发提问", description: "课堂中的突发提问事件" },
  { id: 2, name: "技术故障", description: "教学设备技术故障" },
  { id: 3, name: "学生迟到", description: "学生迟到情况处理" },
]);

// 班级数据
const classList = ref<Class[]>([
  { id: 1, name: "计算机科学与技术2021级1班", studentCount: 30 },
  { id: 2, name: "计算机科学与技术2021级2班", studentCount: 28 },
  { id: 3, name: "软件工程2021级1班", studentCount: 32 },
  { id: 4, name: "软件工程2021级2班", studentCount: 29 },
]);

// 学生数据
const studentList = ref<Student[]>([
  {
    id: 1,
    name: "李明轩",
    studentNumber: "2021001",
    classId: 1,
    className: "计算机科学与技术2021级1班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 2,
    name: "张雨涵",
    studentNumber: "2021002",
    classId: 1,
    className: "计算机科学与技术2021级1班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 3,
    name: "陈思琪",
    studentNumber: "2021003",
    classId: 1,
    className: "计算机科学与技术2021级1班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 4,
    name: "刘浩然",
    studentNumber: "2021004",
    classId: 2,
    className: "计算机科学与技术2021级2班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 5,
    name: "王欣怡",
    studentNumber: "2021005",
    classId: 2,
    className: "计算机科学与技术2021级2班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 6,
    name: "赵子涵",
    studentNumber: "2021006",
    classId: 3,
    className: "软件工程2021级1班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 7,
    name: "孙佳琪",
    studentNumber: "2021007",
    classId: 3,
    className: "软件工程2021级1班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 8,
    name: "周俊杰",
    studentNumber: "2021008",
    classId: 4,
    className: "软件工程2021级2班",
    avatar:
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
]);

// 表单数据
const taskForm = ref<TaskForm>({
  taskNumber: "",
  taskName: "",
  courseId: null,
  evaluationSystemId: null,
  studentModels: [],
  specialEvents: [],
  deadline: null,
  description: "",
  seatAssignments: {},
});

// 表单验证规则
const taskRules: FormRules = {
  taskName: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  courseId: [{ required: true, message: "请选择所属课程", trigger: "change" }],
  evaluationSystemId: [
    { required: true, message: "请选择教学评价体系", trigger: "change" },
  ],
  deadline: [{ required: true, message: "请选择截止时间", trigger: "change" }],
};

// 计算属性
const filteredTableData = computed(() => {
  let data = tableData.value;

  // 按状态筛选
  if (filterStatus.value) {
    data = data.filter((item) => item.taskStatus === filterStatus.value);
  }

  // 按课程筛选
  if (filterCourse.value) {
    data = data.filter(
      (item) => item.courseId.toString() === filterCourse.value,
    );
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    data = data.filter((item) =>
      item.taskName.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    );
  }

  return data;
});

// 筛选后的学生列表
const filteredStudentList = computed(() => {
  let data = studentList.value;

  // 按班级筛选
  if (selectedClass.value) {
    data = data.filter(
      (student) => student.classId.toString() === selectedClass.value,
    );
  }

  // 按关键词搜索
  if (studentSearchKeyword.value) {
    data = data.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(studentSearchKeyword.value.toLowerCase()) ||
        student.studentNumber.includes(studentSearchKeyword.value),
    );
  }

  return data;
});

// 工具方法
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "草稿",
    published: "已发布",
    active: "进行中",
    completed: "已完成",
  };
  return statusMap[status] || status;
};

const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "info",
    published: "warning",
    active: "success",
    completed: "primary",
  };
  return statusMap[status] || "info";
};

const generateTaskNumber = () => {
  return Date.now().toString();
};

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7; // 不能选择今天之前的日期
};

// 事件处理方法
const handleRefresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    ElMessage.success("数据刷新成功");
  }, 1000);
};

const handleView = (row: Task) => {
  router.push({
    name: "StudentLearningStatus",
    params: {
      taskId: row.taskNumber,
    },
  });
};

const handleLearningAnalysis = (row: Task) => {
  router.push({
    name: "TaskLearningAnalysis",
    params: {
      taskId: row.taskNumber,
    },
  });
};

const handleEdit = (row: Task) => {
  ElMessage.info(`编辑任务: ${row.taskName}`);
  // TODO: 打开编辑对话框
};

const handleAssignPersonnel = (row: Task) => {
  currentTask.value = row;
  selectedStudents.value = [];
  studentSearchKeyword.value = "";
  selectedClass.value = "";
  showAssignDialog.value = true;
};

const handlePublish = async (row: Task) => {
  try {
    await ElMessageBox.confirm("确认发布此任务吗？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 更新任务状态
    const task = tableData.value.find((t) => t.taskNumber === row.taskNumber);
    if (task) {
      task.taskStatus = "published";
      task.publishTime = new Date().toLocaleString();
    }

    ElMessage.success("任务发布成功");
  } catch {
    ElMessage.info("已取消发布");
  }
};

const handleDelete = async (row: Task) => {
  try {
    await ElMessageBox.confirm("确认删除此任务吗？删除后无法恢复。", "警告", {
      confirmButtonText: "确认删除",
      cancelButtonText: "取消",
      type: "warning",
    });

    const index = tableData.value.findIndex(
      (t) => t.taskNumber === row.taskNumber,
    );
    if (index > -1) {
      tableData.value.splice(index, 1);
    }

    ElMessage.success("任务删除成功");
  } catch {
    ElMessage.info("已取消删除");
  }
};

// 对话框相关方法
const handleCloseDialog = () => {
  showCreateDialog.value = false;
  resetForm();
};

const resetForm = () => {
  taskForm.value = {
    taskNumber: "",
    taskName: "",
    courseId: null,
    evaluationSystemId: null,
    studentModels: [],
    specialEvents: [],
    deadline: null,
    description: "",
    seatAssignments: {},
  };

  // 清除座位分配数据
  modelSeatAssignments.value = {};
  currentSelectedModel.value = null;

  taskFormRef.value?.clearValidate();
};

// 安排人员相关方法
const handleSelectAllStudents = () => {
  if (selectedStudents.value.length === filteredStudentList.value.length) {
    selectedStudents.value = [];
  } else {
    selectedStudents.value = filteredStudentList.value.map(
      (student) => student.id,
    );
  }
};

const handleConfirmAssign = () => {
  if (selectedStudents.value.length === 0) {
    ElMessage.warning("请至少选择一名学生");
    return;
  }

  const selectedStudentNames = studentList.value
    .filter((student) => selectedStudents.value.includes(student.id))
    .map((student) => student.name)
    .join("、");

  ElMessage.success(
    `已为任务「${currentTask.value?.taskName}」安排人员：${selectedStudentNames}`,
  );
  showAssignDialog.value = false;
};

const handleCloseAssignDialog = () => {
  showAssignDialog.value = false;
  selectedStudents.value = [];
  studentSearchKeyword.value = "";
  selectedClass.value = "";
  currentTask.value = null;
};

const toggleStudentModel = (modelId: number) => {
  const index = taskForm.value.studentModels.indexOf(modelId);
  if (index > -1) {
    // 移除学生模型时，同时移除其座位分配
    taskForm.value.studentModels.splice(index, 1);
    delete modelSeatAssignments.value[modelId];
    delete taskForm.value.seatAssignments[modelId];

    // 如果当前选中的模型被移除，重置选择
    if (currentSelectedModel.value === modelId) {
      currentSelectedModel.value = taskForm.value.studentModels[0] || null;
    }
  } else {
    taskForm.value.studentModels.push(modelId);
    // 自动选择新添加的模型
    currentSelectedModel.value = modelId;
  }
};

// 座位分配相关方法
const getSeatLabel = (seatPosition: string) => {
  if (!seatPosition) return "";
  const [row, col] = seatPosition.split("-");
  return `${row}排${col}座`;
};

const getModelById = (modelId: number) => {
  return studentModelList.value.find((model) => model.id === modelId);
};

const getSeatClass = (row: number, col: number) => {
  const seatKey = `${row}-${col}`;
  const isOccupied = Object.values(modelSeatAssignments.value).includes(
    seatKey,
  );
  const isCurrentSelection =
    currentSelectedModel.value &&
    modelSeatAssignments.value[currentSelectedModel.value] === seatKey;

  return {
    available: !isOccupied,
    occupied: isOccupied && !isCurrentSelection,
    selected: isCurrentSelection,
  };
};

const getSeatOccupant = (row: number, col: number) => {
  const seatKey = `${row}-${col}`;
  const modelId = Object.keys(modelSeatAssignments.value).find(
    (key) => modelSeatAssignments.value[parseInt(key)] === seatKey,
  );

  if (modelId) {
    return getModelById(parseInt(modelId));
  }
  return null;
};

const assignSeat = (row: number, col: number) => {
  if (!currentSelectedModel.value) {
    ElMessage.warning("请先选择要分配座位的学生模型");
    return;
  }

  const seatKey = `${row}-${col}`;

  // 检查座位是否已被其他模型占用
  const occupiedByOther = Object.keys(modelSeatAssignments.value).find(
    (key) =>
      parseInt(key) !== currentSelectedModel.value &&
      modelSeatAssignments.value[parseInt(key)] === seatKey,
  );

  if (occupiedByOther) {
    ElMessage.warning("该座位已被其他学生模型占用");
    return;
  }

  // 如果当前模型已有座位，先清除
  const currentSeat = modelSeatAssignments.value[currentSelectedModel.value];
  if (currentSeat === seatKey) {
    // 点击同一座位，取消分配
    delete modelSeatAssignments.value[currentSelectedModel.value];
    delete taskForm.value.seatAssignments[currentSelectedModel.value];
    ElMessage.success("已取消座位分配");
  } else {
    // 分配新座位
    modelSeatAssignments.value[currentSelectedModel.value] = seatKey;
    taskForm.value.seatAssignments[currentSelectedModel.value] = seatKey;

    const modelName = getModelById(currentSelectedModel.value)?.name;
    ElMessage.success(`已为 ${modelName} 分配座位：${getSeatLabel(seatKey)}`);
  }
};

const handleSaveDraft = async () => {
  try {
    await taskFormRef.value?.validate();

    const newTask: Task = {
      taskNumber: parseInt(taskForm.value.taskNumber),
      taskName: taskForm.value.taskName,
      courseName:
        courseList.value.find((c) => c.id === taskForm.value.courseId)?.name ||
        "",
      creator: "当前用户", // 实际应该从用户信息获取
      createTime: new Date().toLocaleString(),
      deadline: taskForm.value.deadline?.toLocaleString() || "",
      taskStatus: "draft",
      progress: 0,
      taskType: "教学任务",
      courseId: taskForm.value.courseId!,
      evaluationSystemId: taskForm.value.evaluationSystemId!,
      studentModels: [...taskForm.value.studentModels],
      specialEvents: [...taskForm.value.specialEvents],
      description: taskForm.value.description,
    };

    tableData.value.unshift(newTask);
    ElMessage.success("任务草稿保存成功");
    handleCloseDialog();
  } catch {
    ElMessage.error("请完善必填信息");
  }
};

const handleCreateAndPublish = async () => {
  try {
    await taskFormRef.value?.validate();

    const newTask: Task = {
      taskNumber: parseInt(taskForm.value.taskNumber),
      taskName: taskForm.value.taskName,
      courseName:
        courseList.value.find((c) => c.id === taskForm.value.courseId)?.name ||
        "",
      creator: "当前用户",
      createTime: new Date().toLocaleString(),
      publishTime: new Date().toLocaleString(),
      deadline: taskForm.value.deadline?.toLocaleString() || "",
      taskStatus: "published",
      progress: 0,
      taskType: "教学任务",
      courseId: taskForm.value.courseId!,
      evaluationSystemId: taskForm.value.evaluationSystemId!,
      studentModels: [...taskForm.value.studentModels],
      specialEvents: [...taskForm.value.specialEvents],
      description: taskForm.value.description,
    };

    tableData.value.unshift(newTask);
    ElMessage.success("任务创建并发布成功");
    handleCloseDialog();
  } catch {
    ElMessage.error("请完善必填信息");
  }
};

// 生命周期
onMounted(() => {
  // 初始化任务编号
  taskForm.value.taskNumber = generateTaskNumber();

  // 监听对话框打开事件
  const unwatchDialog = computed(() => showCreateDialog.value);
  unwatchDialog.value &&
    (() => {
      taskForm.value.taskNumber = generateTaskNumber();
    })();
});
</script>

<style scoped>
.task-publish {
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

/* 学生模型选择样式 */
.student-models {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.student-model-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  min-width: 200px;
  position: relative;
  backdrop-filter: blur(10px);
}

.student-model-item:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.student-model-item.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.model-info {
  margin-left: 12px;
  flex: 1;
}

.model-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.model-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.seat-info {
  font-size: 11px;
  color: #34d399;
  font-weight: 500;
  margin-top: 2px;
}

.selected-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #3b82f6;
  font-size: 16px;
}

/* 座位分配样式 */
.seat-assignment-section {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.assignment-header {
  margin-bottom: 20px;
}

.assignment-header h4 {
  margin: 0 0 8px 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.assignment-tip {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.selected-models {
  margin-bottom: 20px;
}

.model-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.model-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  backdrop-filter: blur(10px);
}

.model-tab:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.model-tab.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.model-tab-name {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.seat-badge {
  font-size: 11px;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid #34d399;
}

.classroom-layout {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.classroom-header {
  margin-bottom: 20px;
  text-align: center;
}

.podium {
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: white;
  padding: 12px 40px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.seats-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-label {
  width: 30px;
  text-align: center;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

.seat {
  width: 40px;
  height: 40px;
  border: 2px solid #e4e7ed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.seat.available:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.seat.occupied {
  border-color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
}

.seat.selected {
  border-color: #3b82f6;
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.seat-occupant {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 1;
}

.seat-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.legend-seat {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 2px solid;
}

.legend-seat.available {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.legend-seat.occupied {
  border-color: #34d399;
  background: rgba(16, 185, 129, 0.1);
}

.legend-seat.selected {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

/* 对话框样式优化 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表格进度条样式 */
.el-progress {
  width: 60px;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
}

/* 安排人员弹窗样式 */
.assign-personnel-dialog {
  .dialog-header {
    margin-bottom: 20px;

    h4 {
      margin: 0 0 15px 0;
      color: #303133;
      font-size: 16px;
    }

    .search-filters {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .student-selection {
    .selection-header {
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 15px;
    }

    .student-list {
      max-height: 400px;
      overflow-y: auto;

      .student-item {
        padding: 8px 0;
        border-bottom: 1px solid #f5f7fa;

        &:last-child {
          border-bottom: none;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-left: 10px;

          .student-name {
            font-weight: 500;
            color: #303133;
            min-width: 80px;
          }

          .student-number {
            color: #606266;
            font-size: 14px;
            min-width: 100px;
          }

          .student-class {
            color: #909399;
            font-size: 12px;
            background: #f0f2f5;
            padding: 2px 8px;
            border-radius: 12px;
          }
        }
      }
    }
  }
}
</style>
