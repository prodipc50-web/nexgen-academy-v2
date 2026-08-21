import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { OccupationType, LeadStatus } from '../../types';
import { X, UserPlus, Phone, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  const {
    courses,
    batches,
    staffList,
    campaigns,
    occupationsList,
    educationLevelsList,
    leadSourcesList,
    addLead
  } = useAcademy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState<OccupationType>(occupationsList[0] || 'Student (School / College / University)');
  const [educationLevel, setEducationLevel] = useState(educationLevelsList[0] || 'HSC / Higher Secondary (Class 12)');
  const [institution, setInstitution] = useState('');
  const [interestedCourseId, setInterestedCourseId] = useState(courses[0]?.id || '');
  const [interestedBatchId, setInterestedBatchId] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [leadSource, setLeadSource] = useState(leadSourcesList[0] || 'Facebook Ads');
  const [campaignId, setCampaignId] = useState('');
  const [counselorId, setCounselorId] = useState(staffList.find(s => s.role === 'COUNSELOR')?.id || staffList[0]?.id || '');
  const [counselorName, setCounselorName] = useState(staffList.find(s => s.role === 'COUNSELOR')?.name || staffList[0]?.name || '');
  const [budget, setBudget] = useState<number>(12000);
  const [status, setStatus] = useState<LeadStatus>('New');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [comments, setComments] = useState('');
  const [requirements, setRequirements] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [nextFollowUpNotes, setNextFollowUpNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !interestedCourseId) {
      alert('Please fill the lead name, phone, and interested course.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    addLead({
      name,
      phone,
      altPhone: altPhone || undefined,
      email: email || undefined,
      address: address || undefined,
      occupation,
      educationLevel,
      institution: institution || undefined,
      interestedCourseId,
      interestedBatchId: interestedBatchId || undefined,
      preferredTime,
      leadSource,
      campaignId: campaignId || undefined,
      counselorId,
      counselorName: counselorName.trim() || staffList.find(s => s.id === counselorId)?.name || undefined,
      visitDate: visitDate || todayStr,
      firstContactDate: visitDate || todayStr,
      comments: comments || undefined,
      requirements: requirements || undefined,
      budget: budget || undefined,
      status,
      nextFollowUpDate: nextFollowUpDate || undefined,
      nextFollowUpNotes: nextFollowUpNotes || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Register New Visitor / Lead</h3>
              <p className="text-xs text-blue-200">Log walk-in visitor, phone inquiry, or social media lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Md. Tariqul Islam"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Primary Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="+880 17..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Alt Phone / WhatsApp</label>
              <input
                type="text"
                placeholder="+880 19..."
                value={altPhone}
                onChange={e => setAltPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="lead@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Occupation</label>
              <select
                value={occupation}
                onChange={e => setOccupation(e.target.value as OccupationType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {occupationsList.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
                {!occupationsList.includes(occupation) && occupation && (
                  <option value={occupation}>{occupation}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {educationLevelsList.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
                {!educationLevelsList.includes(educationLevel) && educationLevel && (
                  <option value={educationLevel}>{educationLevel}</option>
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">Institution / College</label>
              <input
                type="text"
                placeholder="e.g. Dhaka Commerce College"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="e.g. Mirpur-10, Dhaka"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Academic Interest */}
          <div className="pt-3 border-t border-slate-200">
            <div className="font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Interest & Marketing Source
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Interested Course <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={interestedCourseId}
                  onChange={e => setInterestedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (৳{c.offerFee.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Visit / Contact Date (ভিজিট তারিখ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Preferred Batch / Time</label>
                <input
                  type="text"
                  placeholder="e.g. Evening (6 PM - 8 PM) / Sun-Tue"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Initial Pipeline Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as LeadStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Admission Pending">Admission Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={e => setLeadSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {leadSourcesList.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                  {!leadSourcesList.includes(leadSource) && leadSource && (
                    <option value={leadSource}>{leadSource}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assigned Counselor (ম্যানুয়াল নাম লিখুন / সিলেক্ট করুন)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahfuzur Rahman"
                  value={counselorName}
                  onChange={e => {
                    setCounselorName(e.target.value);
                    const matched = staffList.find(s => s.name.toLowerCase() === e.target.value.toLowerCase());
                    if (matched) setCounselorId(matched.id);
                  }}
                  list="new-lead-counselors-list"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <datalist id="new-lead-counselors-list">
                  {staffList.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role.replace('_', ' ')})
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Candidate Budget (৳)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Follow-up Scheduler */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 space-y-3">
            <div className="font-semibold text-blue-900 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Next Follow-up Task (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={e => setNextFollowUpDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Follow-up Notes / Next Action</label>
                <input
                  type="text"
                  placeholder="e.g. Call back on Tuesday regarding demo seat"
                  value={nextFollowUpNotes}
                  onChange={e => setNextFollowUpNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Visitor Comments & Statement */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Visitor Comments & Statement / সে কী বলেছে (Visitor Remarks)
            </label>
            <textarea
              rows={3}
              placeholder="ভিজিটর কী বলেছেন, কী কোর্স শিখতে চান, কী প্রশ্ন বা মন্তব্য করেছেন (e.g. Visitor wants morning batch, asked about installments and certificate value)..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Lead to CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
