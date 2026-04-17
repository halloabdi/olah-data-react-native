import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Calculator, 
  Map, 
  PieChart, 
  TrendingUp, 
  Building2, 
  Wallet, 
  Users, 
  Droplet, 
  Bird,
  Plus,
  Trash2,
  AlertCircle,
  ChevronDown,
  Check,
  Save,
  RefreshCw,
  Database
} from 'lucide-react';

// --- DATA PROVINSI BERDASARKAN DOKUMEN (38 PROVINSI) ---
const PROVINCES_DATA = [
  { id: 1, name: "Nanggroe Aceh Darussalam", njopTanah: 170000, njopBgn: 1440000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 2, name: "Sumatera Utara", njopTanah: 440000, njopBgn: 1250000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 3, name: "Sumatera Barat", njopTanah: 240000, njopBgn: 1270000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 4, name: "Riau", njopTanah: 360000, njopBgn: 1070000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 5, name: "Kepulauan Riau", njopTanah: 310000, njopBgn: 690000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 6, name: "Jambi", njopTanah: 160000, njopBgn: 940000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 7, name: "Bengkulu", njopTanah: 340000, njopBgn: 1200000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 8, name: "Sumatera Selatan", njopTanah: 140000, njopBgn: 1340000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 9, name: "Kepulauan Bangka Belitung", njopTanah: 340000, njopBgn: 1080000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 10, name: "Lampung", njopTanah: 270000, njopBgn: 1270000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 11, name: "Banten", njopTanah: 340000, njopBgn: 1310000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 12, name: "DKI Jakarta", njopTanah: 300000, njopBgn: 840000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 13, name: "Jawa Barat", njopTanah: 230000, njopBgn: 1000000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 14, name: "Jawa Tengah", njopTanah: 450000, njopBgn: 830000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 15, name: "DI Yogyakarta", njopTanah: 180000, njopBgn: 1130000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 16, name: "Jawa Timur", njopTanah: 200000, njopBgn: 1260000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 17, name: "Bali", njopTanah: 430000, njopBgn: 1200000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 18, name: "Nusa Tenggara Barat", njopTanah: 170000, njopBgn: 1050000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 19, name: "Nusa Tenggara Timur", njopTanah: 420000, njopBgn: 1140000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 20, name: "Kalimantan Barat", njopTanah: 190000, njopBgn: 1470000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 21, name: "Kalimantan Tengah", njopTanah: 300000, njopBgn: 520000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 22, name: "Kalimantan Selatan", njopTanah: 250000, njopBgn: 600000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 23, name: "Kalimantan Timur", njopTanah: 180000, njopBgn: 1200000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 24, name: "Kalimantan Utara", njopTanah: 230000, njopBgn: 1460000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 25, name: "Sulawesi Utara", njopTanah: 380000, njopBgn: 1070000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 26, name: "Gorontalo", njopTanah: 110000, njopBgn: 1200000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 },
  { id: 27, name: "Sulawesi Tengah", njopTanah: 500000, njopBgn: 790000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 28, name: "Sulawesi Barat", njopTanah: 250000, njopBgn: 1350000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 29, name: "Sulawesi Selatan", njopTanah: 460000, njopBgn: 810000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 30, name: "Sulawesi Tenggara", njopTanah: 370000, njopBgn: 1040000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 31, name: "Maluku", njopTanah: 130000, njopBgn: 1430000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 32, name: "Maluku Utara", njopTanah: 440000, njopBgn: 670000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 3000, tarifAir: 0.2 },
  { id: 33, name: "Papua", njopTanah: 140000, njopBgn: 1200000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 34, name: "Papua Barat", njopTanah: 250000, njopBgn: 1020000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 5000, tarifAir: 0.2 },
  { id: 35, name: "Papua Selatan", njopTanah: 200000, njopBgn: 500000, tarifPbb: 0.0015, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 36, name: "Papua Tengah", njopTanah: 450000, njopBgn: 690000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 4000, tarifAir: 0.2 },
  { id: 37, name: "Papua Pegunungan", njopTanah: 440000, njopBgn: 1450000, tarifPbb: 0.002, njoptkp: 10000000, airDasar: 2000, tarifAir: 0.2 },
  { id: 38, name: "Papua Barat Daya", njopTanah: 420000, njopBgn: 700000, tarifPbb: 0.001, njoptkp: 10000000, airDasar: 6000, tarifAir: 0.2 }
];

