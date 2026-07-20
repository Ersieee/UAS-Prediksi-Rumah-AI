import { useState } from "react";
import axios from "axios";
import api from "../services/api";

// Definisikan tipe data respons dari backend secara spesifik agar TypeScript aman
type TrainingResult = {
  message: string;
  jumlah_data: number;
  r2_score: number;
  mae: number;
  rmse: number;
};

export default function TrainModel() {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<TrainingResult | null>(null);

  const trainModel = async () => {
    try {
      setLoading(true);
      setHasil(null); // Reset hasil sebelumnya saat mulai training ulang

      // Menggunakan endpoint relatif '/train' karena baseURL (http://127.0.0.1:5000) sudah diatur di api.ts
      const response = await api.post<TrainingResult>("/train");
      setHasil(response.data);

      alert("Model berhasil dilatih!");
    } catch (error) {
      console.error("Training error:", error);

      let errorMessage = "Training gagal. Pastikan server backend dan dataset sudah siap.";

      // Pengecekan tipe error bawaan Axios tanpa perlu kata 'any'
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        ⚙️ Training Model AI
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Latih ulang model Linear Regression menggunakan dataset terbaru (`rumah.csv`).
      </p>

      {/* Tombol Aksi */}
      <button
        onClick={trainModel}
        disabled={loading}
        className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            {/* Animasi Spinner Loading */}
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Memproses Data Mining...
          </span>
        ) : (
          "Mulai Latih Model AI"
        )}
      </button>

      {/* Tampilan Hasil Evaluasi Model (Hanya muncul jika sudah ada hasil) */}
      {hasil && (
        <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200 animate-fade-in">
          <h3 className="text-lg font-bold text-green-800 mb-3">
            ✅ {hasil.message}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <span className="block text-gray-500 text-xs uppercase font-semibold">Jumlah Data</span>
              <span className="text-xl font-bold text-gray-800">{hasil.jumlah_data ?? 0} Rumah</span>
            </div>

            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <span className="block text-gray-500 text-xs uppercase font-semibold">R² Score</span>
              <span className="text-xl font-bold text-blue-600">{hasil.r2_score ?? 0}</span>
            </div>

            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <span className="block text-gray-500 text-xs uppercase font-semibold">MAE (Error Rata-rata)</span>
              <span className="text-xl font-bold text-red-500">
                Rp {hasil.mae ? hasil.mae.toLocaleString('id-ID') : 0}
              </span>
            </div>

            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <span className="block text-gray-500 text-xs uppercase font-semibold">RMSE</span>
              <span className="text-xl font-bold text-red-600">
                Rp {hasil.rmse ? hasil.rmse.toLocaleString('id-ID') : 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}