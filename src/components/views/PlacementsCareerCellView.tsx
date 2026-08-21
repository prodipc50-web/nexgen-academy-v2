import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { StudentPlacement } from '../../types';
import {
  Briefcase,
  TrendingUp,
  Award,
  Globe,
  DollarSign,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Building,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  User,
  MapPin,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export const PlacementsCareerCellView: React.FC = () => {
  const { placements, addPlacement, updatePlacement, deletePlacement, students, courses, batches } = useAcademy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<StudentPlacement | null>(null);
  const [placementToDelete, setPlacementToDelete] = useState<StudentPlacement | null>(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState<StudentPlacement['type']>('Full-time Job');
  const [companyOrClient, setCompanyOrClient] = useState('');
  const [position, setPosition] = useState('');
  const [monthlySalaryOrEarnings, setMonthlySalaryOrEarnings] = useState<number>(35000);
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [placementDate, setPlacementDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [marketplace, setMarketplace] = useState<StudentPlacement['marketplace']>('Local Company');
  const [storyReview, setStoryReview] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [status, setStatus] = useState<StudentPlacement['status']>('Verified');

  const filteredPlacements = placements.filter(p => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyOrClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || p.type === selectedType;
    const matchesCourse = selectedCourse === 'All' || p.courseId === selectedCourse;

    return matchesSearch && matchesType && matchesCourse;
  });

  // KPI calculations
  const totalPlaced = placements.length;
  const verifiedStories = placements.filter(p => p.status === 'Verified' || p.status === 'Promoted').length;
  const totalBdtEarnings = placements
    .filter(p => p.currency === 'BDT')
    .reduce((sum, p) => sum + (p.monthlySalaryOrEarnings || 0), 0);
  const totalUsdEarnings = placements
    .filter(p => p.currency === 'USD')
    .reduce((sum, p) => sum + (p.monthlySalaryOrEarnings || 0), 0);

  const handleOpenAdd = () => {
    setEditingPlacement(null);
    if (students.length > 0) setStudentId(students[0].id);
    setType('Full-time Job');
    setCompanyOrClient('');
    setPosition('');
    setMonthlySalaryOrEarnings(35000);
    setCurrency('BDT');
    setPlacementDate(new Date().toISOString().split('T')[0]);
    setLocation('Dhaka, Bangladesh');
    setMarketplace('Local Company');
    setStoryReview('');
    setPortfolioUrl('');
    setStatus('Verified');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: StudentPlacement) => {
    setEditingPlacement(p);
    setStudentId(p.studentId);
    setType(p.type);
    setCompanyOrClient(p.companyOrClient);
    setPosition(p.position);
    setMonthlySalaryOrEarnings(p.monthlySalaryOrEarnings || 0);
    setCurrency(p.currency);
    setPlacementDate(p.placementDate);
    setLocation(p.location || '');
    setMarketplace(p.marketplace || 'Local Company');
    setStoryReview(p.storyReview || '');
    setPortfolioUrl(p.portfolioUrl || '');
    setStatus(p.status);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selStudent = students.find(s => s.id === studentId);
    if (!selStudent) return;

    if (editingPlacement) {
      updatePlacement(editingPlacement.id, {
        studentId,
        studentName: selStudent.name,
        studentCode: selStudent.studentCode,
        studentPhoto: selStudent.photoUrl,
        type,
        companyOrClient,
        position,
        monthlySalaryOrEarnings,
        currency,
        placementDate,
        location,
        marketplace,
        storyReview,
        portfolioUrl,
        status
      });
    } else {
      addPlacement({
        studentId,
        studentName: selStudent.name,
        studentCode: selStudent.studentCode,
        studentPhoto: selStudent.photoUrl,
        courseId: courses[0]?.id || 'crs-01',
        courseName: courses[0]?.name || 'Professional Course',
        batchNumber: 'NCA-01',
        type,
        companyOrClient,
        position,
        monthlySalaryOrEarnings,
        currency,
        placementDate,
        location,
        marketplace,
        storyReview,
        portfolioUrl,
        status
      });
    }
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (placementToDelete) {
      deletePlacement(placementToDelete.id);
      setPlacementToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-950/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Career & Alumni Placement Cell</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Job Placement & Success Stories Tracker
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Track student employment, freelancing milestones on Upwork/Fiverr, remote jobs, and publish verified alumni success stories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Placement Record</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Placed Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalPlaced}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold">{verifiedStories} Verified Cases</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Local Monthly Salary</p>
            <h3 className="text-2xl font-extrabold text-slate-900">৳{totalBdtEarnings.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400">Combined Monthly Payout</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Freelance Earnings</p>
            <h3 className="text-2xl font-extrabold text-slate-900">${totalUsdEarnings.toLocaleString()}</h3>
            <p className="text-[11px] text-amber-600 font-semibold">Upwork & Fiverr Milestones</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Placement Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-900">88.4%</h3>
            <p className="text-[11px] text-indigo-600 font-semibold">Direct & Freelance Support</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, company, role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Placement Types</option>
            <option value="Full-time Job">Full-time Job</option>
            <option value="Freelancing Milestone">Freelancing Milestone</option>
            <option value="Remote Job">Remote Job</option>
            <option value="Internship">Internship</option>
            <option value="Entrepreneurship / Agency">Entrepreneurship / Agency</option>
          </select>

          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Placement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlacements.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Card Bar */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={p.studentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={p.studentName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.studentName}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">{p.studentCode}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    p.status === 'Verified' || p.status === 'Promoted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Company & Role Details */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-indigo-900 font-bold">
                  <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{p.companyOrClient}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.position}</span>
                </div>
                {p.location && (
                  <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                )}
              </div>

              {/* Earnings & Type Badges */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {p.currency === 'USD' ? `$${p.monthlySalaryOrEarnings?.toLocaleString()}` : `৳${p.monthlySalaryOrEarnings?.toLocaleString()}/mo`}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {p.type}
                </span>
              </div>

              {/* Testimonial / Story Snippet */}
              {p.storyReview && (
                <p className="mt-3 text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60 line-clamp-3">
                  "{p.storyReview}"
                </p>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {p.portfolioUrl ? (
                <a
                  href={p.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1"
                >
                  <span>Portfolio / Proof</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Placed: {p.placementDate}</span>
              )}

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlacementToDelete(p)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlacements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No placement records found</h3>
          <p className="text-xs text-slate-500 mt-1">Add student placement milestones to showcase academy success.</p>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">
                  {editingPlacement ? 'Edit Placement Story' : 'Record Student Placement'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Student *</label>
                <select
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Placement Type *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Full-time Job">Full-time Job</option>
                    <option value="Freelancing Milestone">Freelancing Milestone</option>
                    <option value="Remote Job">Remote Job</option>
                    <option value="Internship">Internship</option>
                    <option value="Entrepreneurship / Agency">Entrepreneurship / Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marketplace / Channel</label>
                  <select
                    value={marketplace}
                    onChange={e => setMarketplace(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Local Company">Local Company</option>
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr</option>
                    <option value="Remote Global Client">Remote Global Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company or Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brain Station 23 or Direct US Client"
                    value={companyOrClient}
                    onChange={e => setCompanyOrClient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Frontend Dev"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Salary / Earnings Amount</label>
                  <input
                    type="number"
                    value={monthlySalaryOrEarnings}
                    onChange={e => setMonthlySalaryOrEarnings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Placement Date</label>
                  <input
                    type="date"
                    value={placementDate}
                    onChange={e => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Banani, Dhaka or Remote (USA)"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Portfolio or Verification URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/... or https://behance.net/..."
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Review & Success Story</label>
                <textarea
                  rows={3}
                  placeholder="How Nexgen training helped them achieve this milestone..."
                  value={storyReview}
                  onChange={e => setStoryReview(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {placementToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Placement Story?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove the placement record of <strong>{placementToDelete.studentName}</strong>? It will be moved to the Recycle Bin.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setPlacementToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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
