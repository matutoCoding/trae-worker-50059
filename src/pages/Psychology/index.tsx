import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeartPulse, AlertTriangle, Users, Clipboard, Calendar, User, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import StatusBadge from '@/components/StatusBadge';

const tabs = [
  { key: 'assessment', label: '测评量表' },
  { key: 'crisis', label: '危机干预' },
  { key: 'consult', label: '咨询档案' },
];

export default function Psychology() {
  const location = useLocation();
  const { assessments, crisisInterventions, inmates } = useStore();
  const [activeTab, setActiveTab] = useState('assessment');
  const [filteredInmateId, setFilteredInmateId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.inmateId) {
      setFilteredInmateId(location.state.inmateId);
    }
  }, [location.state]);

  const filteredAssessments = filteredInmateId
    ? assessments.filter((a) => a.inmateId === filteredInmateId)
    : assessments;

  const filteredCrisis = filteredInmateId
    ? crisisInterventions.filter((c) => c.inmateId === filteredInmateId)
    : crisisInterventions;

  const consultRecords = [
    { id: '1', inmateId: 'inmate-1', name: '张伟', date: '2024-01-15', counselor: '陈医师', type: '个体咨询', duration: '50分钟', notes: '焦虑情绪疏导，探讨改造目标' },
    { id: '2', inmateId: 'inmate-2', name: '李明', date: '2024-01-14', counselor: '李医师', type: '团体辅导', duration: '90分钟', notes: '人际关系团体辅导' },
    { id: '3', inmateId: 'inmate-3', name: '王芳', date: '2024-01-13', counselor: '陈医师', type: '个体咨询', duration: '60分钟', notes: '抑郁情绪干预，制定改善计划' },
    { id: '4', inmateId: 'inmate-4', name: '赵强', date: '2024-01-12', counselor: '王医师', type: '电话咨询', duration: '30分钟', notes: '家庭关系问题咨询' },
    { id: '5', inmateId: 'inmate-5', name: '陈静', date: '2024-01-11', counselor: '李医师', type: '个体咨询', duration: '45分钟', notes: '睡眠问题咨询，放松训练' },
  ];

  const filteredConsultRecords = filteredInmateId
    ? consultRecords.filter((c) => c.inmateId === filteredInmateId)
    : consultRecords;

  const normalCount = filteredAssessments.filter((a) => a.level === '正常').length;
  const mildCount = filteredAssessments.filter((a) => a.level === '轻度').length;
  const moderateCount = filteredAssessments.filter((a) => a.level === '中度').length;
  const severeCount = filteredAssessments.filter((a) => a.level === '重度').length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case '正常':
        return 'bg-green-100 text-green-700';
      case '轻度':
        return 'bg-blue-100 text-blue-700';
      case '中度':
        return 'bg-yellow-100 text-yellow-700';
      case '重度':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case '一般':
        return 'warning';
      case '严重':
        return 'danger';
      case '紧急':
        return 'danger';
      default:
        return 'default';
    }
  };

  const assessmentScales = [
    { name: 'SCL-90症状自评量表', description: '心理健康综合评估', questions: 90, duration: '20-30分钟' },
    { name: '焦虑自评量表(SAS)', description: '焦虑程度评估', questions: 20, duration: '10-15分钟' },
    { name: '抑郁自评量表(SDS)', description: '抑郁程度评估', questions: 20, duration: '10-15分钟' },
    { name: '艾森克人格问卷(EPQ)', description: '人格特质测评', questions: 88, duration: '20-25分钟' },
    { name: '社会支持评定量表', description: '社会支持系统评估', questions: 10, duration: '5-10分钟' },
    { name: '服刑适应量表', description: '监狱适应状况评估', questions: 30, duration: '15-20分钟' },
  ];

  return (
    <div>
      <PageHeader
        title="心理评估"
        subtitle="心理健康测评、危机干预与心理咨询管理"
        actions={
          <div className="flex items-center gap-3">
            {filteredInmateId && (
              <span className="text-sm text-gray-500">
                正在查看：{inmates.find((i) => i.id === filteredInmateId)?.name} 的心理记录
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
          title="心理测评数"
          value={filteredAssessments.length}
          subtitle="测评次数"
          icon={<Clipboard className="w-5 h-5" />}
          color="blue"
        />
        <DataCard
          title="正常状态"
          value={normalCount}
          subtitle="心理健康人数"
          icon={<HeartPulse className="w-5 h-5" />}
          color="green"
        />
        <DataCard
          title="重点关注"
          value={moderateCount + severeCount}
          subtitle="中度及以上"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
        />
        <DataCard
          title="危机事件"
          value={filteredCrisis.length}
          subtitle="干预数"
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
        />
      </div>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'assessment' && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {assessmentScales.map((scale, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{scale.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{scale.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{scale.questions}题</span>
                    <span>约{scale.duration}</span>
                  </div>
                  <button className="w-full mt-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    开始测评
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-semibold text-gray-900 mb-4">最近测评记录</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">服刑人员</th>
                      <th className="pb-3 font-medium">测评类型</th>
                      <th className="pb-3 font-medium">测评日期</th>
                      <th className="pb-3 font-medium">得分</th>
                      <th className="pb-3 font-medium">状态</th>
                      <th className="pb-3 font-medium">咨询师</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssessments.map((assessment) => (
                      <tr key={assessment.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{assessment.inmateName}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{assessment.type}</td>
                        <td className="py-3 text-sm text-gray-600">{assessment.date}</td>
                        <td className="py-3 text-sm font-medium text-gray-900">{assessment.score}分</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getLevelColor(assessment.level)}`}>
                            {assessment.level}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{assessment.counselor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crisis' && (
          <div className="mt-5 space-y-4">
            {filteredCrisis.length > 0 ? (
              filteredCrisis.map((intervention) => (
              <div key={intervention.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      intervention.level === '紧急' ? 'bg-red-100' :
                      intervention.level === '严重' ? 'bg-orange-100' : 'bg-yellow-100'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        intervention.level === '紧急' ? 'text-red-600' :
                        intervention.level === '严重' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{intervention.inmateName}</h4>
                        <StatusBadge status={intervention.level} variant={getSeverityColor(intervention.level) as any} />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {intervention.date} · 咨询师：{intervention.counselor}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={intervention.status} variant="info" size="md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">事件描述</p>
                    <p className="text-sm text-gray-700">{intervention.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">干预措施</p>
                    <p className="text-sm text-gray-700">{intervention.measures}</p>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">暂无危机干预记录</p>
            )}
          </div>
        )}

        {activeTab === 'consult' && (
          <div className="mt-5 space-y-3">
            {filteredConsultRecords.length > 0 ? (
              filteredConsultRecords.map((record, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.name}</h4>
                      <p className="text-xs text-gray-500">{record.type} · {record.duration}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{record.date}</span>
                </div>
                <p className="text-sm text-gray-600 ml-12">
                  <span className="text-gray-500">咨询师：{record.counselor}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2 ml-12 bg-white p-2 rounded border border-gray-100">
                  {record.notes}
                </p>
              </div>
            ))
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">暂无咨询记录</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
