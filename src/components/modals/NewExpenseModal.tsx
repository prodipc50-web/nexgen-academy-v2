import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { X, Receipt, CheckCircle2 } from 'lucide-react';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, currentUser } = useAcademy();

  const [category, setCategory] = useState<ExpenseCategory>('Utility & Electricity');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paidTo, setPaidTo] = useState('');
  const [description, setDescription] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !paidTo.trim() || !description.trim()) {
      alert('Please fill the expense amount, payee, and description.');
      return;
    }

    addExpense({
      category,
      amount,
      date,
      paymentMethod,
      paidTo,
      description,
      approvedBy: currentUser.name,
      receiptNumber: receiptNumber || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-rose-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-600">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Record Office Expense</h3>
              <p className="text-[11px] text-rose-200">Log operational expenditure and bills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Expense Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
              >
                <option value="Office Rent">Office Rent</option>
                <option value="Trainer Remuneration">Trainer Remuneration</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Utility & Electricity">Utility & Electricity</option>
                <option value="Internet / Broadband">Internet / Broadband</option>
                <option value="Marketing & Meta Ads">Marketing & Meta Ads</option>
                <option value="Software & AI Subscriptions">Software & AI Subscriptions</option>
                <option value="Hardware Maintenance">Hardware Maintenance</option>
                <option value="Entertainment & Refreshment">Entertainment & Refreshment</option>
                <option value="Printing & Stationery">Printing & Stationery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Amount (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-rose-50/50 border border-rose-300 rounded-lg px-3 py-2 text-rose-950 font-black text-base outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Expense Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
              >
                <option value="Cash">Cash (Petty Cash)</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Paid To (Vendor / Staff / Service) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DESCO / Link3 Technologies / Meta Ireland"
              value={paidTo}
              onChange={e => setPaidTo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Description / Memo <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. High-speed 100Mbps dedicated fiber internet bill for August"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Voucher / Bill Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. VCH-99201"
              value={receiptNumber}
              onChange={e => setReceiptNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
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
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
