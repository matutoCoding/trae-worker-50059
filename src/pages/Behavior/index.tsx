import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ClipboardCheck, Award, AlertTriangle, TrendingUp, User, Calendar, Plus, Check, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { Button, Textarea } from '@/components/Form';

const tabs = [
  { key: 'daily', label: '日常打分' },
  { key: 'violation', label: '违规处理' },
  { key: 'reward', label: '奖惩记录' },
];

export default function Behavior() {
  const location = useLocation();
  const { behaviorRecords, violations, getBehaviorRecordsByDate, getAvgBehaviorScoreByDate, addBehaviorRecord, inmates } = useStore();
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [filteredInmateId, setFilteredInmateId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editScores, setEditScores] = useState({ discipline: 0, labor: 0, study: 0, cooperation: 0, remark: '' });

  const recordsByDate = useMemo(() => getBehaviorRecordsByDate(selectedDate), [selectedDate, getBehaviorRecordsByDate]);
  
  const filteredRecords = filteredInmateId
    ? recordsByDate.filter((r) => r.inmateId === filteredInmateId)
    : recordsByDate;

  const avgScore = useMemo(() => getAvgBehaviorScoreByDate(selectedDate).toFixed(1), [selectedDate, getAvgBehaviorScoreByDate]);
  const excellentCount = filteredRecords.filter((r) => r.totalScore >= 36).length;
  const violationCount = violations.length;

  useMemo(() => {
    if (location.state?.inmateId) {
      setFilteredInmateId(location.state.inmateId);
    }
  }, [location.state]);

  const handleOpenEdit = (record: any) => {
    setEditingRecord(record);
    setEditScores({
      discipline: record.discipline,
      labor: record.labor,
      study: record.study,
      cooperation: record.cooperation,
      remark: record.remark === '待评分' ? '' : record.remark,
    });
    setShowModal(true);
  };

  const handleSaveScore = () => {
    if (!editingRecord) return;

    const totalScore = editScores.discipline + editScores.labor + editScores.study + editScores.cooperation;

    if (editingRecord.id.startsWith('temp-')) {
      addBehaviorRecord({
        inmateId: editingRecord.inmateId,
        inmateName: editingRecord.inmateName,
        date: selectedDate,
        discipline: editScores.discipline,
        labor: editScores.labor,
        study: editScores.study,
        cooperation: editScores.cooperation,
        totalScore,
        remark: editScores.remark || '已评分',
      });
    } else {
      const { updateBehaviorRecord } = useStore.getState() as any;
      if (updateBehaviorRecord) {
        updateBehaviorRecord(editingRecord.id, {
          discipline: editScores.discipline,
          labor: editScores.labor,
          study: editScores.study,
          cooperation: editScores.cooperation,
          totalScore,
          remark: editScores.remark,
        });
      }
    }

    setShowModal(false);
    setEditingRecord(null);
  };

  const handleScoreChange = (field: string, value: string) => {
    const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
    setEditScores((prev) => ({ ...prev, [field]: numValue }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 36) return 'text-green-600';
    if (score >= 30) return 'text-blue-600';
    if (score >= 24) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '轻微':
        return 'info';
      case '一般':
        return 'warning';
      case '严重':
        return 'danger';
      default:
        return 'default';
    }
  };

  const rewardRecords = [
    { name: '李明', date: '2024-01-10', type: '表扬', reason: '劳动表现突出，超额完成任务', points: '+3' },
    { name: '张伟', date: '2024-01-08', type: '记功', reason: '积极参与技能培训，考核优秀', points: '+5' },
    { name: '周琳', date: '2024-01-05', type: '表扬', reason: '帮助其他服刑人员学习文化知识', points: '+2' },
    { name: '王芳', date: '2024-01-03', type: '物资奖励', reason: '季度评比优秀', points: '+4' },
  ];

  const weeklyTrend = [
    { day: '周一', score: 31 },
    { day: '周二', score: 33 },
    { day: '周三', score: 30 },
    { day: '周四', score: 34 },
    { day: '周五', score: 32 },
    { day: '周六', score: 35 },
    { day: '周日', score: 33 },
  ];

  const dimensionLabels = ['遵规守纪', '劳动表现', '学习态度', '团结互助'];

  return (
    <div>
      <PageHeader
        title="行为考核"
        subtitle="日常行为评分、违规处理与奖惩记录管理"
        actions={
          <div className="flex items-center gap-3">
            {filteredInmateId && (
              <span className="text-sm text-gray-500">
                正在查看：{inmates.find((i) => i.id === filteredInmateId)?.name} 的评分记录
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
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DataCard
          title="平均评分"
          value={avgScore}
          subtitle="满分40分"
          icon={<ClipboardCheck className="w-5 h-5" />}
          color="blue"
          trend={{ value: '较上周 +1.2', positive: true }}
        />
        <DataCard
          title="优秀人数"
          value={excellentCount}
          subtitle="36分以上"
          icon={<Award className="w-5 h-5" />}
          color="green"
        />
        <DataCard
          title="违规记录"
          value={violationCount}
          subtitle="本月累计"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
        />
        <DataCard
          title="改造积极性"
          value="85%"
          subtitle="综合评估"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
          trend={{ value: '较上月 +3%', positive: true }}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'daily' && (
              <div className="mt-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 font-medium">服刑人员</th>
                        <th className="px-4 py-3 font-medium text-center">遵规守纪</th>
                        <th className="px-4 py-3 font-medium text-center">劳动表现</th>
                        <th className="px-4 py-3 font-medium text-center">学习态度</th>
                        <th className="px-4 py-3 font-medium text-center">团结互助</th>
                        <th className="px-4 py-3 font-medium text-center">总分</th>
                        <th className="px-4 py-3 font-medium">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleOpenEdit(record)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                record.remark === '待评分' ? 'bg-yellow-100' : 'bg-blue-100'
                              }`}>
                                <User className={`w-4 h-4 ${record.remark === '待评分' ? 'text-yellow-600' : 'text-blue-600'}`} />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900">{record.inmateName}</span>
                                {record.remark === '待评分' && (
                                  <span className="ml-2 text-xs text-yellow-600">（点击评分）</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium">
                            {record.discipline > 0 ? record.discipline : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium">
                            {record.labor > 0 ? record.labor : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium">
                            {record.study > 0 ? record.study : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-medium">
                            {record.cooperation > 0 ? record.cooperation : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-lg font-bold ${getScoreColor(record.totalScore)}`}>
                              {record.totalScore > 0 ? record.totalScore : <span className="text-gray-300">-</span>}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {record.remark === '待评分' ? <span className="text-yellow-500">待评分</span> : record.remark}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'violation' && (
              <div className="mt-5 space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          violation.severity === '严重' ? 'bg-red-100' :
                          violation.severity === '一般' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`w-5 h-5 ${
                            violation.severity === '严重' ? 'text-red-600' :
                            violation.severity === '一般' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{violation.inmateName}</h4>
                            <StatusBadge status={violation.type} variant={getSeverityColor(violation.severity) as any} />
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{violation.date} · {violation.severity}</p>
                        </div>
                      </div>
                      <StatusBadge status={violation.status} variant="info" size="md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">违规描述</p>
                        <p className="text-sm text-gray-700">{violation.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">处理措施</p>
                        <p className="text-sm text-gray-700">{violation.punishment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reward' && (
              <div className="mt-5 space-y-3">
                {rewardRecords.map((record, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{record.name}</h4>
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-200 text-green-700 rounded">
                              {record.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{record.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">{record.points}</span>
                        <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="本周评分趋势">
            <div className="flex items-end justify-between h-40 pt-4">
              {weeklyTrend.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-6 bg-blue-500 rounded-t-sm"
                      style={{ height: `${(item.score / 40) * 100}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="评分维度说明">
            <div className="space-y-3">
              {dimensionLabels.map((label, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-medium text-gray-900">10分</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">总分</span>
                <span className="text-sm font-bold text-blue-600">40分</span>
              </div>
            </div>
          </Card>

          <Card title="评分等级">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-green-700">优秀</span>
                <span className="text-sm font-medium text-green-600">36-40分</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-700">良好</span>
                <span className="text-sm font-medium text-blue-600">30-35分</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-700">一般</span>
                <span className="text-sm font-medium text-yellow-600">24-29分</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-700">较差</span>
                <span className="text-sm font-medium text-red-600">24分以下</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingRecord?.inmateName} - ${selectedDate} 行为评分`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSaveScore}>
              <Check className="w-4 h-4" />
              保存评分
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                遵规守纪（0-10分）
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={editScores.discipline}
                onChange={(e) => handleScoreChange('discipline', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                劳动表现（0-10分）
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={editScores.labor}
                onChange={(e) => handleScoreChange('labor', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                学习态度（0-10分）
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={editScores.study}
                onChange={(e) => handleScoreChange('study', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                团结互助（0-10分）
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={editScores.cooperation}
                onChange={(e) => handleScoreChange('cooperation', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">总分（40分）</span>
              <span className={`text-2xl font-bold ${getScoreColor(editScores.discipline + editScores.labor + editScores.study + editScores.cooperation)}`}>
                {editScores.discipline + editScores.labor + editScores.study + editScores.cooperation}
              </span>
            </div>
          </div>

          <Textarea
            label="备注"
            value={editScores.remark}
            onChange={(e) => setEditScores((prev) => ({ ...prev, remark: e.target.value }))}
            placeholder="请输入评分备注（可选）"
          />
        </div>
      </Modal>
    </div>
  );
}
