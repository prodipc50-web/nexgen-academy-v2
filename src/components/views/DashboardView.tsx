import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  Users,
  GraduationCap,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Receipt,
  Calendar,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  BookOpen,
  Briefcase,
  FolderGit2,
  Presentation,
  ShieldAlert,
  MessageSquare,
  Activity,
  Award,
  DollarSign,
  Building,
  UserCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewAdmission: () => void;
  onOpenNewLead: () => void;
  onOpenAddPayment: () => void;
  onOpenAddExpense: () => void;
  onSelectStudent: (studentId: string) => void;
  onSelectLead: (leadId: string) => void;
  onOpenFollowUp: (leadId: string) => void;
  onOpenCollectPayment: (admissionId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewAdmission,
  onOpenNewLead,
  onOpenAddPayment,
  onOpenAddExpense,
  onSelectStudent,
  onSelectLead,
  onOpenFollowUp,
  onOpenCollectPayment,
  onNavigateTab
}) => {
  const {
    currentUser,
    stats,
    leads,
    students,
    admissions,
    payments,
    batches,
    courses,
    expenses,
    placements,
    assignments,
    seminars,
    auditLogs,
    getAtRiskStudents,
    getTodayLiveOperations
  } = useAcademy();

  const todayStr = new Date().toISOString().split('T')[0];
  const liveOps = getTodayLiveOperations();
  const atRiskStudents = getAtRiskStudents();

  // Urgent pending followups
  const urgentFollowups = leads
    .filter(
      l =>
        l.status !== 'Admitted' &&
        l.status !== 'Lost' &&
        (l.nextFollowUpDate === todayStr || (l.nextFollowUpDate && l.nextFollowUpDate < todayStr))
    )
    .slice(0, 4);

  // Top High Dues
  const highDues = admissions
    .filter(a => a.due > 0)
    .sort((a, b) => b.due - a.due)
    .slice(0, 4);

  // Recent 4 Payments
  const recentPayments = payments.slice(0, 4);

  // Quick WhatsApp Message Sender helper
  const handleSendWhatsApp = (phone: string, name: string, dueAmount: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Dear ${name}, this is a gentle reminder from Nexgen Computer Academy regarding your pending course fee of BDT ${dueAmount.toLocaleString()}. Please contact our accounts desk if already cleared. Thank you!`;
    const url = `https://wa.me/${cleanPhone.startsWith('88') ? cleanPhone : '88' + cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Welcome Banner & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-950/80 relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-4">
          <NexgenLogo variant="crest" size={160} />
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="hidden sm:block shrink-0 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-xs">
            <NexgenLogo variant="crest" size={52} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60 flex items-center space-x-1">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Live Operations Center</span>
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-0.5">
              Nexgen Academy Command Engine • {stats.activeStudents} active students in {batches.length} running batches.
            </p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 relative z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenNewAdmission}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Admission</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddPayment}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewLead}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all backdrop-blur-xs"
          >
            <Users className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Top 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Students</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{stats.admissionsThisMonth} this month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.totalStudents} total enrolled historically</p>
        </div>

        {/* Monthly Revenue */}
        <div
          onClick={() => onNavigateTab('financial-reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month Collection</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ৳{stats.monthCollection.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              ৳{stats.todayCollection.toLocaleString()} today
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Net: ৳{stats.netIncomeMonth.toLocaleString()} after expenses
          </p>
        </div>

        {/* Total Outstanding Dues */}
        <div
          onClick={() => onNavigateTab('due')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-rose-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Due Pipeline</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              ৳{stats.totalDue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              ৳{stats.overdueDueAmount.toLocaleString()} Overdue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all active course batches</p>
        </div>

        {/* CRM Followups */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's CRM Tasks</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.todayFollowupsCount}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {stats.overdueFollowupsCount} Overdue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.newLeadsThisMonth} new leads registered this month</p>
        </div>
      </div>

      {/* Dynamic 2-Column Grid: Live Operations & Dropout Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: Live Operations Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* TODAY'S LIVE OPERATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today's Active Lab & Class Schedule</h3>
                  <p className="text-xs text-slate-500">Live room occupancy, ongoing lectures, and trainer duty</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {liveOps.todayClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveOps.todayClasses.map(sch => (
                  <div
                    key={sch.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        {sch.time || '06:00 PM - 08:00 PM'}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {sch.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{sch.topic}</h4>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/50">
                      <span className="flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{sch.room}</span>
                      </span>
                      <span className="font-semibold text-slate-700">{sch.trainer?.name || 'Trainer Assigned'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-2xl text-xs">
                No scheduled batch classes for today. You can add new classes in the Class Schedule tab.
              </div>
            )}

            {/* UPCOMING SEMINAR / MASTERCLASS HIGHLIGHT */}
            {liveOps.todaySeminars.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded-full">
                      Upcoming Seminar
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                      {liveOps.todaySeminars[0].title}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {liveOps.todaySeminars[0].time} • Speaker: {liveOps.todaySeminars[0].speakerName} ({liveOps.todaySeminars[0].registeredCount} registered)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('seminars')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Manage Event
                </button>
              </div>
            )}
          </div>

          {/* QUICK SMART HUBS: PLACEMENTS, ASSIGNMENTS, SEMINARS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Placements Box */}
            <div
              onClick={() => onNavigateTab('placements')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Career & Placements</h4>
              <p className="text-xs text-slate-500 mt-0.5">{placements.length} Success Stories</p>
              <div className="mt-3 flex items-center text-xs font-bold text-emerald-600">
                <span>View Job Stories</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Assignments Box */}
            <div
              onClick={() => onNavigateTab('assignments')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Lab Projects & Tasks</h4>
              <p className="text-xs text-slate-500 mt-0.5">{assignments.length} Active Tasks</p>
              <div className="mt-3 flex items-center text-xs font-bold text-indigo-600">
                <span>Review Submissions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Seminars Box */}
            <div
              onClick={() => onNavigateTab('seminars')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Presentation className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Free Seminars</h4>
              <p className="text-xs text-slate-500 mt-0.5">{seminars.length} Events Hosted</p>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-600">
                <span>Event Registrations</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: DROPOUT RISK RADAR & CRM FOLLOWUPS */}
        <div className="space-y-6">
          {/* DROPOUT RISK RADAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dropout Risk Radar</h3>
                  <p className="text-[11px] text-slate-500">Auto-detected attention needed</p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {atRiskStudents.length} Students
              </span>
            </div>

            {atRiskStudents.length > 0 ? (
              <div className="space-y-3">
                {atRiskStudents.slice(0, 3).map(risk => (
                  <div
                    key={risk.student.id}
                    className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{risk.student.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{risk.student.studentCode}</p>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        {risk.reason}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-rose-100/60">
                      <span className="text-[11px] text-slate-600">
                        {risk.dueAmount > 0 ? `Due: ৳${risk.dueAmount.toLocaleString()}` : `${risk.absentCount} Days Absent`}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(risk.student.phone, risk.student.name, risk.dueAmount || 0)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectStudent(risk.student.id)}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[10px] font-bold"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-emerald-600 bg-emerald-50 rounded-xl font-medium">
                ✓ All students have healthy attendance and clear dues!
              </div>
            )}
          </div>

          {/* CRM TODAY'S FOLLOWUPS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Urgent Lead Follow-ups</h3>
                  <p className="text-[11px] text-slate-500">Scheduled calls & inquiries</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('crm')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>

            {urgentFollowups.length > 0 ? (
              <div className="space-y-2.5">
                {urgentFollowups.map(lead => {
                  const interestedCourse = courses.find(c => c.id === lead.interestedCourseId);
                  return (
                    <div
                      key={lead.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{lead.name}</h4>
                        <p className="text-[10px] text-slate-500">{lead.phone} • {interestedCourse?.name || 'General Inquiry'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenFollowUp(lead.id)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Call / Log
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No urgent follow-ups due today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards: High Due Pipeline & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Dues Collection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Highest Outstanding Dues</h3>
                <p className="text-xs text-slate-500">Collect pending installments</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('due')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              Due Center →
            </button>
          </div>

          <div className="space-y-3">
            {highDues.map(adm => {
              const stu = students.find(s => s.id === adm.studentId);
              const crs = courses.find(c => c.id === adm.courseId);
              return (
                <div
                  key={adm.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{stu?.name || 'Student'}</h4>
                    <p className="text-[10px] text-slate-500">{crs?.name} • Next: {adm.nextPaymentDate || 'Immediate'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-rose-600">৳{adm.due.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => onOpenCollectPayment(adm.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Collect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Payment Receipts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Payment Receipts</h3>
                <p className="text-xs text-slate-500">Live collection feed</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
            >
              All Receipts →
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.map(p => {
              const stu = students.find(s => s.id === p.studentId);
              return (
                <div
                  key={p.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{stu?.name || 'Student'}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {p.receiptNumber} • {p.paymentMethod} • {p.date}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ৳{p.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
