import React, { useState } from 'react';
import { School, Plus, Edit2, Users, CheckCircle2, X } from 'lucide-react';
import { ClassSection, EducationLevel } from '../../types';
import { Language, translations } from '../../locales/translations';

interface ClassSectionManagementProps {
  classes: ClassSection[];
  onAddClass: (cls: ClassSection) => void;
  language: Language;
}

export const ClassSectionManagement: React.FC<ClassSectionManagementProps> = ({
  classes,
  onAddClass,
  language,
}) => {
  const t = translations[language];
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<ClassSection>>({
    name: 'S2',
    educationLevel: 'O-Level',
    section: 'A',
    room: 'Main Block - Rm 5',
    classTeacherName: 'Jean Paul Habimana',
    capacity: 40,
    enrolledCount: 30,
  });

  const filtered = classes.filter(
    (c) => selectedLevel === 'All' || c.educationLevel === selectedLevel
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassSection = {
      id: `cls-${Date.now()}`,
      name: formData.name || 'New Class',
      educationLevel: (formData.educationLevel as EducationLevel) || 'O-Level',
      section: formData.section || 'A',
      room: formData.room || 'Room 1',
      classTeacherId: 'tch-001',
      classTeacherName: formData.classTeacherName || 'Teacher',
      capacity: Number(formData.capacity) || 40,
      enrolledCount: Number(formData.enrolledCount) || 0,
    };
    onAddClass(newClass);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-600" />
            <span>Classes & Stream Sections</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic structure spanning Nursery (Baby, Middle, Top), Primary (P1-P6), O-Level (S1-S3), and A-Level (S4-S6).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="All">All Levels</option>
            <option value="Nursery">Nursery / Pre-Primary</option>
            <option value="Primary">Primary</option>
            <option value="O-Level">O-Level (S1-S3)</option>
            <option value="A-Level">A-Level (S4-S6)</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Stream</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((cls) => (
          <div key={cls.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {cls.educationLevel}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">Sec {cls.section}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Location: {cls.room}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Class Teacher:</span>
                <strong className="text-slate-700">{cls.classTeacherName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enrolled:</span>
                <strong className="text-emerald-700 font-black">
                  {cls.enrolledCount} / {cls.capacity} students
                </strong>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${(cls.enrolledCount / cls.capacity) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Academic Class</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. S2, Middle Class, P4"
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
                  <option value="Nursery">Nursery / Pre-Primary</option>
                  <option value="Primary">Primary</option>
                  <option value="O-Level">O-Level</option>
                  <option value="A-Level">A-Level</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Teacher</label>
                <input
                  type="text"
                  value={formData.classTeacherName}
                  onChange={(e) => setFormData({ ...formData, classTeacherName: e.target.value })}
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
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
