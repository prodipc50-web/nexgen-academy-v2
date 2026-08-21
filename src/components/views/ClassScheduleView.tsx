import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { ClassSchedule } from '../../types';
import { CalendarDays, PlusCircle, Clock, MapPin, Video, CheckCircle2, X, Trash2, AlertTriangle } from 'lucide-react';

export const ClassScheduleView: React.FC = () => {
  const {
    schedules,
    batches,
    courses,
    staffList,
    addClassSchedule,
    updateClassSchedule,
    deleteClassSchedule
  } = useAcademy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<ClassSchedule | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [classNumber, setClassNumber] = useState(schedules.length + 1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:00 PM');
  const [endTime, setEndTime] = useState('08:00 PM');
  const [topic, setTopic] = useState('');
  const [room, setRoom] = useState('Lab-1');
  const [trainerId, setTrainerId] = useState(staffList[0]?.id || '');
  const [trainerName, setTrainerName] = useState(staffList[0]?.name || '');
  const [meetingUrl, setMeetingUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    addClassSchedule({
      batchId: selectedBatchId,
      classNumber,
      date,
      startTime,
      endTime,
      topic,
      room,
      trainerId,
      trainerName: trainerName.trim() || staffList.find(s => s.id === trainerId)?.name || undefined,
      status: 'Scheduled',
      meetingUrl: meetingUrl || undefined
    });

    setIsAddModalOpen(false);
    setTopic('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Class Schedule & Daily Routine
            </h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {schedules.length} Sessions
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Daily lecture topics, room assignments, lab bookings, and class recording links
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Class</span>
        </button>
      </div>

      {/* Routine Timeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Class # & Date</th>
                <th className="py-3 px-4">Batch & Course</th>
                <th className="py-3 px-4">Lecture Topic</th>
                <th className="py-3 px-4">Timing & Room</th>
                <th className="py-3 px-4">Trainer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((sch, idx) => {
                const batch = batches.find(b => b.id === sch.batchId);
                const course = courses.find(c => c.id === (sch.courseId || batch?.courseId));
                const trainer = staffList.find(s => s.id === sch.trainerId);

                return (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Class #{sch.classNumber || idx + 1}</div>
                      <div className="text-[11px] text-slate-500">{sch.date}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-indigo-700">Batch #{batch?.batchNumber || 'General'}</div>
                      <div className="text-[10px] text-slate-400">{course?.name}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {sch.topic}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>{sch.time || `${sch.startTime || '06:00 PM'} - ${sch.endTime || '08:00 PM'}`}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{sch.room}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {sch.trainerName || trainer?.name || 'Trainer'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sch.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : sch.status === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sch.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5">
                      {sch.status !== 'Completed' ? (
                        <button
                          onClick={() => updateClassSchedule(sch.id, { status: 'Completed' })}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded text-[11px]"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">✓ Completed</span>
                      )}

                      <button
                        onClick={() => setDeletingSchedule(sch)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Schedule & Move to Recycle Bin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Schedule Confirmation Modal */}
      {deletingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Class Session</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">Class #{deletingSchedule.classNumber || ''} - {deletingSchedule.topic}</strong> ({deletingSchedule.date})? You can restore it anytime from Settings &gt; Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSchedule(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteClassSchedule(deletingSchedule.id);
                  setDeletingSchedule(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Schedule Class Session</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={e => setSelectedBatchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>Batch #{b.batchNumber} ({b.classDays})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class #</label>
                  <input
                    type="number"
                    value={classNumber}
                    onChange={e => setClassNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lecture Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Prompting & Image Inpainting"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Room / Lab</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Trainer (ম্যানুয়াল নাম লিখুন / সিলেক্ট করুন)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mahfuzur Rahman"
                    value={trainerName}
                    onChange={e => {
                      setTrainerName(e.target.value);
                      const matched = staffList.find(s => s.name.toLowerCase() === e.target.value.toLowerCase());
                      if (matched) setTrainerId(matched.id);
                    }}
                    list="schedule-trainer-list"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
                  />
                  <datalist id="schedule-trainer-list">
                    {staffList.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </datalist>
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
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
