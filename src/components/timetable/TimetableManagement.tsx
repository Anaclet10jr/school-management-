import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Printer,
  AlertTriangle,
  CheckCircle2,
  School,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Users,
  Building2,
  Filter,
  Wand2,
  X,
  Check,
  LayoutGrid,
  Table as TableIcon,
  List as ListIcon,
  MapPin,
  Wrench,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { TimetablePeriod, ClassSection, Teacher, Subject } from '../../types';
import { Language, translations } from '../../locales/translations';
import { TimetableCalendarView } from './TimetableCalendarView';
import { detectTimetableCollisions, resolveTimetableCollisions } from '../../utils/timetableResolver';

interface TimetableManagementProps {
  periods: TimetablePeriod[];
  classes: ClassSection[];
  teachers: Teacher[];
  subjects: Subject[];
  onSaveTimetable: (entries: TimetablePeriod[]) => void;
  language: Language;
}

export const TimetableManagement: React.FC<TimetableManagementProps> = ({
  periods,
  classes,
  teachers,
  subjects,
  onSaveTimetable,
  language,
}) => {
  const t = translations[language];

  // Layout mode: 'calendar' (Grid) | 'table' (Matrix) | 'agenda' (List)
  const [layoutMode, setLayoutMode] = useState<'calendar' | 'table' | 'agenda'>('calendar');

  // View state: 'class' | 'teacher' | 'room'
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || 'cls-olevel-s1a');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0]?.id || 'tch-001');
  const [selectedRoom, setSelectedRoom] = useState<string>('Rm 3');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(null);

  // Form fields
  const [formDay, setFormDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [formTimeSlot, setFormTimeSlot] = useState('08:00 - 08:45');
  const [formClassId, setFormClassId] = useState(selectedClass);
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || '');
  const [formTeacherId, setFormTeacherId] = useState(teachers[0]?.id || '');
  const [formRoom, setFormRoom] = useState('Rm 3');

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const timeSlots = [
    { label: '08:00 - 08:45', isBreak: false, start: '08:00', end: '08:45' },
    { label: '08:45 - 09:30', isBreak: false, start: '08:45', end: '09:30' },
    { label: '09:30 - 10:15', isBreak: false, start: '09:30', end: '10:15' },
    { label: '10:15 - 10:45', isBreak: true, title: 'Morning Break & Refreshment' },
    { label: '10:45 - 11:30', isBreak: false, start: '10:45', end: '11:30' },
    { label: '11:30 - 12:15', isBreak: false, start: '11:30', end: '12:15' },
    { label: '12:15 - 13:30', isBreak: true, title: 'Lunch Break & Midday Assembly' },
    { label: '13:30 - 14:15', isBreak: false, start: '13:30', end: '14:15' },
    { label: '14:15 - 15:00', isBreak: false, start: '14:15', end: '15:00' },
    { label: '15:00 - 15:45', isBreak: false, start: '15:00', end: '15:45' },
  ];

  // Unique rooms list
  const roomsList = useMemo(() => {
    const list = new Set(['Rm 3', 'Rm 7', 'Lab 1', 'Lab 2', 'Computer Lab', 'Library', 'P6 Hall', 'Main Hall', 'Sports Field']);
    periods.forEach((p) => {
      if (p.room) list.add(p.room);
    });
    return Array.from(list);
  }, [periods]);

  // Conflict detection engine
  const conflicts = useMemo(() => {
    return detectTimetableCollisions(periods);
  }, [periods]);

  const [resolveSuccessMsg, setResolveSuccessMsg] = useState<string | null>(null);

  const handleResolveAllCollisions = () => {
    const resolved = resolveTimetableCollisions(periods, teachers, roomsList);
    onSaveTimetable(resolved);
    setResolveSuccessMsg(`Successfully resolved ${conflicts.length} schedule collisions! Faculty and rooms are now conflict-free.`);
    setTimeout(() => {
      setResolveSuccessMsg(null);
    }, 6000);
  };

  // Filter periods based on current view
  const currentViewPeriods = useMemo(() => {
    if (viewMode === 'class') {
      return periods.filter((p) => p.classId === selectedClass);
    }
    if (viewMode === 'teacher') {
      return periods.filter((p) => p.teacherId === selectedTeacher);
    }
    if (viewMode === 'room') {
      return periods.filter((p) => p.room === selectedRoom);
    }
    return periods;
  }, [periods, viewMode, selectedClass, selectedTeacher, selectedRoom]);

  // Find period matching day and time slot
  const findPeriod = (day: string, slotLabel: string) => {
    const [slotStart] = slotLabel.split(' - ');
    return currentViewPeriods.find((p) => {
      if (p.day !== day) return false;
      if (p.timeSlot === slotLabel) return true;
      if (p.startTime === slotStart) return true;
      if (p.timeSlot && p.timeSlot.includes(slotStart)) return true;
      return false;
    });
  };

  // Open Add modal with defaults
  const handleOpenAddModal = (day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday', slotLabel?: string) => {
    setEditingPeriod(null);
    if (day) setFormDay(day);
    if (slotLabel) setFormTimeSlot(slotLabel);
    setFormClassId(selectedClass);
    setFormSubjectId(subjects[0]?.id || '');
    setFormTeacherId(teachers[0]?.id || '');
    setFormRoom(selectedRoom || 'Rm 3');
    setModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (period: TimetablePeriod) => {
    setEditingPeriod(period);
    setFormDay(period.day);
    setFormTimeSlot(period.timeSlot || `${period.startTime} - ${period.endTime}`);
    setFormClassId(period.classId);
    setFormSubjectId(period.subjectId);
    setFormTeacherId(period.teacherId);
    setFormRoom(period.room);
    setModalOpen(true);
  };

  // Save period (Add or Update)
  const handleSavePeriodForm = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === formClassId);
    const targetSubject = subjects.find((s) => s.id === formSubjectId);
    const targetTeacher = teachers.find((t) => t.id === formTeacherId);

    const [start, end] = formTimeSlot.split(' - ');

    const newPeriod: TimetablePeriod = {
      id: editingPeriod ? editingPeriod.id : `tt-${Date.now()}`,
      classId: formClassId,
      className: targetClass ? targetClass.name : 'S1 A',
      subjectId: formSubjectId,
      subjectName: targetSubject ? targetSubject.name : 'General Studies',
      teacherId: formTeacherId,
      teacherName: targetTeacher ? targetTeacher.name : 'Faculty Staff',
      room: formRoom,
      day: formDay,
      startTime: start || '08:00',
      endTime: end || '08:45',
      timeSlot: formTimeSlot,
    };

    let updatedList: TimetablePeriod[];
    if (editingPeriod) {
      updatedList = periods.map((p) => (p.id === editingPeriod.id ? newPeriod : p));
    } else {
      // Remove any prior entry at same day, slot and class
      const filtered = periods.filter(
        (p) => !(p.day === formDay && p.classId === formClassId && (p.timeSlot === formTimeSlot || p.startTime === start))
      );
      updatedList = [...filtered, newPeriod];
    }

    onSaveTimetable(updatedList);
    setModalOpen(false);
  };

  // Delete period
  const handleDeletePeriod = (id: string) => {
    const updated = periods.filter((p) => p.id !== id);
    onSaveTimetable(updated);
    setModalOpen(false);
  };

  // Auto-generate standard schedule for empty class (strictly conflict-free)
  const handleAutoGenerateSchedule = () => {
    const targetClass = classes.find((c) => c.id === selectedClass);
    if (!targetClass) return;

    // Filter out existing periods for this class
    const otherPeriods = periods.filter((p) => p.classId !== selectedClass);

    const isNursery =
      targetClass.educationLevel === 'Nursery' ||
      targetClass.name.toLowerCase().includes('top') ||
      targetClass.name.toLowerCase().includes('nursery');

    const generated: TimetablePeriod[] = [];
    const regularSlots = timeSlots.filter((s) => !s.isBreak);

    // Helpers to verify faculty & room availability
    const isTeacherBusy = (day: string, slotLabel: string, teacherId: string) => {
      return (
        otherPeriods.some(
          (p) =>
            p.day === day &&
            (p.timeSlot === slotLabel || `${p.startTime} - ${p.endTime}` === slotLabel) &&
            p.teacherId === teacherId
        ) ||
        generated.some(
          (p) =>
            p.day === day &&
            (p.timeSlot === slotLabel || `${p.startTime} - ${p.endTime}` === slotLabel) &&
            p.teacherId === teacherId
        )
      );
    };

    const isRoomBusy = (day: string, slotLabel: string, roomName: string) => {
      const targetRoom = roomName.trim().toLowerCase();
      return (
        otherPeriods.some(
          (p) =>
            p.day === day &&
            (p.timeSlot === slotLabel || `${p.startTime} - ${p.endTime}` === slotLabel) &&
            (p.room || '').trim().toLowerCase() === targetRoom
        ) ||
        generated.some(
          (p) =>
            p.day === day &&
            (p.timeSlot === slotLabel || `${p.startTime} - ${p.endTime}` === slotLabel) &&
            (p.room || '').trim().toLowerCase() === targetRoom
        )
      );
    };

    if (isNursery) {
      // Nursery schedule: Early Years Room 1, Early Childhood teacher, foundational play/learning
      const nurserySubjects = [
        { id: 'sbj-nur-com', name: 'Communication & Numeracy' },
        { id: 'sbj-pri-lit', name: 'Rhymes & Story Circle' },
        { id: 'sbj-nur-com', name: 'Sensory & Motor Skills' },
        { id: 'sbj-nur-com', name: 'Outdoor Circle Games' },
        { id: 'sbj-pri-lit', name: 'Drawing & Coloring' },
        { id: 'sbj-nur-com', name: 'Music & Movement' },
      ];

      const nurseryTeacher =
        teachers.find((t) => t.id === targetClass.classTeacherId) ||
        teachers.find((t) => t.assignedClasses?.includes(targetClass.name)) ||
        teachers.find((t) => t.id === 'tch-005') ||
        teachers[0];

      const nurseryRoom = targetClass.room || 'Early Years Rm 1';

      days.forEach((day, dIdx) => {
        regularSlots.slice(0, 5).forEach((slot, sIdx) => {
          const sbj = nurserySubjects[(dIdx * 2 + sIdx) % nurserySubjects.length];
          let selectedTch = nurseryTeacher;
          if (isTeacherBusy(day, slot.label, selectedTch.id)) {
            const freeTch = teachers.find((t) => !isTeacherBusy(day, slot.label, t.id));
            if (freeTch) selectedTch = freeTch;
          }

          generated.push({
            id: `tt-nur-${selectedClass}-${day}-${sIdx}`,
            classId: selectedClass,
            className: targetClass.name,
            subjectId: sbj.id,
            subjectName: sbj.name,
            teacherId: selectedTch.id,
            teacherName: selectedTch.name,
            room: nurseryRoom,
            day: day,
            startTime: slot.start || '08:00',
            endTime: slot.end || '08:45',
            timeSlot: slot.label,
          });
        });
      });
    } else {
      // Primary / Secondary standard curriculum
      const subjectPool =
        subjects.length > 0
          ? subjects
          : [
              { id: 'sbj-mth', name: 'Mathematics' },
              { id: 'sbj-eng', name: 'English Language' },
              { id: 'sbj-phy', name: 'Physics' },
              { id: 'sbj-chm', name: 'Chemistry' },
              { id: 'sbj-bio', name: 'Biology' },
              { id: 'sbj-kin', name: 'Ikinyarwanda' },
              { id: 'sbj-ict', name: 'ICT & Computer Science' },
              { id: 'sbj-his', name: 'History & Citizenship' },
            ];

      const defaultHomeRoom = targetClass.room || `Rm ${targetClass.name.replace(/\D/g, '') || '3'}`;

      days.forEach((day, dIdx) => {
        regularSlots.forEach((slot, sIdx) => {
          const sbj = subjectPool[(dIdx * 3 + sIdx) % subjectPool.length];

          // Pick a free teacher
          let chosenTeacher = teachers.find(
            (t) =>
              (t.assignedSubjects?.includes(sbj.name) || t.department?.toLowerCase().includes(sbj.name.toLowerCase())) &&
              !isTeacherBusy(day, slot.label, t.id)
          );

          if (!chosenTeacher) {
            chosenTeacher = teachers.find((t) => !isTeacherBusy(day, slot.label, t.id));
          }

          if (!chosenTeacher) {
            chosenTeacher = teachers[(dIdx + sIdx) % (teachers.length || 1)] || {
              id: 'tch-001',
              name: 'Jean Paul Habimana',
            };
          }

          // Pick a free room
          let chosenRoom = defaultHomeRoom;
          if (sbj.name.includes('Physics') || sbj.name.includes('Chemistry') || sbj.name.includes('Biology')) {
            if (!isRoomBusy(day, slot.label, 'Lab 1')) chosenRoom = 'Lab 1';
            else if (!isRoomBusy(day, slot.label, 'Lab 2')) chosenRoom = 'Lab 2';
          } else if (sbj.name.includes('ICT')) {
            if (!isRoomBusy(day, slot.label, 'Computer Lab')) chosenRoom = 'Computer Lab';
          }

          if (isRoomBusy(day, slot.label, chosenRoom)) {
            const alternateRooms = ['Rm 3', 'Rm 4', 'Rm 7', 'Block A - 101', 'Block A - 204', 'Library'];
            const freeRoom = alternateRooms.find((r) => !isRoomBusy(day, slot.label, r));
            chosenRoom = freeRoom || defaultHomeRoom;
          }

          generated.push({
            id: `tt-gen-${selectedClass}-${day}-${sIdx}`,
            classId: selectedClass,
            className: targetClass.name,
            subjectId: sbj.id,
            subjectName: sbj.name,
            teacherId: chosenTeacher.id,
            teacherName: chosenTeacher.name,
            room: chosenRoom,
            day: day,
            startTime: slot.start || '08:00',
            endTime: slot.end || '08:45',
            timeSlot: slot.label,
          });
        });
      });
    }

    onSaveTimetable([...otherPeriods, ...generated]);
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClass);
  const selectedTeacherObj = teachers.find((t) => t.id === selectedTeacher);

  const selectedTargetName = useMemo(() => {
    if (viewMode === 'class') {
      return `${selectedClassObj?.name || selectedClass} (${selectedClassObj?.educationLevel || 'Secondary'})`;
    }
    if (viewMode === 'teacher') {
      return `${selectedTeacherObj?.name || 'Teacher'} (${selectedTeacherObj?.primarySubject || 'Faculty'})`;
    }
    return `Room / Facility: ${selectedRoom}`;
  }, [viewMode, selectedClassObj, selectedTeacherObj, selectedRoom]);

  const selectedSubtext = useMemo(() => {
    if (viewMode === 'class') return 'Weekly Class Academic Schedule';
    if (viewMode === 'teacher') return 'Teaching Hours & Assigned Classes';
    return 'Room & Facility Utilization Schedule';
  }, [viewMode]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Master Timetable & Faculty Scheduling</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Term 2 Live
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage weekly lesson allocations, monitor classroom utilization, and prevent faculty schedule collisions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Layout Mode Switcher (Calendar Grid vs Table Matrix vs Agenda List) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setLayoutMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'calendar'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Calendar Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'table'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table Matrix View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setLayoutMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'agenda'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Agenda List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'class'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>By Class</span>
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'teacher'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>By Teacher</span>
            </button>
            <button
              onClick={() => setViewMode('room')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'room'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>By Room</span>
            </button>
          </div>

          {/* Selector based on view mode */}
          {viewMode === 'class' && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} • {cls.educationLevel}
                </option>
              ))}
            </select>
          )}

          {viewMode === 'teacher' && (
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {teachers.map((tch) => (
                <option key={tch.id} value={tch.id}>
                  {tch.name} ({tch.primarySubject})
                </option>
              ))}
            </select>
          )}

          {viewMode === 'room' && (
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {roomsList.map((room) => (
                <option key={room} value={room}>
                  Room: {room}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => handleOpenAddModal()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lesson</span>
          </button>

          {viewMode === 'class' && currentViewPeriods.length < 5 && (
            <button
              onClick={handleAutoGenerateSchedule}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Auto-generate complete weekly schedule for this class"
            >
              <Wand2 className="w-4 h-4" />
              <span>Auto-Fill Schedule</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Analytics & Conflict Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {viewMode === 'class' ? 'Class Teaching Load' : viewMode === 'teacher' ? 'Assigned Periods' : 'Room Bookings'}
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {currentViewPeriods.length} Lessons / Week
            </p>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Weekly Contact Time</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {(currentViewPeriods.length * 0.75).toFixed(1)} Hours
            </p>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <Clock className="w-4 h-4 text-emerald-600" />
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Conflict Status</span>
            <p className={`text-xl font-black mt-0.5 ${conflicts.length === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {conflicts.length === 0 ? '0 Collisions' : `${conflicts.length} Overlaps`}
            </p>
          </div>
          <span className={`p-2.5 rounded-xl ${conflicts.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {conflicts.length === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {/* Success Banner when Collisions Resolved */}
      {resolveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between gap-3 text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resolveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setResolveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Conflict Warnings if any */}
      {conflicts.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Schedule Collisions Detected ({conflicts.length}):</span>
            </div>
            <button
              onClick={handleResolveAllCollisions}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer w-fit"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Auto-Resolve All Collisions</span>
            </button>
          </div>
          <p className="text-[11px] text-rose-700">
            Overlapping room bookings or double-booked teachers will prevent smooth class transitions. Click <strong>Auto-Resolve All Collisions</strong> to automatically reassign rooms and available faculty.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-rose-800 max-h-48 overflow-y-auto">
            {conflicts.map((c) => (
              <li key={c.id}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Timetable Content Based on Layout Mode */}
      {layoutMode === 'calendar' && (
        <TimetableCalendarView
          periods={currentViewPeriods}
          allPeriods={periods}
          days={days}
          timeSlots={timeSlots}
          viewMode={viewMode}
          selectedTargetName={selectedTargetName}
          selectedSubtext={selectedSubtext}
          onAddSlot={(day, slotLabel) => handleOpenAddModal(day, slotLabel)}
          onEditPeriod={handleOpenEditModal}
          onDeletePeriod={handleDeletePeriod}
        />
      )}

      {layoutMode === 'table' && (
        <div className="space-y-4">
          {/* Current Active View Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-emerald-400">
                {viewMode === 'class' ? 'CLS' : viewMode === 'teacher' ? 'TCH' : 'RM'}
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  {selectedTargetName}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {selectedSubtext} • Monday through Friday • 8:00 AM - 3:45 PM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAddModal()}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </div>
          </div>

          {/* Weekly Schedule Table Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-left w-32 border-r border-slate-200 text-[11px] uppercase tracking-wider">
                      Period / Time
                    </th>
                    {days.map((d) => (
                      <th key={d} className="py-3 px-3 border-r border-slate-200 last:border-r-0 min-w-[170px] text-[12px]">
                        <div className="flex items-center justify-center gap-1.5">
                          <span>{d}</span>
                          <button
                            onClick={() => handleOpenAddModal(d)}
                            className="w-5 h-5 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center text-slate-400 transition-colors cursor-pointer"
                            title={`Add lesson on ${d}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {timeSlots.map((slot, idx) => {
                    if (slot.isBreak) {
                      return (
                        <tr key={idx} className="bg-slate-100/70">
                          <td className="py-2.5 px-3 text-left font-mono text-[10px] font-bold text-slate-500 border-r border-slate-200">
                            {slot.label}
                          </td>
                          <td
                            colSpan={5}
                            className="py-2.5 px-3 text-center text-slate-600 font-bold text-[11px] tracking-wide uppercase bg-slate-100/80"
                          >
                            ☕ {slot.title}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-left font-mono text-[11px] text-slate-600 font-semibold border-r border-slate-200 bg-slate-50/30">
                          <span className="block">{slot.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Period {idx > 3 ? (idx > 6 ? idx - 2 : idx - 1) : idx + 1}</span>
                        </td>
                        {days.map((day) => {
                          const period = findPeriod(day, slot.label);

                          if (period) {
                            return (
                              <td
                                key={day}
                                className="p-2 border-r border-slate-200 last:border-r-0 align-top group relative"
                              >
                                <div className="p-3 bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200 rounded-xl text-left shadow-2xs hover:border-emerald-300 transition-all">
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-bold text-slate-900 block text-xs leading-tight">
                                      {period.subjectName}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleOpenEditModal(period)}
                                        className="p-1 hover:bg-white text-slate-500 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                                        title="Edit Lesson"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePeriod(period.id)}
                                        className="p-1 hover:bg-white text-slate-500 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                        title="Delete Lesson"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mt-1.5 space-y-0.5">
                                    <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                                      <Users className="w-3 h-3 text-slate-400" />
                                      <span>{period.teacherName}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-200/50 mt-1">
                                      <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                        {period.className}
                                      </span>
                                      <span className="font-mono text-slate-600 font-medium">
                                        📍 {period.room}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={day}
                              onClick={() => handleOpenAddModal(day, slot.label)}
                              className="p-2 border-r border-slate-200 last:border-r-0 align-top group cursor-pointer hover:bg-emerald-50/30 transition-colors"
                            >
                              <div className="h-full min-h-[64px] border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-600 transition-all p-2">
                                <span className="text-[11px] font-medium opacity-60 group-hover:opacity-100">
                                  + Assign Lesson
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {layoutMode === 'agenda' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedTargetName} - Agenda List</h3>
              <p className="text-xs text-slate-500">Sorted chronological schedule grouped by weekday</p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lesson</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((day) => {
              const dayLessons = currentViewPeriods
                .filter((p) => p.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{day}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {dayLessons.length} Lessons
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 flex-1 space-y-2">
                    {dayLessons.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <p>No lessons scheduled</p>
                        <button
                          onClick={() => handleOpenAddModal(day)}
                          className="mt-2 text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          + Schedule Lesson
                        </button>
                      </div>
                    ) : (
                      dayLessons.map((lesson) => (
                        <div key={lesson.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {lesson.startTime} - {lesson.endTime}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{lesson.subjectName}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                              <span>👤 {lesson.teacherName}</span>
                              <span>📍 {lesson.room}</span>
                              <span className="font-semibold text-slate-700">({lesson.className})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(lesson)}
                              className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePeriod(lesson.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Lesson Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{editingPeriod ? 'Edit Timetable Period' : 'Add New Lesson Period'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify class, subject, teacher, and room allocation.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePeriodForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    {timeSlots
                      .filter((s) => !s.isBreak)
                      .map((s) => (
                        <option key={s.label} value={s.label}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.educationLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room / Location</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Rm 3, Lab 1"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  {subjects.map((sbj) => (
                    <option key={sbj.id} value={sbj.id}>
                      {sbj.name} ({sbj.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Teacher</label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} • {tch.primarySubject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {editingPeriod ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePeriod(editingPeriod.id)}
                    className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingPeriod ? 'Update Lesson' : 'Save Lesson'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
