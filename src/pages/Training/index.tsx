import { useState } from 'react';
import { Wrench, Award, Users, Clock, BookOpen, ChevronRight, Star, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import ProgressBar from '@/components/ProgressBar';

const tabs = [
  { key: 'all', label: '全部培训' },
  { key: 'primary', label: '初级' },
  { key: 'intermediate', label: '中级' },
  { key: 'advanced', label: '高级' },
];

export default function Training() {
  const { trainings } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', '电子电工', '汽车维修', '餐饮服务', '信息技术', '机械加工', '生活服务'];

  const filteredTrainings = trainings.filter((training) => {
    const levelMatch =
      activeTab === 'all' ||
      (activeTab === 'primary' && training.level === '初级') ||
      (activeTab === 'intermediate' && training.level === '中级') ||
      (activeTab === 'advanced' && training.level === '高级');
    const categoryMatch = selectedCategory === 'all' || training.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const totalTrainings = trainings.length;
  const totalTrainees = trainings.reduce((sum, t) => sum + t.traineeCount, 0);
  const certifiedCount = trainings.filter((t) => t.certificate).length;

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

  const assessmentData = [
    { name: '张伟', training: '电工技能培训', score: 85, pass: true, date: '2024-01-10' },
    { name: '李明', training: '计算机办公应用', score: 92, pass: true, date: '2024-01-08' },
    { name: '王芳', training: '烹饪技能培训', score: 78, pass: true, date: '2024-01-12' },
    { name: '赵强', training: '电焊技术', score: 58, pass: false, date: '2024-01-15' },
    { name: '陈静', training: '美容美发', score: 82, pass: true, date: '2024-01-11' },
    { name: '周琳', training: '计算机办公应用', score: 88, pass: true, date: '2024-01-09' },
  ];

  return (
    <div>
      <PageHeader
        title="技能培训"
        subtitle="职业技能培训与考核认证管理"
        actions={
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            新增培训
          </button>
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
          value="61%"
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
    </div>
  );
}
