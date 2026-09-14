import React, { useState } from 'react';
import { BookOpen, Plus, Search, CheckCircle2, X } from 'lucide-react';
import { Subject, EducationLevel } from '../../types';
import { Language, translations } from '../../locales/translations';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  language: Language;
}

export const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onAddSubject,
  language,
}) => {
  const t = translations[language];
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Subject>>({
    code: 'GEO-01',
    name: 'Geography',
    educationLevel: 'O-Level',
    isCore: true,
    creditHours: 3,
    teacherName: 'Jean Claude Bizimana',
  });

  const filtered = subjects.filter(
    (s) => selectedLevel === 'All' || s.educationLevel === selectedLevel
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: `sbj-${Date.now()}`,
      code: formData.code || 'SBJ',
      name: formData.name || 'New Subject',
      educationLevel: (formData.educationLevel as EducationLevel) || 'O-Level',
      category: formData.isCore ? 'Core' : 'Elective',
      credits: Number(formData.creditHours) || 3,
      status: 'Active',
      isCore: formData.isCore ?? true,
    };
    onAddSubject(newSubject);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Curriculum Subjects & Syllabi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            REB (Rwanda Basic Education Board) aligned subject directory across all education tiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="All">All Education Levels</option>
            <option value="Nursery">Nursery</option>
            <option value="Primary">Primary</option>
            <option value="O-Level">O-Level</option>
            <option value="A-Level">A-Level</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Subject Code & Name</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Weekly Periods</th>
              <th className="py-3 px-4">Lead Teacher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {s.code}
                    </span>
                    <strong className="text-slate-900 text-xs">{s.name}</strong>
                  </div>
                </td>
                <td className="py-3 px-4">{s.educationLevel}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.isCore
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.isCore ? 'Core Curriculum' : 'Elective'}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">{s.creditHours} periods / wk</td>
                <td className="py-3 px-4 font-medium text-slate-800">{s.teacherName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Subject</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="O-Level">O-Level</option>
                  <option value="A-Level">A-Level</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Weekly Periods</label>
                <input
                  type="number"
                  value={formData.creditHours}
                  onChange={(e) => setFormData({ ...formData, creditHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
