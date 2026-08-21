import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { exportDuesSpreadsheet } from '../../utils/spreadsheetExport';
import {
  AlertCircle,
  CreditCard,
  Search,
  MessageSquare,
  Copy,
  Check,
  Calendar,
  Phone,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface DueManagementViewProps {
  onOpenCollectPayment: (admissionId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const DueManagementView: React.FC<DueManagementViewProps> = ({
  onOpenCollectPayment,
  onSelectStudent
}) => {
  const { admissions, students, courses, batches, stats, deleteStudent, deleteAdmission, waiveAdmissionDue } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDueStatus, setFilterDueStatus] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingDue, setDeletingDue] = useState<{
    admissionId: string;
    admissionCode: string;
    studentId: string;
    studentName: string;
    studentCode: string;
    dueAmount: number;
    courseName: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const dueAdmissions = admissions.filter(adm => {
    if (adm.due <= 0) return false;
    const stu = students.find(s => s.id === adm.studentId);
    const matchesSearch =
      (stu && (stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) || stu.phone.includes(searchTerm))) ||
      ((adm.admissionCode || adm.admissionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const dueDate = adm.nextPaymentDate || adm.nextDueDate;
    const isOverdue = dueDate && dueDate < todayStr;
    const matchesFilter =
      filterDueStatus === 'all' ||
      (filterDueStatus === 'overdue' && isOverdue) ||
      (filterDueStatus === 'upcoming' && !isOverdue);

    return matchesSearch && matchesFilter;
  });

  const totalOutstandingDue = dueAdmissions.reduce((sum, a) => sum + a.due, 0);

  const handleCopyReminder = (admId: string, stuName: string, courseName: string, dueAmount: number, dueDate?: string) => {
    const text = `Dear ${stuName}, this is a gentle reminder from Nexgen Computer Academy regarding your course "${courseName}". Your outstanding course fee due balance is ৳${dueAmount.toLocaleString()} (Due Date: ${dueDate || 'Immediate'}). Please clear your dues at the academy office or via bKash/Nagad Merchant to avoid batch deactivation. Help desk: +8801700-000000.`;
    navigator.clipboard.writeText(text);
    setCopiedId(admId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleConfirmDelete = () => {
    if (!deletingDue) return;
    deleteAdmission(deletingDue.admissionId);
    if (deletingDue.studentId) {
      // Check if student has any other admissions
      const otherAdmissions = admissions.filter(a => a.studentId === deletingDue.studentId && a.id !== deletingDue.admissionId);
      if (otherAdmissions.length === 0) {
        deleteStudent(deletingDue.studentId);
      }
    }
    showToast(`Removed record for ${deletingDue.studentName}. Sent to Recycle Bin.`);
    setDeletingDue(null);
  };

  const handleWaiveDue = () => {
    if (!deletingDue) return;
    waiveAdmissionDue(deletingDue.admissionId, 'Special Concession / Scholarship Waiver');
    showToast(`Due of ৳${deletingDue.dueAmount.toLocaleString()} waived for ${deletingDue.studentName}.`);
    setDeletingDue(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Due Management & Collection Recovery
            </h2>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {dueAdmissions.length} Accounts with Dues
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Track student fee balances, overdue deadlines, generate automated payment reminder SMS, and collect installments
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportDuesSpreadsheet(dueAdmissions, students, courses, batches)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${dueAdmissions.length} Due Accounts to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({dueAdmissions.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
          <span className="text-rose-700 font-bold block text-[11px] uppercase tracking-wider">
            Total Outstanding Due
          </span>
          <span className="text-2xl font-black text-rose-950 mt-1 block">
            ৳{stats.totalDue.toLocaleString()}
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
          <span className="text-amber-800 font-bold block text-[11px] uppercase tracking-wider">
            Critical Overdue Balance
          </span>
          <span className="text-2xl font-black text-amber-950 mt-1 block">
            ৳{stats.overdueDueAmount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
            Filtered Accounts Total
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ৳{totalOutstandingDue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, phone, ID, admission #..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterDueStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Dues
          </button>
          <button
            onClick={() => setFilterDueStatus('overdue')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'overdue' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Overdue Only
          </button>
          <button
            onClick={() => setFilterDueStatus('upcoming')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterDueStatus === 'upcoming' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Upcoming Due
          </button>
        </div>
      </div>

      {/* Due Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4">Agreed Fee</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Outstanding Due</th>
                <th className="py-3 px-4">Due Deadline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dueAdmissions.map(adm => {
                const stu = students.find(s => s.id === adm.studentId);
                const crs = courses.find(c => c.id === adm.courseId);
                const batch = batches.find(b => b.id === adm.batchId);
                const dueDate = adm.nextPaymentDate || adm.nextDueDate;
                const isOverdue = dueDate && dueDate < todayStr;

                return (
                  <tr key={adm.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(adm.studentId)}
                        className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                      >
                        {stu?.name || 'Student Record'}
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {stu?.studentCode || adm.admissionCode || adm.id} • {stu?.phone || 'No Phone'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-semibold">{crs?.name || 'Course Enrollment'}</div>
                      <div className="text-[10px] text-slate-400">Batch #{batch?.batchNumber || 'General'}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      ৳{adm.finalFee.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      ৳{adm.totalPaid.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-sm text-rose-600">
                        ৳{adm.due.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {dueDate ? (
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOverdue ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {dueDate}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] text-rose-600 font-black">OVERDUE</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() =>
                          handleCopyReminder(
                            adm.id,
                            stu?.name || 'Student',
                            crs?.name || 'Course',
                            adm.due,
                            dueDate
                          )
                        }
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all inline-flex items-center space-x-1 ${
                          copiedId === adm.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Copy payment reminder SMS"
                      >
                        {copiedId === adm.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span>SMS Reminder</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenCollectPayment(adm.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs inline-flex items-center space-x-1 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Collect Due</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeletingDue({
                            admissionId: adm.id,
                            admissionCode: adm.admissionCode || adm.admissionNumber || adm.id,
                            studentId: adm.studentId,
                            studentName: stu?.name || 'Student',
                            studentCode: stu?.studentCode || 'N/A',
                            dueAmount: adm.due,
                            courseName: crs?.name || 'Course'
                          });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Remove or Waive Due"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {dueAdmissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="text-sm font-semibold">Zero pending dues matching the filter criteria!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete / Waive Due Confirmation Modal */}
      {deletingDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage / Remove Due Entry</h3>
                <p className="text-[11px] text-slate-500">Admission #{deletingDue.admissionCode}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <strong className="text-slate-900 font-bold">{deletingDue.studentName} ({deletingDue.studentCode})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course:</span>
                <span className="text-slate-800">{deletingDue.courseName}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Outstanding Due:</span>
                <strong className="text-rose-600 font-black text-sm">৳{deletingDue.dueAmount.toLocaleString()}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Choose an action for this pending balance. You can either waive this due amount as an approved concession, or delete the admission entry to the Recycle Bin.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingDue(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors order-3 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWaiveDue}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors order-2 inline-flex items-center justify-center space-x-1"
                title="Concession / Scholarship waiver: set due to ৳0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Waive Due (৳0)</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors order-1 sm:order-3 inline-flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

