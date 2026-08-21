import React, { useState, useEffect, useRef } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Certificate } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  Award,
  ShieldCheck,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Eye,
  Sliders,
  Palette,
  FileCheck2,
  Save,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId?: string;
}

type CertificateTheme = 'gold' | 'emerald' | 'navy' | 'crimson' | 'slate';

interface CertificatePreset {
  id: string;
  name: string;
  title: string;
  statement: string;
  gradeDefault: string;
  theme: CertificateTheme;
}

const PRESETS: CertificatePreset[] = [
  {
    id: 'achievement',
    name: 'Professional Achievement',
    title: 'Certificate of Professional Achievement',
    statement: 'has successfully completed all required coursework, hands-on practical projects, and professional evaluation in the advanced program',
    gradeDefault: 'A+',
    theme: 'gold'
  },
  {
    id: 'completion',
    name: 'Course Completion',
    title: 'Certificate of Course Completion',
    statement: 'has successfully fulfilled all academic curriculum, practical lab assignments, and course requirements for',
    gradeDefault: 'Passed',
    theme: 'navy'
  },
  {
    id: 'excellence',
    name: 'Excellence & Distinction',
    title: 'Certificate of Academic Excellence & Distinction',
    statement: 'has demonstrated exceptional academic brilliance, outstanding project performance, and top-tier expertise in',
    gradeDefault: 'Distinction (A+)',
    theme: 'crimson'
  },
  {
    id: 'internship',
    name: 'Internship & Apprenticeship',
    title: 'Certificate of Professional Internship',
    statement: 'has successfully rendered professional industrial internship and practical project execution at the software lab in',
    gradeDefault: 'Outstanding',
    theme: 'emerald'
  },
  {
    id: 'workshop',
    name: 'Workshop & Bootcamp',
    title: 'Certificate of Workshop Participation',
    statement: 'has actively participated and successfully completed the intensive hands-on technical masterclass in',
    gradeDefault: 'Completed',
    theme: 'slate'
  }
];

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificateId
}) => {
  const { certificates, students, courses, batches, updateCertificate } = useAcademy();

  const [activeTab, setActiveTab] = useState<'preview' | 'customize' | 'styles'>('preview');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CertificateTheme>('gold');

  // Find target certificate
  const certificate = certificateId
    ? (certificates.find(c => c.id === certificateId || c.certificateCode === certificateId || c.certificateNumber === certificateId) || certificates[0])
    : certificates[0];

  const student = students.find(s => s.id === certificate?.studentId);
  const course = courses.find(c => c.id === certificate?.courseId);
  const batch = batches.find(b => b.id === certificate?.batchId);

  // Editable Certificate Fields
  const [certData, setCertData] = useState({
    instituteName: 'Nexgen Computer Academy',
    instituteTagline: 'Institute of Information Technology & Professional Skills',
    certTitle: 'Certificate of Professional Achievement',
    certSubtext: 'This is to officially certify that',
    studentName: '',
    studentCode: '',
    courseName: '',
    batchText: '',
    durationText: '',
    achievementText: 'has successfully completed all required coursework, hands-on practical projects, and professional evaluation in the advanced program',
    grade: 'A+',
    completionDate: '',
    issueDate: '',
    certificateSerial: '',
    verificationUrl: '',
    instructorName: 'Course Instructor',
    instructorTitle: 'Lead Trainer & Specialist',
    directorName: 'Prodip Chowdhury',
    directorTitle: 'Managing Director & CEO',
    sealText: 'Official Seal Nexgen',
    showLogo: true,
    showSeal: true,
    showVerification: true,
    customLogoUrl: '',
    customWatermarkUrl: '',
    watermarkOpacity: 0.05,
    watermarkType: 'crest' as 'crest' | 'award' | 'custom'
  });

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const watermarkFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCertData(prev => ({ ...prev, customLogoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCertData(prev => ({
            ...prev,
            customWatermarkUrl: reader.result as string,
            watermarkType: 'custom'
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Populate data when certificate opens
  useEffect(() => {
    if (certificate) {
      const currentStudent = students.find(s => s.id === certificate.studentId);
      const currentCourse = courses.find(c => c.id === certificate.courseId);
      const currentBatch = batches.find(b => b.id === certificate.batchId);
      const certCode = certificate.certificateCode || certificate.certificateNumber || 'NCA-CERT-001';
      const durationW = currentCourse?.durationWeeks || (currentCourse?.durationMonths ? currentCourse.durationMonths * 4 : 12);
      const totalHrs = currentCourse?.totalHours || 72;

      setCertData(prev => ({
        ...prev,
        instituteName: 'Nexgen Computer Academy',
        instituteTagline: 'Institute of Information Technology & Professional Skills',
        certTitle: 'Certificate of Professional Achievement',
        certSubtext: 'This is to officially certify that',
        studentName: currentStudent?.name || 'Student Name',
        studentCode: currentStudent?.studentCode || 'NCA-ST-2026-001',
        courseName: currentCourse?.name || 'Advanced IT & Software Program',
        batchText: `Batch: #${currentBatch?.batchNumber || '01'}`,
        durationText: `${durationW} Weeks (${totalHrs} Hours)`,
        achievementText: 'has successfully completed all required coursework, hands-on practical projects, and professional evaluation in the advanced program',
        grade: certificate.grade || 'A+',
        completionDate: certificate.completionDate || certificate.issueDate || new Date().toISOString().split('T')[0],
        issueDate: certificate.issueDate || new Date().toISOString().split('T')[0],
        certificateSerial: certCode,
        verificationUrl: certificate.verificationId || `nca.edu/verify/${certCode}`,
        instructorName: certificate.instructorSignatureName || 'Course Instructor',
        instructorTitle: 'Lead Trainer & Specialist',
        directorName: 'Prodip Chowdhury',
        directorTitle: 'Managing Director & CEO',
        sealText: 'Official Seal Nexgen',
        showLogo: true,
        showSeal: true,
        showVerification: true
      }));
    }
  }, [certificate, students, courses, batches, isOpen]);

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

  if (!isOpen || !certificate) return null;

  // Handle saving changes to context
  const handleSaveChanges = () => {
    if (certificate?.id && updateCertificate) {
      updateCertificate(certificate.id, {
        certificateCode: certData.certificateSerial,
        certificateNumber: certData.certificateSerial,
        grade: certData.grade,
        completionDate: certData.completionDate,
        issueDate: certData.issueDate,
        instructorSignatureName: certData.instructorName,
        verificationId: certData.verificationUrl
      });
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Reset to initial
  const handleReset = () => {
    if (certificate) {
      const currentStudent = students.find(s => s.id === certificate.studentId);
      const currentCourse = courses.find(c => c.id === certificate.courseId);
      const currentBatch = batches.find(b => b.id === certificate.batchId);
      const certCode = certificate.certificateCode || certificate.certificateNumber || 'NCA-CERT-001';
      const durationW = currentCourse?.durationWeeks || (currentCourse?.durationMonths ? currentCourse.durationMonths * 4 : 12);
      const totalHrs = currentCourse?.totalHours || 72;

      setCertData(prev => ({
        ...prev,
        instituteName: 'Nexgen Computer Academy',
        instituteTagline: 'Institute of Information Technology & Professional Skills',
        certTitle: 'Certificate of Professional Achievement',
        certSubtext: 'This is to officially certify that',
        studentName: currentStudent?.name || '',
        studentCode: currentStudent?.studentCode || '',
        courseName: currentCourse?.name || '',
        batchText: `Batch: #${currentBatch?.batchNumber || '01'}`,
        durationText: `${durationW} Weeks (${totalHrs} Hours)`,
        achievementText: 'has successfully completed all required coursework, hands-on practical projects, and professional evaluation in the advanced program',
        grade: certificate.grade || 'A+',
        completionDate: certificate.completionDate || certificate.issueDate || '2026-08-15',
        issueDate: certificate.issueDate || '2026-08-20',
        certificateSerial: certCode,
        verificationUrl: certificate.verificationId || certCode,
        instructorName: certificate.instructorSignatureName || 'Course Instructor',
        instructorTitle: 'Lead Trainer & Specialist',
        directorName: 'Prodip Chowdhury',
        directorTitle: 'Managing Director & CEO',
        sealText: 'Official Seal Nexgen',
        showLogo: true,
        showSeal: true,
        showVerification: true
      }));
      setSelectedTheme('gold');
    }
  };

  // Apply Preset
  const handleApplyPreset = (preset: CertificatePreset) => {
    setCertData(prev => ({
      ...prev,
      certTitle: preset.title,
      achievementText: preset.statement,
      grade: preset.gradeDefault
    }));
    setSelectedTheme(preset.theme);
  };

  // Robust Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Theme Styling Configuration
  const themeStyles = {
    gold: {
      border: 'border-amber-600/70',
      bg: 'bg-amber-50/30',
      watermark: 'text-amber-900',
      tagline: 'text-amber-800',
      badgeBg: 'bg-amber-100/90 text-amber-950 border-amber-300',
      titleUnderline: 'border-amber-600/60',
      courseColor: 'text-indigo-950',
      gradeBadge: 'bg-amber-50 border-amber-300 text-amber-900',
      sealBorder: 'border-amber-600 text-amber-700 bg-amber-50/70',
      divider: 'border-amber-200'
    },
    emerald: {
      border: 'border-emerald-600/70',
      bg: 'bg-emerald-50/30',
      watermark: 'text-emerald-900',
      tagline: 'text-emerald-800',
      badgeBg: 'bg-emerald-100/90 text-emerald-950 border-emerald-300',
      titleUnderline: 'border-emerald-600/60',
      courseColor: 'text-emerald-950',
      gradeBadge: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      sealBorder: 'border-emerald-600 text-emerald-700 bg-emerald-50/70',
      divider: 'border-emerald-200'
    },
    navy: {
      border: 'border-indigo-600/70',
      bg: 'bg-indigo-50/30',
      watermark: 'text-indigo-900',
      tagline: 'text-indigo-800',
      badgeBg: 'bg-indigo-100/90 text-indigo-950 border-indigo-300',
      titleUnderline: 'border-indigo-600/60',
      courseColor: 'text-indigo-950',
      gradeBadge: 'bg-indigo-50 border-indigo-300 text-indigo-900',
      sealBorder: 'border-indigo-600 text-indigo-700 bg-indigo-50/70',
      divider: 'border-indigo-200'
    },
    crimson: {
      border: 'border-rose-600/70',
      bg: 'bg-rose-50/30',
      watermark: 'text-rose-900',
      tagline: 'text-rose-800',
      badgeBg: 'bg-rose-100/90 text-rose-950 border-rose-300',
      titleUnderline: 'border-rose-600/60',
      courseColor: 'text-rose-950',
      gradeBadge: 'bg-rose-50 border-rose-300 text-rose-900',
      sealBorder: 'border-rose-600 text-rose-700 bg-rose-50/70',
      divider: 'border-rose-200'
    },
    slate: {
      border: 'border-slate-600/70',
      bg: 'bg-slate-50/40',
      watermark: 'text-slate-900',
      tagline: 'text-slate-700',
      badgeBg: 'bg-slate-200/90 text-slate-950 border-slate-400',
      titleUnderline: 'border-slate-600/60',
      courseColor: 'text-slate-950',
      gradeBadge: 'bg-slate-100 border-slate-300 text-slate-900',
      sealBorder: 'border-slate-600 text-slate-700 bg-slate-50/70',
      divider: 'border-slate-200'
    }
  }[selectedTheme];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Top Control Bar */}
        <div className="sticky top-0 z-20 px-4 py-3 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back / ফিরে যান</span>
            </button>

            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Print Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'customize'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize & Edit (সম্পাদনা)</span>
              </button>
              <button
                onClick={() => setActiveTab('styles')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'styles'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Themes & Presets</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isSavedToast && (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2.5 py-1 rounded-lg animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Database!</span>
              </span>
            )}
            <button
              onClick={handleSaveChanges}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors shadow-xs"
              title="Save custom certificate details"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Save Changes</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization / Settings Bar (when customize or styles tab is active) */}
        {activeTab === 'styles' && (
          <div className="bg-slate-900 p-4 border-b border-slate-800 text-white animate-in slide-in-from-top-2 duration-150 print:hidden">
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Certificate Border & Color Theme</h4>
                  <p className="text-[11px] text-slate-400">Choose the prestigious color palette for printing</p>
                </div>
                {/* Theme Selector */}
                <div className="flex items-center space-x-2">
                  {[
                    { id: 'gold', name: 'Royal Gold', color: 'bg-amber-500' },
                    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
                    { id: 'navy', name: 'Navy Blue', color: 'bg-indigo-600' },
                    { id: 'crimson', name: 'Crimson Award', color: 'bg-rose-600' },
                    { id: 'slate', name: 'Modern Slate', color: 'bg-slate-700' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id as CertificateTheme)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        selectedTheme === t.id
                          ? 'border-white bg-slate-800 text-white ring-2 ring-amber-400'
                          : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Presets & Award Types:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium transition-colors"
                    >
                      ⚡ {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Form Editor Panel (when Customize tab active) */}
        {activeTab === 'customize' && (
          <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200 max-h-72 overflow-y-auto animate-in slide-in-from-top-2 duration-150 print:hidden">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Certificate Customizer & Data Editor</h3>
                  <p className="text-xs text-slate-500">Edit student details, titles, instructor & director signatures in real time</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* Student Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={certData.studentName}
                    onChange={e => setCertData({ ...certData, studentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Student Code */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID / Code</label>
                  <input
                    type="text"
                    value={certData.studentCode}
                    onChange={e => setCertData({ ...certData, studentCode: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Certificate Serial */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certificate Serial Number</label>
                  <input
                    type="text"
                    value={certData.certificateSerial}
                    onChange={e => setCertData({ ...certData, certificateSerial: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Course Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Course / Program Title</label>
                  <input
                    type="text"
                    value={certData.courseName}
                    onChange={e => setCertData({ ...certData, courseName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Awarded Grade / Score</label>
                  <input
                    type="text"
                    value={certData.grade}
                    onChange={e => setCertData({ ...certData, grade: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                    placeholder="e.g. A+, Distinction, A"
                  />
                </div>

                {/* Batch & Duration */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Text</label>
                  <input
                    type="text"
                    value={certData.batchText}
                    onChange={e => setCertData({ ...certData, batchText: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    placeholder="e.g. Batch: #01"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration & Hours</label>
                  <input
                    type="text"
                    value={certData.durationText}
                    onChange={e => setCertData({ ...certData, durationText: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                    placeholder="e.g. 12 Weeks (72 Hours)"
                  />
                </div>

                {/* Completion & Issue Date */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={certData.completionDate}
                    onChange={e => setCertData({ ...certData, completionDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={certData.issueDate}
                    onChange={e => setCertData({ ...certData, issueDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Certificate Title */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certificate Header Title</label>
                  <input
                    type="text"
                    value={certData.certTitle}
                    onChange={e => setCertData({ ...certData, certTitle: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Verification ID */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Online Verification Key</label>
                  <input
                    type="text"
                    value={certData.verificationUrl}
                    onChange={e => setCertData({ ...certData, verificationUrl: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Signatures */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructor / Trainer Name</label>
                  <input
                    type="text"
                    value={certData.instructorName}
                    onChange={e => setCertData({ ...certData, instructorName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Director Name</label>
                  <input
                    type="text"
                    value={certData.directorName}
                    onChange={e => setCertData({ ...certData, directorName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Institute Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academy / Institute Name</label>
                  <input
                    type="text"
                    value={certData.instituteName}
                    onChange={e => setCertData({ ...certData, instituteName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Achievement Body Text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certificate Certification Statement Body</label>
                <textarea
                  rows={2}
                  value={certData.achievementText}
                  onChange={e => setCertData({ ...certData, achievementText: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Logo & Watermark Upload Controls */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Custom Certificate Logo (লোগো আপলোড)</span>
                    </label>
                    {certData.customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setCertData(prev => ({ ...prev, customLogoUrl: '' }))}
                        className="text-[10px] text-rose-600 font-semibold hover:underline"
                      >
                        Reset Logo
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold border border-indigo-200 transition-colors text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo from PC</span>
                    </button>
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Or paste Logo Image URL..."
                      value={certData.customLogoUrl}
                      onChange={e => setCertData(prev => ({ ...prev, customLogoUrl: e.target.value }))}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Certificate Watermark (জলছাপ কাস্টমাইজ)</span>
                    </label>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                      <span>Opacity:</span>
                      <input
                        type="range"
                        min="0.01"
                        max="0.25"
                        step="0.01"
                        value={certData.watermarkOpacity}
                        onChange={e => setCertData(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
                        className="w-16 accent-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => watermarkFileInputRef.current?.click()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200 transition-colors text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Watermark</span>
                    </button>
                    <input
                      ref={watermarkFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWatermarkUpload}
                      className="hidden"
                    />
                    <select
                      value={certData.watermarkType}
                      onChange={e => setCertData(prev => ({ ...prev, watermarkType: e.target.value as any }))}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none"
                    >
                      <option value="crest">Nexgen Crest Watermark</option>
                      <option value="award">Gold Award Watermark</option>
                      <option value="custom">Custom Uploaded Image</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Display Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 text-xs text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certData.showLogo}
                    onChange={e => setCertData({ ...certData, showLogo: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Show Academy Logo</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certData.showSeal}
                    onChange={e => setCertData({ ...certData, showSeal: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Show Official Embossed Seal</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certData.showVerification}
                    onChange={e => setCertData({ ...certData, showVerification: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Show Online Verification Bar</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-6 bg-slate-100/70">
          {/* Certificate Canvas */}
          <div
            className={`p-6 sm:p-12 ${themeStyles.bg} text-slate-900 font-serif border-[10px] sm:border-[14px] border-double ${themeStyles.border} rounded-xl relative overflow-hidden bg-white shadow-md print:shadow-none print:m-0 print:border-8 print:p-8 transition-colors duration-200`}
            id="certificate-printable"
          >
            {/* Subtle Background Watermark */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none ${themeStyles.watermark}`}
              style={{ opacity: certData.watermarkOpacity || 0.05 }}
            >
              {certData.watermarkType === 'custom' && certData.customWatermarkUrl ? (
                <img
                  src={certData.customWatermarkUrl}
                  alt="Watermark"
                  referrerPolicy="no-referrer"
                  className="w-[420px] h-[420px] object-contain select-none"
                />
              ) : certData.watermarkType === 'crest' ? (
                <NexgenLogo variant="crest" size={380} customLogoUrl={certData.customLogoUrl} />
              ) : (
                <Award className="w-[450px] h-[450px]" />
              )}
            </div>

            <div className="relative z-10 text-center space-y-6">
              {/* Header */}
              <div className="space-y-1">
                {certData.showLogo && (
                  <div className="flex justify-center mb-1">
                    <NexgenLogo
                      variant="full"
                      size={130}
                      customLogoUrl={certData.customLogoUrl}
                      className="mx-auto"
                    />
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider uppercase">
                  {certData.instituteName}
                </h1>
                <p className={`text-xs font-sans ${themeStyles.tagline} font-semibold tracking-widest uppercase mt-0.5`}>
                  {certData.instituteTagline}
                </p>
              </div>

              {/* Certificate Title */}
              <div className="pt-2">
                <div className={`inline-block border-b-2 ${themeStyles.titleUnderline} pb-1`}>
                  <span className={`text-sm sm:text-base font-sans font-extrabold uppercase tracking-widest px-6 py-1.5 ${themeStyles.badgeBg} rounded shadow-2xs`}>
                    {certData.certTitle}
                  </span>
                </div>
              </div>

              {/* Body Description */}
              <div className="space-y-3 font-sans max-w-2xl mx-auto text-slate-700">
                <p className="text-xs italic text-slate-500">{certData.certSubtext}</p>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 tracking-tight">
                  {certData.studentName}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Student ID: <span className="font-bold text-slate-800">{certData.studentCode}</span>
                </p>
                <p className="text-xs leading-relaxed pt-2">
                  {certData.achievementText}
                </p>
                <div className="py-1">
                  <h3 className={`text-lg sm:text-xl font-bold font-sans ${themeStyles.courseColor}`}>
                    {certData.courseName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {certData.batchText} {certData.durationText ? `| Duration: ${certData.durationText}` : ''}
                  </p>
                </div>
                <div className={`inline-flex items-center space-x-2 border px-4 py-1 rounded-full text-xs font-bold ${themeStyles.gradeBadge}`}>
                  <span>Awarded Grade: {certData.grade}</span>
                  <span>•</span>
                  <span>Completed: {certData.completionDate}</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 grid grid-cols-3 gap-4 items-end text-xs font-sans text-slate-700">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">
                    {certData.instructorName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{certData.instructorTitle}</div>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center">
                  {certData.showSeal ? (
                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-[9px] uppercase tracking-wider text-center p-1 shadow-xs ${themeStyles.sealBorder}`}>
                      {certData.sealText}
                    </div>
                  ) : (
                    <div className="w-16 h-16" />
                  )}
                  <div className="text-[9px] font-mono text-slate-400 mt-1">
                    Cert #{certData.certificateSerial}
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800 font-serif italic text-sm">
                    {certData.directorName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-bold">{certData.directorTitle}</div>
                </div>
              </div>

              {/* Bottom Verification Note */}
              {certData.showVerification && (
                <div className={`pt-4 border-t ${themeStyles.divider} flex items-center justify-between text-[10px] font-sans text-slate-400`}>
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Online: {certData.verificationUrl}</span>
                  </div>
                  <span>Issue Date: {certData.issueDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Control Bar for easy navigation */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Certificates (ফিরে যান)</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'customize' ? 'preview' : 'customize')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
            >
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span>{activeTab === 'customize' ? 'Hide Customizer' : 'Edit Certificate Data'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 hidden md:inline">
              Press <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono font-bold">ESC</kbd> or click outside to exit
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate (প্রিন্ট করুন)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
