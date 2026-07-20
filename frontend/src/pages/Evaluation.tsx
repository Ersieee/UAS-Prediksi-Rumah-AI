import React, { useState } from 'react';
import { ShieldCheck, Target, AlertTriangle, Zap } from 'lucide-react';

export default function Evaluation() {
  const [userQuery, setUserQuery] = useState('Berapa harga rumah tipe 36?');
  const [aiResponse, setAiResponse] = useState('Harga rumah tipe 36 adalah Rp 450.000.000');
  const [context, setContext] = useState('Tipe Rumah & Harga: Tipe 36/60 Rp 450.000.000. Tipe 45/84 Rp 650.000.000.');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const evaluateAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: userQuery, ai_response: aiResponse, context })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quality Assurance Evaluator</h1>
          </div>
          <p className="text-slate-500 font-medium ml-11">Evaluasi metrik Akurasi, Efektivitas, dan Halusinasi pada layanan pelanggan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Input */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-600"></div>
          
          <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Konteks Dokumen (RAG Database):</label>
            <textarea 
              rows={3} 
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-700 font-medium"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Pertanyaan User:</label>
            <input 
              type="text" 
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-700 font-medium"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Jawaban Staf (Untuk Dievaluasi):</label>
            <textarea 
              rows={3} 
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-700 font-medium"
              value={aiResponse}
              onChange={(e) => setAiResponse(e.target.value)}
            />
          </div>
          <button 
            onClick={evaluateAI}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold flex justify-center items-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
          >
            <Zap className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Menganalisis Kualitas...' : 'Jalankan QA Evaluator'}
          </button>
          </div>
        </div>

        {/* Hasil Evaluasi */}
        {result && (
          <div 
            className="bg-[#0f172a] text-white p-8 rounded-2xl shadow-2xl shadow-purple-900/20 flex flex-col gap-8 relative overflow-hidden"
            style={{ animation: 'slideUp 0.5s ease-out forwards' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
            
            <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <ShieldCheck className="text-emerald-400 w-6 h-6" />
              </div>
              Hasil Evaluasi QA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                <Target className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">{result.accuracy_score}</div>
                <div className="text-xs text-slate-500 mt-1">out of 100</div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Effectiveness</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-green-300">{result.effectiveness_score}</div>
                <div className="text-xs text-slate-500 mt-1">out of 100</div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center transform transition-transform hover:scale-105">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Hallucination</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-300">{result.hallucination_score}</div>
                <div className="text-xs text-slate-500 mt-1">Lower is better</div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 relative z-10">
              <div className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Catatan Auditor
              </div>
              <p className="text-base leading-relaxed text-slate-200">{result.reasoning}</p>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
