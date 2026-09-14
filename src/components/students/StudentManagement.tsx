import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  GraduationCap,
} from 'lucide-react';
import { Student, EducationLevel, StudentStatus } from '../../types';
import { Language, translations } from '../../locales/translations';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  language: Language;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  language,
}) => {
  const t = translations[language];

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals & Drawers
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Female',
    dateOfBirth: '2010-01-01',
    nationality: 'Rwandan',
    address: 'Kigali, Rwanda',
    educationLevel: 'O-Level',
    className: 'S1 A',
    section: 'A',
    category: 'Day',
    academicYear: '2025-2026',
    admissionDate: new Date().toISOString().split('T')[0],
    attendanceRate: 95,
    feeBalance: 0,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
    guardians: [
      {
        id: 'grd-new',
        name: '',
        relationship: 'Parent',
        phone: '+250 788 ',
        email: '',
        address: 'Kigali',
        occupation: 'Professional',
        emergencyContact: true,
      },
    ],
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.guardians[0]?.phone && s.guardians[0].phone.includes(search));

    const matchesLevel = selectedLevel === 'All' || s.educationLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const nextNum = students.length + 1;
    const padded = String(nextNum).padStart(5, '0');
    setFormData({
      id: `stu-${Date.now()}`,
      studentId: `SCH-2026-${padded}`,
      admissionNumber: `ADM-2026-${String(nextNum).padStart(4, '0')}`,
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'Female',
      dateOfBirth: '2011-05-10',
      nationality: 'Rwandan',
      address: 'Gasabo, Kigali',
      status: 'Active',
      educationLevel: 'O-Level',
      classId: 'cls-olevel-s1a',
      className: 'S1 A',
      section: 'A',
      academicYear: '2025-2026',
      admissionDate: new Date().toISOString().split('T')[0],
      category: 'Day',
      attendanceRate: 98,
      feeBalance: 0,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      guardians: [
        {
          id: `grd-${Date.now()}`,
          name: '',
          relationship: 'Parent',
          phone: '+250 788 111 222',
          email: '',
          address: 'Kigali',
          occupation: 'Civil Servant',
          emergencyContact: true,
        },
      ],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (st: Student) => {
    setIsEditMode(true);
    setFormData({ ...st });
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    if (isEditMode) {
      onUpdateStudent(formData as Student);
    } else {
      onAddStudent(formData as Student);
    }
    setIsAddModalOpen(false);
  };

  // CSV Export helper
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Admission No', 'First Name', 'Last Name', 'Level', 'Class', 'Category', 'Fee Balance (RWF)', 'Attendance %'];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      s.admissionNumber,
      s.firstName,
      s.lastName,
      s.educationLevel,
      s.className,
      s.category,
      s.feeBalance,
      `${s.attendanceRate}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_List_${selectedLevel}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Student Information Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive learner records across Nursery, Primary, O-Level, and A-Level.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCSV}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newStudent}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student ID, name, admission number, or guardian phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-emerald-600 outline-hidden"
          >
            <option value="All">All Education Levels</option>
            <option value="Nursery">Nursery / Pre-Primary</option>
            <option value="Primary">Primary (P1-P6)</option>
            <option value="O-Level">O-Level (S1-S3)</option>
            <option value="A-Level">A-Level (S4-S6)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:border-emerald-600 outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Class & Level</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Fee Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.firstName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {st.firstName} {st.middleName ? st.middleName + ' ' : ''}{st.lastName}
                          </p>
                          <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                            {st.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{st.className}</span>
                      <span className="text-[10px] text-slate-400 block">{st.educationLevel}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.category === 'Boarding'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {st.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {st.guardians[0] ? (
                        <div>
                          <p className="font-semibold text-slate-800">{st.guardians[0].name}</p>
                          <p className="text-[11px] text-slate-500">{st.guardians[0].phone}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">No guardian</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          st.attendanceRate >= 90
                            ? 'bg-emerald-50 text-emerald-700'
                            : st.attendanceRate >= 80
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {st.attendanceRate}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-semibold">
                      {st.feeBalance > 0 ? (
                        <span className="text-rose-600 font-bold">
                          RWF {st.feeBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Paid in Full</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(st.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.firstName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedStudent.studentId}
                    </span>
                    <span className="text-xs text-slate-500">• {selectedStudent.className}</span>
                    <span className="text-xs text-slate-500">• {selectedStudent.category}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gender</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nationality</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.nationality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Residential Address</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Enrolment Date</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.admissionDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Admission Number</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.admissionNumber}</span>
                  </div>
                </div>
              </div>

              {/* Guardians Information */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Parent / Guardian Information
                </h4>
                {selectedStudent.guardians.map((g, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{g.name}</p>
                      <p className="text-xs text-slate-500">
                        {g.relationship} • {g.occupation}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-semibold text-slate-800">{g.phone}</p>
                      <p className="text-slate-400">{g.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Health & Medical */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Health & Medical Notes
                </h4>
                <p className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  {selectedStudent.medicalNotes || 'No chronic health issues reported.'}
                  {selectedStudent.allergies && (
                    <span className="block font-semibold text-amber-800 mt-1">
                      Allergies: {selectedStudent.allergies}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 rounded-b-3xl">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? 'Edit Student Details' : 'Register New Student (Rwanda SMS)'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName || ''}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={formData.educationLevel || 'O-Level'}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  >
                    <option value="Nursery">Nursery / Pre-Primary</option>
                    <option value="Primary">Primary</option>
                    <option value="O-Level">O-Level (Lower Secondary)</option>
                    <option value="A-Level">A-Level (Upper Secondary)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class & Section</label>
                  <input
                    type="text"
                    value={formData.className || ''}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="e.g. S1 A, P6 A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'Day'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  >
                    <option value="Day">Day Scholar</option>
                    <option value="Boarding">Boarding Student</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Balance (RWF)</label>
                  <input
                    type="number"
                    value={formData.feeBalance || 0}
                    onChange={(e) => setFormData({ ...formData, feeBalance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Primary Guardian Inputs */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Primary Parent / Guardian</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Guardian Name</label>
                    <input
                      type="text"
                      value={formData.guardians?.[0]?.name || ''}
                      onChange={(e) => {
                        const cur = formData.guardians || [{} as any];
                        cur[0] = { ...cur[0], name: e.target.value };
                        setFormData({ ...formData, guardians: cur });
                      }}
                      placeholder="e.g. Jean Gasana"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Guardian Phone (Rwanda)</label>
                    <input
                      type="text"
                      value={formData.guardians?.[0]?.phone || ''}
                      onChange={(e) => {
                        const cur = formData.guardians || [{} as any];
                        cur[0] = { ...cur[0], phone: e.target.value };
                        setFormData({ ...formData, guardians: cur });
                      }}
                      placeholder="+250 788 123 456"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  {isEditMode ? 'Update Record' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
