import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  Coins,
  Receipt,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Layers,
  FileCheck2,
} from 'lucide-react';
import {
  Student,
  Teacher,
  ClassSection,
  Payment,
  Announcement,
  MarkEntry,
  ReportCard,
  TimetableEntry,
} from '../../types';
import { Language, translations } from '../../locales/translations';
import { ActiveTab } from '../layout/Sidebar';

interface AdminDashboardProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassSection[];
  payments: Payment[];
  announcements: Announcement[];
  marks?: MarkEntry[];
  reportCards?: ReportCard[];
  timetable?: TimetableEntry[];
  language: Language;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectStudent?: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  teachers,
  classes,
  payments,
  announcements,
  marks = [],
  reportCards = [],
  timetable = [],
  language,
  onNavigateTab,
  onSelectStudent,
}) => {
  const t = translations[language];

  // Calculated Metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const activeClasses = classes.length;
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + (s.attendanceRate || 90), 0) / (totalStudents || 1)
  );
  const totalFeesCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalOutstanding = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);

  // Education level breakdown
  const levelsCount = {
    Nursery: students.filter((s) => s.educationLevel === 'Nursery').length,
    Primary: students.filter((s) => s.educationLevel === 'Primary').length,
    'O-Level': students.filter((s) => s.educationLevel === 'O-Level').length,
    'A-Level': students.filter((s) => s.educationLevel === 'A-Level').length,
  };

  // High-risk attendance students (<85%)
  const attendanceRiskStudents = students.filter((s) => s.attendanceRate < 85);

  // Academic marks stats
  const avgExamScore = marks.length > 0
    ? Math.round(marks.reduce((acc, m) => acc + m.total, 0) / marks.length)
    : 78;

  const publishedReportsCount = reportCards.filter((r) => r.status === 'Published').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Term 2 • 2025/2026 Academic Calendar
            </span>
            <span className="text-xs text-emerald-200/80">Kigali, Rwanda</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 text-white">
            Super Administrator Executive Hub
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Real-time school management engine monitoring attendance, live timetable schedules, academic grading, RWF school fees, and official report cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-3.5 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.takeAttendance}</span>
          </button>
          <button
            onClick={() => onNavigateTab('marks')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Enter Marks</span>
          </button>
          <button
            onClick={() => onNavigateTab('timetable')}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Timetable</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-300" />
            <span>Bulletins</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.totalStudents}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14 this term
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 8 registered class streams</p>
        </div>

        {/* Academic Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.totalTeachers}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalTeachers}</span>
            <span className="text-xs font-bold text-blue-600">Full Faculty</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% REB License Verified</p>
        </div>

        {/* Fees Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Fees Collected (Term 2)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">
              RWF {totalFeesCollected.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bank & MoMo verified collections</p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Outstanding Fees
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-rose-600">
              RWF {totalOutstanding.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending parent settlement</p>
        </div>
      </div>

      {/* SUPER ADMIN CORE OPERATIONS: TIMETABLE, MARKS & REPORTS TRIPLE HUB */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Academic Scheduling, Grading & Bulletins Hub</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live synchronized status of weekly class schedules, examination entries, and official student bulletins.
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Super Admin Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 1. Timetable Hub Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" /> Master Timetable
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {timetable.length} Active Periods
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                Weekly schedules mapped across S1 A, S4 MCB A, and P6 A with automated teacher and room conflict detection.
              </p>

              {/* Quick Snippet of Timetable */}
              <div className="mt-3 space-y-1.5">
                {timetable.slice(0, 3).map((slot) => (
                  <div
                    key={slot.id}
                    className="p-2 bg-white rounded-lg border border-slate-200/80 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{slot.subjectName}</span>
                      <span className="text-slate-400 font-mono ml-1.5">({slot.className})</span>
                      <p className="text-[10px] text-slate-500">{slot.teacherName} • {slot.room}</p>
                    </div>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px]">
                      {slot.day.slice(0, 3)} {slot.startTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('timetable')}
              className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Open Timetable Manager ({timetable.length} Lessons)</span>
            </button>
          </div>

          {/* 2. Marks & Grading Hub Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Exam Marks & Grading
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {marks.length} Marks Stored
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                Competence-Based Curriculum (CBC) assessment scoring CAT1 (/20), CAT2 (/20), and Final Exam (/60).
              </p>

              {/* Marks Quick Highlights */}
              <div className="mt-3 space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Recorded Mark Entries:</span>
                  <span className="font-bold text-slate-900">{marks.length} Subjects Evaluated</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Schoolwide Exam Average:</span>
                  <span className="font-bold text-emerald-700">{avgExamScore}% (Grade A/B)</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Grading Scale:</span>
                  <span className="font-bold text-slate-700">REB 6-Tier Standard</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('marks')}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Manage Marks & Spreadsheets</span>
            </button>
          </div>

          {/* 3. Official Report Cards Hub Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" /> Official Bulletins
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {reportCards.length} Report Cards
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                Official end-of-term student bulletins with class rankings, teacher comments, and digital SHA-256 seal verification.
              </p>

              {/* Report Highlights */}
              <div className="mt-3 space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Published to Portals:</span>
                  <span className="font-bold text-emerald-700">{publishedReportsCount} Available</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Draft / In Review:</span>
                  <span className="font-bold text-amber-700">{reportCards.length - publishedReportsCount} Pending</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Print Formats:</span>
                  <span className="font-bold text-slate-700">Official Letterhead PDF</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Review & Print Bulletins</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Population by Education Level */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Student Distribution by Level
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              4 Levels
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Nursery (Early Childhood)</span>
                <span className="font-bold text-slate-900">{levelsCount.Nursery} Enrolled</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Primary (P1 - P6)</span>
                <span className="font-bold text-slate-900">{levelsCount.Primary} Enrolled</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">O-Level / Lower Secondary</span>
                <span className="font-bold text-slate-900">{levelsCount['O-Level']} Enrolled</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">A-Level / Upper Secondary</span>
                <span className="font-bold text-slate-900">{levelsCount['A-Level']} Enrolled</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Enrolled Capacity:</span>
            <span className="font-bold text-slate-800">270 Desks</span>
          </div>
        </div>

        {/* Weekly Attendance Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Weekly Attendance Analysis
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              This Week
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between h-40 pt-6 px-2">
            {[
              { day: 'Mon', pct: 96 },
              { day: 'Tue', pct: 94 },
              { day: 'Wed', pct: 97 },
              { day: 'Thu', pct: 93 },
              { day: 'Fri', pct: 95 },
            ].map((bar) => (
              <div key={bar.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-bold text-slate-600">{bar.pct}%</span>
                <div className="w-8 bg-slate-100 rounded-t-lg h-28 relative flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${bar.pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Regular Attendance</span>
            </div>
            <span className="font-bold text-emerald-700">95.0% Average</span>
          </div>
        </div>

        {/* Smart Alerts & Risk Indicators */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Smart Alerts & Risks
              </h3>
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Attention
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {attendanceRiskStudents.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStudent && onSelectStudent(st)}
                  className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-amber-950">
                      {st.firstName} {st.lastName} ({st.className})
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Attendance fallen to {st.attendanceRate}% (Threshold: 85%)
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                    Notify
                  </span>
                </div>
              ))}

              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-950">Outstanding Fees Alert</p>
                  <p className="text-[11px] text-rose-700">
                    Divine Kezia has RWF 120,000 pending fee balance
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('fees')}
                  className="text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs cursor-pointer"
                >
                  View
                </button>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-950">Term 2 Exam Approvals</p>
                  <p className="text-[11px] text-blue-700">
                    S1 A Mathematics & Physics marks submitted
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs cursor-pointer"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <span className="text-[11px] text-slate-400">Automated proactive rules active</span>
          </div>
        </div>
      </div>

      {/* Recent Admissions & Payments Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments in RWF */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Recent Fee Payments (RWF)
            </h3>
            <button
              onClick={() => onNavigateTab('fees')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {payments.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{p.studentName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                      {p.className}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.receiptNumber} • {p.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">
                    +RWF {p.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{p.paymentDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest School Announcements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              School Notices & Announcements
            </h3>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>All Notices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {announcements.map((anc) => (
              <div key={anc.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{anc.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      anc.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {anc.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{anc.content}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>Audience: {anc.targetAudience}</span>
                  <span>{anc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
