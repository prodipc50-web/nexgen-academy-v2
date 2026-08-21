import React, { useState, useMemo } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, CourseStatus } from '../../types';
import { CourseFormModal } from '../courses/CourseFormModal';
import { CourseDetailsAnalyticsModal } from '../courses/CourseDetailsAnalyticsModal';
import { CategoryManagerModal } from '../courses/CategoryManagerModal';
import {
  BookOpen,
  PlusCircle,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Tag
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const {
    courses,
    batches,
    admissions,
    categories,
    duplicateCourse,
    setCourseStatus,
    deleteCourse
  } = useAcademy();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeMenuCourseId, setActiveMenuCourseId] = useState<string | null>(null);
  const [actionNotification, setActionNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setActionNotification({ message, type });
    setTimeout(() => setActionNotification(null), 4000);
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.shortName && course.shortName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.modules && course.modules.some(m => m.moduleName.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'ALL'
          ? course.status !== 'Archived' // Default: hide archived unless explicitly chosen
          : course.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchTerm, selectedCategory, selectedStatus]);

  // Handler functions
  const handleOpenCreate = () => {
    setEditingCourse(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormModalOpen(true);
    setActiveMenuCourseId(null);
  };

  const handleOpenDetails = (course: Course) => {
    setSelectedCourseForDetails(course);
    setIsDetailsModalOpen(true);
    setActiveMenuCourseId(null);
  };

  const handleDuplicate = (courseId: string) => {
    try {
      const duplicated = duplicateCourse(courseId);
      showNotification(`Duplicated course created as "${duplicated.name}" (${duplicated.code}) in Draft status.`);
      setActiveMenuCourseId(null);
    } catch (e) {
      showNotification('Failed to duplicate course', 'warning');
    }
  };

  const handleToggleStatus = (course: Course) => {
    const nextStatus: CourseStatus = course.status === 'Active' ? 'Inactive' : 'Active';
    setCourseStatus(course.id, nextStatus);
    showNotification(`Course status changed to ${nextStatus}.`);
    setActiveMenuCourseId(null);
  };

  const handleDelete = (course: Course) => {
    const res = deleteCourse(course.id);
    if (res.archivedInstead) {
      showNotification(
        `Course "${course.name}" has connected academic records and was safely Archived to protect financial history.`,
        'info'
      );
    } else {
      showNotification(`Course "${course.name}" moved to Trash.`, 'success');
    }
    setActiveMenuCourseId(null);
  };

  const activeCoursesCount = courses.filter(c => c.status === 'Active').length;
  const archivedCoursesCount = courses.filter(c => c.status === 'Archived').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Course Management Catalog</h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              {activeCoursesCount} Active • {courses.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, duplicate, and manage dynamic courses, modular syllabi, fee defaults, and faculty linkages.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xs transition-colors"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionNotification && (
        <div
          className={`p-3 rounded-xl border flex items-center space-x-2 text-xs animate-in fade-in ${
            actionNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : actionNotification.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{actionNotification.message}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by course name, code (e.g. NCA-WD-01), module topics..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {(['ALL', 'Active', 'Draft', 'Inactive', 'Archived'] as const).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Live' : st}
                {st === 'Archived' && ` (${archivedCoursesCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`text-xs px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({courses.length})
          </button>
          {categories.map(cat => {
            const count = courses.filter(c => c.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const courseBatches = batches.filter(b => b.courseId === course.id);
            const totalEnrolled = admissions.filter(a => a.courseId === course.id).length;
            const isMenuOpen = activeMenuCourseId === course.id;

            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative ${
                  course.status === 'Archived'
                    ? 'border-slate-300 opacity-75'
                    : course.status === 'Draft'
                    ? 'border-amber-200'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Course Header with Thumbnail & Quick Badges */}
                <div className="relative">
                  {course.thumbnailUrl ? (
                    <div className="h-32 w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.name}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                    </div>
                  ) : (
                    <div className="h-20 w-full bg-gradient-to-r from-indigo-900 to-slate-900 relative" />
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs border border-white/20 uppercase tracking-wider">
                      {course.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          course.status === 'Active'
                            ? 'bg-emerald-500 text-white'
                            : course.status === 'Draft'
                            ? 'bg-amber-500 text-white'
                            : course.status === 'Archived'
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {course.status}
                      </span>

                      {/* 3-Dot Quick Actions Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuCourseId(isMenuOpen ? null : course.id)}
                          className="w-7 h-7 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center backdrop-blur-xs transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-xs animate-in zoom-in-95 duration-100">
                            <button
                              onClick={() => handleOpenDetails(course)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>View & Analytics</span>
                            </button>

                            <button
                              onClick={() => handleOpenEdit(course)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-semibold"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit Program</span>
                            </button>

                            <button
                              onClick={() => handleDuplicate(course.id)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-semibold"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Duplicate (Clone)</span>
                            </button>

                            <button
                              onClick={() => handleToggleStatus(course)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-semibold"
                            >
                              <Archive className="w-3.5 h-3.5 text-amber-500" />
                              <span>{course.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                            </button>

                            <div className="border-t border-slate-100 my-1" />

                            <button
                              onClick={() => handleDelete(course)}
                              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Archive / Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Code Banner */}
                  <div className="absolute bottom-2 left-3">
                    <span className="font-mono text-[10px] text-white/90 font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {course.code}
                    </span>
                  </div>
                </div>

                {/* Course Card Body */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3
                        onClick={() => handleOpenDetails(course)}
                        className="text-base font-bold text-slate-900 leading-snug hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        {course.name}
                      </h3>
                      {course.shortName && (
                        <span className="text-[11px] text-indigo-600 font-semibold block">{course.shortName}</span>
                      )}
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl text-center text-xs border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Duration</span>
                        <span className="font-bold text-slate-800">{course.duration}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Classes</span>
                        <span className="font-bold text-slate-800">{course.totalClasses} Sessions</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Hours</span>
                        <span className="font-bold text-slate-800">
                          {course.totalHours || (course.totalClasses ? course.totalClasses * 2 : 72)}h
                        </span>
                      </div>
                    </div>

                    {/* Curriculum Highlights / Module Topics */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Modules & Highlights ({course.modules?.length || 0} Modules)
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(course.curriculumHighlights || course.syllabusHighlights || [])
                          .slice(0, 3)
                          .map((hl, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/60"
                            >
                              {hl}
                            </span>
                          ))}
                        {(course.curriculumHighlights || course.syllabusHighlights || []).length > 3 && (
                          <span className="text-[10px] text-indigo-600 font-bold px-1 py-0.5">
                            +{(course.curriculumHighlights || course.syllabusHighlights || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Fee & Batches Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div 
                      onClick={() => handleOpenEdit(course)}
                      className="cursor-pointer group"
                      title="Click to Update Course Price & Fees"
                    >
                      <div className="text-[11px] text-slate-400 line-through">
                        ৳{course.regularFee.toLocaleString()}
                      </div>
                      <div className="text-base font-black text-indigo-950 group-hover:text-indigo-600 flex items-center space-x-1">
                        <span>৳{course.offerFee.toLocaleString()}</span>
                        <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenDetails(course)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center space-x-1"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center space-x-1 shadow-2xs"
                        title="Update Course Price, Duration, Classes, Hours & Curriculum"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Course</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No courses match your filter criteria</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, switching categories, or create a brand new course program.
          </p>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Reset Filters
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              + Create New Course
            </button>
          </div>
        </div>
      )}

      {/* Course Form Modal (Create & Edit) */}
      <CourseFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCourse(null);
        }}
        initialCourse={editingCourse}
        onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
      />

      {/* Course Details & Analytics Modal */}
      <CourseDetailsAnalyticsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCourseForDetails(null);
        }}
        course={selectedCourseForDetails}
        onEditCourse={course => {
          setIsDetailsModalOpen(false);
          handleOpenEdit(course);
        }}
        onDuplicateCourse={courseId => {
          handleDuplicate(courseId);
          setIsDetailsModalOpen(false);
        }}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
