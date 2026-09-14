import React, { useState } from 'react';
import { ShieldCheck, Search, Download, History, Filter } from 'lucide-react';
import { AuditLog } from '../../types';
import { Language, translations } from '../../locales/translations';

interface AuditLogModuleProps {
  logs: AuditLog[];
  language: Language;
}

export const AuditLogModule: React.FC<AuditLogModuleProps> = ({ logs, language }) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());

    const matchesModule = filterModule === 'All' || log.module === filterModule;

    return matchesSearch && matchesModule;
  });

  const handleExport = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Module', 'Action', 'Details', 'Old Value', 'New Value', 'IP'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.userName,
      l.userRole,
      l.module,
      l.action,
      `"${l.details.replace(/"/g, '""')}"`,
      l.oldValue || '',
      l.newValue || '',
      l.ipAddress,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `System_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>System Activity & Marks Modification Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable security log recording all logins, score overrides (old vs new value), and fee receipts.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, module, or change description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
        >
          <option value="All">All Modules</option>
          <option value="Authentication">Authentication</option>
          <option value="Academic Marks">Academic Marks</option>
          <option value="Finance & Fees">Finance & Fees</option>
          <option value="Attendance">Attendance</option>
          <option value="System Setup">System Setup</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Module</th>
              <th className="py-3 px-4">Action & Log Details</th>
              <th className="py-3 px-4">Old / New Value Override</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-4 font-sans">
                  <strong className="text-slate-900 block">{log.userName}</strong>
                  <span className="text-[10px] text-slate-400">{log.userRole}</span>
                </td>
                <td className="py-3 px-4 font-sans">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {log.module}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans">
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{log.details}</p>
                </td>
                <td className="py-3 px-4">
                  {log.oldValue || log.newValue ? (
                    <div className="text-[11px] font-mono">
                      {log.oldValue && (
                        <span className="line-through text-rose-600 mr-2 font-bold">
                          {log.oldValue}
                        </span>
                      )}
                      {log.newValue && (
                        <span className="text-emerald-700 font-black">
                          → {log.newValue}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
