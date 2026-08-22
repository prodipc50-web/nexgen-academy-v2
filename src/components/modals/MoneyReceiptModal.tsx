import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Payment } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  CheckCircle,
  ShieldCheck,
  Download,
  ArrowLeft,
  Edit3,
  RotateCcw,
  Save,
  Check,
  Phone,
  Building,
  MapPin,
  Globe
} from 'lucide-react';

interface MoneyReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptNumber?: string;
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptNumber
}) => {
  const { payments, admissions, students, courses, batches, academySettings, updateAcademySettings } = useAcademy();
  const [showEditor, setShowEditor] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const payment = receiptNumber
    ? payments.find(p => p.receiptNumber === receiptNumber)
    : payments[0];

  const admission = payment ? admissions.find(a => a.id === payment.admissionId) : undefined;
  const student = payment ? students.find(s => s.id === payment.studentId) : undefined;
  const course = admission ? courses.find(c => c.id === admission.courseId) : undefined;
  const batch = admission ? batches.find(b => b.id === admission.batchId) : undefined;

  // Fully customizable receipt state
  const [receiptData, setReceiptData] = useState({
    instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
    tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
    campusName: academySettings.campusName || 'Farmgate Campus',
    address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
    hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
    website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
    receiptNumber: payment?.receiptNumber || 'REC-2026-001',
    date: payment?.date || new Date().toISOString().split('T')[0],
    studentName: student?.name || '',
    studentCode: student?.studentCode || '',
    studentPhone: student?.phone || '',
    courseName: course?.name || '',
    batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : '',
    admissionCode: admission?.admissionCode || '',
    paymentDescription: payment ? (payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`) : 'Course Tuition Fee',
    paymentNote: payment?.note || 'Academic Course Tuition Fee',
    paymentMethod: payment?.paymentMethod || 'Cash',
    transactionId: payment?.transactionId || '',
    paidAmount: payment?.amount || 0,
    totalFee: admission?.finalFee || payment?.amount || 0,
    totalPaid: admission?.totalPaid || payment?.amount || 0,
    dueBalance: admission?.due ?? 0,
    nextDueDate: admission?.nextPaymentDate || '',
    collectedBy: payment?.collectedBy || 'Cashier / Admin',
    signatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signature / Seal'
  });

  // Sync state whenever payment, admission or academy settings change
  useEffect(() => {
    if (payment) {
      setReceiptData(prev => ({
        ...prev,
        instituteName: academySettings.instituteName || prev.instituteName,
        tagline: academySettings.tagline || prev.tagline,
        campusName: academySettings.campusName || prev.campusName || 'Farmgate Campus',
        address: academySettings.officialAddress || prev.address,
        hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || prev.hotlinePhone || '01798444444',
        website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : prev.website,
        receiptNumber: payment.receiptNumber,
        date: payment.date,
        studentName: student?.name || prev.studentName,
        studentCode: student?.studentCode || prev.studentCode,
        studentPhone: student?.phone || prev.studentPhone,
        courseName: course?.name || prev.courseName,
        batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : prev.batchNumber,
        admissionCode: admission?.admissionCode || prev.admissionCode,
        paymentDescription: payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`,
        paymentNote: payment.note || 'Academic Course Tuition Fee',
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId || '',
        paidAmount: payment.amount,
        totalFee: admission?.finalFee || payment.amount,
        totalPaid: admission?.totalPaid || payment.amount,
        dueBalance: admission?.due ?? 0,
        nextDueDate: admission?.nextPaymentDate || '',
        collectedBy: payment.collectedBy || prev.collectedBy
      }));
    }
  }, [payment, admission, student, course, batch, academySettings, isOpen]);

  if (!isOpen) return null;

  if (!payment) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <div 
          className="bg-white p-6 rounded-2xl shadow-xl max-w-sm text-center"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-sm font-semibold text-slate-800">Receipt record not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            ← Back (ফিরে যান)
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDefaults = () => {
    updateAcademySettings({
      primarySupportPhone: receiptData.hotlinePhone,
      campusName: receiptData.campusName,
      officialAddress: receiptData.address
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setReceiptData({
      instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
      tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
      campusName: academySettings.campusName || 'Farmgate Campus',
      address: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
      hotlinePhone: academySettings.primarySupportPhone || academySettings.helplines?.[0] || '01798444444',
      website: academySettings.websiteUrl ? academySettings.websiteUrl.replace(/^https?:\/\//, '') : 'nexgenacademy.edu.bd',
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      studentName: student?.name || '',
      studentCode: student?.studentCode || '',
      studentPhone: student?.phone || '',
      courseName: course?.name || '',
      batchNumber: batch ? `${batch.batchNumber}${batch.classDays ? ` (${batch.classDays})` : ''}` : '',
      admissionCode: admission?.admissionCode || '',
      paymentDescription: payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`,
      paymentNote: payment.note || 'Academic Course Tuition Fee',
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || '',
      paidAmount: payment.amount,
      totalFee: admission?.finalFee || payment.amount,
      totalPaid: admission?.totalPaid || payment.amount,
      dueBalance: admission?.due ?? 0,
      nextDueDate: admission?.nextPaymentDate || '',
      collectedBy: payment.collectedBy || 'Cashier / Admin',
      signatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signature / Seal'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden during print) */}
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
              <span>{showEditor ? 'Hide Editor' : 'Edit / Customize Receipt (ম্যানুয়াল এডিট)'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                <Check className="w-3.5 h-3.5" />
                <span>Saved as Default</span>
              </span>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
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

        {/* Manual Field Customizer Drawer */}
        {showEditor && (
          <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 max-h-80 overflow-y-auto space-y-4 print:hidden animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Customize Receipt Header, Hotline & Student Details</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveDefaults}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-[11px] transition-colors"
                  title="Save Hotline & Campus as permanent academy defaults"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Hotline Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to DB</span>
                </button>
              </div>
            </div>

            {/* Helpline / Hotline Number Management */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-amber-950 font-bold flex items-center space-x-1.5 text-xs">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Receipt Hotline / Support Phone Number (রিসিপ্টে প্রিন্ট হওয়ার হেল্পলাইন)</span>
                </label>
                <span className="text-[10px] text-amber-800 font-mono">Default: 01798444444</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={receiptData.hotlinePhone}
                    onChange={e => setReceiptData({ ...receiptData, hotlinePhone: e.target.value })}
                    placeholder="e.g. 01798444444"
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Quick Select Buttons from Academy Helplines */}
                {academySettings.helplines && academySettings.helplines.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-amber-900 font-bold mr-1">Quick Select:</span>
                    {academySettings.helplines.map((hp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReceiptData({ ...receiptData, hotlinePhone: hp })}
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors ${
                          receiptData.hotlinePhone === hp
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {hp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Campus / Branch</label>
                  <input
                    type="text"
                    value={receiptData.campusName}
                    onChange={e => setReceiptData({ ...receiptData, campusName: e.target.value })}
                    placeholder="e.g. Farmgate Campus"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Official Address</label>
                  <input
                    type="text"
                    value={receiptData.address}
                    onChange={e => setReceiptData({ ...receiptData, address: e.target.value })}
                    placeholder="14/B Garden Road, Farmgate, Dhaka-1215"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={receiptData.website}
                    onChange={e => setReceiptData({ ...receiptData, website: e.target.value })}
                    placeholder="nexgenacademy.edu.bd"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Student & Invoice Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  value={receiptData.studentName}
                  onChange={e => setReceiptData({ ...receiptData, studentName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student ID / Code</label>
                <input
                  type="text"
                  value={receiptData.studentCode}
                  onChange={e => setReceiptData({ ...receiptData, studentCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Student Contact Phone</label>
                <input
                  type="text"
                  value={receiptData.studentPhone}
                  onChange={e => setReceiptData({ ...receiptData, studentPhone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course Name</label>
                <input
                  type="text"
                  value={receiptData.courseName}
                  onChange={e => setReceiptData({ ...receiptData, courseName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch & Schedule</label>
                <input
                  type="text"
                  value={receiptData.batchNumber}
                  onChange={e => setReceiptData({ ...receiptData, batchNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Admission Number</label>
                <input
                  type="text"
                  value={receiptData.admissionCode}
                  onChange={e => setReceiptData({ ...receiptData, admissionCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={receiptData.receiptNumber}
                  onChange={e => setReceiptData({ ...receiptData, receiptNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Date</label>
                <input
                  type="date"
                  value={receiptData.date}
                  onChange={e => setReceiptData({ ...receiptData, date: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  value={receiptData.paidAmount}
                  onChange={e => setReceiptData({ ...receiptData, paidAmount: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                <input
                  type="text"
                  value={receiptData.paymentMethod}
                  onChange={e => setReceiptData({ ...receiptData, paymentMethod: e.target.value })}
                  placeholder="Cash / bKash / Nagad / Bank"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Trx ID / Ref</label>
                <input
                  type="text"
                  value={receiptData.transactionId}
                  onChange={e => setReceiptData({ ...receiptData, transactionId: e.target.value })}
                  placeholder="Optional Transaction ID"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Cashier / Collected By</label>
                <input
                  type="text"
                  value={receiptData.collectedBy}
                  onChange={e => setReceiptData({ ...receiptData, collectedBy: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Agreed Total Fee (৳)</label>
                <input
                  type="number"
                  value={receiptData.totalFee}
                  onChange={e => setReceiptData({ ...receiptData, totalFee: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Outstanding Due Balance (৳)</label>
                <input
                  type="number"
                  value={receiptData.dueBalance}
                  onChange={e => setReceiptData({ ...receiptData, dueBalance: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Next Payment Due Date</label>
                <input
                  type="text"
                  value={receiptData.nextDueDate}
                  onChange={e => setReceiptData({ ...receiptData, nextDueDate: e.target.value })}
                  placeholder="e.g. 2026-09-15"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printable Receipt Paper */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-white text-slate-900 font-sans space-y-6 print:p-0 print:m-0 print-page-a4" id="money-receipt-printable">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-4">
            <div>
              <div className="flex items-center space-x-3">
                <NexgenLogo variant="crest" size={54} />
                <div>
                  <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">
                    {receiptData.instituteName}
                  </h2>
                  <p className="text-[11px] text-slate-600 font-bold tracking-wide">
                    {receiptData.tagline}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 font-medium">
                <strong className="text-indigo-950">{receiptData.campusName}</strong>: {receiptData.address} | Hotline: <strong className="text-slate-900 font-mono">{receiptData.hotlinePhone}</strong> | <span className="font-mono text-indigo-700">{receiptData.website}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                Money Receipt
              </span>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-500">Receipt No: </span>
                  <span className="font-mono font-bold text-slate-900">{receiptData.receiptNumber}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date: </span>
                  <span className="font-bold text-slate-800">{receiptData.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 text-[11px]">Student Name:</span>
                <div className="font-bold text-slate-900 text-sm">{receiptData.studentName || 'Student Name'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Student ID / Code:</span>
                <div className="font-mono font-bold text-indigo-700">{receiptData.studentCode || 'NCA-STU-001'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Contact Phone:</span>
                <div className="font-medium text-slate-800 font-mono">{receiptData.studentPhone || 'N/A'}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 text-[11px]">Enrolled Course:</span>
                <div className="font-bold text-slate-900">{receiptData.courseName || 'Professional Course'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Batch & Timing:</span>
                <div className="font-bold text-slate-800">{receiptData.batchNumber || 'Batch-01'}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Admission No:</span>
                <div className="font-mono text-slate-700">{receiptData.admissionCode || 'ADM-001'}</div>
              </div>
            </div>
          </div>

          {/* Payment Item Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Method & Ref</th>
                  <th className="py-2.5 px-4 text-right">Paid Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {receiptData.paymentDescription}
                    </div>
                    <div className="text-[11px] text-slate-500">{receiptData.paymentNote}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-semibold">{receiptData.paymentMethod}</div>
                    {receiptData.transactionId && (
                      <div className="font-mono text-[10px] text-slate-500">Trx: {receiptData.transactionId}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm text-slate-900">
                    ৳{receiptData.paidAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Summary */}
          <div className="flex justify-end">
            <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Course Agreed Fee:</span>
                <span className="font-semibold text-slate-900">৳{receiptData.totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Paid (Cumulative):</span>
                <span className="font-bold text-emerald-700">৳{receiptData.totalPaid.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-slate-900">
                <span>Outstanding Due Balance:</span>
                <span className={`font-black ${receiptData.dueBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ৳{receiptData.dueBalance.toLocaleString()}
                </span>
              </div>
              {receiptData.dueBalance > 0 && receiptData.nextDueDate && (
                <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 text-center font-medium">
                  Next Due Date: {receiptData.nextDueDate}
                </div>
              )}
            </div>
          </div>

          {/* Footer & Signature Stamps */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs">
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified & System Generated</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Printed on: {new Date().toLocaleString()} | Cashier: {receiptData.collectedBy}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 w-48 text-center pb-1 font-semibold text-slate-700">
                {receiptData.signatoryTitle}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{receiptData.instituteName}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
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
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

