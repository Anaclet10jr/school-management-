export type EducationLevel = 'Nursery' | 'Primary' | 'O-Level' | 'A-Level';

export type UserRole =
  | 'Super Administrator'
  | 'School Administrator'
  | 'Head Teacher'
  | 'Academic Director'
  | 'Teacher'
  | 'Class Teacher'
  | 'Accountant / Bursar'
  | 'Parent'
  | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  linkedStudentId?: string; // for Parent or Student
  linkedTeacherId?: string; // for Teacher
}

export type StudentStatus = 'Active' | 'Inactive' | 'Archived' | 'Withdrawn' | 'Graduated';

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  emergencyContact: boolean;
}

export interface Student {
  id: string;
  studentId: string; // e.g. SCH-2026-0001
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  address: string;
  photo: string;
  status: StudentStatus;
  educationLevel: EducationLevel;
  classId: string;
  className: string;
  section: string; // e.g. 'A', 'B'
  academicYear: string;
  admissionDate: string;
  previousSchool?: string;
  category: 'Day' | 'Boarding';
  guardians: Guardian[];
  medicalNotes?: string;
  allergies?: string;
  attendanceRate: number; // e.g. 94%
  feeBalance: number; // in RWF
}

export interface ClassSection {
  id: string;
  name: string; // e.g. 'Baby Class', 'P1', 'S1', 'S4'
  educationLevel: EducationLevel;
  section: string; // 'A', 'B', 'C'
  room: string;
  classTeacherId: string;
  classTeacherName: string;
  capacity: number;
  enrolledCount: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. 'MTH-101'
  name: string; // 'Mathematics'
  educationLevel: EducationLevel;
  category: 'Core' | 'Elective' | 'Competency';
  credits: number;
  status: 'Active' | 'Inactive';
  isCore?: boolean;
}

export interface Teacher {
  id: string;
  staffId: string; // e.g. TCH-2026-01
  teacherId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  department: string;
  specialization?: string;
  assignedSubjectIds: string[];
  assignedSubjects: string[];
  assignedClassIds: string[];
  assignedClasses: string[];
  employmentDate: string;
  joiningDate?: string;
  contractType?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  photo: string;
  weeklyLessons: number;
  weeklyPeriods?: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
  period?: string; // 'Daily' or 'Period 1', etc.
}

export interface GradingScale {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  grade: string;
  gradePoint: number;
  remark: string;
}

export interface Exam {
  id: string;
  name: string; // 'CAT 1', 'Mid-Term', 'End-of-Term', 'National Mock'
  academicYear: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  startDate: string;
  endDate: string;
  classes: string[];
  status: 'Upcoming' | 'In Progress' | 'Grading' | 'Published';
}

export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: string;
  cat1: number; // max 20
  cat2: number; // max 20
  exam: number; // max 60
  total: number; // calculated max 100
  percentage: number;
  grade: string;
  teacherRemark: string;
  submitted: boolean;
  approved: boolean;
  published: boolean;
  competencyScores?: { [competency: string]: 'Excellent' | 'Very Good' | 'Good' | 'Developing' | 'Needs Improvement' };
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto: string;
  studentCode: string;
  className: string;
  educationLevel: EducationLevel;
  academicYear: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  subjectMarks: {
    subjectName: string;
    cat1: number;
    cat2: number;
    exam: number;
    total: number;
    grade: string;
    remark: string;
  }[];
  totalMarks: number;
  averageScore: number;
  overallGrade: string;
  classPosition: number;
  classSize: number;
  attendancePercentage: number;
  daysPresent: number;
  daysAbsent: number;
  conduct: string;
  teacherComment: string;
  classTeacherComment: string;
  headTeacherComment: string;
  promotionStatus: 'Promoted' | 'Repeated' | 'Pending' | 'Graduated';
  status: 'Draft' | 'Submitted' | 'Approved' | 'Published';
  publishedAt?: string;
}

export interface FeeStructure {
  id: string;
  title: string;
  educationLevel: EducationLevel;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: string;
  tuitionFee: number; // RWF
  mealsFee: number; // RWF
  transportFee?: number; // RWF
  boardingFee?: number; // RWF
  registrationFee?: number; // RWF
  uniformFee?: number; // RWF
  totalAmount: number; // RWF
}

export type PaymentMethod = 'Cash' | 'Bank' | 'MTN Mobile Money' | 'Airtel Money';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. RCT-2026-0042
  studentId: string;
  studentName: string;
  className: string;
  amount: number; // RWF
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string; // e.g. MTN-88429104
  receivedBy: string;
  academicYear: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  feeType: string;
  note?: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // '08:00'
  endTime: string; // '08:45'
  timeSlot?: string; // e.g. '08:00 - 08:45'
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  quantity: number;
  availableCopies: number;
}

export interface BookLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subjectName: string;
  teacherName: string;
  dueDate: string;
  totalPoints: number;
  submissionCount: number;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  incidentDate: string;
  incidentType: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  description: string;
  actionTaken: string;
  reportedBy: string;
  parentNotified: boolean;
  parentInformed?: boolean;
  status: 'Open' | 'Under Review' | 'Resolved';
}

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  className?: string;
  visitDate: string;
  complaint?: string;
  symptoms?: string;
  diagnosis: string;
  treatment: string;
  allergies?: string;
  emergencyContact?: string;
  attendedBy?: string;
  parentContacted?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'All' | 'Teachers' | 'Parents' | 'Students';
  date: string;
  author: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  publishedDate?: string;
  isUrgent?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  module?: string;
  oldValue?: string;
  newValue?: string;
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  applyingLevel: EducationLevel;
  applyingClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  previousSchool: string;
  submissionDate: string;
  status: 'Pending' | 'Reviewing' | 'Approved' | 'Rejected' | 'Enrolled';
  notes?: string;
  applicationNumber?: string;
  firstName?: string;
  lastName?: string;
  category?: 'Day' | 'Boarding';
  appliedClass?: string;
  educationLevel?: EducationLevel;
}

// Aliases
export type MedicalRecord = HealthRecord;
export type BookItem = LibraryBook;
export type BookBorrowing = BookLoan;
export type TimetablePeriod = TimetableEntry;

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  currentTerm: 'Term 1' | 'Term 2' | 'Term 3';
  currency: string;
  timezone: string;
  gradingType: 'Percentage' | 'Letter' | 'Competency' | 'GPA';
  smsSenderId: string;
  twoFactorEnabled: boolean;
}
