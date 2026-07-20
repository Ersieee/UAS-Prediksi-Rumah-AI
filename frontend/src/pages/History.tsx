import React, { useState, useEffect } from 'react';

// Interface untuk tipe data TypeScript
interface HistoryItem {
  id?: number;
  luas_tanah?: number;
  luas?: number;
  harga_prediksi?: number;
  harga?: number;
  prediksi?: number;
  predicted_price?: number;
  tanggal?: string;
  created_at?: string;
  date?: string;
}

const History: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Fungsi Mengambil Data Riwayat dari Backend Flask
  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('http://127.0.0.1:5000/history');
      
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      let list: HistoryItem[] = [];
      if (Array.isArray(result)) {
        list = result;
      } else if (result && Array.isArray(result.data)) {
        list = result.data;
      } else if (result && Array.isArray(result.history)) {
        list = result.history;
      }

      setHistoryData(list);
    } catch (err) {
      console.error("Gagal mengambil history:", err);
      setErrorMsg("Gagal terhubung ke backend. Pastikan server Flask berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);

  // Fungsi Hapus Riwayat
  const handleClear = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat?")) return;
    try {
      await fetch('http://127.0.0.1:5000/history', { method: 'DELETE' });
      setHistoryData([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Gagal menghapus riwayat.");
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>📜 Riwayat Prediksi</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Daftar seluruh perhitungan prediksi harga rumah Anda.</p>
        </div>
        <div>
          <button 
            onClick={fetchHistory}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Data
          </button>
          <button 
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🗑️ Hapus Riwayat
          </button>
        </div>
      </div>

      {loading && <p style={{ color: '#64748b' }}>Sedang memuat data riwayat...</p>}

      {errorMsg && (
        <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px' }}>No</th>
                <th style={{ padding: '12px 16px' }}>Luas Tanah</th>
                <th style={{ padding: '12px 16px' }}>Harga Prediksi</th>
                <th style={{ padding: '12px 16px' }}>Waktu / Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(historyData) && historyData.length > 0 ? (
                historyData.map((item: HistoryItem, index: number) => {
                  const luas = item?.luas_tanah ?? item?.luas ?? 0;
                  const harga = item?.harga_prediksi ?? item?.harga ?? item?.prediksi ?? 0;
                  const tanggal = item?.tanggal ?? item?.created_at ?? item?.date ?? '-';

                  return (
                    <tr key={item?.id ?? index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{index + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#0f172a' }}>{luas} m²</td>
                      <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: 'bold' }}>
                        Rp {Number(harga).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{tanggal}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    Belum ada riwayat prediksi yang tersimpan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;