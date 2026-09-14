import React, { useState } from 'react';
import {
  ShieldAlert,
  HeartPulse,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { DisciplineRecord, MedicalRecord, Student } from '../../types';
import { Language, translations } from '../../locales/translations';

interface WelfareAndDisciplineProps {
  disciplineRecords: DisciplineRecord[];
  medicalRecords: MedicalRecord[];
  students: Student[];
  onAddDiscipline: (record: DisciplineRecord) => void;
  onAddMedical: (record: MedicalRecord) => void;
  language: Language;
}

export const WelfareAndDiscipline: React.FC<WelfareAndDisciplineProps> = ({
  disciplineRecords,
  medicalRecords,
  students,
  onAddDiscipline,
  onAddMedical,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'discipline' | 'health'>('discipline');
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Form states
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [incidentType, setIncidentType] = useState('Uniform Infraction');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Major'>('Minor');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  // Medical form state
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleCreateDiscipline = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    const record: DisciplineRecord = {
      id: `dsc-${Date.now()}`,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      className: st.className,
      incidentDate: new Date().toISOString().split('T')[0],
      incidentType,
      severity,
      description: description || 'Infraction noted during morning routine.',
      actionTaken: actionTaken || 'Counseling and verbal warning given.',
      reportedBy: 'Discipline Master',
      parentNotified: severity !== 'Minor',
      parentInformed: severity !== 'Minor',
      status: 'Open',
    };
    onAddDiscipline(record);
    setIsDisciplineModalOpen(false);
    setDescription('');
    setActionTaken('');
  };

  const handleCreateMedical = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    const med: MedicalRecord = {
      id: `med-${Date.now()}`,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: diagnosis || 'Mild headache and fatigue',
      diagnosis: diagnosis || 'Fatigue / Dehydration',
      treatment: treatment || 'Paracetamol & rest in sick bay',
      attendedBy: 'Nurse Alice Uwimana',
      parentContacted: false,
    };
    onAddMedical(med);
    setIsHealthModalOpen(false);
    setDiagnosis('');
    setTreatment('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <span>Student Welfare, Discipline & Health Clinic</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic pastoral care, behavior points, sick bay logs, and confidential health records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'discipline' ? (
            <button
              onClick={() => setIsDisciplineModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Discipline Incident</span>
            </button>
          ) : (
            <button
              onClick={() => setIsHealthModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Clinic Visit</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('discipline')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'discipline'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Discipline & Conduct Records
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'health'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          School Infirmary & Medical Visits
        </button>
      </div>

      {/* TAB 1: DISCIPLINE */}
      {activeTab === 'discipline' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Incident Type</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4">Description & Action Taken</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4 text-center">Parent Informed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disciplineRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <strong className="text-slate-900 block">{r.studentName}</strong>
                    <span className="text-[11px] text-slate-400">{r.className} • {r.incidentDate}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{r.incidentType}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.severity === 'Major'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : r.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800">{r.description}</p>
                    <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                      Action: {r.actionTaken}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.reportedBy}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.parentInformed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {r.parentInformed ? 'Yes (SMS Sent)' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: HEALTH CLINIC */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Visit Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Reported Symptoms</th>
                <th className="py-3 px-4">Clinical Diagnosis</th>
                <th className="py-3 px-4">Administered Treatment</th>
                <th className="py-3 px-4">Nurse in Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicalRecords.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-slate-500">{m.visitDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{m.studentName}</td>
                  <td className="py-3 px-4 text-slate-700">{m.symptoms}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{m.diagnosis}</td>
                  <td className="py-3 px-4 text-slate-800">{m.treatment}</td>
                  <td className="py-3 px-4 text-slate-600">{m.attendedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DISCIPLINE MODAL */}
      {isDisciplineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Discipline Incident</h3>
              <button onClick={() => setIsDisciplineModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscipline} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Type</label>
                <input
                  type="text"
                  required
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  placeholder="e.g. Late Arrival, Cell Phone in Dorm, Uniform"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Minor">Minor (Verbal reminder)</option>
                  <option value="Moderate">Moderate (Written warning)</option>
                  <option value="Major">Major (Parent summoned)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  placeholder="Provide objective facts of what occurred..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corrective Action Taken</label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g. Counseling, campus clean-up"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDisciplineModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white rounded-xl font-bold"
                >
                  Record Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEALTH MODAL */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Infirmary Visit</h3>
              <button onClick={() => setIsHealthModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateMedical} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Symptoms / Complaint</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Fever, stomachache, migraine"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Treatment Administered</label>
                <input
                  type="text"
                  required
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. Oral rehydration, Ibuprofen 200mg, rested 1 hr"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsHealthModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Clinic Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
