import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Student, StudentStatus, OccupationType, StudentGoal } from '../../types';
import { NexgenLogo } from '../common/NexgenLogo';
import { IdCardAdmitCardModal } from './IdCardAdmitCardModal';
import {
  X,
  GraduationCap,
  CreditCard,
  Calendar,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit3,
  Save,
  Check,
  Trash2,
  AlertTriangle,
  QrCode
} from 'lucide-react';

interface StudentProfileModalProps {
  studentId: string | null;
  onClose: () => void;
  onOpenCollectPayment: (admissionId: string) => void;
  onOpenReceiptModal: (receiptNumber: string) => void;
  onOpenCertificateModal: (certificateNumber: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  studentId,
  onClose,
  onOpenCollectPayment,
  onOpenReceiptModal,
  onOpenCertificateModal
}) => {
  const {
    students,
    admissions,
    courses,
    batches,
    payments,
    attendance,
    certificates,
    exams,
    updateStudent,
    deleteStudent,
    deleteCertificate,
    deleteAttendance,
    occupationsList,
    educationLevelsList,
    studentGoalsList,
    studentStatusesList,
    bloodGroupsList
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'attendance' | 'academic'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<StudentStatus>('Active');
  const [editOccupation, setEditOccupation] = useState<OccupationType>('Student');
  const [editEducation, setEditEducation] = useState('HSC');
  const [editBloodGroup, setEditBloodGroup] = useState('A+');
  const [editAddress, setEditAddress] = useState('');
  const [editGuardianName, setEditGuardianName] = useState('');
  const [editGuardianPhone, setEditGuardianPhone] = useState('');
  const [editGoal, setEditGoal] = useState<StudentGoal>('Freelancing');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const student = studentId ? students.find(s => s.id === studentId) : null;

  useEffect(() => {
    if (student) {
      setEditName(student.name);
      setEditPhone(student.phone);
      setEditEmail(student.email || '');
      setEditStatus(student.status);
      setEditOccupation(student.occupation as OccupationType || occupationsList[0] || 'Student');
      setEditEducation(student.education || educationLevelsList[0] || 'HSC');
      setEditBloodGroup(student.bloodGroup || bloodGroupsList[0] || 'A+');
      setEditAddress(student.address || '');
      setEditGuardianName(student.guardianName || '');
      setEditGuardianPhone(student.guardianPhone || '');
      setEditGoal(student.studentGoal as StudentGoal || studentGoalsList[0] || 'Freelancing');
      setIsEditing(false);
    }
  }, [studentId, student]);

  if (!studentId || !student) return null;

  const admission = admissions.find(a => a.studentId === student.id);
  const course = courses.find(c => c.id === admission?.courseId);
  const batch = batches.find(b => b.id === admission?.batchId);
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentCertificates = certificates.filter(c => c.studentId === student.id);

  // Attendance stats
  const totalClasses = studentAttendance.length;
  const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  const handleSaveStudent = () => {
    if (!editName.trim() || !editPhone.trim()) {
      alert('Student name and phone cannot be empty.');
      return;
    }
    updateStudent(student.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      status: editStatus,
      occupation: editOccupation,
      education: editEducation,
      bloodGroup: editBloodGroup,
      address: editAddress.trim() || undefined,
      guardianName: editGuardianName.trim() || undefined,
      guardianPhone: editGuardianPhone.trim() || undefined,
      studentGoal: editGoal
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Profile Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-16 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
            <NexgenLogo variant="crest" size={100} />
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            <img
              src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black">{student.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {student.status}
                </span>
              </div>
              <div className="text-xs text-indigo-200/90 font-mono mt-0.5">
                ID: {student.studentCode} • Joined: {student.admissionDate}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {course?.name} ({batch ? `Batch #${batch.batchNumber}` : 'No Batch'})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative z-10">
            <button
              type="button"
              onClick={() => setIsIdCardModalOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center space-x-1.5 backdrop-blur-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-300" />
              <span>ID & Admit Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 text-xs font-bold space-x-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Details
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'payments' ? 'border-indigo-600 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Financial Ledger ({studentPayments.length})
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'attendance' ? 'border-indigo-600 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Attendance ({attendanceRate}%)
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'academic' ? 'border-indigo-600 text-indigo-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Certificates & Exams
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Financial Quick Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block">Course Fee</span>
                  <span className="text-base font-black text-slate-900">
                    ৳{admission?.finalFee.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] block">Total Paid</span>
                  <span className="text-base font-black text-emerald-950">
                    ৳{admission?.totalPaid.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="text-rose-700 text-[10px] block">Outstanding Due</span>
                    <span className="text-base font-black text-rose-950">
                      ৳{admission?.due.toLocaleString() || '0'}
                    </span>
                  </div>
                  {admission && admission.due > 0 && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCollectPayment(admission.id);
                      }}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                    >
                      Collect
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Info Grid & Edit Mode */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Personal & Academic Details</h4>
                  <div className="flex items-center space-x-2">
                    {saveSuccess && (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (isEditing) handleSaveStudent();
                        else setIsEditing(true);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 ${
                        isEditing
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </>
                      )}
                    </button>
                    {isEditing && (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors flex items-center space-x-1"
                      title="Remove Student & Send to Recycle Bin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Delete Student Confirmation Dialog */}
                {showDeleteConfirm && (
                  <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-start space-x-2 text-rose-900 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div>Are you sure you want to remove <span className="underline">{student.name}</span>?</div>
                        <p className="text-[11px] text-rose-700 font-normal mt-0.5">
                          This student profile and associated admission records will be moved to the <strong>Recycle Bin</strong> where they can be restored at any time.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 justify-end pt-1">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          deleteStudent(student.id);
                          onClose();
                        }}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Confirm Move to Recycle Bin</span>
                      </button>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Student Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Student Status</label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as StudentStatus)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {studentStatusesList.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                        {!studentStatusesList.includes(editStatus) && editStatus && (
                          <option value={editStatus}>{editStatus}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Occupation</label>
                      <select
                        value={editOccupation}
                        onChange={e => setEditOccupation(e.target.value as OccupationType)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {occupationsList.map(occ => (
                          <option key={occ} value={occ}>{occ}</option>
                        ))}
                        {!occupationsList.includes(editOccupation) && editOccupation && (
                          <option value={editOccupation}>{editOccupation}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Education Level</label>
                      <select
                        value={editEducation}
                        onChange={e => setEditEducation(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {educationLevelsList.map(edu => (
                          <option key={edu} value={edu}>{edu}</option>
                        ))}
                        {!educationLevelsList.includes(editEducation) && editEducation && (
                          <option value={editEducation}>{editEducation}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Blood Group</label>
                      <select
                        value={editBloodGroup}
                        onChange={e => setEditBloodGroup(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {bloodGroupsList.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                        {!bloodGroupsList.includes(editBloodGroup) && editBloodGroup && (
                          <option value={editBloodGroup}>{editBloodGroup}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Career Goal / Objective</label>
                      <select
                        value={editGoal}
                        onChange={e => setEditGoal(e.target.value as StudentGoal)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {studentGoalsList.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                        {!studentGoalsList.includes(editGoal) && editGoal && (
                          <option value={editGoal}>{editGoal}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Guardian Name</label>
                      <input
                        type="text"
                        value={editGuardianName}
                        onChange={e => setEditGuardianName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Guardian Phone</label>
                      <input
                        type="text"
                        value={editGuardianPhone}
                        onChange={e => setEditGuardianPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-slate-500 block text-[10px] font-bold mb-1">Present Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={e => setEditAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone</span>
                      <span className="font-semibold">{student.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="font-semibold">{student.email || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Guardian Name & Phone</span>
                      <span className="font-semibold">
                        {student.guardianName || '-'} ({student.guardianPhone || '-'})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Education & Occupation</span>
                      <span className="font-semibold">
                        {student.education || '-'} • {student.occupation || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Blood Group</span>
                      <span className="font-semibold">{student.bloodGroup || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Career Goal</span>
                      <span className="font-semibold">{student.studentGoal || '-'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Present Address</span>
                      <span className="font-semibold">{student.address || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL LEDGER */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">Payment Receipts History</h4>
                {admission && admission.due > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCollectPayment(admission.id);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    + Collect Installment
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-right">Print</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{p.receiptNumber}</td>
                        <td className="py-2.5 px-3 text-slate-500">{p.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{p.paymentMethod}</td>
                        <td className="py-2.5 px-3 font-black text-emerald-700">৳{p.amount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenReceiptModal(p.receiptNumber);
                            }}
                            className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded text-[11px]"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}

                    {studentPayments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No payment receipts recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">Class Attendance Record</h4>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Overall Rate: {attendanceRate}%
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Remark / Note</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.map(att => (
                      <tr key={att.id}>
                        <td className="py-2 px-3 font-medium">{att.date}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : att.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{att.note || '-'}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => {
                              deleteAttendance(att.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Attendance & Move to Recycle Bin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {studentAttendance.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          No attendance sessions logged for this student yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACADEMIC & CERTIFICATES */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs">Certifications & Assessment Results</h4>

              <div className="space-y-3">
                {studentCertificates.map(c => {
                  const certCode = c.certificateCode || c.certificateNumber || '';
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-slate-900">{course?.name}</span>
                          <span className="font-black text-amber-900 bg-amber-200/70 px-2 py-0.2 rounded text-[10px]">
                            Grade {c.grade}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Serial: {certCode} • Issued: {c.issueDate}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenCertificateModal(certCode);
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Certificate</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteCertificate(c.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors"
                          title="Remove Certificate & Move to Recycle Bin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {studentCertificates.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400">
                    <Award className="w-8 h-8 mx-auto mb-1 opacity-30" />
                    <span>No certificate has been issued for this student yet.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ID Card & Admit Card Generator Modal */}
      <IdCardAdmitCardModal
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        student={student}
        course={course}
        batch={batch}
      />
    </div>
  );
};
