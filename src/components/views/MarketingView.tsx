import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Campaign } from '../../types';
import {
  Megaphone,
  PlusCircle,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Trophy,
  BarChart2,
  Calendar,
  X
} from 'lucide-react';

export const MarketingView: React.FC = () => {
  const { campaigns, leads, staffList, addCampaign } = useAcademy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Facebook / Instagram Ads');
  const [budget, setBudget] = useState(15000);
  const [spent, setSpent] = useState(12000);
  const [leadsGenerated, setLeadsGenerated] = useState(85);
  const [admissionsCount, setAdmissionsCount] = useState(24);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCampaign({
      name,
      platform,
      adSpend: spent || budget || 0,
      budget,
      spent,
      leadsGenerated,
      admissionsCount,
      targetAudience: 'Students & Skill Seekers',
      startDate,
      endDate: endDate || new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
      status: 'Active'
    });

    setIsAddModalOpen(false);
    setName('');
  };

  // Counselor Leaderboard
  const counselorStats = staffList
    .filter(s => s.role === 'COUNSELOR' || s.role === 'MANAGER' || s.role === 'ADMIN')
    .map(staff => {
      const staffLeads = leads.filter(l => l.counselorId === staff.id);
      const admittedLeads = staffLeads.filter(l => l.status === 'Admitted');
      const conversionRate = staffLeads.length > 0 ? Math.round((admittedLeads.length / staffLeads.length) * 100) : 0;
      return {
        ...staff,
        totalLeads: staffLeads.length,
        admittedLeads: admittedLeads.length,
        conversionRate
      };
    })
    .sort((a, b) => b.admittedLeads - a.admittedLeads);

  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || c.adSpend || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsGenerated || 0), 0);
  const totalAdmissions = campaigns.reduce((sum, c) => sum + (c.admissionsCount || 0), 0);
  const avgCPL = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
  const avgCPA = totalAdmissions > 0 ? Math.round(totalSpent / totalAdmissions) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Marketing ROI & Counselor Performance
            </h2>
            <span className="text-xs font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">
              {campaigns.length} Campaigns
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor paid digital campaigns, track Cost Per Lead (CPL) & Acquisition (CPA), and evaluate counselor conversion rates
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* 4 Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Total Ad Spend</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">৳{totalSpent.toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Leads Generated</span>
          <span className="text-xl font-black text-blue-950 mt-1 block">{totalLeads} Leads</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Avg Cost / Lead (CPL)</span>
          <span className="text-xl font-black text-indigo-950 mt-1 block">৳{avgCPL}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">Cost / Admission (CPA)</span>
          <span className="text-xl font-black text-emerald-950 mt-1 block">৳{avgCPA}</span>
        </div>
      </div>

      {/* Split: Campaigns Grid + Counselor Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-pink-600" />
            <span>Active Marketing Campaigns</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map(camp => {
              const spentAmt = camp.spent ?? camp.adSpend ?? 0;
              const budgetAmt = camp.budget ?? camp.adSpend ?? spentAmt;
              const leadsGen = camp.leadsGenerated ?? 0;
              const admCount = camp.admissionsCount ?? 0;
              const cpl = leadsGen > 0 ? Math.round(spentAmt / leadsGen) : 0;
              const cpa = admCount > 0 ? Math.round(spentAmt / admCount) : 0;

              return (
                <div
                  key={camp.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-pink-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                        {camp.platform}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{camp.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {camp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Spent / Budget</span>
                      <span className="font-bold text-slate-900">
                        ৳{spentAmt.toLocaleString()} / ৳{budgetAmt.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Conversions</span>
                      <span className="font-bold text-emerald-700">
                        {admCount} Admitted
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 border-t border-slate-100">
                    <span>CPL: <strong className="text-slate-900">৳{cpl}</strong></span>
                    <span>CPA: <strong className="text-slate-900">৳{cpa}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Counselor Leaderboard (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Counselor Leaderboard</h3>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {counselorStats.map((counselor, idx) => (
              <div key={counselor.id} className="pt-2 pb-1 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    idx === 0 ? 'bg-amber-100 text-amber-900' : idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{counselor.name}</div>
                    <div className="text-[10px] text-slate-400">{counselor.designation}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-700">{counselor.admittedLeads} Admitted</div>
                  <div className="text-[10px] text-slate-400">{counselor.conversionRate}% Rate ({counselor.totalLeads} leads)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-pink-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Launch Marketing Campaign</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graphic Design AI Autumn Batch Promo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Channel / Platform</label>
                <input
                  type="text"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Budget (৳)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Spent So Far (৳)</label>
                  <input
                    type="number"
                    value={spent}
                    onChange={e => setSpent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Leads Generated</label>
                  <input
                    type="number"
                    value={leadsGenerated}
                    onChange={e => setLeadsGenerated(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Admissions Converted</label>
                  <input
                    type="number"
                    value={admissionsCount}
                    onChange={e => setAdmissionsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
