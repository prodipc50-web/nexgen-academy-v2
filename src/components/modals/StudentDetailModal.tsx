import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Student, Admission, Payment, Batch } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  GraduationCap,
  CreditCard,
  CalendarCheck,
  Award,
  History,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
  PlusCircle,
  FileText,
  ArrowRightLeft,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  onOpenPaymentModal: (admissionId: string) => void;
  onOpenReceiptModal: (receiptNumber: string) => void;
  onOpenCertificateModal: (certId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  studentId,
  onOpenPaymentModal,
  onOpenReceiptModal,
  onOpenCertificateModal
}) => {
  const {
    students,
    admissions,
    payments,
    courses,
    batches,
    attendance,
    examResults,
    exams,
    certificates,
    staffList,
    updateStudent,
    transferStudentBatch,
    issueCertificate,
    deletePayment
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'attendance' | 'academics' | 'timeline' | 'transfer'>('overview');

  // Transfer State
  const [targetBatchId, setTargetBatchId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // Certificate issuance state
  const [certGrade, setCertGrade] = useState('A+ (Distinction)');

  if (!isOpen) return null;

  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const admission = admissions.find(a => a.studentId === student.id);
  const course = admission ? courses.find(c => c.id === admission.courseId) : null;
  const currentBatch = admission ? batches.find(b => b.id === admission.batchId) : null;
  const counselor = admission ? staffList.find(s => s.id === admission.counselorId) : null;
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentResults = examResults.filter(r => r.studentId === student.id);
  const studentCert = certificates.find(c => c.studentId === student.id);

  // Attendance stats
  const totalClasses = studentAttendance.length;
  const presentClasses = studentAttendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBatch || !targetBatchId) return;
    transferStudentBatch(student.id, currentBatch.id, targetBatchId, transferReason || 'Student request');
    setActiveTab('overview');
    alert('Student batch transferred successfully!');
  };

  const handleIssueCert = () => {
    if (!course || !currentBatch) return;
    const cert = issueCertificate({
      studentId: student.id,
      courseId: course.id,
      batchId: currentBatch.id,
      grade: certGrade,
      completionDate: new Date().toISOString().split('T')[0]
    });
    alert(`Certificate #${cert.certificateCode || cert.certificateNumber} issued!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header Profile Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-950 relative overflow-hidden">
          <div className="absolute right-24 top-0 bottom-0 opacity-10 pointer-events-none hidden md:flex items-center">
            <NexgenLogo variant="crest" size={120} />
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            <img
              src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight">{student.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  student.status === 'Active' ? 'bg-emerald-500 text-white' : student.status === 'Completed' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {student.status}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-indigo-200 mt-1">
                <span className="font-mono bg-indigo-900/80 px-2 py-0.5 rounded text-white font-semibold">
                  {student.studentCode}
                </span>
                <span>•</span>
                <span>{course?.name || 'No Course'}</span>
                <span>•</span>
                <span>{currentBatch?.batchNumber || 'No Batch'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            {admission && admission.due > 0 && (
              <button
                onClick={() => onOpenPaymentModal(admission.id)}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Collect ৳{admission.due.toLocaleString()} Due</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center space-x-4 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Info
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'financials' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Ledger & Receipts</span>
            {admission && admission.due > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'attendance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Attendance ({attendanceRate}%)
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'academics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Exams & Certificate
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Activity Timeline
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'transfer' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Batch Transfer</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Contact Details
                  </span>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold">{student.phone}</span>
                    </div>
                    {student.altPhone && (
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.altPhone} (Alt)</span>
                      </div>
                    )}
                    {student.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{student.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{student.address || 'Address not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Academic & Career Profile
                  </span>
                  <div className="space-y-1.5 text-slate-700">
                    <div>
                      <span className="text-slate-500">Occupation:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.occupation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Education:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.education}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Institution:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.institution || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Learning Goal:</span>{' '}
                      <span className="font-semibold text-indigo-700">{student.studentGoal}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Guardian & Emergency
                  </span>
                  <div className="space-y-1.5 text-slate-700">
                    <div>
                      <span className="text-slate-500">Guardian Name:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.guardianName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Guardian Phone:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.guardianPhone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Emergency Phone:</span>{' '}
                      <span className="font-semibold text-slate-900">{student.emergencyContact || student.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admission Summary Card */}
              {admission && (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
                  <h4 className="font-bold text-indigo-950 mb-3 text-xs uppercase tracking-wider">
                    Current Admission Enrollment
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Admission Code:</span>
                      <span className="font-mono font-bold text-slate-900">{admission.admissionCode || admission.admissionNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Admission Date:</span>
                      <span className="font-semibold text-slate-900">{admission.admissionDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Counselor:</span>
                      <span className="font-semibold text-slate-900">{counselor?.name || 'Assigned'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Lead Source:</span>
                      <span className="font-semibold text-slate-900">{admission.leadSource}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Official Academy Student ID Card */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-5 rounded-2xl text-white border border-indigo-800/60 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-indigo-400/80 shadow-md shrink-0 bg-slate-800">
                      <img
                        src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50 inline-block">
                        Student Identity Card
                      </span>
                      <h4 className="text-base font-black tracking-wide text-white">{student.name}</h4>
                      <p className="text-xs text-indigo-200">{course?.name}</p>
                      <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-300">
                        <span>ID: <strong className="text-white">{student.studentCode}</strong></span>
                        <span>•</span>
                        <span>Batch: <strong className="text-white">{currentBatch?.batchNumber || 'N/A'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end text-center sm:text-right shrink-0">
                    <NexgenLogo variant="crest" size={54} />
                    <span className="text-[11px] font-black text-white uppercase tracking-wider mt-1">Nexgen Academy</span>
                    <span className="text-[9px] text-slate-400">Verified Student Credential</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS */}
          {activeTab === 'financials' && admission && (
            <div className="space-y-5">
              {/* Financial KPI stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Agreed Final Fee</span>
                  <span className="text-base font-black text-slate-900">৳{admission.finalFee.toLocaleString()}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-emerald-700 block text-[11px]">Total Paid</span>
                  <span className="text-base font-black text-emerald-800">৳{admission.totalPaid.toLocaleString()}</span>
                </div>
                <div className={`p-3 rounded-xl border ${admission.due > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`block text-[11px] ${admission.due > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                    Remaining Due
                  </span>
                  <span className={`text-base font-black ${admission.due > 0 ? 'text-rose-800' : 'text-slate-700'}`}>
                    ৳{admission.due.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Status</span>
                    <span className="font-bold text-slate-800">{admission.paymentStatus}</span>
                  </div>
                  {admission.due > 0 && (
                    <button
                      onClick={() => onOpenPaymentModal(admission.id)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                    >
                      Collect
                    </button>
                  )}
                </div>
              </div>

              {/* Payments History Table */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Collected Payments & Receipts</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Receipt No</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Installment</th>
                        <th className="py-2 px-3">Method</th>
                        <th className="py-2 px-3">Trx ID</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPayments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{p.receiptNumber}</td>
                          <td className="py-2.5 px-3">{p.date}</td>
                          <td className="py-2.5 px-3 font-semibold">#{p.installmentNumber}</td>
                          <td className="py-2.5 px-3">{p.paymentMethod}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{p.transactionId || '-'}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">৳{p.amount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => onOpenReceiptModal(p.receiptNumber)}
                                className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-[10px] font-semibold"
                                title="Print Receipt"
                              >
                                View / Print
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete payment receipt #${p.receiptNumber} (৳${p.amount.toLocaleString()})? The student's due balance will increase accordingly.`)) {
                                    deletePayment(p.id);
                                  }
                                }}
                                className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded transition-colors"
                                title="Delete Payment Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {studentPayments.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-slate-400">
                            No payment transactions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Attendance Percentage:</span>
                  <div className="text-lg font-black text-slate-900">{attendanceRate}%</div>
                </div>
                <div className="text-right text-slate-600">
                  <span>{presentClasses} Present / {totalClasses} Total Marked Classes</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Remarks / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.map(att => (
                      <tr key={att.id}>
                        <td className="py-2 px-3 font-medium">{att.date}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : att.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{att.note || '-'}</td>
                      </tr>
                    ))}
                    {studentAttendance.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-400">
                          No attendance marked yet for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACADEMICS & CERTIFICATE */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Exams */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Exam Results & Marks</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Exam Title</th>
                        <th className="py-2 px-3">Marks Obtained</th>
                        <th className="py-2 px-3">Grade</th>
                        <th className="py-2 px-3">Evaluator Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentResults.map(res => {
                        const ex = exams.find(e => e.id === res.examId);
                        return (
                          <tr key={res.id}>
                            <td className="py-2 px-3 font-semibold text-slate-800">{ex?.title || 'Exam'}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{res.marksObtained} / {ex?.totalMarks || 100}</td>
                            <td className="py-2 px-3 font-black text-indigo-700">{res.grade}</td>
                            <td className="py-2 px-3 text-slate-500">{res.feedback || '-'}</td>
                          </tr>
                        );
                      })}
                      {studentResults.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">
                            No exam submissions evaluated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Certificate Section */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-slate-900">Certificate Status</h4>
                  </div>
                  {studentCert ? (
                    <button
                      onClick={() => onOpenCertificateModal(studentCert.id)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View / Print Certificate</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <select
                        value={certGrade}
                        onChange={e => setCertGrade(e.target.value)}
                        className="bg-white border border-amber-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800"
                      >
                        <option value="A+ (Distinction)">A+ (Distinction)</option>
                        <option value="A (Excellent)">A (Excellent)</option>
                        <option value="A- (Very Good)">A- (Very Good)</option>
                        <option value="B+ (Good)">B+ (Good)</option>
                      </select>
                      <button
                        onClick={handleIssueCert}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                      >
                        Issue Certificate
                      </button>
                    </div>
                  )}
                </div>
                {studentCert && (
                  <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                    <div>Certificate ID: <span className="font-mono font-bold text-slate-900">{studentCert.certificateCode || studentCert.certificateNumber}</span></div>
                    <div>Grade: <span className="font-bold text-amber-800">{studentCert.grade}</span> | Issued on: {studentCert.issueDate}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
                {(student.timeline || []).map((item, idx) => (
                  <div key={item.id || idx} className="relative pl-6">
                    <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs"></div>
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {item.date} • by {item.performedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BATCH TRANSFER */}
          {activeTab === 'transfer' && (
            <form onSubmit={handleTransfer} className="space-y-4 max-w-lg">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Current Batch:</span>
                <span className="font-bold text-slate-900 text-sm">{currentBatch?.batchNumber} ({currentBatch?.classDays})</span>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Select Target Batch <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={targetBatchId}
                  onChange={e => setTargetBatchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                >
                  <option value="">-- Choose New Batch --</option>
                  {batches
                    .filter(b => b.id !== currentBatch?.id)
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} — {b.classDays} ({b.classTime}) [{b.room}]
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reason for Transfer</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule clash with university exam / preferred evening slot"
                  value={transferReason}
                  onChange={e => setTransferReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Confirm & Transfer Student</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
