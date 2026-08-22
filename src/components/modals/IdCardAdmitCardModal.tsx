import React, { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
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
  RotateCcw,
  Save,
  Check
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
  const { academySettings, updateAcademySettings } = useAcademy();
  const [activeMode, setActiveMode] = useState<'id_card' | 'admit_card'>('id_card');
  const [showEditor, setShowEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Editable ID card & Admit card fields
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
    campusName: academySettings.campusName || 'Farmgate Campus',
    instituteSupport: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
    instituteName: academySettings.instituteName || 'Nexgen Academy',
    instituteFullName: academySettings.instituteName || 'Nexgen Computer Academy',
    signatoryName: academySettings.idCardSignatoryName || 'Prodip Chowdhury',
    signatoryTitle: academySettings.idCardSignatoryTitle || 'Managing Director & CEO',
    idCardTerms: academySettings.idCardTerms || '• This card is non-transferable and official property of Nexgen Computer Academy.\n• If found, please return to Farmgate Campus, 14/B Garden Road, Dhaka-1215 or call helpline.',
    // Admit card specific
    examTitle: examTitle || 'Semester Final Practical & Evaluation Exam',
    examDate: examDate || '2026-08-25',
    examTime: examTime || '10:00 AM - 01:00 PM',
    examRoom: batch?.room || 'Computer Lab-1, Level-4',
    examInstructions: academySettings.admitCardInstructions || '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
    controllerName: academySettings.admitCardControllerName || 'Controller of Examinations'
  });

  // Sync with prop changes & academy settings
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
        campusName: academySettings.campusName || prev.campusName || 'Farmgate Campus',
        instituteSupport: academySettings.primarySupportPhone || academySettings.helplines?.[0] || prev.instituteSupport || '01798444444',
        website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : prev.website,
        instituteFullName: academySettings.instituteName || prev.instituteFullName,
        signatoryName: academySettings.idCardSignatoryName || prev.signatoryName,
        idCardTerms: academySettings.idCardTerms || prev.idCardTerms,
        examTitle: examTitle || prev.examTitle,
        examDate: examDate || prev.examDate,
        examTime: examTime || prev.examTime,
        examRoom: batch?.room || prev.examRoom,
        examInstructions: academySettings.admitCardInstructions || prev.examInstructions,
        controllerName: academySettings.admitCardControllerName || prev.controllerName
      }));
    }
  }, [student, course, batch, examTitle, examDate, examTime, academySettings]);

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

  // Save current default print settings across academy
  const handleSaveAsAcademyDefaults = () => {
    updateAcademySettings({
      campusName: cardData.campusName,
      primarySupportPhone: cardData.instituteSupport,
      idCardSignatoryName: cardData.signatoryName,
      idCardSignatoryTitle: cardData.signatoryTitle,
      admitCardControllerName: cardData.controllerName,
      idCardTerms: cardData.idCardTerms,
      admitCardInstructions: cardData.examInstructions
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                showEditor
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{showEditor ? 'Hide Field Customizer' : 'Edit / Customize Card Fields (ম্যানুয়াল এডিট)'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Saved as Academy Defaults</span>
              </span>
            )}
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
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-80 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Customize & Override Fields for {activeMode === 'id_card' ? 'Student ID Card' : 'Admit Card'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveAsAcademyDefaults}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px] transition-colors"
                  title="Save campus name, support phone and signatory as default"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Defaults</span>
                </button>
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
                      photoUrl: student?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                      campusName: academySettings.campusName || 'Farmgate Campus',
                      instituteSupport: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444'
                    }));
                  }}
                  className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Student Record</span>
                </button>
              </div>
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

            {/* Core Campus & Support Info */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-amber-950 font-bold mb-1">Campus Name (ক্যাম্পাস)</label>
                <input
                  type="text"
                  value={cardData.campusName}
                  onChange={e => setCardData({ ...cardData, campusName: e.target.value })}
                  placeholder="e.g. Farmgate Campus"
                  className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-amber-950 font-bold mb-1">Support Phone (হেল্পলাইন)</label>
                <input
                  type="text"
                  value={cardData.instituteSupport}
                  onChange={e => setCardData({ ...cardData, instituteSupport: e.target.value })}
                  placeholder="e.g. 01798444444"
                  className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-amber-950 font-bold mb-1">Website URL (ওয়েবসাইট)</label>
                <input
                  type="text"
                  value={cardData.website}
                  onChange={e => setCardData({ ...cardData, website: e.target.value })}
                  placeholder="e.g. nexgenacademy.edu.bd"
                  className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-amber-950 font-bold mb-1">Authorized Signatory</label>
                <input
                  type="text"
                  value={cardData.signatoryName}
                  onChange={e => setCardData({ ...cardData, signatoryName: e.target.value })}
                  placeholder="e.g. Prodip Chowdhury"
                  className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
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

              {activeMode === 'id_card' && (
                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-semibold mb-1">ID Card Terms & Return Policy (কার্ড ফেরত নির্দেশনা)</label>
                  <textarea
                    rows={2}
                    value={cardData.idCardTerms}
                    onChange={e => setCardData({ ...cardData, idCardTerms: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
              )}

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
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Controller of Exams Name</label>
                    <input
                      type="text"
                      value={cardData.controllerName}
                      onChange={e => setCardData({ ...cardData, controllerName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Admit Card Exam Hall Instructions</label>
                    <textarea
                      rows={2}
                      value={cardData.examInstructions}
                      onChange={e => setCardData({ ...cardData, examInstructions: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Printable View Area */}
        <div ref={printAreaRef} className="p-4 sm:p-6 bg-slate-100 flex flex-col items-center justify-center overflow-y-auto print:p-0 print:m-0 print:bg-white print-page-a4">
          {activeMode === 'id_card' ? (
            /* OFFICIAL ID CARD A4 PRINT SHEET (FRONT & BACK SIDE-BY-SIDE WITH CUTTING GUIDES) */
            <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0" id="id-card-printable">
              {/* Sheet Title for Print */}
              <div className="hidden print:block text-center border-b border-slate-300 pb-2 mb-4">
                <h3 className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                  {cardData.instituteFullName} — Official Student Identity Card Print Sheet
                </h3>
                <p className="text-[9px] text-slate-500">
                  Standard CR-80 Dimensions (86mm × 54mm) • Cut along dashed guidelines & fold/laminate
                </p>
              </div>

              {/* ID Card Front and Back Cards Container */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 print:flex-row print:gap-4">
                {/* FRONT SIDE (CR-80 Format) */}
                <div className="w-[85.6mm] h-[54mm] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl shadow-md overflow-hidden border border-indigo-900 relative flex flex-col justify-between shrink-0 print:border-dashed print:border-slate-400">
                  {/* Top Bar */}
                  <div className="bg-indigo-600 px-2.5 py-1.5 flex items-center justify-between border-b border-indigo-500/30">
                    <div className="flex items-center space-x-1.5">
                      <NexgenLogo variant="crest" size={18} />
                      <span className="font-black text-[10px] tracking-wider uppercase text-white">
                        {cardData.instituteName}
                      </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded text-indigo-100">
                      STUDENT ID
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="px-2.5 py-1 flex items-center space-x-2.5 flex-1">
                    {/* Photo */}
                    <div className="relative shrink-0">
                      <img
                        src={cardData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={cardData.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-16 object-cover rounded-lg border-2 border-indigo-400 shadow-xs bg-slate-800"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-1 ring-slate-900">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-0.5 text-left min-w-0 flex-1">
                      <h4 className="font-black text-[12px] text-white truncate leading-tight">
                        {cardData.name}
                      </h4>
                      <p className="text-indigo-300 text-[9px] font-bold truncate">
                        {cardData.courseName}
                      </p>

                      <div className="pt-0.5 space-y-0.5 text-[8.5px] text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">ID No:</span>
                          <span className="font-mono font-black text-indigo-200">{cardData.studentCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Batch:</span>
                          <span className="font-semibold text-white">{cardData.batchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Blood Group:</span>
                          <span className="font-black text-rose-400">{cardData.bloodGroup}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="bg-slate-950/90 px-2.5 py-1 flex items-center justify-between border-t border-indigo-900/50 text-[8px] text-slate-400">
                    <span>Issued: {cardData.issueDate}</span>
                    <span className="text-indigo-300 font-mono">{cardData.website}</span>
                    <span>Valid: {cardData.expireDate}</span>
                  </div>
                </div>

                {/* BACK SIDE (CR-80 Format) */}
                <div className="w-[85.6mm] h-[54mm] bg-white text-slate-800 rounded-xl shadow-md p-2.5 border border-slate-300 relative text-left flex flex-col justify-between shrink-0 print:border-dashed print:border-slate-400">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between border-b border-slate-200 pb-1">
                    <div>
                      <h5 className="font-black text-[9px] uppercase tracking-wider text-indigo-950">
                        {cardData.instituteFullName}
                      </h5>
                      <p className="text-[7.5px] text-slate-600 font-medium">
                        <strong className="text-indigo-900">{cardData.campusName}</strong> • Helpline: <strong className="text-slate-900 font-mono">{cardData.instituteSupport}</strong>
                      </p>
                    </div>
                    <div className="w-7 h-7 bg-slate-100 p-0.5 rounded border border-slate-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-6 h-6 text-slate-800" />
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-0.5 text-[8px] text-slate-600 my-0.5">
                    <p><strong className="text-slate-800">Phone:</strong> <span className="font-mono">{cardData.phone}</span> | <strong className="text-slate-800">Emergency:</strong> <span className="font-mono">{cardData.emergencyContact}</span></p>
                    <p className="truncate"><strong className="text-slate-800">Address:</strong> {cardData.address}</p>
                  </div>

                  {/* Terms */}
                  <div className="text-[7px] text-slate-500 bg-slate-50 p-1 rounded border border-slate-100 whitespace-pre-line leading-tight">
                    {cardData.idCardTerms}
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-between items-end pt-0.5 border-t border-slate-200 text-[7.5px]">
                    <div className="text-center">
                      <div className="h-3.5 border-b border-slate-400 w-16 mb-0.5"></div>
                      <span className="text-slate-500 uppercase font-semibold">Student Sign</span>
                    </div>
                    <div className="text-center">
                      <div className="h-3.5 flex items-center justify-center border-b border-indigo-600 w-20 mb-0.5">
                        <span className="font-serif italic text-[8.5px] font-bold text-indigo-900">{cardData.signatoryName}</span>
                      </div>
                      <span className="text-indigo-900 uppercase font-black">{cardData.signatoryTitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cutting & Lamination Instructions on Print */}
              <div className="mt-6 pt-3 border-t border-dashed border-slate-300 text-center text-[9px] text-slate-500 print:block">
                ✂️ Cut along outer boundaries • Sized for Standard PVC ID Card Pouches & Laminators • Helpline: {cardData.instituteSupport}
              </div>
            </div>
          ) : (
            /* ADMIT CARD PREVIEW & A4 PRINT */
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-slate-300 text-slate-900 space-y-3.5 print:shadow-none print:border-none print:p-0 print:m-0" id="admit-card-printable">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-indigo-950 pb-2.5">
                <div className="flex items-center space-x-3">
                  <NexgenLogo variant="crest" size={42} />
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-indigo-950 leading-tight">
                      {cardData.instituteFullName}
                    </h2>
                    <p className="text-[10px] text-slate-600 font-medium">
                      <strong className="text-indigo-900">{cardData.campusName}</strong> • Helpline: <strong className="text-slate-900 font-mono">{cardData.instituteSupport}</strong> • <span className="text-indigo-700 font-mono">{cardData.website}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-indigo-900 text-white font-black text-xs rounded uppercase tracking-wider shadow-xs">
                    OFFICIAL ADMIT CARD
                  </span>
                  <p className="text-[10px] text-indigo-950 font-bold mt-1 font-mono">{cardData.studentCode}</p>
                </div>
              </div>

              {/* Student & Exam Details Grid */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Candidate Name:</span>
                  <span className="font-bold text-slate-950 text-xs">{cardData.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Enrolled Course:</span>
                  <span className="font-bold text-slate-800 text-[11px]">{cardData.courseName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Batch Number:</span>
                  <span className="font-black text-indigo-900 font-mono">{cardData.batchNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Examination Title:</span>
                  <span className="font-bold text-slate-800 text-[11px]">{cardData.examTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exam Date & Time:</span>
                  <span className="font-bold text-slate-950 font-mono text-[11px]">
                    {cardData.examDate} • {cardData.examTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exam Center & Room:</span>
                  <span className="font-bold text-slate-800 text-[11px]">{cardData.examRoom}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[10.5px] text-slate-700 space-y-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200 whitespace-pre-line leading-relaxed">
                <p className="font-black text-amber-950 uppercase tracking-wider text-[10px]">Examination Hall Instructions & Guidelines:</p>
                {cardData.examInstructions}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-5 mt-2 border-t border-slate-300">
                <div className="text-center">
                  <div className="h-6 border-b border-slate-400 w-32 mb-1"></div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">Candidate Signature</span>
                </div>
                <div className="text-center">
                  <div className="h-6 flex items-center justify-center border-b border-indigo-900 w-36 mb-1">
                    <span className="font-serif italic text-xs font-bold text-indigo-950">{cardData.controllerName}</span>
                  </div>
                  <span className="text-[10px] text-indigo-950 font-black uppercase">Controller of Examinations</span>
                </div>
              </div>

              {/* Admit card footer */}
              <div className="pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
                Nexgen IT Academy Examination Division • Valid for scheduled exam only • Helpline: {cardData.instituteSupport}
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
