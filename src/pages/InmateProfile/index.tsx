import { useState } from 'react';
import { Users, TrendingUp, Clock, Award, Search, Filter, Eye, ChevronLeft, ChevronRight, User, Calendar, MapPin, BookOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import Tabs from '@/components/Tabs';
import type { Inmate } from '@/types';

const tabs = [
  { key: 'all', label: '全部人员' },
  { key: 'zone1', label: '一监区' },
  { key: 'zone2', label: '二监区' },
  { key: 'zone3', label: '三监区' },
];

export default function InmateProfile() {
  const { inmates } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null);

  const pageSize = 6;

  const filteredInmates = inmates.filter((inmate) => {
    const matchesSearch =
      inmate.name.includes(searchText) ||
      inmate.inmateNumber.includes(searchText);
    const matchesZone =
      activeTab === 'all' ||
      (activeTab === 'zone1' && inmate.prisonZone === '一监区') ||
      (activeTab === 'zone2' && inmate.prisonZone === '二监区') ||
      (activeTab === 'zone3' && inmate.prisonZone === '三监区');
    return matchesSearch && matchesZone;
  });

  const totalPages = Math.ceil(filteredInmates.length / pageSize);
  const paginatedInmates = filteredInmates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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

  return (
    <div>
      <PageHeader
        title="人员档案"
        subtitle="服刑人员基本信息管理与改造档案"
      />

      {selectedInmate ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedInmate(null)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            返回列表
          </button>

          <Card>
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-12 h-12 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{selectedInmate.name}</h2>
                  <StatusBadge status={selectedInmate.status} variant={getStatusVariant(selectedInmate.status) as any} size="md" />
                </div>
                <p className="text-gray-500 text-sm mt-1">编号：{selectedInmate.inmateNumber}</p>
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
                </div>
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-400">入监时间</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.entryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">预计出狱</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.releaseDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">所属监区</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.prisonZone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">文化程度</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedInmate.educationLevel}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-1.5">已掌握技能</p>
                  <div className="flex gap-2">
                    {selectedInmate.skills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card title="教育课时" subtitle="本月累计">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-blue-600">32</p>
                <p className="text-sm text-gray-500 mt-1">课时</p>
              </div>
            </Card>
            <Card title="技能培训" subtitle="进行中课程">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-green-600">2</p>
                <p className="text-sm text-gray-500 mt-1">项</p>
              </div>
            </Card>
            <Card title="行为评分" subtitle="本月平均分">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-orange-600">85</p>
                <p className="text-sm text-gray-500 mt-1">分</p>
              </div>
            </Card>
          </div>
        </div>
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
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setCurrentPage(1);
                    }}
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
              {paginatedInmates.map((inmate) => (
                <div
                  key={inmate.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedInmate(inmate)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <User className="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2 mt-2">
                        {inmate.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                共 {filteredInmates.length} 条记录，第 {currentPage}/{totalPages || 1} 页
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
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
