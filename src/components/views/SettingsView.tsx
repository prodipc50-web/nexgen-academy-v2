import React, { useState, useEffect } from 'react';
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
  Check,
  Phone,
  Mail,
  MapPin,
  Type,
  Maximize2,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    auditLogs,
    resetToSeedData,
    academySettings,
    updateAcademySettings,
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

  const [activeTab, setActiveTab] = useState<'profile' | 'dropdowns' | 'rbac' | 'audit' | 'backup'>('profile');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for Academy Profile & Logo editing
  const [profileForm, setProfileForm] = useState({
    instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
    tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
    campusName: academySettings.campusName || 'Farmgate Campus',
    primarySupportPhone: academySettings.primarySupportPhone || '01798444444',
    officialAddress: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
    officialEmail: academySettings.officialEmail || 'info@nexgenacademy.edu.bd',
    helplines: academySettings.helplines || ['01798444444', '+880 1711-223344', '+880 1811-556677'],
    websiteUrl: academySettings.websiteUrl || 'https://nexgenacademy.edu.bd',
    certificateVerificationBaseUrl: academySettings.certificateVerificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/',
    idCardSignatoryName: academySettings.idCardSignatoryName || 'Prodip Chowdhury',
    idCardSignatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signatory',
    admitCardControllerName: academySettings.admitCardControllerName || 'Controller of Examinations',
    idCardTerms: academySettings.idCardTerms || '• This card is non-transferable and official property of Nexgen Computer Academy.\n• If found, please return to Farmgate Campus, 14/B Garden Road, Dhaka-1215 or call helpline.',
    admitCardInstructions: academySettings.admitCardInstructions || '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
    logoIconSize: academySettings.logoIconSize || 48,
    logoFontSize: academySettings.logoFontSize || 16,
    taglineFontSize: academySettings.taglineFontSize || 11
  });

  const [newHelplineInput, setNewHelplineInput] = useState('');

  useEffect(() => {
    setProfileForm({
      instituteName: academySettings.instituteName || 'Nexgen Computer Academy',
      tagline: academySettings.tagline || 'Institute of Information Technology & Professional Skills',
      campusName: academySettings.campusName || 'Farmgate Campus',
      primarySupportPhone: academySettings.primarySupportPhone || '01798444444',
      officialAddress: academySettings.officialAddress || '14/B Garden Road, Farmgate, Dhaka-1215',
      officialEmail: academySettings.officialEmail || 'info@nexgenacademy.edu.bd',
      helplines: academySettings.helplines || ['01798444444', '+880 1711-223344', '+880 1811-556677'],
      websiteUrl: academySettings.websiteUrl || 'https://nexgenacademy.edu.bd',
      certificateVerificationBaseUrl: academySettings.certificateVerificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/',
      idCardSignatoryName: academySettings.idCardSignatoryName || 'Prodip Chowdhury',
      idCardSignatoryTitle: academySettings.idCardSignatoryTitle || 'Authorized Signatory',
      admitCardControllerName: academySettings.admitCardControllerName || 'Controller of Examinations',
      idCardTerms: academySettings.idCardTerms || '• This card is non-transferable and official property of Nexgen Computer Academy.\n• If found, please return to Farmgate Campus, 14/B Garden Road, Dhaka-1215 or call helpline.',
      admitCardInstructions: academySettings.admitCardInstructions || '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
      logoIconSize: academySettings.logoIconSize || 48,
      logoFontSize: academySettings.logoFontSize || 16,
      taglineFontSize: academySettings.taglineFontSize || 11
    });
  }, [academySettings]);

  const handleAddHelpline = () => {
    const trimmed = newHelplineInput.trim();
    if (!trimmed) return;
    if (profileForm.helplines.includes(trimmed)) {
      alert('This helpline number is already in the list.');
      return;
    }
    setProfileForm(prev => ({
      ...prev,
      helplines: [...prev.helplines, trimmed]
    }));
    setNewHelplineInput('');
  };

  const handleRemoveHelpline = (index: number) => {
    setProfileForm(prev => ({
      ...prev,
      helplines: prev.helplines.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateHelpline = (index: number, val: string) => {
    setProfileForm(prev => {
      const updated = [...prev.helplines];
      updated[index] = val;
      return { ...prev, helplines: updated };
    });
  };

  const handleSaveProfile = () => {
    updateAcademySettings(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs max-w-3xl space-y-6 text-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>Academy Profile & Branding Settings</span>
              </h3>
              <p className="text-xs text-slate-500">
                Configure multiple helpline numbers, official email, logo font sizes, and institute profile.
              </p>
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-2 transition-colors self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings (সেটিংস সংরক্ষণ করুন)</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center space-x-2 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Academy profile, helpline numbers, and logo font settings saved successfully!</span>
            </div>
          )}

          {/* Live Preview Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Live Header Logo Preview (লাইভ লোগো প্রিভিউ)</span>
              <span className="text-indigo-400 font-mono">Font Size: {profileForm.logoFontSize}px</span>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <NexgenLogo
                variant="horizontal"
                size={profileForm.logoIconSize}
                titleFontSize={profileForm.logoFontSize}
                taglineFontSize={profileForm.taglineFontSize}
                instituteName={profileForm.instituteName}
                tagline={profileForm.tagline}
              />
            </div>
          </div>

          {/* Logo Font Size & Icon Size Customization */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>Logo & Typography Size Adjustment (লোগোর ফন্ট সাইজ নিয়ন্ত্রণ)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Logo Title Font Size */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Title Font Size:</span>
                  <span className="font-mono font-bold text-indigo-600 text-xs">{profileForm.logoFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  step="1"
                  value={profileForm.logoFontSize}
                  onChange={e => setProfileForm({ ...profileForm, logoFontSize: parseInt(e.target.value) || 16 })}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Tagline Font Size */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Tagline Font Size:</span>
                  <span className="font-mono font-bold text-indigo-600 text-xs">{profileForm.taglineFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="16"
                  step="1"
                  value={profileForm.taglineFontSize}
                  onChange={e => setProfileForm({ ...profileForm, taglineFontSize: parseInt(e.target.value) || 11 })}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Logo Icon Dimension */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Logo Icon Size:</span>
                  <span className="font-mono font-bold text-indigo-600 text-xs">{profileForm.logoIconSize}px</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="80"
                  step="2"
                  value={profileForm.logoIconSize}
                  onChange={e => setProfileForm({ ...profileForm, logoIconSize: parseInt(e.target.value) || 48 })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Logo Uploader */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="font-bold text-slate-800 block text-sm">
              Official Institute Logo (লোগো পরিবর্তন / পিসি থেকে আপলোড)
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

          {/* Institute Basic Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Academy Name (প্রতিষ্ঠানের নাম)</label>
                <input
                  type="text"
                  value={profileForm.instituteName}
                  onChange={e => setProfileForm({ ...profileForm, instituteName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Tagline / Subtitle</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Campus & Primary Helpline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <div>
                <label className="block text-indigo-950 font-bold mb-1 flex items-center space-x-1.5">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Main Campus / Branch Name (মূল ক্যাম্পাস)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Farmgate Campus"
                  value={profileForm.campusName}
                  onChange={e => setProfileForm({ ...profileForm, campusName: e.target.value })}
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-indigo-700 mt-1">Shown on ID Cards, Admit Cards and Official Receipts</p>
              </div>

              <div>
                <label className="block text-indigo-950 font-bold mb-1 flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>Primary Support Phone / Print Phone (প্রিন্ট সাপোর্ট নম্বর)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01798444444"
                  value={profileForm.primarySupportPhone}
                  onChange={e => setProfileForm({ ...profileForm, primarySupportPhone: e.target.value })}
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold font-mono outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-indigo-700 mt-1">Default number printed on ID card back & admit card header</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Official Address (অফিসের ঠিকানা)</span>
              </label>
              <input
                type="text"
                value={profileForm.officialAddress}
                onChange={e => setProfileForm({ ...profileForm, officialAddress: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Official Email (অফিসিয়াল ইমেইল)</span>
                </label>
                <input
                  type="email"
                  value={profileForm.officialEmail}
                  onChange={e => setProfileForm({ ...profileForm, officialEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Website URL</label>
                <input
                  type="text"
                  value={profileForm.websiteUrl}
                  onChange={e => setProfileForm({ ...profileForm, websiteUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Certificate Verification URL Base Configuration */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <label className="block text-emerald-950 font-bold mb-1 flex items-center space-x-1.5 text-sm">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Certificate Online Verification Base URL (অনলাইন ভেরিফিকেশন লিংক)</span>
              </label>
              <input
                type="text"
                placeholder="https://nexgenacademy.edu.bd/verify/"
                value={profileForm.certificateVerificationBaseUrl}
                onChange={e => setProfileForm({ ...profileForm, certificateVerificationBaseUrl: e.target.value })}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono text-xs outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-emerald-800 mt-1.5">
                Certificates will display: <span className="font-mono font-bold">{profileForm.certificateVerificationBaseUrl || 'https://nexgenacademy.edu.bd/verify/'}NCA-CERT-2026-5172</span> (Can also be manually edited in Certificate modal anytime)
              </p>
            </div>

            {/* Multiple Helpline Numbers Management */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center space-x-1.5 text-sm">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Helpline Numbers (একাধিক হেল্পলাইন নম্বর যোগ ও এডিট করুন)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-bold">
                  {profileForm.helplines.length} Numbers Active
                </span>
              </div>

              {/* List of current helplines */}
              <div className="space-y-2">
                {profileForm.helplines.map((helpline, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 w-6 text-center">#{idx + 1}</span>
                    <input
                      type="text"
                      value={helpline}
                      onChange={e => handleUpdateHelpline(idx, e.target.value)}
                      placeholder="e.g. 01798444444"
                      className="flex-1 bg-transparent text-slate-900 font-semibold text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHelpline(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove this helpline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Helpline Row */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter new helpline number (e.g. 01798444444)..."
                  value={newHelplineInput}
                  onChange={e => setNewHelplineInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHelpline();
                    }
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddHelpline}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Helpline (যোগ করুন)</span>
                </button>
              </div>
            </div>

            {/* Print Signatory & Policy Defaults */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">ID Card & Admit Card Print Defaults</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 text-xs font-semibold mb-1">ID Card Signatory Name</label>
                  <input
                    type="text"
                    value={profileForm.idCardSignatoryName}
                    onChange={e => setProfileForm({ ...profileForm, idCardSignatoryName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-semibold mb-1">Signatory Title</label>
                  <input
                    type="text"
                    value={profileForm.idCardSignatoryTitle}
                    onChange={e => setProfileForm({ ...profileForm, idCardSignatoryTitle: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-semibold mb-1">Admit Card Exam Controller</label>
                  <input
                    type="text"
                    value={profileForm.admitCardControllerName}
                    onChange={e => setProfileForm({ ...profileForm, admitCardControllerName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-xs font-semibold mb-1">ID Card Back Return Policy / Notice</label>
                <textarea
                  rows={2}
                  value={profileForm.idCardTerms}
                  onChange={e => setProfileForm({ ...profileForm, idCardTerms: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-xs font-semibold mb-1">Admit Card Exam Hall Instructions</label>
                <textarea
                  rows={2}
                  value={profileForm.admitCardInstructions}
                  onChange={e => setProfileForm({ ...profileForm, admitCardInstructions: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save All Academy Profile Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

