import React, { useState } from 'react';
import { PlayCircle, CheckCircle, Clock, Sparkles, User, Briefcase, FileText } from 'lucide-react';

export default function EnterpriseAgents() {
  const [task, setTask] = useState('Buat draft promosi rumah tipe 45 untuk disebar di Instagram.');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAgents = async () => {
    if (!task) return;
    setLoading(true);
    setError('');
    setHistory([]);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/run-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history);
      } else {
        setError(data.error);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Multi-Agent Simulation</h1>
          </div>
          <p className="text-slate-500 font-medium ml-11">Powered by LangGraph for autonomous cross-division collaboration.</p>
        </div>
      </div>

      {/* Task Input Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          Assign Task as Director
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="E.g., Buat draft promosi rumah tipe 45 untuk Instagram..."
              className="w-full pl-4 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
          <button 
            onClick={runAgents}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <PlayCircle className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Simulating Workflow...' : 'Execute Simulation'}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}
      </div>

      {/* Workflow History */}
      {history.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Agent Workflow Log</h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {history.map((h, i) => {
              const isMarketing = h.agent.includes('Marketing');
              const isApprove = h.action.includes('APPROVE');
              
              return (
                <div 
                  key={i} 
                  className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                    isMarketing 
                      ? 'bg-gradient-to-br from-white to-blue-50/50 border-blue-100 hover:border-blue-300' 
                      : isApprove 
                        ? 'bg-gradient-to-br from-white to-emerald-50/50 border-emerald-100 hover:border-emerald-300'
                        : 'bg-gradient-to-br from-white to-orange-50/50 border-orange-100 hover:border-orange-300'
                  }`}
                  style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl shadow-sm ${
                      isMarketing ? 'bg-blue-100 text-blue-600' : isApprove ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {isMarketing ? <User className="w-6 h-6" /> : isApprove ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-bold ${
                        isMarketing ? 'text-blue-800' : isApprove ? 'text-emerald-800' : 'text-orange-800'
                      }`}>
                        {h.agent}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isMarketing ? 'bg-blue-100 text-blue-700' : isApprove ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {h.action}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Step {i + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mt-4">
                    <div className="absolute top-4 left-4 text-slate-200">
                      <FileText className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed bg-white/60 backdrop-blur-sm p-5 pl-12 rounded-xl border border-slate-100 shadow-sm">
                      {h.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
