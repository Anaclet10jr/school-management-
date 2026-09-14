import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { AdmissionApplication, Student } from '../../types';
import { Language, translations } from '../../locales/translations';

interface AdmissionsModuleProps {
  applications: AdmissionApplication[];
  onApproveApplication: (app: AdmissionApplication) => void;
  onRejectApplication: (id: string) => void;
  language: Language;
}

export const AdmissionsModule: React.FC<AdmissionsModuleProps> = ({
  applications,
  onApproveApplication,
  onRejectApplication,
  language,
}) => {
  const t = translations[language];
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  const filtered = applications.filter(
    (a) => filterStatus === 'All' || a.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <span>Admissions & Enrollment Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Process candidate applications, documents, interview reviews, and automated student ID creation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
          >
            <option value="All">All Application Stages</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Enrolled">Enrolled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Application #</th>
              <th className="py-3 px-4">Candidate Name</th>
              <th className="py-3 px-4">Applying For</th>
              <th className="py-3 px-4">Parent / Contact</th>
              <th className="py-3 px-4">Previous School</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Decision Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                  {app.applicationNumber}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-900">
                    {app.firstName} {app.lastName}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{app.gender} • {app.category}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-800">{app.appliedClass}</span>
                  <span className="text-[10px] text-slate-400 block">{app.educationLevel}</span>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-800">{app.parentName}</p>
                  <p className="text-[11px] text-slate-500">{app.parentPhone}</p>
                </td>
                <td className="py-3 px-4 text-slate-600">{app.previousSchool || 'First Enrollment'}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'Enrolled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {app.status === 'Under Review' ? (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onApproveApplication(app)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px]"
                      >
                        Approve & Enroll
                      </button>
                      <button
                        onClick={() => onRejectApplication(app.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg font-bold text-[10px]"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
