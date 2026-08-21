import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  exportLeadsSpreadsheet,
  exportBatchStudentsSpreadsheet,
  exportAllStudentsSpreadsheet,
  exportDuesSpreadsheet,
  exportPaymentsSpreadsheet,
  exportExpensesSpreadsheet,
  exportSeminarsSpreadsheet,
  exportCompleteAcademySpreadsheets
} from '../../utils/spreadsheetExport';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
  Table,
  Layers,
  Users,
  CreditCard,
  Receipt,
  Presentation,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Database,
  Archive
} from 'lucide-react';

export const ReportsCenterView: React.FC = () => {
  const {
    students,
    admissions,
    courses,
    batches,
    payments,
    expenses,
    leads,
    attendance,
    certificates,
    staffList,
    seminars,
    cloudSyncStatus,
    lastCloudSyncTime,
    syncToCloudNow
  } = useAcademy();

  const [reportType, setReportType] = useState<
    'leads' | 'batch_students' | 'all_students' | 'admissions' | 'dues' | 'payments' | 'expenses' | 'seminars' | 'certificates'
  >('leads');

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [backupToast, setBackupToast] = useState(false);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const selectedBatchCourse = courses.find(c => c.id === selectedBatch?.courseId);
  const selectedBatchTrainer = {
    name: selectedBatch?.trainerName || staffList.find(s => s.id === selectedBatch?.trainerId)?.name || 'Unassigned'
  };
  const selectedBatchAdmissions = admissions.filter(a => a.batchId === selectedBatch?.id);

  const handleExportCurrent = () => {
    switch (reportType) {
      case 'leads':
        exportLeadsSpreadsheet(leads, courses, staffList);
        break;
      case 'batch_students':
        if (selectedBatch) {
          exportBatchStudentsSpreadsheet(selectedBatch, admissions, students, selectedBatchCourse, selectedBatchTrainer);
        }
        break;
      case 'all_students':
        exportAllStudentsSpreadsheet(students, admissions, courses, batches);
        break;
      case 'admissions':
        exportAllStudentsSpreadsheet(students, admissions, courses, batches);
        break;
      case 'dues':
        exportDuesSpreadsheet(admissions, students, courses, batches);
        break;
      case 'payments':
        exportPaymentsSpreadsheet(payments, students, admissions, courses, batches);
        break;
      case 'expenses':
        exportExpensesSpreadsheet(expenses);
        break;
      case 'seminars':
        exportSeminarsSpreadsheet(seminars);
        break;
      case 'certificates':
        exportAllStudentsSpreadsheet(students, admissions, courses, batches);
        break;
      default:
        exportLeadsSpreadsheet(leads, courses, staffList);
    }
  };

  const handleMasterBackup = () => {
    exportCompleteAcademySpreadsheets({
      leads,
      students,
      admissions,
      batches,
      courses,
      payments,
      expenses,
      staffList,
      seminars
    });
    setBackupToast(true);
    setTimeout(() => setBackupToast(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* Toast */}
      {backupToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-500/50 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-xs">Spreadsheet Backup Downloaded!</div>
            <div className="text-[11px] text-slate-300">
              Customer Leads, Batch Students, Dues, Payments, and Expenses files generated.
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Master Backup Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-950/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Universal Excel & Spreadsheets Engine</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
            Spreadsheet Data & Backup Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Export customer leads, individual batch students, payment receipts, overdue balances, and expense ledgers directly into Microsoft Excel, Google Sheets, or CSV for offline record-keeping.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => syncToCloudNow()}
            className="inline-flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all shrink-0 active:scale-98"
            title="Force immediate synchronization with Google Cloud Firestore"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Cloud Database: {cloudSyncStatus === 'synced' ? 'Synced (Safe)' : cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleMasterBackup}
            className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-extrabold shadow-lg hover:shadow-emerald-900/40 transition-all shrink-0 active:scale-98"
            title="Download all important datasets into Excel-compatible spreadsheets in 1 click"
          >
            <Archive className="w-4 h-4" />
            <span>Download All Data Backup (Excel)</span>
          </button>
        </div>
      </div>

      {/* Dataset Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {[
          { key: 'leads', label: '1. Customer Leads & Visitors', count: leads.length, desc: 'All inquiries, calls & remarks' },
          { key: 'batch_students', label: '2. Batch-wise Students', count: `${batches.length} Batches`, desc: 'Filter & export per batch' },
          { key: 'all_students', label: '3. Full Student Directory', count: students.length, desc: 'Complete student records' },
          { key: 'dues', label: '4. Outstanding Dues & Balances', count: admissions.filter(a => a.due > 0).length, desc: 'Phone, course & due amounts' },
          { key: 'payments', label: '5. Payments & Money Receipts', count: payments.length, desc: 'Daily/monthly collections' },
          { key: 'expenses', label: '6. Office Expenses Ledger', count: expenses.length, desc: 'Overhead, salary & bills' },
          { key: 'seminars', label: '7. Seminars & Workshop Leads', count: seminars.length, desc: 'Registrations & attendees' },
          { key: 'certificates', label: '8. Issued Certificates', count: certificates.length, desc: 'Grades & serial codes' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setReportType(item.key as any)}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              reportType === item.key
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/50 scale-[1.01]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="block font-black text-xs">{item.label}</span>
            </div>
            <p className={`text-[10px] mt-0.5 ${reportType === item.key ? 'text-indigo-200' : 'text-slate-400'}`}>
              {item.desc}
            </p>
            <span className={`text-[11px] mt-2 inline-block font-bold px-2 py-0.5 rounded-md ${
              reportType === item.key ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-700'
            }`}>
              {item.count} records
            </span>
          </button>
        ))}
      </div>

      {/* Batch Selector Bar (Only shown when 'batch_students' is active) */}
      {reportType === 'batch_students' && (
        <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 text-white rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Select Specific Batch to Export:</div>
              <p className="text-[11px] text-purple-900">
                প্রতিটি ব্যাচের স্টুডেন্টদের আলাদা আলাদা স্প্রেডশীটে নেওয়ার জন্য ব্যাচ নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="bg-white border border-purple-300 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none shadow-2xs text-xs"
            >
              {batches.map(b => {
                const crs = courses.find(c => c.id === b.courseId);
                const count = admissions.filter(a => a.batchId === b.id).length;
                return (
                  <option key={b.id} value={b.id}>
                    Batch #{b.batchNumber} - {crs?.name} ({count} Students)
                  </option>
                );
              })}
            </select>

            <button
              onClick={() => {
                if (selectedBatch) {
                  exportBatchStudentsSpreadsheet(selectedBatch, admissions, students, selectedBatchCourse, selectedBatchTrainer);
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Batch #{selectedBatch?.batchNumber} (Excel)</span>
            </button>
          </div>
        </div>
      )}

      {/* Dataset Preview Header & Action */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Live Spreadsheet Preview: <strong className="text-indigo-700">{reportType.replace('_', ' ').toUpperCase()}</strong>
          </span>
        </div>

        <button
          onClick={handleExportCurrent}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download This Dataset (Excel / CSV)</span>
        </button>
      </div>

      {/* Live Preview Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left text-xs">
            {/* 1. LEADS */}
            {reportType === 'leads' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Lead Code</th>
                    <th className="py-3 px-4">Name & Occupation</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Interested Course</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Stage / Status</th>
                    <th className="py-3 px-4">Visitor Remarks / মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{l.leadCode}</td>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{l.name}</div>
                        <div className="text-[10px] text-slate-400">{l.occupation || 'Student'}</div>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-700">{l.phone}</td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">
                        {courses.find(c => c.id === l.interestedCourseId)?.name || 'General Inquiry'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{l.leadSource}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                          {l.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate italic">
                        {l.comments ? `"${l.comments}"` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* 2. BATCH STUDENTS */}
            {reportType === 'batch_students' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Student Code</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Agreed Fee</th>
                    <th className="py-3 px-4">Total Paid</th>
                    <th className="py-3 px-4">Due Balance</th>
                    <th className="py-3 px-4">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBatchAdmissions.map(adm => {
                    const stu = students.find(s => s.id === adm.studentId);
                    return (
                      <tr key={adm.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{stu?.studentCode}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{stu?.name}</td>
                        <td className="py-2.5 px-4 text-slate-700">{stu?.phone}</td>
                        <td className="py-2.5 px-4 font-bold">৳{adm.finalFee.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-emerald-700 font-bold">৳{adm.totalPaid.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-rose-600 font-black">৳{adm.due.toLocaleString()}</td>
                        <td className="py-2.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            adm.due === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {adm.due === 0 ? 'Fully Paid' : 'Due'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {selectedBatchAdmissions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                        No students enrolled in Batch #{selectedBatch?.batchNumber} yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}

            {/* 3. ALL STUDENTS */}
            {reportType === 'all_students' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Course & Batch</th>
                    <th className="py-3 px-4">Agreed Fee</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(stu => {
                    const adm = admissions.find(a => a.studentId === stu.id);
                    const crs = courses.find(c => c.id === adm?.courseId);
                    const b = batches.find(bt => bt.id === adm?.batchId);
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{stu.studentCode}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{stu.name}</td>
                        <td className="py-2.5 px-4 text-slate-700">{stu.phone}</td>
                        <td className="py-2.5 px-4 text-slate-800">
                          {crs?.name || 'General'} {b ? `(B#${b.batchNumber})` : ''}
                        </td>
                        <td className="py-2.5 px-4 font-bold">৳{(adm?.finalFee || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-emerald-700 font-bold">৳{(adm?.totalPaid || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-rose-600 font-black">৳{(adm?.due || 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {/* 4. DUES */}
            {reportType === 'dues' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Student Code</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Total Fee</th>
                    <th className="py-3 px-4">Due Balance</th>
                    <th className="py-3 px-4">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissions.filter(a => a.due > 0).map(a => {
                    const stu = students.find(s => s.id === a.studentId);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{stu?.studentCode}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{stu?.name}</td>
                        <td className="py-2.5 px-4 text-slate-600">{stu?.phone}</td>
                        <td className="py-2.5 px-4 text-slate-700">{courses.find(c => c.id === a.courseId)?.name}</td>
                        <td className="py-2.5 px-4 font-bold">৳{a.finalFee.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-rose-600 font-black">৳{a.due.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-slate-500">{a.nextPaymentDate || a.nextDueDate || 'Immediate'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {/* 5. PAYMENTS */}
            {reportType === 'payments' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{p.receiptNumber}</td>
                      <td className="py-2.5 px-4 text-slate-500">{p.date}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{students.find(s => s.id === p.studentId)?.name}</td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">{p.paymentMethod}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-black">৳{p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* 6. EXPENSES */}
            {reportType === 'expenses' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Paid To</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-500">{e.date}</td>
                      <td className="py-2.5 px-4 font-bold text-rose-800">{e.category}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{e.paidTo || e.paidBy || 'Office'}</td>
                      <td className="py-2.5 px-4 text-slate-600 truncate max-w-xs">{e.description}</td>
                      <td className="py-2.5 px-4 text-rose-700 font-black">৳{e.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* 7. SEMINARS */}
            {reportType === 'seminars' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Seminar Title</th>
                    <th className="py-3 px-4">Speaker</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Registered Leads</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seminars.map(sem => (
                    <tr key={sem.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{sem.title}</td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">{sem.speakerName || 'Senior Trainer'}</td>
                      <td className="py-2.5 px-4 text-slate-600">{sem.date} ({sem.time})</td>
                      <td className="py-2.5 px-4 text-slate-600">{sem.venueType || sem.room || 'On-Campus'}</td>
                      <td className="py-2.5 px-4 font-bold text-indigo-700">
                        {sem.registeredCount || sem.registeredLeads?.length || 0} Registered
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          {sem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* 8. CERTIFICATES */}
            {reportType === 'certificates' && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Certificate #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Issue Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-800">{c.certificateCode || c.certificateNumber}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{students.find(s => s.id === c.studentId)?.name}</td>
                      <td className="py-2.5 px-4 text-slate-700">{courses.find(cr => cr.id === c.courseId)?.name}</td>
                      <td className="py-2.5 px-4 font-black text-amber-900">{c.grade}</td>
                      <td className="py-2.5 px-4 text-slate-500">{c.issueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

