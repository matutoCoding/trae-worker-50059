import { useState } from 'react';
import { BookOpen, GraduationCap, Clock, Users, Calendar, MapPin, Plus, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';

const tabs = [
  { key: 'all', label: '全部课程' },
  { key: 'ideology', label: '思想教育' },
  { key: 'literacy', label: '文化扫盲' },
  { key: 'law', label: '普法教育' },
];

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function Education() {
  const { courses, courseHours } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const filteredCourses = courses.filter((course) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ideology') return course.type === '思想教育';
    if (activeTab === 'literacy') return course.type === '文化扫盲';
    if (activeTab === 'law') return course.type === '普法教育';
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case '思想教育':
        return 'bg-red-100 text-red-600';
      case '文化扫盲':
        return 'bg-green-100 text-green-600';
      case '普法教育':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const totalCourses = courses.length;
  const totalHours = courses.reduce((sum, c) => sum + c.completedHours, 0);
  const totalParticipants = courses.reduce((sum, c) => sum + c.participantCount, 0);

  const scheduleData = [
    { day: 0, morning: ['思想道德修养'], afternoon: ['文化课扫盲班'] },
    { day: 1, morning: ['小学数学辅导'], afternoon: ['法律基础知识'] },
    { day: 2, morning: ['思想道德修养'], afternoon: ['心理健康教育', '文化课扫盲班'] },
    { day: 3, morning: ['小学数学辅导'], afternoon: ['法律基础知识'] },
    { day: 4, morning: ['思想道德修养'], afternoon: ['文化课扫盲班'] },
    { day: 5, morning: ['爱国主义教育'], afternoon: [] },
    { day: 6, morning: [], afternoon: [] },
  ];

  return (
    <div>
      <PageHeader
        title="教育课程"
        subtitle="思想教育、文化扫盲与普法教育课程管理"
        actions={
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            新增课程
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DataCard
          title="开设课程数"
          value={totalCourses}
          subtitle="门课程"
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
        />
        <DataCard
          title="累计课时"
          value={totalHours}
          subtitle="已完成课时"
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
        <DataCard
          title="参与人次"
          value={totalParticipants}
          subtitle="累计参与"
          icon={<Users className="w-5 h-5" />}
          color="orange"
        />
        <DataCard
          title="完成率"
          value="72%"
          subtitle="课程平均完成率"
          icon={<GraduationCap className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="grid grid-cols-2 gap-4 mt-5">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(course.type)}`}>
                      {course.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      授课教师：{course.teacher}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {course.schedule}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {course.location}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">课程进度</span>
                      <span className="text-gray-900 font-medium">{course.completedHours}/{course.totalHours}课时</span>
                    </div>
                    <ProgressBar value={course.completedHours} max={course.totalHours} color="blue" size="sm" />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{course.participantCount}人参与</span>
                    <span className="text-xs text-blue-600 font-medium">查看详情</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="本周课程表">
            <div className="space-y-2">
              {scheduleData.map((item, index) => (
                <div key={index} className="flex gap-3 py-2">
                  <span className="w-12 text-sm font-medium text-gray-500 flex-shrink-0">{weekDays[item.day]}</span>
                  <div className="flex-1 flex flex-wrap gap-1">
                    {item.morning.length > 0 ? (
                      item.morning.map((course, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                          {course}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-300">无课程</span>
                    )}
                    {item.afternoon.map((course, i) => (
                      <span key={`p-${i}`} className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="最近课时记录" subtitle="最新6条">
            <div className="space-y-3">
              {courseHours.slice(0, 6).map((hour) => (
                <div key={hour.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{hour.courseName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{hour.inmateName} · {hour.date}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      status={hour.status}
                      variant={hour.status === '已完成' ? 'success' : hour.status === '进行中' ? 'warning' : 'default'}
                    />
                    {hour.score && (
                      <p className="text-xs text-gray-600 mt-1">{hour.score}分</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
