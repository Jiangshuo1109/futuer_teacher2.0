<template>
  <div class="student-model-library">
    <div class="page-header">
      <h2>学生模型库</h2>
      <p>维护虚拟仿真教学课堂中的AI学生基础信息</p>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加学生模型
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
          <el-select v-model="selectedGender" placeholder="性别" style="width: 100px; margin-right: 8px" clearable>
            <el-option label="全部" value="" />
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
          <el-select v-model="selectedPersonality" placeholder="人格类型" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="ESTP" value="ESTP" />
            <el-option label="ISFJ" value="ISFJ" />
            <el-option label="ENFP" value="ENFP" />
            <el-option label="INTJ" value="INTJ" />
          </el-select>
          <el-select v-model="selectedGrade" placeholder="年级" style="width: 120px; margin-right: 8px" clearable>
            <el-option label="全部年级" value="" />
            <el-option label="七年级" value="7" />
            <el-option label="八年级" value="8" />
            <el-option label="九年级" value="9" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索学生姓名"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 学生模型卡片网格 -->
      <div class="student-grid" v-loading="loading">
        <div v-for="student in studentList" :key="student.id" class="student-card">
          <div class="student-avatar">
            <div class="student-avatar-div" :style="{ backgroundColor: getAvatarColor(student.name) }">
              {{ getInitials(student.name) }}
            </div>
            <div class="student-overlay">
              <el-button type="primary" size="small" @click="handleView(student)">
                查看详情
              </el-button>
              <el-button type="success" size="small" @click="handleEdit(student)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(student)">
                删除
              </el-button>
            </div>
          </div>
          <div class="student-info">
            <h3 class="student-name">{{ student.name }}</h3>
            <div class="student-basic">
              <p><span class="label">年龄：</span>{{ student.age }}岁</p>
              <p><span class="label">性别：</span>{{ student.gender === 'male' ? '男' : '女' }}</p>
              <p><span class="label">身高：</span>{{ student.height }}cm</p>
              <p><span class="label">班级：</span>{{ student.class }}</p>
            </div>
            <div class="student-personality">
              <el-tag type="primary" size="small">{{ student.mbti }}</el-tag>
              <el-tag type="success" size="small" style="margin-left: 4px">{{ student.zodiac }}</el-tag>
            </div>
            <div class="student-stats">
              <div class="stat-item">
                <span class="stat-label">学习能力</span>
                <el-progress :percentage="student.learningAbility" :show-text="false" :stroke-width="6" />
              </div>
              <div class="stat-item">
                <span class="stat-label">参与度</span>
                <el-progress :percentage="student.participation" :show-text="false" :stroke-width="6" color="#67c23a" />
              </div>
            </div>
            <div class="usage-count">
              <el-icon><User /></el-icon>
              <span>使用次数：{{ student.usageCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48, 96]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 添加/编辑学生模型对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="resetForm"
    >
      <el-form :model="studentForm" :rules="formRules" ref="formRef" label-width="120px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="头像" prop="avatar">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                  >
                    <div v-if="studentForm.name" class="avatar-div" :style="{ backgroundColor: getAvatarColor(studentForm.name) }">
                      {{ getInitials(studentForm.name) }}
                    </div>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="studentForm.name" placeholder="请输入学生姓名" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="年龄" prop="age">
                      <el-input-number v-model="studentForm.age" :min="10" :max="20" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                      <el-radio-group v-model="studentForm.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身高(cm)" prop="height">
                      <el-input-number v-model="studentForm.height" :min="120" :max="200" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="学校" prop="school">
                      <el-input v-model="studentForm.school" placeholder="请输入学校名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="班级" prop="class">
                      <el-input v-model="studentForm.class" placeholder="如：八年级(3)班" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="生日" prop="birthday">
                      <el-date-picker
                        v-model="studentForm.birthday"
                        type="date"
                        placeholder="选择生日"
                        style="width: 100%"
                        format="MM月DD日"
                        value-format="MM-DD"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="星座" prop="zodiac">
                      <el-select v-model="studentForm.zodiac" placeholder="请选择星座" style="width: 100%">
                        <el-option label="白羊座" value="白羊座" />
                        <el-option label="金牛座" value="金牛座" />
                        <el-option label="双子座" value="双子座" />
                        <el-option label="巨蟹座" value="巨蟹座" />
                        <el-option label="狮子座" value="狮子座" />
                        <el-option label="处女座" value="处女座" />
                        <el-option label="天秤座" value="天秤座" />
                        <el-option label="天蝎座" value="天蝎座" />
                        <el-option label="射手座" value="射手座" />
                        <el-option label="摩羯座" value="摩羯座" />
                        <el-option label="水瓶座" value="水瓶座" />
                        <el-option label="双鱼座" value="双鱼座" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="人格特征" name="personality">
            <el-form-item label="MBTI人格" prop="mbti">
              <el-select v-model="studentForm.mbti" placeholder="请选择MBTI人格类型" style="width: 200px">
                <el-option label="ESTP（企业家型）" value="ESTP" />
                <el-option label="ISFJ（守护者型）" value="ISFJ" />
                <el-option label="ENFP（竞选者型）" value="ENFP" />
                <el-option label="INTJ（建筑师型）" value="INTJ" />
                <el-option label="ESFP（娱乐家型）" value="ESFP" />
                <el-option label="ISTJ（物流师型）" value="ISTJ" />
                <el-option label="ENTP（辩论家型）" value="ENTP" />
                <el-option label="INFJ（提倡者型）" value="INFJ" />
              </el-select>
            </el-form-item>
            <el-form-item label="性格特点" prop="personality">
              <el-input
                v-model="studentForm.personality"
                type="textarea"
                :rows="4"
                placeholder="请描述学生的性格特点，如：性格直爽，大大咧咧，有什么说什么..."
              />
            </el-form-item>
            <el-form-item label="心理特征" prop="psychology">
              <el-input
                v-model="studentForm.psychology"
                type="textarea"
                :rows="3"
                placeholder="请描述学生的心理特征，如：内心强大，对自己的能力充满信心..."
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="学习能力" name="learning">
            <el-form-item label="学习能力评分">
              <el-slider
                v-model="studentForm.learningAbility"
                :min="0"
                :max="100"
                :step="5"
                show-input
                :format-tooltip="(val) => `${val}分`"
              />
            </el-form-item>
            <el-form-item label="擅长科目" prop="goodSubjects">
              <el-select
                v-model="studentForm.goodSubjects"
                multiple
                placeholder="请选择擅长的科目"
                style="width: 100%"
              >
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
                <el-option label="物理" value="物理" />
                <el-option label="化学" value="化学" />
                <el-option label="生物" value="生物" />
                <el-option label="历史" value="历史" />
                <el-option label="地理" value="地理" />
                <el-option label="政治" value="政治" />
                <el-option label="体育" value="体育" />
                <el-option label="艺术" value="艺术" />
                <el-option label="音乐" value="音乐" />
              </el-select>
            </el-form-item>
            <el-form-item label="薄弱科目" prop="weakSubjects">
              <el-select
                v-model="studentForm.weakSubjects"
                multiple
                placeholder="请选择薄弱的科目"
                style="width: 100%"
              >
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
                <el-option label="物理" value="物理" />
                <el-option label="化学" value="化学" />
                <el-option label="生物" value="生物" />
                <el-option label="历史" value="历史" />
                <el-option label="地理" value="地理" />
                <el-option label="政治" value="政治" />
              </el-select>
            </el-form-item>
            <el-form-item label="学习描述" prop="learningDescription">
              <el-input
                v-model="studentForm.learningDescription"
                type="textarea"
                :rows="4"
                placeholder="请描述学生的学习能力和特点，如：擅长体育和艺术，是校田径队成员..."
              />
            </el-form-item>
            <el-form-item label="课堂参与度">
              <el-slider
                v-model="studentForm.participation"
                :min="0"
                :max="100"
                :step="5"
                show-input
                :format-tooltip="(val) => `${val}%`"
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="兴趣爱好" name="interests">
            <el-form-item label="兴趣爱好" prop="interests">
              <el-select
                v-model="studentForm.interests"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择或输入兴趣爱好"
                style="width: 100%"
              >
                <el-option label="阅读" value="阅读" />
                <el-option label="运动" value="运动" />
                <el-option label="音乐" value="音乐" />
                <el-option label="绘画" value="绘画" />
                <el-option label="舞蹈" value="舞蹈" />
                <el-option label="游戏" value="游戏" />
                <el-option label="旅行" value="旅行" />
                <el-option label="摄影" value="摄影" />
                <el-option label="编程" value="编程" />
                <el-option label="手工" value="手工" />
              </el-select>
            </el-form-item>
            <el-form-item label="兴趣描述" prop="interestDescription">
              <el-input
                v-model="studentForm.interestDescription"
                type="textarea"
                :rows="4"
                placeholder="请详细描述学生的兴趣爱好，如：热爱舞蹈，学习拉丁舞多年，参加过不少比赛并获得奖项..."
              />
            </el-form-item>
          </el-tab-pane>
          
          <el-tab-pane label="家庭背景" name="family">
            <el-form-item label="家庭背景" prop="familyBackground">
              <el-input
                v-model="studentForm.familyBackground"
                type="textarea"
                :rows="4"
                placeholder="请描述学生的家庭背景，如：父亲是一名体育教练，从小培养她的运动能力..."
              />
            </el-form-item>
            <el-form-item label="父亲职业">
              <el-input v-model="studentForm.fatherJob" placeholder="请输入父亲职业" />
            </el-form-item>
            <el-form-item label="母亲职业">
              <el-input v-model="studentForm.motherJob" placeholder="请输入母亲职业" />
            </el-form-item>
            <el-form-item label="家庭经济状况">
              <el-radio-group v-model="studentForm.economicStatus">
                <el-radio label="excellent">优秀</el-radio>
                <el-radio label="good">良好</el-radio>
                <el-radio label="average">一般</el-radio>
                <el-radio label="poor">困难</el-radio>
              </el-radio-group>
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

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="学生模型详情"
      width="900px"
    >
      <div v-if="currentStudent" class="student-detail">
        <div class="detail-header">
          <div class="student-avatar-large">
            <div class="student-avatar-large-div" :style="{ backgroundColor: getAvatarColor(currentStudent.name) }">
              {{ getInitials(currentStudent.name) }}
            </div>
          </div>
          <div class="student-basic-info">
            <h2>{{ currentStudent.name }}</h2>
            <div class="basic-tags">
              <el-tag type="primary" size="large">{{ currentStudent.mbti }}</el-tag>
              <el-tag type="success" size="large" style="margin-left: 8px">{{ currentStudent.zodiac }}</el-tag>
              <el-tag type="info" size="large" style="margin-left: 8px">{{ currentStudent.age }}岁</el-tag>
            </div>
            <div class="basic-info-grid">
              <div class="info-item">
                <span class="info-label">性别：</span>
                <span>{{ currentStudent.gender === 'male' ? '男' : '女' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">身高：</span>
                <span>{{ currentStudent.height }}cm</span>
              </div>
              <div class="info-item">
                <span class="info-label">学校：</span>
                <span>{{ currentStudent.school }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">班级：</span>
                <span>{{ currentStudent.class }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">生日：</span>
                <span>{{ currentStudent.birthday }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">使用次数：</span>
                <span>{{ currentStudent.usageCount }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <el-tabs>
          <el-tab-pane label="性格特点" name="personality">
            <div class="detail-section">
              <h3>MBTI人格：{{ currentStudent.mbti }}（{{ getMBTIDescription(currentStudent.mbti) }}）</h3>
              <div class="content-box">
                {{ currentStudent.personality }}
              </div>
            </div>
            <div class="detail-section">
              <h3>心理特征</h3>
              <div class="content-box">
                {{ currentStudent.psychology }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="学习能力" name="learning">
            <div class="ability-stats">
              <div class="stat-item">
                <span class="stat-label">学习能力</span>
                <el-progress :percentage="currentStudent.learningAbility" :stroke-width="12" />
              </div>
              <div class="stat-item">
                <span class="stat-label">课堂参与度</span>
                <el-progress :percentage="currentStudent.participation" :stroke-width="12" color="#67c23a" />
              </div>
            </div>
            
            <div class="subjects-section">
              <div class="subject-group">
                <h4>擅长科目</h4>
                <div class="subject-tags">
                  <el-tag v-for="subject in currentStudent.goodSubjects" :key="subject" type="success" style="margin: 4px">
                    {{ subject }}
                  </el-tag>
                </div>
              </div>
              <div class="subject-group">
                <h4>薄弱科目</h4>
                <div class="subject-tags">
                  <el-tag v-for="subject in currentStudent.weakSubjects" :key="subject" type="warning" style="margin: 4px">
                    {{ subject }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>学习描述</h3>
              <div class="content-box">
                {{ currentStudent.learningDescription }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="兴趣爱好" name="interests">
            <div class="interests-tags">
              <el-tag v-for="interest in currentStudent.interests" :key="interest" type="primary" size="large" style="margin: 4px">
                {{ interest }}
              </el-tag>
            </div>
            <div class="detail-section">
              <h3>兴趣描述</h3>
              <div class="content-box">
                {{ currentStudent.interestDescription }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="家庭背景" name="family">
            <div class="family-info">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="父亲职业">{{ currentStudent.fatherJob || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="母亲职业">{{ currentStudent.motherJob || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="经济状况">
                  <el-tag :type="getEconomicStatusTag(currentStudent.economicStatus)">
                    {{ getEconomicStatusLabel(currentStudent.economicStatus) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ currentStudent.createTime }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="detail-section">
              <h3>家庭背景描述</h3>
              <div class="content-box">
                {{ currentStudent.familyBackground }}
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
import { Plus, Upload, Download, Refresh, Search, User } from '@element-plus/icons-vue'

interface StudentModel {
  id: number
  name: string
  age: number
  gender: 'male' | 'female'
  height: number
  school: string
  class: string
  birthday: string
  zodiac: string
  mbti: string
  personality: string
  psychology: string
  learningAbility: number
  participation: number
  goodSubjects: string[]
  weakSubjects: string[]
  learningDescription: string
  interests: string[]
  interestDescription: string
  familyBackground: string
  fatherJob?: string
  motherJob?: string
  economicStatus: string
  avatar: string
  usageCount: number
  createTime: string
}

const loading = ref(false)
const searchKeyword = ref('')
const selectedGender = ref('')
const selectedPersonality = ref('')
const selectedGrade = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('添加学生模型')
const currentStudent = ref<StudentModel | null>(null)
const formRef = ref()
const activeTab = ref('basic')

const studentForm = reactive({
  id: null as number | null,
  name: '',
  age: 14,
  gender: 'female' as 'male' | 'female',
  height: 156,
  school: '',
  class: '',
  birthday: '',
  zodiac: '',
  mbti: '',
  personality: '',
  psychology: '',
  learningAbility: 75,
  participation: 80,
  goodSubjects: [] as string[],
  weakSubjects: [] as string[],
  learningDescription: '',
  interests: [] as string[],
  interestDescription: '',
  familyBackground: '',
  fatherJob: '',
  motherJob: '',
  economicStatus: 'good',
  avatar: ''
})

const formRules = {
  name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  school: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  class: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  mbti: [{ required: true, message: '请选择MBTI人格类型', trigger: 'change' }],
  personality: [{ required: true, message: '请输入性格特点', trigger: 'blur' }]
}

const studentList = ref<StudentModel[]>([
  {
    id: 1,
    name: '苏晴',
    age: 14,
    gender: 'female',
    height: 156,
    school: '阳光实验中学',
    class: '八年级（3）班',
    birthday: '12-05',
    zodiac: '射手座',
    mbti: 'ESTP',
    personality: '性格直爽，大大咧咧，有什么说什么，从不藏着掖着。ESTP人格坦率直接，注重实际行动和结果，不喜欢拐弯抹角。乐观自信，面对困难总是勇往直前，不畏惧挑战，但有时过于自我，不太能听取他人的意见。',
    psychology: '内心强大，对自己的能力充满信心，很少因挫折而气馁。但在集体活动中，如果自己的想法不被采纳，会有些失落和委屈。',
    learningAbility: 75,
    participation: 85,
    goodSubjects: ['体育', '艺术'],
    weakSubjects: ['数学', '几何'],
    learningDescription: '擅长体育和艺术，是校田径队成员，在短跑项目上表现出色，多次在学校运动会上夺冠。绘画天赋也很高，美术课上的作品常常惊艳众人。然而文化课成绩一般，尤其是代数和几何，理解起来十分困难。',
    interests: ['舞蹈', '户外探险', '拉丁舞', '爬山', '露营'],
    interestDescription: '热爱舞蹈，学习拉丁舞多年，参加过不少比赛并获得奖项。喜欢户外探险，周末常和家人去爬山、露营，享受大自然的魅力。',
    familyBackground: '父亲是一名体育教练，从小培养她的运动能力；母亲是一名舞蹈老师，引导她走上艺术之路。家庭的专业引导和支持，为ESTP人格在体育和艺术方面的发展提供了良好条件。',
    fatherJob: '体育教练',
    motherJob: '舞蹈老师',
    economicStatus: 'good',
    avatar: 'https://via.placeholder.com/150x150?text=苏晴',
    usageCount: 45,
    createTime: '2024-01-15'
  },
  {
    id: 2,
    name: '李明轩',
    age: 15,
    gender: 'male',
    height: 168,
    school: '实验中学',
    class: '九年级（1）班',
    birthday: '03-15',
    zodiac: '双鱼座',
    mbti: 'ISFJ',
    personality: '性格内向稳重，做事认真负责，善于倾听他人意见。ISFJ人格温和友善，具有强烈的责任感和同理心，总是优先考虑他人的需要。',
    psychology: '内心敏感细腻，容易受到他人情绪影响。在面对冲突时倾向于回避，更愿意通过协调和妥协来解决问题。',
    learningAbility: 88,
    participation: 65,
    goodSubjects: ['语文', '历史', '生物'],
    weakSubjects: ['体育', '音乐'],
    learningDescription: '学习成绩优秀，特别擅长文科类科目，记忆力强，理解能力好。但在体育运动方面表现一般，不太喜欢竞技性强的活动。',
    interests: ['阅读', '写作', '历史研究', '古典音乐'],
    interestDescription: '热爱阅读各类书籍，尤其是历史类和文学作品。喜欢写作，经常在校刊上发表文章。对古典音乐有浓厚兴趣。',
    familyBackground: '父亲是中学语文教师，母亲是图书馆管理员。家庭书香气息浓厚，从小就培养了良好的阅读习惯。',
    fatherJob: '中学教师',
    motherJob: '图书馆管理员',
    economicStatus: 'average',
    avatar: 'https://via.placeholder.com/150x150?text=李明轩',
    usageCount: 32,
    createTime: '2024-01-12'
  }
])

const getMBTIDescription = (mbti: string) => {
  const descriptions: Record<string, string> = {
    'ESTP': '企业家型人格',
    'ISFJ': '守护者型人格',
    'ENFP': '竞选者型人格',
    'INTJ': '建筑师型人格',
    'ESFP': '娱乐家型人格',
    'ISTJ': '物流师型人格',
    'ENTP': '辩论家型人格',
    'INFJ': '提倡者型人格'
  }
  return descriptions[mbti] || mbti
}

const getEconomicStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'excellent': '优秀',
    'good': '良好',
    'average': '一般',
    'poor': '困难'
  }
  return labels[status] || status
}

const getEconomicStatusTag = (status: string) => {
  const tags: Record<string, string> = {
    'excellent': 'success',
    'good': 'primary',
    'average': 'warning',
    'poor': 'danger'
  }
  return tags[status] || 'info'
}

const handleAdd = () => {
  dialogTitle.value = '添加学生模型'
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleEdit = (student: StudentModel) => {
  dialogTitle.value = '编辑学生模型'
  Object.assign(studentForm, student)
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleView = (student: StudentModel) => {
  currentStudent.value = student
  detailDialogVisible.value = true
}

const handleDelete = async (student: StudentModel) => {
  try {
    await ElMessageBox.confirm(`确定要删除学生模型 "${student.name}" 吗？`, '确认删除', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
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
    ElMessage.success(studentForm.id ? '修改成功' : '添加成功')
    dialogVisible.value = false
    resetForm()
  } catch {
    ElMessage.error('请检查表单信息')
  }
}

const resetForm = () => {
  Object.assign(studentForm, {
    id: null,
    name: '',
    age: 14,
    gender: 'female',
    height: 156,
    school: '',
    class: '',
    birthday: '',
    zodiac: '',
    mbti: '',
    personality: '',
    psychology: '',
    learningAbility: 75,
    participation: 80,
    goodSubjects: [],
    weakSubjects: [],
    learningDescription: '',
    interests: [],
    interestDescription: '',
    familyBackground: '',
    fatherJob: '',
    motherJob: '',
    economicStatus: 'good',
    avatar: ''
  })
  formRef.value?.resetFields()
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarSuccess = (response: any, file: any) => {
  // Avatar functionality removed - using initials instead
}

const getInitials = (name: string) => {
  if (!name) return '学'
  const chars = name.trim().split('')
  return chars.length >= 2 ? chars.slice(-2).join('') : chars[0]
}

const getAvatarColor = (name: string) => {
  const colors = [
    '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', 
    '#909399', '#C71585', '#FF6347', '#32CD32',
    '#1E90FF', '#FF69B4', '#8A2BE2', '#00CED1'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
.student-model-library {
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

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.student-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

.student-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.student-avatar {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.student-card:hover .student-overlay {
  opacity: 1;
}

.student-info {
  padding: 16px;
}

.student-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  text-align: center;
}

.student-basic {
  margin-bottom: 12px;
}

.student-basic p {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

.label {
  font-weight: 500;
  color: #303133;
}

.student-personality {
  text-align: center;
  margin-bottom: 12px;
}

.student-stats {
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #606266;
  width: 60px;
}

.usage-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  justify-content: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar-div {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 6px;
}

.student-avatar-div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.student-avatar-large-div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
}

.student-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.student-avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.student-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-basic-info {
  flex: 1;
}

.student-basic-info h2 {
  margin: 0 0 12px 0;
  color: #303133;
}

.basic-tags {
  margin-bottom: 16px;
}

.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  min-width: 60px;
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

.ability-stats {
  margin-bottom: 20px;
}

.ability-stats .stat-item {
  margin-bottom: 16px;
}

.ability-stats .stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  display: block;
  width: auto;
}

.subjects-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.subject-group h4 {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
}

.subject-tags,
.interests-tags {
  min-height: 40px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.family-info {
  margin-bottom: 20px;
}
</style>