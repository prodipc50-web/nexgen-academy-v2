export type UserRole =
  | 'SUPER_ADMIN'
  | 'MANAGER'
  | 'COUNSELOR'
  | 'ACCOUNTS_STAFF'
  | 'TRAINER'
  | 'ADMIN'
  | 'ACCOUNTS';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  avatar: string;
  phone: string;
  lastLogin?: string;
}

export interface AcademySettings {
  instituteName: string;
  tagline: string;
  campusName?: string; // default 'Farmgate Campus'
  primarySupportPhone?: string; // default '01798444444'
  officialAddress: string;
  officialEmail: string;
  helplines: string[];
  websiteUrl: string;
  certificateVerificationBaseUrl?: string; // default 'https://nexgenacademy.edu.bd/verify/'
  idCardSignatoryName?: string; // default 'Prodip Chowdhury'
  idCardSignatoryTitle?: string; // default 'Authorized Signatory'
  admitCardControllerName?: string; // default 'Exam Controller'
  idCardTerms?: string;
  admitCardInstructions?: string;
  logoIconSize: number; // default 48
  logoFontSize: number; // default 16
  taglineFontSize: number; // default 11
  customLogoUrl?: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Demo Scheduled'
  | 'Demo Attended'
  | 'Follow-up'
  | 'Admission Pending'
  | 'Admitted'
  | 'Not Interested'
  | 'Lost';

export type ContactMethod =
  | 'Phone'
  | 'Phone Call'
  | 'WhatsApp'
  | 'Messenger'
  | 'SMS'
  | 'Office Visit'
  | 'In-Person Visit'
  | 'Email'
  | 'Other';

export type FollowUpMethod = ContactMethod;

export type FollowUpResult =
  | 'Interested'
  | 'Call Back Later'
  | 'Wants Discount'
  | 'Wants Different Batch'
  | 'Family Discussion'
  | 'Payment Issue'
  | 'Not Interested'
  | 'Admitted'
  | 'Other';

export interface FollowUp {
  id: string;
  leadId: string;
  date: string;
  time?: string;
  staffId?: string;
  counselorId?: string;
  staffName?: string;
  contactMethod?: ContactMethod | string;
  method?: ContactMethod | string;
  conversationSummary?: string;
  notes?: string;
  result: FollowUpResult;
  nextFollowUpDate?: string;
  nextAction?: string;
  status?: 'Completed' | 'Pending' | 'Rescheduled';
  createdAt?: string;
}

export type OccupationType =
  | 'Student'
  | 'Job Holder'
  | 'Job Seeker'
  | 'Housewife'
  | 'Business Owner'
  | 'Freelancer'
  | 'Other'
  | (string & {});

export type StudentGoal =
  | 'Job'
  | 'Freelancing'
  | 'Business'
  | 'Academic'
  | 'Personal Skill Development'
  | 'Career Change'
  | 'Other'
  | (string & {});

export interface Lead {
  id: string;
  leadCode: string; // e.g. NCA-LD-1042
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address?: string;
  occupation: OccupationType;
  educationLevel: string;
  institution?: string;
  interestedCourseId: string;
  interestedBatchId?: string;
  preferredTime?: string;
  leadSource: string;
  campaignId?: string;
  counselorId: string;
  counselorName?: string; // Manual Counselor Name
  visitDate: string;
  firstContactDate: string;
  comments?: string;
  requirements?: string;
  budget?: number;
  status: LeadStatus;
  lostReason?: string;
  nextFollowUpDate?: string;
  nextFollowUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentStatus = 'Active' | 'At Risk' | 'Dropped' | 'Completed' | 'Alumni' | 'On Hold' | (string & {});

export interface StudentDocument {
  id: string;
  title: string;
  type: 'NID' | 'Photo' | 'Certificate' | 'Admission Form' | 'Receipt' | 'Other';
  url: string;
  uploadedAt: string;
}

export interface StudentTimelineEvent {
  id: string;
  date: string;
  type: 'Contact' | 'Admission' | 'Payment' | 'Attendance' | 'Exam' | 'Certificate' | 'Batch Transfer' | 'Status Change' | 'Note';
  title: string;
  description: string;
  performedBy: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g. NCA-STU-2026-042
  leadId?: string;
  name: string;
  photoUrl?: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  dateOfBirth?: string;
  admissionDate?: string;
  gender: 'Male' | 'Female' | 'Other';
  occupation: OccupationType;
  education: string;
  bloodGroup?: string;
  institution?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact?: string;
  counselorId?: string;
  counselorName?: string; // Manual Counselor Name
  studentGoal: StudentGoal;
  status: StudentStatus;
  dropReason?: string;
  dropDate?: string;
  alumniJob?: string;
  alumniFreelancingStatus?: string;
  alumniSkills?: string[];
  referralCode?: string;
  notes?: string;
  documents?: StudentDocument[];
  timeline?: StudentTimelineEvent[];
  createdAt: string;
}

export type CourseStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived';
export type DurationUnit = 'Days' | 'Weeks' | 'Months';

export interface CourseModule {
  id: string;
  moduleNumber: number;
  moduleName: string;
  moduleDescription?: string;
  topics: string[];
  estimatedClasses?: number;
  learningOutcomes?: string[];
}

export interface Course {
  id: string;
  code: string; // e.g. NCA-CRS-01
  name: string;
  shortName?: string;
  category: string;
  description: string;
  thumbnailUrl?: string;
  status: CourseStatus;

