import React, { useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Payment } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import { X, Printer, CheckCircle, ShieldCheck, Download, ArrowLeft } from 'lucide-react';

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
  const { payments, admissions, students, courses, batches } = useAcademy();

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

  if (!isOpen) return null;

  const payment = receiptNumber
    ? payments.find(p => p.receiptNumber === receiptNumber)
    : payments[0];

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

  const admission = admissions.find(a => a.id === payment.admissionId);
  const student = students.find(s => s.id === payment.studentId);
  const course = admission ? courses.find(c => c.id === admission.courseId) : null;
  const batch = admission ? batches.find(b => b.id === admission.batchId) : null;

  const handlePrint = () => {
    window.print();
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
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-700 hover:border-slate-600 transition-colors shadow-xs"
              title="Go back / ফিরে যান (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>← Back / ফিরে যান</span>
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-300 pl-2 border-l border-slate-800">
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Student Money Receipt & Invoice</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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

        {/* Printable Receipt Paper */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-white text-slate-900 font-sans space-y-6 print:p-0 print:m-0" id="money-receipt-printable">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-4">
            <div>
              <div className="flex items-center space-x-3">
                <NexgenLogo variant="crest" size={54} />
                <div>
                  <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">
                    Nexgen Computer Academy
                  </h2>
                  <p className="text-[11px] text-slate-600 font-bold tracking-wide">
                    Center for Excellence in IT, AI & Professional Skills
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                14/B Garden Road, Farmgate, Dhaka-1215 | Hotline: +880 1711-223344
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                Money Receipt
              </span>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-500">Receipt No: </span>
                  <span className="font-mono font-bold text-slate-900">{payment.receiptNumber}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date: </span>
                  <span className="font-bold text-slate-800">{payment.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 text-[11px]">Student Name:</span>
                <div className="font-bold text-slate-900 text-sm">{student?.name}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Student ID / Code:</span>
                <div className="font-mono font-bold text-indigo-700">{student?.studentCode}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Contact Phone:</span>
                <div className="font-medium text-slate-800">{student?.phone}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-500 text-[11px]">Enrolled Course:</span>
                <div className="font-bold text-slate-900">{course?.name}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Batch Number:</span>
                <div className="font-bold text-slate-800">{batch?.batchNumber} ({batch?.classDays})</div>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Admission No:</span>
                <div className="font-mono text-slate-700">{admission?.admissionCode}</div>
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
                      {payment.installmentNumber === 1 ? 'Admission Fee & 1st Installment' : `Installment #${payment.installmentNumber} Payment`}
                    </div>
                    <div className="text-[11px] text-slate-500">{payment.note || 'Academic Course Tuition Fee'}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-semibold">{payment.paymentMethod}</div>
                    {payment.transactionId && (
                      <div className="font-mono text-[10px] text-slate-500">Trx: {payment.transactionId}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm text-slate-900">
                    ৳{payment.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Summary */}
          {admission && (
            <div className="flex justify-end">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Course Agreed Fee:</span>
                  <span className="font-semibold text-slate-900">৳{admission.finalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Paid (Cumulative):</span>
                  <span className="font-bold text-emerald-700">৳{admission.totalPaid.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-slate-900">
                  <span>Outstanding Due Balance:</span>
                  <span className={`font-black ${admission.due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ৳{admission.due.toLocaleString()}
                  </span>
                </div>
                {admission.due > 0 && admission.nextPaymentDate && (
                  <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 text-center font-medium">
                    Next Due Date: {admission.nextPaymentDate}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer & Signature Stamps */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs">
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified & System Generated</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Printed on: {new Date().toLocaleString()} | Cashier: {payment.collectedBy}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 w-48 text-center pb-1 font-semibold text-slate-700">
                Authorized Signature / Seal
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Nexgen Computer Academy</div>
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
