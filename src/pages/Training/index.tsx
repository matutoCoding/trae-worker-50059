import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Wrench, Award, Users, Clock, ChevronRight, Plus, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal';
import { Input, Select, Textarea, Button, CheckboxGroup, NumberInput } from '@/components/Form';

const tabs = [
  { key: 'all', label: '全部培训' },
  { key: 'primary', label: '初级' },
  { key: 'intermediate', label: '中级' },
  { key: 'advanced', label: '高级' },
];

export default function Training() {
  const location = useLocation();
  const { trainings, trainingRecords, inmates, addTraining, addTrainingRecord, updateTraining } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [filteredInmateId, setFilteredInmateId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '电子电工',
    duration: 0,
    level: '初级' as '初级' | '中级' | '高级',
    certificate: true,
    description: '',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    score: '',
    passed: true,
  });
  const [selectedTrainees, setSelectedTrainees] = useState<Record<string, boolean>>({});
  const [traineeScores, setTraineeScores] = useState<Record<string, { score: string; passed: boolean }>>({});

  useEffect(() => {
    if (location.state?.inmateId) {
      setFilteredInmateId(location.state.inmateId);
    }
  }, [location.state]);

  const categories = ['all', '电子电工', '汽车维修', '餐饮服务', '信息技术', '机械加工', '生活服务'];

  const filteredTrainings = trainings.filter((training) => {
    const levelMatch =
      activeTab === 'all' ||
      (activeTab === 'primary' && training.level === '初级') ||
      (activeTab === 'intermediate' && training.level === '中级') ||
      (activeTab === 'advanced' && training.level === '高级');
    const categoryMatch = selectedCategory === 'all' || training.category === selectedCategory;
    const inmateMatch = !filteredInmateId || training.traineeIds?.includes(filteredInmateId);
    return levelMatch && categoryMatch && inmateMatch;
  });

  const filteredRecords = filteredInmateId
    ? trainingRecords.filter((r) => r.inmateId === filteredInmateId)
    : trainingRecords;

  const inmateOptions = inmates
    .filter((i) => i.status === '在押')
    .map((i) => ({
      value: i.id,
      label: `${i.name} (${i.inmateNumber})`,
      checked: selectedTrainees[i.id] || false,
    }));

  const handleOpenModal = () => {
    setFormData({
      name: '',
      category: '电子电工',
      duration: 0,
      level: '初级',
      certificate: true,
      description: '',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      score: '',
      passed: true,
    });
    setSelectedTrainees({});
    setTraineeScores({});
    setShowModal(true);
  };

  const handleTraineeChange = (value: string, checked: boolean) => {
    setSelectedTrainees((prev) => ({ ...prev, [value]: checked }));
    if (checked) {
      setTraineeScores((prev) => ({ ...prev, [value]: { score: '', passed: true } }));
    } else {
      setTraineeScores((prev) => {
        const newScores = { ...prev };
        delete newScores[value];
        return newScores;
      });
    }
  };

  const handleTraineeScoreChange = (inmateId: string, field: 'score' | 'passed', value: string | boolean) => {
    setTraineeScores((prev) => ({
      ...prev,
      [inmateId]: { ...prev[inmateId], [field]: value },
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || formData.duration <= 0) {
      alert('请填写完整的培训信息');
      return;
    }

    const selectedTraineeIds = Object.keys(selectedTrainees).filter((id) => selectedTrainees[id]);
    if (selectedTraineeIds.length === 0) {
      alert('请至少选择一名参训人员');
      return;
    }

    const newTraining = {
      name: formData.name,
      category: formData.category,
      duration: formData.duration,
      level: formData.level,
      certificate: formData.certificate,
      description: formData.description,
      progress: formData.progress,
      traineeCount: selectedTraineeIds.length,
      traineeIds: selectedTraineeIds,
    };

    addTraining(newTraining);

    const trainingsNow = useStore.getState().trainings;
    const trainingId = trainingsNow[trainingsNow.length - 1].id;

    selectedTraineeIds.forEach((inmateId) => {
      const inmate = inmates.find((i) => i.id === inmateId);
      if (inmate) {
        const traineeData = traineeScores[inmateId];
        const score = traineeData?.score ? parseInt(traineeData.score) : undefined;
        addTrainingRecord({
          trainingId,
          trainingName: formData.name,
          inmateId,
          inmateName: inmate.name,
          startDate: formData.startDate,
          progress: formData.progress,
          score,
          passed: traineeData?.passed,
          certificateDate: formData.progress >= 100 && traineeData?.passed ? formData.startDate : undefined,
        });
      }
    });

    setShowModal(false);
  };

  const totalTrainings = trainings.length;
  const totalTrainees = trainings.reduce((sum, t) => sum + t.traineeCount, 0);
  const certifiedCount = trainings.filter((t) => t.certificate).length;
  const avgProgress = trainings.length > 0 ? Math.round(trainings.reduce((sum, t) => sum + t.progress, 0) / trainings.length) : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case '初级':
        return 'bg-green-100 text-green-700';
      case '中级':
        return 'bg-blue-100 text-blue-700';
      case '高级':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const assessmentData = filteredRecords
    .filter((r) => r.score !== undefined)
    .slice(0, 6)
    .map((r) => ({
      name: r.inmateName,
      training: r.trainingName,
      score: r.score!,
      pass: r.passed ?? r.score! >= 60,
      date: r.startDate,
    }));

  return (
    <div>
      <PageHeader
        title="技能培训"
        subtitle="职业技能培训与考核认证管理"
        actions={
          <div className="flex items-center gap-3">
            {filteredInmateId && (
              <span className="text-sm text-gray-500">
                正在查看：{inmates.find((i) => i.id === filteredInmateId)?.name} 的培训记录
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
              新增培训
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DataCard
          title="培训项目"
          value={totalTrainings}
          subtitle="个培训项目"
          icon={<Wrench className="w-5 h-5" />}
          color="blue"
        />
        <DataCard
          title="培训人数"
          value={totalTrainees}
          subtitle="累计参训人数"
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <DataCard
          title="可获证书"
          value={certifiedCount}
          subtitle="项技能认证"
          icon={<Award className="w-5 h-5" />}
          color="orange"
        />
        <DataCard
          title="平均进度"
          value={`${avgProgress}%`}
          subtitle="培训平均完成率"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? '全部分类' : cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredTrainings.map((training) => (
                <div
                  key={training.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{training.name}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getLevelColor(training.level)}`}>
                      {training.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{training.category} · {training.duration}课时</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{training.description}</p>
                  <ProgressBar value={training.progress} color="blue" size="sm" showLabel />
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {training.traineeCount}人参训
                    </div>
                    {training.certificate && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                        <Award className="w-3 h-3" />
                        可获证书
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="最近考核记录">
            <div className="space-y-3">
              {assessmentData.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className={`text-xs font-medium ${item.pass ? 'text-green-600' : 'text-red-600'}`}>
                      {item.score}分 {item.pass ? '合格' : '不合格'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{item.training}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="热门技能">
            <div className="space-y-3">
              {[
                { name: '计算机办公应用', count: 25, level: 90 },
                { name: '烹饪技能', count: 20, level: 80 },
                { name: '电工技能', count: 18, level: 65 },
                { name: '电焊技术', count: 15, level: 55 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">{item.count}人</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${item.level}%` }}
                    />
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
        title="新增技能培训"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="w-4 h-4" />
              保存培训
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="培训名称"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入培训名称"
            />
            <Select
              label="培训分类"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: '电子电工', label: '电子电工' },
                { value: '汽车维修', label: '汽车维修' },
                { value: '餐饮服务', label: '餐饮服务' },
                { value: '信息技术', label: '信息技术' },
                { value: '机械加工', label: '机械加工' },
                { value: '生活服务', label: '生活服务' },
              ]}
            />
            <NumberInput
              label="培训时长（课时）"
              required
              min={1}
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              placeholder="请输入培训时长"
            />
            <Select
              label="难度等级"
              required
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              options={[
                { value: '初级', label: '初级' },
                { value: '中级', label: '中级' },
                { value: '高级', label: '高级' },
              ]}
            />
            <Input
              label="开课日期"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.certificate}
                  onChange={(e) => setFormData({ ...formData, certificate: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">可获证书</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="培训进度（%）"
              min={0}
              max={100}
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              placeholder="0-100"
            />
          </div>

          <Textarea
            label="培训描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="请输入培训描述"
          />

          <CheckboxGroup
            label="选择参训人员"
            required
            options={inmateOptions}
            onChange={handleTraineeChange}
          />

          {Object.keys(selectedTrainees).filter((id) => selectedTrainees[id]).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                考核结果（可选）
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {Object.keys(selectedTrainees)
                  .filter((id) => selectedTrainees[id])
                  .map((inmateId) => {
                    const inmate = inmates.find((i) => i.id === inmateId);
                    const traineeData = traineeScores[inmateId];
                    return (
                      <div key={inmateId} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 flex-1">{inmate?.name}</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={traineeData?.score || ''}
                          onChange={(e) => handleTraineeScoreChange(inmateId, 'score', e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="分数"
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={traineeData?.passed ?? true}
                            onChange={(e) => handleTraineeScoreChange(inmateId, 'passed', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-600">合格</span>
                        </label>
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
