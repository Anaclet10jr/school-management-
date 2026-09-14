import { TimetablePeriod } from '../types';

export interface CollisionIssue {
  id: string;
  type: 'teacher' | 'room';
  day: string;
  timeSlot: string;
  period1: TimetablePeriod;
  period2: TimetablePeriod;
  message: string;
}

/**
 * Detect all teacher and room overlaps across the timetable
 */
export function detectTimetableCollisions(periods: TimetablePeriod[]): CollisionIssue[] {
  const issues: CollisionIssue[] = [];

  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      const p1 = periods[i];
      const p2 = periods[j];

      if (p1.day === p2.day) {
        const t1 = p1.timeSlot || `${p1.startTime} - ${p1.endTime}`;
        const t2 = p2.timeSlot || `${p2.startTime} - ${p2.endTime}`;

        if (t1 === t2 || (p1.startTime === p2.startTime && p1.endTime === p2.endTime)) {
          // Check teacher overlap
          if (p1.teacherId === p2.teacherId && p1.classId !== p2.classId) {
            issues.push({
              id: `conflict-tch-${p1.id}-${p2.id}`,
              type: 'teacher',
              day: p1.day,
              timeSlot: t1,
              period1: p1,
              period2: p2,
              message: `Teacher ${p1.teacherName} is double-booked on ${p1.day} (${t1}) in ${p1.className} and ${p2.className}`,
            });
          }
          // Check room overlap
          if (p1.room && p2.room && p1.room.trim().toLowerCase() === p2.room.trim().toLowerCase() && p1.classId !== p2.classId) {
            issues.push({
              id: `conflict-rm-${p1.id}-${p2.id}`,
              type: 'room',
              day: p1.day,
              timeSlot: t1,
              period1: p1,
              period2: p2,
              message: `Room "${p1.room}" is double-booked on ${p1.day} (${t1}) by ${p1.className} and ${p2.className}`,
            });
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Automatically resolves all collisions:
 * 1. Sanitizes Nursery/Top Class entries to use early years rooms and early years faculty
 * 2. Re-assigns overlapping teachers to available teachers who are free at that slot
 * 3. Re-assigns overlapping rooms to classroom home rooms that are free at that slot
 */
export function resolveTimetableCollisions(
  periods: TimetablePeriod[],
  availableTeachersList?: Array<{ id: string; name: string; primarySubject?: string }>,
  availableRoomsList?: string[]
): TimetablePeriod[] {
  const currentCollisions = detectTimetableCollisions(periods);
  if (currentCollisions.length === 0) {
    return periods;
  }

  const defaultTeachers = availableTeachersList && availableTeachersList.length > 0
    ? availableTeachersList
    : [
        { id: 'tch-001', name: 'Jean Paul Habimana', primarySubject: 'Mathematics' },
        { id: 'tch-002', name: 'Claire Mukamurenzi', primarySubject: 'English' },
        { id: 'tch-003', name: 'Patrick Ndayisaba', primarySubject: 'Physics & ICT' },
        { id: 'tch-004', name: 'Diane Mukamana', primarySubject: 'Chemistry & Biology' },
        { id: 'tch-005', name: 'Alice Ingabire', primarySubject: 'Primary & Early Years' },
        { id: 'tch-006', name: 'Joseph Mugisha', primarySubject: 'Humanities & PE' },
      ];

  const defaultRooms = availableRoomsList && availableRoomsList.length > 0
    ? availableRoomsList
    : ['Rm 3', 'Rm 4', 'Rm 7', 'Early Years Rm 1', 'Block A - 101', 'Block A - 204', 'Lab 1', 'Lab 2', 'Computer Lab', 'Library', 'Main Hall', 'Campus Grounds'];

  // Deep clone to avoid mutating input directly
  const resolved: TimetablePeriod[] = periods.map((p) => ({ ...p }));

  // Step 1: Specifically normalize Nursery (Top Class) periods
  // Nursery students belong in Early Years Room 1 and should not double-book secondary teachers/labs
  for (let i = 0; i < resolved.length; i++) {
    const p = resolved[i];
    const isNursery = p.className?.toLowerCase().includes('top') ||
      p.className?.toLowerCase().includes('nursery') ||
      p.classId?.toLowerCase().includes('nur') ||
      p.classId?.toLowerCase().includes('top');

    if (isNursery) {
      p.room = 'Early Years Rm 1';
      // Assign Alice Ingabire (Early Childhood specialist)
      p.teacherId = 'tch-005';
      p.teacherName = 'Alice Ingabire';

      // Keep subjects age-appropriate
      if (
        p.subjectName?.toLowerCase().includes('physics') ||
        p.subjectName?.toLowerCase().includes('chemistry') ||
        p.subjectName?.toLowerCase().includes('biology') ||
        p.subjectName?.toLowerCase().includes('history')
      ) {
        p.subjectId = 'sbj-nur-com';
        p.subjectName = 'Communication & Play';
      }
    }
  }

  // Step 2: Iteratively reassign any double-booked teachers and rooms
  const maxIterations = 5;
  for (let iter = 0; iter < maxIterations; iter++) {
    const issues = detectTimetableCollisions(resolved);
    if (issues.length === 0) break;

    // Track occupied teachers and rooms by `${day}-${timeSlot}`
    const occupiedTeachers = new Map<string, Set<string>>(); // `${day}-${slot}` -> Set(teacherIds)
    const occupiedRooms = new Map<string, Set<string>>(); // `${day}-${slot}` -> Set(rooms)

    const getKey = (day: string, slot: string) => `${day}-${slot}`;

    for (let i = 0; i < resolved.length; i++) {
      const p = resolved[i];
      const slot = p.timeSlot || `${p.startTime} - ${p.endTime}`;
      const key = getKey(p.day, slot);

      if (!occupiedTeachers.has(key)) occupiedTeachers.set(key, new Set());
      if (!occupiedRooms.has(key)) occupiedRooms.set(key, new Set());

      const teacherSet = occupiedTeachers.get(key)!;
      const roomSet = occupiedRooms.get(key)!;

      // Check if teacher is already taken in this slot
      if (teacherSet.has(p.teacherId)) {
        // Find a free teacher
        const freeTeacher = defaultTeachers.find((t) => !teacherSet.has(t.id));
        if (freeTeacher) {
          p.teacherId = freeTeacher.id;
          p.teacherName = freeTeacher.name;
        }
      }
      teacherSet.add(p.teacherId);

      // Check if room is already taken in this slot
      const roomNormalized = (p.room || '').trim().toLowerCase();
      if (roomSet.has(roomNormalized) && roomNormalized !== '') {
        // Find a free room
        const freeRoom = defaultRooms.find((r) => !roomSet.has(r.trim().toLowerCase()));
        if (freeRoom) {
          p.room = freeRoom;
        } else {
          p.room = `Rm ${p.className.replace(/\D/g, '') || '5'}`;
        }
      }
      if (p.room) {
        roomSet.add(p.room.trim().toLowerCase());
      }
    }
  }

  return resolved;
}
