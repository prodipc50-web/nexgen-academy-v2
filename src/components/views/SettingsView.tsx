import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  Settings,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Database,
  History,
  Building,
  CheckCircle2,
  Lock,
  Eye,
  Edit3,
  Trash2,
  ListFilter,
  PlusCircle,
  Edit2,
  X,
  Check
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    auditLogs,
    resetToSeedData,
    leadSourcesList,
    addLeadSource,
    updateLeadSource,
    deleteLeadSource,
    expenseCategoriesList,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    paymentMethodsList,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    occupationsList,
    addOccupation,
    updateOccupation,
    deleteOccupation,
    educationLevelsList,
    addEducationLevel,
    updateEducationLevel,
    deleteEducationLevel,
    studentGoalsList,
    addStudentGoal,
    updateStudentGoal,
    deleteStudentGoal,
    studentStatusesList,
    addStudentStatus,
    updateStudentStatus,
    deleteStudentStatus,
    bloodGroupsList,
    addBloodGroup,
    updateBloodGroup,
    deleteBloodGroup,
    discountTypesList,
    addDiscountType,
    updateDiscountType,
    deleteDiscountType
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'rbac' | 'audit' | 'backup' | 'profile' | 'dropdowns'>('dropdowns');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Master Dropdown active category & states
  const [dropdownSection, setDropdownSection] = useState<
    'leads' | 'expenses' | 'payments' | 'occupations' | 'education' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discounts'
  >('occupations');
  const [newOptionInput, setNewOptionInput] = useState('');
  const [editingItem, setEditingItem] = useState<{ original: string; current: string } | null>(null);

  // Backup JSON download
  const handleBackupDownload = () => {
    const rawData = localStorage.getItem('NEXGEN_OFFICE_ACADEMY_DB_V1');
    if (!rawData) {
      alert('No database data found to export.');
      return;
    }
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexgen_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Restore JSON upload
  const handleRestoreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = event.target?.result as string;
        JSON.parse(json); // Validate JSON
        localStorage.setItem('NEXGEN_OFFICE_ACADEMY_DB_V1', json);
        alert('Database restored successfully! Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset all records to the original seed state? This will overwrite custom edits.')) {
      resetToSeedData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  // Dropdown Manager Handlers
  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newOptionInput.trim();
    if (!val) return;

    if (dropdownSection === 'leads') addLeadSource(val);
    else if (dropdownSection === 'expenses') addExpenseCategory(val);
    else if (dropdownSection === 'payments') addPaymentMethod(val);
    else if (dropdownSection === 'occupations') addOccupation(val);
    else if (dropdownSection === 'education') addEducationLevel(val);
    else if (dropdownSection === 'studentGoals') addStudentGoal(val);
    else if (dropdownSection === 'studentStatuses') addStudentStatus(val);
    else if (dropdownSection === 'bloodGroups') addBloodGroup(val);
    else if (dropdownSection === 'discounts') addDiscountType(val);

    setNewOptionInput('');
  };

  const handleSaveEdit = (original: string, updated: string) => {
    const trimmed = updated.trim();
    if (!trimmed || trimmed === original) {
      setEditingItem(null);
      return;
    }

    if (dropdownSection === 'leads') updateLeadSource(original, trimmed);
    else if (dropdownSection === 'expenses') updateExpenseCategory(original, trimmed);
    else if (dropdownSection === 'payments') updatePaymentMethod(original, trimmed);
    else if (dropdownSection === 'occupations') updateOccupation(original, trimmed);
    else if (dropdownSection === 'education') updateEducationLevel(original, trimmed);
    else if (dropdownSection === 'studentGoals') updateStudentGoal(original, trimmed);
    else if (dropdownSection === 'studentStatuses') updateStudentStatus(original, trimmed);
    else if (dropdownSection === 'bloodGroups') updateBloodGroup(original, trimmed);
    else if (dropdownSection === 'discounts') updateDiscountType(original, trimmed);

    setEditingItem(null);
  };

  const handleDeleteOption = (item: string) => {
    if (dropdownSection === 'leads') deleteLeadSource(item);
    else if (dropdownSection === 'expenses') deleteExpenseCategory(item);
    else if (dropdownSection === 'payments') deletePaymentMethod(item);
    else if (dropdownSection === 'occupations') deleteOccupation(item);
    else if (dropdownSection === 'education') deleteEducationLevel(item);
    else if (dropdownSection === 'studentGoals') deleteStudentGoal(item);
    else if (dropdownSection === 'studentStatuses') deleteStudentStatus(item);
    else if (dropdownSection === 'bloodGroups') deleteBloodGroup(item);
    else if (dropdownSection === 'discounts') deleteDiscountType(item);
  };

  const getActiveList = () => {
    if (dropdownSection === 'leads') return leadSourcesList;
    if (dropdownSection === 'expenses') return expenseCategoriesList;
    if (dropdownSection === 'payments') return paymentMethodsList;
    if (dropdownSection === 'occupations') return occupationsList;
    if (dropdownSection === 'education') return educationLevelsList;
    if (dropdownSection === 'studentGoals') return studentGoalsList;
    if (dropdownSection === 'studentStatuses') return studentStatusesList;
    if (dropdownSection === 'bloodGroups') return bloodGroupsList;
    if (dropdownSection === 'discounts') return discountTypesList;
    return [];
  };

  const getSectionPlaceholder = () => {
    switch (dropdownSection) {
      case 'occupations': return 'Occupation (e.g. Graphic Designer, Freelancer)';
      case 'education': return 'Education Level (e.g. Diploma, BBA)';
      case 'studentGoals': return 'Student Career Goal (e.g. Remote Job, Agency)';
      case 'studentStatuses': return 'Student Status (e.g. Active, Completed)';
      case 'bloodGroups': return 'Blood Group (e.g. O+)';
      case 'leads': return 'Lead Source (e.g. LinkedIn Ads, WhatsApp)';
      case 'expenses': return 'Expense Category (e.g. Server Hosting)';
      case 'payments': return 'Payment Method (e.g. Rocket, Upay)';
      case 'discounts': return 'Discount Type (e.g. Early Bird)';
      default: return 'Option name';
    }
  };

  const rbacMatrix = [
    { module: 'Dashboard & Core Analytics', admin: 'Full', manager: 'Full', counselor: 'View (Limited)', accounts: 'Financial Only', trainer: 'Classes Only' },
    { module: 'Admission CRM & Leads', admin: 'Full', manager: 'Full', counselor: 'Create, Edit, Follow-up', accounts: 'View Only', trainer: 'No Access' },
    { module: 'Student Directory & Profiles', admin: 'Full', manager: 'Full', counselor: 'View & Admit', accounts: 'View & Collect', trainer: 'View Assigned Batch' },
    { module: 'Fee Collections & Receipts', admin: 'Full', manager: 'Full', counselor: 'No Access', accounts: 'Create, Collect, Print', trainer: 'No Access' },
    { module: 'Office Expense Vouchers', admin: 'Full', manager: 'Full', counselor: 'No Access', accounts: 'Create & View', trainer: 'No Access' },
    { module: 'Daily Attendance Register', admin: 'Full', manager: 'Full', counselor: 'View Only', accounts: 'No Access', trainer: 'Mark & Save' },
    { module: 'Course Catalog & Batches', admin: 'Full', manager: 'Full', counselor: 'View Catalog', accounts: 'View Fees', trainer: 'View Schedule' },
    { module: 'Exams & Certificates', admin: 'Full', manager: 'Full', counselor: 'Verify Only', accounts: 'No Access', trainer: 'Record Marks' },
    { module: 'Marketing ROI & Campaigns', admin: 'Full', manager: 'Full', counselor: 'View Leaderboard', accounts: 'View Spend', trainer: 'No Access' },
    { module: 'Settings & Security Audit', admin: 'Full', manager: 'Audit View', counselor: 'No Access', accounts: 'No Access', trainer: 'No Access' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Academy Settings & Master Configurations
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
              Configuration Center
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Edit dropdown options, Role Permissions (RBAC), audit logs, database snapshots, and institution profile
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dropdowns')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'dropdowns'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Master Dropdowns & Form Options</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'rbac'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Role Permissions Matrix (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'backup'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup, Restore & Reset</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Academy Profile & Receipts</span>
        </button>
      </div>

      {/* TAB 0: MASTER DROPDOWNS MANAGEMENT */}
      {activeTab === 'dropdowns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Manage System Select Options</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add new values, rename/edit existing items, or delete options from dropdown menus across the entire application.
            </p>

            {/* Sub-Tabs for Dropdown Type */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'occupations', label: `Occupations (${occupationsList.length})` },
                { key: 'education', label: `Education Levels (${educationLevelsList.length})` },
                { key: 'studentGoals', label: `Student Goals (${studentGoalsList.length})` },
                { key: 'studentStatuses', label: `Student Statuses (${studentStatusesList.length})` },
                { key: 'bloodGroups', label: `Blood Groups (${bloodGroupsList.length})` },
                { key: 'leads', label: `Lead Sources (${leadSourcesList.length})` },
                { key: 'expenses', label: `Expense Categories (${expenseCategoriesList.length})` },
                { key: 'payments', label: `Payment Methods (${paymentMethodsList.length})` },
                { key: 'discounts', label: `Discount Types (${discountTypesList.length})` }
              ].map(sec => (
                <button
                  key={sec.key}
                  onClick={() => {
                    setDropdownSection(sec.key as any);
                    setEditingItem(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    dropdownSection === sec.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Add New Option Form */}
            <form onSubmit={handleAddOption} className="flex gap-2 max-w-lg mb-6">
              <input
                type="text"
                placeholder={`Add new ${getSectionPlaceholder()}...`}
                value={newOptionInput}
                onChange={e => setNewOptionInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </form>

            {/* List of Current Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {getActiveList().map((item, idx) => {
                const isEditing = editingItem?.original === item;

                return (
                  <div
                    key={`${item}-${idx}`}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:border-slate-300 transition-all"
                  >
                    {isEditing ? (
                      <div className="flex items-center space-x-1.5 w-full">
                        <input
                          type="text"
                          autoFocus
                          value={editingItem.current}
                          onChange={e => setEditingItem({ ...editingItem, current: e.target.value })}
                          className="flex-1 bg-white border border-indigo-400 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 outline-none"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(editingItem.original, editingItem.current);
                            if (e.key === 'Escape') setEditingItem(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(editingItem.original, editingItem.current)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-1 text-slate-400 hover:bg-slate-200 rounded-md"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-800 truncate pr-2">{item}</span>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => setEditingItem({ original: item, current: item })}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-colors"
                            title="Rename Option"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete option "${item}"?`)) {
                                handleDeleteOption(item);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Enforced Role Permissions Matrix</h3>
            <p className="text-xs text-slate-500">
              System access is strictly enforced based on active user role ({currentUser.role}).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">System Module</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">Counselor</th>
                  <th className="py-3 px-4">Accounts</th>
                  <th className="py-3 px-4">Trainer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rbacMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.module}</td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {row.admin}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {row.manager}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.counselor.includes('No Access') ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-900'}`}>
                        {row.counselor}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.accounts.includes('No Access') ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-900'}`}>
                        {row.accounts}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.trainer.includes('No Access') ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-900'}`}>
                        {row.trainer}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">System Activity & Audit Log Stream</h3>
            <span className="text-xs text-slate-500 font-mono">Live tracking enabled</span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Activity Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{log.userName || log.userEmail || 'System'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                        log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">{log.entity}</td>
                    <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px] max-w-md truncate">{log.details || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export JSON */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Export Complete Database JSON</h3>
            </div>
            <p className="text-xs text-slate-500">
              Download a complete offline JSON snapshot of all students, admissions, leads, payments, attendance records, and expenses.
            </p>
            <button
              onClick={handleBackupDownload}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Restore Database from JSON</h3>
            </div>
            <p className="text-xs text-slate-500">
              Upload a previously exported JSON backup file to overwrite and restore your database state.
            </p>
            <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Choose Backup File (.json)</span>
              <input type="file" accept=".json" onChange={handleRestoreUpload} className="hidden" />
            </label>
          </div>

          {/* Factory Reset */}
          <div className="md:col-span-2 bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-950">Factory Reset Database</h3>
            </div>
            <p className="text-xs text-rose-800">
              Revert the database to the rich initial seed state with verified students, courses, batches, and transactions.
            </p>
            <button
              onClick={handleFactoryReset}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Seed Data</span>
            </button>

            {resetSuccess && (
              <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Database successfully reset to seed records!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institution Profile & Custom Logo Configuration</h3>
            <p className="text-xs text-slate-500">Manage institute branding, custom logo upload, contact details, and receipt addresses.</p>
          </div>

          {/* Logo Uploader */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="font-bold text-slate-800 block">
              Official Institute Logo (লোগো পরিবর্তন / আপলোড)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <NexgenLogo variant="crest" size={48} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Active Academy Logo</p>
                  <p className="text-[11px] text-slate-500">Appears on ID cards, receipts, certificates & dashboard</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="cursor-pointer px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo from PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (reader.result) {
                            localStorage.setItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO', reader.result as string);
                            window.location.reload();
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {localStorage.getItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO') && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('NEXGEN_OFFICE_ACADEMY_CUSTOM_LOGO');
                      window.location.reload();
                    }}
                    className="px-3 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-colors"
                  >
                    Reset Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Academy Name</label>
              <input
                type="text"
                defaultValue="Nexgen Computer Academy"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Address</label>
              <input
                type="text"
                defaultValue="14/B Garden Road, Farmgate, Dhaka-1215"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Helpline Phone</label>
                <input
                  type="text"
                  defaultValue="+880 1711-223344"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
                <input
                  type="text"
                  defaultValue="admissions@nexgenacademy.edu.bd"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Currency Code</label>
                <input
                  type="text"
                  defaultValue="BDT (৳)"
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Govt. Reg / Trade License</label>
                <input
                  type="text"
                  defaultValue="TRAD/DNCC/019284/2024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

