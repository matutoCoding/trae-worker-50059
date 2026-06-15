export interface Inmate {
  id: string;
  name: string;
  inmateNumber: string;
  gender: '男' | '女';
  age: number;
  crime: string;
  sentence: string;
  entryDate: string;
  releaseDate: string;
  prisonZone: string;
  educationLevel: string;
  skills: string[];
  status: '在押' | '离监探亲' | '住院';
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  type: '思想教育' | '文化扫盲' | '普法教育';
  teacher: string;
  totalHours: number;
  completedHours: number;
  schedule: string;
  location: string;
  participantCount: number;
  participantIds: string[];
}

export interface CourseHour {
  id: string;
  courseId: string;
  courseName: string;
  inmateId: string;
  inmateName: string;
  date: string;
  hours: number;
  status: '已完成' | '进行中' | '未开始';
  score?: number;
}

export interface Training {
  id: string;
  name: string;
  category: string;
  duration: number;
  level: '初级' | '中级' | '高级';
  certificate: boolean;
  description: string;
  progress: number;
  traineeCount: number;
  traineeIds: string[];
}

export interface TrainingRecord {
  id: string;
  trainingId: string;
  trainingName: string;
  inmateId: string;
  inmateName: string;
  startDate: string;
  progress: number;
  score?: number;
  passed?: boolean;
  certificateDate?: string;
}

export interface Assessment {
  id: string;
  inmateId: string;
  inmateName: string;
  type: '常规测评' | '危机评估';
  date: string;
  score: number;
  level: '正常' | '轻度' | '中度' | '重度';
  counselor: string;
  notes: string;
}

export interface CrisisIntervention {
  id: string;
  inmateId: string;
  inmateName: string;
  date: string;
  level: '一般' | '严重' | '紧急';
  description: string;
  measures: string;
  status: '处理中' | '已处理' | '跟踪中';
  counselor: string;
}

export interface BehaviorRecord {
  id: string;
  inmateId: string;
  inmateName: string;
  date: string;
  discipline: number;
  labor: number;
  study: number;
  cooperation: number;
  totalScore: number;
  remark: string;
}

export interface Violation {
  id: string;
  inmateId: string;
  inmateName: string;
  date: string;
  type: string;
  severity: '轻微' | '一般' | '严重';
  description: string;
  punishment: string;
  status: '待处理' | '处理中' | '已处理';
}

export interface FamilyVisit {
  id: string;
  inmateId: string;
  inmateName: string;
  visitorName: string;
  relationship: string;
  visitType: '现场会见' | '视频会见';
  date: string;
  timeSlot: string;
  status: '待确认' | '已确认' | '已完成' | '已取消';
  duration: number;
  room?: string;
  notes?: string;
}

export interface VideoRecord {
  id: string;
  visitId?: string;
  inmateId: string;
  inmateName: string;
  visitorName: string;
  relationship: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
}

export interface ReleaseAssessment {
  id: string;
  inmateId: string;
  inmateName: string;
  date: string;
  ideologyScore: number;
  skillScore: number;
  psychologyScore: number;
  socialScore: number;
  overallScore: number;
  result: '合格' | '需观察' | '不合格';
  counselor: string;
  suggestions: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  requirements: string;
  matchScore: number;
  skills: string[];
  contact: string;
}

export interface StatsCard {
  title: string;
  value: number | string;
  change?: string;
  icon: string;
  color: string;
}

export interface InmateProfileStats {
  totalCourseHours: number;
  completedCourses: number;
  activeTrainings: number;
  completedTrainings: number;
  latestPsychologyLevel: string;
  avgBehaviorScore: number;
  totalFamilyVisits: number;
  hasReleaseAssessment: boolean;
  releaseAssessmentResult?: string;
}
