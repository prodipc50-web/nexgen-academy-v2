import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  CreditCard,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const FinancialReportsView: React.FC = () => {
  const { payments, expenses, courses, admissions, stats } = useAcademy();

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

  // Filter payments and expenses by selected month
  const monthPayments = payments.filter(p => p.date.startsWith(selectedMonth));
  const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  const totalIncome = monthPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Breakdown by course
  const courseRevenueMap: { [courseName: string]: number } = {};
  monthPayments.forEach(p => {
    const adm = admissions.find(a => a.id === p.admissionId);
    const crs = courses.find(c => c.id === adm?.courseId);
    const cName = crs?.name || 'General Training';
    courseRevenueMap[cName] = (courseRevenueMap[cName] || 0) + p.amount;
  });

  // Breakdown by expense category
  const expenseCatMap: { [cat: string]: number } = {};
  monthExpenses.forEach(e => {
    expenseCatMap[e.category] = (expenseCatMap[e.category] || 0) + e.amount;
  });

  // Payment method breakdown
  const methodMap: { [method: string]: number } = {};
  monthPayments.forEach(p => {
    methodMap[p.paymentMethod] = (methodMap[p.paymentMethod] || 0) + p.amount;
  });

  const exportCSV = () => {
    let csv = `Type,Date,Description / Particulars,Method,Amount (BDT)\n`;
    monthPayments.forEach(p => {
      csv += `Income,${p.date},Student Fee Collection Receipt ${p.receiptNumber},${p.paymentMethod},${p.amount}\n`;
    });
    monthExpenses.forEach(e => {
      csv += `Expense,${e.date},${e.category} - ${e.paidTo} (${e.description.replace(/,/g, ' ')}),${e.paymentMethod},${e.amount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexgen_Financial_Report_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Financial Analytics & Profit/Loss Statement
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              P&L Audit
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time monthly revenue streams, expenditure breakdowns, course profitability, and CSV statement exports
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs outline-none"
          />

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement (CSV)</span>
          </button>
        </div>
      </div>

      {/* 3 Main P&L KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Gross Fee Income</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-950">৳{totalIncome.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            {monthPayments.length} Student Fee Transactions
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Operational Expense</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-rose-950">৳{totalExpense.toLocaleString()}</div>
          <div className="text-[11px] text-rose-700 mt-1 font-medium">
            {monthExpenses.length} Expense Vouchers Logged
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${netProfit >= 0 ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Net Operating Profit</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white border border-slate-200">
              Margin: {profitMargin}%
            </span>
          </div>
          <div className="mt-2 text-3xl font-black">৳{netProfit.toLocaleString()}</div>
          <div className="text-[11px] mt-1 font-medium opacity-80">
            For Period: {selectedMonth}
          </div>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Revenue Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Revenue by Skill Course</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Total: ৳{totalIncome.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(courseRevenueMap).map(([courseName, amount]) => {
              const pct = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
              return (
                <div key={courseName} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800 truncate">{courseName}</span>
                    <span className="text-slate-900 font-bold">
                      ৳{amount.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            {Object.keys(courseRevenueMap).length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">No revenue data for this period.</div>
            )}
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-rose-600" />
              <span>Expenses by Category</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Total: ৳{totalExpense.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(expenseCatMap).map(([cat, amount]) => {
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{cat}</span>
                    <span className="text-rose-700 font-bold">
                      ৳{amount.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            {Object.keys(expenseCatMap).length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">No expense vouchers in this period.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
