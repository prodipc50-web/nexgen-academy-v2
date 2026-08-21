import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Admission, Student, PaymentMethod } from '../../types';
import { X, CreditCard, Receipt, CheckCircle2, AlertCircle } from 'lucide-react';

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAdmissionId?: string;
  onSuccessPayment?: (receiptNumber: string) => void;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  isOpen,
  onClose,
  targetAdmissionId,
  onSuccessPayment
}) => {
  const { admissions, students, courses, batches, addPayment } = useAcademy();

  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>(targetAdmissionId || '');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (targetAdmissionId) {
      setSelectedAdmissionId(targetAdmissionId);
    } else if (admissions.length > 0 && !selectedAdmissionId) {
      const firstDue = admissions.find(a => a.due > 0);
      setSelectedAdmissionId(firstDue ? firstDue.id : admissions[0].id);
    }
  }, [targetAdmissionId, admissions, selectedAdmissionId]);

  const selectedAdmission = admissions.find(a => a.id === selectedAdmissionId);
  const selectedStudent = selectedAdmission ? students.find(s => s.id === selectedAdmission.studentId) : null;
  const selectedCourse = selectedAdmission ? courses.find(c => c.id === selectedAdmission.courseId) : null;
  const selectedBatch = selectedAdmission ? batches.find(b => b.id === selectedAdmission.batchId) : null;

  useEffect(() => {
    if (selectedAdmission) {
      setAmount(selectedAdmission.due);
    }
  }, [selectedAdmissionId, selectedAdmission]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmissionId || amount <= 0) {
      alert('Please select an admission and enter a valid collection amount.');
      return;
    }

    try {
      const payment = addPayment({
        admissionId: selectedAdmissionId,
        amount,
        paymentMethod,
        transactionId: transactionId || undefined,
        note: note || `Installment payment for ${selectedCourse?.name || 'course'}`
      });

      onClose();
      if (onSuccessPayment) {
        onSuccessPayment(payment.receiptNumber);
      }
    } catch (err: any) {
      alert(`Error collecting payment: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Collect Student Fee / Installment</h3>
              <p className="text-[11px] text-emerald-200">
                Record payment transaction & update admission ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Select Student / Admission Record <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAdmissionId}
              onChange={e => setSelectedAdmissionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {admissions.map(adm => {
                const stu = students.find(s => s.id === adm.studentId);
                const crs = courses.find(c => c.id === adm.courseId);
                return (
                  <option key={adm.id} value={adm.id}>
                    {stu?.name} ({stu?.studentCode}) — Due: ৳{adm.due.toLocaleString()} [{crs?.name.slice(0, 20)}...]
                  </option>
                );
              })}
            </select>
          </div>

          {/* Admission Summary Card */}
          {selectedAdmission && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <span className="font-bold text-slate-900">{selectedStudent?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Course & Batch:</span>
                <span className="font-bold text-slate-900">{selectedBatch?.batchNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Agreed Fee:</span>
                <span className="font-semibold text-slate-800">৳{selectedAdmission.finalFee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Currently Paid:</span>
                <span className="font-semibold text-emerald-700">৳{selectedAdmission.totalPaid.toLocaleString()}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-bold">Outstanding Due Balance:</span>
                <span className="text-sm font-black text-rose-600">
                  ৳{selectedAdmission.due.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Collecting Amount (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={selectedAdmission?.due || 100000}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-emerald-50/50 border border-emerald-300 rounded-lg px-3 py-2 text-emerald-950 font-black text-base outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
              >
                <option value="Cash">Cash (Office Desk)</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank Wire / Deposit</option>
                <option value="Card">Card / POS</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Transaction ID / Bank Receipt Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. BK9928172"
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Payment Notes / Remarks</label>
            <input
              type="text"
              placeholder="e.g. 2nd Installment / Mid-term exam clearance"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Collect & Print Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
