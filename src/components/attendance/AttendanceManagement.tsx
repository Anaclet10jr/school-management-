import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Send,
  Sparkles,
  AlertTriangle,
  UserCheck,
  Check,
  Phone,
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, ClassSection } from '../../types';
import { Language, translations } from '../../locales/translations';

interface AttendanceManagementProps {
  students: Student[];
  classes: ClassSection[];
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => void;
  language: Language;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  students,
  classes,
  onSaveAttendanceBatch,
  language,
}) => {
  const t = translations[language];

  const [selectedClass, setSelectedClass] = useState<string>('cls-olevel-s1a');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [period, setPeriod] = useState<string>('Daily Roll Call');

  // Filter students for the active class
  const classStudents = students.filter(
    (s) => s.classId === selectedClass || s.className === 'S1 A'
  );

  // Local attendance status mapping
  const [attendanceMap, setAttendanceMap] = useState<{
    [studentId: string]: { status: AttendanceStatus; remarks: string };
  }>(() => {
    const initial: { [studentId: string]: { status: AttendanceStatus; remarks: string } } = {};
    classStudents.forEach((st) => {
      initial[st.id] = { status: st.attendanceRate < 80 ? 'Absent' : 'Present', remarks: '' };
    });
    return initial;
  });

  const [saveToast, setSaveToast] = useState(false);
  const [alertSentStudent, setAlertSentStudent] = useState<string | null>(null);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      classStudents.forEach((st) => {
        updated[st.id] = { status: 'Present', remarks: '' };
      });
      return updated;
    });
  };

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = classStudents.map((st) => {
      const entry = attendanceMap[st.id] || { status: 'Present', remarks: '' };
      return {
        id: `att-${Date.now()}-${st.id}`,
        date: selectedDate,
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        classId: selectedClass,
        className: st.className,
        status: entry.status,
        remarks: entry.remarks,
        recordedBy: 'Current Teacher',
        period,
      };
    });

    onSaveAttendanceBatch(records);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSendParentAlert = (st: Student) => {
    setAlertSentStudent(st.firstName);
    setTimeout(() => setAlertSentStudent(null), 4000);
  };

  // Stats for the active sheet
  const statuses = classStudents.map((s) => attendanceMap[s.id]?.status || 'Present');
  const presentCount = statuses.filter((s) => s === 'Present').length;
  const absentCount = statuses.filter((s) => s === 'Absent').length;
  const lateCount = statuses.filter((s) => s === 'Late').length;
  const excusedCount = statuses.filter((s) => s === 'Excused').length;
  const attendanceRate = Math.round((presentCount / (classStudents.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Date/Class Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <span>Attendance Management & Parent Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid mobile-friendly attendance register with SMS alerts for Rwandan parents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Section {cls.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All Present</span>
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Realtime Attendance Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Rate Today</span>
          <p className="text-xl font-black text-emerald-700 mt-1">{attendanceRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Present</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{presentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase">Absent</span>
          <p className="text-xl font-black text-rose-700 mt-1">{absentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase">Late</span>
          <p className="text-xl font-black text-amber-700 mt-1">{lateCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase">Excused</span>
          <p className="text-xl font-black text-blue-700 mt-1">{excusedCount}</p>
        </div>
      </div>

      {/* Save Success Notice */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Attendance register successfully recorded to system audit logs and student history!</span>
        </div>
      )}

      {/* Alert Sent Notice */}
      {alertSentStudent && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-600" />
          <span>
            Parent Alert Notification sent: "Your child {alertSentStudent} was recorded absent today at Kigali Academic Academy."
          </span>
        </div>
      )}

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Overall Attendance</th>
                <th className="py-3 px-4 text-center">Status Selection (Click to Toggle)</th>
                <th className="py-3 px-4">Remarks / Excuse Reason</th>
                <th className="py-3 px-4 text-center">Parent Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const currentStatus = attendanceMap[st.id]?.status || 'Present';
                const currentRemarks = attendanceMap[st.id]?.remarks || '';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.firstName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {st.firstName} {st.lastName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-500">
                            {st.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{st.attendanceRate}%</span>
                        {st.attendanceRate < 85 && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Risk
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Present')}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Absent')}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Late')}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                            currentStatus === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'Excused')}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                            currentStatus === 'Excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Excused</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Add remark..."
                        value={currentRemarks}
                        onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </td>

                    <td className="py-3 px-4 text-center">
                      {currentStatus === 'Absent' ? (
                        <button
                          type="button"
                          onClick={() => handleSendParentAlert(st)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-[11px] border border-rose-200 flex items-center gap-1 mx-auto"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Send SMS</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
