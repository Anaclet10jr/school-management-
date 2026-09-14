import React, { useState } from 'react';
import { Bell, Plus, Send, Calendar, CheckCircle2, X } from 'lucide-react';
import { Announcement } from '../../types';
import { Language, translations } from '../../locales/translations';

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  language: Language;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcements,
  onAddAnnouncement,
  language,
}) => {
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Teachers' | 'Parents' | 'Students'>('All');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      publishedDate: new Date().toISOString().split('T')[0],
      targetAudience,
      author: 'School Administration',
      priority: isUrgent ? 'Urgent' : 'Normal',
      isUrgent,
    };
    onAddAnnouncement(ann);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>School Announcements & Parent Communications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official administrative notices to parents, teachers, and students via app alerts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white p-6 rounded-2xl border transition-all ${
              ann.isUrgent
                ? 'border-amber-300 bg-amber-50/20 shadow-xs ring-1 ring-amber-200'
                : 'border-slate-200/80 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {ann.isUrgent && (
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      High Priority
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Audience: {ann.targetAudience}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {ann.publishedDate} by {ann.author}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{ann.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Official Announcement</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End of Term Parent-Teacher Meeting"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="All">All School Community</option>
                  <option value="Parents">Parents Only</option>
                  <option value="Teachers">Teachers & Academic Staff Only</option>
                  <option value="Students">Students Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Details</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter notice text..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="urgent" className="font-semibold text-slate-700">
                  Mark as High-Priority Notice
                </label>
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
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
