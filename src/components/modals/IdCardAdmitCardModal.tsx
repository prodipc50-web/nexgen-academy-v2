import React, { useState, useRef, useEffect } from 'react';
import { Student, Course, Batch } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  Download,
  CreditCard,
  FileCheck,
  QrCode,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  BookOpen,
  MapPin,
  Sparkles,
  ArrowLeft,
  Upload,
  Edit3,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

interface IdCardAdmitCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  course?: Course;
  batch?: Batch;
  examTitle?: string;
  examDate?: string;
  examTime?: string;
}

export const IdCardAdmitCardModal: React.FC<IdCardAdmitCardModalProps> = ({
  isOpen,
  onClose,
  student,
  course,
  batch,
  examTitle,
  examDate,
  examTime
}) => {
  const [activeMode, setActiveMode] = useState<'id_card' | 'admit_card'>('id_card');
  const [showEditor, setShowEditor] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Editable ID card fields
  const [cardData, setCardData] = useState({
    name: student?.name || '',
    studentCode: student?.studentCode || '',
    courseName: course?.name || 'Computer Professional Course',
    batchNumber: batch?.batchNumber || 'NCA-01',
    bloodGroup: student?.bloodGroup || 'O+',
    phone: student?.phone || '',
    altPhone: student?.altPhone || '',
    emergencyContact: student?.emergencyContact || student?.guardianPhone || student?.phone || '',
    address: student?.address || '14/B Garden Road, Farmgate, Dhaka-1215',
    photoUrl: student?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    issueDate: new Date().toISOString().split('T')[0],
    expireDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    signatoryName: 'Prodip Chowdhury',
    signatoryTitle: 'Managing Director & CEO',
    instituteName: 'Nexgen Academy',
    instituteFullName: 'Nexgen Computer Academy',
    instituteSupport: '+880 1711-223344',
    website: 'www.nexgenacademy.edu',
    // Admit card specific
    examTitle: examTitle || 'Semester Final Practical & Evaluation Exam',
    examDate: examDate || '2026-08-25',
    examTime: examTime || '10:00 AM - 01:00 PM',
    examRoom: batch?.room || 'Computer Lab-1, Level-4',
    examInstructions: '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
    controllerName: 'Exam Controller'
  });

  // Sync with prop changes
  useEffect(() => {
    if (student) {
      setCardData(prev => ({
        ...prev,
        name: student.name || prev.name,
        studentCode: student.studentCode || prev.studentCode,
        courseName: course?.name || prev.courseName,
        batchNumber: batch?.batchNumber || prev.batchNumber,
        bloodGroup: student.bloodGroup || prev.bloodGroup,
        phone: student.phone || prev.phone,
        altPhone: student.altPhone || prev.altPhone,
        emergencyContact: student.emergencyContact || student.guardianPhone || student.phone || prev.emergencyContact,
        address: student.address || prev.address,
        photoUrl: student.photoUrl || prev.photoUrl,
        examTitle: examTitle || prev.examTitle,
        examDate: examDate || prev.examDate,
        examTime: examTime || prev.examTime,
        examRoom: batch?.room || prev.examRoom
      }));
    }
  }, [student, course, batch, examTitle, examDate, examTime]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCardData(prev => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 my-auto max-h-[96vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>← Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-600/30 rounded-lg border border-indigo-500/30">
                {activeMode === 'id_card' ? (
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                ) : (
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="hidden sm:block">
                <h2 className="text-sm font-bold">
                  {activeMode === 'id_card' ? 'Student ID Card Generator' : 'Official Exam Admit Card'}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMode('id_card')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'id_card'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ID Card
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('admit_card')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'admit_card'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admit Card
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center space-x-2">
            <p className="text-xs text-slate-600 font-medium">
              Student: <span className="font-bold text-slate-800">{cardData.name}</span> ({cardData.studentCode})
            </p>
            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                showEditor
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{showEditor ? 'Hide Field Editor' : 'Edit / Customize Card Fields'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print {activeMode === 'id_card' ? 'ID Card' : 'Admit Card'}</span>
            </button>
          </div>
        </div>

        {/* Editable Form Drawer (when showEditor is active) */}
        {showEditor && (
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-72 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Customize & Override Fields for {activeMode === 'id_card' ? 'Student ID Card' : 'Admit Card'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCardData(prev => ({
                    ...prev,
                    name: student?.name || '',
                    studentCode: student?.studentCode || '',
                    courseName: course?.name || '',
                    batchNumber: batch?.batchNumber || '',
                    bloodGroup: student?.bloodGroup || 'O+',
                    phone: student?.phone || '',
                    photoUrl: student?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                  }));
                }}
                className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Student Record</span>
              </button>
            </div>

            {/* Photo Upload Section */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={cardData.photoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-12 h-14 object-cover rounded-lg border border-slate-300"
                />
                <div>
                  <label className="font-bold text-slate-800 block text-xs">
                    Upload Student Photo from Local PC (ছবি আপলোড করুন)
                  </label>
                  <p className="text-[11px] text-slate-500">Supported format: JPG, PNG, WEBP (Passport size)</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo File</span>
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={e => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student ID Code</label>
                <input
                  type="text"
                  value={cardData.studentCode}
                  onChange={e => setCardData({ ...cardData, studentCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course / Program</label>
                <input
                  type="text"
                  value={cardData.courseName}
                  onChange={e => setCardData({ ...cardData, courseName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Number</label>
                <input
                  type="text"
                  value={cardData.batchNumber}
                  onChange={e => setCardData({ ...cardData, batchNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={cardData.bloodGroup}
                  onChange={e => setCardData({ ...cardData, bloodGroup: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={cardData.phone}
                  onChange={e => setCardData({ ...cardData, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={cardData.emergencyContact}
                  onChange={e => setCardData({ ...cardData, emergencyContact: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Issue Date</label>
                <input
                  type="date"
                  value={cardData.issueDate}
                  onChange={e => setCardData({ ...cardData, issueDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Expire / Validity Date</label>
                <input
                  type="date"
                  value={cardData.expireDate}
                  onChange={e => setCardData({ ...cardData, expireDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={cardData.address}
                  onChange={e => setCardData({ ...cardData, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              {activeMode === 'admit_card' && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Exam Title</label>
                    <input
                      type="text"
                      value={cardData.examTitle}
                      onChange={e => setCardData({ ...cardData, examTitle: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Exam Date</label>
                    <input
                      type="text"
                      value={cardData.examDate}
                      onChange={e => setCardData({ ...cardData, examDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Exam Time & Room</label>
                    <input
                      type="text"
                      value={cardData.examTime}
                      onChange={e => setCardData({ ...cardData, examTime: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Printable View Area */}
        <div ref={printAreaRef} className="p-6 bg-slate-100 flex flex-col items-center justify-center space-y-6 overflow-y-auto">
          {activeMode === 'id_card' ? (
            /* ID CARD (FRONT & BACK PREVIEW) */
            <div className="space-y-6 w-full max-w-md" id="id-card-printable">
              {/* FRONT SIDE */}
              <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-indigo-900 relative">
                {/* Header Pattern */}
                <div className="bg-indigo-600 px-4 py-2.5 flex items-center justify-between border-b border-indigo-500/30">
                  <div className="flex items-center space-x-2">
                    <NexgenLogo variant="crest" size={24} />
                    <span className="font-extrabold text-xs tracking-wider uppercase text-white">
                      {cardData.instituteName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-indigo-100">
                    STUDENT ID
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex items-center space-x-4">
                  {/* Photo Frame */}
                  <div className="relative shrink-0">
                    <img
                      src={cardData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={cardData.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 object-cover rounded-xl border-2 border-indigo-400/80 shadow-md bg-slate-800"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-slate-900">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 text-left min-w-0 flex-1">
                    <h3 className="font-extrabold text-base text-white truncate leading-tight">
                      {cardData.name}
                    </h3>
                    <p className="text-indigo-300 text-xs font-semibold truncate">
                      {cardData.courseName}
                    </p>

                    <div className="pt-1.5 space-y-0.5 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Student ID:</span>
                        <span className="font-mono font-bold text-white">{cardData.studentCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Batch:</span>
                        <span className="font-semibold text-white">{cardData.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Blood Group:</span>
                        <span className="font-bold text-rose-400">{cardData.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-t border-indigo-900/50 text-[10px] text-slate-400">
                  <span>Issued: {cardData.issueDate}</span>
                  <span className="text-indigo-400 font-mono">{cardData.website}</span>
                  <span>Valid: {cardData.expireDate}</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="w-full bg-white text-slate-800 rounded-2xl shadow-lg p-5 border border-slate-200 relative text-left">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      {cardData.instituteFullName}
                    </h4>
                    <p className="text-[10px] text-slate-500">Dhaka Campus • Support: {cardData.instituteSupport}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 p-1 rounded-lg border border-slate-300 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-800" />
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 mb-3">
                  <p><strong className="text-slate-800">Phone:</strong> {cardData.phone}</p>
                  <p><strong className="text-slate-800">Emergency Contact:</strong> {cardData.emergencyContact}</p>
                  <p><strong className="text-slate-800">Address:</strong> {cardData.address}</p>
                </div>

                <div className="text-[9px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                  • This card is non-transferable and property of {cardData.instituteFullName}.<br />
                  • If found, please return to any {cardData.instituteFullName} branch.
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div className="text-center">
                    <div className="h-6 border-b border-slate-400 w-24 mb-1"></div>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Student Sign</span>
                  </div>
                  <div className="text-center">
                    <div className="h-6 flex items-center justify-center border-b border-indigo-600 w-28 mb-1">
                      <span className="font-serif italic text-xs font-bold text-indigo-900">{cardData.signatoryName}</span>
                    </div>
                    <span className="text-[9px] text-indigo-700 uppercase font-bold">Authorized Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ADMIT CARD PREVIEW */
            <div className="w-full bg-white rounded-2xl shadow-xl p-6 border border-slate-300 text-slate-900 space-y-4" id="admit-card-printable">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-3">
                <div className="flex items-center space-x-3">
                  <NexgenLogo variant="crest" size={44} />
                  <div>
                    <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
                      {cardData.instituteFullName}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Official Final Assessment & Certification Examination
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 font-black text-xs rounded-lg uppercase">
                    ADMIT CARD
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{cardData.studentCode}</p>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Candidate Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{cardData.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Course:</span>
                  <span className="font-semibold text-slate-800">{cardData.courseName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Batch Number:</span>
                  <span className="font-bold text-indigo-600 font-mono">{cardData.batchNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exam Title:</span>
                  <span className="font-semibold text-slate-800">{cardData.examTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exam Date & Time:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {cardData.examDate} • {cardData.examTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exam Center & Room:</span>
                  <span className="font-semibold text-slate-800">{cardData.examRoom}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[11px] text-slate-600 space-y-1 bg-amber-50/60 p-3 rounded-xl border border-amber-200 whitespace-pre-line">
                <p className="font-bold text-amber-900">Exam Hall Instructions:</p>
                {cardData.examInstructions}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                <div className="text-center">
                  <div className="h-6 border-b border-slate-400 w-28 mb-1"></div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Candidate Signature</span>
                </div>
                <div className="text-center">
                  <div className="h-6 flex items-center justify-center border-b border-indigo-600 w-28 mb-1">
                    <span className="font-serif italic text-xs font-bold text-indigo-900">{cardData.controllerName}</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold uppercase">Controller of Exams</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back / বন্ধ করুন</span>
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print {activeMode === 'id_card' ? 'ID Card' : 'Admit Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
