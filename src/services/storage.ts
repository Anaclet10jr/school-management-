import {
  User,
  Student,
  Teacher,
  ClassSection,
  Subject,
  AttendanceRecord,
  Exam,
  MarkEntry,
  ReportCard,
  FeeStructure,
  Payment,
  TimetableEntry,
  LibraryBook,
  BookLoan,
  Assignment,
  DisciplineRecord,
  HealthRecord,
  Announcement,
  AuditLog,
  AdmissionApplication,
  SchoolSettings,
  GradingScale,
} from '../types';

import {
  initialUsers,
  initialStudents,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialGradingScales,
  initialAttendanceRecords,
  initialExams,
  initialMarks,
  initialReportCards,
  initialFeeStructures,
  initialPayments,
  initialTimetable,
  initialLibraryBooks,
  initialAssignments,
  initialDisciplineRecords,
  initialHealthRecords,
  initialAnnouncements,
  initialAuditLogs,
  initialAdmissions,
  initialSchoolSettings,
} from '../data/seedData';
import { detectTimetableCollisions, resolveTimetableCollisions } from '../utils/timetableResolver';

const STORAGE_KEYS = {
  USERS: 'kigali_erp_users',
  STUDENTS: 'kigali_erp_students',
  TEACHERS: 'kigali_erp_teachers',
  CLASSES: 'kigali_erp_classes',
  SUBJECTS: 'kigali_erp_subjects',
  GRADING_SCALES: 'kigali_erp_grading_scales',
  ATTENDANCE: 'kigali_erp_attendance',
  EXAMS: 'kigali_erp_exams',
  MARKS: 'kigali_erp_marks',
  REPORT_CARDS: 'kigali_erp_report_cards',
  FEE_STRUCTURES: 'kigali_erp_fee_structures',
  PAYMENTS: 'kigali_erp_payments',
  TIMETABLE: 'kigali_erp_timetable',
  BOOKS: 'kigali_erp_books',
  ASSIGNMENTS: 'kigali_erp_assignments',
  DISCIPLINE: 'kigali_erp_discipline',
  HEALTH: 'kigali_erp_health',
  ANNOUNCEMENTS: 'kigali_erp_announcements',
  AUDIT_LOGS: 'kigali_erp_audit_logs',
  ADMISSIONS: 'kigali_erp_admissions',
  SETTINGS: 'kigali_erp_settings',
  CURRENT_USER: 'kigali_erp_current_user',
  LANGUAGE: 'kigali_erp_language',
};

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save key ${key} to storage`, err);
  }
}

export const StorageService = {
  // Authentication & Session
  getUsers: () => getStorageItem(STORAGE_KEYS.USERS, initialUsers),
  saveUsers: (users: typeof initialUsers) => setStorageItem(STORAGE_KEYS.USERS, users),

  getCurrentUser: (): User | null => {
    const saved = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) return saved;
    // Default logged-in user is Super Admin if not logged in
    const defaultAdmin = initialUsers[0];
    const { passwordHash, ...userObj } = defaultAdmin;
    return userObj;
  },

  setCurrentUser: (user: User | null) => {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  authenticate: (email: string, passwordAttempt: string): User | null => {
    const users = StorageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) return null;

    if (found.passwordHash === passwordAttempt) {
      const { passwordHash, ...safeUser } = found;
      StorageService.setCurrentUser(safeUser);
      StorageService.logAudit(
        safeUser.name,
        safeUser.role,
        'User Sign In',
        `Successful login with email ${email}`
      );
      return safeUser;
    }
    return null;
  },

  logout: () => {
    const cur = StorageService.getCurrentUser();
    if (cur) {
      StorageService.logAudit(cur.name, cur.role, 'User Logout', 'Signed out of system');
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Language
  getLanguage: (): 'en' | 'rw' => getStorageItem(STORAGE_KEYS.LANGUAGE, 'en'),
  setLanguage: (lang: 'en' | 'rw') => setStorageItem(STORAGE_KEYS.LANGUAGE, lang),

  // Settings
  getSettings: (): SchoolSettings => {
    const s = getStorageItem(STORAGE_KEYS.SETTINGS, initialSchoolSettings);
    if (!s || typeof s !== 'object') {
      return initialSchoolSettings;
    }
    return { ...initialSchoolSettings, ...s };
  },
  saveSettings: (settings: SchoolSettings) => setStorageItem(STORAGE_KEYS.SETTINGS, settings),

  // Students
  getStudents: (): Student[] => getStorageItem(STORAGE_KEYS.STUDENTS, initialStudents),
  saveStudents: (students: Student[]) => setStorageItem(STORAGE_KEYS.STUDENTS, students),
  addStudent: (student: Student) => {
    const list = StorageService.getStudents();
    list.unshift(student);
    StorageService.saveStudents(list);
    const user = StorageService.getCurrentUser();
    StorageService.logAudit(user?.name || 'Admin', user?.role || 'Admin', 'Create Student', `Enrolled student ${student.firstName} ${student.lastName} (${student.studentId})`);
  },
  updateStudent: (student: Student) => {
    const list = StorageService.getStudents().map(s => s.id === student.id ? student : s);
    StorageService.saveStudents(list);
    const user = StorageService.getCurrentUser();
    StorageService.logAudit(user?.name || 'Admin', user?.role || 'Admin', 'Update Student', `Updated record for ${student.firstName} ${student.lastName}`);
  },
  deleteStudent: (studentId: string) => {
    const list = StorageService.getStudents().filter(s => s.id !== studentId);
    StorageService.saveStudents(list);
  },

  // Classes & Sections
  getClasses: (): ClassSection[] => getStorageItem(STORAGE_KEYS.CLASSES, initialClasses),
  saveClasses: (classes: ClassSection[]) => setStorageItem(STORAGE_KEYS.CLASSES, classes),

  // Subjects
  getSubjects: (): Subject[] => getStorageItem(STORAGE_KEYS.SUBJECTS, initialSubjects),
  saveSubjects: (subjects: Subject[]) => setStorageItem(STORAGE_KEYS.SUBJECTS, subjects),

  // Teachers
  getTeachers: (): Teacher[] => getStorageItem(STORAGE_KEYS.TEACHERS, initialTeachers),
  saveTeachers: (teachers: Teacher[]) => setStorageItem(STORAGE_KEYS.TEACHERS, teachers),

  // Grading Scales
  getGradingScales: (): GradingScale[] => getStorageItem(STORAGE_KEYS.GRADING_SCALES, initialGradingScales),
  saveGradingScales: (scales: GradingScale[]) => setStorageItem(STORAGE_KEYS.GRADING_SCALES, scales),

  // Attendance
  getAttendance: (): AttendanceRecord[] => getStorageItem(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords),
  saveAttendance: (records: AttendanceRecord[]) => setStorageItem(STORAGE_KEYS.ATTENDANCE, records),
  recordAttendanceBatch: (records: AttendanceRecord[]) => {
    const current = StorageService.getAttendance();
    // remove existing for same date, class, and student to prevent duplicates
    const filtered = current.filter(
      c => !records.some(r => r.date === c.date && r.studentId === c.studentId)
    );
    const updated = [...records, ...filtered];
    StorageService.saveAttendance(updated);
    const user = StorageService.getCurrentUser();
    StorageService.logAudit(
      user?.name || 'Teacher',
      user?.role || 'Teacher',
      'Attendance Batch Recorded',
      `Recorded attendance for ${records.length} students`
    );
  },

  // Exams & Marks
  getExams: (): Exam[] => getStorageItem(STORAGE_KEYS.EXAMS, initialExams),
  saveExams: (exams: Exam[]) => setStorageItem(STORAGE_KEYS.EXAMS, exams),

  getMarks: (): MarkEntry[] => {
    const list = getStorageItem<MarkEntry[]>(STORAGE_KEYS.MARKS, initialMarks);
    if (!list || list.length < 10) {
      setStorageItem(STORAGE_KEYS.MARKS, initialMarks);
      return initialMarks;
    }
    return list;
  },
  saveMarks: (marks: MarkEntry[]) => setStorageItem(STORAGE_KEYS.MARKS, marks),
  saveOrUpdateMark: (mark: MarkEntry) => {
    const list = StorageService.getMarks();
    const idx = list.findIndex(m => m.studentId === mark.studentId && m.subjectId === mark.subjectId && m.term === mark.term);
    let oldVal = 'None';
    if (idx >= 0) {
      oldVal = `${list[idx].total}%`;
      list[idx] = mark;
    } else {
      list.push(mark);
    }
    StorageService.saveMarks(list);
    const user = StorageService.getCurrentUser();
    StorageService.logAudit(
      user?.name || 'Teacher',
      user?.role || 'Teacher',
      'Mark Entry Updated',
      `Student ${mark.studentName}, Subject: ${mark.subjectName}, Old: ${oldVal}, New: ${mark.total}% (${mark.grade})`
    );
  },

  // Report Cards
  getReportCards: (): ReportCard[] => {
    const list = getStorageItem<ReportCard[]>(STORAGE_KEYS.REPORT_CARDS, initialReportCards);
    if (!list || list.length < 3) {
      setStorageItem(STORAGE_KEYS.REPORT_CARDS, initialReportCards);
      return initialReportCards;
    }
    return list;
  },
  saveReportCards: (cards: ReportCard[]) => setStorageItem(STORAGE_KEYS.REPORT_CARDS, cards),

  // Fees & Payments
  getFeeStructures: (): FeeStructure[] => getStorageItem(STORAGE_KEYS.FEE_STRUCTURES, initialFeeStructures),
  saveFeeStructures: (structures: FeeStructure[]) => setStorageItem(STORAGE_KEYS.FEE_STRUCTURES, structures),

  getPayments: (): Payment[] => getStorageItem(STORAGE_KEYS.PAYMENTS, initialPayments),
  savePayments: (payments: Payment[]) => setStorageItem(STORAGE_KEYS.PAYMENTS, payments),
  addPayment: (payment: Payment) => {
    const list = StorageService.getPayments();
    list.unshift(payment);
    StorageService.savePayments(list);

    // Update student balance
    const students = StorageService.getStudents();
    const studentIdx = students.findIndex(s => s.id === payment.studentId);
    if (studentIdx >= 0) {
      const curBalance = students[studentIdx].feeBalance || 0;
      students[studentIdx].feeBalance = Math.max(0, curBalance - payment.amount);
      StorageService.saveStudents(students);
    }

    const user = StorageService.getCurrentUser();
    StorageService.logAudit(
      user?.name || 'Bursar',
      user?.role || 'Bursar',
      'Fee Payment Recorded',
      `Receipt #${payment.receiptNumber}: RWF ${payment.amount.toLocaleString()} received from ${payment.studentName} via ${payment.paymentMethod}`
    );
  },

  // Timetable
  getTimetable: (): TimetableEntry[] => {
    const list = getStorageItem<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, initialTimetable);
    if (!list || list.length < 10) {
      setStorageItem(STORAGE_KEYS.TIMETABLE, initialTimetable);
      return initialTimetable;
    }
    const collisions = detectTimetableCollisions(list);
    if (collisions.length > 0) {
      const sanitized = resolveTimetableCollisions(list);
      setStorageItem(STORAGE_KEYS.TIMETABLE, sanitized);
      return sanitized;
    }
    return list;
  },
  saveTimetable: (entries: TimetableEntry[]) => setStorageItem(STORAGE_KEYS.TIMETABLE, entries),

  // Library
  getBooks: (): LibraryBook[] => getStorageItem(STORAGE_KEYS.BOOKS, initialLibraryBooks),
  saveBooks: (books: LibraryBook[]) => setStorageItem(STORAGE_KEYS.BOOKS, books),

  // Assignments
  getAssignments: (): Assignment[] => getStorageItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments),
  saveAssignments: (assignments: Assignment[]) => setStorageItem(STORAGE_KEYS.ASSIGNMENTS, assignments),

  // Discipline & Health
  getDiscipline: (): DisciplineRecord[] => getStorageItem(STORAGE_KEYS.DISCIPLINE, initialDisciplineRecords),
  saveDiscipline: (records: DisciplineRecord[]) => setStorageItem(STORAGE_KEYS.DISCIPLINE, records),

  getHealth: (): HealthRecord[] => getStorageItem(STORAGE_KEYS.HEALTH, initialHealthRecords),
  saveHealth: (records: HealthRecord[]) => setStorageItem(STORAGE_KEYS.HEALTH, records),

  // Announcements
  getAnnouncements: (): Announcement[] => getStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements),
  saveAnnouncements: (announcements: Announcement[]) => setStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements),

  // Admissions
  getAdmissions: (): AdmissionApplication[] => getStorageItem(STORAGE_KEYS.ADMISSIONS, initialAdmissions),
  saveAdmissions: (admissions: AdmissionApplication[]) => setStorageItem(STORAGE_KEYS.ADMISSIONS, admissions),

  // Audit Logs
  getAuditLogs: (): AuditLog[] => getStorageItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs),
  logAudit: (userName: string, userRole: string, action: string, details: string) => {
    const logs = StorageService.getAuditLogs();
    const newEntry: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName,
      userRole,
      action,
      details,
      ipAddress: '197.243.22.' + (Math.floor(Math.random() * 80) + 10),
    };
    logs.unshift(newEntry);
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200)); // retain top 200 logs
  },

  // Single item helpers
  saveStudent: (student: Student) => {
    const list = StorageService.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.unshift(student);
    }
    StorageService.saveStudents(list);
  },

  saveTeacher: (teacher: Teacher) => {
    const list = StorageService.getTeachers();
    const idx = list.findIndex(t => t.id === teacher.id);
    if (idx >= 0) {
      list[idx] = teacher;
    } else {
      list.push(teacher);
    }
    StorageService.saveTeachers(list);
  },

  saveClass: (cls: ClassSection) => {
    const list = StorageService.getClasses();
    const idx = list.findIndex(c => c.id === cls.id);
    if (idx >= 0) {
      list[idx] = cls;
    } else {
      list.push(cls);
    }
    StorageService.saveClasses(list);
  },

  saveSubject: (sub: Subject) => {
    const list = StorageService.getSubjects();
    const idx = list.findIndex(s => s.id === sub.id);
    if (idx >= 0) {
      list[idx] = sub;
    } else {
      list.push(sub);
    }
    StorageService.saveSubjects(list);
  },

  saveMark: (mark: MarkEntry) => {
    StorageService.saveOrUpdateMark(mark);
  },

  saveReportCard: (card: ReportCard) => {
    const list = StorageService.getReportCards();
    const idx = list.findIndex(r => r.id === card.id);
    if (idx >= 0) {
      list[idx] = card;
    } else {
      list.push(card);
    }
    StorageService.saveReportCards(list);
  },

  savePayment: (payment: Payment) => {
    StorageService.addPayment(payment);
  },

  saveAnnouncement: (ann: Announcement) => {
    const list = StorageService.getAnnouncements();
    list.unshift(ann);
    StorageService.saveAnnouncements(list);
  },

  saveAdmission: (adm: AdmissionApplication) => {
    const list = StorageService.getAdmissions();
    const idx = list.findIndex(a => a.id === adm.id);
    if (idx >= 0) {
      list[idx] = adm;
    } else {
      list.unshift(adm);
    }
    StorageService.saveAdmissions(list);
  },

  saveDisciplineRecord: (rec: DisciplineRecord) => {
    const list = StorageService.getDiscipline();
    list.unshift(rec);
    StorageService.saveDiscipline(list);
  },

  getMedical: () => StorageService.getHealth(),
  saveMedical: (rec: HealthRecord) => {
    const list = StorageService.getHealth();
    list.unshift(rec);
    StorageService.saveHealth(list);
  },

  getBorrowings: (): BookLoan[] => getStorageItem('kigali_erp_borrowings', []),
  saveBorrowing: (b: BookLoan) => {
    const list = StorageService.getBorrowings();
    const idx = list.findIndex(item => item.id === b.id);
    if (idx >= 0) {
      list[idx] = b;
    } else {
      list.unshift(b);
    }
    setStorageItem('kigali_erp_borrowings', list);
  },

  // Reset to default seed
  resetAllData: () => {
    localStorage.clear();
    setStorageItem(STORAGE_KEYS.USERS, initialUsers);
    setStorageItem(STORAGE_KEYS.STUDENTS, initialStudents);
    setStorageItem(STORAGE_KEYS.TEACHERS, initialTeachers);
    setStorageItem(STORAGE_KEYS.CLASSES, initialClasses);
    setStorageItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
    setStorageItem(STORAGE_KEYS.GRADING_SCALES, initialGradingScales);
    setStorageItem(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords);
    setStorageItem(STORAGE_KEYS.EXAMS, initialExams);
    setStorageItem(STORAGE_KEYS.MARKS, initialMarks);
    setStorageItem(STORAGE_KEYS.REPORT_CARDS, initialReportCards);
    setStorageItem(STORAGE_KEYS.FEE_STRUCTURES, initialFeeStructures);
    setStorageItem(STORAGE_KEYS.PAYMENTS, initialPayments);
    setStorageItem(STORAGE_KEYS.TIMETABLE, initialTimetable);
    setStorageItem(STORAGE_KEYS.BOOKS, initialLibraryBooks);
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    setStorageItem(STORAGE_KEYS.DISCIPLINE, initialDisciplineRecords);
    setStorageItem(STORAGE_KEYS.HEALTH, initialHealthRecords);
    setStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    setStorageItem(STORAGE_KEYS.ADMISSIONS, initialAdmissions);
    setStorageItem(STORAGE_KEYS.SETTINGS, initialSchoolSettings);
  },
};
