import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Batch, BatchStatus } from '../../types';
import { exportBatchStudentsSpreadsheet, exportAllStudentsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  CalendarCheck,
  PlusCircle,
  Users,
  Clock,
  MapPin,
  User,
  ArrowRightLeft,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Video,
  ExternalLink,
  Globe,
  Building2,
  PlayCircle,
  Key,
  Layers
} from 'lucide-react';

interface BatchesViewProps {
  onSelectStudent: (studentId: string) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({ onSelectStudent }) => {
  const {
    batches,
    courses,
    admissions,
    students,
    staffList,
    rooms,
    addBatch,
    updateBatch,
    deleteBatch
  } = useAcademy();

  const [filterMode, setFilterMode] = useState<'All' | 'Offline' | 'Online Live' | 'Hybrid'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [batchNumber, setBatchNumber] = useState(`NCA-B${batches.length + 1}`);
  const [trainerId, setTrainerId] = useState(staffList.find(s => s.role === 'TRAINER')?.id || staffList[0]?.id || '');
  const [trainerName, setTrainerName] = useState('');
  const [batchType, setBatchType] = useState<'Offline' | 'Online Live' | 'Hybrid'>('Offline');
  const [liveMeetingUrl, setLiveMeetingUrl] = useState('');
  const [meetingPasscode, setMeetingPasscode] = useState('');
  const [recordingDriveUrl, setRecordingDriveUrl] = useState('');
  const [onlinePlatform, setOnlinePlatform] = useState<'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Classroom'>('Google Meet');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [classDays, setClassDays] = useState('Sun, Tue, Thu');
  const [classTime, setClassTime] = useState('06:00 PM - 08:00 PM');
  const [room, setRoom] = useState(rooms[0]?.name || 'Lab-1 (Farmgate)');
  const [seatCapacity, setSeatCapacity] = useState(20);
  const [status, setStatus] = useState<BatchStatus>('Ongoing');

  // Edit Batch State
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [editCourseId, setEditCourseId] = useState('');
  const [editBatchNumber, setEditBatchNumber] = useState('');
  const [editTrainerId, setEditTrainerId] = useState('');
  const [editTrainerName, setEditTrainerName] = useState('');
  const [editBatchType, setEditBatchType] = useState<'Offline' | 'Online Live' | 'Hybrid'>('Offline');
  const [editLiveMeetingUrl, setEditLiveMeetingUrl] = useState('');
  const [editMeetingPasscode, setEditMeetingPasscode] = useState('');
  const [editRecordingDriveUrl, setEditRecordingDriveUrl] = useState('');
  const [editOnlinePlatform, setEditOnlinePlatform] = useState<'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Classroom'>('Google Meet');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editClassDays, setEditClassDays] = useState('');
  const [editClassTime, setEditClassTime] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editSeatCapacity, setEditSeatCapacity] = useState(20);
  const [editStatus, setEditStatus] = useState<BatchStatus>('Ongoing');

  // Delete Batch State
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);

  const [selectedBatchDetails, setSelectedBatchDetails] = useState<Batch | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatch({
      courseId: selectedCourseId,
      batchNumber,
      trainerId,
      trainerName: trainerName.trim() || staffList.find(s => s.id === trainerId)?.name || undefined,
      batchType,
      liveMeetingUrl: liveMeetingUrl.trim() || undefined,
      meetingPasscode: meetingPasscode.trim() || undefined,
      recordingDriveUrl: recordingDriveUrl.trim() || undefined,
      onlinePlatform: batchType !== 'Offline' ? onlinePlatform : undefined,
      startDate,
      classDays,
      classTime,
      room: batchType === 'Online Live' ? (onlinePlatform || 'Online Google Meet') : room,
      seatCapacity,
      status
    });
    setIsAddModalOpen(false);
    setTrainerName('');
    setLiveMeetingUrl('');
    setMeetingPasscode('');
    setRecordingDriveUrl('');
  };

  const openEditModal = (b: Batch) => {
    setEditingBatch(b);
    setEditCourseId(b.courseId);
    setEditBatchNumber(b.batchNumber);
    setEditTrainerId(b.trainerId || '');
    setEditTrainerName(b.trainerName || (staffList.find(s => s.id === b.trainerId)?.name || ''));
    setEditBatchType(b.batchType || 'Offline');
    setEditLiveMeetingUrl(b.liveMeetingUrl || '');
    setEditMeetingPasscode(b.meetingPasscode || '');
    setEditRecordingDriveUrl(b.recordingDriveUrl || '');
    setEditOnlinePlatform((b.onlinePlatform as any) || 'Google Meet');
    setEditStartDate(b.startDate);
    setEditEndDate(b.endDate || '');
    setEditClassDays(b.classDays);
    setEditClassTime(b.classTime);
    setEditRoom(b.room);
    setEditSeatCapacity(b.seatCapacity);
    setEditStatus(b.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch || !editBatchNumber.trim()) return;

    updateBatch(editingBatch.id, {
      courseId: editCourseId,
      batchNumber: editBatchNumber.trim(),
      trainerId: editTrainerId,
      trainerName: editTrainerName.trim() || undefined,
      batchType: editBatchType,
      liveMeetingUrl: editLiveMeetingUrl.trim() || undefined,
      meetingPasscode: editMeetingPasscode.trim() || undefined,
      recordingDriveUrl: editRecordingDriveUrl.trim() || undefined,
      onlinePlatform: editBatchType !== 'Offline' ? editOnlinePlatform : undefined,
      startDate: editStartDate,
      endDate: editEndDate || undefined,
      classDays: editClassDays,
      classTime: editClassTime,
      room: editBatchType === 'Online Live' ? (editOnlinePlatform || 'Online Google Meet') : editRoom,
      seatCapacity: editSeatCapacity,
      status: editStatus
    });

    setEditingBatch(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingBatch) return;
    deleteBatch(deletingBatch.id);
    setDeletingBatch(null);
  };

  const displayedBatches = batches.filter(b => {
    if (filterMode === 'All') return true;
    return (b.batchType || 'Offline') === filterMode;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Batch Management & Capacity Tracking
            </h2>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              {batches.length} Batches
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor seat allocations, schedule timelines, trainer assignments, and student rosters
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => exportAllStudentsSpreadsheet(students, admissions, courses, batches)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-colors"
            title="Export all students of all batches to Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export All Batches & Students</span>
          </button>

          <button
            onClick={() => {
              setBatchNumber(`NCA-B${batches.length + 1}`);
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Batch</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Stats */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['All', 'Offline', 'Online Live', 'Hybrid'] as const).map(mode => {
          const count = mode === 'All' ? batches.length : batches.filter(b => (b.batchType || 'Offline') === mode).length;
          return (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                filterMode === mode
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {mode === 'Offline' && <Building2 className="w-3.5 h-3.5" />}
              {mode === 'Online Live' && <Globe className="w-3.5 h-3.5 text-blue-300" />}
              {mode === 'Hybrid' && <Layers className="w-3.5 h-3.5 text-amber-300" />}
              <span>{mode === 'All' ? 'All Batches' : `${mode} Batches`}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterMode === mode ? 'bg-purple-700 text-purple-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedBatches.map(batch => {
          const course = courses.find(c => c.id === batch.courseId);
          const trainer = staffList.find(s => s.id === batch.trainerId);
          const trainerDisplayName = batch.trainerName || trainer?.name || 'Unassigned';
          const enrolledStudents = admissions.filter(a => a.batchId === batch.id);
          const fillRate = Math.min(100, Math.round((enrolledStudents.length / batch.seatCapacity) * 100));
          const currentBatchType = batch.batchType || 'Offline';

          return (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">Batch #{batch.batchNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                      currentBatchType === 'Online Live'
                        ? 'bg-blue-100 text-blue-800'
                        : currentBatchType === 'Hybrid'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {currentBatchType === 'Online Live' ? (
                        <>
                          <Globe className="w-2.5 h-2.5 text-blue-600" />
                          <span>Online Live</span>
                        </>
                      ) : currentBatchType === 'Hybrid' ? (
                        <>
                          <Layers className="w-2.5 h-2.5 text-amber-600" />
                          <span>Hybrid</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-2.5 h-2.5 text-slate-500" />
                          <span>Offline</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      batch.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800' : batch.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {batch.status}
                    </span>
                    <button
                      onClick={() => openEditModal(batch)}
                      title="Edit Batch"
                      className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingBatch(batch)}
                      title="Delete Batch"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-indigo-950">{course?.name}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Trainer: <strong className="text-slate-800 font-bold">{trainerDisplayName}</strong></span>
                  </div>
                </div>

                {/* Timing and Room / Live Meeting */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-semibold">{batch.classDays}</span>
                    <span>•</span>
                    <span>{batch.classTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{batch.room}</span>
                    </div>
                  </div>

                  {/* Online Live Links if available */}
                  {(batch.liveMeetingUrl || batch.recordingDriveUrl) && (
                    <div className="pt-1 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
                      {batch.liveMeetingUrl && (
                        <a
                          href={batch.liveMeetingUrl.startsWith('http') ? batch.liveMeetingUrl : `https://${batch.liveMeetingUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shadow-2xs"
                        >
                          <Video className="w-2.5 h-2.5" />
                          <span>Join Live Class</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                      {batch.recordingDriveUrl && (
                        <a
                          href={batch.recordingDriveUrl.startsWith('http') ? batch.recordingDriveUrl : `https://${batch.recordingDriveUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] font-bold"
                        >
                          <PlayCircle className="w-2.5 h-2.5 text-purple-600" />
                          <span>Recordings Archive</span>
                        </a>
                      )}
                      {batch.meetingPasscode && (
                        <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          Pass: {batch.meetingPasscode}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Seat Capacity Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Seat Capacity:</span>
                    <span className="font-bold text-slate-900">
                      {enrolledStudents.length} / {batch.seatCapacity} ({fillRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        fillRate >= 90 ? 'bg-rose-500' : fillRate >= 60 ? 'bg-purple-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action: View Roster & Export */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => exportBatchStudentsSpreadsheet(batch, admissions, students, course, trainer)}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-[11px] flex items-center space-x-1 transition-colors"
                  title={`Export Batch #${batch.batchNumber} students to Excel Spreadsheet (CSV)`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel ({enrolledStudents.length})</span>
                </button>

                <button
                  onClick={() => setSelectedBatchDetails(batch)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-xs transition-colors"
                >
                  View Roster ({enrolledStudents.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Roster Modal */}
      {selectedBatchDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Roster: Batch #{selectedBatchDetails.batchNumber}</h3>
                <p className="text-xs text-purple-200">
                  {courses.find(c => c.id === selectedBatchDetails.courseId)?.name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const c = courses.find(cr => cr.id === selectedBatchDetails.courseId);
                    const tName = selectedBatchDetails.trainerName || staffList.find(s => s.id === selectedBatchDetails.trainerId)?.name || 'Unassigned';
                    exportBatchStudentsSpreadsheet(selectedBatchDetails, admissions, students, c, { name: tName });
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                  title="Export this batch's roster to Excel Spreadsheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Spreadsheet</span>
                </button>
                <button onClick={() => setSelectedBatchDetails(null)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="divide-y divide-slate-100">
                {admissions
                  .filter(a => a.batchId === selectedBatchDetails.id)
                  .map(adm => {
                    const stu = students.find(s => s.id === adm.studentId);
                    return (
                      <div key={adm.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={stu?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={stu?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{stu?.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{stu?.studentCode} • {stu?.phone}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${adm.due === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {adm.due === 0 ? 'Paid' : `Due ৳${adm.due.toLocaleString()}`}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedBatchDetails(null);
                              onSelectStudent(adm.studentId);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-semibold rounded text-[11px]"
                          >
                            Profile
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit Batch #{editingBatch.batchNumber}</h3>
              <button onClick={() => setEditingBatch(null)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course</label>
                <select
                  value={editCourseId}
                  onChange={e => setEditCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Number / Code</label>
                <input
                  type="text"
                  required
                  value={editBatchNumber}
                  onChange={e => setEditBatchNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Trainer Name (ম্যানুয়াল লিখুন / সিলেক্ট করুন)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    value={editTrainerName}
                    onChange={e => setEditTrainerName(e.target.value)}
                    list="edit-batch-trainers-list"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                  <datalist id="edit-batch-trainers-list">
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.role} ({s.designation || 'Trainer'})
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as BatchStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Delivery Mode & Platform */}
              <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Batch Mode</label>
                  <select
                    value={editBatchType}
                    onChange={e => setEditBatchType(e.target.value as any)}
                    className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-purple-950 font-bold outline-none"
                  >
                    <option value="Offline">🏢 Offline (Lab Campus)</option>
                    <option value="Online Live">🌐 Online Live (Meet / Zoom)</option>
                    <option value="Hybrid">🔄 Hybrid (Campus + Online)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Online Platform</label>
                  <select
                    value={editOnlinePlatform}
                    onChange={e => setEditOnlinePlatform(e.target.value as any)}
                    disabled={editBatchType === 'Offline'}
                    className="w-full bg-white border border-purple-200 disabled:opacity-50 rounded-lg px-3 py-2 text-purple-950 font-bold outline-none"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Classroom">Google Classroom</option>
                  </select>
                </div>
              </div>

              {editBatchType !== 'Offline' && (
                <div className="space-y-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-blue-900 font-semibold mb-1">Live Class Link (Google Meet / Zoom URL)</label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={editLiveMeetingUrl}
                        onChange={e => setEditLiveMeetingUrl(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-1">Passcode</label>
                      <input
                        type="text"
                        placeholder="e.g. 123456"
                        value={editMeetingPasscode}
                        onChange={e => setEditMeetingPasscode(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Class Recordings Google Drive / Portal Link</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={editRecordingDriveUrl}
                      onChange={e => setEditRecordingDriveUrl(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={e => setEditStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Days</label>
                  <input
                    type="text"
                    value={editClassDays}
                    onChange={e => setEditClassDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Time</label>
                  <input
                    type="text"
                    value={editClassTime}
                    onChange={e => setEditClassTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {editBatchType === 'Online Live' ? 'Online Server / Room' : 'Room / Lab'}
                  </label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={e => setEditRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    value={editSeatCapacity}
                    onChange={e => setEditSeatCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Create New Academic Batch</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch Number / Code</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Trainer Name (ম্যানুয়াল লিখুন / সিলেক্ট করুন)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Tanvir Ahmed or Md. Rafiqul Islam"
                    value={trainerName}
                    onChange={e => setTrainerName(e.target.value)}
                    list="add-batch-trainers-list"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                  <datalist id="add-batch-trainers-list">
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.role} ({s.designation || 'Trainer'})
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Days</label>
                  <input
                    type="text"
                    value={classDays}
                    onChange={e => setClassDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Time</label>
                  <input
                    type="text"
                    value={classTime}
                    onChange={e => setClassTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Mode & Platform */}
              <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Batch Mode</label>
                  <select
                    value={batchType}
                    onChange={e => {
                      const newType = e.target.value as any;
                      setBatchType(newType);
                      if (newType === 'Online Live' && (!room || room === 'Lab 01 (Campus)')) {
                        setRoom('Google Meet');
                      } else if (newType === 'Offline' && (room === 'Google Meet' || room === 'Zoom')) {
                        setRoom('Lab 01 (Campus)');
                      }
                    }}
                    className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-purple-950 font-bold outline-none"
                  >
                    <option value="Offline">🏢 Offline (Lab Campus)</option>
                    <option value="Online Live">🌐 Online Live (Meet / Zoom)</option>
                    <option value="Hybrid">🔄 Hybrid (Campus + Online)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Online Platform</label>
                  <select
                    value={onlinePlatform}
                    onChange={e => {
                      const val = e.target.value as any;
                      setOnlinePlatform(val);
                      if (batchType === 'Online Live') setRoom(val);
                    }}
                    disabled={batchType === 'Offline'}
                    className="w-full bg-white border border-purple-200 disabled:opacity-50 rounded-lg px-3 py-2 text-purple-950 font-bold outline-none"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Classroom">Google Classroom</option>
                  </select>
                </div>
              </div>

              {batchType !== 'Offline' && (
                <div className="space-y-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-blue-900 font-semibold mb-1">Live Class Link (Meet / Zoom URL)</label>
                      <input
                        type="url"
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={liveMeetingUrl}
                        onChange={e => setLiveMeetingUrl(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-1">Passcode</label>
                      <input
                        type="text"
                        placeholder="e.g. 123456"
                        value={meetingPasscode}
                        onChange={e => setMeetingPasscode(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none text-[11px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Class Recordings Google Drive / Portal Link</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={recordingDriveUrl}
                      onChange={e => setRecordingDriveUrl(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-slate-900 outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {batchType === 'Online Live' ? 'Online Server / Room' : 'Room / Lab'}
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    value={seatCapacity}
                    onChange={e => setSeatCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Batch Confirmation Modal */}
      {deletingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Batch #{deletingBatch.batchNumber}</h3>
                <p className="text-[11px] text-slate-500">Move Batch to System Trash</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete batch <strong className="text-slate-900">#{deletingBatch.batchNumber}</strong>?
              {admissions.filter(a => a.batchId === deletingBatch.id).length > 0 && (
                <span className="block mt-1 font-bold text-rose-700">
                  Note: This batch has {admissions.filter(a => a.batchId === deletingBatch.id).length} enrolled students.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBatch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
