import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Search,
  Filter,
  Users,
  Check,
  TrendingUp,
  Download,
  Printer,
  Wand2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Student, Subject, ClassSection, MarkEntry, GradingScale } from '../../types';
import { Language, translations } from '../../locales/translations';

interface ExamMarkManagementProps {
  students: Student[];
  subjects: Subject[];
  classes: ClassSection[];
  marks: MarkEntry[];
  gradingScales: GradingScale[];
  onSaveMark: (mark: MarkEntry) => void;
  language: Language;
}

export const ExamMarkManagement: React.FC<ExamMarkManagementProps> = ({
  students,
  subjects,
  classes,
  marks,
  gradingScales,
  onSaveMark,
  language,
}) => {
  const t = translations[language];

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'entry' | 'ledger'>('entry');

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || 'cls-olevel-s1a');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || 'sbj-mth');
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 2');
  const [isCompetencyMode, setIsCompetencyMode] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Search in ledger
  const [searchLedger, setSearchLedger] = useState('');
  const [ledgerClassFilter, setLedgerClassFilter] = useState('All');
  const [ledgerTermFilter, setLedgerTermFilter] = useState('All');

  // Selected subject & class details
  const activeSubject = subjects.find((s) => s.id === selectedSubject) || subjects[0];
  const activeClass = classes.find((c) => c.id === selectedClass) || classes[0];

  // Students matching the selected class
  const classStudents = useMemo(() => {
    const matching = students.filter(
      (s) => s.classId === selectedClass || s.className === activeClass?.name
    );
    return matching.length > 0 ? matching : students.slice(0, 8);
  }, [students, selectedClass, activeClass]);

  // Local table state for mark entries
  const [localMarks, setLocalMarks] = useState<{
    [studentId: string]: {
      cat1: number;
      cat2: number;
      exam: number;
      remark: string;
      competency: string;
    };
  }>({});

  // Synchronize localMarks whenever selectedClass, selectedSubject, selectedTerm, or marks prop changes
  useEffect(() => {
    const map: {
      [studentId: string]: {
        cat1: number;
        cat2: number;
        exam: number;
        remark: string;
        competency: string;
      };
    } = {};

    classStudents.forEach((st) => {
      const existing = marks.find(
        (m) =>
          (m.studentId === st.id || m.studentCode === st.studentId) &&
          (m.subjectId === selectedSubject || m.subjectName === activeSubject?.name) &&
          m.term === selectedTerm
      );

      if (existing) {
        map[st.id] = {
          cat1: existing.cat1,
          cat2: existing.cat2,
          exam: existing.exam,
          remark: existing.teacherRemark || 'Demonstrating steady academic improvement.',
          competency: existing.total >= 80 ? 'Excellent' : existing.total >= 60 ? 'Very Good' : 'Developing',
        };
      } else {
        map[st.id] = {
          cat1: 15,
          cat2: 16,
          exam: 46,
          remark: 'Good participation and class effort.',
          competency: 'Very Good',
        };
      }
    });

    setLocalMarks(map);
  }, [selectedClass, selectedSubject, selectedTerm, classStudents, marks, activeSubject]);

  const calculateGrade = (total: number): { grade: string; remark: string } => {
    const scale = gradingScales.find((g) => total >= g.minScore && total <= g.maxScore);
    if (scale) {
      return { grade: scale.grade, remark: scale.remark };
    }
    if (total >= 80) return { grade: 'A', remark: 'Excellent' };
    if (total >= 70) return { grade: 'B', remark: 'Very Good' };
    if (total >= 60) return { grade: 'C', remark: 'Good' };
    if (total >= 50) return { grade: 'D', remark: 'Satisfactory' };
    if (total >= 40) return { grade: 'E', remark: 'Pass' };
    return { grade: 'F', remark: 'Needs Improvement' };
  };

  const handleScoreChange = (
    studentId: string,
    field: 'cat1' | 'cat2' | 'exam' | 'remark' | 'competency',
    val: any
  ) => {
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { cat1: 0, cat2: 0, exam: 0, remark: '', competency: 'Very Good' }),
        [field]: val,
      },
    }));
  };

  const handleSaveAll = () => {
    classStudents.forEach((st) => {
      const entry = localMarks[st.id] || { cat1: 0, cat2: 0, exam: 0, remark: '' };
      const cat1 = Math.min(20, Math.max(0, Number(entry.cat1) || 0));
      const cat2 = Math.min(20, Math.max(0, Number(entry.cat2) || 0));
      const exam = Math.min(60, Math.max(0, Number(entry.exam) || 0));
      const total = cat1 + cat2 + exam;
      const { grade, remark } = calculateGrade(total);

      const markRecord: MarkEntry = {
        id: `mrk-${st.id}-${selectedSubject}-${selectedTerm}`,
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        studentCode: st.studentId,
        classId: selectedClass,
        subjectId: selectedSubject,
        subjectName: activeSubject?.name || 'Mathematics',
        term: selectedTerm,
        academicYear: '2025-2026',
        cat1,
        cat2,
        exam,
        total,
        percentage: total,
        grade,
        teacherRemark: entry.remark || remark,
        submitted: true,
        approved: true,
        published: true,
      };

      onSaveMark(markRecord);
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Quick populate sample marks
  const handleQuickPopulate = () => {
    classStudents.forEach((st, idx) => {
      const baseScore = 70 + ((idx * 7) % 25);
      const cat1 = Math.min(20, Math.round((baseScore / 100) * 20));
      const cat2 = Math.min(20, Math.round((baseScore / 100) * 20));
      const exam = Math.min(60, baseScore - cat1 - cat2);
      const total = cat1 + cat2 + exam;
      const { grade, remark } = calculateGrade(total);

      onSaveMark({
        id: `mrk-${st.id}-${selectedSubject}-${selectedTerm}`,
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        studentCode: st.studentId,
        classId: selectedClass,
        subjectId: selectedSubject,
        subjectName: activeSubject?.name || 'Mathematics',
        term: selectedTerm,
        academicYear: '2025-2026',
        cat1,
        cat2,
        exam,
        total,
        percentage: total,
        grade,
        teacherRemark: remark,
        submitted: true,
        approved: true,
        published: true,
      });
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Performance calculations for the current view
  const currentClassStats = useMemo(() => {
    const scores = classStudents.map((st) => {
      const entry = localMarks[st.id];
      if (!entry) return 0;
      return (Number(entry.cat1) || 0) + (Number(entry.cat2) || 0) + (Number(entry.exam) || 0);
    });

    if (scores.length === 0) return { avg: 0, high: 0, passRate: 0 };

    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / scores.length);
    const high = Math.max(...scores);
    const passCount = scores.filter((s) => s >= 50).length;
    const passRate = Math.round((passCount / scores.length) * 100);

    return { avg, high, passRate };
  }, [classStudents, localMarks]);

  // Ledger filtered marks
  const ledgerMarks = useMemo(() => {
    return marks.filter((m) => {
      const matchesSearch =
        m.studentName.toLowerCase().includes(searchLedger.toLowerCase()) ||
        m.subjectName.toLowerCase().includes(searchLedger.toLowerCase()) ||
        (m.studentCode && m.studentCode.toLowerCase().includes(searchLedger.toLowerCase()));

      const matchesClass = ledgerClassFilter === 'All' || m.classId === ledgerClassFilter;
      const matchesTerm = ledgerTermFilter === 'All' || m.term === ledgerTermFilter;

      return matchesSearch && matchesClass && matchesTerm;
    });
  }, [marks, searchLedger, ledgerClassFilter, ledgerTermFilter]);

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Examinations, Bulk Marks & Academic Grading</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {marks.length} Records Saved
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rwandan Competence-Based Curriculum (CBC) assessment framework with automated CAT1, CAT2, and Final Exam grading.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('entry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'entry'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Spreadsheet Entry</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Marks Ledger ({marks.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'entry' ? (
        <>
          {/* Controls Bar for Spreadsheet Entry */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Class Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    const isNurseryOrPri = e.target.value.includes('nur') || e.target.value.includes('pri');
                    setIsCompetencyMode(isNurseryOrPri);
                  }}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.educationLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {subjects.map((sbj) => (
                    <option key={sbj.id} value={sbj.id}>
                      {sbj.name} ({sbj.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Term Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                  Academic Term
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value as any)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickPopulate}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Populate realistic scores for this class and subject"
              >
                <Wand2 className="w-4 h-4 text-amber-600" />
                <span>Auto-Fill Samples</span>
              </button>

              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Marks</span>
              </button>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Class Average</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{currentClassStats.avg}%</p>
              </div>
              <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Highest Score</span>
                <p className="text-xl font-black text-emerald-700 mt-0.5">{currentClassStats.high}%</p>
              </div>
              <span className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                <Award className="w-4 h-4 text-emerald-600" />
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pass Rate</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{currentClassStats.passRate}%</p>
              </div>
              <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Enrolled Students</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{classStudents.length} Students</p>
              </div>
              <span className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                <Users className="w-4 h-4 text-slate-600" />
              </span>
            </div>
          </div>

          {/* Grading Scale Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-xs font-bold text-emerald-950">Active REB Scale:</span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {gradingScales.map((scale) => (
                  <span
                    key={scale.id}
                    className="px-2 py-0.5 bg-white border border-emerald-200 rounded-md font-bold text-slate-700"
                  >
                    {scale.grade}: {scale.minScore}-{scale.maxScore}%
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCompetencyMode(!isCompetencyMode)}
              className="text-xs font-bold text-emerald-800 hover:underline self-start md:self-auto cursor-pointer"
            >
              Switch to {isCompetencyMode ? 'Numeric (CAT/Exam)' : 'Competency-Based (Nursery/Primary)'}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Marks successfully saved, grades updated, and audit log recorded!</span>
            </div>
          )}

          {/* Bulk Mark Entry Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    {isCompetencyMode ? (
                      <>
                        <th className="py-3 px-4 text-center">Competency Evaluation</th>
                        <th className="py-3 px-4">Developmental Remarks</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4 text-center w-24">CAT 1 (/20)</th>
                        <th className="py-3 px-4 text-center w-24">CAT 2 (/20)</th>
                        <th className="py-3 px-4 text-center w-24">Exam (/60)</th>
                        <th className="py-3 px-4 text-center w-24">Total (/100)</th>
                        <th className="py-3 px-4 text-center w-20">Grade</th>
                        <th className="py-3 px-4">Teacher Remark</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st) => {
                    const entry = localMarks[st.id] || {
                      cat1: 0,
                      cat2: 0,
                      exam: 0,
                      remark: '',
                      competency: 'Very Good',
                    };
                    const total = (Number(entry.cat1) || 0) + (Number(entry.cat2) || 0) + (Number(entry.exam) || 0);
                    const { grade } = calculateGrade(total);

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.photo}
                              alt={st.firstName}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">
                                {st.firstName} {st.lastName}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400">
                                {st.studentId} • {st.className}
                              </span>
                            </div>
                          </div>
                        </td>

                        {isCompetencyMode ? (
                          <>
                            <td className="py-3 px-4 text-center">
                              <select
                                value={entry.competency || 'Very Good'}
                                onChange={(e) => handleScoreChange(st.id, 'competency', e.target.value)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50"
                              >
                                <option value="Excellent">Excellent</option>
                                <option value="Very Good">Very Good</option>
                                <option value="Good">Good</option>
                                <option value="Developing">Developing</option>
                                <option value="Needs Improvement">Needs Improvement</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={entry.remark}
                                onChange={(e) => handleScoreChange(st.id, 'remark', e.target.value)}
                                placeholder="Observations on social skills, numeracy, participation..."
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={entry.cat1}
                                onChange={(e) =>
                                  handleScoreChange(st.id, 'cat1', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:bg-white"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={entry.cat2}
                                onChange={(e) =>
                                  handleScoreChange(st.id, 'cat2', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:bg-white"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={60}
                                value={entry.exam}
                                onChange={(e) =>
                                  handleScoreChange(st.id, 'exam', Number(e.target.value))
                                }
                                className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-800 focus:bg-white"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm font-black text-slate-900">{total}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                                  grade === 'A'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : grade === 'B'
                                    ? 'bg-blue-100 text-blue-800'
                                    : grade === 'C'
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {grade}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={entry.remark}
                                onChange={(e) => handleScoreChange(st.id, 'remark', e.target.value)}
                                placeholder="Teacher remarks..."
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ALL MARKS LEDGER VIEW */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                placeholder="Search by student, ID, subject..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ledgerClassFilter}
                onChange={(e) => setLedgerClassFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="All">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={ledgerTermFilter}
                onChange={(e) => setLedgerTermFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="All">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4 text-center">CAT 1</th>
                    <th className="py-3 px-4 text-center">CAT 2</th>
                    <th className="py-3 px-4 text-center">Exam</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4">Teacher Remark</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerMarks.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{m.studentName}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {m.studentCode || m.studentId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{m.subjectName}</td>
                      <td className="py-3 px-4 text-slate-600">{m.term}</td>
                      <td className="py-3 px-4 text-center font-mono">{m.cat1}/20</td>
                      <td className="py-3 px-4 text-center font-mono">{m.cat2}/20</td>
                      <td className="py-3 px-4 text-center font-mono">{m.exam}/60</td>
                      <td className="py-3 px-4 text-center font-black text-slate-900">{m.total}%</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-black ${
                            m.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.grade === 'B'
                              ? 'bg-blue-100 text-blue-800'
                              : m.grade === 'C'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {m.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{m.teacherRemark}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Approved & Published
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
