import React from 'react';
import {
  Radio,
  ShieldAlert,
  Scale,
  GraduationCap,
  HelpCircle,
  BarChart3,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export type AdminTabId =
  | 'dispatch'
  | 'safety'
  | 'arbitration'
  | 'accreditation'
  | 'support'
  | 'analytics';

export interface AdminSidebarProps {
  readonly activeTab: AdminTabId;
  readonly onSelectTab: (tab: AdminTabId) => void;
  readonly className?: string;
}

interface NavItem {
  readonly id: AdminTabId;
  readonly label: string;
  readonly icon: React.FC<{ className?: string }>;
  readonly badge?: string | number;
  readonly badgeColor?: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'dispatch',
    label: 'Диспетчерская (Ветскорая)',
    icon: Radio,
    badge: '7 вызовов',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'safety',
    label: 'Безопасность ветврачей и SOS',
    icon: ShieldAlert,
    badge: '3 чекпоинта',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'arbitration',
    label: 'Эскроу и Вет-Арбитраж',
    icon: Scale,
    badge: '14 дел',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'accreditation',
    label: 'Аккредитация (СПбГУВМ)',
    icon: GraduationCap,
    badge: '8 заявок',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'support',
    label: 'Поддержка и Zoo-Helpdesk',
    icon: HelpCircle,
    badge: 'SLA 03:17',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'analytics',
    label: 'Аналитика и реестры (BI)',
    icon: BarChart3,
    badge: '81 запись',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  className = '',
}) => {
  return (
    <aside
      aria-label="Боковая панель ситуационного центра"
      className={`w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 ${className}`}
    >
      <div className="p-3.5 space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Оперативные модули СПб
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isActive
                          ? 'bg-blue-700/80 text-white border-blue-500'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operator Identity Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 truncate">
            <span className="text-[10px] font-mono uppercase font-black text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 block w-fit">
              Диспетчер СПб №1
            </span>
            <p className="text-xs font-black text-slate-900 truncate">
              Кузнецов И. В.
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              СПбГУВМ Координатор
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
