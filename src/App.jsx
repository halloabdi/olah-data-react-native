import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LineChart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ArrowLeftRight, 
  BookOpen, 
  Settings, 
  CheckCircle 
} from 'lucide-react';
import Chart from 'chart.js/auto';

// --- 1. KONFIGURASI & DATA GENERATOR ---

const THRESHOLDS = {
  hsi: { safe: 155, warning: 165 },
  temp: { safe: 28, warning: 33 },
  humidity: { min: 60, max: 70 }
};

const DATES = [
  "2025-12-12", "2025-12-13", "2025-12-14", 
  "2025-12-15", "2025-12-16", "2025-12-17", "2025-12-18"
];

const generateHourlyData = (baseValue, variance, isRandom = true) => {
  let data = [];
  for (let i = 0; i < 24; i++) {
    let timeFactor = 0;
    if (i >= 9 && i <= 15) timeFactor = 1; // Siang panas
    else if (i >= 0 && i <= 5) timeFactor = -1; // Malam dingin

    let val = baseValue + (timeFactor * variance);
    if (isRandom) val += (Math.random() * 2 - 1);
    data.push(parseFloat(val.toFixed(1)));
  }
  return data;
};

// --- 2. KOMPONEN UTAMA ---

export default function App() {
  const [currentKandang, setCurrentKandang] = useState('A');
  const [selectedDate, setSelectedDate] = useState('all');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Generate Data Sekali Saja (Memoized)
  const db = useMemo(() => {
    const database = { A: {}, B: {} };
    DATES.forEach(date => {
      // Kandang A
      const tempA = generateHourlyData(26, 4);
      const humA = generateHourlyData(80, -10);
      const hsiA = tempA.map((t, i) => parseFloat((t + humA[i] + (t * 0.5)).toFixed(1)));
      
      database.A[date] = { temp: tempA, humidity: humA, hsi: hsiA };

      // Kandang B
      const tempB = generateHourlyData(26.5, 3.5);
      const humB = generateHourlyData(82, -8);
      const hsiB = tempB.map((t, i) => parseFloat((t + humB[i] + (t * 0.5)).toFixed(1)));
      
      database.B[date] = { temp: tempB, humidity: humB, hsi: hsiB };
    });
    return database;
  }, []);

  // --- LOGIKA CHART ---
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Hapus chart lama jika ada
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Helper Gradient
    const createGradient = (ctx, colorStart, colorEnd) => {
      const gradient = ctx.createLinearGradient(0, 500, 0, 0);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      return gradient;
    };

    const getColorBasedOnValue = (type, value) => {
      if (type === 'temp') {
        if (value < THRESHOLDS.temp.safe) return ['#1e3a8a', '#22c55e'];
        if (value > THRESHOLDS.temp.warning) return ['#1e3a8a', '#ef4444'];
        return ['#1e3a8a', '#1e3a8a'];
      }
      if (type === 'humidity') {
        if (value > THRESHOLDS.humidity.max) return ['#3b82f6', '#f97316'];
        return ['#3b82f6', '#22c55e'];
      }
      if (type === 'hsi') {
        if (value > THRESHOLDS.hsi.warning) return ['#bfdbfe', '#7f1d1d'];
        if (value < THRESHOLDS.hsi.safe) return ['#bfdbfe', '#22c55e'];
        return ['#bfdbfe', '#f97316'];
      }
      return ['#ccc', '#ccc'];
    };

    // Siapkan Data Chart
    let labels = [];
    let datasets = {
      temp: { data: [], bg: [] },
      humidity: { data: [], bg: [] },
      hsi: { data: [], bg: [] }
    };

    const data = db[currentKandang];
    const datesToShow = selectedDate === 'all' ? DATES : [selectedDate];

    datesToShow.forEach(d => {
      if (!data[d]) return;
      for (let i = 0; i < 24; i++) {
        labels.push(`${d.slice(8)} | ${String(i).padStart(2, '0')}:00`);

        const t = data[d].temp[i];
        const h = data[d].humidity[i];
        const hs = data[d].hsi[i];

        datasets.temp.data.push(t);
        const cT = getColorBasedOnValue('temp', t);
        datasets.temp.bg.push(createGradient(ctx, cT[0], cT[1]));

        datasets.humidity.data.push(h);
        const cH = getColorBasedOnValue('humidity', h);
        datasets.humidity.bg.push(createGradient(ctx, cH[0], cH[1]));

        datasets.hsi.data.push(hs);
        const cHS = getColorBasedOnValue('hsi', hs);
        datasets.hsi.bg.push(createGradient(ctx, cHS[0], cHS[1]));
      }
    });

    // Inisialisasi Chart Baru
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: datasets.temp.data,
            backgroundColor: datasets.temp.bg,
            borderRadius: 4,
            order: 2,
            barPercentage: 0.8,
            categoryPercentage: 0.9
          },
          {
            label: 'Kelembapan (%)',
            data: datasets.humidity.data,
            backgroundColor: datasets.humidity.bg,
            borderRadius: 4,
            order: 3,
            barPercentage: 0.8,
            categoryPercentage: 0.9
          },
          {
            label: 'HSI',
            data: datasets.hsi.data,
            backgroundColor: datasets.hsi.bg,
            borderRadius: 4,
            order: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.9
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxRotation: 45, minRotation: 45 }
          },
          y: {
            beginAtZero: true,
            grid: { borderDash: [2, 2] }
          }
        }
      }
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentKandang, selectedDate, db]);


  // --- RENDER TABLE HELPER ---
  const renderTableRows = () => {
    const rows = [];
    const data = db[currentKandang];
    const datesToShow = selectedDate === 'all' ? DATES : [selectedDate];

    datesToShow.forEach(date => {
      if (!data[date]) return;

      const metrics = [
        { label: 'Suhu (°C)', key: 'temp', color: 'text-blue-900' },
        { label: 'Kelembapan (%)', key: 'humidity', color: 'text-blue-500' },
        { label: 'HSI', key: 'hsi', color: 'text-blue-400' }
      ];

      metrics.forEach((metric, idx) => {
        const values = data[date][metric.key];
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

        rows.push(
          <tr key={`${date}-${metric.key}`} className="hover:bg-gray-50 transition border-b border-gray-100">
            {idx === 0 && (
              <td rowSpan={3} className="px-4 py-2 font-medium bg-white border-r border-gray-200 sticky left-0 z-10 shadow-sm">
                {date}
              </td>
            )}
            <td className={`px-4 py-2 text-left font-medium ${metric.color} border-r border-gray-200`}>
              {metric.label}
            </td>
            {values.map((val, hIdx) => {
              let bgClass = '';
              if (metric.key === 'hsi') {
                if (val > THRESHOLDS.hsi.warning) bgClass = 'bg-red-100 text-red-700 font-bold';
                else if (val > THRESHOLDS.hsi.safe) bgClass = 'bg-orange-50 text-orange-600';
                else bgClass = 'bg-green-50 text-green-700';
              }
              return (
                <td key={hIdx} className={`px-2 py-1 border-r border-gray-100 ${bgClass}`}>
                  {val}
                </td>
              );
            })}
            <td className="px-4 py-2 font-bold bg-yellow-50 border-l border-gray-200">{avg}</td>
          </tr>
        );
      });
    });
    return rows;
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white">
                <LineChart size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Poultry Analytics</h1>
                <p className="text-xs text-gray-500 font-medium">Monitoring Closed House - Periode 4</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <CheckCircle size={10} /> Online
              </span>
              <button className="text-gray-500 hover:text-blue-700 transition">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Analisa Deskriptif Highlights */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-700 pl-3">
              Analisa Deskriptif: Fase Starter
            </h2>
            <div className="text-sm text-gray-500 italic">Data diambil dari Formulir Instrumen & Recording Periode 4</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card HSI */}
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Thermometer size={64} className="text-red-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">HSI Tertinggi (Starter)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">168.8</span>
                  <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">BAHAYA</span>
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="flex items-center gap-2"><Calendar size={14} /> Hari/Tanggal</span>
                    <span className="font-semibold">Rabu, 12 Nov 2025</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center gap-2"><Clock size={14} /> Waktu</span>
                    <span className="font-semibold">13:00 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Suhu */}
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Activity size={64} className="text-blue-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Suhu Tertinggi</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">34.9</span>
                  <span className="text-lg text-gray-500">°C</span>
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="flex items-center gap-2"><MapPin size={14} /> Lokasi</span>
                    <span className="font-semibold">Kandang A</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center gap-2"><Calendar size={14} /> Tanggal</span>
                    <span className="font-semibold">12 Nov 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Kelembapan */}
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Droplets size={64} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Kelembapan Tertinggi</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">99.0</span>
                  <span className="text-lg text-gray-500">%</span>
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="flex items-center gap-2"><AlertTriangle size={14} /> Status</span>
                    <span className="font-semibold text-orange-500">Waspada Basah</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center gap-2"><Clock size={14} /> Kejadian</span>
                    <span className="font-semibold">Malam/Dini Hari</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Chart Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Grafik Dinamis: Suhu, Kelembapan & HSI</h2>
              <p className="text-sm text-gray-500">Periode Fokus: 12 Desember - 18 Desember 2025</p>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setCurrentKandang('A')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${currentKandang === 'A' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Kandang A
              </button>
              <button 
                onClick={() => setCurrentKandang('B')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${currentKandang === 'B' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Kandang B
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-4 text-xs font-medium">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-900"></span> Suhu (°C)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Kelembapan (%)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-200"></span> HSI</div>
            <div className="ml-auto flex items-center gap-3 text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Aman</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-sm"></div> Waspada</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rounded-sm"></div> Bahaya</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mr-2">Pilih Tanggal:</label>
            <select 
              className="border border-gray-300 rounded-md shadow-sm text-sm p-1.5 focus:border-blue-500 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="all">Semua (12-18 Des)</option>
              {DATES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Scrollable Chart Container */}
          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
             <div className="min-w-[1000px] h-[500px] relative">
               <canvas ref={chartRef} id="mainChart"></canvas>
             </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            <ArrowLeftRight size={14} />
            <span>Geser ke kanan untuk melihat data jam berikutnya jika terpotong.</span>
          </div>
        </section>

        {/* 3. Data Table Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Rekapitulasi Data Harian</h2>
            <p className="text-sm text-gray-500">Format sesuai Instrumen Pengambilan Data Heat Stress</p>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-r border-gray-300 sticky left-0 bg-gray-100 z-10 shadow-sm">Tanggal</th>
                  <th rowSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-r border-gray-300">Variabel</th>
                  <th colSpan={24} className="px-2 py-2 font-semibold text-gray-700 border-b border-gray-300">Jam (WIB)</th>
                  <th rowSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-l border-gray-300 bg-yellow-50">Rata-Rata</th>
                </tr>
                <tr className="text-xs text-gray-500">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <th key={i} className="px-2 py-1 border-r border-gray-200 min-w-[50px]">
                      {String(i).padStart(2, '0')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. References */}
        <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} /> Daftar Referensi
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Maulana, M. I., Garnida, D., et al. (2021). <em>Kajian Performa Ayam Broiler Berdasarkan Iklim Mikro...</em> JANHUS J. Anim. Husb. Sci.</li>
            <li>Ramadhan, M. R., et al. (2025). <em>Stabilitas Termal pada Sistem Closed House...</em> Jurnal Ilmiah Peternakan Terpadu.</li>
            <li>Fitriah, U. A., et al. (2024). <em>Perbedaan Performa Pertumbuhan Ayam Broiler Fase Starter...</em> Jurnal Peternakan Lingkungan Tropis.</li>
            <li>Manual Manajemen Broiler Modern (Lohmann/Cobb Standards) untuk ambang batas HSI.</li>
          </ul>
        </section>

      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; 2026 Poultry Analytics System. Dikembangkan dengan React & Tailwind.
        </div>
      </footer>
    </div>
  );
}
