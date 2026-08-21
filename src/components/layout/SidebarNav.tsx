import React from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  AlertCircle,
  FileSpreadsheet,
  Award,
  TrendingUp,
  Megaphone,
  Box,
  UserCheck,
  FileText,
  Sparkles,
  Settings,
  Receipt,
  RotateCcw,
  Trash2,
  Briefcase,
  FolderGit2,
  Presentation
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile
}) => {
  const { currentUser, stats, trashItems } = useAcademy();

  // Define navigation sections with role permissions
  const navSections = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'TRAINER'] },
        { id: 'crm', label: 'CRM & Leads', icon: Users, badge: stats.todayFollowupsCount > 0 ? stats.todayFollowupsCount : undefined, badgeColor: 'bg-amber-500', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'students', label: 'Students', icon: GraduationCap, badge: stats.activeStudents, badgeColor: 'bg-indigo-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
      ]
    },
    {
      title: 'ACADEMICS',
      items: [
        { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'batches', label: 'Batches', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'schedule', label: 'Class Schedule', icon: CalendarDays, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'assignments', label: 'Assignments & Projects', icon: FolderGit2, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER', 'COUNSELOR'] },
        { id: 'attendance', label: 'Attendance', icon: UserCheck, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER'] },
        { id: 'exams', label: 'Exams & Results', icon: Award, roles: ['SUPER_ADMIN', 'MANAGER', 'TRAINER'] },
        { id: 'certificates', label: 'Certificates', icon: Award, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTS',
      items: [
        { id: 'payments', label: 'Payments & Receipts', icon: CreditCard, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] },
        { id: 'due', label: 'Due Management', icon: AlertCircle, badge: stats.overdueDueAmount > 0 ? 'Due' : undefined, badgeColor: 'bg-rose-600', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR'] },
        { id: 'expenses', label: 'Expenses', icon: Receipt, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] },
        { id: 'financial-reports', label: 'Financial Reports', icon: TrendingUp, roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF'] }
      ]
    },
    {
      title: 'GROWTH & OPERATIONS',
      items: [
        { id: 'placements', label: 'Placement & Careers', icon: Briefcase, badge: 'Jobs', badgeColor: 'bg-emerald-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'] },
        { id: 'seminars', label: 'Seminars & Workshops', icon: Presentation, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'marketing', label: 'Marketing & ROI', icon: Megaphone, roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR'] },
        { id: 'inventory-staff', label: 'Staff & Assets', icon: Box, roles: ['SUPER_ADMIN', 'MANAGER'] },
        { id: 'reports', label: 'Spreadsheets & Backup', icon: FileSpreadsheet, badge: 'Excel', badgeColor: 'bg-emerald-600', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR'] },
        { id: 'ai-assistant', label: 'AI Operations Assistant', icon: Sparkles, badge: 'AI', badgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-600', roles: ['SUPER_ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'TRAINER'] }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings & Audit', icon: Settings, roles: ['SUPER_ADMIN', 'MANAGER'] },
        { id: 'recycle-bin', label: 'Recycle Bin', icon: Trash2, badge: trashItems.length > 0 ? `${trashItems.length}` : undefined, badgeColor: 'bg-rose-600', roles: ['SUPER_ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'COUNSELOR', 'TRAINER'] }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <NexgenLogo variant="crest" size={38} className="bg-white/10 p-1 rounded-xl" />
            <div>
              <div className="text-sm font-black text-white tracking-wide uppercase leading-tight">Nexgen Academy</div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Internal Portal</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {navSections.map((section, idx) => {
            const accessibleItems = section.items.filter(item => item.roles.includes(currentUser.role));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
                {accessibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white ${item.badgeColor || 'bg-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Info Footer in Sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] text-slate-400">Status: Operational</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">v2.6 Live</span>
          </div>
        </div>
      </aside>
    </>
  );
};
