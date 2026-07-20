import { useState } from "react";
import { Sparkles, Building2, AlertCircle, Loader2 } from "lucide-react";
import api from "../services/api";

export default function Prediction() {
  const [luasTanah, setLuasTanah] = useState<string>("");
  const [hasilHarga, setHasilHarga] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!luasTanah || Number(luasTanah) <= 0) {
      alert("Masukkan luas tanah yang valid!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setHasilHarga(null);

      // Mengirim request ke API backend
      const response = await api.post("/predict", {
        luas_tanah: Number(luasTanah),
      });

      // Fleksibel menangani variasi format field dari backend Flask
      const harga =
        response.data?.prediksi_harga ??
        response.data?.harga ??
        response.data?.prediction;

      if (harga !== undefined && harga !== null) {
        setHasilHarga(Number(harga));
      } else {
        throw new Error("Respon API tidak memiliki format harga yang sesuai.");
      }
    } catch (err: unknown) {
      console.error("Error Prediksi:", err);

      // Type-casting aman untuk merespon axios error tanpa menggunakan 'any'
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };

      const pesan =
        axiosError.response?.data?.message ||
        "Gagal melakukan prediksi. Pastikan model AI sudah dilatih di menu Training AI.";

      setErrorMsg(pesan);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            AI Prediction Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
            Prediksi Harga Rumah
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Gunakan kekuatan Machine Learning untuk memperkirakan nilai properti
            Anda secara instan berdasarkan luas tanah.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <form onSubmit={handlePredict} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Luas Tanah (m²)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  placeholder="Contoh: 120"
                  value={luasTanah}
                  onChange={(e) => setLuasTanah(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  m²
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !luasTanah}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition duration-200 flex items-center justify-center gap-2 ${
                loading || !luasTanah
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menghitung Estimasi...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Hitung Prediksi Harga
                </>
              )}
            </button>
          </form>

          {/* Alert Error */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Mengkalkulasi</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Result Card */}
          {hasilHarga !== null && (
            <div className="mt-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl text-center space-y-2 animate-in fade-in zoom-in duration-200">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                Estimasi Harga Pasar
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {formatRupiah(hasilHarga)}
              </h2>
              <p className="text-[11px] text-slate-500">
                *Hasil estimasi dihitung berdasarkan model regresi linear dari
                dataset aktif.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}