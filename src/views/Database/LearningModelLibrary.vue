<template>
  <div class="learning-model-library">
    <div class="page-header">
      <h2>学习模型库</h2>
      <p>管理和维护各种学习算法模型，支持模型训练、评估和部署</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加模型
          </el-button>
          <el-button @click="handleBatchImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-select v-model="selectedType" placeholder="模型类型" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="分类模型" value="classification" />
            <el-option label="回归模型" value="regression" />
            <el-option label="聚类模型" value="clustering" />
            <el-option label="深度学习" value="deep_learning" />
            <el-option label="强化学习" value="reinforcement" />
          </el-select>
          <el-select v-model="selectedStatus" placeholder="状态" style="width: 100px; margin-right: 8px" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="训练中" value="training" />
            <el-option label="已完成" value="completed" />
            <el-option label="已部署" value="deployed" />
            <el-option label="已停用" value="disabled" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索模型名称"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table :data="modelList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="模型名称" min-width="150">
          <template #default="{ row }">
            <div class="model-name">
              <el-icon class="model-icon"><Cpu /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="algorithm" label="算法" width="120" />
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            <span v-if="row.accuracy">{{ (row.accuracy * 100).toFixed(1) }}%</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="datasetSize" label="数据集大小" width="120">
          <template #default="{ row }">
            <span>{{ formatDataSize(row.datasetSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trainTime" label="训练时长" width="120">
          <template #default="{ row }">
            <span v-if="row.trainTime">{{ formatTrainTime(row.trainTime) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="success" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-dropdown @command="(command) => handleCommand(command, row)">
              <el-button type="info" size="small">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="train" v-if="row.status !== 'training'">
                    <el-icon><VideoPlay /></el-icon>训练模型
                  </el-dropdown-item>
                  <el-dropdown-item command="deploy" v-if="row.status === 'completed'">
                    <el-icon><Upload /></el-icon>部署模型
                  </el-dropdown-item>
                  <el-dropdown-item command="download">
                    <el-icon><Download /></el-icon>下载模型
                  </el-dropdown-item>
                  <el-dropdown-item command="copy">
                    <el-icon><CopyDocument /></el-icon>复制模型
                  </el-dropdown-item>
                  <el-dropdown-item command="disable" v-if="row.status !== 'disabled'" divided>
                    <el-icon><CircleClose /></el-icon>停用
                  </el-dropdown-item>
                  <el-dropdown-item command="enable" v-if="row.status === 'disabled'" divided>
                    <el-icon><CircleCheck /></el-icon>启用
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon><Delete /></el-icon>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 添加/编辑模型对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="resetForm"
    >
      <el-form :model="modelForm" :rules="formRules" ref="formRef" label-width="120px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="模型名称" prop="name">
                  <el-input v-model="modelForm.name" placeholder="请输入模型名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模型类型" prop="type">
                  <el-select v-model="modelForm.type" placeholder="请选择模型类型" style="width: 100%">
                    <el-option label="分类模型" value="classification" />
                    <el-option label="回归模型" value="regression" />
                    <el-option label="聚类模型" value="clustering" />
                    <el-option label="深度学习" value="deep_learning" />
                    <el-option label="强化学习" value="reinforcement" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="算法" prop="algorithm">
                  <el-select v-model="modelForm.algorithm" placeholder="请选择算法" style="width: 100%" filterable>
                    <el-option label="随机森林" value="RandomForest" />
                    <el-option label="支持向量机" value="SVM" />
                    <el-option label="逻辑回归" value="LogisticRegression" />
                    <el-option label="决策树" value="DecisionTree" />
                    <el-option label="神经网络" value="NeuralNetwork" />
                    <el-option label="卷积神经网络" value="CNN" />
                    <el-option label="循环神经网络" value="RNN" />
                    <el-option label="长短期记忆网络" value="LSTM" />
                    <el-option label="Transformer" value="Transformer" />
                    <el-option label="K-Means" value="KMeans" />
                    <el-option label="DBSCAN" value="DBSCAN" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="版本" prop="version">
                  <el-input v-model="modelForm.version" placeholder="如：v1.0.0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="模型描述" prop="description">
              <el-input
                v-model="modelForm.description"
                type="textarea"
                :rows="4"
                placeholder="请描述模型的用途、特点和应用场景"
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="训练配置" name="training">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="数据集大小">
                  <el-input-number v-model="modelForm.datasetSize" :min="1" :step="1000" style="width: 100%" />
                  <span style="margin-left: 8px; color: #909399; font-size: 12px">条记录</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="训练轮数">
                  <el-input-number v-model="modelForm.epochs" :min="1" :max="1000" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学习率">
                  <el-input-number v-model="modelForm.learningRate" :min="0.0001" :max="1" :step="0.001" :precision="4" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批次大小">
                  <el-input-number v-model="modelForm.batchSize" :min="1" :max="1024" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="特征维度">
              <el-input-number v-model="modelForm.featureDim" :min="1" style="width: 200px" />
            </el-form-item>
            <el-form-item label="训练参数">
              <el-input
                v-model="modelForm.trainParams"
                type="textarea"
                :rows="4"
                placeholder="请输入JSON格式的训练参数，如：{'optimizer': 'adam', 'loss': 'categorical_crossentropy'}"
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="性能指标" name="performance">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="准确率">
                  <el-slider
                    v-model="modelForm.accuracy"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    :precision="3"
                    show-input
                    :format-tooltip="(val) => `${(val * 100).toFixed(1)}%`"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="精确率">
                  <el-slider
                    v-model="modelForm.precision"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    :precision="3"
                    show-input
                    :format-tooltip="(val) => `${(val * 100).toFixed(1)}%`"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="召回率">
                  <el-slider
                    v-model="modelForm.recall"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    :precision="3"
                    show-input
                    :format-tooltip="(val) => `${(val * 100).toFixed(1)}%`"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="F1分数">
                  <el-slider
                    v-model="modelForm.f1Score"
                    :min="0"
                    :max="1"
                    :step="0.001"
                    :precision="3"
                    show-input
                    :format-tooltip="(val) => `${(val * 100).toFixed(1)}%`"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="损失值">
              <el-input-number v-model="modelForm.loss" :min="0" :step="0.001" :precision="4" style="width: 200px" />
            </el-form-item>
            <el-form-item label="性能备注">
              <el-input
                v-model="modelForm.performanceNotes"
                type="textarea"
                :rows="3"
                placeholder="记录模型性能相关的备注信息"
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="部署配置" name="deployment">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部署环境">
                  <el-select v-model="modelForm.deployEnv" placeholder="请选择部署环境" style="width: 100%">
                    <el-option label="开发环境" value="development" />
                    <el-option label="测试环境" value="testing" />
                    <el-option label="预生产环境" value="staging" />
                    <el-option label="生产环境" value="production" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="服务端口">
                  <el-input-number v-model="modelForm.servicePort" :min="1000" :max="65535" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="API端点">
              <el-input v-model="modelForm.apiEndpoint" placeholder="如：/api/v1/predict" />
            </el-form-item>
            <el-form-item label="资源需求">
              <el-input
                v-model="modelForm.resourceRequirements"
                type="textarea"
                :rows="3"
                placeholder="描述CPU、内存、GPU等资源需求"
              />
            </el-form-item>
            <el-form-item label="部署备注">
              <el-input
                v-model="modelForm.deployNotes"
                type="textarea"
                :rows="3"
                placeholder="部署相关的注意事项和说明"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 模型详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="模型详情"
      width="1000px"
    >
      <div v-if="currentModel" class="model-detail">
        <div class="detail-header">
          <div class="model-info">
            <h2>{{ currentModel.name }}</h2>
            <div class="model-tags">
              <el-tag :type="getTypeTag(currentModel.type)" size="large">{{ getTypeLabel(currentModel.type) }}</el-tag>
              <el-tag type="info" size="large" style="margin-left: 8px">{{ currentModel.algorithm }}</el-tag>
              <el-tag :type="getStatusTag(currentModel.status)" size="large" style="margin-left: 8px">
                {{ getStatusLabel(currentModel.status) }}
              </el-tag>
            </div>
            <div class="model-stats">
              <div class="stat-item">
                <span class="stat-label">版本：</span>
                <span>{{ currentModel.version }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">准确率：</span>
                <span v-if="currentModel.accuracy">{{ (currentModel.accuracy * 100).toFixed(1) }}%</span>
                <span v-else>-</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">使用次数：</span>
                <span>{{ currentModel.usageCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">创建时间：</span>
                <span>{{ currentModel.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <el-tabs>
          <el-tab-pane label="基本信息" name="basic">
            <div class="detail-section">
              <h3>模型描述</h3>
              <div class="content-box">
                {{ currentModel.description || '暂无描述' }}
              </div>
            </div>
            <div class="detail-section">
              <h3>基本参数</h3>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="模型类型">{{ getTypeLabel(currentModel.type) }}</el-descriptions-item>
                <el-descriptions-item label="算法">{{ currentModel.algorithm }}</el-descriptions-item>
                <el-descriptions-item label="版本">{{ currentModel.version }}</el-descriptions-item>
                <el-descriptions-item label="数据集大小">{{ formatDataSize(currentModel.datasetSize) }}</el-descriptions-item>
                <el-descriptions-item label="特征维度">{{ currentModel.featureDim || '-' }}</el-descriptions-item>
                <el-descriptions-item label="训练时长">{{ formatTrainTime(currentModel.trainTime) || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="训练配置" name="training">
            <div class="detail-section">
              <h3>训练参数</h3>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="训练轮数">{{ currentModel.epochs || '-' }}</el-descriptions-item>
                <el-descriptions-item label="学习率">{{ currentModel.learningRate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="批次大小">{{ currentModel.batchSize || '-' }}</el-descriptions-item>
                <el-descriptions-item label="损失值">{{ currentModel.loss || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="detail-section" v-if="currentModel.trainParams">
              <h3>详细参数</h3>
              <div class="content-box">
                <pre>{{ formatJSON(currentModel.trainParams) }}</pre>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="性能指标" name="performance">
            <div class="performance-charts">
              <div class="chart-item">
                <h4>准确率</h4>
                <el-progress
                  :percentage="currentModel.accuracy ? currentModel.accuracy * 100 : 0"
                  :stroke-width="20"
                  :text-inside="true"
                  :format="(percentage) => `${percentage.toFixed(1)}%`"
                />
              </div>
              <div class="chart-item">
                <h4>精确率</h4>
                <el-progress
                  :percentage="currentModel.precision ? currentModel.precision * 100 : 0"
                  :stroke-width="20"
                  :text-inside="true"
                  color="#67c23a"
                  :format="(percentage) => `${percentage.toFixed(1)}%`"
                />
              </div>
              <div class="chart-item">
                <h4>召回率</h4>
                <el-progress
                  :percentage="currentModel.recall ? currentModel.recall * 100 : 0"
                  :stroke-width="20"
                  :text-inside="true"
                  color="#e6a23c"
                  :format="(percentage) => `${percentage.toFixed(1)}%`"
                />
              </div>
              <div class="chart-item">
                <h4>F1分数</h4>
                <el-progress
                  :percentage="currentModel.f1Score ? currentModel.f1Score * 100 : 0"
                  :stroke-width="20"
                  :text-inside="true"
                  color="#f56c6c"
                  :format="(percentage) => `${percentage.toFixed(1)}%`"
                />
              </div>
            </div>
            <div class="detail-section" v-if="currentModel.performanceNotes">
              <h3>性能备注</h3>
              <div class="content-box">
                {{ currentModel.performanceNotes }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="部署信息" name="deployment">
            <div class="detail-section">
              <h3>部署配置</h3>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="部署环境">{{ getDeployEnvLabel(currentModel.deployEnv) || '-' }}</el-descriptions-item>
                <el-descriptions-item label="服务端口">{{ currentModel.servicePort || '-' }}</el-descriptions-item>
                <el-descriptions-item label="API端点">{{ currentModel.apiEndpoint || '-' }}</el-descriptions-item>
                <el-descriptions-item label="部署状态">
                  <el-tag :type="getStatusTag(currentModel.status)">
                    {{ getStatusLabel(currentModel.status) }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="detail-section" v-if="currentModel.resourceRequirements">
              <h3>资源需求</h3>
              <div class="content-box">
                {{ currentModel.resourceRequirements }}
              </div>
            </div>
            <div class="detail-section" v-if="currentModel.deployNotes">
              <h3>部署备注</h3>
              <div class="content-box">
                {{ currentModel.deployNotes }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Upload, Download, Refresh, Search, Cpu, VideoPlay,
  CopyDocument, CircleClose, CircleCheck, Delete, ArrowDown
} from '@element-plus/icons-vue'

interface LearningModel {
  id: number
  name: string
  type: string
  algorithm: string
  version: string
  description?: string
  accuracy?: number
  precision?: number
  recall?: number
  f1Score?: number
  loss?: number
  datasetSize: number
  featureDim?: number
  epochs?: number
  learningRate?: number
  batchSize?: number
  trainTime?: number
  trainParams?: string
  performanceNotes?: string
  deployEnv?: string
  servicePort?: number
  apiEndpoint?: string
  resourceRequirements?: string
  deployNotes?: string
  status: string
  usageCount: number
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('添加模型')
const currentModel = ref<LearningModel | null>(null)
const formRef = ref()
const activeTab = ref('basic')

const modelForm = reactive({
  id: null as number | null,
  name: '',
  type: '',
  algorithm: '',
  version: 'v1.0.0',
  description: '',
  accuracy: 0.85,
  precision: 0.82,
  recall: 0.88,
  f1Score: 0.85,
  loss: 0.15,
  datasetSize: 10000,
  featureDim: 128,
  epochs: 100,
  learningRate: 0.001,
  batchSize: 32,
  trainParams: '',
  performanceNotes: '',
  deployEnv: 'development',
  servicePort: 8080,
  apiEndpoint: '/api/v1/predict',
  resourceRequirements: '',
  deployNotes: ''
})

const formRules = {
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择模型类型', trigger: 'change' }],
  algorithm: [{ required: true, message: '请选择算法', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  description: [{ required: true, message: '请输入模型描述', trigger: 'blur' }]
}

const modelList = ref<LearningModel[]>([
  {
    id: 1,
    name: '学生行为分类模型',
    type: 'classification',
    algorithm: 'RandomForest',
    version: 'v1.2.0',
    description: '用于分析和预测学生在虚拟课堂中的行为模式，包括注意力集中度、参与度等指标',
    accuracy: 0.892,
    precision: 0.875,
    recall: 0.908,
    f1Score: 0.891,
    loss: 0.108,
    datasetSize: 50000,
    featureDim: 256,
    epochs: 150,
    learningRate: 0.001,
    batchSize: 64,
    trainTime: 3600,
    trainParams: '{"optimizer": "adam", "loss": "categorical_crossentropy", "metrics": ["accuracy"]}',
    performanceNotes: '在测试集上表现良好，对于新学生的行为预测准确率较高',
    deployEnv: 'production',
    servicePort: 8080,
    apiEndpoint: '/api/v1/student-behavior/predict',
    resourceRequirements: 'CPU: 4核, 内存: 8GB, 存储: 2GB',
    deployNotes: '已部署到生产环境，运行稳定',
    status: 'deployed',
    usageCount: 1250,
    createTime: '2024-01-10'
  },
  {
    id: 2,
    name: '知识点掌握度评估模型',
    type: 'regression',
    algorithm: 'NeuralNetwork',
    version: 'v2.1.0',
    description: '基于学生的学习行为和答题情况，评估其对各知识点的掌握程度',
    accuracy: 0.856,
    precision: 0.841,
    recall: 0.872,
    f1Score: 0.856,
    loss: 0.144,
    datasetSize: 75000,
    featureDim: 512,
    epochs: 200,
    learningRate: 0.0005,
    batchSize: 128,
    trainTime: 7200,
    trainParams: '{"optimizer": "rmsprop", "loss": "mse", "activation": "relu"}',
    performanceNotes: '对于数学和科学类知识点的评估效果较好',
    deployEnv: 'production',
    servicePort: 8081,
    apiEndpoint: '/api/v1/knowledge/assess',
    resourceRequirements: 'CPU: 8核, 内存: 16GB, GPU: 1张, 存储: 5GB',
    deployNotes: '需要GPU加速，已配置CUDA环境',
    status: 'deployed',
    usageCount: 890,
    createTime: '2024-01-08'
  },
  {
    id: 3,
    name: '个性化推荐模型',
    type: 'deep_learning',
    algorithm: 'Transformer',
    version: 'v1.0.0',
    description: '为学生推荐个性化的学习内容和练习题目',
    accuracy: 0.782,
    precision: 0.768,
    recall: 0.795,
    f1Score: 0.781,
    loss: 0.218,
    datasetSize: 100000,
    featureDim: 1024,
    epochs: 80,
    learningRate: 0.0001,
    batchSize: 256,
    trainTime: 14400,
    trainParams: '{"optimizer": "adamw", "loss": "binary_crossentropy", "attention_heads": 8}',
    performanceNotes: '推荐准确率有待提升，需要更多用户行为数据',
    deployEnv: 'testing',
    servicePort: 8082,
    apiEndpoint: '/api/v1/recommend',
    resourceRequirements: 'CPU: 16核, 内存: 32GB, GPU: 2张, 存储: 10GB',
    deployNotes: '正在测试环境中验证效果',
    status: 'completed',
    usageCount: 156,
    createTime: '2024-01-15'
  },
  {
    id: 4,
    name: '情感分析模型',
    type: 'classification',
    algorithm: 'LSTM',
    version: 'v1.1.0',
    description: '分析学生在学习过程中的情感状态，如困惑、兴奋、沮丧等',
    accuracy: null,
    precision: null,
    recall: null,
    f1Score: null,
    loss: null,
    datasetSize: 30000,
    featureDim: 300,
    epochs: 120,
    learningRate: 0.002,
    batchSize: 64,
    trainTime: null,
    trainParams: '{"optimizer": "adam", "loss": "sparse_categorical_crossentropy", "dropout": 0.3}',
    performanceNotes: '',
    deployEnv: 'development',
    servicePort: 8083,
    apiEndpoint: '/api/v1/emotion/analyze',
    resourceRequirements: 'CPU: 4核, 内存: 8GB, 存储: 3GB',
    deployNotes: '正在开发环境中训练',
    status: 'training',
    usageCount: 0,
    createTime: '2024-01-18'
  }
])

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'classification': '分类模型',
    'regression': '回归模型',
    'clustering': '聚类模型',
    'deep_learning': '深度学习',
    'reinforcement': '强化学习'
  }
  return labels[type] || type
}

const getTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    'classification': 'primary',
    'regression': 'success',
    'clustering': 'warning',
    'deep_learning': 'danger',
    'reinforcement': 'info'
  }
  return tags[type] || 'info'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'training': '训练中',
    'completed': '已完成',
    'deployed': '已部署',
    'disabled': '已停用'
  }
  return labels[status] || status
}

const getStatusTag = (status: string) => {
  const tags: Record<string, string> = {
    'training': 'warning',
    'completed': 'success',
    'deployed': 'primary',
    'disabled': 'info'
  }
  return tags[status] || 'info'
}

const getDeployEnvLabel = (env: string) => {
  const labels: Record<string, string> = {
    'development': '开发环境',
    'testing': '测试环境',
    'staging': '预生产环境',
    'production': '生产环境'
  }
  return labels[env] || env
}

const formatDataSize = (size: number) => {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(1)}M`
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(1)}K`
  }
  return size.toString()
}

const formatTrainTime = (seconds: number) => {
  if (!seconds) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatJSON = (jsonStr: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加模型'
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleEdit = (model: LearningModel) => {
  dialogTitle.value = '编辑模型'
  Object.assign(modelForm, model)
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleView = (model: LearningModel) => {
  currentModel.value = model
  detailDialogVisible.value = true
}

const handleCommand = async (command: string, model: LearningModel) => {
  switch (command) {
    case 'train':
      ElMessage.info('开始训练模型...')
      break
    case 'deploy':
      ElMessage.info('开始部署模型...')
      break
    case 'download':
      ElMessage.info('开始下载模型文件...')
      break
    case 'copy':
      ElMessage.info('复制模型功能开发中')
      break
    case 'disable':
      try {
        await ElMessageBox.confirm(`确定要停用模型 "${model.name}" 吗？`, '确认停用', {
          type: 'warning'
        })
        ElMessage.success('模型已停用')
      } catch {
        ElMessage.info('已取消停用')
      }
      break
    case 'enable':
      ElMessage.success('模型已启用')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(`确定要删除模型 "${model.name}" 吗？`, '确认删除', {
          type: 'warning'
        })
        ElMessage.success('删除成功')
      } catch {
        ElMessage.info('已取消删除')
      }
      break
  }
}

const handleBatchImport = () => {
  ElMessage.info('批量导入功能开发中')
}

const handleExport = () => {
  ElMessage.info('导出数据功能开发中')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    ElMessage.success(modelForm.id ? '修改成功' : '添加成功')
    dialogVisible.value = false
    resetForm()
  } catch {
    ElMessage.error('请检查表单信息')
  }
}

const resetForm = () => {
  Object.assign(modelForm, {
    id: null,
    name: '',
    type: '',
    algorithm: '',
    version: 'v1.0.0',
    description: '',
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.88,
    f1Score: 0.85,
    loss: 0.15,
    datasetSize: 10000,
    featureDim: 128,
    epochs: 100,
    learningRate: 0.001,
    batchSize: 32,
    trainParams: '',
    performanceNotes: '',
    deployEnv: 'development',
    servicePort: 8080,
    apiEndpoint: '/api/v1/predict',
    resourceRequirements: '',
    deployNotes: ''
  })
  formRef.value?.resetFields()
}
</script>

<style scoped>
.learning-model-library {
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
  margin-bottom: 24px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.model-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-icon {
  color: #409eff;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.model-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-header {
  margin-bottom: 20px;
}

.model-info h2 {
  margin: 0 0 12px 0;
  color: #303133;
}

.model-tags {
  margin-bottom: 16px;
}

.model-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  min-width: 80px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.content-box {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  color: #606266;
}

.content-box pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.performance-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-item h4 {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 12px 0;
}
</style>