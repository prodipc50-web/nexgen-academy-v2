import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Search,
  X,
  GraduationCap,
  Users,
  CreditCard,
  BookOpen,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
  onSelectLead: (leadId: string) => void;
  onSelectCourse: (courseId: string) => void;
  onSelectBatch: (batchId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectLead,
  onSelectCourse,
  onSelectBatch
}) => {
  const { students, leads, courses, batches, admissions, payments } = useAcademy();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search logic handled in parent or we can dispatch
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchTerm.trim().toLowerCase();

  const matchedStudents = query
    ? students.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.studentCode.toLowerCase().includes(query) ||
          s.phone.includes(query) ||
          (s.email && s.email.toLowerCase().includes(query))
      ).slice(0, 5)
    : [];

  const matchedLeads = query
    ? leads.filter(
        l =>
          l.name.toLowerCase().includes(query) ||
          l.leadCode.toLowerCase().includes(query) ||
          l.phone.includes(query) ||
          (l.email && l.email.toLowerCase().includes(query))
      ).slice(0, 5)
    : [];

  const matchedCourses = query
    ? courses.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      ).slice(0, 3)
    : [];

  const matchedBatches = query
    ? batches.filter(
        b =>
          b.batchNumber.toLowerCase().includes(query) ||
          b.room.toLowerCase().includes(query)
      ).slice(0, 3)
    : [];

  const totalResults =
    matchedStudents.length + matchedLeads.length + matchedCourses.length + matchedBatches.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name, phone (+880...), student ID, lead ID, batch..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 flex-1">
          {searchTerm && totalResults === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No results found for "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by student phone, full name, or ID code.</p>
            </div>
          )}

          {!searchTerm && (
            <div className="py-8 text-center text-slate-400">
              <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Instant Global Search</p>
              <p className="text-xs text-slate-500 mt-1">
                Type any phone number, student code, batch number, or name.
              </p>
            </div>
          )}

          {/* Students Section */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Students ({matchedStudents.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedStudents.map(student => {
                  const adm = admissions.find(a => a.studentId === student.id);
                  const batch = batches.find(b => b.id === adm?.batchId);
                  return (
                    <div
                      key={student.id}
                      onClick={() => {
                        onSelectStudent(student.id);
                        onClose();
                      }}
                      className="p-2.5 hover:bg-indigo-50/70 rounded-xl cursor-pointer flex items-center justify-between border border-transparent hover:border-indigo-100 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                            <span>{student.name}</span>
                            <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {student.studentCode}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                              {student.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>{student.phone}</span>
                            <span>•</span>
                            <span>{batch?.batchNumber || 'No Batch'}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600 opacity-60" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leads Section */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Visitors & Leads ({matchedLeads.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      onSelectLead(lead.id);
                      onClose();
                    }}
                    className="p-2.5 hover:bg-blue-50/70 rounded-xl cursor-pointer flex items-center justify-between border border-transparent hover:border-blue-100 transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>{lead.name}</span>
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {lead.leadCode}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{lead.phone}</span>
                        <span>•</span>
                        <span>Source: {lead.leadSource}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses & Batches */}
          {matchedCourses.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Courses</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      onClose();
                    }}
                    className="p-2 hover:bg-emerald-50/70 rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div className="text-xs font-semibold text-slate-800">
                      {course.name} <span className="text-[10px] text-slate-400 font-mono">({course.code})</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">৳{course.offerFee.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedBatches.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Batches</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedBatches.map(batch => (
                  <div
                    key={batch.id}
                    onClick={() => {
                      onSelectBatch(batch.id);
                      onClose();
                    }}
                    className="p-2 hover:bg-purple-50/70 rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div className="text-xs font-semibold text-slate-800">
                      Batch #{batch.batchNumber} <span className="text-[10px] text-slate-500">({batch.classTime})</span>
                    </div>
                    <span className="text-[11px] font-medium text-purple-700">{batch.room}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Use navigation keys to jump directly to profiles or records</span>
          <span className="font-semibold text-slate-700">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
