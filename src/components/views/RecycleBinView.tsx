import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { TrashItem } from '../../types';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Search,
  Filter,
  Users,
  GraduationCap,
  CalendarDays,
  FileCheck,
  Award,
  UserCheck,
  Receipt,
  CreditCard,
  Building,
  Briefcase,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export const RecycleBinView: React.FC = () => {
  const {
    trashItems,
    restoreFromTrash,
    permanentDeleteFromTrash,
    emptyTrash
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [deletingPermanentItem, setDeletingPermanentItem] = useState<TrashItem | null>(null);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);

  const getItemTypeIcon = (type: TrashItem['itemType']) => {
    switch (type) {
      case 'student':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'lead':
        return <Users className="w-4 h-4 text-sky-600" />;
      case 'schedule':
        return <CalendarDays className="w-4 h-4 text-cyan-600" />;
      case 'attendance':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'exam':
      case 'examResult':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'expense':
        return <Receipt className="w-4 h-4 text-rose-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'staff':
        return <Briefcase className="w-4 h-4 text-violet-600" />;
      case 'asset':
        return <Building className="w-4 h-4 text-teal-600" />;
      default:
        return <Trash2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getItemTypeBadge = (type: TrashItem['itemType']) => {
    switch (type) {
      case 'student':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'lead':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'schedule':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'attendance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'exam':
      case 'examResult':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'certificate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'expense':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'payment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'staff':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'asset':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredTrash = trashItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.deletedBy && item.deletedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.itemType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.itemType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRestore = (item: TrashItem) => {
    restoreFromTrash(item.id);
    setRestoreSuccessMsg(`"${item.title}" successfully restored!`);
    setTimeout(() => setRestoreSuccessMsg(null), 3000);
  };

  const handlePermanentDelete = (item: TrashItem) => {
    setDeletingPermanentItem(item);
  };

  const handleEmptyAll = () => {
    emptyTrash();
    setShowEmptyConfirm(false);
  };

  // Type counts
  const typeCounts = trashItems.reduce((acc, item) => {
    acc[item.itemType] = (acc[item.itemType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Trash2 className="w-6 h-6 text-rose-600" />
              <span>Recycle Bin & Trash Manager</span>
            </h2>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              {trashItems.length} Deleted Items
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Recover deleted students, class schedules, attendance logs, exams, certificates, expenses, and records with 1 click
          </p>
        </div>

        {trashItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmptyConfirm(true)}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Recycle Bin</span>
            </button>
          </div>
        )}
      </div>

      {/* Restore Success Toast */}
      {restoreSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{restoreSuccessMsg}</span>
        </div>
      )}

      {/* Empty Trash Confirmation Modal */}
      {showEmptyConfirm && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-950">Empty Entire Recycle Bin?</h4>
              <p className="text-xs text-rose-800 mt-1">
                Are you sure you want to permanently delete all {trashItems.length} items from the Recycle Bin? This action is irreversible and permanently removes all stored history.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 justify-end pt-1">
            <button
              onClick={() => setShowEmptyConfirm(false)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleEmptyAll}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Yes, Empty Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search deleted items, student names, modules..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none"
        >
          <option value="all">All Modules ({trashItems.length})</option>
          <option value="student">Students ({typeCounts['student'] || 0})</option>
          <option value="lead">Leads ({typeCounts['lead'] || 0})</option>
          <option value="schedule">Class Schedules ({typeCounts['schedule'] || 0})</option>
          <option value="attendance">Attendance Records ({typeCounts['attendance'] || 0})</option>
          <option value="exam">Exams ({typeCounts['exam'] || 0})</option>
          <option value="certificate">Certificates ({typeCounts['certificate'] || 0})</option>
          <option value="expense">Expenses ({typeCounts['expense'] || 0})</option>
          <option value="payment">Payments ({typeCounts['payment'] || 0})</option>
          <option value="staff">Staff ({typeCounts['staff'] || 0})</option>
          <option value="asset">Assets ({typeCounts['asset'] || 0})</option>
        </select>
      </div>

      {/* Deleted Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item Type</th>
                <th className="py-3 px-4">Title / Description</th>
                <th className="py-3 px-4">Deleted Date & Time</th>
                <th className="py-3 px-4">Deleted By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrash.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        {getItemTypeIcon(item.itemType)}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border capitalize ${getItemTypeBadge(item.itemType)}`}>
                        {item.itemType}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {item.originalId}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {new Date(item.deletedAt).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {item.deletedBy || 'System Administrator'}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleRestore(item)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs inline-flex items-center space-x-1 border border-emerald-200 transition-colors shadow-2xs"
                      title="Restore back to active records"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTrash.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 space-y-2">
                    <PackageCheck className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                    <p className="text-sm font-bold text-slate-600">Recycle Bin is Empty</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Any deleted student, class schedule, attendance record, exam, or certificate will safely appear here for instant recovery.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permanent Delete Confirmation Modal */}
      {deletingPermanentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Permanently Delete?</h3>
                <p className="text-[11px] text-rose-600 font-semibold">Cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently purge <strong className="text-slate-900">{deletingPermanentItem.title}</strong>? This item will be permanently erased and cannot be restored.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPermanentItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  permanentDeleteFromTrash(deletingPermanentItem.id);
                  setDeletingPermanentItem(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