  // Duration
  durationValue?: number;
  durationUnit?: DurationUnit;
  duration: string; // e.g. "3 Months" or "12 Weeks"
  durationWeeks?: number;
  durationMonths?: number;
  totalClasses: number;
  classDuration?: string; // e.g. "2 Hours"
  totalHours?: number;

  // Fees (Defaults for new admissions)
  regularFee: number;
  offerFee: number;
  discount?: number;
  scholarshipAvailable?: boolean;
  maxScholarship?: number;
  minInstallmentAmount?: number;

  // Curriculum & Modules
  modules?: CourseModule[];
  curriculumHighlights?: string[];
  syllabusHighlights?: string[];

  // Learning Features
  learningFeatures?: string[];

  // Trainers
  trainerId?: string; // primary trainer for backwards compat
  trainerIds?: string[]; // multiple assigned trainers

  // Prerequisites
  requiredSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'No Prior Knowledge' | string;
  previousCourse?: string;
  minimumEducation?: string;
  recommendedAge?: string;
  requiredSoftwareHardware?: string;

  // Target Audience
  targetAudience?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export type BatchStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface Batch {
  id: string;
  batchNumber: string; // e.g. "GD-006"
  courseId: string;
  trainerId?: string;
  trainerName?: string; // Manual Trainer Name
  startDate: string;
  endDate?: string;
  classDays: string; // e.g. "Sun, Tue, Thu"
  classTime: string; // e.g. "6:00 PM - 8:00 PM"
  room: string;
  seatCapacity: number;
  status: BatchStatus;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Card' | 'Rocket' | 'Upay' | 'Other' | (string & {});

export interface InstallmentMilestone {
  id?: string;
  installmentNo?: number;
  installmentNumber?: number;
  title?: string;
  dueDate: string;
  amount: number;
  paidAmount?: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  paymentDate?: string;
  receiptNumber?: string;
}

export interface Admission {
  id: string;
  admissionCode: string; // e.g. NCA-ADM-2026-105
  admissionNumber?: string;
  studentId: string;
  courseId: string;
  batchId: string;
  admissionDate: string;
  counselorId: string;
  counselorName?: string; // Manual Counselor Name
  leadSource: string;
  campaignId?: string;
  referral?: string;
  regularFee: number;
  discount: number;
  scholarship: number;
  finalFee: number;
  totalPaid: number;
  due: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue';
  status?: string;
  nextPaymentDate?: string;
  nextDueDate?: string;
  installments?: InstallmentMilestone[];
  remarks?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. NCA-REC-2026-8802
  studentId: string;
  admissionId: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  installmentNumber: number;
  collectedBy: string;
  note?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ClassSchedule {
  id: string;
  batchId: string;
  courseId?: string;
  trainerId: string;
  trainerName?: string; // Manual Trainer Name
  classNumber?: number;
  date: string;
  dayOfWeek?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  topic: string;
  room: string;
  roomId?: string;
  classNotes?: string;
  assignment?: string;
  recordingLink?: string;
  materialsLink?: string;
  meetingUrl?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Ongoing';
}

export interface Exam {
  id: string;
  examCode: string;
  title: string;
  batchId: string;
  courseId: string;
  examDate: string;
  totalMarks: number;
  passMarks: number;
  description?: string;
  status?: 'Scheduled' | 'Completed' | 'Published' | 'Cancelled';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F';
  passFail: 'Pass' | 'Fail';
  feedback?: string;
  remarks?: string;
}

export interface Certificate {
  id: string;
  certificateCode: string; // e.g. NCA-CERT-2026-8941
  certificateNumber?: string;
  studentId: string;
  courseId: string;
  batchId: string;
  issueDate: string;
  completionDate: string;
  grade: string;
  verificationId: string; // Unique URL or verification key
  status: 'Issued' | 'Draft' | 'Revoked';
  instructorSignatureName: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Office Rent'
  | 'Electricity'
  | 'Utility & Electricity'
  | 'Internet'
  | 'Internet / Broadband'
  | 'Trainer Salary'
  | 'Trainer Remuneration'
  | 'Staff Salary'
  | 'Marketing'
  | 'Marketing & Meta Ads'
  | 'Facebook Ads'
  | 'Software & AI Subscriptions'
  | 'Hardware Maintenance'
  | 'Equipment'
  | 'Printing'
  | 'Stationery'
  | 'Printing & Stationery'
  | 'Maintenance'
  | 'Refreshment'
  | 'Entertainment & Refreshment'
  | 'Office Cleaning & Sanitation'
  | 'Other'
  | (string & {});

export interface Expense {
  id: string;
  expenseCode: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  paidBy?: string;
  paidTo?: string;
  approvedBy?: string;
  description: string;
  receiptNumber?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'Facebook Ads' | 'Facebook Organic' | 'Instagram' | 'TikTok' | 'YouTube' | 'Google' | 'Website' | 'Walk-in' | 'Referral' | 'Other' | string;
  startDate: string;
  endDate: string;
  adSpend: number;
  budget?: number;
  spent?: number;
  leadsGenerated?: number;
  admissionsCount?: number;
  targetAudience: string;
  status: 'Active' | 'Completed' | 'Paused';
}

export type Campaign = MarketingCampaign;

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  phone: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  designation?: string;
  specialization?: string;
  avatarUrl?: string;
  joiningDate?: string;
  joinDate?: string;
  salary: number;
  lastLogin?: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Resigned' | (string & {});
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  leaveType: 'Casual' | 'Medical' | 'Emergency' | 'Annual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type?: string;
  equipment?: string[];
  facilities?: string[];
  status?: 'Available' | 'Occupied' | 'Maintenance' | (string & {});
}

export interface AssetInventory {
  id: string;
  assetCode: string;
  assetTag?: string;
  name: string;
  category: 'Laptop' | 'Desktop' | 'Projector' | 'Camera' | 'Audio/Sound' | 'Printer' | 'Networking' | 'Furniture' | 'Computer' | 'Display' | 'Network' | 'Audio' | 'Other' | (string & {});
  purchaseDate: string;
  purchaseCost?: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Repair' | 'Maintenance Required' | 'Out of Order' | (string & {});
  assignedTo?: string;
  location?: string;
  room?: string;
  specs?: string;
  status?: 'In Use' | 'Spare' | 'Under Repair' | 'Disposed' | (string & {});
}

export type HardwareAsset = AssetInventory;

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail?: string;
  action: string;
  module: string;
  entity?: string;
  recordId: string;
  description: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export interface StudentPlacement {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentPhoto?: string;
  courseId: string;
  courseName: string;
  batchId?: string;
  batchNumber?: string;
  type: 'Full-time Job' | 'Remote Job' | 'Internship' | 'Freelancing Milestone' | 'Business / Startup';
  companyOrClient: string;
  position: string;
  monthlySalaryOrEarnings: number;
  currency: 'BDT' | 'USD';
  placementDate: string;
  location: string;
  marketplace?: 'Upwork' | 'Fiverr' | 'Local Company' | 'Remote Global' | 'Freelancer.com' | 'Direct Client' | 'Other';
  storyReview?: string;
  portfolioUrl?: string;
  status: 'Active' | 'Verified' | 'Promoted';
  createdAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  batchId: string;
  batchNumber?: string | number;
  courseId: string;
  courseName?: string;
  classNumber?: number;
  assignedDate?: string;
  dueDate: string;
  totalMarks?: number;
  maxMarks?: number;
  description: string;
  materialsUrl?: string;
  attachments?: string[];
  status?: 'Open' | 'Closed' | 'Graded';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  submittedAt: string;
  projectUrl: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  notes?: string;
  marksObtained?: number;
  trainerFeedback?: string;
  feedback?: string;
  status: 'Submitted' | 'Graded' | 'Late' | 'Resubmission Requested';
}

export interface SeminarWorkshop {
  id: string;
  title: string;
  topic?: string;
  courseId?: string;
  courseName?: string;
  category?: string;
  speakerName: string;
  speakerDesignation?: string;
  speakerTitle?: string;
  date: string;
  time: string;
  type?: 'Free Career Seminar' | 'Live Masterclass Workshop' | 'Hands-on Bootcamp' | 'Online Webinar';
  venueType?: 'Physical' | 'Online Zoom' | 'Hybrid' | 'Lab / On-Campus' | 'Online Zoom / Meet';
  room?: string;
  meetingUrl?: string;
  roomOrPlatform?: string;
  isFree?: boolean;
  ticketPrice?: number;
  capacity: number;
  registeredLeads?: string[]; // lead IDs
  registeredCount: number;
  attendedCount: number;
  convertedAdmissionsCount?: number;
  convertedToAdmissionCount?: number;
  bannerUrl?: string;
  description?: string;
  status: 'Upcoming' | 'Live Today' | 'Completed' | 'Cancelled';
}

export interface TrashItem {
  id: string;
  originalId: string;
  itemType:
    | 'student'
    | 'lead'
    | 'admission'
    | 'payment'
    | 'expense'
    | 'course'
    | 'batch'
    | 'staff'
    | 'asset'
    | 'schedule'
    | 'exam'
    | 'examResult'
    | 'certificate'
    | 'attendance'
    | 'placement'
    | 'assignment'
    | 'seminar';
  data: any;
  title: string;
  deletedAt: string;
  deletedBy: string;
}

export interface InstituteSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  website: string;
  logoUrl?: string;
  watermarkUrl?: string;
  directorName: string;
  directorTitle: string;
  sealText?: string;
}

