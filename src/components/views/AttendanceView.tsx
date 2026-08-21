import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { AttendanceStatus } from '../../types';
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Save,
  Users,
  Trash2
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    batches,
    admissions,
    students,
    attendance,
    bulkSaveAttendance,
    deleteAttendance,
    deleteAttendanceBatch
  } = useAcademy();

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDeleteBatchConfirm, setShowDeleteBatchConfirm] = useState(false);

  // Local state for attendance form records
  const [sheetRecords, setSheetRecords] = useState<{ [studentId: string]: { status: AttendanceStatus; note: string } }>({});

  const batchStudents = admissions
    .filter(a => a.batchId === selectedBatchId)
    .map(a => students.find(s => s.id === a.studentId))
    .filter(Boolean);

  // Initialize sheet records when batch or date changes
  useEffect(() => {
    const existing = attendance.filter(a => a.batchId === selectedBatchId && a.date === selectedDate);
    const initialMap: { [studentId: string]: { status: AttendanceStatus; note: string } } = {};

    batchStudents.forEach(stu => {
      if (!stu) return;
      const found = existing.find(e => e.studentId === stu.id);
      initialMap[stu.id] = {
        status: found ? found.status : 'Present', // default to Present
        note: found?.note || ''
      };
    });

    setSheetRecords(initialMap);
  }, [selectedBatchId, selectedDate, admissions]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setSheetRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setSheetRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: { [studentId: string]: { status: AttendanceStatus; note: string } } = {};
    batchStudents.forEach(stu => {
      if (!stu) return;
      updated[stu.id] = {
        status,
        note: sheetRecords[stu.id]?.note || ''
      };
    });
    setSheetRecords(updated);
  };

  const handleSave = () => {
    const payload = (Object.entries(sheetRecords) as [string, { status: AttendanceStatus; note: string }][]).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      note: data.note || undefined
    }));
    bulkSaveAttendance(selectedBatchId, selectedDate, payload);
    alert('Attendance marked and saved successfully!');
  };

  // Metrics for current sheet
  const totalCount = batchStudents.length;
  const sheetValues = Object.values(sheetRecords) as { status: AttendanceStatus; note: string }[];
  const presentCount = sheetValues.filter(r => r.status === 'Present').length;
  const lateCount = sheetValues.filter(r => r.status === 'Late').length;
  const absentCount = sheetValues.filter(r => r.status === 'Absent').length;
  const excusedCount = sheetValues.filter(r => r.status === 'Excused').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Daily Batch Attendance Register
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Live Sheet
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Mark daily student attendance, track late arrivals, record absence reasons, and monitor attendance %
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {attendance.some(a => a.batchId === selectedBatchId && a.date === selectedDate) && (
            <button
              onClick={() => setShowDeleteBatchConfirm(true)}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-colors"
              title="Delete this date's attendance and move to Recycle Bin"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Date Attendance</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Record</span>
          </button>
        </div>
      </div>

      {/* Selectors & Quick Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  Batch #{b.batchNumber} ({b.classDays} - {b.classTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
            />
          </div>
        </div>

        {/* Quick 1-Click Mass Fill Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => markAll('Present')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors"
          >
            All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg transition-colors"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-emerald-700 font-bold block">Present</span>
            <span className="text-xl font-black text-emerald-950">{presentCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 opacity-60" />
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-amber-800 font-bold block">Late</span>
            <span className="text-xl font-black text-amber-950">{lateCount}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-600 opacity-60" />
        </div>

        <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-rose-700 font-bold block">Absent</span>
            <span className="text-xl font-black text-rose-950">{absentCount}</span>
          </div>
          <XCircle className="w-5 h-5 text-rose-600 opacity-60" />
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-indigo-700 font-bold block">Excused</span>
            <span className="text-xl font-black text-indigo-950">{excusedCount}</span>
          </div>
          <Users className="w-5 h-5 text-indigo-600 opacity-60" />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Historical Rate</th>
                <th className="py-3 px-4">Mark Status</th>
                <th className="py-3 px-4">Remark / Absence Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchStudents.map(student => {
                if (!student) return null;
                const rec = sheetRecords[student.id] || { status: 'Present', note: '' };

                // Calculate historical attendance for this student
                const studentPastAttendance = attendance.filter(a => a.studentId === student.id);
                const pastTotal = studentPastAttendance.length;
                const pastPresent = studentPastAttendance.filter(a => a.status === 'Present').length;
                const pastRate = pastTotal > 0 ? Math.round((pastPresent / pastTotal) * 100) : 100;

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="font-mono text-[10px] text-indigo-600">{student.studentCode}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">{student.phone}</td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        pastRate >= 80 ? 'text-emerald-700 bg-emerald-50' : pastRate >= 65 ? 'text-amber-800 bg-amber-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {pastRate}% ({pastPresent}/{pastTotal})
                      </span>
                    </td>

                    {/* Status Toggles */}
                    <td className="py-3 px-4">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 space-x-1 border border-slate-200">
                        {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map(status => {
                          const isSelected = rec.status === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(student.id, status)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? status === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : status === 'Late'
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : status === 'Absent'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'bg-indigo-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="e.g. Informed late arrival due to traffic..."
                        value={rec.note}
                        onChange={e => handleNoteChange(student.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                );
              })}

              {batchStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No students currently enrolled in this batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Batch Attendance Confirmation Modal */}
      {showDeleteBatchConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Batch Attendance</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete all saved attendance records for this batch on <strong className="text-slate-900">{selectedDate}</strong>? Records can be restored from the Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteBatchConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAttendanceBatch(selectedBatchId, selectedDate);
                  setShowDeleteBatchConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
