import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Lead, FollowUpMethod, FollowUpResult } from '../../types';
import { X, Calendar, PhoneCall, MessageSquare, UserCheck, CheckCircle2 } from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, lead }) => {
  const { currentUser, addFollowUp } = useAcademy();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<FollowUpMethod>('Phone Call');
  const [result, setResult] = useState<FollowUpResult>('Interested');
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('Call back regarding batch schedule');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUp({
      leadId: lead.id,
      counselorId: currentUser.id,
      date,
      method,
      result,
      notes,
      nextAction,
      nextFollowUpDate: result !== 'Admitted' && result !== 'Not Interested' ? nextFollowUpDate : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Log Follow-up Call / Interaction</h3>
              <p className="text-[11px] text-indigo-200">
                Lead: <span className="font-semibold text-white">{lead.name}</span> ({lead.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Interaction Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Contact Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as FollowUpMethod)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
              >
                <option value="Phone Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp Message</option>
                <option value="SMS">Direct SMS</option>
                <option value="In-Person Visit">In-Person Visit / Walk-in</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Follow-up Result / Outcome <span className="text-rose-500">*</span>
            </label>
            <select
              value={result}
              onChange={e => setResult(e.target.value as FollowUpResult)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
            >
              <option value="Interested">Interested (Considering)</option>
              <option value="Demo Scheduled">Demo Class Scheduled</option>
              <option value="Admission Pending">Admission Promised / Pending Deposit</option>
              <option value="Admitted">Admitted (Convert Now)</option>
              <option value="Call Later / Reschedule">Call Later / Busy</option>
              <option value="No Answer">No Answer / Switched Off</option>
              <option value="Not Interested">Not Interested / Budget Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Call Notes & Feedback</label>
            <textarea
              rows={2}
              required
              placeholder="Candidate spoke with father, prefers Sunday batch, requested ৳500 extra scholarship..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
            />
          </div>

          {result !== 'Admitted' && result !== 'Not Interested' && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-2.5">
              <div className="text-amber-900 font-bold text-[11px] flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next Scheduled Action</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={e => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Next Planned Task</label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
