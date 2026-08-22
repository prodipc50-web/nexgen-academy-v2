import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Admission, Student, Course, Batch } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  ShieldCheck,
  ArrowLeft,
  Edit3,
  RotateCcw,
  Save,
  Check,
  Phone,
  Building,
  MapPin,
  Globe,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  Video,
  Monitor
} from 'lucide-react';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  admissionId?: string;
  studentId?: string;
  student?: Student;
  admission?: Admission;
  course?: Course;
  batch?: Batch;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  isOpen,
  onClose,
  admissionId,
  studentId,
  student: propStudent,
  admission: propAdmission,
  course: propCourse,
  batch: propBatch
}) => {
  const {
    admissions,
    students,
    courses,
    batches,
    staffList,
    academySettings,
    updateAcademySettings
  } = useAcademy();

  const [showEditor, setShowEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Find target admission & student
  const admission = propAdmission || (admissionId
    ? admissions.find(a => a.id === admissionId || a.admissionCode === admissionId)
    : studentId
    ? admissions.find(a => a.studentId === studentId)
    : admissions[0]);

  const student = propStudent || (admission
    ? students.find(s => s.id === admission.studentId)
    : studentId
    ? students.find(s => s.id === studentId)
    : students[0]);

  const course = propCourse || (admission ? courses.find(c => c.id === admission.courseId) : courses[0]);
  const batch = propBatch || (admission ? batches.find(b => b.id === admission.batchId) : batches[0]);
  const counselor = admission ? staffList.find(s => s.id === admission.counselorId) : undefined;

  // Fully customizable form state
  const [formData, setFormData] = useState({
    instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
    tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
    campusName: academySettings.campusName || 'Farmgate Campus',
    address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
    hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
    email: academySettings.officialEmail || 'info@nexgenacademy.edu.bd',
    formNumber: admission?.admissionCode || 'NCA-ADM-2026-001',
    admissionDate: admission?.admissionDate || new Date().toISOString().split('T')[0],
    
    // Student Personal
    name: student?.name || '',
    studentCode: student?.studentCode || 'NCA-STU-001',
    phone: student?.phone || '',
    altPhone: student?.altPhone || '',
    studentEmail: student?.email || '',
    addressText: student?.address || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || 'Male',
    bloodGroup: student?.bloodGroup || 'A+',
    occupation: student?.occupation || 'Student',
    education: student?.education || 'HSC',
    institution: student?.institution || '',
    photoUrl: student?.photoUrl || '',

    // Guardian
    guardianName: student?.guardianName || '',
    guardianPhone: student?.guardianPhone || student?.emergencyContact || '',
    relation: 'Parent / Guardian',

    // Academic & Learning Mode
    courseName: course?.name || 'Professional IT Course',
    courseCode: course?.code || 'NCA-CRS-01',
    duration: course?.duration || '3 Months (36 Classes)',
    batchNumber: batch?.batchNumber || 'Batch-01',
    classSchedule: batch ? `${batch.classDays} (${batch.classTime})` : 'Sun, Tue, Thu (6:00 PM - 8:00 PM)',
    learningMode: admission?.learningMode || (course?.deliveryMode || 'Offline'), // 'Offline' | 'Online Live' | 'Hybrid'
    admissionType: admission?.admissionType || 'In-Person / Office',
    onlinePlatform: batch?.onlinePlatform || 'Google Meet / Zoom & LMS Portal',
    counselorName: admission?.counselorName || counselor?.name || 'Academic Counselor',
    leadSource: admission?.leadSource || 'Direct Campus Walk-in',

    // Financial Record
    regularFee: admission?.regularFee || course?.regularFee || 15000,
    discountScholarship: (admission?.discount || 0) + (admission?.scholarship || 0),
    finalFee: admission?.finalFee || course?.offerFee || 12000,
    paidAmount: admission?.totalPaid || 6000,
    dueBalance: admission?.due ?? 6000,
    nextDueDate: admission?.nextPaymentDate || '',
    paymentMethod: 'Cash / Mobile Banking',

    // Terms & Conditions
    terms: academySettings.admissionFormTerms || 
      '1. Minimum 80% class attendance & timely lab assignment submissions are mandatory for certification.\n' +
      '2. Online students must ensure a stable internet connection and active microphone/webcam when requested.\n' +
      '3. Course fees once paid are non-refundable after the official batch orientation class.\n' +
      '4. Any violation of institute code of conduct or unauthorized sharing of recorded materials will result in immediate suspension.\n' +
      '5. I hereby declare that the information provided above is true and correct to the best of my knowledge.',
    
    // Signatures
    directorName: academySettings.idCardSignatoryName || 'Prodip Chowdhury',
    directorTitle: 'Authorized Officer / Director',
    counselorTitle: 'Counselor / Admission In-Charge'
  });

  // Sync state on prop changes
  useEffect(() => {
    if (admission || student) {
      setFormData(prev => ({
        ...prev,
        instituteName: academySettings.instituteName || prev.instituteName,
        tagline: academySettings.tagline || prev.tagline,
        campusName: academySettings.campusName || prev.campusName || 'Farmgate Campus',
        address: academySettings.officialAddress || prev.address,
        hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || prev.hotlinePhone || '01798444444',
        website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : prev.website,
        email: academySettings.officialEmail || prev.email,
        formNumber: admission?.admissionCode || prev.formNumber,
        admissionDate: admission?.admissionDate || prev.admissionDate,
        name: student?.name || prev.name,
        studentCode: student?.studentCode || prev.studentCode,
        phone: student?.phone || prev.phone,
        altPhone: student?.altPhone || prev.altPhone,
        studentEmail: student?.email || prev.studentEmail,
        addressText: student?.address || prev.addressText,
        dateOfBirth: student?.dateOfBirth || prev.dateOfBirth,
        gender: student?.gender || prev.gender,
        bloodGroup: student?.bloodGroup || prev.bloodGroup,
        occupation: student?.occupation || prev.occupation,
        education: student?.education || prev.education,
        institution: student?.institution || prev.institution,
        photoUrl: student?.photoUrl || prev.photoUrl,
        guardianName: student?.guardianName || prev.guardianName,
        guardianPhone: student?.guardianPhone || student?.emergencyContact || prev.guardianPhone,
        courseName: course?.name || prev.courseName,
        courseCode: course?.code || prev.courseCode,
        duration: course?.duration || prev.duration,
        batchNumber: batch?.batchNumber || prev.batchNumber,
        classSchedule: batch ? `${batch.classDays} (${batch.classTime})` : prev.classSchedule,
        learningMode: admission?.learningMode || prev.learningMode,
        admissionType: admission?.admissionType || prev.admissionType,
        counselorName: admission?.counselorName || counselor?.name || prev.counselorName,
        leadSource: admission?.leadSource || prev.leadSource,
        regularFee: admission?.regularFee || course?.regularFee || prev.regularFee,
        discountScholarship: (admission?.discount || 0) + (admission?.scholarship || 0),
        finalFee: admission?.finalFee || course?.offerFee || prev.finalFee,
        paidAmount: admission?.totalPaid || prev.paidAmount,
        dueBalance: admission?.due ?? prev.dueBalance,
        nextDueDate: admission?.nextPaymentDate || prev.nextDueDate,
        directorName: academySettings.idCardSignatoryName || prev.directorName
      }));
    }
  }, [admission, student, course, batch, counselor, academySettings, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDefaults = () => {
    updateAcademySettings({
      primarySupportPhone: formData.hotlinePhone,
      campusName: formData.campusName,
      officialAddress: formData.address,
      admissionFormTerms: formData.terms,
      idCardSignatoryName: formData.directorName
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Toolbar (Hidden on print) */}
        <div className="sticky top-0 z-20 p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>← Back</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                showEditor
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>{showEditor ? 'Hide Editor' : 'Edit / Customize Form (ম্যানুয়াল এডিট)'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Defaults</span>
              </span>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Form (প্রিন্ট করুন)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customizer Drawer */}
        {showEditor && (
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-80 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Admission Form Editor (প্রিন্ট করার আগে যেকোনো ফিল্ড এডিট করুন)</span>
              </span>
              <button
                type="button"
                onClick={handleSaveDefaults}
                className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
              >
                <Save className="w-3 h-3" />
                <span>Save Terms as Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alternative Phone</label>
                <input
                  type="text"
                  value={formData.altPhone}
                  onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.studentEmail}
                  onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course Name</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Number</label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Learning Mode (ক্লাস নেওয়ার ধরন)</label>
                <select
                  value={formData.learningMode}
                  onChange={e => setFormData({ ...formData, learningMode: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                >
                  <option value="Offline">Offline / Classroom (ক্যাম্পাস ল্যাব)</option>
                  <option value="Online Live">Online Live Class (অনলাইন লাইভ)</option>
                  <option value="Hybrid">Hybrid (Offline + Online Live)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Total Agreed Fee (৳)</label>
                <input
                  type="number"
                  value={formData.finalFee}
                  onChange={e => setFormData({ ...formData, finalFee: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Due Balance (৳)</label>
                <input
                  type="number"
                  value={formData.dueBalance}
                  onChange={e => setFormData({ ...formData, dueBalance: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.addressText}
                  onChange={e => setFormData({ ...formData, addressText: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Admission Terms & Declaration</label>
                <textarea
                  rows={3}
                  value={formData.terms}
                  onChange={e => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printable A4 Form Sheet */}
        <div
          className="overflow-y-auto flex-1 p-5 sm:p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0 print-page-a4"
          id="admission-form-printable"
        >
          {/* Header Banner with Logo & Passport Photo Box */}
          <div className="flex items-start justify-between border-b-2 border-indigo-950 pb-3">
            <div className="flex items-center space-x-3 flex-1">
              <NexgenLogo variant="crest" size={54} />
              <div>
                <h1 className="text-xl font-black text-indigo-950 uppercase tracking-tight leading-none">
                  {formData.instituteName}
                </h1>
                <p className="text-[10px] text-slate-600 font-bold tracking-wide mt-0.5">
                  {formData.tagline}
                </p>
                <p className="text-[9.5px] text-slate-600 font-medium mt-1">
                  <strong className="text-indigo-950">{formData.campusName}</strong>: {formData.address} | Hotline: <strong className="text-slate-950 font-mono">{formData.hotlinePhone}</strong> | <span className="text-indigo-700 font-mono">{formData.website}</span>
                </p>
              </div>
            </div>

            {/* Passport Photo Box */}
            <div className="w-24 h-28 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center p-1 bg-slate-50 text-center shrink-0 ml-3">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-[9px] text-slate-400 font-semibold leading-tight">
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                  Affix Passport Size Photo (35×45mm)
                </div>
              )}
            </div>
          </div>

          {/* Form Title & Reg Meta */}
          <div className="flex items-center justify-between my-2.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-300">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-900 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wide">
                STUDENT ADMISSION & REGISTRATION FORM
              </span>
              <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Mode: {formData.learningMode === 'Online Live' ? '🟢 Online Live Interactive' : formData.learningMode === 'Hybrid' ? '🟣 Hybrid (Lab + Online)' : '🔵 Offline / Campus Lab'}
              </span>
            </div>
            <div className="text-right text-[10.5px] text-slate-700 space-x-3">
              <span>Form No: <strong className="font-mono text-indigo-950">{formData.formNumber}</strong></span>
              <span>Date: <strong className="font-mono text-slate-900">{formData.admissionDate}</strong></span>
            </div>
          </div>

          {/* 1. Student Personal Information */}
          <div className="space-y-1 mt-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>1. STUDENT PERSONAL INFORMATION (শিক্ষার্থীর ব্যক্তিগত বিবরণ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 text-[11px] grid grid-cols-3 gap-x-4 gap-y-1.5 bg-slate-50/50">
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] block">Full Name of Student (শিক্ষার্থীর নাম):</span>
                <span className="font-bold text-slate-950 text-xs">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Student ID Code (আইডি):</span>
                <span className="font-mono font-bold text-indigo-900">{formData.studentCode || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Mobile Number (ফোন):</span>
                <span className="font-mono font-bold text-slate-900">{formData.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Alternative Phone (বিকল্প ফোন):</span>
                <span className="font-mono text-slate-800">{formData.altPhone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Email Address (ইমেইল):</span>
                <span className="font-mono text-slate-800 text-[10px] truncate block">{formData.studentEmail || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Date of Birth (জন্ম তারিখ):</span>
                <span className="font-mono text-slate-800">{formData.dateOfBirth || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Gender (লিঙ্গ):</span>
                <span className="font-semibold text-slate-900">{formData.gender || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Blood Group (রক্তের গ্রুপ):</span>
                <span className="font-bold text-rose-700">{formData.bloodGroup || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Occupation (পেশা):</span>
                <span className="font-medium text-slate-800">{formData.occupation || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Education (শিক্ষাগত যোগ্যতা):</span>
                <span className="font-medium text-slate-800">{formData.education || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">School/College/Institute:</span>
                <span className="font-medium text-slate-800 truncate block">{formData.institution || '—'}</span>
              </div>

              <div className="col-span-3">
                <span className="text-slate-500 text-[10px] block">Present & Permanent Address (ঠিকানা):</span>
                <span className="font-medium text-slate-900">{formData.addressText || '—'}</span>
              </div>
            </div>
          </div>

          {/* 2. Guardian & Emergency Contact */}
          <div className="space-y-1 mt-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>2. GUARDIAN & EMERGENCY CONTACT (অভিভাবক ও জরুরি যোগাযোগ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 text-[11px] grid grid-cols-3 gap-x-4 gap-y-1.5 bg-slate-50/50">
              <div>
                <span className="text-slate-500 text-[10px] block">Guardian Name (অভিভাবকের নাম):</span>
                <span className="font-bold text-slate-900">{formData.guardianName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Relationship (সম্পর্ক):</span>
                <span className="font-medium text-slate-800">{formData.relation || 'Parent'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Guardian Contact Phone:</span>
                <span className="font-mono font-bold text-slate-900">{formData.guardianPhone || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Applied Program & Learning Delivery Mode */}
          <div className="space-y-1 mt-2">
            <div className="bg-indigo-900 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>3. ENROLLED COURSE & LEARNING DELIVERY MODE (কোর্স ও ক্লাসের মাধ্যম)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2.5 text-[11px] grid grid-cols-3 gap-x-4 gap-y-2 bg-slate-50/50">
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] block">Enrolled Course (কোর্সের নাম):</span>
                <span className="font-black text-slate-950 text-xs">{formData.courseName}</span>
                <span className="text-[10px] text-slate-500 font-mono block">Code: {formData.courseCode} • Duration: {formData.duration}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Batch & Timings:</span>
                <span className="font-bold text-indigo-950">{formData.batchNumber}</span>
                <span className="text-[10px] text-slate-600 block">{formData.classSchedule}</span>
              </div>

              {/* Delivery Mode Selector Box */}
              <div className="col-span-3 bg-white p-2 rounded-lg border border-indigo-200">
                <span className="text-indigo-950 font-bold text-[10.5px] block mb-1">
                  Selected Learning Delivery Method (ক্লাস করার মাধ্যম):
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className={`p-1.5 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Offline' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Offline' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Offline' ? '✓' : ''}
                    </span>
                    <span>1. Physical / Campus Lab</span>
                  </div>

                  <div className={`p-1.5 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Online Live' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Online Live' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Online Live' ? '✓' : ''}
                    </span>
                    <span>2. Online Live Classes</span>
                  </div>

                  <div className={`p-1.5 rounded border flex items-center space-x-1.5 ${
                    formData.learningMode === 'Hybrid' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                      formData.learningMode === 'Hybrid' ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'border-slate-400'
                    }`}>
                      {formData.learningMode === 'Hybrid' ? '✓' : ''}
                    </span>
                    <span>3. Hybrid (Lab + Online)</span>
                  </div>
                </div>
                <div className="mt-1 text-[9.5px] text-slate-500 flex items-center justify-between">
                  <span>Online Platform: <strong className="text-slate-800">{formData.onlinePlatform}</strong></span>
                  <span>Assigned Counselor: <strong className="text-slate-800">{formData.counselorName}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Financial & Payment Summary Table */}
          <div className="space-y-1 mt-2">
            <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-t flex items-center space-x-1.5">
              <span>4. COURSE FEE STRUCTURE & PAYMENT RECORD (ফি ও পেমেন্ট বিবরণ)</span>
            </div>
            <div className="border border-slate-300 rounded-b p-2 text-[11px] bg-slate-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Regular Course Fee:</span>
                  <span className="font-semibold text-slate-800">৳{formData.regularFee.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Discount / Scholarship:</span>
                  <span className="font-bold text-emerald-700">৳{formData.discountScholarship.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Net Agreed Fee:</span>
                  <span className="font-black text-indigo-950">৳{formData.finalFee.toLocaleString()}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Paid at Admission:</span>
                  <span className="font-black text-emerald-700">৳{formData.paidAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10.5px] bg-amber-50/80 p-1.5 rounded border border-amber-200 text-amber-950">
                <span>
                  Remaining Due Balance: <strong className="font-black text-rose-700 text-xs">৳{formData.dueBalance.toLocaleString()}</strong>
                  {formData.dueBalance === 0 && ' (Full Paid ✓)'}
                </span>
                {formData.dueBalance > 0 && formData.nextDueDate && (
                  <span>Due Commitment Date: <strong className="font-mono text-slate-900">{formData.nextDueDate}</strong></span>
                )}
                <span>Payment Mode: <strong className="text-slate-900">{formData.paymentMethod}</strong></span>
              </div>
            </div>
          </div>

          {/* 5. Terms, Rules & Student Declaration */}
          <div className="mt-2 border border-slate-300 rounded p-2 bg-slate-50/70 text-[10px] text-slate-700">
            <span className="font-bold text-slate-900 uppercase tracking-wider block mb-0.5">
              Code of Conduct & Student Declaration (শর্তাবলি ও শিক্ষার্থীর অঙ্গীকারনামা):
            </span>
            <div className="whitespace-pre-line leading-relaxed text-slate-600">
              {formData.terms}
            </div>
          </div>

          {/* 6. Signatures */}
          <div className="pt-6 mt-3 border-t border-slate-300 grid grid-cols-3 gap-6 items-end text-center text-xs">
            <div>
              <div className="h-7 border-b border-slate-400 w-36 mx-auto mb-1"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase">Student / Applicant Signature</span>
              <p className="text-[9px] text-slate-400">Date: {formData.admissionDate}</p>
            </div>

            <div>
              <div className="h-7 border-b border-slate-400 w-36 mx-auto mb-1 flex items-center justify-center">
                <span className="text-[11px] font-serif italic text-slate-700">{formData.counselorName}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 uppercase">{formData.counselorTitle}</span>
              <p className="text-[9px] text-slate-400">Nexgen Computer Academy</p>
            </div>

            <div>
              <div className="h-7 border-b border-indigo-900 w-40 mx-auto mb-1 flex items-center justify-center">
                <span className="text-[11px] font-serif italic font-bold text-indigo-950">{formData.directorName}</span>
              </div>
              <span className="text-[10px] font-black text-indigo-950 uppercase">{formData.directorTitle}</span>
              <p className="text-[9px] text-indigo-800 font-semibold">Official Seal & Approval</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
            Generated via Nexgen IT Academy Enterprise Management System • Hotline: {formData.hotlinePhone} • {formData.website}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back (ফিরে যান)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Admission Form (ভর্তি ফরম প্রিন্ট)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
