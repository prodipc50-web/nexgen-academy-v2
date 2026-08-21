import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { StudentStatus, Student } from '../../types';
import { exportAllStudentsSpreadsheet } from '../../utils/spreadsheetExport';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Filter,
  CreditCard,
  Eye,
  Phone,
  Calendar,
  BookOpen,
  ArrowRightLeft,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface StudentsViewProps {
  onOpenNewAdmission: () => void;
  onSelectStudent: (studentId: string) => void;
  onOpenCollectPayment: (admissionId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenNewAdmission,
  onSelectStudent,
  onOpenCollectPayment
}) => {
  const { students, admissions, courses, batches, deleteStudent } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const adm = admissions.find(a => a.studentId === student.id);
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || adm?.courseId === courseFilter;
    const matchesBatch = batchFilter === 'all' || adm?.batchId === batchFilter;
    return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Student Directory & Enrollment Hub
            </h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              {students.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search student profiles, view financial balances, track attendance, and manage batch assignments
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => exportAllStudentsSpreadsheet(filteredStudents, admissions, courses, batches)}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
            title={`Export ${filteredStudents.length} Students to Excel Spreadsheet`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel / Spreadsheet ({filteredStudents.length})</span>
          </button>

          <button
            onClick={onOpenNewAdmission}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Student Admission</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, phone (+880...), student ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none"
        >
          <option value="all">All Student Statuses</option>
          <option value="Active">Active (Enrolled)</option>
          <option value="Completed">Completed</option>
          <option value="Alumni">Alumni</option>
          <option value="Dropped">Dropped Out</option>
          <option value="On Hold">On Hold</option>
        </select>

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
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
        >
          <option value="all">All Batches</option>
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              Batch #{b.batchNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Phone & Contacts</th>
                <th className="py-3 px-4">Enrolled Course & Batch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Fee Paid</th>
                <th className="py-3 px-4">Due Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const adm = admissions.find(a => a.studentId === student.id);
                const crs = courses.find(c => c.id === adm?.courseId);
                const batch = batches.find(b => b.id === adm?.batchId);

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {student.name}
                          </div>
                          <div className="font-mono text-[10px] text-indigo-600 font-bold">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold">{student.phone}</div>
                      <div className="text-[10px] text-slate-400">{student.occupation} • {student.education}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-bold">{crs?.name || 'No Course'}</div>
                      <div className="text-[11px] text-slate-500">
                        {batch ? `Batch #${batch.batchNumber} (${batch.classDays})` : 'No Batch Assigned'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : student.status === 'Completed' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-700">
                      ৳{adm?.totalPaid.toLocaleString() || '0'}
                    </td>

                    <td className="py-3 px-4">
                      {adm && adm.due > 0 ? (
                        <span className="font-black text-rose-600">
                          ৳{adm.due.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">
                          ✓ Paid
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Profile</span>
                      </button>

                      {adm && adm.due > 0 && (
                        <button
                          onClick={() => onOpenCollectPayment(adm.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] inline-flex items-center space-x-1 shadow-xs"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Collect</span>
                        </button>
                      )}

                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Student & Move to Recycle Bin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No students found matching current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Student Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Student</h3>
                <p className="text-[11px] text-slate-500">Move to Recycle Bin</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete student <strong className="text-slate-900">{deletingStudent.name}</strong> ({deletingStudent.studentCode})? All student profile, admissions, and due records will be safely archived to the Recycle Bin.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
