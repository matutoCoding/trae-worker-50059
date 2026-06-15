import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  BookOpen,
  Wrench,
  HeartPulse,
  ClipboardCheck,
  UsersRound,
  DoorOpen,
  ExternalLink,
  GraduationCap,
  Video,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import Tabs from '@/components/Tabs';
import ProgressBar from '@/components/ProgressBar';
import type { Inmate } from '@/types';

const tabs = [
  { key: 'all', label: '全部人员' },
  { key: 'zone1', label: '一监区' },
  { key: 'zone2', label: '二监区' },
  { key: 'zone3', label: '三监区' },
];

const profileTabs = [
  { key: 'overview', label: '改造概览' },
  { key: 'education', label: '教育课时' },
  { key: 'training', label: '技能培训' },
  { key: 'psychology', label: '心理测评' },
  { key: 'behavior', label: '行为评分' },
  { key: 'family', label: '亲情会见' },
  { key: 'release', label: '出监评估' },
];

export default function InmateProfile() {
  const navigate = useNavigate();
  const {
    inmates,
    getInmateStats,
    getInmateCourseHours,
    getInmateTrainings,
    getInmateAssessments,
    getInmateBehaviorRecords,
    getInmateFamilyVisits,
    getInmateReleaseAssessment,
  } = useStore();

  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null);
  const [profileTab, setProfileTab] = useState('overview');

  const pageSize = 6;

  const zoneMap: Record<string, string> = {
    all: 'all',
    zone1: '一监区',
    zone2: '二监区',
    zone3: '三监区',
  };

  const filteredInmates = inmates.filter((inmate) => {
    const matchesSearch =
      inmate.name.includes(searchText) ||
      inmate.inmateNumber.includes(searchText);
    const matchesZone =
      activeTab === 'all' ||
      inmate.prisonZone === zoneMap[activeTab];
    return matchesSearch && matchesZone;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchText]);

  const totalPages = Math.ceil(filteredInmates.length / pageSize);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const paginatedInmates = filteredInmates.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const totalInmates = inmates.length;
  const activeInmates = inmates.filter((i) => i.status === '在押').length;
  const avgSentence = '5.2年';
  const goodBehaviorRate = '78%';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case '在押':
        return 'success';
      case '离监探亲':
        return 'warning';
      case '住院':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getPsychologyColor = (level: string) => {
    switch (level) {
      case '正常':
        return 'text-green-600 bg-green-50';
      case '轻度':
        return 'text-blue-600 bg-blue-50';
      case '中度':
        return 'text-yellow-600 bg-yellow-50';
      case '重度':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const navigateToModule = (module: string, inmateId: string) => {
    const routes: Record<string, string> = {
      education: '/education',
      training: '/training',
      psychology: '/psychology',
      behavior: '/behavior',
      family: '/family',
      release: '/release',
    };
    navigate(routes[module], { state: { inmateId } });
  };

  const renderProfileDetail = () => {
    if (!selectedInmate) return null;

    const stats = getInmateStats(selectedInmate.id);
    const courseHours = getInmateCourseHours(selectedInmate.id);
    const trainings = getInmateTrainings(selectedInmate.id);
    const assessments = getInmateAssessments(selectedInmate.id);
    const behaviorRecords = getInmateBehaviorRecords(selectedInmate.id, 10);
    const familyVisits = getInmateFamilyVisits(selectedInmate.id);
    const releaseAssessment = getInmateReleaseAssessment(selectedInmate.id);

    return (
      <div className="space-y-6 animate-fadeIn">
        <button
          onClick={() => {
            setSelectedInmate(null);
            setProfileTab('overview');
          }}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          返回列表
        </button>

        <Card>
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 font-serif">{selectedInmate.name}</h2>
                <StatusBadge
                  status={selectedInmate.status}
                  variant={getStatusVariant(selectedInmate.status) as any}
                  size="md"
                />
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {selectedInmate.inmateNumber}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {selectedInmate.prisonZone}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400">性别</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">年龄</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.age}岁</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">罪名</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.crime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">刑期</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.sentence}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">入监时间</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.entryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">预计出狱</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.releaseDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">文化程度</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.educationLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">已掌握技能</p>
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {selectedInmate.skills.map((skill, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigateToModule('education', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">累计教育课时</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalCourseHours}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigateToModule('training', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">技能培训</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.activeTrainings}/{stats.completedTrainings + stats.activeTrainings}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigateToModule('psychology', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPsychologyColor(stats.latestPsychologyLevel).split(' ')[1]}`}>
                  <HeartPulse className={`w-5 h-5 ${getPsychologyColor(stats.latestPsychologyLevel).split(' ')[0]}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">心理状态</p>
                  <p className={`text-2xl font-bold ${getPsychologyColor(stats.latestPsychologyLevel).split(' ')[0]}`}>
                    {stats.latestPsychologyLevel}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigateToModule('behavior', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">行为评分(平均分)</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgBehaviorScore}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigateToModule('family', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-pink-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <UsersRound className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">亲情会见次数</p>
                  <p className="text-2xl font-bold text-pink-600">{stats.totalFamilyVisits}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigateToModule('release', selectedInmate.id)}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.hasReleaseAssessment
                    ? stats.releaseAssessmentResult === '合格'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}>
                  {stats.hasReleaseAssessment ? (
                    <CheckCircle className={`w-5 h-5 ${
                      stats.releaseAssessmentResult === '合格' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">出监评估</p>
                  <p className={`text-xl font-bold ${
                    stats.hasReleaseAssessment
                      ? stats.releaseAssessmentResult === '合格'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                      : 'text-gray-500'
                  }`}>
                    {stats.hasReleaseAssessment ? stats.releaseAssessmentResult : '未评估'}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
          </button>
        </div>

        <Card>
          <Tabs tabs={profileTabs} activeTab={profileTab} onChange={setProfileTab} />

          <div className="mt-5">
            {profileTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    最近教育课时记录
                  </h4>
                  {courseHours.length > 0 ? (
                    <div className="space-y-2">
                      {courseHours.slice(0, 5).map((h) => (
                        <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{h.courseName}</p>
                              <p className="text-xs text-gray-500">{h.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{h.hours}课时</p>
                            {h.score && <p className="text-xs text-gray-500">成绩：{h.score}分</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-4">暂无教育课时记录</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-green-500" />
                    技能培训进度
                  </h4>
                  {trainings.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {trainings.slice(0, 4).map((t) => (
                        <div key={t.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">{t.name}</p>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              t.level === '初级' ? 'bg-green-100 text-green-700' :
                              t.level === '中级' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {t.level}
                            </span>
                          </div>
                          <ProgressBar value={t.progress} showLabel size="sm" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-4">暂无技能培训记录</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-orange-500" />
                    最近行为评分趋势
                  </h4>
                  {behaviorRecords.length > 0 ? (
                    <div className="flex items-end justify-between h-32 gap-2 px-2">
                      {behaviorRecords.slice(0, 7).reverse().map((r, i) => (
                        <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all hover:from-blue-600 hover:to-blue-500"
                            style={{ height: `${(r.totalScore / 40) * 100}px`, minHeight: '4px' }}
                          />
                          <span className="text-xs text-gray-500">{r.totalScore}</span>
                          <span className="text-[10px] text-gray-400">{r.date.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-4">暂无行为评分记录</p>
                  )}
                </div>
              </div>
            )}

            {profileTab === 'education' && (
              <div className="space-y-3">
                {courseHours.length > 0 ? (
                  courseHours.map((h) => (
                    <div key={h.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{h.courseName}</p>
                            <p className="text-xs text-gray-500">{h.date} · {h.hours}课时</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StatusBadge
                            status={h.status}
                            variant={h.status === '已完成' ? 'success' : h.status === '进行中' ? 'warning' : 'default'}
                          />
                          {h.score && <p className="text-sm font-medium text-gray-900 mt-1">{h.score}分</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">暂无教育课时记录</p>
                )}
              </div>
            )}

            {profileTab === 'training' && (
              <div className="grid grid-cols-2 gap-4">
                {trainings.length > 0 ? (
                  trainings.map((t) => (
                    <div key={t.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{t.name}</h5>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          t.level === '初级' ? 'bg-green-100 text-green-700' :
                          t.level === '中级' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {t.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{t.category} · {t.duration}课时</p>
                      <ProgressBar value={t.progress} showLabel />
                      {t.certificate && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          可获得证书
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-gray-400 py-8">暂无技能培训记录</p>
                )}
              </div>
            )}

            {profileTab === 'psychology' && (
              <div className="space-y-3">
                {assessments.length > 0 ? (
                  assessments.map((a) => (
                    <div key={a.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPsychologyColor(a.level).split(' ')[1]}`}>
                            <HeartPulse className={`w-4 h-4 ${getPsychologyColor(a.level).split(' ')[0]}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{a.type}</p>
                            <p className="text-xs text-gray-500">{a.date} · 咨询师：{a.counselor}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-sm font-medium rounded ${getPsychologyColor(a.level)}`}>
                            {a.level}
                          </span>
                          <p className="text-sm font-medium text-gray-900 mt-1">{a.score}分</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">{a.notes}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">暂无心理测评记录</p>
                )}
              </div>
            )}

            {profileTab === 'behavior' && (
              <div className="space-y-3">
                {behaviorRecords.length > 0 ? (
                  behaviorRecords.map((r) => (
                    <div key={r.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{r.date}</span>
                        </div>
                        <span className={`text-lg font-bold ${
                          r.totalScore >= 36 ? 'text-green-600' :
                          r.totalScore >= 30 ? 'text-blue-600' :
                          r.totalScore >= 24 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {r.totalScore}/40
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">遵规守纪</p>
                          <p className="text-sm font-medium text-gray-900">{r.discipline}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">劳动表现</p>
                          <p className="text-sm font-medium text-gray-900">{r.labor}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">学习态度</p>
                          <p className="text-sm font-medium text-gray-900">{r.study}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">团结互助</p>
                          <p className="text-sm font-medium text-gray-900">{r.cooperation}</p>
                        </div>
                      </div>
                      {r.remark && <p className="text-xs text-gray-500">备注：{r.remark}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">暂无行为评分记录</p>
                )}
              </div>
            )}

            {profileTab === 'family' && (
              <div className="space-y-3">
                {familyVisits.length > 0 ? (
                  familyVisits.map((v) => (
                    <div key={v.id} className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            v.visitType === '现场会见' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {v.visitType === '现场会见' ? (
                              <UsersRound className={`w-4 h-4 ${v.visitType === '现场会见' ? 'text-green-600' : 'text-blue-600'}`} />
                            ) : (
                              <Video className={`w-4 h-4 ${v.visitType === '现场会见' ? 'text-green-600' : 'text-blue-600'}`} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {v.visitorName}（{v.relationship}）→ {v.inmateName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {v.visitType} · {v.date} {v.timeSlot}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StatusBadge
                            status={v.status}
                            variant={
                              v.status === '已确认' ? 'success' :
                              v.status === '待确认' ? 'warning' :
                              v.status === '已完成' ? 'info' : 'default'
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">{v.duration}分钟</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">暂无亲情会见记录</p>
                )}
              </div>
            )}

            {profileTab === 'release' && (
              <div>
                {releaseAssessment ? (
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <DoorOpen className="w-5 h-5 text-indigo-600" />
                        出监前综合评估报告
                      </h4>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        releaseAssessment.result === '合格' ? 'bg-green-100 text-green-700' :
                        releaseAssessment.result === '需观察' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {releaseAssessment.result}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">评估日期：{releaseAssessment.date}</p>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">思想改造</p>
                        <p className="text-2xl font-bold text-blue-600">{releaseAssessment.ideologyScore}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">技能水平</p>
                        <p className="text-2xl font-bold text-green-600">{releaseAssessment.skillScore}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">心理健康</p>
                        <p className="text-2xl font-bold text-purple-600">{releaseAssessment.psychologyScore}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">社会适应</p>
                        <p className="text-2xl font-bold text-orange-600">{releaseAssessment.socialScore}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg mb-4">
                      <span className="text-gray-700 font-medium">综合评分</span>
                      <span className="text-3xl font-bold text-indigo-600">{releaseAssessment.overallScore}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">评估建议：</p>
                      <p className="text-sm text-gray-600 p-3 bg-white rounded">{releaseAssessment.suggestions}</p>
                      <p className="text-xs text-gray-500 text-right mt-2">评估人：{releaseAssessment.counselor}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DoorOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">暂无出监评估记录</p>
                    <p className="text-sm text-gray-400 mt-1">出监前可进行综合评估</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="人员档案"
        subtitle="服刑人员基本信息管理与改造档案"
      />

      {selectedInmate ? (
        renderProfileDetail()
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <DataCard
              title="在押总人数"
              value={activeInmates}
              subtitle={`共 ${totalInmates} 人`}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: '较上月 +3%', positive: true }}
            />
            <DataCard
              title="本月新入监"
              value="12人"
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
            />
            <DataCard
              title="平均刑期"
              value={avgSentence}
              icon={<Clock className="w-5 h-5" />}
              color="orange"
            />
            <DataCard
              title="改造表现良好率"
              value={goodBehaviorRate}
              icon={<Award className="w-5 h-5" />}
              color="purple"
              trend={{ value: '较上月 +5%', positive: true }}
            />
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索姓名或编号"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-56 h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="w-4 h-4" />
                  筛选
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {paginatedInmates.map((inmate) => {
                const stats = getInmateStats(inmate.id);
                return (
                  <div
                    key={inmate.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedInmate(inmate)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                        <User className="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900">{inmate.name}</h4>
                          <StatusBadge status={inmate.status} variant={getStatusVariant(inmate.status) as any} />
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{inmate.inmateNumber} · {inmate.prisonZone}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {inmate.crime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {inmate.sentence}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-600">{stats.totalCourseHours}课时</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <HeartPulse className={`w-3 h-3 ${getPsychologyColor(stats.latestPsychologyLevel).split(' ')[0]}`} />
                            <span className="text-gray-600">{stats.latestPsychologyLevel}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <ClipboardCheck className="w-3 h-3 text-orange-500" />
                            <span className="text-gray-600">{stats.avgBehaviorScore}分</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredInmates.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">没有找到匹配的人员</p>
                <p className="text-sm text-gray-400 mt-1">请尝试其他搜索条件</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                共 {filteredInmates.length} 条记录，第 {safeCurrentPage}/{Math.max(totalPages, 1)} 页
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                      safeCurrentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(Math.max(totalPages, 1), safeCurrentPage + 1))}
                  disabled={safeCurrentPage === Math.max(totalPages, 1)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
