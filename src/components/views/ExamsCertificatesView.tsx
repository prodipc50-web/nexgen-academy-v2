import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Exam, Certificate } from '../../types';
import {
  Award,
  PlusCircle,
  Search,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Calendar,
  FileCheck,
  X,
  Trash2,
  AlertTriangle,
  Edit3
} from 'lucide-react';

interface ExamsCertificatesViewProps {
  onOpenCertificateModal: (certificateNumber: string) => void;
}

export const ExamsCertificatesView: React.FC<ExamsCertificatesViewProps> = ({
  onOpenCertificateModal
}) => {
  const {
    exams,
    certificates,
    courses,
    batches,
    students,
    admissions,
    addExam,
    deleteExam,
    issueCertificate,
    deleteCertificate
  } = useAcademy();

  const [activeSubTab, setActiveSubTab] = useState<'certificates' | 'exams' | 'verify'>('certificates');
  const [verifySerial, setVerifySerial] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null | 'not_found'>(null);
  const [deletingCert, setDeletingCert] = useState<{ id: string; code: string; studentName?: string } | null>(null);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);

  // Issue Certificate Form State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [grade, setGrade] = useState<'A+' | 'A' | 'B+' | 'B' | 'Passed'>('A+');
  const [certificateSerial, setCertificateSerial] = useState(`NCA-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifySerial.trim()) return;
    const found = certificates.find(
      c => (c.certificateCode || c.certificateNumber || '').toLowerCase() === verifySerial.trim().toLowerCase()
    );
    setVerificationResult(found || 'not_found');
  };

  const handleIssueCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentAdmission = admissions.find(a => a.studentId === selectedStudentId && a.courseId === selectedCourseId) || admissions.find(a => a.studentId === selectedStudentId);
    const batchId = studentAdmission?.batchId || batches[0]?.id || 'b-01';

    issueCertificate({
      studentId: selectedStudentId,
      courseId: selectedCourseId,
      batchId,
      grade,
      completionDate: new Date().toISOString().split('T')[0],
      certificateNumber: certificateSerial
    });
    setIsIssueModalOpen(false);
    onOpenCertificateModal(certificateSerial);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Exams, Marks & Certificate Verification
            </h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {certificates.length} Issued Certificates
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Schedule course assessments, record final grades, issue certified credentials, and verify student authenticity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-6">
        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'certificates'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Issued Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exams')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'exams'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Examinations & Assessments ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('verify')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'verify'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Public Certificate Verification</span>
        </button>
      </div>

      {/* TAB 1: CERTIFICATES LIST */}
      {activeSubTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Certificate Serial #</th>
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Course Program</th>
                  <th className="py-3 px-4">Grade Achieved</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map(cert => {
                  const student = students.find(s => s.id === cert.studentId);
                  const course = courses.find(c => c.id === cert.courseId);
                  const certCode = cert.certificateCode || cert.certificateNumber || '';

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {certCode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student?.studentCode}</div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {course?.name}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full text-xs">
                          {cert.grade}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">{cert.issueDate}</td>

                      <td className="py-3 px-4">
                        <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{cert.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenCertificateModal(certCode)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-lg text-xs flex items-center space-x-1 border border-indigo-200 shadow-2xs transition-colors"
                            title="Edit & Customize Certificate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onOpenCertificateModal(certCode)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-2xs transition-colors"
                            title="Print Official Certificate"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                          <button
                            onClick={() => {
                              setDeletingCert({
                                id: cert.id,
                                code: certCode,
                                studentName: student?.name
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            title="Delete Certificate & Move to Recycle Bin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EXAMS LIST */}
      {activeSubTab === 'exams' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Course & Batch</th>
                  <th className="py-3 px-4">Exam Date</th>
                  <th className="py-3 px-4">Total Marks</th>
                  <th className="py-3 px-4">Pass Marks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.map(exam => {
                  const course = courses.find(c => c.id === exam.courseId);
                  const batch = batches.find(b => b.id === exam.batchId);

                  return (
                    <tr key={exam.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{exam.title}</td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold">{course?.name}</div>
                        <div className="text-[10px] text-slate-400">Batch #{batch?.batchNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{exam.examDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{exam.totalMarks}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{exam.passMarks}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setDeletingExam(exam)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="Delete Exam & Move to Recycle Bin"
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
      )}

      {/* TAB 3: VERIFY PORTAL */}
      {activeSubTab === 'verify' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Certificate Authentication Portal</h3>
            <p className="text-xs text-slate-500">
              Verify credentials issued by Nexgen Computer Academy
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter Certificate Serial Number (e.g. NCA-CERT-2025-9012)"
                value={verifySerial}
                onChange={e => setVerifySerial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Verify Certificate
            </button>
          </form>

          {/* Verification Output */}
          {verificationResult && verificationResult !== 'not_found' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Genuine Certificate!</span>
              </div>
              <div className="divide-y divide-emerald-100 text-[11px] pt-1">
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">
                    {students.find(s => s.id === verificationResult.studentId)?.name}
                  </span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-bold text-slate-900">
                    {courses.find(c => c.id === verificationResult.courseId)?.name}
                  </span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Grade:</span>
                  <span className="font-bold text-emerald-800">{verificationResult.grade}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Issue Date:</span>
                  <span className="font-bold text-slate-900">{verificationResult.issueDate}</span>
                </div>
              </div>
            </div>
          )}

          {verificationResult === 'not_found' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold text-center">
              ⚠️ No certificate found with this serial number. Please double check the ID.
            </div>
          )}
        </div>
      )}

      {/* Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-amber-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Issue Academy Certificate</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="p-1 rounded-lg text-amber-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course Program</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="A+">A+ (Distinction)</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B+">B+ (Very Good)</option>
                    <option value="B">B (Good)</option>
                    <option value="Passed">Passed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={certificateSerial}
                    onChange={e => setCertificateSerial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Issue & Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Certificate Confirmation Modal */}
      {deletingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Certificate</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete certificate <strong className="text-slate-900">#{deletingCert.code}</strong> {deletingCert.studentName ? `(${deletingCert.studentName})` : ''}? It can be restored anytime from the Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCertificate(deletingCert.id);
                  setDeletingCert(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Exam Confirmation Modal */}
      {deletingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Exam</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete exam <strong className="text-slate-900">"{deletingExam.title}"</strong> ({deletingExam.examDate})? All exam details will be safely preserved in the Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingExam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteExam(deletingExam.id);
                  setDeletingExam(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
