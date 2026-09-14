import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  UserCheck,
  CalendarCheck,
  FileCheck2,
  Award,
  Clock,
  Coins,
  Receipt,
  Library,
  BookMarked,
  ShieldAlert,
  Megaphone,
  History,
  Sliders,
  Settings,
  ChevronRight,
  School,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { UserRole } from '../../types';
import { Language, translations } from '../../locales/translations';

export type ActiveTab =
  | 'dashboard'
  | 'students'
  | 'admissions'
  | 'classes'
  | 'subjects'
  | 'teachers'
  | 'attendance'
  | 'exams'
  | 'marks'
  | 'reports'
  | 'timetable'
  | 'fees'
  | 'payments'
  | 'library'
  | 'assignments'
  | 'discipline'
  | 'announcements'
  | 'audit'
  | 'setup'
  | 'settings';

interface SidebarProps {
  currentTab: ActiveTab | string;
  onTabChange?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  userRole?: UserRole;
  currentRole?: UserRole;
  language: Language;
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onSelectTab,
  userRole,
  currentRole,
  language,
  isOpen = false,
  onClose,
}) => {
  const t = translations[language];

  // Consolidate role
  const effectiveRole: UserRole = userRole || currentRole || 'Super Administrator';

  // Helper to filter nav items based on role
  const isSuperAdmin = effectiveRole === 'Super Administrator' || effectiveRole === 'School Administrator';
  const isHeadOrAcademic = effectiveRole === 'Head Teacher' || effectiveRole === 'Academic Director';
  const isTeacher = effectiveRole === 'Teacher' || effectiveRole === 'Class Teacher';
  const isBursar = effectiveRole === 'Accountant / Bursar';
  const isParent = effectiveRole === 'Parent';
  const isStudent = effectiveRole === 'Student';

  const handleSelectTab = (tabId: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    if (onClose) {
      onClose();
    }
  };

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    allowed: boolean;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      group: 'Core',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, allowed: true },
      ],
    },
    {
      group: 'Academics & Enrolment',
      items: [
        { id: 'students', label: isParent ? 'My Children' : isStudent ? 'My Student Profile' : t.students, icon: Users, badge: '6', allowed: true },
        { id: 'admissions', label: t.admissions, icon: UserPlus, badge: 'New', allowed: isSuperAdmin || isHeadOrAcademic },
        { id: 'classes', label: t.classes, icon: School, allowed: isSuperAdmin || isHeadOrAcademic || isTeacher },
        { id: 'subjects', label: t.subjects, icon: BookOpen, allowed: isSuperAdmin || isHeadOrAcademic || isTeacher },
        { id: 'teachers', label: t.teachers, icon: GraduationCap, allowed: isSuperAdmin || isHeadOrAcademic },
      ],
    },
    {
      group: 'Assessments & Daily',
      items: [
        { id: 'attendance', label: t.attendance, icon: CalendarCheck, allowed: true },
        { id: 'timetable', label: t.timetable, icon: Clock, allowed: true },
        { id: 'exams', label: t.exams, icon: FileSpreadsheet, allowed: isSuperAdmin || isHeadOrAcademic || isTeacher },
        { id: 'marks', label: isStudent || isParent ? 'Academic Marks' : t.marks, icon: Award, allowed: true },
        { id: 'reports', label: isParent || isStudent ? 'Official Bulletin' : t.reportCards, icon: FileCheck2, badge: 'PDF', allowed: true },
      ],
    },
    {
      group: 'Finance (RWF)',
      items: [
        { id: 'fees', label: isParent || isStudent ? 'Fee Invoices' : t.fees, icon: Coins, allowed: true },
        { id: 'payments', label: isParent || isStudent ? 'My Receipts' : t.payments, icon: Receipt, allowed: true },
      ],
    },
    {
      group: 'School Community',
      items: [
        { id: 'library', label: t.library, icon: Library, allowed: !isParent },
        { id: 'assignments', label: t.assignments, icon: BookMarked, allowed: true },
        { id: 'discipline', label: t.discipline, icon: ShieldAlert, allowed: isSuperAdmin || isHeadOrAcademic || isTeacher },
        { id: 'announcements', label: t.announcements, icon: Megaphone, allowed: true },
      ],
    },
    {
      group: 'System & Admin',
      items: [
        { id: 'audit', label: t.auditLogs, icon: History, allowed: isSuperAdmin },
        { id: 'setup', label: t.setupWizard, icon: Sliders, allowed: isSuperAdmin },
        { id: 'settings', label: t.settings, icon: Settings, allowed: isSuperAdmin },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Drawer / Static Aside */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-57px)] border-r border-slate-800 shrink-0 select-none transition-all duration-300 ${
          isOpen
            ? 'fixed inset-y-0 left-0 top-0 z-50 h-full shadow-2xl flex'
            : 'hidden lg:flex'
        }`}
      >
        {/* Mobile Header with Close Button */}
        {isOpen && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              School Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {navGroups.map((group, idx) => {
            const visibleItems = group.items.filter((item) => item.allowed);
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {group.group}
                </div>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentTab === item.id ||
                    (item.id === 'marks' && currentTab === 'exams') ||
                    (item.id === 'exams' && currentTab === 'marks') ||
                    (item.id === 'fees' && currentTab === 'payments') ||
                    (item.id === 'payments' && currentTab === 'fees') ||
                    (item.id === 'discipline' && currentTab === 'welfare') ||
                    (item.id === 'setup' && currentTab === 'settings');

                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-bold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-emerald-700 text-emerald-100'
                              : 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
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

        {/* Footer info pill */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-300">System Live</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v3.2 RW</span>
          </div>
        </div>
      </aside>
    </>
  );
};
