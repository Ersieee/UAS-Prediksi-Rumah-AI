import { useEffect, useState } from "react";
import { Brain, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import api from "../services/api";

interface TrainingResult {
  model_name: string;
  accuracy?: number;
  r2_score?: number;
  mse?: number;
  message?: string;
}

export default function Training() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TrainingResult | null>(null);

  // 1. Muat hasil training dari localStorage saat halaman dibuka/di-refresh
  useEffect(() => {
    const savedResult = localStorage.getItem("ai_training_result");
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult) as Record<string, unknown>;

        if (parsed && typeof parsed === "object") {
          // Buat objek dasar dengan properti wajib
          const validResult: TrainingResult = {
            model_name:
              typeof parsed.model_name === "string"
                ? parsed.model_name
                : "Linear Regression",
          };

          // Tambahkan properti opsional HANYA jika tipenya sesuai (menghindari 'undefined')
          if (typeof parsed.accuracy === "number") validResult.accuracy = parsed.accuracy;
          if (typeof parsed.r2_score === "number") validResult.r2_score = parsed.r2_score;
          if (typeof parsed.mse === "number") validResult.mse = parsed.mse;
          if (typeof parsed.message === "string") validResult.message = parsed.message;

          // eslint-disable-next-line react-hooks/set-state-in-effect
          setResult(validResult);
        }
      } catch (err) {
        console.error("Gagal membaca cache training:", err);
      }
    }
  }, []);

  // 2. Fungsi melatih model
  const handleTrain = async () => {
    try {
      setLoading(true);
      const response = await api.post("/train");

      const rawData = response.data as Record<string, unknown>;

      const validResult: TrainingResult = {
        model_name:
          typeof rawData?.model_name === "string"
            ? rawData.model_name
            : "Linear Regression",
      };

      if (typeof rawData?.accuracy === "number") validResult.accuracy = rawData.accuracy;
      if (typeof rawData?.r2_score === "number") validResult.r2_score = rawData.r2_score;
      if (typeof rawData?.mse === "number") validResult.mse = rawData.mse;
      if (typeof rawData?.message === "string") validResult.message = rawData.message;

      setResult(validResult);
      localStorage.setItem("ai_training_result", JSON.stringify(validResult));
      alert("Model AI berhasil dilatih!");
    } catch (error) {
      console.error("Gagal melatih model:", error);
      alert("Gagal melakukan melatih model AI. Pastikan dataset terisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6 text-emerald-600" />
          Pelatihan Model AI
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Latih model Linear Regression menggunakan dataset terbaru yang tersimpan di database.
        </p>

        <button
          onClick={handleTrain}
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Melatih Model AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Mulai Training AI
            </>
          )}
        </button>

        {/* Tampilan Status Hasil Training */}
        {result && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Model Siap Digunakan</span>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Model:</strong> {result.model_name || "Linear Regression"}
            </p>
            {result.r2_score !== undefined && (
              <p className="text-xs text-slate-600">
                <strong>Akurasi (R² Score):</strong> {(result.r2_score * 100).toFixed(2)}%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}