import React, { useState, useEffect } from 'react';

// Interface disesuaikan 100% dengan DashboardData dari App.tsx
interface DashboardData {
  total_dataset?: number;
  total_prediksi?: number;
  model?: string;
}

interface DashboardProps {
  dashboard?: DashboardData | null;
}

interface DataPoint {
  luas_tanah: number;
  harga: number;
}

const Dashboard: React.FC<DashboardProps> = ({ dashboard }) => {
  const [totalDataset, setTotalDataset] = useState<number>(dashboard?.total_dataset || 0);
  const [totalPredictions, setTotalPredictions] = useState<number>(dashboard?.total_prediksi || 0);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Data Dataset dari Backend untuk Grafik
      const resDataset = await fetch('http://127.0.0.1:5000/dataset');
      if (resDataset.ok) {
        const dataDataset = await resDataset.json();
        setTotalDataset(dataDataset.total_rows || dashboard?.total_dataset || 0);
        setChartData(dataDataset.data || []);
      }

      // 2. Ambil Total Riwayat Prediksi dari MySQL
      const resHistory = await fetch('http://127.0.0.1:5000/history');
      if (resHistory.ok) {
        const dataHistory = await resHistory.json();
        setTotalPredictions(Array.isArray(dataHistory) ? dataHistory.length : (dashboard?.total_prediksi || 0));
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard]);

  // Format Angka Rupiah Singkat untuk Sumbu Grafik (contoh: 500Jt / 1.2M)
  const formatShortPrice = (val: number) => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}M`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)}Jt`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}Rb`;
    return val.toString();
  };

  // Render Grafik SVG dengan Sumbu X & Y Lengkap
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', color: '#64748b' }}>
          <span style={{ fontSize: '28px', marginBottom: '8px' }}>📊</span>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Belum Ada Data Dataset</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Unggah file dataset CSV Anda pada menu Kelola Dataset untuk melihat grafik sebaran.</p>
        </div>
      );
    }

    const maxLuas = Math.max(...chartData.map(d => d.luas_tanah), 1);
    const maxHarga = Math.max(...chartData.map(d => d.harga), 1);

    const svgWidth = 900;
    const svgHeight = 320;
    const paddingLeft = 70;
    const paddingBottom = 50;
    const paddingTop = 20;
    const paddingRight = 30;

    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;

    // Kalkulasi Koordinat Titik
    const points = chartData.map(d => {
      const x = paddingLeft + (d.luas_tanah / maxLuas) * plotWidth;
      const y = paddingTop + plotHeight - (d.harga / maxHarga) * plotHeight;
      return { x, y, luas: d.luas_tanah, harga: d.harga };
    });

    return (
      <div style={{ width: '100%', overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 8px', border: '1px solid #f1f5f9' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', maxHeight: '340px' }}>
          {/* Background Grid Horizontal & Label Sumbu Y */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const yPos = paddingTop + plotHeight * (1 - ratio);
            const priceVal = maxHarga * ratio;
            return (
              <g key={`y-grid-${idx}`}>
                <line x1={paddingLeft} y1={yPos} x2={svgWidth - paddingRight} y2={yPos} stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <text x={paddingLeft - 10} y={yPos + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="sans-serif">
                  {formatShortPrice(priceVal)}
                </text>
              </g>
            );
          })}

          {/* Sumbu X & Y Line */}
          <line x1={paddingLeft} y1={paddingTop + plotHeight} x2={svgWidth - paddingRight} y2={paddingTop + plotHeight} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + plotHeight} stroke="#cbd5e1" strokeWidth="2" />

          {/* Label Sumbu X (Luas Tanah) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const xPos = paddingLeft + plotWidth * ratio;
            const luasVal = Math.round(maxLuas * ratio);
            return (
              <g key={`x-grid-${idx}`}>
                <text x={xPos} y={paddingTop + plotHeight + 20} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="sans-serif">
                  {luasVal} m²
                </text>
              </g>
            );
          })}

          {/* Garis Regresi Trendline */}
          {points.length > 1 && (
            <line
              x1={paddingLeft}
              y1={paddingTop + plotHeight - 30}
              x2={svgWidth - paddingRight}
              y2={paddingTop + 20}
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          )}

          {/* Titik Scatter Data */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#3b82f6"
              fillOpacity="0.75"
              stroke="#1d4ed8"
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <title>{`Luas: ${p.luas} m²\nHarga: Rp ${p.harga.toLocaleString('id-ID')}`}</title>
            </circle>
          ))}
        </svg>

        {/* Legend Sumbu Keterangan */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 24px 0 60px', fontSize: '12px', color: '#64748b' }}>
          <span>↖ Sumbu Y: <b>Harga Prediksi (Rp)</b></span>
          <span>Sumbu X: <b>Luas Tanah (m²)</b> ↘</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Dashboard Utama</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' }}>Pantau performa model AI dan data mining harga rumah secara real-time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 16px', borderRadius: '30px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#15803d' }}>Sistem Prediksi AI: Aktif</span>
        </div>
      </div>

      {/* 4 Kartu Statistik SaaS Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Card 1 */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#3b82f6' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>TOTAL DATASET</span>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 6px 0' }}>
            {loading ? '...' : totalDataset.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: '12px' }}>
            ✓ Baris Data Aktif
          </span>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#6366f1' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>ALGORITMA AI</span>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#4f46e5', margin: '14px 0 8px 0' }}>
            {dashboard?.model || 'Linear Regression'}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Supervised Learning</span>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#8b5cf6' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>TOTAL PREDIKSI</span>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '10px 0 6px 0' }}>
            {loading ? '...' : totalPredictions.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '3px 10px', borderRadius: '12px' }}>
            MySQL Riwayat Terhitung
          </span>
        </div>

        {/* Card 4 */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#10b981' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>STATUS SISTEM</span>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669', margin: '14px 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>●</span> Ready
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Koneksi API & Database Lancar</span>
        </div>

      </div>

      {/* Bagian Grafik Tren */}
      <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>📈 Tren Hubungan Luas Tanah & Harga</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Visualisasi sebaran data latih dataset dan garis estimasi regresi AI.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '6px 14px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '20px', fontWeight: '700', border: '1px solid #fecaca' }}>
            <span style={{ width: '12px', height: '2px', backgroundColor: '#dc2626', display: 'inline-block' }}></span>
            Regression Line
          </div>
        </div>

        {loading ? (
          <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Sedang memuat grafik sebaran data...
          </div>
        ) : renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;