import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const {
    currentUser,
    stats,
    leads,
    students,
    admissions,
    payments,
    expenses,
    batches,
    courses,
    campaigns,
    attendance
  } = useAcademy();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello **${currentUser.name}**! 👋 I am your **Nexgen AI Operations Intelligence Assistant** powered by Gemini 3.7.\n\nI have real-time access to the entire academy database (${students.length} students, ${leads.length} leads, ${batches.length} batches, ৳${stats.totalDue.toLocaleString()} in dues, and ৳${stats.monthCollection.toLocaleString()} in monthly revenue).\n\nAsk me anything about daily priorities, revenue analysis, marketing ROI, or let me draft student follow-up messages!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    "Identify top 5 overdue payments and generate a polite WhatsApp collection message.",
    "Give an executive summary of this month's revenue, expenses, and net profit margin.",
    "Which courses are generating the highest revenue and best marketing ROI?",
    "Analyze today's urgent CRM follow-ups and suggest counseling strategy.",
    "Draft high-converting Facebook Ad copy for our Graphic Design with AI batch."
  ];

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      // Build lightweight live context
      const academyContext = {
        currentUser: { name: currentUser.name, role: currentUser.role },
        stats,
        summary: {
          totalStudents: students.length,
          totalLeads: leads.length,
          totalBatches: batches.length,
          totalCourses: courses.length,
          totalPaymentsCount: payments.length,
          totalExpensesCount: expenses.length
        },
        overdueAdmissions: admissions
          .filter(a => a.due > 0)
          .slice(0, 10)
          .map(a => {
            const stu = students.find(s => s.id === a.studentId);
            const crs = courses.find(c => c.id === a.courseId);
            return {
              studentName: stu?.name,
              phone: stu?.phone,
              course: crs?.name,
              finalFee: a.finalFee,
              paid: a.totalPaid,
              due: a.due,
              nextDueDate: a.nextDueDate
            };
          }),
        urgentFollowups: leads
          .filter(l => l.status !== 'Admitted' && l.status !== 'Lost')
          .slice(0, 10)
          .map(l => ({
            name: l.name,
            phone: l.phone,
            status: l.status,
            source: l.leadSource,
            nextFollowUpDate: l.nextFollowUpDate
          })),
        campaigns: campaigns.map(c => ({
          name: c.name,
          platform: c.platform,
          spent: c.spent,
          leads: c.leadsGenerated,
          admissions: c.admissionsCount
        }))
      };

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userRole: currentUser.role,
          academyContext
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'Analysis complete.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **AI Service Note**: Could not reach Gemini server endpoint (${err.message || 'Network error'}). Please verify the local server or try asking another question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-5 rounded-3xl text-white shadow-xl border border-indigo-950">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight">Nexgen AI Operations Copilot</h2>
              <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Real-time analytics, overdue collection recommendations, and automated CRM assistance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Context: <strong>{students.length} Students</strong> • <strong>{leads.length} Leads</strong></span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="shrink-0 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-xs">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white shadow-2xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium shadow-2xs rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs rounded-tl-none space-y-2'
              }`}
            >
              {msg.sender === 'assistant' ? (
                <div className="prose prose-xs max-w-none text-slate-900 leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              <div
                className={`flex items-center justify-between pt-1 text-[10px] ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400 border-t border-slate-200/60'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="hover:text-indigo-600 flex items-center space-x-1 font-semibold"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing live database and formulating executive response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs"
      >
        <input
          type="text"
          placeholder="Ask AI Assistant about admissions, dues, counselors, campaigns, or schedules..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
