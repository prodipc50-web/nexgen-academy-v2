import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, CourseStatus } from '../../types';
import {
  X,
  BookOpen,
  Layers,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  GraduationCap,
  Copy,
  Edit,
  Archive,
  AlertCircle,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface CourseDetailsAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEditCourse: (course: Course) => void;
  onDuplicateCourse?: (courseId: string) => void;
}

type DetailTab = 'curriculum' | 'batches' | 'students' | 'specs' | 'analytics';

export const CourseDetailsAnalyticsModal: React.FC<CourseDetailsAnalyticsModalProps> = ({
  isOpen,
  onClose,
  course,
  onEditCourse,
  onDuplicateCourse
}) => {
  const { batches, admissions, students, payments, leads, staffList, setCourseStatus } = useAcademy();
  const [activeTab, setActiveTab] = useState<DetailTab>('curriculum');
  const [expandedModules, setExpandedModules] = useState<{ [id: string]: boolean }>({});
  const [statusToast, setStatusToast] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  // Connected records
  const courseBatches = batches.filter(b => b.courseId === course.id);
  const courseAdmissions = admissions.filter(a => a.courseId === course.id);
  const courseLeads = leads.filter(l => l.interestedCourseId === course.id);

  // Admitted student details
  const courseStudentIds = new Set(courseAdmissions.map(a => a.studentId));
  const courseStudents = students.filter(s => courseStudentIds.has(s.id));

  const activeStudentsCount = courseStudents.filter(s => s.status === 'Active').length;
  const completedStudentsCount = courseStudents.filter(s => s.status === 'Completed' || s.status === 'Alumni').length;
  const droppedStudentsCount = courseStudents.filter(s => s.status === 'Dropped').length;

  // Financials for this course
  const totalCourseRevenue = courseAdmissions.reduce((sum, a) => sum + (a.totalPaid || 0), 0);
  const totalCourseDue = courseAdmissions.reduce((sum, a) => sum + (a.due || 0), 0);
  const totalAgreedFee = courseAdmissions.reduce((sum, a) => sum + (a.finalFee || 0), 0);

  // Conversion rate
  const totalInteractions = courseLeads.length + courseAdmissions.length;
  const conversionRate =
    totalInteractions > 0 ? Math.round((courseAdmissions.length / totalInteractions) * 100) : 0;

  // Assigned trainers
  const assignedFaculty = staffList.filter(
    s => (course.trainerIds && course.trainerIds.includes(s.id)) || s.id === course.trainerId
  );

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleStatusChange = (newStatus: CourseStatus) => {
    setCourseStatus(course.id, newStatus);
    setStatusToast(`Status changed to ${newStatus}`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header & Hero Banner */}
        <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-radial from-indigo-500 to-transparent pointer-events-none" />

          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">{course.code}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        course.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : course.status === 'Draft'
                          ? 'bg-amber-500/20 text-amber-300'
                          : course.status === 'Archived'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white tracking-tight">{course.name}</h2>
                  <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">{course.description}</p>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onEditCourse(course)}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {onDuplicateCourse && (
                  <button
                    onClick={() => onDuplicateCourse(course.id)}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
                    title="Duplicate Course"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Toast */}
            {statusToast && (
              <div className="mt-3 p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{statusToast}</span>
              </div>
            )}

            {/* Top KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-5">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Enrolled</span>
                <span className="text-base font-black text-white">{courseAdmissions.length} Students</span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Active Batches</span>
                <span className="text-base font-black text-indigo-400">{courseBatches.length} Batches</span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Course Duration</span>
                <span className="text-base font-black text-white">{course.duration}</span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Classes / Hours</span>
                <span className="text-base font-black text-white">
                  {course.totalClasses} S ({course.totalHours || course.totalClasses * 2}h)
                </span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Collected Revenue</span>
                <span className="text-base font-black text-emerald-400">৳{totalCourseRevenue.toLocaleString()}</span>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Outstanding Due</span>
                <span className="text-base font-black text-rose-400">৳{totalCourseDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum & Modules ({course.modules?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'batches'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Connected Batches ({courseBatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enrolled Students ({courseAdmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Prerequisites & Features</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Course Analytics</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: CURRICULUM & MODULES */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Course Syllabus & Modular Breakdown</h4>
                  <p className="text-slate-500 text-[11px]">
                    Structured learning plan, topic depth, and expected outputs
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {course.modules?.length || 0} Modules • {course.totalClasses} Total Lectures
                </span>
              </div>

              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map(mod => {
                    const isExpanded = expandedModules[mod.id] ?? true;
                    return (
                      <div
                        key={mod.id}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div
                          onClick={() => toggleModuleAccordion(mod.id)}
                          className="p-4 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                              {mod.moduleNumber}
                            </span>
                            <div>
                              <h5 className="text-sm font-bold text-slate-900">{mod.moduleName}</h5>
                              {mod.moduleDescription && (
                                <p className="text-[11px] text-slate-500 mt-0.5">{mod.moduleDescription}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                              {mod.estimatedClasses || 6} Classes
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-3 border-t border-slate-100">
                            {/* Topics List */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Topics & Hands-on Labs ({mod.topics?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {mod.topics?.map((topic, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200/80"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Learning Outcomes */}
                            {mod.learningOutcomes && mod.learningOutcomes.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                  Deliverables & Practical Outcomes
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {mod.learningOutcomes.map((outcome, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className="flex items-start space-x-2 bg-emerald-50/70 p-2 rounded-lg text-emerald-900 text-[11px]"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span className="font-medium">{outcome}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                  <h5 className="font-bold text-slate-700">No modular curriculum detailed yet</h5>
                  <p className="text-slate-500 text-xs">
                    Click "Edit" to configure curriculum modules and topic details.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONNECTED BATCHES */}
          {activeTab === 'batches' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Active & Upcoming Batches</h4>
                  <p className="text-slate-500 text-[11px]">
                    All batch schedules running or planned for this course
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600">{courseBatches.length} Total Batches</span>
              </div>

              {courseBatches.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Batch Number</th>
                        <th className="p-3">Trainer</th>
                        <th className="p-3">Days & Time</th>
                        <th className="p-3">Start Date</th>
                        <th className="p-3">Enrolled</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courseBatches.map(batch => {
                        const batchEnrolled = admissions.filter(a => a.batchId === batch.id).length;
                        const trainer = staffList.find(s => s.id === batch.trainerId);

                        return (
                          <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{batch.batchNumber}</span>
                              <span className="text-[10px] text-slate-400">{batch.room || 'Room 1'}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-800">{trainer?.name || 'Assigned Staff'}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-700 block">
                                {batch.classDays}
                              </span>
                              <span className="text-[10px] text-slate-400">{batch.classTime}</span>
                            </td>
                            <td className="p-3 font-semibold text-slate-700">{batch.startDate}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900">{batchEnrolled}</span>
                              <span className="text-slate-400"> / {batch.seatCapacity} Seats</span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  batch.status === 'Ongoing'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : batch.status === 'Upcoming'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {batch.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                  <h5 className="font-bold text-slate-700">No batches created for this course yet</h5>
                  <p className="text-slate-500 text-xs">
                    Go to Batches section to create a new schedule for this course.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENROLLED STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Admitted Students Directory</h4>
                  <p className="text-slate-500 text-[11px]">
                    All students registered in batches of this course
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {activeStudentsCount} Active
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {completedStudentsCount} Alumni
                  </span>
                </div>
              </div>

              {courseAdmissions.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Batch</th>
                        <th className="p-3">Admission Date</th>
                        <th className="p-3">Total Fee</th>
                        <th className="p-3">Paid (৳)</th>
                        <th className="p-3">Due (৳)</th>
                        <th className="p-3">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courseAdmissions.map(adm => {
                        const student = students.find(s => s.id === adm.studentId);
                        const batch = batches.find(b => b.id === adm.batchId);

                        return (
                          <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{student?.name || 'Student'}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{student?.studentCode || adm.studentId}</span>
                            </td>
                            <td className="p-3 font-semibold text-slate-700">{batch?.batchNumber || 'Batch'}</td>
                            <td className="p-3 font-semibold text-slate-700">{adm.admissionDate}</td>
                            <td className="p-3 font-bold text-slate-900">৳{adm.finalFee.toLocaleString()}</td>
                            <td className="p-3 font-bold text-emerald-700">৳{adm.totalPaid.toLocaleString()}</td>
                            <td className="p-3 font-bold text-rose-700">৳{adm.due.toLocaleString()}</td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  adm.paymentStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : adm.paymentStatus === 'Partially Paid'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {adm.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <h5 className="font-bold text-slate-700">No students enrolled yet</h5>
                  <p className="text-slate-500 text-xs">
                    Students will appear here once registered via New Admission.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PREREQUISITES & SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic & Hardware Specs */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h5 className="font-bold text-slate-900 flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Academic & Technical Requirements</span>
                  </h5>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Skill Level:</span>
                      <span className="font-bold text-slate-800">{course.requiredSkillLevel || 'No Prior Knowledge'}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Minimum Education:</span>
                      <span className="font-bold text-slate-800">{course.minimumEducation || 'SSC / Equivalent'}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Recommended Age:</span>
                      <span className="font-bold text-slate-800">{course.recommendedAge || '16+ Years'}</span>
                    </div>

                    {course.previousCourse && (
                      <div className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">Prerequisite Course:</span>
                        <span className="font-bold text-indigo-700">{course.previousCourse}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1">Hardware & Software Specs:</span>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 font-medium">
                        {course.requiredSoftwareHardware || 'Standard computer with internet connectivity.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Audience & Trainers */}
                <div className="space-y-4">
                  {/* Target Audience */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Target Audience</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(course.targetAudience || ['General Students', 'Job Seekers']).map((aud, i) => (
                        <span
                          key={i}
                          className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[11px]"
                        >
                          {aud}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Faculty */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <h5 className="font-bold text-slate-900">Certified Trainers</h5>
                    <div className="space-y-2">
                      {assignedFaculty.map(f => (
                        <div key={f.id} className="flex items-center space-x-2.5 bg-white p-2 rounded-lg border border-slate-200">
                          <img
                            src={f.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={f.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">{f.name}</span>
                            <span className="text-[10px] text-slate-400">{f.designation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Features Grid */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Learning Features & Benefits Provided</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(course.learningFeatures || ['Live Class', 'Certificate']).map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center space-x-2 text-slate-800 font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COURSE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Lead-to-Admission Conversion
                  </span>
                  <div className="text-2xl font-black text-indigo-700">{conversionRate}%</div>
                  <span className="text-[11px] text-slate-500 block">
                    {courseAdmissions.length} admissions from {totalInteractions} inquiries
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Revenue Realization Rate
                  </span>
                  <div className="text-2xl font-black text-emerald-700">
                    {totalAgreedFee > 0 ? Math.round((totalCourseRevenue / totalAgreedFee) * 100) : 100}%
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    ৳{totalCourseRevenue.toLocaleString()} collected of ৳{totalAgreedFee.toLocaleString()} total
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total Active Students
                  </span>
                  <div className="text-2xl font-black text-slate-900">{activeStudentsCount}</div>
                  <span className="text-[11px] text-slate-500 block">
                    {completedStudentsCount} graduated alumni • {droppedStudentsCount} dropped
                  </span>
                </div>
              </div>

              {/* Status Action Switcher */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Change Program Status</span>
                <div className="flex flex-wrap gap-2">
                  {(['Active', 'Draft', 'Inactive', 'Archived'] as CourseStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                        course.status === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Archiving safely removes the course from active admission dropdowns while preserving all existing
                  student and payment histories.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Nexgen Dynamic Course Management Engine</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
