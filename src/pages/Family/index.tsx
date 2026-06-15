import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UsersRound, Video, Calendar, Clock, User, Phone, Plus, VideoIcon, MessageSquare, Check, X, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/PageHeader';
import DataCard from '@/components/DataCard';
import Card from '@/components/Card';
import Tabs from '@/components/Tabs';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { Input, Select, Textarea, Button, NumberInput } from '@/components/Form';

const tabs = [
  { key: 'visit', label: '会见管理' },
  { key: 'video', label: '视频帮教' },
  { key: 'letter', label: '家属沟通' },
];

export default function Family() {
  const location = useLocation();
  const { familyVisits, videoRecords, inmates, updateFamilyVisit, addVideoRecord } = useStore();
  const [activeTab, setActiveTab] = useState('visit');
  const [filteredInmateId, setFilteredInmateId] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<any>(null);
  const [videoFormData, setVideoFormData] = useState({
    visitId: '',
    inmateId: '',
    inmateName: '',
    visitorName: '',
    relationship: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    notes: '',
  });

  useEffect(() => {
    if (location.state?.inmateId) {
      setFilteredInmateId(location.state.inmateId);
    }
  }, [location.state]);

  const filteredVisits = filteredInmateId
    ? familyVisits.filter((v) => v.inmateId === filteredInmateId)
    : familyVisits;

  const filteredVideoRecords = filteredInmateId
    ? videoRecords.filter((v) => v.inmateId === filteredInmateId)
    : videoRecords;

  const visitCount = filteredVisits.filter((v) => v.visitType === '现场会见').length;
  const videoCount = filteredVisits.filter((v) => v.visitType === '视频会见').length;
  const pendingCount = filteredVisits.filter((v) => v.status === '待确认').length;
  const confirmedCount = filteredVisits.filter((v) => v.status === '已确认').length;

  const handleConfirmVisit = (visitId: string) => {
    updateFamilyVisit(visitId, { status: '已确认' });
  };

  const handleCancelVisit = (visitId: string) => {
    updateFamilyVisit(visitId, { status: '已取消' });
  };

  const handleOpenVideoRecord = (visit: any) => {
    setEditingVisit(visit);
    setVideoFormData({
      visitId: visit.id,
      inmateId: visit.inmateId,
      inmateName: visit.inmateName,
      visitorName: visit.visitorName,
      relationship: visit.relationship,
      date: visit.date,
      startTime: visit.timeSlot.split('-')[0],
      endTime: visit.timeSlot.split('-')[1],
      duration: visit.duration || 30,
      notes: '',
    });
    setShowVideoModal(true);
  };

  const handleSaveVideoRecord = () => {
    if (!videoFormData.duration || !videoFormData.notes) {
      alert('请填写完整的视频帮教记录');
      return;
    }

    addVideoRecord({
      visitId: videoFormData.visitId,
      inmateId: videoFormData.inmateId,
      inmateName: videoFormData.inmateName,
      visitorName: videoFormData.visitorName,
      relationship: videoFormData.relationship,
      date: videoFormData.date,
      startTime: videoFormData.startTime,
      endTime: videoFormData.endTime,
      duration: videoFormData.duration,
      notes: videoFormData.notes,
    });

    updateFamilyVisit(videoFormData.visitId, { status: '已完成', duration: videoFormData.duration });

    setShowVideoModal(false);
    setEditingVisit(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case '已确认':
        return 'success';
      case '待确认':
        return 'warning';
      case '已完成':
        return 'info';
      case '已取消':
        return 'default';
      default:
        return 'default';
    }
  };

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const timeSlots = ['09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '14:00-14:30', '14:30-15:00', '15:00-15:30'];

  const letterRecords = [
    { name: '张伟', from: '张父', type: '来信', date: '2024-01-15', content: '家人一切安好，望你好好改造，争取早日出狱...' },
    { name: '李明', from: '李母', type: '来信', date: '2024-01-14', content: '身体注意，家里不用惦记，好好表现...' },
    { name: '王芳', from: '王强', type: '去信', date: '2024-01-13', content: '告诉儿子妈妈在里面很好，让他好好学习...' },
    { name: '陈静', from: '陈父', type: '来信', date: '2024-01-12', content: '家里一切都好，注意身体，积极改造...' },
    { name: '周琳', from: '周明', type: '来电', date: '2024-01-11', content: '通电话15分钟，询问家中情况...' },
  ];

  return (
    <div>
      <PageHeader
        title="亲情帮教"
        subtitle="亲情会见、视频帮教与家属沟通管理"
        actions={
          <div className="flex items-center gap-3">
            {filteredInmateId && (
              <span className="text-sm text-gray-500">
                正在查看：{inmates.find((i) => i.id === filteredInmateId)?.name} 的帮教记录
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
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              预约会见
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DataCard
          title="本月会见次数"
          value={familyVisits.length}
          subtitle="累计"
          icon={<UsersRound className="w-5 h-5" />}
          color="blue"
        />
        <DataCard
          title="现场会见"
          value={visitCount}
          subtitle="次"
          icon={<User className="w-5 h-5" />}
          color="green"
        />
        <DataCard
          title="视频会见"
          value={videoCount}
          subtitle="次"
          icon={<Video className="w-5 h-5" />}
          color="orange"
        />
        <DataCard
          title="待确认"
          value={pendingCount}
          subtitle="条预约待审批"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'visit' && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4">本周会见安排</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">时间</th>
                        {weekDays.map((day, i) => (
                          <th key={i} className="pb-3 text-center text-xs font-medium text-gray-500">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot, si) => (
                        <tr key={si} className="border-b border-gray-50">
                          <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{slot}</td>
                          {weekDays.map((_, di) => {
                            const isBooked = (si + di) % 5 === 0;
                            return (
                              <td key={di} className="py-3 px-1 text-center">
                                {isBooked ? (
                                  <div className="p-1.5 bg-blue-100 text-blue-600 text-xs rounded cursor-pointer hover:bg-blue-200 transition-colors">
                                    已约
                                  </div>
                                ) : (
                                  <div className="p-1.5 text-gray-300 text-xs">-</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">会见室状态</h4>
                <div className="space-y-3">
                  {[
                    { name: '会见室1', status: '使用中', current: '张伟' },
                    { name: '会见室2', status: '空闲', current: '-' },
                    { name: '会见室3', status: '清洁中', current: '-' },
                    { name: '视频室1', status: '使用中', current: '李明' },
                    { name: '视频室2', status: '空闲', current: '-' },
                  ].map((room, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{room.name}</p>
                        <p className="text-xs text-gray-500">{room.current}</p>
                      </div>
                      <StatusBadge
                        status={room.status}
                        variant={room.status === '使用中' ? 'danger' : room.status === '空闲' ? 'success' : 'warning'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">最近会见记录</h4>
              <div className="space-y-3">
                {filteredVisits.map((visit) => (
                  <div key={visit.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          visit.visitType === '现场会见' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {visit.visitType === '现场会见' ? (
                            <UsersRound className="w-5 h-5 text-green-600" />
                          ) : (
                            <VideoIcon className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{visit.inmateName}</h4>
                            <span className="text-gray-400">←</span>
                            <span className="text-sm text-gray-600">{visit.visitorName}({visit.relationship})</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {visit.date} {visit.timeSlot} · {visit.visitType}
                            {visit.room && ` · ${visit.room}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={visit.status} variant={getStatusVariant(visit.status) as any} size="md" />
                        {visit.status === '待确认' && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleConfirmVisit(visit.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="确认"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelVisit(visit.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="取消"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {visit.status === '已确认' && visit.visitType === '视频会见' && (
                          <button
                            onClick={() => handleOpenVideoRecord(visit)}
                            className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          >
                            完成记录
                          </button>
                        )}
                      </div>
                    </div>
                    {visit.notes && (
                      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                        备注：{visit.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-5 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center py-10 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <VideoIcon className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">发起视频会见</p>
                <p className="text-xs text-gray-400 mt-1">选择服刑人员开始视频</p>
              </div>
              {[
                { name: '李明', inmate: '李明', status: '进行中', duration: '12:35' },
                { name: '陈静', inmate: '陈静', status: '等待中', duration: '-' },
              ].map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="aspect-video bg-gray-900 rounded mb-3 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.inmate} · {item.status}</p>
                    </div>
                    {item.status === '进行中' ? (
                      <span className="text-xs text-red-500 font-medium animate-pulse">● {item.duration}</span>
                    ) : (
                      <StatusBadge status="等待中" variant="warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-semibold text-gray-900 mb-4">视频帮教记录</h4>
              <div className="space-y-2">
                {filteredVideoRecords.slice(0, 6).map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <VideoIcon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.inmateName} ↔ {record.visitorName}</p>
                        <p className="text-xs text-gray-500">{record.date} {record.startTime}-{record.endTime}</p>
                        {record.notes && (
                          <p className="text-xs text-gray-400 mt-0.5">备注：{record.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{record.duration}分钟</p>
                      <StatusBadge status="已完成" variant="info" />
                    </div>
                  </div>
                ))}
                {filteredVideoRecords.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">暂无视频帮教记录</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'letter' && (
          <div className="mt-5 space-y-3">
            {letterRecords.map((record, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    record.type === '来信' ? 'bg-green-100' : record.type === '去信' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {record.type === '来电' ? (
                      <Phone className="w-5 h-5 text-orange-600" />
                    ) : (
                      <MessageSquare className={`w-5 h-5 ${
                        record.type === '来信' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{record.name}</span>
                      <StatusBadge status={record.type} variant={
                        record.type === '来信' ? 'success' : record.type === '去信' ? 'info' : 'warning'
                      } />
                      <span className="text-xs text-gray-400">· {record.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">发件人：{record.from}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{record.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title="视频帮教完成记录"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
              取消
            </Button>
            <Button onClick={handleSaveVideoRecord}>
              <Check className="w-4 h-4" />
              保存记录
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">服刑人员：</span>
                <span className="font-medium text-gray-900">{videoFormData.inmateName}</span>
              </div>
              <div>
                <span className="text-gray-500">家属：</span>
                <span className="font-medium text-gray-900">{videoFormData.visitorName}({videoFormData.relationship})</span>
              </div>
              <div>
                <span className="text-gray-500">会见日期：</span>
                <span className="font-medium text-gray-900">{videoFormData.date}</span>
              </div>
              <div>
                <span className="text-gray-500">时间段：</span>
                <span className="font-medium text-gray-900">{videoFormData.startTime}-{videoFormData.endTime}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="开始时间"
              type="time"
              value={videoFormData.startTime}
              onChange={(e) => setVideoFormData({ ...videoFormData, startTime: e.target.value })}
            />
            <Input
              label="结束时间"
              type="time"
              value={videoFormData.endTime}
              onChange={(e) => setVideoFormData({ ...videoFormData, endTime: e.target.value })}
            />
          </div>

          <NumberInput
            label="实际时长（分钟）"
            required
            min={1}
            value={videoFormData.duration}
            onChange={(e) => setVideoFormData({ ...videoFormData, duration: parseInt(e.target.value) || 0 })}
            placeholder="请输入实际视频时长"
          />

          <Textarea
            label="帮教备注"
            required
            value={videoFormData.notes}
            onChange={(e) => setVideoFormData({ ...videoFormData, notes: e.target.value })}
            placeholder="请记录本次视频帮教的主要内容、沟通情况等"
          />
        </div>
      </Modal>
    </div>
  );
}
