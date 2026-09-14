import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  X,
  Award,
} from 'lucide-react';
import { Assignment, ClassSection, Subject, Teacher } from '../../types';
import { Language, translations } from '../../locales/translations';

interface AssignmentsModuleProps {
  assignments: Assignment[];
  classes: ClassSection[];
  subjects: Subject[];
  teachers: Teacher[];
  onAddAssignment: (assignment: Assignment) => void;
  language: Language;
}

export const AssignmentsModule: React.FC<AssignmentsModuleProps> = ({
  assignments,
  classes,
  subjects,
  teachers,
  onAddAssignment,
  language,
}) => {
  const t = translations[language];

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'cls-olevel-s1a');
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || 'Mathematics');
  const [teacherName, setTeacherName] = useState(teachers[0]?.name || 'Staff Member');
  const [dueDate, setDueDate] = useState('2026-03-25');
  const [totalPoints, setTotalPoints] = useState(20);

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      a.className.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || a.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedClassObj = classes.find((c) => c.id === classId);

    const newAssignment: Assignment = {
      id: `asn-${Date.now()}`,
      title,
      description,
      classId,
      className: selectedClassObj?.name || 'S1 A',
      subjectName,
      teacherName,
      dueDate,
      totalPoints,
      submissionCount: 0,
    };

    onAddAssignment(newAssignment);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BookMarked className="w-4 h-4" />
            <span>Academic Curriculum</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {t.assignments} (Homework & Coursework)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish syllabus coursework, manage deadlines, and evaluate student submissions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coursework by title, subject or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-emerald-500 focus:bg-white"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.educationLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200/80 text-center">
            <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No coursework assignments found</p>
            <p className="text-xs text-slate-400 mt-1">Create an assignment to distribute tasks to students.</p>
          </div>
        ) : (
          filteredAssignments.map((asn) => (
            <div
              key={asn.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    {asn.subjectName}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {asn.className}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">
                  {asn.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {asn.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: <strong className="text-slate-700 font-semibold">{asn.dueDate}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    {asn.totalPoints} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Instructor: {asn.teacherName}</span>
                  <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    {asn.submissionCount} Submissions
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create New Coursework Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Optics Practical Problem Set"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class Section
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.educationLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Task Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the homework questions, syllabus references, or guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Marks / Points
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Instructor
                </label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.primarySubject || 'Teacher'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Publish Coursework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
