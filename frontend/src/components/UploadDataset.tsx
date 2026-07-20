import { useState } from "react";
import { UploadCloud, FileCheck, Loader2 } from "lucide-react";
import api from "../services/api";

interface UploadDatasetProps {
  onSuccess?: () => void;
}

export default function UploadDataset({ onSuccess }: UploadDatasetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const upload = async () => {
    if (!file) {
      alert("Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Dataset berhasil diunggah dan disimpan!");
      setFile(null); // Reset file yang dipilih setelah berhasil

      // Jalankan callback untuk refresh tabel di Dataset.tsx
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah dataset. Pastikan format file adalah CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Container Custom File Input (Drag & Drop Look) */}
      <label className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-all duration-200 group">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <FileCheck className="w-8 h-8 text-emerald-500 mb-1" />
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">
              {file.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors mb-1" />
            <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600">
              Pilih file <span className="font-bold">.CSV</span>
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Klik atau seret file ke sini
            </span>
          </div>
        )}
      </label>

      {/* Tombol Unggah */}
      <button
        onClick={upload}
        disabled={loading || !file}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 text-white shadow-sm ${
          loading || !file
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengunggah...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Unggah Berkas
          </>
        )}
      </button>
    </div>
  );
}