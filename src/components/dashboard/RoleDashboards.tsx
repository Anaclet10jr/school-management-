import React, { useState } from 'react';
import {
  CalendarCheck,
  Award,
  Clock,
  Coins,
  Receipt,
  FileCheck2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Download,
  Phone,
  Mail,
  User,
  ArrowRight,
} from 'lucide-react';
import {
  Student,
  Teacher,
  ReportCard,
  Payment,
  TimetableEntry,
  Assignment,
  Announcement,
  UserRole,
} from '../../types';
import { ActiveTab } from '../layout/Sidebar';

interface RoleDashboardsProps {
  role: UserRole;
  students: Student[];
  teacher?: Teacher;
  reportCards: ReportCard[];
  payments: Payment[];
  timetable: TimetableEntry[];
  assignments: Assignment[];
  announcements: Announcement[];
  onNavigateTab: (tab: ActiveTab) => void;
  onViewReportCard: (reportCard: ReportCard) => void;
}

export const RoleDashboards: React.FC<RoleDashboardsProps> = ({
  role,
  students,
  teacher,
  reportCards,
  payments,
  timetable,
  assignments,
  announcements,
  onNavigateTab,
  onViewReportCard,
}) => {
  // Parent view state
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  // TEACHER DASHBOARD
  if (role === 'Teacher' || role === 'Class Teacher') {
    const assignedClasses = teacher?.assignedClasses || ['S1 A', 'S3 A'];
    const assignedSubjects = teacher?.assignedSubjects || ['Mathematics', 'Physics'];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-200 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-400/20">
              Teacher Faculty Workspace
            </span>
            <h2 className="text-xl font-bold mt-2">
              Welcome, {teacher?.name || 'Teacher Jean Paul'}
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              Department: {teacher?.department || 'Mathematics & Science'} • Staff ID: {teacher?.staffId || 'TCH-2026-001'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-3.5 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-50 transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigateTab('marks')}
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-500 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Input Marks</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Assigned Classes</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{assignedClasses.length}</p>
            <p className="text-xs text-slate-500 mt-1">{assignedClasses.join(', ')}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Teaching Subjects</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{assignedSubjects.length}</p>
            <p className="text-xs text-slate-500 mt-1">{assignedSubjects.join(', ')}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Weekly Workload</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{teacher?.weeklyLessons || 22} Periods</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Normal full-time allocation</p>
          </div>
        </div>

        {/* Today's Schedule & Quick Mark Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Today's Lesson Timetable
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Monday
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {timetable.slice(0, 3).map((slot) => (
                <div key={slot.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{slot.subjectName}</span>
                    <p className="text-xs text-slate-500">
                      Class: <span className="font-semibold text-slate-700">{slot.className}</span> • Room: {slot.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-1 rounded-lg">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Pending Mark Entries & Deadlines
              </h3>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-950">S1 A • Mathematics CAT 2</span>
                  <p className="text-xs text-amber-800">Deadline: March 20th • 36 students</p>
                </div>
                <button
                  onClick={() => onNavigateTab('marks')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                >
                  Enter
                </button>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950">S3 A • Physics End-of-Term</span>
                  <p className="text-xs text-emerald-800">Term 2 Exam Sheet Ready</p>
                </div>
                <button
                  onClick={() => onNavigateTab('marks')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // BURSAR / ACCOUNTANT DASHBOARD
  if (role === 'Accountant / Bursar') {
    const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalOutstanding = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-teal-200 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-400/20">
              Finance & Bursary Division
            </span>
            <h2 className="text-xl font-bold mt-2">Bursar Financial Console</h2>
            <p className="text-xs text-teal-100 mt-1">
              Tracking Rwandan Franc (RWF) tuition fees, MTN Mobile Money transactions, and receipts.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('payments')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Record Payment & Issue Receipt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Collections (Term 2)</span>
            <p className="text-2xl font-black text-slate-900 mt-2">RWF {totalCollected.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">82% of projected revenue</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Outstanding Arrears</span>
            <p className="text-2xl font-black text-rose-600 mt-2">RWF {totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-rose-500 font-semibold mt-1">4 students with unpaid balances</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Payment Channels</span>
            <p className="text-base font-bold text-slate-800 mt-2">MTN MoMo, Airtel, Bank</p>
            <p className="text-xs text-slate-500 mt-1">Instant SMS receipt broadcast</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
            Recent Fee Transactions
          </h3>
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{p.studentName}</span>
                  <p className="text-xs text-slate-500">
                    Receipt #{p.receiptNumber} • {p.paymentMethod} • Ref: {p.referenceNumber}
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
      </div>
    );
  }

  // PARENT PORTAL
  if (role === 'Parent') {
    // Child is Nadine Ineza
    const child = students[0];
    const childReport = reportCards.find((r) => r.studentId === child?.id);
    const childPayments = payments.filter((p) => p.studentId === child?.id);

    return (
      <div className="space-y-6">
        {/* Child Selector Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={child?.photo}
              alt={child?.firstName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {child?.firstName} {child?.middleName} {child?.lastName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {child?.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Student ID: <span className="font-mono font-semibold text-slate-700">{child?.studentId}</span> • Level: {child?.educationLevel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {childReport && (
              <button
                onClick={() => onViewReportCard(childReport)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Term 2 Bulletin</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Attendance Record</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{child?.attendanceRate}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">58 Days Present • 2 Days Absent</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Academic Average</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{childReport?.averageScore || 86.8}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Class Position: 1st of 36 (Grade A)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fee Balance</span>
            <p className="text-2xl font-black text-amber-600 mt-2">RWF {(child?.feeBalance || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Term 2 Remaining Balance</p>
          </div>
        </div>

        {/* Subject Performance Breakdown */}
        {childReport && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
              Published Term 2 Subject Results
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">CAT 1 (/20)</th>
                    <th className="py-2.5 px-3 text-center">CAT 2 (/20)</th>
                    <th className="py-2.5 px-3 text-center">Exam (/60)</th>
                    <th className="py-2.5 px-3 text-center">Total (/100)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {childReport.subjectMarks.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{m.subjectName}</td>
                      <td className="py-2.5 px-3 text-center">{m.cat1}</td>
                      <td className="py-2.5 px-3 text-center">{m.cat2}</td>
                      <td className="py-2.5 px-3 text-center">{m.exam}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{m.total}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800">
                          {m.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{m.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STUDENT PORTAL
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={students[0]?.photo}
            alt="Student Profile"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-300"
          />
          <div>
            <span className="text-xs font-bold text-emerald-200 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-400/20">
              Student Information Portal
            </span>
            <h2 className="text-xl font-bold mt-1">
              {students[0]?.firstName} {students[0]?.lastName}
            </h2>
            <p className="text-xs text-emerald-100">
              Class: {students[0]?.className} • Student ID: {students[0]?.studentId}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const report = reportCards[0];
            if (report) onViewReportCard(report);
          }}
          className="px-4 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-50 transition-all flex items-center gap-1.5"
        >
          <FileCheck2 className="w-4 h-4 text-emerald-700" />
          <span>View Official Bulletin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
            Today's Classes & Schedule
          </h3>
          <div className="space-y-2.5">
            {timetable.slice(0, 3).map((slot) => (
              <div key={slot.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{slot.subjectName}</span>
                  <p className="text-xs text-slate-500">Teacher: {slot.teacherName} • Room: {slot.room}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
            Active Homework
          </h3>
          <div className="space-y-3">
            {assignments.slice(0, 2).map((a) => (
              <div key={a.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs font-bold text-slate-800">{a.title}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{a.subjectName} • Due {a.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
