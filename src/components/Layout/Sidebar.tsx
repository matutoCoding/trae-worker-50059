import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Wrench,
  HeartPulse,
  ClipboardCheck,
  UsersRound,
  DoorOpen,
  Shield,
} from 'lucide-react';

const menuItems = [
  { path: '/', label: '人员档案', icon: Users },
  { path: '/education', label: '教育课程', icon: GraduationCap },
  { path: '/training', label: '技能培训', icon: Wrench },
  { path: '/psychology', label: '心理评估', icon: HeartPulse },
  { path: '/behavior', label: '行为考核', icon: ClipboardCheck },
  { path: '/family', label: '亲情帮教', icon: UsersRound },
  { path: '/release', label: '出监衔接', icon: DoorOpen },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 bg-primary-900 min-h-screen flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-primary-800">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm">教育改造系统</h1>
          <p className="text-blue-300 text-xs">Prison Education</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3">
        <p className="text-xs text-blue-400 px-3 mb-2 font-medium">功能模块</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-100 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-800">
        <div className="bg-primary-800 rounded-lg p-3">
          <p className="text-xs text-blue-300 mb-2">今日值班</p>
          <p className="text-sm text-white font-medium">王警官</p>
          <p className="text-xs text-blue-400 mt-0.5">工号: JG2023001</p>
        </div>
      </div>
    </aside>
  );
}
