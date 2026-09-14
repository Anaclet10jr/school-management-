import React, { useState, useMemo } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Coffee,
  Utensils,
  Search,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  GraduationCap,
  Layers,
  Filter,
  Eye,
} from 'lucide-react';
import { TimetablePeriod, ClassSection, Teacher, Subject } from '../../types';

export interface TimeSlotConfig {
  label: string;
  isBreak: boolean;
  start?: string;
  end?: string;
  title?: string;
}

interface TimetableCalendarViewProps {
  periods: TimetablePeriod[];
  allPeriods: TimetablePeriod[];
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>;
  timeSlots: TimeSlotConfig[];
  viewMode: 'class' | 'teacher' | 'room';
  selectedTargetName: string;
  selectedSubtext: string;
  onAddSlot: (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday', slotLabel: string) => void;
  onEditPeriod: (period: TimetablePeriod) => void;
  onDeletePeriod: (id: string) => void;
}

// Helper to determine subject styling
function getSubjectTheme(subjectName: string = '') {
  const s = subjectName.toLowerCase();
  if (s.includes('math')) {
    return {
      bg: 'bg-indigo-50/95',
      border: 'border-indigo-200 hover:border-indigo-300',
      text: 'text-indigo-950',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      accent: 'border-l-4 border-l-indigo-600',
      category: 'Mathematics',
    };
  }
  if (s.includes('physic') || s.includes('chem') || s.includes('bio') || s.includes('science')) {
    return {
      bg: 'bg-teal-50/95',
      border: 'border-teal-200 hover:border-teal-300',
      text: 'text-teal-950',
      badgeBg: 'bg-teal-100 text-teal-800',
      accent: 'border-l-4 border-l-teal-600',
      category: 'Sciences',
    };
  }
  if (s.includes('ict') || s.includes('comput')) {
    return {
      bg: 'bg-purple-50/95',
      border: 'border-purple-200 hover:border-purple-300',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-100 text-purple-800',
      accent: 'border-l-4 border-l-purple-600',
      category: 'Technology',
    };
  }
  if (s.includes('eng') || s.includes('french') || s.includes('kinyarwanda') || s.includes('lit')) {
    return {
      bg: 'bg-amber-50/95',
      border: 'border-amber-200 hover:border-amber-300',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-800',
      accent: 'border-l-4 border-l-amber-600',
      category: 'Languages',
    };
  }
  if (s.includes('history') || s.includes('geo') || s.includes('citizen') || s.includes('social')) {
    return {
      bg: 'bg-rose-50/95',
      border: 'border-rose-200 hover:border-rose-300',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-100 text-rose-800',
      accent: 'border-l-4 border-l-rose-600',
      category: 'Humanities',
    };
  }
  if (s.includes('sport') || s.includes('pe') || s.includes('physical')) {
    return {
      bg: 'bg-emerald-50/95',
      border: 'border-emerald-200 hover:border-emerald-300',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      accent: 'border-l-4 border-l-emerald-600',
      category: 'Physical Ed',
    };
  }
  return {
    bg: 'bg-slate-50/95',
    border: 'border-slate-200 hover:border-slate-300',
    text: 'text-slate-900',
    badgeBg: 'bg-slate-100 text-slate-700',
    accent: 'border-l-4 border-l-emerald-700',
    category: 'General',
  };
}

export const TimetableCalendarView: React.FC<TimetableCalendarViewProps> = ({
  periods,
  allPeriods,
  days,
  timeSlots,
  viewMode,
  selectedTargetName,
  selectedSubtext,
  onAddSlot,
  onEditPeriod,
  onDeletePeriod,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<'ALL' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Determine current day of week (for Rwanda Kigali context)
  const currentDayName = useMemo(() => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return map[dayIndex] || 'Monday';
  }, []);

  // Filter visible periods
  const visibleDays = useMemo(() => {
    if (selectedDayFilter === 'ALL') return days;
    return [selectedDayFilter];
  }, [selectedDayFilter, days]);

  // Find period matching day and time slot
  const findPeriod = (day: string, slotLabel: string) => {
    const [slotStart] = slotLabel.split(' - ');
    return periods.find((p) => {
      if (p.day !== day) return false;
      if (p.timeSlot === slotLabel) return true;
      if (p.startTime === slotStart) return true;
      if (p.timeSlot && p.timeSlot.includes(slotStart)) return true;
      return false;
    });
  };

  // Day period counts
  const dayPeriodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    days.forEach((d) => {
      counts[d] = periods.filter((p) => p.day === d).length;
    });
    return counts;
  }, [periods, days]);

  // Filtered by search / category
  const isPeriodHighlighted = (period?: TimetablePeriod) => {
    if (!period) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = period.subjectName?.toLowerCase().includes(q);
      const matchTeacher = period.teacherName?.toLowerCase().includes(q);
      const matchRoom = period.room?.toLowerCase().includes(q);
      const matchClass = period.className?.toLowerCase().includes(q);
      if (!matchName && !matchTeacher && !matchRoom && !matchClass) return false;
    }
    if (categoryFilter !== 'ALL') {
      const theme = getSubjectTheme(period.subjectName);
      if (theme.category !== categoryFilter) return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Calendar Toolbar & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          {/* Day View Selector Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setSelectedDayFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDayFilter === 'ALL'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Week
            </button>
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDayFilter(d)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  selectedDayFilter === d
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{d.slice(0, 3)}</span>
                {d === currentDayName && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>

          {/* Category Filter Chips */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-slate-600 border-l border-slate-200 pl-3">
            <span className="text-slate-400">Filter:</span>
            {['ALL', 'Mathematics', 'Sciences', 'Languages', 'Technology', 'Humanities'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject, teacher, room..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Calendar Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {selectedTargetName}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {viewMode === 'class' ? 'Class Calendar' : viewMode === 'teacher' ? 'Faculty Schedule' : 'Facility Bookings'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {selectedSubtext} • {periods.length} Scheduled Lessons ({periods.length * 45} mins total contact time)
            </p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300 overflow-x-auto py-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Math
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" /> Sciences
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Languages
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> ICT
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Humanities
          </span>
        </div>
      </div>

      {/* Main Dynamic Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="min-w-[780px] grid"
            style={{
              gridTemplateColumns:
                visibleDays.length === 1
                  ? '90px 1fr'
                  : `90px repeat(${visibleDays.length}, minmax(180px, 1fr))`,
            }}
          >
            {/* Header: Time Column Label */}
            <div className="p-3.5 bg-slate-100/90 border-b border-r border-slate-200 font-bold text-slate-700 text-xs flex flex-col justify-center items-center">
              <Clock className="w-4 h-4 text-slate-500 mb-1" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Period</span>
            </div>

            {/* Header: Day Columns */}
            {visibleDays.map((day) => {
              const isToday = day === currentDayName;
              const count = dayPeriodCounts[day] || 0;

              return (
                <div
                  key={day}
                  className={`p-3 border-b border-r border-slate-200 last:border-r-0 flex items-center justify-between transition-colors ${
                    isToday ? 'bg-emerald-50/70 border-b-2 border-b-emerald-600' : 'bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${isToday ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white tracking-wide">
                          TODAY
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {count} {count === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddSlot(day, '08:00 - 08:45')}
                    className="p-1 rounded-lg bg-white hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200/80 text-slate-500 transition-colors shadow-2xs cursor-pointer"
                    title={`Add lesson on ${day}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Time Slot Rows */}
            {timeSlots.map((slot, slotIdx) => {
              const isBreak = slot.isBreak;
              const periodNumber =
                slotIdx < 3 ? slotIdx + 1 : slotIdx < 6 ? slotIdx : slotIdx - 1;

              // Break Row Component
              if (isBreak) {
                return (
                  <React.Fragment key={`break-${slotIdx}`}>
                    {/* Time Label */}
                    <div className="p-2.5 bg-amber-50/60 border-b border-r border-slate-200 font-mono text-[10px] font-bold text-amber-900 flex flex-col justify-center items-center">
                      <span>{slot.label.split(' - ')[0]}</span>
                      <span className="text-amber-700/60 font-sans text-[9px] font-normal">
                        {slot.label.split(' - ')[1]}
                      </span>
                    </div>

                    {/* Full Width Break Content */}
                    <div
                      className="p-2.5 bg-amber-50/40 border-b border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-amber-900"
                      style={{ gridColumn: `span ${visibleDays.length}` }}
                    >
                      {slot.title?.includes('Lunch') ? (
                        <Utensils className="w-4 h-4 text-amber-700" />
                      ) : (
                        <Coffee className="w-4 h-4 text-amber-700" />
                      )}
                      <span className="tracking-wide uppercase text-[11px] font-bold text-amber-950">
                        {slot.title}
                      </span>
                      <span className="text-[10px] font-mono text-amber-700/80 bg-amber-100/60 px-2 py-0.5 rounded-full">
                        {slot.label}
                      </span>
                    </div>
                  </React.Fragment>
                );
              }

              // Standard Lesson Row
              return (
                <React.Fragment key={`slot-${slotIdx}`}>
                  {/* Time Gutter Cell */}
                  <div className="p-2.5 bg-slate-50/60 border-b border-r border-slate-200 font-mono text-[11px] text-slate-600 flex flex-col justify-center items-center">
                    <span className="font-bold text-slate-800">{slot.label.split(' - ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-medium">to {slot.label.split(' - ')[1]}</span>
                    <span className="mt-1 text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                      P{periodNumber}
                    </span>
                  </div>

                  {/* Day Cells */}
                  {visibleDays.map((day) => {
                    const period = findPeriod(day, slot.label);
                    const isToday = day === currentDayName;
                    const highlighted = period ? isPeriodHighlighted(period) : true;
                    const dimStyle = !highlighted ? 'opacity-30' : 'opacity-100';

                    if (period) {
                      const theme = getSubjectTheme(period.subjectName);

                      return (
                        <div
                          key={`${day}-${slot.label}`}
                          className={`p-2 border-b border-r border-slate-200 last:border-r-0 relative group transition-all ${
                            isToday ? 'bg-emerald-50/20' : 'bg-white'
                          } ${dimStyle}`}
                        >
                          <div
                            className={`p-3 rounded-xl border ${theme.bg} ${theme.border} ${theme.accent} shadow-2xs transition-all hover:shadow-xs hover:scale-[1.01]`}
                          >
                            {/* Card Header: Subject & Actions */}
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="min-w-0">
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${theme.badgeBg} block w-max mb-1`}
                                >
                                  {theme.category}
                                </span>
                                <h4 className="font-extrabold text-xs text-slate-950 leading-snug line-clamp-1">
                                  {period.subjectName}
                                </h4>
                              </div>

                              {/* Action Buttons (Visible on Hover) */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditPeriod(period);
                                  }}
                                  className="p-1 rounded bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
                                  title="Edit Lesson"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeletePeriod(period.id);
                                  }}
                                  className="p-1 rounded bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
                                  title="Delete Lesson"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Card Body: Teacher and Room Details */}
                            <div className="mt-2 space-y-1 text-[11px]">
                              {viewMode !== 'teacher' && (
                                <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                                  <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{period.teacherName}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60 mt-1">
                                <span className="font-semibold text-slate-800 bg-white/90 border border-slate-200/70 px-1.5 py-0.5 rounded shadow-2xs">
                                  {period.className}
                                </span>

                                <span className="flex items-center gap-0.5 font-medium text-slate-600">
                                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                  <span>{period.room}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Empty Slot (Interactive for Instant Scheduling)
                    return (
                      <div
                        key={`${day}-${slot.label}`}
                        onClick={() => onAddSlot(day, slot.label)}
                        className={`p-2 border-b border-r border-slate-200 last:border-r-0 group cursor-pointer transition-colors ${
                          isToday ? 'bg-emerald-50/10 hover:bg-emerald-50/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="h-full min-h-[72px] border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-700 group-hover:bg-emerald-50/40 transition-all p-2">
                          <Plus className="w-3.5 h-3.5 mb-0.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[10px] font-semibold opacity-50 group-hover:opacity-100 transition-opacity">
                            + Assign
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
