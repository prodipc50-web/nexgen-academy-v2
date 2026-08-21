import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { exportExpensesSpreadsheet } from '../../utils/spreadsheetExport';
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Calendar,
  CreditCard,
  Building2,
  DollarSign,
  Edit2,
  X,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface ExpensesViewProps {
  onOpenAddExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onOpenAddExpense }) => {
  const {
    expenses,
    updateExpense,
    deleteExpense,
    clearDemoExpenses,
    expenseCategoriesList,
    paymentMethodsList,
    stats
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDate, setEditDate] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editPaidTo, setEditPaidTo] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editReceiptNumber, setEditReceiptNumber] = useState('');

  // Delete & Clear Confirmation State
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isConfirmingClearDemo, setIsConfirmingClearDemo] = useState(false);

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.paidTo && exp.paidTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exp.paidBy && exp.paidBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exp.receiptNumber && exp.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesDate = !dateFilter || exp.date === dateFilter;
    return matchesSearch && matchesCat && matchesDate;
  });

  const totalFilteredExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setEditCategory(exp.category);
    setEditAmount(exp.amount);
    setEditDate(exp.date);
    setEditPaymentMethod(exp.paymentMethod);
    setEditPaidTo(exp.paidTo || exp.paidBy || '');
    setEditDescription(exp.description);
    setEditReceiptNumber(exp.receiptNumber || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || editAmount <= 0) return;

    updateExpense(editingExpense.id, {
      category: editCategory as ExpenseCategory,
      amount: editAmount,
      date: editDate,
      paymentMethod: editPaymentMethod as PaymentMethod,
      paidTo: editPaidTo.trim(),
      description: editDescription.trim(),
      receiptNumber: editReceiptNumber.trim() || undefined
    });

    setEditingExpense(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingExpense) return;
    deleteExpense(deletingExpense.id);
    setDeletingExpense(null);
  };

  const handleClearDemoConfirm = () => {
    clearDemoExpenses();
    setIsConfirmingClearDemo(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Office Expenses & Operational Costs
            </h2>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {expenses.length} Expense Vouchers
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Log academy overhead, trainer salaries, internet bills, rent, and software licenses
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => exportExpensesSpreadsheet(filteredExpenses)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredExpenses.length} Expense Records to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredExpenses.length})</span>
          </button>

          {expenses.length > 0 && (
            <button
              onClick={() => setIsConfirmingClearDemo(true)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-slate-200"
              title="Clear all demo/sample expenses"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear Sample Records</span>
            </button>
          )}

          <button
            onClick={onOpenAddExpense}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Expense Voucher</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
            Total Monthly Expenses
          </span>
          <span className="text-2xl font-black text-rose-950 mt-1 block">
            ৳{stats.totalExpenseMonth.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
            Filtered Expense Total
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ৳{totalFilteredExpense.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
            Net Academy Profit (This Month)
          </span>
          <span className={`text-2xl font-black mt-1 block ${stats.netIncomeMonth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ৳{stats.netIncomeMonth.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search description, payee / vendor, voucher #..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold outline-none"
        >
          <option value="all">All Expense Categories</option>
          {expenseCategoriesList.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
          title="Filter by Expense Date"
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

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Voucher #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To / Vendor</th>
                <th className="py-3 px-4">Description / Purpose</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{exp.date}</div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {exp.receiptNumber || 'VCH-AUTO'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {exp.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800">
                    {exp.paidTo || exp.paidBy || 'Academy Admin'}
                  </td>

                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {exp.description}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {exp.paymentMethod}
                  </td>

                  <td className="py-3 px-4 font-black text-sm text-rose-700">
                    ৳{exp.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                      title="Edit Expense Voucher"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingExpense(exp)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No expense records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 bg-rose-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Edit Expense Voucher</h3>
                <p className="text-[11px] text-rose-200 font-mono">{editingExpense.receiptNumber || 'Voucher'}</p>
              </div>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expense Category</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {expenseCategoriesList.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amount (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editAmount}
                    onChange={e => setEditAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={editPaymentMethod}
                    onChange={e => setEditPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {paymentMethodsList.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Paid To / Payee Name</label>
                  <input
                    type="text"
                    required
                    value={editPaidTo}
                    onChange={e => setEditPaidTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Voucher / Memo #</label>
                  <input
                    type="text"
                    value={editReceiptNumber}
                    onChange={e => setEditReceiptNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Expense Confirmation */}
      {deletingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Expense Voucher</h3>
                <p className="text-[11px] text-slate-500">Amount: ৳{deletingExpense.amount.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this expense voucher for <strong>{deletingExpense.description}</strong>? It can be restored later from Trash.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingExpense(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Demo Expenses Confirmation */}
      {isConfirmingClearDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Clear All Sample Expenses</h3>
                <p className="text-[11px] text-slate-500">Reset Expense Ledger</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all demo expense vouchers and give you a clean ledger to record real academy expenses.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingClearDemo(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearDemoConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Clear Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
