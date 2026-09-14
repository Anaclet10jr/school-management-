import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { User, Student, Teacher, ClassSection, Subject, MarkEntry, ReportCard, Payment, AttendanceRecord, Announcement, DisciplineRecord, MedicalRecord, AdmissionApplication, BookBorrowing, SchoolSettings, TimetableEntry, Assignment } from './types';
import { Language, translations } from './locales/translations';

// Layout & Auth components
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { RoleDashboards } from './components/dashboard/RoleDashboards';

// Specialized modules
import { StudentManagement } from './components/students/StudentManagement';
import { TeacherManagement } from './components/staff/TeacherManagement';
import { ClassSectionManagement } from './components/academics/ClassSectionManagement';
import { SubjectManagement } from './components/academics/SubjectManagement';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { ExamMarkManagement } from './components/exams/ExamMarkManagement';
import { ReportCardModule } from './components/reports/ReportCardModule';
import { FeesManagement } from './components/fees/FeesManagement';
import { TimetableManagement } from './components/timetable/TimetableManagement';
import { AdmissionsModule } from './components/admissions/AdmissionsModule';
import { WelfareAndDiscipline } from './components/welfare/WelfareAndDiscipline';
import { LibraryManagement } from './components/library/LibraryManagement';
import { AssignmentsModule } from './components/academics/AssignmentsModule';
import { AnnouncementsModule } from './components/communication/AnnouncementsModule';
import { AuditLogModule } from './components/audit/AuditLogModule';
import { SettingsAndSetupWizard } from './components/settings/SettingsAndSetupWizard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [classes, setClasses] = useState<ClassSection[]>(() => StorageService.getClasses());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [gradingScales, setGradingScales] = useState(() => StorageService.getGradingScales());
  const [marks, setMarks] = useState<MarkEntry[]>(() => StorageService.getMarks());
  const [reportCards, setReportCards] = useState<ReportCard[]>(() => StorageService.getReportCards());
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => StorageService.getTimetable());
  const [payments, setPayments] = useState<Payment[]>(() => StorageService.getPayments());
  const [feeStructures, setFeeStructures] = useState(() => StorageService.getFeeStructures());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>(() => StorageService.getDiscipline());
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => StorageService.getMedical());
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => StorageService.getAdmissions());
  const [books, setBooks] = useState(() => StorageService.getBooks());
  const [borrowings, setBorrowings] = useState<BookBorrowing[]>(() => StorageService.getBorrowings());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [settings, setSettings] = useState<SchoolSettings>(() => StorageService.getSettings());
  const [auditLogs, setAuditLogs] = useState(() => StorageService.getAuditLogs());

  // Handle Login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    StorageService.setCurrentUser(null);
  };

  // Switch Active User / Demo Persona
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  // ==================== DATA MUTATION HANDLERS ====================

  // Students
  const handleAddStudent = (student: Student) => {
    StorageService.saveStudent(student);
    setStudents(StorageService.getStudents());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateStudent = (student: Student) => {
    StorageService.saveStudent(student);
    setStudents(StorageService.getStudents());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDeleteStudent = (studentId: string) => {
    StorageService.deleteStudent(studentId);
    setStudents(StorageService.getStudents());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Teachers
  const handleAddTeacher = (teacher: Teacher) => {
    StorageService.saveTeacher(teacher);
    setTeachers(StorageService.getTeachers());
  };

  // Classes
  const handleAddClass = (newCls: ClassSection) => {
    StorageService.saveClass(newCls);
    setClasses(StorageService.getClasses());
  };

  // Subjects
  const handleAddSubject = (newSubject: Subject) => {
    StorageService.saveSubject(newSubject);
    setSubjects(StorageService.getSubjects());
  };

  // Marks
  const handleSaveMark = (mark: MarkEntry) => {
    StorageService.saveMark(mark);
    setMarks(StorageService.getMarks());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Report Cards
  const handleUpdateReportCard = (card: ReportCard) => {
    StorageService.saveReportCard(card);
    setReportCards(StorageService.getReportCards());
  };

  // Timetable
  const handleSaveTimetable = (entries: TimetableEntry[]) => {
    StorageService.saveTimetable(entries);
    setTimetable(StorageService.getTimetable());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Payments
  const handleAddPayment = (payment: Payment) => {
    StorageService.savePayment(payment);
    setPayments(StorageService.getPayments());
    setStudents(StorageService.getStudents()); // refresh balance updates
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Attendance
  const handleSaveAttendanceBatch = (records: AttendanceRecord[]) => {
    StorageService.recordAttendanceBatch(records);
    setAttendanceRecords(StorageService.getAttendance());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Announcements
  const handleAddAnnouncement = (ann: Announcement) => {
    StorageService.saveAnnouncement(ann);
    setAnnouncements(StorageService.getAnnouncements());
  };

  // Admissions
  const handleApproveAdmission = (app: AdmissionApplication) => {
    const updated = { ...app, status: 'Approved' as const };
    StorageService.saveAdmission(updated);
    // Create new student
    const names = app.applicantName ? app.applicantName.split(' ') : ['New', 'Student'];
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentId: `SCH-2026-${String(students.length + 1).padStart(5, '0')}`,
      admissionNumber: app.applicationNumber || `ADM-${Date.now().toString().slice(-4)}`,
      firstName: app.firstName || names[0] || 'New',
      lastName: app.lastName || names.slice(1).join(' ') || 'Student',
      gender: app.gender || 'Female',
      dateOfBirth: app.dateOfBirth || '2010-01-01',
      nationality: 'Rwandan',
      address: 'Kigali',
      status: 'Active',
      educationLevel: app.educationLevel || app.applyingLevel || 'O-Level',
      classId: 'cls-olevel-s1a',
      className: app.appliedClass || app.applyingClass || 'S1 A',
      section: 'A',
      academicYear: '2025-2026',
      admissionDate: new Date().toISOString().split('T')[0],
      category: app.category || 'Day',
      attendanceRate: 100,
      feeBalance: 0,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      guardians: [
        {
          id: `grd-${Date.now()}`,
          name: app.parentName,
          relationship: 'Parent',
          phone: app.parentPhone,
          email: app.parentEmail,
          address: 'Kigali',
          occupation: 'Civil Servant',
          emergencyContact: true,
        },
      ],
    };
    StorageService.saveStudent(newStudent);
    setAdmissions(StorageService.getAdmissions());
    setStudents(StorageService.getStudents());
  };

  const handleRejectAdmission = (id: string) => {
    const app = admissions.find((a) => a.id === id);
    if (app) {
      StorageService.saveAdmission({ ...app, status: 'Rejected' });
      setAdmissions(StorageService.getAdmissions());
    }
  };

  // Discipline & Medical
  const handleAddDiscipline = (r: DisciplineRecord) => {
    StorageService.saveDisciplineRecord(r);
    setDisciplineRecords(StorageService.getDiscipline());
  };

  const handleAddMedical = (m: MedicalRecord) => {
    StorageService.saveMedical(m);
    setMedicalRecords(StorageService.getMedical());
  };

  // Library
  const handleBorrowBook = (borrowing: BookBorrowing) => {
    StorageService.saveBorrowing(borrowing);
    setBorrowings(StorageService.getBorrowings());
  };

  const handleReturnBook = (borrowingId: string) => {
    const found = borrowings.find((b) => b.id === borrowingId);
    if (found) {
      StorageService.saveBorrowing({
        ...found,
        status: 'Returned',
        returnDate: new Date().toISOString().split('T')[0],
      });
      setBorrowings(StorageService.getBorrowings());
    }
  };

  // Assignments
  const handleAddAssignment = (newAssignment: Assignment) => {
    const updated = [newAssignment, ...assignments];
    StorageService.saveAssignments(updated);
    setAssignments(updated);
  };

  // Settings
  const handleUpdateSettings = (newSettings: SchoolSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // If not logged in, render the login page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLogin}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  // Render the appropriate main content based on the active tab and user role
  const renderContent = () => {
    if (currentTab === 'dashboard') {
      const isAdminRole =
        currentUser.role === 'Super Administrator' ||
        currentUser.role === 'School Administrator' ||
        currentUser.role === 'Head Teacher' ||
        currentUser.role === 'Academic Director';

      if (isAdminRole) {
        return (
          <AdminDashboard
            students={students}
            teachers={teachers}
            classes={classes}
            payments={payments}
            announcements={announcements}
            marks={marks}
            reportCards={reportCards}
            timetable={timetable}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
            }}
            language={language}
          />
        );
      }

      return (
        <RoleDashboards
          role={currentUser.role}
          students={students}
          teacher={teachers[0]}
          reportCards={reportCards}
          payments={payments}
          timetable={timetable}
          assignments={assignments}
          announcements={announcements}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
          }}
          onViewReportCard={() => {
            setCurrentTab('reports');
          }}
        />
      );
    }

    switch (currentTab) {
      case 'students':
        return (
          <StudentManagement
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            language={language}
          />
        );
      case 'teachers':
        return (
          <TeacherManagement
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            language={language}
          />
        );
      case 'classes':
        return (
          <ClassSectionManagement
            classes={classes}
            onAddClass={handleAddClass}
            language={language}
          />
        );
      case 'subjects':
        return (
          <SubjectManagement
            subjects={subjects}
            onAddSubject={handleAddSubject}
            language={language}
          />
        );
      case 'attendance':
        return (
          <AttendanceManagement
            students={students}
            classes={classes}
            onSaveAttendanceBatch={handleSaveAttendanceBatch}
            language={language}
          />
        );
      case 'exams':
      case 'marks':
        return (
          <ExamMarkManagement
            students={students}
            subjects={subjects}
            classes={classes}
            marks={marks}
            gradingScales={gradingScales}
            onSaveMark={handleSaveMark}
            language={language}
          />
        );
      case 'reports':
        return (
          <ReportCardModule
            reportCards={reportCards}
            students={students}
            settings={settings}
            onUpdateReportCard={handleUpdateReportCard}
            language={language}
          />
        );
      case 'fees':
      case 'payments':
        return (
          <FeesManagement
            payments={payments}
            students={students}
            feeStructures={feeStructures}
            onAddPayment={handleAddPayment}
            initialTab={currentTab === 'payments' ? 'payments' : 'structures'}
            language={language}
          />
        );
      case 'timetable':
        return (
          <TimetableManagement
            periods={timetable}
            classes={classes}
            teachers={teachers}
            subjects={subjects}
            onSaveTimetable={handleSaveTimetable}
            language={language}
          />
        );
      case 'admissions':
        return (
          <AdmissionsModule
            applications={admissions}
            onApproveApplication={handleApproveAdmission}
            onRejectApplication={handleRejectAdmission}
            language={language}
          />
        );
      case 'welfare':
      case 'discipline':
        return (
          <WelfareAndDiscipline
            disciplineRecords={disciplineRecords}
            medicalRecords={medicalRecords}
            students={students}
            onAddDiscipline={handleAddDiscipline}
            onAddMedical={handleAddMedical}
            language={language}
          />
        );
      case 'library':
        return (
          <LibraryManagement
            books={books}
            borrowings={borrowings}
            onBorrowBook={handleBorrowBook}
            onReturnBook={handleReturnBook}
            language={language}
          />
        );
      case 'assignments':
        return (
          <AssignmentsModule
            assignments={assignments}
            classes={classes}
            subjects={subjects}
            teachers={teachers}
            onAddAssignment={handleAddAssignment}
            language={language}
          />
        );
      case 'announcements':
        return (
          <AnnouncementsModule
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            language={language}
          />
        );
      case 'audit':
        return <AuditLogModule logs={auditLogs} language={language} />;
      case 'setup':
      case 'settings':
        return (
          <SettingsAndSetupWizard
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            initialTab={currentTab === 'setup' ? 'wizard' : 'settings'}
            language={language}
          />
        );
      default:
        return (
          <AdminDashboard
            students={students}
            teachers={teachers}
            classes={classes}
            payments={payments}
            attendance={attendanceRecords}
            announcements={announcements}
            onNavigate={setCurrentTab}
            language={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
        onSwitchUser={handleSwitchUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        settings={settings}
        allUsers={StorageService.getUsers()}
        studentsCount={students.length}
        onOpenSetupWizard={() => setCurrentTab('settings')}
        onGlobalSearchSelect={(type) => {
          if (type === 'student') setCurrentTab('students');
          else if (type === 'teacher') setCurrentTab('teachers');
          else if (type === 'class') setCurrentTab('classes');
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          userRole={currentUser.role}
          currentRole={currentUser.role}
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setIsSidebarOpen(false);
          }}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsSidebarOpen(false);
          }}
          language={language}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
