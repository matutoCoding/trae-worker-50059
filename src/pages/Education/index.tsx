import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Clock, Users, Calendar, MapPin, Plus, ChevronRight, Check, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { Input, Select, Textarea, Button, CheckboxGroup, NumberInput } from '@/components/Form';

const tabs = [
  { key: 'all', label: '全部课程' },
  { key: 'ideology', label: '思想教育' },
  { key: 'literacy', label: '文化扫盲' },
  { key: 'law', label: '普法教育' },
];

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function Education() {
  const location = useLocation();
  const { courses, courseHours, inmates, addCourse, addCourseHour, updateCourse } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [filteredInmateId, setFilteredInmateId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '思想教育' as '思想教育' | '文化扫盲' | '普法教育',
    teacher: '',
    totalHours: 0,
    schedule: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    status: '进行中' as '已完成' | '进行中' | '未开始',
  });
  const [selectedInmates, setSelectedInmates] = useState<Record<string, boolean>>({});
  const [inmateScores, setInmateScores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location.state?.inmateId) {
      setFilteredInmateId(location.state.inmateId);
    }
  }, [location.state]);

  const filteredCourses = courses.filter((course) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ideology') return course.type === '思想教育';
    if (activeTab === 'literacy') return course.type === '文化扫盲';
    if (activeTab === 'law') return course.type === '普法教育';
    return true;
  });

  const filteredCourseHours = filteredInmateId
    ? courseHours.filter((h) => h.inmateId === filteredInmateId)
    : courseHours;

  const inmateOptions = inmates
    .filter((i) => i.status === '在押')
    .map((i) => ({
      value: i.id,
      label: `${i.name} (${i.inmateNumber})`,
      checked: selectedInmates[i.id] || false,
    }));

  const handleOpenModal = () => {
    setFormData({
      name: '',
      type: '思想教育',
      teacher: '',
      totalHours: 0,
      schedule: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      status: '进行中',
    });
    setSelectedInmates({});
    setInmateScores({});
    setShowModal(true);
  };

  const handleInmateChange = (value: string, checked: boolean) => {
    setSelectedInmates((prev) => ({ ...prev, [value]: checked }));
    if (checked) {
      setInmateScores((prev) => ({ ...prev, [value]: '' }));
    } else {
      setInmateScores((prev) => {
        const newScores = { ...prev };
        delete newScores[value];
        return newScores;
      });
    }
  };

  const handleScoreChange = (inmateId: string, score: string) => {
    setInmateScores((prev) => ({ ...prev, [inmateId]: score }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.teacher || formData.totalHours <= 0) {
      alert('请填写完整的课程信息');
      return;
    }

    const selectedInmateIds = Object.keys(selectedInmates).filter((id) => selectedInmates[id]);
    if (selectedInmateIds.length === 0) {
      alert('请至少选择一名参与人员');
      return;
    }

    const newCourse = {
      name: formData.name,
      type: formData.type,
      teacher: formData.teacher,
      totalHours: formData.totalHours,
      completedHours: formData.status === '已完成' ? formData.totalHours : formData.hours,
      schedule: formData.schedule,
      location: formData.location,
      participantCount: selectedInmateIds.length,
      participantIds: selectedInmateIds,
    };

    addCourse(newCourse);

    const coursesNow = useStore.getState().courses;
    const courseId = coursesNow[coursesNow.length - 1].id;

    selectedInmateIds.forEach((inmateId) => {
      const inmate = inmates.find((i) => i.id === inmateId);
      if (inmate) {
        const score = inmateScores[inmateId] ? parseInt(inmateScores[inmateId]) : undefined;
        addCourseHour({
          courseId,
          courseName: formData.name,
          inmateId,
          inmateName: inmate.name,
          date: formData.date,
          hours: formData.hours,
          status: formData.status,
          score,
        });
      }
    });

    setShowModal(false);
  };

  const totalCourses = courses.length;
  const totalHours = courses.reduce((sum, c) => sum + c.completedHours, 0);
  const totalParticipants = courses.reduce((sum, c) => sum + c.participantCount, 0);
  const completionRate = totalCourses > 0 ? Math.round((courses.filter((c) => c.completedHours >= c.totalHours).length / totalCourses) * 100) : 0;

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
          <div className="flex items-center gap-3">
            {filteredInmateId && (
              <span className="text-sm text-gray-500">
                正在查看：{inmates.find((i) => i.id === filteredInmateId)?.name} 的课时记录
              </span>
            )}
            {filteredInmateId && (
              <button
                onClick={() => setFilteredInmateId(null)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                清除筛选
              </button>
            )}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增课程
            </button>
          </div>
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
          value={`${completionRate}%`}
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
              {filteredCourseHours.slice(0, 6).map((hour) => (
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="新增教育课程"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="w-4 h-4" />
              保存课程
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="课程名称"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入课程名称"
            />
            <Select
              label="课程类型"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { value: '思想教育', label: '思想教育' },
                { value: '文化扫盲', label: '文化扫盲' },
                { value: '普法教育', label: '普法教育' },
              ]}
            />
            <Input
              label="授课教师"
              required
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              placeholder="请输入授课教师姓名"
            />
            <NumberInput
              label="总课时"
              required
              min={1}
              value={formData.totalHours}
              onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) || 0 })}
              placeholder="请输入总课时"
            />
            <Input
              label="上课时间"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="如：每周一、三、五 上午"
            />
            <Input
              label="上课地点"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="请输入上课地点"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="记录日期"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <NumberInput
              label="本次课时"
              min={0}
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
              placeholder="请输入本次课时"
            />
            <Select
              label="课程状态"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { value: '未开始', label: '未开始' },
                { value: '进行中', label: '进行中' },
                { value: '已完成', label: '已完成' },
              ]}
            />
          </div>

          <CheckboxGroup
            label="选择参与人员"
            required
            options={inmateOptions}
            onChange={handleInmateChange}
          />

          {Object.keys(selectedInmates).filter((id) => selectedInmates[id]).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                考核成绩（可选）
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {Object.keys(selectedInmates)
                  .filter((id) => selectedInmates[id])
                  .map((inmateId) => {
                    const inmate = inmates.find((i) => i.id === inmateId);
                    return (
                      <div key={inmateId} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 flex-1">{inmate?.name}</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={inmateScores[inmateId] || ''}
                          onChange={(e) => handleScoreChange(inmateId, e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="分数"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
