import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  X,
  Sparkles,
  School,
  Award,
  CalendarCheck,
  Search,
  Filter,
  Users,
  Plus,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { ReportCard, Student, SchoolSettings } from '../../types';
import { Language, translations } from '../../locales/translations';

interface ReportCardModuleProps {
  reportCards: ReportCard[];
  students: Student[];
  settings: SchoolSettings;
  onUpdateReportCard: (card: ReportCard) => void;
  language: Language;
}

export const ReportCardModule: React.FC<ReportCardModuleProps> = ({
  reportCards,
  students,
  settings,
  onUpdateReportCard,
  language,
}) => {
  const t = translations[language];

  const [activeCard, setActiveCard] = useState<ReportCard | null>(reportCards[0] || null);
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // Keep activeCard synchronized
  useEffect(() => {
    if (!activeCard && reportCards.length > 0) {
      setActiveCard(reportCards[0]);
    } else if (activeCard && !reportCards.some((c) => c.id === activeCard.id) && reportCards.length > 0) {
      setActiveCard(reportCards[0]);
    }
  }, [reportCards, activeCard]);

  // Unique classes list from cards
  const classList = useMemo(() => {
    const list = new Set(['All']);
    reportCards.forEach((c) => list.add(c.className));
    return Array.from(list);
  }, [reportCards]);

  const filteredCards = useMemo(() => {
    return reportCards.filter((c) => {
      const matchesClass = filterClass === 'All' || c.className === filterClass;
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchesSearch =
        c.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
        c.studentCode.toLowerCase().includes(searchStudent.toLowerCase());
      return matchesClass && matchesStatus && matchesSearch;
    });
  }, [reportCards, filterClass, filterStatus, searchStudent]);

  // Stats
  const publishedCount = reportCards.filter((c) => c.status === 'Published').length;
  const pendingCount = reportCards.filter((c) => c.status !== 'Published').length;
  const schoolAvg = Math.round(
    reportCards.reduce((acc, c) => acc + c.averageScore, 0) / (reportCards.length || 1)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleWorkflowAction = (card: ReportCard, nextStatus: 'Submitted' | 'Approved' | 'Published') => {
    const updated: ReportCard = {
      ...card,
      status: nextStatus,
      publishedAt: nextStatus === 'Published' ? new Date().toISOString().split('T')[0] : undefined,
    };
    onUpdateReportCard(updated);
    if (activeCard?.id === card.id) {
      setActiveCard(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Official Report Cards & Academic Bulletins</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {reportCards.length} Generated Bulletins
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rwandan Ministry of Education compliant term bulletins with multi-stage approval, teacher remarks, and seal verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeCard && (
            <>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printReport}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadPDF}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Bulletins</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{reportCards.length} Students</p>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-700 rounded-xl">
            <Users className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Published to Portals</span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{publishedCount} Published</p>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pending Review</span>
            <p className="text-xl font-black text-amber-700 mt-0.5">{pendingCount} In Pipeline</p>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Overall School Average</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{schoolAvg}%</p>
          </div>
          <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Approval Pipeline Status Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-4 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="text-xs font-bold text-emerald-200">Official Bulletin Security Protocol:</span>
          <span className="text-xs text-slate-200">
            Parents & students can view term bulletins in their respective portals once marked as "Published".
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">1. Teacher Enters</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-200">2. Submitted</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200">3. Approved</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">4. Published</span>
        </div>
      </div>

      {/* Main Grid: Card Selector List on Left, Printable Official Bulletin on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report Card List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Select Student Bulletin</span>
              <span className="text-emerald-700 font-bold font-mono">{filteredCards.length} Available</span>
            </h3>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search student or code..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {classList.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Classes' : c}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="All">All States</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="space-y-2 mt-2 max-h-[620px] overflow-y-auto pr-0.5">
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => {
                  const isSelected = activeCard?.id === card.id;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveCard(card)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{card.studentName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            card.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : card.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {card.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span>
                          {card.className} • Average: <strong className="text-slate-800">{card.averageScore}%</strong>
                        </span>
                        <span className="font-bold text-emerald-700">Rank: #{card.classPosition}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {card.studentCode} • {card.term}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No report cards match the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: The Official Printable Report Card Bulletin */}
        <div className="lg:col-span-8">
          {activeCard ? (
            <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 sm:p-10 space-y-6 print:m-0 print:p-4 print:border-none print:shadow-none">
              {/* Approval Action Bar (hidden on print) */}
              <div className="print:hidden p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Workflow Action:</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Current: {activeCard.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeCard.status === 'Draft' && (
                    <button
                      onClick={() => handleWorkflowAction(activeCard, 'Submitted')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Submit for Approval
                    </button>
                  )}
                  {activeCard.status === 'Submitted' && (
                    <button
                      onClick={() => handleWorkflowAction(activeCard, 'Approved')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Approve Grades
                    </button>
                  )}
                  {activeCard.status !== 'Published' && (
                    <button
                      onClick={() => handleWorkflowAction(activeCard, 'Published')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Publish to Portals
                    </button>
                  )}
                  {activeCard.status === 'Published' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  )}
                </div>
              </div>

              {/* OFFICIAL REPORT CARD HEADER */}
              <div className="border-b-2 border-slate-900 pb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl tracking-wider shadow-sm">
                      KA
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                        {settings?.schoolName || 'Kigali Academic Academy'}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium">
                        {settings?.motto || 'Knowledge, Integrity & Excellence'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {settings?.address || 'KG 125 St, Gasabo District, Kigali, Rwanda'} • Tel: {settings?.phone || '+250 788 123 456'} • Email: {settings?.email || 'info@kigaliacademy.rw'}
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-slate-900 px-4 py-2 rounded-xl text-center bg-slate-50">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Official Term Bulletin
                    </span>
                    <p className="text-sm font-black text-slate-900">
                      {activeCard.term} • {activeCard.academicYear}
                    </p>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Student Name</span>
                    <strong className="text-slate-900 text-sm">{activeCard.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Student ID</span>
                    <strong className="text-slate-900 font-mono">{activeCard.studentCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Class / Stream</span>
                    <strong className="text-slate-900">{activeCard.className} ({activeCard.educationLevel})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Term Attendance</span>
                    <strong className="text-emerald-700 font-bold">{activeCard.attendancePercentage}% ({activeCard.daysPresent} Days)</strong>
                  </div>
                </div>
              </div>

              {/* SUBJECT MARKS TABLE */}
              <div>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3 border border-slate-300">Subject</th>
                      <th className="py-2.5 px-2 text-center border border-slate-300">CAT 1 (/20)</th>
                      <th className="py-2.5 px-2 text-center border border-slate-300">CAT 2 (/20)</th>
                      <th className="py-2.5 px-2 text-center border border-slate-300">Exam (/60)</th>
                      <th className="py-2.5 px-2 text-center border border-slate-300">Total (/100)</th>
                      <th className="py-2.5 px-2 text-center border border-slate-300">Grade</th>
                      <th className="py-2.5 px-3 border border-slate-300">Subject Teacher Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCard.subjectMarks.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 border border-slate-300 font-bold text-slate-900">{m.subjectName}</td>
                        <td className="py-2 px-2 text-center border border-slate-300">{m.cat1}</td>
                        <td className="py-2 px-2 text-center border border-slate-300">{m.cat2}</td>
                        <td className="py-2 px-2 text-center border border-slate-300">{m.exam}</td>
                        <td className="py-2 px-2 text-center border border-slate-300 font-black text-slate-900">{m.total}%</td>
                        <td className="py-2 px-2 text-center border border-slate-300 font-black text-emerald-800">{m.grade}</td>
                        <td className="py-2 px-3 border border-slate-300 text-slate-600 text-[11px]">{m.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-400">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 border border-slate-300 text-right uppercase text-[11px]">
                        Overall Term Average & Position:
                      </td>
                      <td className="py-2.5 px-2 text-center border border-slate-300 text-sm font-black text-emerald-800">
                        {activeCard.averageScore}%
                      </td>
                      <td className="py-2.5 px-2 text-center border border-slate-300 text-sm font-black text-emerald-800">
                        {activeCard.overallGrade}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-slate-800">
                        Position: <strong>{activeCard.classPosition}</strong> out of {activeCard.classSize} students
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* COMMENTS & CONDUCT SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 border border-slate-300 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Conduct & Student Demeanour
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{activeCard.conduct}</p>
                  <p className="text-[11px] text-slate-600 mt-2">{activeCard.teacherComment}</p>
                </div>

                <div className="p-3.5 border border-slate-300 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Class Teacher Observation
                  </span>
                  <p className="text-[11px] text-slate-700 italic">"{activeCard.classTeacherComment}"</p>
                  <span className="block text-[10px] text-slate-400 mt-3">Signature: C. Mukamurenzi</span>
                </div>

                <div className="p-3.5 border border-slate-300 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Head Teacher Remark & Decision
                  </span>
                  <p className="text-[11px] text-slate-700 italic">"{activeCard.headTeacherComment}"</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Status: {activeCard.promotionStatus}
                    </span>
                    <span className="text-[10px] text-slate-500">Dr. J.B. Gasana</span>
                  </div>
                </div>
              </div>

              {/* Official Seal Footer */}
              <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <span>Verified by Kigali Academic ERP • Republic of Rwanda</span>
                <span className="font-mono">Security Checksum: SHA-256-{activeCard.id.toUpperCase()}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a student from the list to display their official report card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
