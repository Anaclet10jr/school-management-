import React, { useState } from 'react';
import {
  Bell,
  Search,
  Globe,
  LogOut,
  ChevronDown,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  Menu,
} from 'lucide-react';
import { User, SchoolSettings } from '../../types';
import { initialSchoolSettings } from '../../data/seedData';
import { Language, translations } from '../../locales/translations';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  allUsers?: User[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings?: SchoolSettings;
  onOpenSetupWizard?: () => void;
  onGlobalSearchSelect?: (type: 'student' | 'teacher' | 'class', id: string) => void;
  studentsCount?: number;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers = [],
  language,
  onLanguageChange,
  settings,
  onOpenSetupWizard,
  onGlobalSearchSelect,
  onToggleSidebar,
}) => {
  const t = translations[language];
  const activeSettings = settings || initialSchoolSettings;
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample notifications
  const notifications = [
    { id: '1', title: 'Term 2 Marks Pending Approval', time: '10m ago', unread: true },
    { id: '2', title: 'Payment received: RWF 280,000 (Ineza Nadine)', time: '1h ago', unread: true },
    { id: '3', title: 'Admissions: 2 new applications pending review', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
        {/* Left: Branding & Academic Pill */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs tracking-wider shrink-0">
              KA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  {activeSettings.schoolName || 'Kigali Academic Academy'}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Rwanda SMS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeSettings.academicYear || '2025-2026'} •{' '}
                <span className="text-emerald-700 font-semibold">
                  {activeSettings.currentTerm || 'Term 2'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`${t.search} (Student, Teacher, Class, Receipt #)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-transparent focus:border-emerald-500 focus:bg-white rounded-lg transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery.length > 1 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Quick Results
                </div>
                <button
                  onClick={() => {
                    onGlobalSearchSelect?.('student', 'stu-001');
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs text-slate-700"
                >
                  <span className="font-medium">Nadine Ineza (SCH-2026-00001)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">S1 A Student</span>
                </button>
                <button
                  onClick={() => {
                    onGlobalSearchSelect?.('teacher', 'tch-001');
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs text-slate-700"
                >
                  <span className="font-medium">Jean Paul Habimana (Math)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Teacher</span>
                </button>
                <button
                  onClick={() => {
                    onGlobalSearchSelect?.('class', 'cls-olevel-s1a');
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs text-slate-700"
                >
                  <span className="font-medium">Senior 1 A (O-Level)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Class List</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Setup Wizard Button */}
          <button
            onClick={onOpenSetupWizard}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
            title="School Setup Wizard"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Setup Wizard</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('rw')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                language === 'rw'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>RW</span>
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Alerts & Messages</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 mt-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                      <p className="text-xs font-medium text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Switch Role Quick Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/60 text-emerald-950 rounded-xl transition-all text-xs font-semibold shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-emerald-700 font-bold truncate max-w-[120px]">
                {currentUser?.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {t.switchRole}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 py-1">
                  {allUsers.map((u) => {
                    const isCurrent = u.id === currentUser?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50/50 rounded-lg transition-colors ${
                          isCurrent ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-emerald-700 font-medium">{u.role}</p>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
