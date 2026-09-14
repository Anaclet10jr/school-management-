import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Teacher } from '../../types';
import { Language, translations } from '../../locales/translations';

interface TeacherManagementProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  language: Language;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  onAddTeacher,
  language,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(teachers[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+250 788 ',
    department: 'Sciences',
    qualification: 'Bachelor in Education (REB Certified)',
    specialization: 'Physics & ICT',
    joiningDate: '2023-01-10',
    contractType: 'Permanent',
    weeklyPeriods: 24,
    status: 'Active',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
  });

  const filtered = teachers.filter(
    (tch) =>
      tch.firstName.toLowerCase().includes(search.toLowerCase()) ||
      tch.lastName.toLowerCase().includes(search.toLowerCase()) ||
      tch.department.toLowerCase().includes(search.toLowerCase()) ||
      tch.teacherId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = teachers.length + 1;
    const staffId = `TCH-2026-${String(nextNum).padStart(4, '0')}`;
    const name = `${formData.firstName || 'Teacher'} ${formData.lastName || 'Staff'}`.trim();
    const newTch: Teacher = {
      id: `tch-${Date.now()}`,
      staffId,
      teacherId: staffId,
      name,
      firstName: formData.firstName || 'Teacher',
      lastName: formData.lastName || 'Staff',
      gender: 'Male',
      dateOfBirth: '1988-05-12',
      email: formData.email || 'teacher@school.rw',
      phone: formData.phone || '+250 788 000 000',
      address: 'Kigali, Rwanda',
      department: formData.department || 'General',
      qualification: formData.qualification || 'Bachelor Degree',
      specialization: formData.specialization || 'Education',
      employmentDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      contractType: (formData.contractType as any) || 'Permanent',
      status: 'Active',
      assignedSubjectIds: ['sbj-mth-01'],
      assignedSubjects: ['Science'],
      assignedClassIds: ['cls-olevel-s1a'],
      assignedClasses: ['S1 A', 'S2 B'],
      weeklyLessons: Number(formData.weeklyPeriods) || 20,
      weeklyPeriods: Number(formData.weeklyPeriods) || 20,
      photo: formData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    };
    onAddTeacher(newTch);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>Academic Staff & Teacher Workload</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Teacher profiles, subject allocation, REB certification qualifications, and weekly period load.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Teacher / Staff</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teachers by name, ID, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl shadow-2xs outline-hidden focus:border-emerald-600"
            />
          </div>

          <div className="space-y-2.5">
            {filtered.map((tch) => {
              const isSelected = selectedTeacher?.id === tch.id;
              return (
                <div
                  key={tch.id}
                  onClick={() => setSelectedTeacher(tch)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tch.photo}
                      alt={tch.firstName}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {tch.firstName} {tch.lastName}
                        </h4>
                        <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                          {tch.teacherId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tch.department} Dept • {tch.weeklyPeriods} periods/wk
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                          {tch.specialization}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Detailed Profile & Workload */}
        <div className="lg:col-span-7">
          {selectedTeacher ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedTeacher.photo}
                    alt={selectedTeacher.firstName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedTeacher.specialization} • {selectedTeacher.qualification}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {selectedTeacher.department} Department
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {selectedTeacher.contractType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Staff Code
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {selectedTeacher.teacherId}
                  </span>
                </div>
              </div>

              {/* Workload Metric strip */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Teaching Workload Calculator
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Weekly Periods
                    </span>
                    <p className="text-xl font-black text-emerald-700 mt-1">
                      {selectedTeacher.weeklyPeriods}
                    </p>
                    <span className="text-[10px] text-slate-500">Max limit: 28</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Classes Handled
                    </span>
                    <p className="text-xl font-black text-slate-800 mt-1">
                      {selectedTeacher.assignedClasses.length}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {selectedTeacher.assignedClasses.join(', ')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Subjects Assigned
                    </span>
                    <p className="text-xl font-black text-slate-800 mt-1">
                      {selectedTeacher.assignedSubjects.length}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {selectedTeacher.assignedSubjects.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Contact & Personnel Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Phone Number</span>
                    <span className="font-semibold text-slate-800">{selectedTeacher.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Official Email</span>
                    <span className="font-semibold text-slate-800">{selectedTeacher.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Joining Date</span>
                    <span className="font-semibold text-slate-800">{selectedTeacher.joiningDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status</span>
                    <span className="font-semibold text-emerald-700">{selectedTeacher.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a teacher to view details.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Academic Teacher</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Sciences, Languages, Humanities"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualification (REB)</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. Bachelor of Science with Education"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    value={formData.weeklyPeriods}
                    onChange={(e) => setFormData({ ...formData, weeklyPeriods: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
