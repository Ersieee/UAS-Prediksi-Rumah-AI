import React, { useState, useEffect } from 'react';
import { Upload, Search, Database, RefreshCw, AlertCircle, Download } from 'lucide-react';

interface HouseData {
  luas_tanah: number;
  harga: number;
}

// Gunakan 127.0.0.1 agar cocok dengan server Flask
const API_URL = 'http://127.0.0.1:5000';

export default function Dataset() {
  const [dataset, setDataset] = useState<HouseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalRows, setTotalRows] = useState<number>(0);
  const [avgLuas, setAvgLuas] = useState<number>(0);
  const [avgHarga, setAvgHarga] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 1. Ambil Data dari Backend saat Komponen Di-load
  const fetchDataset = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/dataset`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      
      const result = await res.json();
      
      // Simpan data dari JSON ke State React
      setDataset(result.data || []);
      setTotalRows(result.total_rows || 0);
      setAvgLuas(result.avg_luas || 0);
      setAvgHarga(result.avg_harga || 0);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke backend Python (http://127.0.0.1:5000)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  const handleDownloadBrosur = () => {
    window.open(`${API_URL}/download-brosur`, '_blank');
  };

  // 2. Unggah File CSV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || 'Berhasil mengunggah dataset!');
        fetchDataset(); // Ambil ulang data terbaru
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Gagal mengunggah berkas. Pastikan backend Python tetap berjalan.');
    } finally {
      setUploading(false);
    }
  };

  // Filter Pencarian
  const filteredDataset = dataset.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      String(item.luas_tanah).includes(term) ||
      String(item.harga).includes(term)
    );
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dataset Rumah</h1>
          <p className="text-slate-500 text-sm">Kelola dan pratinjau dataset harga rumah</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadBrosur}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
          >
            <Download className="w-4 h-4" />
            Download Brosur PDF
          </button>
          <button
            onClick={fetchDataset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Pesan Error */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Data</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalRows.toLocaleString()} Rumah</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rata-rata Luas Tanah</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{avgLuas.toLocaleString()} m²</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rata-rata Harga</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            Rp {avgHarga.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Form & Tabel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input File */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Unggah Dataset</h2>
          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              {uploading ? 'Mengunggah...' : 'Pilih file .CSV'}
            </span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Tabel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Preview Data</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Luas Tanah (m²)</th>
                  <th className="py-3 px-4">Harga Rumah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-400">Memuat data...</td>
                  </tr>
                ) : filteredDataset.length > 0 ? (
                  filteredDataset.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-4">{item.luas_tanah.toLocaleString()} m²</td>
                      <td className="py-2.5 px-4 font-semibold text-emerald-600">
                        Rp {item.harga.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-slate-400">
                      <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}