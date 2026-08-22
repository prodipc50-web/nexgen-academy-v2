import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, Batch, Lead, OccupationType, StudentGoal, PaymentMethod } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  GraduationCap,
  Calculator,
  User,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLead?: Lead | null;
  onSuccessAdmission?: (admissionId: string, receiptNumber?: string) => void;
}

export const NewAdmissionModal: React.FC<NewAdmissionModalProps> = ({
  isOpen,
  onClose,
  initialLead,
  onSuccessAdmission
}) => {
  const {
    courses,
    batches,
    leads,
    staffList,
    campaigns,
    admissions,
    occupationsList,
    educationLevelsList,
    studentGoalsList,
    leadSourcesList,
    paymentMethodsList,
    bloodGroupsList,
    createAdmission
  } = useAcademy();

  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLead?.id || '');
  const [name, setName] = useState(initialLead?.name || '');
  const [phone, setPhone] = useState(initialLead?.phone || '');
  const [altPhone, setAltPhone] = useState(initialLead?.altPhone || '');
  const [email, setEmail] = useState(initialLead?.email || '');
  const [address, setAddress] = useState(initialLead?.address || '');
  const [occupation, setOccupation] = useState<OccupationType>(initialLead?.occupation || occupationsList[0] || 'Student (School / College / University)');
  const [education, setEducation] = useState(initialLead?.educationLevel || educationLevelsList[0] || 'HSC / Higher Secondary (Class 12)');
  const [bloodGroup, setBloodGroup] = useState(bloodGroupsList[0] || 'A+');
  const [institution, setInstitution] = useState(initialLead?.institution || '');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [studentGoal, setStudentGoal] = useState<StudentGoal>(studentGoalsList[0] || 'Freelancing (Upwork/Fiverr)');
  const [notes, setNotes] = useState(initialLead?.comments || '');

  // Academic & Fee State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialLead?.interestedCourseId || courses[0]?.id || ''
  );
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    initialLead?.interestedBatchId || batches[0]?.id || ''
  );
  const [learningMode, setLearningMode] = useState<'Offline' | 'Online Live' | 'Hybrid'>(
    (initialLead?.preferredLearningMode as any) || 'Offline'
  );
  const [admissionType, setAdmissionType] = useState<'In-Person / Office' | 'Online Admission'>('In-Person / Office');
  const [counselorId, setCounselorId] = useState<string>(
    initialLead?.counselorId || staffList.find(s => s.role === 'COUNSELOR')?.id || staffList[0]?.id || ''
  );
  const [counselorName, setCounselorName] = useState<string>(
    initialLead?.counselorName || staffList.find(s => s.role === 'COUNSELOR')?.name || staffList[0]?.name || ''
  );
  const [leadSource, setLeadSource] = useState(initialLead?.leadSource || leadSourcesList[0] || 'Facebook Ads');
  const [campaignId, setCampaignId] = useState(initialLead?.campaignId || '');
  const [referral, setReferral] = useState('');

  const [regularFee, setRegularFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [scholarship, setScholarship] = useState<number>(0);
  const [initialPaid, setInitialPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(paymentMethodsList[0] as PaymentMethod || 'Cash');
  const [transactionId, setTransactionId] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [remarks, setRemarks] = useState('');

  // Sync with selected course
  useEffect(() => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (course) {
      setRegularFee(course.regularFee);
      const calculatedDiscount = Math.max(0, course.regularFee - course.offerFee);
      setDiscount(calculatedDiscount);
      setInitialPaid(Math.round(course.offerFee / 2)); // Default half payment suggestion
      if (course.deliveryMode) {
        setLearningMode(course.deliveryMode);
      }
    }
  }, [selectedCourseId, courses]);

  // Sync when batch changes
  useEffect(() => {
    const batch = batches.find(b => b.id === selectedBatchId);
    if (batch?.batchType) {
      setLearningMode(batch.batchType);
    }
  }, [selectedBatchId, batches]);

  // Sync when initialLead changes
  useEffect(() => {
    if (initialLead) {
      setSelectedLeadId(initialLead.id);
      setName(initialLead.name);
      setPhone(initialLead.phone);
      setAltPhone(initialLead.altPhone || '');
      setEmail(initialLead.email || '');
      setAddress(initialLead.address || '');
      setOccupation(initialLead.occupation);
      setEducation(initialLead.educationLevel);
      setInstitution(initialLead.institution || '');
      if (initialLead.interestedCourseId) setSelectedCourseId(initialLead.interestedCourseId);
      if (initialLead.interestedBatchId) setSelectedBatchId(initialLead.interestedBatchId);
      if (initialLead.preferredLearningMode) setLearningMode(initialLead.preferredLearningMode);
      if (initialLead.counselorId) setCounselorId(initialLead.counselorId);
      if (initialLead.counselorName) setCounselorName(initialLead.counselorName);
      if (initialLead.leadSource) setLeadSource(initialLead.leadSource);
    }
  }, [initialLead]);

  // Handle lead picker change
  const handleSelectExistingLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setName(lead.name);
      setPhone(lead.phone);
      setAltPhone(lead.altPhone || '');
      setEmail(lead.email || '');
      setAddress(lead.address || '');
      setOccupation(lead.occupation);
      setEducation(lead.educationLevel);
      setInstitution(lead.institution || '');
      if (lead.interestedCourseId) setSelectedCourseId(lead.interestedCourseId);
      if (lead.interestedBatchId) setSelectedBatchId(lead.interestedBatchId);
      if (lead.preferredLearningMode) setLearningMode(lead.preferredLearningMode);
      if (lead.counselorId) setCounselorId(lead.counselorId);
      if (lead.leadSource) setLeadSource(lead.leadSource);
    }
  };

  if (!isOpen) return null;

  const currentBatch = batches.find(b => b.id === selectedBatchId);
  const enrolledInBatch = admissions.filter(a => a.batchId === selectedBatchId).length;
  const isBatchFull = currentBatch ? enrolledInBatch >= currentBatch.seatCapacity : false;

  const finalFee = Math.max(0, regularFee - (discount || 0) - (scholarship || 0));
  const due = Math.max(0, finalFee - (initialPaid || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !selectedCourseId || !selectedBatchId) {
      alert('Please fill all required student and course fields.');
      return;
    }

    try {
      const result = createAdmission({
        studentData: {
          name,
          phone,
          altPhone,
          email,
          address,
          occupation,
          education,
          bloodGroup,
          institution,
          guardianName,
          guardianPhone,
          studentGoal,
          learningMode,
          notes
        },
        courseId: selectedCourseId,
        batchId: selectedBatchId,
        counselorId,
        counselorName: counselorName.trim() || staffList.find(s => s.id === counselorId)?.name,
        leadSource,
        campaignId: campaignId || undefined,
        referral: referral || undefined,
        learningMode,
        admissionType,
        regularFee,
        discount,
        scholarship,
        initialPaidAmount: initialPaid,
        paymentMethod,
        transactionId: transactionId || undefined,
        nextPaymentDate: due > 0 ? nextPaymentDate : undefined,
        remarks,
        existingLeadId: selectedLeadId || undefined
      });

      onClose();
      if (onSuccessAdmission) {
        onSuccessAdmission(result.admission.id, result.payment?.receiptNumber);
      }
    } catch (err: any) {
      alert(`Error processing admission: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 shrink-0">
              <NexgenLogo variant="crest" size={36} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">New Student Admission Wizard</h3>
              <p className="text-xs text-indigo-200">
                Enroll student, assign batch, calculate scholarship, and collect admission deposit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Option: Convert Existing Lead */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-700 text-xs">
                Import / Convert from CRM Leads:
              </span>
            </div>
            <select
              value={selectedLeadId}
              onChange={e => handleSelectExistingLead(e.target.value)}
              className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72"
            >
              <option value="">-- Or Enter Fresh Student Details --</option>
              {leads.filter(l => l.status !== 'Admitted').map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.phone}) - {l.leadCode}
                </option>
              ))}
            </select>
          </div>

          {/* Section 1: Personal & Guardian Details */}
          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4 text-indigo-600" />
              <span>1. Student Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sabbir Ahmed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alternative Phone</label>
                <input
                  type="text"
                  placeholder="+880 19..."
                  value={altPhone}
                  onChange={e => setAltPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {bloodGroupsList.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Occupation</label>
                <select
                  value={occupation}
                  onChange={e => setOccupation(e.target.value as OccupationType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                <label className="block text-slate-600 font-semibold mb-1">Student Goal</label>
                <select
                  value={studentGoal}
                  onChange={e => setStudentGoal(e.target.value as StudentGoal)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {studentGoalsList.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                  {!studentGoalsList.includes(studentGoal) && studentGoal && (
                    <option value={studentGoal}>{studentGoal}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Education Level</label>
                <select
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {educationLevelsList.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                  {!educationLevelsList.includes(education) && education && (
                    <option value={education}>{education}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Institution / College</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka City College"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Guardian Name & Relation</label>
                <input
                  type="text"
                  placeholder="e.g. Md. Rafiq (Father)"
                  value={guardianName}
                  onChange={e => setGuardianName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Guardian Phone Number</label>
                <input
                  type="text"
                  placeholder="+880 18..."
                  value={guardianPhone}
                  onChange={e => setGuardianPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="House, Road, Area, City (e.g. Mirpur-10, Dhaka)"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Course & Batch Selection */}
          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>2. Course, Batch & Counselor Assignment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-3">
              {/* Learning Delivery Mode (Offline / Online Live / Hybrid) */}
              <div className="sm:col-span-2 md:col-span-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <span>Learning Delivery Mode (ক্লাসের মাধ্যম):</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Choose whether this student will attend physical lab classes or online live sessions
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-indigo-200">
                  <button
                    type="button"
                    onClick={() => setLearningMode('Offline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      learningMode === 'Offline'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    🏢 Offline (Campus Lab)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLearningMode('Online Live')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      learningMode === 'Online Live'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    🌐 Online Live Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setLearningMode('Hybrid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      learningMode === 'Hybrid'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    🔄 Hybrid (Both)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Enrolling Course <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Regular: ৳{c.regularFee.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Assign Batch <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedBatchId}
                  onChange={e => setSelectedBatchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {batches
                    .filter(b => b.courseId === selectedCourseId || !selectedCourseId)
                    .map(b => {
                      const count = admissions.filter(a => a.batchId === b.id).length;
                      return (
                        <option key={b.id} value={b.id}>
                          {b.batchNumber} — {b.classDays} ({b.classTime}) [{count}/{b.seatCapacity} seats]
                        </option>
                      );
                    })}
                </select>
                {currentBatch && (
                  <div className="mt-1 text-[11px] flex items-center justify-between text-slate-500">
                    <span>Room: {currentBatch.room.split('—')[0]}</span>
                    <span className={isBatchFull ? 'text-rose-600 font-bold' : 'text-emerald-600 font-semibold'}>
                      {enrolledInBatch} / {currentBatch.seatCapacity} filled
                    </span>
                  </div>
                )}
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
                  list="new-admission-counselors-list"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <datalist id="new-admission-counselors-list">
                  {staffList.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role.replace('_', ' ')})
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={e => setLeadSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                <label className="block text-slate-600 font-semibold mb-1">Linked Ad Campaign</label>
                <select
                  value={campaignId}
                  onChange={e => setCampaignId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- None / Organic --</option>
                  {campaigns.map(cmp => (
                    <option key={cmp.id} value={cmp.id}>
                      {cmp.name} ({cmp.platform})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Referral Student / Code</label>
                <input
                  type="text"
                  placeholder="e.g. NCA-STU-2026-009"
                  value={referral}
                  onChange={e => setReferral(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Payment Calculation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>3. Fee Calculation & Initial Collection</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Regular Course Fee (৳)</label>
                <input
                  type="number"
                  value={regularFee}
                  onChange={e => setRegularFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">General Discount (৳)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Scholarship (৳)</label>
                <input
                  type="number"
                  value={scholarship}
                  onChange={e => setScholarship(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 flex flex-col justify-center">
                <span className="text-[11px] text-indigo-700 font-semibold">Final Payable Fee:</span>
                <span className="text-lg font-black text-indigo-950">৳{finalFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Collection Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-4 pt-3 border-t border-slate-200">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Today's Deposit / Paid (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={initialPaid}
                  onChange={e => setInitialPaid(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-400 rounded-lg px-3 py-2 text-emerald-900 font-black text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold outline-none"
                >
                  {paymentMethodsList.map(pm => (
                    <option key={pm} value={pm}>{pm}</option>
                  ))}
                  {!paymentMethodsList.includes(paymentMethod) && paymentMethod && (
                    <option value={paymentMethod}>{paymentMethod}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">TrxID / Bank Slip #</label>
                <input
                  type="text"
                  placeholder="e.g. BK9X8821"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium outline-none"
                />
              </div>

              <div className={`border rounded-xl p-2.5 flex flex-col justify-center ${due > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className="text-[11px] font-semibold text-slate-600">Remaining Due:</span>
                <span className={`text-base font-black ${due > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                  ৳{due.toLocaleString()} {due === 0 && '✓ (Full Paid)'}
                </span>
              </div>
            </div>

            {due > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-amber-900 font-semibold mb-1">
                    Due Commitment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={nextPaymentDate}
                    onChange={e => setNextPaymentDate(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Notes / Installment Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd installment of ৳3,000 on 25th August"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Admission & Generate Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
