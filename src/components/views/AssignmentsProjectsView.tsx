import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Assignment, AssignmentSubmission } from '../../types';
import {
  FileCode2,
  FolderGit2,
  CheckCircle,
  Clock,
  Award,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  Users,
  AlertTriangle,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const AssignmentsProjectsView: React.FC = () => {
  const {
    assignments,
    assignmentSubmissions,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeAssignmentSubmission,
    batches,
    courses,
    students
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [targetAssignmentId, setTargetAssignmentId] = useState('');
  const [submitStudentId, setSubmitStudentId] = useState('');
  const [submitProjectUrl, setSubmitProjectUrl] = useState('');
  const [submitGithubUrl, setSubmitGithubUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');

  // Form State for Assignment Creation
  const [formBatchId, setFormBatchId] = useState(batches[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [formMaxMarks, setFormMaxMarks] = useState<number>(100);
  const [formMaterialsUrl, setFormMaterialsUrl] = useState('');

  const filteredAssignments = assignments.filter(a => {
    const matchesBatch = selectedBatch === 'All' || a.batchId === selectedBatch;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(a.batchNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const filteredSubmissions = assignmentSubmissions.filter(sub => {
    const matchesSearch =
      String(sub.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sub.studentCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenAddAssignment = () => {
    setEditingAssignment(null);
    if (batches.length > 0) setFormBatchId(batches[0].id);
    setFormTitle('');
    setFormDescription('');
    setFormDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setFormMaxMarks(100);
    setFormMaterialsUrl('');
    setIsAddAssignmentOpen(true);
  };

  const handleOpenEditAssignment = (a: Assignment) => {
    setEditingAssignment(a);
    setFormBatchId(a.batchId);
    setFormTitle(a.title);
    setFormDescription(a.description || '');
    setFormDueDate(a.dueDate);
    setFormMaxMarks(a.maxMarks);
    setFormMaterialsUrl(a.materialsUrl || '');
    setIsAddAssignmentOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const selBatch = batches.find(b => b.id === formBatchId);
    const selCourse = courses.find(c => c.id === selBatch?.courseId);

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        batchId: formBatchId,
        batchNumber: selBatch?.batchNumber || 'NCA-01',
        courseId: selBatch?.courseId || '',
        courseName: selCourse?.name || '',
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate,
        maxMarks: formMaxMarks,
        materialsUrl: formMaterialsUrl
      });
    } else {
      addAssignment({
        batchId: formBatchId,
        batchNumber: selBatch?.batchNumber || 'NCA-01',
        courseId: selBatch?.courseId || '',
        courseName: selCourse?.name || '',
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate,
        maxMarks: formMaxMarks,
        materialsUrl: formMaterialsUrl
      });
    }
    setIsAddAssignmentOpen(false);
  };

  const handleConfirmDeleteAssignment = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      setAssignmentToDelete(null);
    }
  };

  const handleOpenGrade = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.marksObtained || 85);
    setGradeFeedback(sub.feedback || 'Excellent project structure and clean UI implementation.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingSubmission) {
      gradeAssignmentSubmission(gradingSubmission.id, gradeMarks, gradeFeedback);
      setGradingSubmission(null);
    }
  };

  const handleOpenSubmitPortal = (assignmentId?: string) => {
    setTargetAssignmentId(assignmentId || assignments[0]?.id || '');
    if (students.length > 0) setSubmitStudentId(students[0].id);
    setSubmitProjectUrl('');
    setSubmitGithubUrl('');
    setSubmitNotes('');
    setIsSubmitModalOpen(true);
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const selStudent = students.find(s => s.id === submitStudentId);
    if (!selStudent || !targetAssignmentId) return;

    submitAssignment({
      assignmentId: targetAssignmentId,
      studentId: selStudent.id,
      studentName: selStudent.name,
      studentCode: selStudent.studentCode,
      projectUrl: submitProjectUrl,
      githubUrl: submitGithubUrl,
      notes: submitNotes,
      status: 'Submitted'
    });
    setIsSubmitModalOpen(false);
    setActiveTab('submissions');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-950/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Project & Portfolio Quality Center</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Assignment & Capstone Project Tracker
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Manage lab tasks, GitHub repositories, live Behance/Vercel projects, and provide automated grading and instant trainer feedback.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenSubmitPortal()}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Submit Project</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddAssignment}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Assignments</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{assignments.length}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold">Across {batches.length} Batches</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Submissions</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{assignmentSubmissions.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {assignmentSubmissions.filter(s => s.status === 'Graded').length} Graded
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {assignmentSubmissions.filter(s => s.status === 'Submitted').length}
            </h3>
            <p className="text-[11px] text-amber-600 font-semibold">Needs Evaluation</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Score</p>
            <h3 className="text-2xl font-extrabold text-slate-900">89.2%</h3>
            <p className="text-[11px] text-violet-600 font-semibold">High Quality Work</p>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all ${
              activeTab === 'assignments' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assignments List ({assignments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all ${
              activeTab === 'submissions' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Submissions ({assignmentSubmissions.length})
          </button>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments or students..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {activeTab === 'assignments' && (
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="All">All Batches</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.batchNumber}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* VIEW: ASSIGNMENTS LIST */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(a => {
            const subs = assignmentSubmissions.filter(s => s.assignmentId === a.id);
            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Batch {a.batchNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Max: {a.maxMarks} Pts</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2">{a.title}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{a.courseName}</p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {a.description || 'No detailed instructions provided.'}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Due: {a.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{subs.length} Submitted</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenSubmitPortal(a.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Submit Solution
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAssignment(a)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignmentToDelete(a)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: SUBMISSIONS LIST */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Assignment</th>
                  <th className="py-3 px-4">Project Links</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Marks & Feedback</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubmissions.map(sub => {
                  const assign = assignments.find(a => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{sub.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{sub.studentCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{assign?.title || 'Assignment Task'}</div>
                        <div className="text-[11px] text-slate-400">{assign?.batchNumber}</div>
                      </td>
                      <td className="py-3 px-4 space-y-1">
                        {sub.projectUrl && (
                          <a
                            href={sub.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-indigo-600 hover:underline font-medium text-[11px] block"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {sub.githubUrl && (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-slate-700 hover:underline font-medium text-[11px] block"
                          >
                            <FolderGit2 className="w-3 h-3" />
                            <span>Source Code</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{sub.submittedAt}</td>
                      <td className="py-3 px-4">
                        {sub.marksObtained !== undefined ? (
                          <div>
                            <span className="font-extrabold text-emerald-600 text-sm">
                              {sub.marksObtained} / {assign?.maxMarks || 100}
                            </span>
                            {sub.feedback && (
                              <p className="text-[10px] text-slate-500 italic max-w-xs truncate">
                                "{sub.feedback}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-500 italic font-semibold">Not graded yet</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sub.status === 'Graded'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenGrade(sub)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition-colors"
                        >
                          Grade / Review
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

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAssignmentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Batch *</label>
                <select
                  value={formBatchId}
                  onChange={e => setFormBatchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} ({b.room})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building an E-commerce Cart in React"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={formMaxMarks}
                    onChange={e => setFormMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Starter Files / Resource URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  value={formMaterialsUrl}
                  onChange={e => setFormMaterialsUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Mention key criteria, technologies to use, and delivery expectations..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE & EVALUATE MODAL */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Grade Project Submission</h3>
                <p className="text-xs text-slate-500">
                  {gradingSubmission.studentName} ({gradingSubmission.studentCode})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Score Obtained (Marks)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeMarks}
                  onChange={e => setGradeMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-base text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Trainer Feedback & Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide constructive feedback on code quality, design, and areas of improvement..."
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION PORTAL MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Submit Assignment / Capstone</h3>
            <p className="text-xs text-slate-500 mb-4">Record student submission with live demo links and repository.</p>

            <form onSubmit={handleSaveSubmission} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assignment *</label>
                <select
                  value={targetAssignmentId}
                  onChange={e => setTargetAssignmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.batchNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Student *</label>
                <select
                  value={submitStudentId}
                  onChange={e => setSubmitStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Live Demo / Deployment URL</label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app or https://behance.net/..."
                  value={submitProjectUrl}
                  onChange={e => setSubmitProjectUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">GitHub / Source Code Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={submitGithubUrl}
                  onChange={e => setSubmitGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Highlights</label>
                <textarea
                  rows={2}
                  placeholder="Features built, packages used..."
                  value={submitNotes}
                  onChange={e => setSubmitNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Assignment?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <strong>{assignmentToDelete.title}</strong>? It will be moved to the Recycle Bin.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setAssignmentToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAssignment}
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
