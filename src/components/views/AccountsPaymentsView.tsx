import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Payment, PaymentMethod } from '../../types';
import { exportPaymentsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  Receipt,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Save,
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react';

interface AccountsPaymentsViewProps {
  onOpenAddPayment: () => void;
  onOpenReceiptModal: (receiptNumber: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const AccountsPaymentsView: React.FC<AccountsPaymentsViewProps> = ({
  onOpenAddPayment,
  onOpenReceiptModal,
  onSelectStudent
}) => {
  const {
    payments,
    students,
    admissions,
    courses,
    batches,
    staffList,
    stats,
    updatePayment,
    deletePayment,
    clearDemoPayments
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modals state
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Edit form state
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDate, setEditDate] = useState<string>('');
  const [editMethod, setEditMethod] = useState<PaymentMethod>('Cash');
  const [editTrxId, setEditTrxId] = useState<string>('');
  const [editCollectedBy, setEditCollectedBy] = useState<string>('');
  const [editNote, setEditNote] = useState<string>('');

  const openEditModal = (payment: Payment) => {
    setEditingPayment(payment);
    setEditAmount(payment.amount);
    setEditDate(payment.date);
    setEditMethod(payment.paymentMethod);
    setEditTrxId(payment.transactionId || '');
    setEditCollectedBy(payment.collectedBy || '');
    setEditNote(payment.note || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    if (editAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0');
      return;
    }

    updatePayment(editingPayment.id, {
      amount: editAmount,
      date: editDate,
      paymentMethod: editMethod,
      transactionId: editTrxId.trim() || undefined,
      collectedBy: editCollectedBy.trim() || editingPayment.collectedBy,
      note: editNote.trim() || undefined
    });

    setEditingPayment(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingPayment) return;
    deletePayment(deletingPayment.id);
    setDeletingPayment(null);
  };

  const handleConfirmClearAll = () => {
    clearDemoPayments();
    setShowClearAllModal(false);
  };

  const filteredPayments = payments.filter(p => {
    const stu = students.find(s => s.id === p.studentId);
    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stu && (stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) || stu.phone.includes(searchTerm))) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    const matchesDate = !dateFilter || p.date === dateFilter;
    return matchesSearch && matchesMethod && matchesDate;
  });

  const totalFilteredAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  // Computed helper for edit payment target admission
  const editTargetAdm = editingPayment ? admissions.find(a => a.id === editingPayment.admissionId) : null;
  const editDiff = editingPayment ? editAmount - editingPayment.amount : 0;
  const editNewTotalPaid = editTargetAdm ? Math.max(0, editTargetAdm.totalPaid + editDiff) : 0;
  const editNewDue = editTargetAdm ? Math.max(0, editTargetAdm.finalFee - editNewTotalPaid) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Payment Transactions & Money Receipts
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {payments.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time transaction ledger, edit/delete payments, automatic due recalculations, and printable receipts
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => exportPaymentsSpreadsheet(filteredPayments, students, admissions, courses, batches)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredPayments.length} Payment Receipts to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredPayments.length})</span>
          </button>

          {payments.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors"
              title="Remove or reset demo payment records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Demo Records</span>
            </button>
          )}

          <button
            onClick={onOpenAddPayment}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Collect Fee / Payment</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Today's Collection</span>
          <span className="text-xl font-black text-emerald-950 mt-1 block">
            ৳{stats.todayCollection.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">This Month's Total</span>
          <span className="text-xl font-black text-indigo-950 mt-1 block">
            ৳{stats.monthCollection.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Filtered Total</span>
          <span className="text-xl font-black text-blue-950 mt-1 block">
            ৳{totalFilteredAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Total Outstanding Due</span>
          <span className="text-xl font-black text-rose-600 mt-1 block">
            ৳{stats.totalDue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search receipt #, student name, student ID, TrxID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold outline-none"
        >
          <option value="all">All Payment Methods</option>
          <option value="Cash">Cash (Front Desk)</option>
          <option value="bKash">bKash</option>
          <option value="Nagad">Nagad</option>
          <option value="Bank">Bank Deposit / Wire</option>
          <option value="Card">Card / POS</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
          title="Filter by Transaction Date"
        />

        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
          >
            Clear Date
          </button>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Receipt # & Date</th>
                <th className="py-3 px-4">Student & Contact</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4">Installment</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Collected Amount</th>
                <th className="py-3 px-4 text-center">Actions & Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(payment => {
                const stu = students.find(s => s.id === payment.studentId);
                const adm = admissions.find(a => a.id === payment.admissionId);
                const crs = courses.find(c => c.id === adm?.courseId);
                const batch = batches.find(b => b.id === adm?.batchId);

                return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-indigo-700">{payment.receiptNumber}</div>
                      <div className="text-[11px] text-slate-400">{payment.date}</div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(payment.studentId)}
                        className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                      >
                        {stu?.name || 'Student Record'}
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {stu?.studentCode || 'NCA-STU'} • {stu?.phone || 'No Phone'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-semibold">{crs?.name || 'Course'}</div>
                      <div className="text-[10px] text-slate-400">{batch?.batchNumber || 'Batch'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        Installment #{payment.installmentNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{payment.paymentMethod}</div>
                      {payment.transactionId && (
                        <div className="font-mono text-[10px] text-slate-400">Trx: {payment.transactionId}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-black text-sm text-emerald-700">
                      ৳{payment.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* View / Print Receipt */}
                        <button
                          onClick={() => onOpenReceiptModal(payment.receiptNumber)}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center space-x-1 transition-colors"
                          title="Print Official Money Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden md:inline text-[11px]">Receipt</span>
                        </button>

                        {/* Edit Payment */}
                        <button
                          onClick={() => openEditModal(payment)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-xs flex items-center space-x-1 transition-colors"
                          title="Edit Payment Record & Amount"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden md:inline text-[11px]">Edit</span>
                        </button>

                        {/* Delete Payment */}
                        <button
                          onClick={() => setDeletingPayment(payment)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs flex items-center space-x-1 transition-colors"
                          title="Delete / Remove Payment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden md:inline text-[11px]">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No payment transactions found.</p>
                    <p className="text-xs text-slate-400 mt-1">Use "Collect Fee / Payment" to add new student payments.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PAYMENT MODAL */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Edit Payment Receipt</h3>
              </div>
              <button
                onClick={() => setEditingPayment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              {/* Receipt Info Pill */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt Number</span>
                  <span className="font-mono font-bold text-indigo-700 text-sm">{editingPayment.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Installment</span>
                  <span className="font-bold text-slate-800">Installment #{editingPayment.installmentNumber}</span>
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Payment Amount (৳ Taka) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editAmount || ''}
                  onChange={e => setEditAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Enter amount e.g. 5000"
                />
              </div>

              {/* Date & Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={editMethod}
                    onChange={e => setEditMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="Cash">Cash (Front Desk)</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank">Bank Deposit / Transfer</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>
              </div>

              {/* Transaction ID & Collected By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Transaction ID / Ref</label>
                  <input
                    type="text"
                    value={editTrxId}
                    onChange={e => setEditTrxId(e.target.value)}
                    placeholder="e.g. TRX-992384"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Collected By</label>
                  <input
                    type="text"
                    value={editCollectedBy}
                    onChange={e => setEditCollectedBy(e.target.value)}
                    placeholder="e.g. Accounts Staff / Prodip"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Note / Remarks */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Note / Remarks</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  placeholder="Optional remarks e.g. 2nd Installment Paid in Full"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Live Due Recalculation Impact Preview */}
              {editTargetAdm && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center space-x-1 text-amber-900 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Real-Time Balance Recalculation Preview:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block">Total Course Fee:</span>
                      <span className="font-bold text-slate-900">৳{editTargetAdm.finalFee.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">New Total Paid:</span>
                      <span className="font-bold text-emerald-700">৳{editNewTotalPaid.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Updated Due:</span>
                      <span className={`font-bold ${editNewDue > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                        ৳{editNewDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PAYMENT CONFIRM MODAL */}
      {deletingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Delete Payment Record</span>
              </div>
              <button
                onClick={() => setDeletingPayment(null)}
                className="text-rose-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                Are you sure you want to delete payment receipt{' '}
                <strong className="text-slate-900 font-mono">#{deletingPayment.receiptNumber}</strong>?
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Collected Amount:</span>
                  <span className="font-bold text-rose-700 text-sm">৳{deletingPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-semibold text-slate-800">{deletingPayment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-semibold text-slate-800">{deletingPayment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Collected By:</span>
                  <span className="font-semibold text-slate-800">{deletingPayment.collectedBy}</span>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800">
                <span className="font-bold block mb-1">Financial Balance Impact:</span>
                Deleting this payment will reduce the student's recorded total paid by{' '}
                <strong>৳{deletingPayment.amount.toLocaleString()}</strong> and automatically restore their due balance.
                A backup will be kept in the Trash can.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingPayment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL DEMO PAYMENTS MODAL */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Clear All Demo Payments</span>
              </div>
              <button
                onClick={() => setShowClearAllModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700 leading-relaxed">
                This action will delete all <strong className="text-slate-900 font-bold">{payments.length}</strong> payment transactions from the system and archive them to trash.
              </p>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900">
                <span className="font-bold block mb-1">What happens next:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>All payment receipts will be wiped from the ledger.</li>
                  <li>All student admissions will have their <strong>Total Paid</strong> reset to 0 and <strong>Due</strong> set to full course fee.</li>
                  <li>You can start fresh by adding real student payments.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClearAllModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Payments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

