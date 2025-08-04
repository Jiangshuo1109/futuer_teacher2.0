import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录 - 未来教师实习实训系统'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard/home',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Dashboard/Home.vue'),
        meta: {
          title: '首页 - 未来教师实习实训系统'
        }
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/dashboard/system/role',
        children: [
          {
            path: 'role',
            name: 'RoleManagement',
            component: () => import('@/views/System/RoleManagement.vue'),
            meta: {
              title: '角色管理 - 未来教师实习实训系统'
            }
          },
          {
            path: 'permission',
            name: 'PermissionManagement',
            component: () => import('@/views/System/PermissionManagement.vue'),
            meta: {
              title: '权限管理 - 未来教师实习实训系统'
            }
          }
        ]
      },
      {
        path: 'organization',
        name: 'Organization',
        redirect: '/dashboard/organization/campus',
        children: [
          {
            path: 'campus',
            name: 'CampusManagement',
            component: () => import('@/views/Organization/CampusManagement.vue'),
            meta: {
              title: '校区管理 - 未来教师实习实训系统'
            }
          },
          {
            path: 'college',
            name: 'CollegeManagement',
            component: () => import('@/views/Organization/CollegeManagement.vue'),
            meta: {
              title: '学院管理 - 未来教师实习实训系统'
            }
          },
          {
            path: 'major',
            name: 'MajorManagement',
            component: () => import('@/views/Organization/MajorManagement.vue'),
            meta: {
              title: '专业管理 - 未来教师实习实训系统'
            }
          },
          {
            path: 'class',
            name: 'ClassManagement',
            component: () => import('@/views/Organization/ClassManagement.vue'),
            meta: {
              title: '班级管理 - 未来教师实习实训系统'
            }
          },
          {
            path: 'user',
            name: 'UserManagement',
            component: () => import('@/views/Organization/UserManagement.vue'),
            meta: {
              title: '用户管理 - 未来教师实习实训系统'
            }
          }
        ]
      },
      {
        path: 'database',
        name: 'Database',
        redirect: '/dashboard/database/course',
        children: [
          {
            path: 'course',
            name: 'CourseLibrary',
            component: () => import('@/views/Database/CourseLibrary.vue'),
            meta: {
              title: '课程库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'courseware',
            name: 'CoursewareLibrary',
            component: () => import('@/views/Database/CoursewareLibrary.vue'),
            meta: {
              title: '课件库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'question',
            name: 'QuestionBank',
            component: () => import('@/views/Database/QuestionBank.vue'),
            meta: {
              title: '题库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'semantic',
            name: 'SemanticLibrary',
            component: () => import('@/views/Database/SemanticLibrary.vue'),
            meta: {
              title: '语义库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'special-event',
            name: 'SpecialEventLibrary',
            component: () => import('@/views/Database/SpecialEventLibrary.vue'),
            meta: {
              title: '特殊事件库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'student-model',
            name: 'StudentModelLibrary',
            component: () => import('@/views/Database/StudentModelLibrary.vue'),
            meta: {
              title: '学生模型库 - 未来教师实习实训系统'
            }
          },

          {
            path: 'client-version',
            name: 'ClientVersionLibrary',
            component: () => import('@/views/Database/ClientVersionLibrary.vue'),
            meta: {
              title: '客户端版本库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'evaluation-system',
            name: 'EvaluationSystemLibrary',
            component: () => import('@/views/Database/EvaluationSystemLibrary.vue'),
            meta: {
              title: '教学评价体系库 - 未来教师实习实训系统'
            }
          },
          {
            path: 'evaluation-standards-editor',
            name: 'EvaluationStandardsEditor',
            component: () => import('@/views/Database/EvaluationStandardsEditor.vue'),
            meta: {
              title: '评价标准设置 - 未来教师实习实训系统'
            }
          }
        ]
      },
      {
        path: 'teaching',
        name: 'Teaching',
        redirect: '/dashboard/teaching/task-publish',
        children: [
          {
            path: 'task-publish',
            name: 'TaskPublish',
            component: () => import('@/views/Teaching/TaskPublish.vue'),
            meta: {
              title: '教学任务发布 - 未来教师实习实训系统'
            }
          },
          {
            path: 'my-tasks',
            name: 'MyTasks',
            component: () => import('@/views/Teaching/MyTasks.vue'),
            meta: {
              title: '我的教学任务 - 未来教师实习实训系统'
            }
          },
          {
            path: 'task/:taskId/students',
            name: 'StudentLearningStatus',
            component: () => import('@/views/Teaching/StudentLearningStatus.vue'),
            meta: {
              title: '师范生学习情况 - 未来教师实习实训系统'
            }
          },
          {
            path: 'task/:taskId/student/:studentId/ai-evaluation',
            name: 'AIEvaluation',
            component: () => import('@/views/Teaching/AIEvaluation.vue'),
            meta: {
              title: 'AI综合教学评价 - 未来教师实习实训系统'
            }
          },
          {
            path: 'task/:taskId/student/:studentId/audio-analysis',
            name: 'AudioAnalysis',
            component: () => import('@/views/Teaching/AIAudioAnalysis.vue'),
            meta: {
              title: 'AI音频分析 - 未来教师实习实训系统'
            }
          },
          {
            path: 'task/:taskId/student/:studentId/video-analysis',
            name: 'VideoAnalysis',
            component: () => import('@/views/Teaching/AIVideoAnalysis.vue'),
            meta: {
              title: 'AI视频分析 - 未来教师实习实训系统'
            }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }

  // 检查是否需要登录
  if (to.meta?.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }

  next()
})

export default router