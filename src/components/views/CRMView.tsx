import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lead, LeadStatus, FollowUpMethod } from '../../types';
import { exportLeadsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  PhoneCall,
  Calendar,
  Sparkles,
  LayoutGrid,
  List,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  MessageSquare,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface CRMViewProps {
  onOpenNewLead: () => void;
  onOpenFollowUp: (leadId: string) => void;
  onOpenAdmissionWithLead: (lead: Lead) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  onOpenNewLead,
  onOpenFollowUp,
  onOpenAdmissionWithLead
}) => {
  const {
    leads,
    updateLead,
    deleteLead,
    courses,
    staffList,
    followUps,
    leadSources,
    occupationsList
  } = useAcademy();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [counselorFilter, setCounselorFilter] = useState<string>('all');

  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAltPhone, setEditAltPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [editCourseId, setEditCourseId] = useState('');
  const [editLeadSource, setEditLeadSource] = useState('');
  const [editCounselorId, setEditCounselorId] = useState('');
  const [editStatus, setEditStatus] = useState<LeadStatus>('New');
  const [editVisitDate, setEditVisitDate] = useState('');
  const [editComments, setEditComments] = useState('');
  const [editNextDate, setEditNextDate] = useState('');
  const [editNextNotes, setEditNextNotes] = useState('');

  // Delete Lead Modal State
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setEditName(lead.name);
    setEditPhone(lead.phone);
    setEditAltPhone(lead.altPhone || '');
    setEditEmail(lead.email || '');
    setEditAddress(lead.address || '');
    setEditOccupation(lead.occupation || 'Student');
    setEditCourseId(lead.interestedCourseId);
    setEditLeadSource(lead.leadSource);
    setEditCounselorId(lead.counselorId);
    setEditStatus(lead.status);
    setEditVisitDate(lead.visitDate || '');
    setEditComments(lead.comments || '');
    setEditNextDate(lead.nextFollowUpDate || '');
    setEditNextNotes(lead.nextFollowUpNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !editName.trim() || !editPhone.trim()) return;

    updateLead(editingLead.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      altPhone: editAltPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
      address: editAddress.trim() || undefined,
      occupation: editOccupation as any,
      interestedCourseId: editCourseId,
      leadSource: editLeadSource,
      counselorId: editCounselorId,
      status: editStatus,
      visitDate: editVisitDate || undefined,
      comments: editComments || undefined,
      nextFollowUpDate: editNextDate || undefined,
      nextFollowUpNotes: editNextNotes || undefined
    });

    setEditingLead(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingLead) return;
    deleteLead(deletingLead.id);
    setDeletingLead(null);
  };

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.leadCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || lead.interestedCourseId === courseFilter;
    const matchesCounselor = counselorFilter === 'all' || lead.counselorId === counselorFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesCounselor;
  });

  const pipelineColumns: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'New', label: 'New Inquiries', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { status: 'Contacted', label: 'Contacted', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { status: 'Interested', label: 'Interested', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { status: 'Demo Scheduled', label: 'Demo Scheduled', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { status: 'Follow-up', label: 'Active Follow-up', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { status: 'Admission Pending', label: 'Admission Pending', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { status: 'Admitted', label: 'Enrolled / Admitted', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { status: 'Lost', label: 'Lost / Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    if (newStatus === 'Admitted') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) onOpenAdmissionWithLead(lead);
    } else {
      updateLead(leadId, { status: newStatus });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Admission CRM & Visitor Pipeline
            </h2>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {leads.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Track prospective student inquiries, follow-up calls, demo classes, and conversion to admission
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white shadow-2xs text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Export Leads to Excel / Spreadsheet */}
          <button
            onClick={() => exportLeadsSpreadsheet(filteredLeads, courses, staffList, 'Nexgen_Customer_Leads')}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredLeads.length} Leads to Excel Spreadsheet (CSV)`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredLeads.length})</span>
          </button>

          <button
            onClick={onOpenNewLead}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Visitor / Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by name, phone, code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={counselorFilter}
          onChange={e => setCounselorFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
        >
          <option value="all">All Counselors</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold outline-none"
        >
          <option value="all">All Pipeline Stages</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Demo Scheduled">Demo Scheduled</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Admission Pending">Admission Pending</option>
          <option value="Admitted">Admitted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 min-h-[560px]">
          {pipelineColumns.map(col => {
            const columnLeads = filteredLeads.filter(l => l.status === col.status);

            return (
              <div
                key={col.status}
                className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[720px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {columnLeads.map(lead => {
                    const crs = courses.find(c => c.id === lead.interestedCourseId);
                    const counselor = staffList.find(s => s.id === lead.counselorId);
                    const leadFollowUps = followUps.filter(f => f.leadId === lead.id);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-2.5 relative group"
                      >
                        {/* Top: Name & Code */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {lead.name}
                            </h4>
                            <div className="text-[10px] font-mono text-blue-600 mt-0.5">
                              {lead.leadCode} • {lead.phone}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openEditModal(lead)}
                              title="Edit Lead Details"
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingLead(lead)}
                              title="Delete Lead"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Move stage dropdown */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-[10px] text-slate-400 font-medium">Stage:</span>
                          <select
                            value={lead.status}
                            onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Demo Scheduled">Demo</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Admission Pending">Pending</option>
                            <option value="Admitted">Admit Now</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        {/* Course & Source */}
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg space-y-1">
                          <div className="font-semibold text-slate-900 truncate">
                            {crs?.name || 'General Inquiry'}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center justify-between">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>Visited: <strong className="text-slate-700">{lead.visitDate || lead.createdAt?.split('T')[0] || 'N/A'}</strong></span>
                            </span>
                            <span>{counselor?.name?.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Visitor Comments / What Visitor Said */}
                        {lead.comments && (
                          <div className="text-[10px] text-slate-700 bg-blue-50/70 border border-blue-100 rounded-lg p-2 space-y-0.5">
                            <div className="font-bold text-blue-900 flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>Visitor Remarks (সে কী বলেছে):</span>
                            </div>
                            <p className="line-clamp-2 text-slate-600 italic">"{lead.comments}"</p>
                          </div>
                        )}

                        {/* Next Follow Up Date Pill */}
                        {lead.nextFollowUpDate && (
                          <div className="text-[10px] flex items-center space-x-1 text-amber-800 bg-amber-50 px-2 py-1 rounded-md font-medium border border-amber-100">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">Follow-up: <strong>{lead.nextFollowUpDate}</strong></span>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-[11px]">
                          <button
                            onClick={() => onOpenFollowUp(lead.id)}
                            className="text-slate-600 hover:text-indigo-600 font-semibold flex items-center space-x-1"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Log ({leadFollowUps.length})</span>
                          </button>

                          {lead.status !== 'Admitted' && (
                            <button
                              onClick={() => onOpenAdmissionWithLead(lead)}
                              className="text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1"
                            >
                              <span>Admit</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {columnLeads.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead Code & Name</th>
                  <th className="py-3 px-4">Visit Date & Remarks</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Interested Course</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Counselor</th>
                  <th className="py-3 px-4">Stage / Status</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map(lead => {
                  const crs = courses.find(c => c.id === lead.interestedCourseId);
                  const counselor = staffList.find(s => s.id === lead.counselorId);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="font-mono text-[10px] text-blue-600">{lead.leadCode}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{lead.visitDate || lead.createdAt?.split('T')[0] || '-'}</span>
                        </div>
                        {lead.comments ? (
                          <div className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5" title={lead.comments}>
                            "{lead.comments}"
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">No notes</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold">{lead.phone}</div>
                        <div className="text-[10px] text-slate-400">{lead.email || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {crs?.name || 'General Inquiry'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{lead.leadSource}</td>
                      <td className="py-3 px-4 text-slate-600">{counselor?.name || '-'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-50 border border-slate-200 font-bold rounded-lg px-2 py-1 text-slate-800 outline-none text-[11px]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Demo Scheduled">Demo Scheduled</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Admission Pending">Admission Pending</option>
                          <option value="Admitted">Admitted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-amber-800 font-medium">
                        {lead.nextFollowUpDate || '-'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(lead)}
                          title="Edit Lead Information"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded inline-flex items-center"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingLead(lead)}
                          title="Delete Lead"
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenFollowUp(lead.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[11px]"
                        >
                          Log Call
                        </button>
                        {lead.status !== 'Admitted' && (
                          <button
                            onClick={() => onOpenAdmissionWithLead(lead)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                          >
                            Admit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Edit Lead Information</h3>
                <p className="text-[11px] text-slate-400 font-mono">{editingLead.leadCode}</p>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alternate Phone</label>
                  <input
                    type="text"
                    value={editAltPhone}
                    onChange={e => setEditAltPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Interested Course</label>
                  <select
                    value={editCourseId}
                    onChange={e => setEditCourseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lead Source</label>
                  <select
                    value={editLeadSource}
                    onChange={e => setEditLeadSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {leadSources.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Counselor</label>
                  <select
                    value={editCounselorId}
                    onChange={e => setEditCounselorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Stage / Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as LeadStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Admission Pending">Admission Pending</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Occupation</label>
                  <select
                    value={editOccupation}
                    onChange={e => setEditOccupation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  >
                    {occupationsList.map(occ => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Visit Date (ভিজিট তারিখ)</label>
                  <input
                    type="date"
                    value={editVisitDate}
                    onChange={e => setEditVisitDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={editNextDate}
                    onChange={e => setEditNextDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Follow-up Action</label>
                  <input
                    type="text"
                    placeholder="e.g. Call back regarding 20% discount offer"
                    value={editNextNotes}
                    onChange={e => setEditNextNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Visitor Comments & Statement / সে কী বলেছে (Visitor Remarks)
                </label>
                <textarea
                  rows={3}
                  placeholder="ভিজিটর কী বলেছেন, কী কোর্স শিখতে চান, কী প্রশ্ন বা মন্তব্য করেছেন..."
                  value={editComments}
                  onChange={e => setEditComments(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Lead Record</h3>
                <p className="text-[11px] text-slate-500">Move to System Trash</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete lead <strong className="text-slate-900">{deletingLead.name}</strong> ({deletingLead.leadCode})? You can restore it later from Settings &gt; Trash Recovery.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
