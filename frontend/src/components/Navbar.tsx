import { Search, Bell, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Fungsi untuk mengubah judul navbar secara dinamis berdasarkan URL yang aktif
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Dashboard Utama",
          desc: "Metrik performa model AI dan ringkasan data mining.",
        };
      case "/dataset":
        return {
          title: "Manajemen Dataset",
          desc: "Kelola file data rumah (rumah.csv) untuk training model.",
        };
      case "/prediction":
        return {
          title: "Prediksi Harga AI",
          desc: "Hitung estimasi harga pasar rumah secara real-time.",
        };
      case "/training":
        return {
          title: "Training Model AI",
          desc: "Latih algoritma Linear Regression dengan data terbaru.",
        };
      case "/history":
        return {
          title: "Riwayat Prediksi",
          desc: "Daftar hasil kalkulasi prediksi yang tersimpan di database.",
        };
      case "/assistant":
        return {
          title: "AI Assistant",
          desc: "Tanya jawab cerdas seputar analisis data properti.",
        };
      default:
        return {
          title: "Sistem Prediksi AI",
          desc: "Analisis harga rumah dengan Machine Learning.",
        };
    }
  };

  const { title, desc } = getPageTitle();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 mb-8">
      
      {/* Bagian Kiri: Judul & Deskripsi Dinamis */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {location.pathname === "/prediction" && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
              <Sparkles className="w-3 h-3" />
              AI Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
          {desc}
        </p>
      </div>

      {/* Bagian Kanan: Search & User Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-3.5">
        
        {/* Input Search Ringkas */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl px-3.5 py-2 border border-slate-200/80 transition-all duration-200 w-full sm:w-60">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari menu atau data..."
            className="ml-2 bg-transparent outline-none text-xs text-slate-700 w-full placeholder-slate-400"
          />
        </div>

        {/* Tombol Aksi Kontrol */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Notifikasi Lonceng */}
          <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition duration-200">
            <Bell size={17} />
            {/* Dot merah tanda ada notifikasi baru */}
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Avatar User Minimalis */}
          <button className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition duration-200">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-200">
              YS
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden md:inline-block">
              Yosalfa
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}