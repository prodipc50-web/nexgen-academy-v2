import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { SeminarWorkshop, Lead } from '../../types';
import { exportSeminarsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  Presentation,
  Calendar,
  Users,
  MapPin,
  Clock,
  Plus,
  Search,
  UserCheck,
  Award,
  Trash2,
  Edit2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Video,
  Ticket,
  FileSpreadsheet
} from 'lucide-react';

interface SeminarsWorkshopsViewProps {
  onOpenNewAdmissionWithLead?: (lead: Lead) => void;
}

export const SeminarsWorkshopsView: React.FC<SeminarsWorkshopsViewProps> = ({
  onOpenNewAdmissionWithLead
}) => {
  const {
    seminars,
    addSeminar,
    updateSeminar,
    deleteSeminar,
    registerLeadToSeminar,
    leads,
    courses
  } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<SeminarWorkshop | null>(null);
  const [seminarToDelete, setSeminarToDelete] = useState<SeminarWorkshop | null>(null);

  // Quick Register Attendee Modal
  const [registeringSeminar, setRegisteringSeminar] = useState<SeminarWorkshop | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState('');

  // Form State for Seminar
  const [title, setTitle] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [date, setDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState('04:00 PM - 06:00 PM');
  const [venueType, setVenueType] = useState<'Physical' | 'Online Zoom' | 'Hybrid'>('Physical');
  const [room, setRoom] = useState('Auditorium / Lab 1');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [capacity, setCapacity] = useState<number>(60);
  const [status, setStatus] = useState<SeminarWorkshop['status']>('Upcoming');
  const [isFree, setIsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [description, setDescription] = useState('');

  const filteredSeminars = seminars.filter(s => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.speakerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalSeminars = seminars.length;
  const totalRegistrations = seminars.reduce((sum, s) => sum + s.registeredCount, 0);
  const totalAdmissionsConverted = seminars.reduce((sum, s) => sum + (s.convertedAdmissionsCount || 0), 0);
  const conversionRate = totalRegistrations > 0 ? Math.round((totalAdmissionsConverted / totalRegistrations) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingSeminar(null);
    setTitle('');
    setSpeakerName('Prodip Chowdhury');
    setSpeakerTitle('Managing Director & Lead Technology Specialist');
    setCourseId(courses[0]?.id || '');
    setDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
    setTime('04:00 PM - 06:00 PM');
    setVenueType('Physical');
    setRoom('Auditorium / Lab 1');
    setMeetingUrl('');
    setCapacity(60);
    setStatus('Upcoming');
    setIsFree(true);
    setTicketPrice(0);
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (s: SeminarWorkshop) => {
    setEditingSeminar(s);
    setTitle(s.title);
    setSpeakerName(s.speakerName);
    setSpeakerTitle(s.speakerTitle || '');
    setCourseId(s.courseId || '');
    setDate(s.date);
    setTime(s.time);
    setVenueType((s.venueType as any) || 'Physical');
    setRoom(s.room || '');
    setMeetingUrl(s.meetingUrl || '');
    setCapacity(s.capacity);
    setStatus(s.status);
    setIsFree(s.isFree !== false);
    setTicketPrice(s.ticketPrice || 0);
    setDescription(s.description || '');
    setIsAddModalOpen(true);
  };

  const handleSaveSeminar = (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find(c => c.id === courseId);

    if (editingSeminar) {
      updateSeminar(editingSeminar.id, {
        title,
        speakerName,
        speakerTitle,
        courseId,
        courseName: selCourse?.name || '',
        date,
        time,
        venueType,
        room,
        meetingUrl,
        capacity,
        status,
        isFree,
        ticketPrice,
        description
      });
    } else {
      addSeminar({
        title,
        speakerName,
        speakerTitle,
        courseId,
        courseName: selCourse?.name || '',
        date,
        time,
        venueType,
        room,
        meetingUrl,
        capacity,
        status,
        isFree,
        ticketPrice,
        description
      });
    }
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (seminarToDelete) {
      deleteSeminar(seminarToDelete.id);
      setSeminarToDelete(null);
    }
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registeringSeminar && selectedLeadId) {
      registerLeadToSeminar(registeringSeminar.id, selectedLeadId);
      setRegisteringSeminar(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-950/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Growth & Community Outreach</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Free Seminars & Career Masterclasses
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Host free career workshops, tech bootcamps, and track lead registrations and direct admission conversions.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => exportSeminarsSpreadsheet(seminars)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            title="Export Seminar Leads & Participants to Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Spreadsheet</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Host New Seminar</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Events</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalSeminars}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold">Masterclasses & Workshops</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Registrations</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalRegistrations}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold">Interested Leads</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Admissions Converted</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalAdmissionsConverted}</h3>
            <p className="text-[11px] text-violet-600 font-semibold">Enrolled as Students</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Conversion Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{conversionRate}%</h3>
            <p className="text-[11px] text-amber-600 font-semibold">Lead-to-Student ROI</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search seminars, topics, speakers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Live / Ongoing">Live / Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Seminars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeminars.map(s => {
          const seatOccupancy = Math.min(100, Math.round((s.registeredCount / s.capacity) * 100));
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      s.status === 'Upcoming'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : s.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {s.status}
                  </span>

                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {s.isFree ? 'FREE ENTRY' : `৳${s.ticketPrice}`}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-2.5">{s.title}</h3>
                <p className="text-xs text-indigo-600 font-semibold">{s.courseName || 'Career Masterclass'}</p>

                {/* Speaker Info */}
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {s.speakerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{s.speakerName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{s.speakerTitle || 'Industry Expert'}</p>
                  </div>
                </div>

                {/* Schedule & Location */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{s.date} • {s.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {s.venueType === 'Online Zoom' ? (
                      <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )}
                    <span>{s.room || s.venueType}</span>
                  </div>
                </div>

                {/* Seat Capacity Bar */}
                <div className="mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>Seats Booked: {s.registeredCount} / {s.capacity}</span>
                    <span className="text-indigo-600 font-bold">{seatOccupancy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        seatOccupancy > 90 ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${seatOccupancy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setRegisteringSeminar(s);
                    if (leads.length > 0) setSelectedLeadId(leads[0].id);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>+ Register Lead</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Seminar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeminarToDelete(s)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Seminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSeminars.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <Presentation className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No seminars or masterclasses found</h3>
          <p className="text-xs text-slate-500 mt-1">Host career bootcamps and workshops to attract new students.</p>
        </div>
      )}

      {/* ADD / EDIT SEMINAR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Presentation className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">
                  {editingSeminar ? 'Edit Seminar Details' : 'Host New Career Seminar'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSeminar} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Seminar / Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass: Career in Full-Stack & Freelancing"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Speaker / Mentor Name *</label>
                  <input
                    type="text"
                    required
                    value={speakerName}
                    onChange={e => setSpeakerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Speaker Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Tech Lead"
                    value={speakerTitle}
                    onChange={e => setSpeakerTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="04:00 PM - 06:00 PM"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Venue Type</label>
                  <select
                    value={venueType}
                    onChange={e => setVenueType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Physical">Physical Campus</option>
                    <option value="Online Zoom">Online Zoom</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Room / Platform</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Outline</label>
                <textarea
                  rows={3}
                  placeholder="Key takeaways, live demonstrations, and Q&A session details..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Seminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK REGISTER LEAD MODAL */}
      {registeringSeminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register Lead to Seminar</h3>
            <p className="text-xs text-slate-500 mb-4">
              Reserve a seat for <strong>{registeringSeminar.title}</strong>.
            </p>

            <form onSubmit={handleQuickRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Lead *</label>
                <select
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} • {l.phone} ({l.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisteringSeminar(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {seminarToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Seminar?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete <strong>{seminarToDelete.title}</strong>? It will be moved to the Recycle Bin.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setSeminarToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Yes, Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