const formatIDR = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

// Komponen Dropdown Kustom Modern
const CustomDropdown = ({ options, value, onChange, placeholder, triggerClassName, activeItemClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => String(opt.value) === String(value))?.label || placeholder;

  return (
    <div className="relative w-full text-left font-sans" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between w-full outline-none transition-all cursor-pointer ${triggerClassName} ${isOpen ? 'ring-2' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={20} className={`transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => {
              const isActive = String(opt.value) === String(value);
              return (
                <li
                  key={opt.value}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${isActive ? activeItemClassName : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{opt.label}</span>
                  {isActive && <Check size={16} className="shrink-0 text-current" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State Transaksi & Aset dengan Cache (LocalStorage)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('pajakProTransactions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load cache:', e);
    }
    // Default data jika cache kosong
    return [
      { id: 1, name: 'Kandang Ayam Layer', type: 'aset', amount: 50000000, date: '2026-01-10' },
      { id: 2, name: 'Pinjaman Bank (Modal)', type: 'liabilitas', amount: 30000000, date: '2026-01-15' },
      { id: 3, name: 'Penjualan Telur Bulan 1', type: 'pemasukan', amount: 15000000, date: '2026-02-01' },
      { id: 4, name: 'Pakan & Vitamin', type: 'pengeluaran', amount: 8000000, date: '2026-02-05' },
    ];
  });

  // Menyimpan ke LocalStorage setiap kali transaksi berubah
  useEffect(() => {
    localStorage.setItem('pajakProTransactions', JSON.stringify(transactions));
  }, [transactions]);
  
  const [formTx, setFormTx] = useState({ name: '', type: 'pemasukan', amount: '' });

  // State Hitung Usaha (Analisis)
  const [hitungSource, setHitungSource] = useState('cache'); // 'cache' | 'manual'
  const [manualHitungForm, setManualHitungForm] = useState({ pemasukan: 0, pengeluaran: 0, aset: 0 });

  // State Pajak Nasional
  const [natTaxForm, setNatTaxForm] = useState({
    omzetTahunan: 4500000000,
    labaBersih: 800000000,
    gajiKaryawanTahunan: 120000000,
    trxPemerintah: 100000000,
    trxSewaJasa: 80000000,
    penjualanKenaPPN: 150000000
  });

  // State Pajak Daerah
  const [selectedProvId, setSelectedProvId] = useState(1);
  const [regTaxForm, setRegTaxForm] = useState({
    luasTanah: 50000,
    luasBangunan: 1000,
    volAir: 13000,
    nilaiWalet: 107000000
  });

  // Derived Financial Data (Berdasarkan Cache Tabel)
  const cachedSummary = useMemo(() => {
    let pemasukan = 0, pengeluaran = 0, aset = 0, liabilitas = 0;
    transactions.forEach(t => {
      if(t.type === 'pemasukan') pemasukan += t.amount;
      if(t.type === 'pengeluaran') pengeluaran += t.amount;
      if(t.type === 'aset') aset += t.amount;
      if(t.type === 'liabilitas') liabilitas += t.amount;
    });
    const labaBersih = pemasukan - pengeluaran;
    const ekuitas = aset - liabilitas;
    const rcRatio = pengeluaran > 0 ? (pemasukan / pengeluaran).toFixed(2) : 0;
    const paybackPeriod = labaBersih > 0 ? (aset / labaBersih).toFixed(1) : 0; 

    return { pemasukan, pengeluaran, labaBersih, aset, liabilitas, ekuitas, rcRatio, paybackPeriod };
  }, [transactions]);

  // Active Summary (Dipilih berdasarkan opsi sumber data di Hitung Usaha)
  const activeSummary = useMemo(() => {
    if (hitungSource === 'cache') {
      return cachedSummary;
    } else {
      const pemasukan = Number(manualHitungForm.pemasukan);
      const pengeluaran = Number(manualHitungForm.pengeluaran);
      const aset = Number(manualHitungForm.aset);
      const labaBersih = pemasukan - pengeluaran;
      const rcRatio = pengeluaran > 0 ? (pemasukan / pengeluaran).toFixed(2) : 0;
      const paybackPeriod = labaBersih > 0 ? (aset / labaBersih).toFixed(1) : 0;
      return { pemasukan, pengeluaran, labaBersih, aset, liabilitas: 0, ekuitas: 0, rcRatio, paybackPeriod };
    }
  }, [hitungSource, cachedSummary, manualHitungForm]);

  // Handlers
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formTx.name || !formTx.amount) return;
    setTransactions([
      ...transactions, 
      { id: Date.now(), name: formTx.name, type: formTx.type, amount: Number(formTx.amount), date: new Date().toISOString().split('T')[0] }
    ]);
    setFormTx({ name: '', type: 'pemasukan', amount: '' });
    setActiveTab('kelolaUsaha'); // Lempar ke tabel setelah input sukses
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const clearAllData = () => {
    if(window.confirm("Apakah Anda yakin ingin menghapus semua data pencatatan? Aksi ini tidak dapat dikembalikan.")) {
      setTransactions([]);
    }
  };

  // Kalkulasi Pajak Nasional Berdasarkan Rumus
  const pphBadan = natTaxForm.omzetTahunan <= 4800000000 
    ? natTaxForm.omzetTahunan * 0.005 
    : natTaxForm.labaBersih * 0.22;
  
  const biayaJabatan = Math.min(natTaxForm.gajiKaryawanTahunan * 0.05, 6000000);
  const pkp = Math.max(0, natTaxForm.gajiKaryawanTahunan - biayaJabatan - 54000000);
  const pph21 = pkp * 0.05; 

  const pph22 = natTaxForm.trxPemerintah * 0.015;
  const pph23 = natTaxForm.trxSewaJasa * 0.02;
  const ppn = natTaxForm.penjualanKenaPPN * 0.11; 

  // Kalkulasi Pajak Daerah Berdasarkan Provinsi
  const prov = PROVINCES_DATA.find(p => p.id === Number(selectedProvId)) || PROVINCES_DATA[0];
  const njopTotal = (regTaxForm.luasTanah * prov.njopTanah) + (regTaxForm.luasBangunan * prov.njopBgn);
  const pbbP2 = Math.max(0, (njopTotal - prov.njoptkp)) * prov.tarifPbb;
  const pajakAir = regTaxForm.volAir * prov.airDasar * prov.tarifAir;
  const pajakWalet = regTaxForm.nilaiWalet * 0.1; 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl transition-all duration-300">
        <div className="p-6 pb-2 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Pajak<span className="text-teal-400">Pro</span></h1>
        </div>
        
        <div className="p-4 flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Utama' },
            { id: 'inputItem', icon: Plus, label: 'Input Item Baru' },
            { id: 'kelolaUsaha', icon: Database, label: 'Kelola Usaha & Neraca' },
            { id: 'hitungUsaha', icon: PieChart, label: 'Hitung Usaha (Analisis)' },
            { id: 'pajakNasional', icon: Calculator, label: 'Pajak Nasional' },
            { id: 'pajakDaerah', icon: Map, label: 'Pajak Daerah' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-teal-500/20 text-teal-400 font-semibold shadow-inner border border-teal-500/30' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Ringkasan Bisnis & Pajak</h2>
              <p className="text-slate-500 mt-1">Pantau performa keuangan dari data cache dan estimasi pajak.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Pemasukan', value: cachedSummary.pemasukan, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                { label: 'Total Pengeluaran', value: cachedSummary.pengeluaran, icon: Receipt, color: 'text-rose-600', bg: 'bg-rose-100' },
                { label: 'Aset Produktif', value: cachedSummary.aset, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'Laba Bersih Saat Ini', value: cachedSummary.labaBersih, icon: Wallet, color: 'text-teal-600', bg: 'bg-teal-100' }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                      <card.icon size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatIDR(card.value)}</h3>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-4">Estimasi Pajak Berjalan (Simulasi)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator size={64} /></div>
                <p className="text-slate-400 text-sm">PPh Badan (Estimasi)</p>
                <h3 className="text-3xl font-bold mt-2 text-teal-400">{formatIDR(pphBadan)}</h3>
                <p className="text-xs text-slate-400 mt-4">
                  {natTaxForm.omzetTahunan <= 4800000000 ? 'Tarif UMKM 0.5% (PP 55/2022)' : 'Tarif Normal 22%'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Map size={64} /></div>
                <p className="text-blue-200 text-sm">PBB-P2 (Prov. {prov.name})</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{formatIDR(pbbP2)}</h3>
                <p className="text-xs text-blue-200 mt-4">Pajak Daerah Tanah & Bangunan</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <div className="relative w-24 h-24 rounded-full border-8 border-slate-100 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-8 border-teal-500" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${cachedSummary.rcRatio > 1 ? '100%' : '50%'}, 0 100%)`}}></div>
                  <span className="text-xl font-bold text-slate-800 z-10">{cachedSummary.rcRatio}</span>
                </div>
                <p className="text-sm font-semibold text-slate-600">R/C Ratio Saat Ini</p>
                <p className={`text-xs mt-1 ${cachedSummary.rcRatio > 1 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {cachedSummary.rcRatio > 1 ? 'Usaha Layak (Menguntungkan)' : 'Perlu Evaluasi (Rugi)'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: INPUT ITEM --- */}
        {activeTab === 'inputItem' && (
          <div className="animate-in fade-in duration-500 flex justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Plus size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Tambah Catatan Keuangan</h2>
                  <p className="text-slate-500 mt-2">Data yang ditambahkan akan tersimpan otomatis di cache perangkat Anda.</p>
               </div>
               
               <form onSubmit={handleAddTransaction} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Nama Item/Jasa</label>
                    <input type="text" required value={formTx.name} onChange={e=>setFormTx({...formTx, name: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-lg" placeholder="Cth: Kandang Sapi, Pakan, dsb." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Kategori Keuangan</label>
                    <CustomDropdown 
                      options={[
                        { value: 'pemasukan', label: 'Pemasukan (Revenue)' },
                        { value: 'pengeluaran', label: 'Pengeluaran (Expense)' },
                        { value: 'aset', label: 'Aset Produktif (Investment)' },
                        { value: 'liabilitas', label: 'Liabilitas (Hutang)' }
                      ]}
                      value={formTx.type}
                      onChange={(val) => setFormTx({...formTx, type: val})}
                      triggerClassName="p-4 rounded-xl border border-slate-200 bg-white ring-teal-500 hover:border-slate-300 text-slate-700 text-lg"
                      activeItemClassName="bg-teal-50 text-teal-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Nominal (Rupiah)</label>
                    <input type="number" required value={formTx.amount} onChange={e=>setFormTx({...formTx, amount: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-lg font-mono" placeholder="0" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors shadow-xl shadow-teal-500/30 flex justify-center items-center gap-2">
                    <Save size={20} /> Simpan Data Ke Cache
                  </button>
                </form>
            </div>
          </div>
        )}

        {/* --- TAB: KELOLA USAHA & NERACA --- */}
        {activeTab === 'kelolaUsaha' && (
          <div className="animate-in fade-in duration-500">
             <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Kelola Usaha & Neraca</h2>
                <p className="text-slate-500 mt-1">Daftar item tercatat dan keseimbangan neraca keuangan.</p>
              </div>
              <button onClick={clearAllData} className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 font-medium flex items-center gap-2 transition-colors">
                <Trash2 size={18} /> Hapus Semua Data Cache
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               {/* Aktiva (Aset) */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2"><Building2 size={24}/> AKTIVA (ASET)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-blue-800">
                    <span>Aset Produktif (Investasi)</span>
                    <span className="font-semibold text-lg">{formatIDR(cachedSummary.aset)}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-800">
                    <span>Kas (Laba / Pemasukan Sisa)</span>
                    <span className="font-semibold text-lg">{formatIDR(Math.max(0, cachedSummary.pemasukan - cachedSummary.pengeluaran))}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-blue-200 flex justify-between items-center text-xl font-bold text-blue-900">
                  <span>TOTAL AKTIVA</span>
                  <span>{formatIDR(cachedSummary.aset + Math.max(0, cachedSummary.labaBersih))}</span>
                </div>
              </div>

              {/* Pasiva (Kewajiban & Ekuitas) */}
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2"><Wallet size={24}/> PASIVA (KEWAJIBAN + EKUITAS)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-amber-800">
                    <span>Liabilitas (Hutang)</span>
                    <span className="font-semibold text-lg">{formatIDR(cachedSummary.liabilitas)}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-800">
                    <span>Ekuitas / Modal Bersih</span>
                    <span className="font-semibold text-lg">{formatIDR(cachedSummary.ekuitas + Math.max(0, cachedSummary.labaBersih))}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-amber-200 flex justify-between items-center text-xl font-bold text-amber-900">
                  <span>TOTAL PASIVA</span>
                  <span>{formatIDR(cachedSummary.liabilitas + cachedSummary.ekuitas + Math.max(0, cachedSummary.labaBersih))}</span>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Database size={20} className="text-slate-500" /> Basis Data Tercatat (Tersimpan di Perangkat)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm">
                      <th className="p-4 font-medium border-b border-slate-100">Tanggal</th>
                      <th className="p-4 font-medium border-b border-slate-100">Nama Item</th>
                      <th className="p-4 font-medium border-b border-slate-100">Kategori</th>
                      <th className="p-4 font-medium border-b border-slate-100 text-right">Nominal</th>
                      <th className="p-4 font-medium border-b border-slate-100 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-slate-400">Belum ada data di cache. Silakan tambah di menu Input Item.</td></tr>
                    ) : transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                        <td className="p-4 text-sm text-slate-500">{t.date}</td>
                        <td className="p-4 font-medium text-slate-700">{t.name}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${t.type === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 
                              t.type === 'pengeluaran' ? 'bg-rose-100 text-rose-700' : 
                              t.type === 'aset' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="p-4 text-right font-medium text-slate-700">{formatIDR(t.amount)}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteTransaction(t.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: HITUNG USAHA (ANALISIS) --- */}
        {activeTab === 'hitungUsaha' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Hitung & Analisis Usaha</h2>
              <p className="text-slate-500 mt-1">Evaluasi kelayakan menggunakan rumus R/C Ratio dan Payback Period.</p>
            </header>

            {/* OPSI SUMBER DATA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
               <h3 className="text-lg font-semibold mb-4 text-slate-700">Pilih Sumber Data Analisis</h3>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setHitungSource('cache')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${hitungSource === 'cache' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500 hover:border-teal-300'}`}
                  >
                    <Database size={28} />
                    <span className="font-bold">Gunakan Data Cache (Tersimpan)</span>
                    <span className="text-xs opacity-70 text-center">Menarik data dari inputan yang ada di tabel Kelola Usaha.</span>
                  </button>

                  <button 
                    onClick={() => setHitungSource('manual')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${hitungSource === 'manual' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                  >
                    <Calculator size={28} />
                    <span className="font-bold">Input Simulasi Manual (Baru)</span>
                    <span className="text-xs opacity-70 text-center">Ketik angka baru untuk sekadar menghitung (tidak disimpan).</span>
                  </button>
               </div>
            </div>

            {/* FORM INPUT MANUAL (HANYA MUNCUL JIKA DIPILIH) */}
            {hitungSource === 'manual' && (
               <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-indigo-900 mb-4">Input Angka Simulasi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-indigo-800 mb-1">Total Pemasukan (Rp)</label>
                        <input type="number" value={manualHitungForm.pemasukan} onChange={e => setManualHitungForm({...manualHitungForm, pemasukan: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-400 font-mono" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-indigo-800 mb-1">Total Pengeluaran (Rp)</label>
                        <input type="number" value={manualHitungForm.pengeluaran} onChange={e => setManualHitungForm({...manualHitungForm, pengeluaran: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-400 font-mono" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-indigo-800 mb-1">Total Aset / Investasi (Rp)</label>
                        <input type="number" value={manualHitungForm.aset} onChange={e => setManualHitungForm({...manualHitungForm, aset: e.target.value})} className="w-full p-3 rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-400 font-mono" />
                     </div>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* R/C Ratio Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">R/C Ratio (Return Cost Ratio)</h3>
                  <div className="text-5xl font-extrabold text-slate-800 my-4">
                    {activeSummary.rcRatio}
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Rumus: Pemasukan ({formatIDR(activeSummary.pemasukan)}) / Pengeluaran ({formatIDR(activeSummary.pengeluaran)})</p>
                  
                  {activeSummary.rcRatio > 1 ? (
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-medium text-sm">
                      <TrendingUp size={16} /> Usaha Menguntungkan (R/C &gt; 1)
                    </div>
                  ) : activeSummary.rcRatio == 1 ? (
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium text-sm">
                      <AlertCircle size={16} /> Impas / Break Even Point (R/C = 1)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full font-medium text-sm">
                      <TrendingUp size={16} className="rotate-180" /> Usaha Merugi (R/C &lt; 1)
                    </div>
                  )}
                </div>
              </div>

              {/* Payback Period Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">Payback Period</h3>
                  <div className="text-5xl font-extrabold text-slate-800 my-4">
                    {activeSummary.paybackPeriod} <span className="text-2xl text-slate-400 font-medium">Periode</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Rumus: Aset ({formatIDR(activeSummary.aset)}) / Laba Bersih ({formatIDR(activeSummary.labaBersih)})</p>
                  
                  {activeSummary.paybackPeriod > 0 ? (
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium text-sm">
                      Modal kembali dalam {activeSummary.paybackPeriod} periode.
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-full font-medium text-sm">
                      Belum ada laba bersih atau aset.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: PAJAK NASIONAL --- */}
        {activeTab === 'pajakNasional' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Kalkulator Pajak Nasional</h2>
              <p className="text-slate-500 mt-1">Perhitungan PPh Badan, PPh 21, 22, 23, dan PPN sesuai peraturan pemerintah.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bagian kode pajak ini tetap sama */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 bg-slate-100 p-2 rounded-lg">1. PPh Badan Usaha</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Omzet Tahunan (Peredaran Bruto)</label>
                      <input type="number" value={natTaxForm.omzetTahunan} onChange={e=>setNatTaxForm({...natTaxForm, omzetTahunan: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                    </div>
                    {natTaxForm.omzetTahunan > 4800000000 && (
                      <div className="animate-in fade-in">
                        <label className="block text-xs text-slate-500 mb-1">Penghasilan Kena Pajak (Laba Bersih Fiskal)</label>
                        <input type="number" value={natTaxForm.labaBersih} onChange={e=>setNatTaxForm({...natTaxForm, labaBersih: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 bg-slate-100 p-2 rounded-lg">2. PPh Pasal 21 (Karyawan)</h3>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Gaji Karyawan Setahun (TK/0)</label>
                    <input type="number" value={natTaxForm.gajiKaryawanTahunan} onChange={e=>setNatTaxForm({...natTaxForm, gajiKaryawanTahunan: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 bg-slate-100 p-2 rounded-lg">3. PPh Ps 22 & 23, PPN</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Transaksi Bendahara Pemerintah (PPh 22)</label>
                      <input type="number" value={natTaxForm.trxPemerintah} onChange={e=>setNatTaxForm({...natTaxForm, trxPemerintah: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Transaksi Sewa & Jasa (PPh 23)</label>
                      <input type="number" value={natTaxForm.trxSewaJasa} onChange={e=>setNatTaxForm({...natTaxForm, trxSewaJasa: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Penjualan Kena PPN</label>
                      <input type="number" value={natTaxForm.penjualanKenaPPN} onChange={e=>setNatTaxForm({...natTaxForm, penjualanKenaPPN: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-teal-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">PPh Badan</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {natTaxForm.omzetTahunan <= 4800000000 ? 'Skala UMKM (Omzet x 0,5% PP 55/2022)' : 'Skala Menengah/Besar (Laba x 22%)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{formatIDR(pphBadan)}</p>
                      <p className="text-xs text-slate-400">/ tahun</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">PPh Pasal 21</h4>
                      <p className="text-xs text-slate-500 mt-1">Gaji - Biaya Jabatan (5%) - PTKP (54jt) x 5%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{formatIDR(pph21)}</p>
                      <p className="text-xs text-slate-400">/ tahun</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800">PPh 22</h4>
                      <p className="text-xs text-slate-500 mb-2">Tarif 1,5%</p>
                      <p className="text-xl font-bold text-amber-600">{formatIDR(pph22)}</p>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800">PPh 23</h4>
                      <p className="text-xs text-slate-500 mb-2">Sewa/Jasa 2%</p>
                      <p className="text-xl font-bold text-amber-600">{formatIDR(pph23)}</p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">PPN (Pajak Pertambahan Nilai)</h4>
                      <p className="text-xs text-slate-500 mt-1">DPP x 11%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{formatIDR(ppn)}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- TAB: PAJAK DAERAH --- */}
        {activeTab === 'pajakDaerah' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Pajak Daerah (Fokus Peternakan)</h2>
              <p className="text-slate-500 mt-1">Perhitungan PBB-P2, Pajak Air Tanah, dan Pajak Walet di 38 Provinsi Indonesia.</p>
            </header>

            <div className="bg-indigo-600 text-white p-6 rounded-2xl mb-8 shadow-lg flex flex-col md:flex-row gap-6 items-center">
              <Map size={48} className="text-indigo-200 opacity-80" />
              <div className="flex-1 w-full">
                <label className="block text-indigo-200 text-sm mb-2">Pilih Provinsi Lokasi Usaha Anda</label>
                <CustomDropdown 
                  options={PROVINCES_DATA.map(p => ({ value: p.id, label: p.name }))}
                  value={selectedProvId}
                  onChange={(val) => setSelectedProvId(Number(val))}
                  triggerClassName="bg-indigo-700 text-white text-lg font-semibold p-4 rounded-xl border border-indigo-500 ring-white/50 hover:bg-indigo-600 shadow-inner"
                  activeItemClassName="bg-indigo-50 text-indigo-700 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Map size={18}/> Data PBB-P2</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Luas Tanah (m²)</label>
                      <input type="number" value={regTaxForm.luasTanah} onChange={e=>setRegTaxForm({...regTaxForm, luasTanah: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Luas Bangunan (m²)</label>
                      <input type="number" value={regTaxForm.luasBangunan} onChange={e=>setRegTaxForm({...regTaxForm, luasBangunan: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">*NJOP Tarif Dasar Provinsi {prov.name} diterapkan otomatis.</p>
                </div>

                <hr className="border-slate-100"/>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Droplet size={18}/> Data Pajak Air Tanah</h3>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Volume Air Tanah (m³)</label>
                    <input type="number" value={regTaxForm.volAir} onChange={e=>setRegTaxForm({...regTaxForm, volAir: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <hr className="border-slate-100"/>

                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Bird size={18}/> Pajak Sarang Burung Walet</h3>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Nilai Jual Panen (Rp)</label>
                    <input type="number" value={regTaxForm.nilaiWalet} onChange={e=>setRegTaxForm({...regTaxForm, nilaiWalet: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-teal-500 relative overflow-hidden">
                  <Building2 size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50" />
                  <h4 className="font-bold text-slate-800 text-lg mb-1">PBB-P2 (Pajak Bumi & Bangunan)</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    ((L.Tanah x NJOP) + (L.Bgn x NJOP) - NJOPTKP) x {(prov.tarifPbb * 100).toFixed(2)}%
                  </p>
                  <p className="text-3xl font-extrabold text-teal-600 mb-2">{formatIDR(pbbP2)} <span className="text-sm text-slate-400 font-normal">/ tahun</span></p>
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded mt-2">
                    Nilai Tanah: {formatIDR(regTaxForm.luasTanah * prov.njopTanah)} | Nilai Bgn: {formatIDR(regTaxForm.luasBangunan * prov.njopBgn)}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 relative overflow-hidden">
                   <Droplet size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50" />
                   <h4 className="font-bold text-slate-800 text-lg mb-1">Pajak Air Tanah</h4>
                   <p className="text-xs text-slate-500 mb-4">Volume x Nilai Dasar Baku (Rp {prov.airDasar}) x 20%</p>
                   <p className="text-3xl font-extrabold text-blue-600">{formatIDR(pajakAir)} <span className="text-sm text-slate-400 font-normal">/ bulan</span></p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500 relative overflow-hidden">
                   <Bird size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50" />
                   <h4 className="font-bold text-slate-800 text-lg mb-1">Pajak Sarang Walet</h4>
                   <p className="text-xs text-slate-500 mb-4">Nilai Jual Panen x Tarif Maks Daerah (10%)</p>
                   <p className="text-3xl font-extrabold text-amber-600">{formatIDR(pajakWalet)} <span className="text-sm text-slate-400 font-normal">/ panen</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
