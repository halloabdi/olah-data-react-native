import React, { useState, useEffect, useMemo } from 'react';
import { 
  Archive, Zap, ShieldCheck, Monitor, TrendingUp, 
  Search, Menu, X, Eye, Download, LayoutGrid, 
  FolderOpen, Info, LogIn, Filter, Check, ChevronLeft, ChevronRight,
  FileText, Calendar, User, FileDigit, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// CONFIGURATION & DUMMY DATA
// ==========================================

const DUMMY_DOCS = [
  {
    id: 1,
    timestamp: "2023-05-12 10:00:00",
    nama: "Ir. Soeraso, MP",
    nip: "1987654321004",
    jabatan: "Dosen",
    judul: "Modul Praktikum Produksi Ternak",
    kategori: "Umum",
    ringkasan: "Modul ini berisi panduan teknis pelaksanaan praktikum produksi ternak bagi mahasiswa. Di dalamnya terdapat prosedur keselamatan di laboratorium dan tata cara penanganan ternak yang baik. Modul ini wajib digunakan selama kegiatan praktikum semester genap.",
    format: "PDF",
    kepentingan: "Penting",
    privasi: "Publik",
    passdok: "-",
    expired: "-",
    kriteria: ["K-2.1"],
    tahun: "2022/2023",
    url: "https://drive.google.com/file/d/1vC0iyP_CDQ1568YjhFcAclGC_xC_KIxC/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    timestamp: "2024-09-05 13:15:00",
    nama: "Budi Santoso, S.Pt.",
    nip: "1987654321003",
    jabatan: "Dosen",
    judul: "Laporan Pengabdian Masyarakat Bulurejo",
    kategori: "Umum",
    ringkasan: "Laporan ini menguraikan kegiatan pengabdian masyarakat yang dilaksanakan di desa mitra. Fokus utama kegiatan adalah penyuluhan pembuatan pakan fermentasi untuk peternak lokal. Hasil evaluasi menunjukkan peningkatan pemahaman warga terhadap manajemen pakan mandiri.",
    format: "PDF",
    kepentingan: "Biasa",
    privasi: "Lingkup Prodi",
    passdok: "-",
    expired: "-",
    kriteria: ["K-2.3"],
    tahun: "2024/2025",
    url: "https://drive.google.com/file/d/1aaVyj6_GaNin0ebzcZKZQ5FFadgtYah4/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1594705382022-779836528751?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    timestamp: "2025-08-10 09:30:00",
    nama: "Dr. Andi Pratama, S.Pt., M.P.",
    nip: "1987654321001",
    jabatan: "Ketua Program Studi",
    judul: "SK Penetapan Visi Misi Prodi",
    kategori: "Umum",
    ringkasan: "Dokumen ini merupakan Surat Keputusan resmi terkait penetapan visi dan misi program studi yang baru. Perubahan ini disesuaikan dengan rencana strategis institusi untuk lima tahun ke depan. SK ini menjadi landasan seluruh kegiatan akademik dan tridharma perguruan tinggi.",
    format: "PDF",
    kepentingan: "Sangat Penting",
    privasi: "Publik",
    passdok: "-",
    expired: "2030-08-10",
    kriteria: ["K-4"],
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1pI_NNz1YQpCtVHbn9aV6vK8fWZXZsbc_/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    timestamp: "2025-08-15 14:20:00",
    nama: "Siti Rahmawati, S.Pt., M.Si.",
    nip: "1987654321002",
    jabatan: "Sekretaris",
    judul: "Laporan Keuangan Prodi Genap",
    kategori: "Rahasia",
    ringkasan: "Laporan ini memuat rincian alokasi dana dan pengeluaran program studi selama satu semester. Seluruh bukti transaksi dan nota pembelian sarana prasarana telah dilampirkan secara lengkap. Audit internal telah menyetujui laporan keuangan ini tanpa adanya catatan perbaikan.",
    format: "XLS",
    kepentingan: "Penting",
    privasi: "Lingkup Prodi",
    passdok: "s@ndiKuAT",
    expired: "2026-08-15",
    kriteria: ["K-3"],
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1FHy_bCjfKIeU1FqeM8KL_rbSE-JaJLQ6/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    timestamp: "2025-09-01 10:00:00",
    nama: "Program Studi Agribisnis Peternakan",
    nip: "2982019",
    jabatan: "Program Studi",
    judul: "Master Data Borang Akreditasi",
    kategori: "Sangat Rahasia",
    ringkasan: "Dokumen ini adalah master file borang akreditasi gabungan yang memuat seluruh rekapitulasi instrumen LAM PTIP secara final. Arsip ini sengaja dikunci khusus untuk perwakilan Administrator Utama sebagai cadangan basis data inti dari program studi. Tidak boleh ada satupun pengguna biasa yang dapat mengakses dan memodifikasi file arsip final ini.",
    format: "ZIP",
    kepentingan: "Sangat Penting",
    privasi: "Pribadi",
    passdok: "ult1m4t3!",
    expired: "-",
    kriteria: ["K-1", "K-2.1", "K-2.2", "K-2.3", "K-3", "K-2.4"],
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/10UYRlHY2jgNCMwzTRUYHZ47YfaYqvJz-/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop"
  }
];

// Generate extra dummy docs to show pagination properly
const EXTENDED_DOCS = [...DUMMY_DOCS];
for(let i = 6; i <= 15; i++) {
    EXTENDED_DOCS.push({
        ...DUMMY_DOCS[i % 5],
        id: i,
        judul: `${DUMMY_DOCS[i % 5].judul} (Copy ${i})`,
    });
}

// ==========================================
// COMPONENTS
// ==========================================

const Header = ({ currentSection, setCurrentSection }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const smoothScroll = (id) => {
    setCurrentSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isMobile ? 0 : 80; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-3xl pb-safe pt-2 px-2 transition-all">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => smoothScroll('beranda')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'beranda' ? 'text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}>
             <div className={`p-1.5 rounded-xl ${currentSection === 'beranda' ? 'bg-amber-100' : ''}`}>
                <LayoutGrid size={20} className={currentSection === 'beranda' ? 'fill-amber-600/20' : ''} />
             </div>
             <span className="text-[10px] font-semibold">Beranda</span>
          </button>
          <button onClick={() => smoothScroll('tentang')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'tentang' ? 'text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}>
             <div className={`p-1.5 rounded-xl ${currentSection === 'tentang' ? 'bg-amber-100' : ''}`}>
                <Info size={20} className={currentSection === 'tentang' ? 'fill-amber-600/20' : ''} />
             </div>
             <span className="text-[10px] font-semibold">Tentang</span>
          </button>
          <button onClick={() => smoothScroll('arsip')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'arsip' ? 'text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}>
             <div className={`p-1.5 rounded-xl ${currentSection === 'arsip' ? 'bg-amber-100' : ''}`}>
                <FolderOpen size={20} className={currentSection === 'arsip' ? 'fill-amber-600/20' : ''} />
             </div>
             <span className="text-[10px] font-semibold">Arsip</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-all text-slate-400 hover:text-amber-500">
             <div className="p-1.5 rounded-xl text-red-500">
                <LogIn size={20} />
             </div>
             <span className="text-[10px] font-semibold text-red-500">Login</span>
          </button>
        </div>
      </nav>
    );
  }

  // Desktop Header
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => smoothScroll('beranda')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Archive className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">SIAGRINAK</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => smoothScroll('beranda')} className={`text-sm font-semibold transition-colors ${currentSection === 'beranda' ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}>Beranda</button>
            <button onClick={() => smoothScroll('tentang')} className={`text-sm font-semibold transition-colors ${currentSection === 'tentang' ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}>Tentang Kami</button>
            <button onClick={() => smoothScroll('arsip')} className={`text-sm font-semibold transition-colors ${currentSection === 'arsip' ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}>Arsip Dokumen</button>
          </div>

          <div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5">
              <LogIn size={18} />
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="beranda" className="relative pt-32 md:pt-36 pb-12 md:pb-16 overflow-hidden bg-slate-50 w-full flex flex-col justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[100px] -z-10 transform-gpu pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-[100px] -z-10 transform-gpu pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 text-center z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          <h1 className="font-extrabold mb-5 flex flex-col items-center">
            <span className="block text-6xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500 drop-shadow-sm leading-none tracking-normal">SIAGRINAK</span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold text-slate-800 -mt-2 md:-mt-4 tracking-wide">
              Sistem Arsip Agribisnis Peternakan
            </span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative mb-8 md:mb-10">
             <div className="flex items-center bg-white rounded-full p-1.5 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="pl-4 text-slate-400"><Search size={20} /></div>
                <input type="text" placeholder="Cari data statistik atau dokumen..." className="w-full bg-transparent border-none px-4 py-3 text-slate-700 focus:outline-none focus:ring-0" />
                <button className="bg-amber-500 hover:bg-amber-600 text-white p-3 md:px-8 md:py-3 rounded-full font-bold transition-colors">
                  <span className="hidden md:inline">Cari</span>
                  <Search className="md:hidden" size={20} />
                </button>
             </div>
          </div>

          {/* Stat Boxes replicating Image 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-2">
            {[
              { icon: FolderOpen, title: "Total Arsip Tersimpan", value: "1.245", sub: "Dokumen", date: "Januari 2026" },
              { icon: User, title: "Dosen & Staff Aktif", value: "48", sub: "Personel", date: "Semester Genap" },
              { icon: ShieldCheck, title: "Borang Terakreditasi", value: "95%", sub: "Selesai", date: "2025/2026" },
              { icon: Calendar, title: "Tahun Ajaran", value: "25/26", sub: "Aktif", date: "Semester Genap" }
            ].map((stat, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 + (idx * 0.1) }}
                 className="bg-white rounded-[2rem] p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
               >
                 <div className="text-amber-500 mb-3 bg-amber-50 p-3.5 rounded-2xl group-hover:scale-110 group-hover:bg-amber-100 transition-all border border-amber-100/50">
                   <stat.icon size={28} className="text-amber-500" strokeWidth={2} />
                 </div>
                 <h3 className="text-[11px] md:text-sm font-bold text-amber-700 mb-1 leading-snug">{stat.title}</h3>
                 <p className="text-3xl md:text-[2.75rem] font-black text-slate-800 tracking-tight mb-0.5 leading-none">{stat.value}</p>
                 <p className="text-[10px] md:text-xs text-slate-400 mb-3">{stat.sub}</p>
                 <div className="mt-auto w-full pt-3 border-t border-slate-100">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.date}</p>
                 </div>
               </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

const TentangKami = () => {
  return (
    <section id="tentang" className="py-10 md:py-16 bg-white relative w-full border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, amount: 0.5 }} 
          transition={{ duration: 0.7 }} 
          className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12"
        >
          <div className="h-[2px] bg-gradient-to-r from-transparent to-amber-200 flex-1 max-w-[150px]"></div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 text-center tracking-tight">Tentang SIAGRINAK</h2>
          <div className="h-[2px] bg-gradient-to-l from-transparent to-amber-200 flex-1 max-w-[150px]"></div>
        </motion.div>

        {/* 1 col di Mobile, 3 cols di Tablet, 5 cols di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 px-2">
          {[
            { icon: Archive, title: "Pengelolaan\nArsip Terpusat", bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-600" },
            { icon: Zap, title: "Akses Mudah &\nCepat", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-500" },
            { icon: ShieldCheck, title: "Keamanan Data\nTerjamin", bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-500" },
            { icon: Monitor, title: "Multi-Perangkat", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-500" },
            { icon: TrendingUp, title: "Efisiensi\nAdministrasi", bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-500" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ delay: idx * 0.1, duration: 0.5 }} 
              className="bg-white border border-slate-100 p-5 md:p-6 lg:p-5 xl:p-6 rounded-[1.25rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-row items-center justify-start lg:justify-center xl:justify-start text-left gap-4"
            >
                <div className={`w-14 h-14 md:w-16 md:h-16 ${item.bg} rounded-2xl flex items-center justify-center border ${item.border} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                   <item.icon className={item.text} size={28} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug whitespace-pre-line">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DocumentCard = ({ doc, onView, isMobile }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-lg hover:shadow-amber-900/10 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
      onClick={() => onView(doc)}
    >
      {/* Thumbnail section simulating Image 2 */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
        <img 
          src={doc.thumbnail} 
          alt={doc.judul} 
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        
        {/* Overlaid Information on Thumbnail */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
           <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md group-hover:text-amber-400 transition-colors">
             {doc.judul}
           </h3>
           <p className="text-slate-300 text-xs flex items-center gap-1 font-medium">
             Source: <span className="text-white">{doc.nama}</span>
           </p>
        </div>

        {/* Format Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-md bg-white/20 border border-white/30">
            <FileText size={12} />
            {doc.format}
          </span>
        </div>
      </div>
      
      {/* Content Below Thumbnail */}
      <div className="p-4 flex-1 flex flex-col bg-white">
        
        {/* Tags K-1 Logic */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isMobile ? (
            <>
              {doc.kriteria.slice(0, 3).map((k, i) => (
                <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                  {k}
                </span>
              ))}
              {doc.kriteria.length > 3 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onView(doc); }}
                  className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
                >
                  +{doc.kriteria.length - 3} Detail
                </button>
              )}
            </>
          ) : (
            doc.kriteria.map((k, i) => (
              <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap">
                {k}
              </span>
            ))
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onView(doc); }}
            className="flex-1 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 border border-slate-200 p-2 md:p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
          >
            <Eye size={16} /> <span className="hidden sm:inline">Lihat</span>
          </button>
          <a 
            href={doc.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white p-2 md:p-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
          >
            <Download size={16} /> <span className="hidden sm:inline">Unduh</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const DocumentModal = ({ doc, isOpen, onClose }) => {
  if (!doc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-10 pb-20 md:p-6"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-50 max-h-[85vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-red-500 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Thumbnail Header */}
            <div className="w-full md:w-2/5 relative h-60 md:h-auto bg-slate-100">
               <img src={doc.thumbnail} alt={doc.judul} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg mb-3 inline-block">
                    {doc.format}
                  </span>
                  <h2 className="text-2xl font-bold text-white leading-tight mb-2">{doc.judul}</h2>
                  <p className="text-amber-300 text-sm font-medium flex items-center gap-2">
                     <User size={14} /> {doc.nama}
                  </p>
               </div>
            </div>

            {/* Content Details */}
            <div className="w-full md:w-3/5 flex flex-col bg-white overflow-hidden">
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tanggal Upload</p>
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Calendar size={14} className="text-amber-500"/> {doc.timestamp.split(' ')[0]}</p>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tahun Ajaran</p>
                          <p className="text-sm font-semibold text-slate-700">{doc.tahun}</p>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Privasi</p>
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><ShieldCheck size={14} className="text-amber-500"/> {doc.privasi}</p>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Password</p>
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                             {doc.passdok !== '-' ? <><Lock size={14} className="text-red-500"/> Terkunci</> : 'Tidak Ada'}
                          </p>
                       </div>
                    </div>

                    <div className="mb-6">
                       <h4 className="text-sm font-bold text-slate-800 mb-2">Kriteria Akreditasi</h4>
                       <div className="flex flex-wrap gap-2">
                          {doc.kriteria.map((k, i) => (
                            <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold">
                              {k}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-sm font-bold text-slate-800 mb-2">Ringkasan Dokumen</h4>
                       <p className="text-slate-600 text-sm leading-relaxed text-justify">
                          {doc.ringkasan}
                       </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                    <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        <span>Unduh Dokumen Sekarang</span>
                    </a>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ArsipSection = () => {
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multiple selections for filter
  const [filters, setFilters] = useState({ kriteria: [], format: [], privasi: [] });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter options
  const optKriteria = Array.from(new Set(EXTENDED_DOCS.flatMap(d => d.kriteria))).sort();
  const optFormat = Array.from(new Set(EXTENDED_DOCS.map(d => d.format)));
  const optPrivasi = Array.from(new Set(EXTENDED_DOCS.map(d => d.privasi)));

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
    setPage(1);
  };

  const processedDocs = useMemo(() => {
    return EXTENDED_DOCS.filter(doc => {
      const matchKriteria = filters.kriteria.length === 0 || filters.kriteria.some(k => doc.kriteria.includes(k));
      const matchFormat = filters.format.length === 0 || filters.format.includes(doc.format);
      const matchPrivasi = filters.privasi.length === 0 || filters.privasi.includes(doc.privasi);
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
                          doc.judul.toLowerCase().includes(searchLower) || 
                          doc.ringkasan.toLowerCase().includes(searchLower) || 
                          doc.nama.toLowerCase().includes(searchLower);
      return matchKriteria && matchFormat && matchPrivasi && matchSearch;
    });
  }, [filters, searchQuery]);

  // Pagination config based on user request: layout 4, 2, 1 columns.
  const itemsPerPage = isMobile ? 4 : (isTablet ? 6 : 8); 
  const totalPages = Math.ceil(processedDocs.length / itemsPerPage) || 1;
  const currentDocs = processedDocs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Pagination box limit: 5 for desktop/tablet, 3 for mobile
  const maxPageVisible = isMobile ? 3 : 5;
  const getPaginationGroup = () => {
    let startPage = Math.max(1, page - Math.floor(maxPageVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxPageVisible - 1);

    if (endPage - startPage + 1 < maxPageVisible) {
        startPage = Math.max(1, endPage - maxPageVisible + 1);
    }
    return new Array(Math.max(0, endPage - startPage + 1)).fill().map((_, idx) => startPage + idx);
  };

  const activeFilterCount = filters.kriteria.length + filters.format.length + filters.privasi.length;

  return (
    <section id="arsip" className="py-12 md:py-16 bg-slate-50 relative w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Box Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              Arsip Dokumen 
            </h2>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-20 w-full md:w-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64 md:w-80">
              <input 
                type="text" 
                placeholder="Cari judul, deskripsi, atau nama..." 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500 pr-10 shadow-sm transition-colors"
              />
              <Search size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex justify-center items-center w-full gap-2 px-5 py-3 rounded-xl border font-semibold transition-all shadow-sm ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-amber-500 border-amber-600 text-white shadow-amber-500/20' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-500 hover:text-amber-600'
                }`}
              >
                <Filter size={18} />
                <span>Filter Dokumen</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-white text-amber-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Dropdown/Popup */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-5 max-h-[60vh] overflow-y-auto"
                  >
                    <div className="space-y-5">
                       <div>
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Kriteria Akreditasi</h4>
                         <div className="flex flex-wrap gap-2">
                           {optKriteria.map(k => (
                             <button key={k} onClick={() => toggleFilter('kriteria', k)} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${filters.kriteria.includes(k) ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                               {k}
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="h-px bg-slate-100"></div>
                       <div>
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Jenis Format</h4>
                         <div className="flex flex-wrap gap-2">
                           {optFormat.map(f => (
                             <button key={f} onClick={() => toggleFilter('format', f)} className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${filters.format.includes(f) ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                               {f}
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="h-px bg-slate-100"></div>
                       <div>
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Privasi Dokumen</h4>
                         <div className="flex flex-col gap-2.5">
                           {optPrivasi.map(p => (
                             <button key={p} onClick={() => toggleFilter('privasi', p)} className={`flex justify-between items-center px-3 py-2 text-[11px] font-bold rounded-lg border transition-colors ${filters.privasi.includes(p) ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                               <span>{p}</span>
                               {filters.privasi.includes(p) && <Check size={14} className="text-amber-600" />}
                             </button>
                           ))}
                         </div>
                       </div>
                       {(filters.kriteria.length > 0 || filters.format.length > 0 || filters.privasi.length > 0) && (
                          <button onClick={() => setFilters({ kriteria: [], format: [], privasi: [] })} className="w-full mt-2 text-xs text-red-500 font-bold hover:underline py-2 bg-red-50 rounded-lg">
                            Reset Semua Filter
                          </button>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid Layout: 4 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-h-[400px]">
          <AnimatePresence mode='wait'>
            {currentDocs.length > 0 ? currentDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <DocumentCard doc={doc} onView={setSelectedDoc} isMobile={isMobile} />
              </motion.div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-20">
                <FileDigit size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-semibold">Tidak ada dokumen yang sesuai dengan filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Kotak Pagination ditaruh di bawah */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8 md:mb-0">
             <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                {getPaginationGroup().map(num => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`relative w-10 h-10 rounded-lg font-bold text-sm transition-all ${page === num ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <ChevronRight size={20} />
                </button>
             </div>
          </div>
        )}
      </div>

      <DocumentModal doc={selectedDoc} isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} />
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 pt-16 pb-24 md:pb-12 border-t-4 border-amber-500">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
               <Archive className="text-white" size={18} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">SIAGRINAK</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Copyright &copy; 2026 All Rights Reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://youtube.com/@arsipagrinak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 group border border-red-500/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:animate-pulse"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span className="font-bold text-sm">YouTube</span>
          </a>
          <a href="https://instagram.com/arsipagrinak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d6249f]/20 hover:bg-gradient-to-tr hover:from-[#fd5949] hover:to-[#d6249f] text-white transition-all duration-300 hover:scale-105 group border border-[#d6249f]/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span className="font-bold text-sm">Instagram</span>
          </a>
          {/* Changed Discord to WhatsApp Developer */}
          <a href="https://wa.me/6285179852558" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500 text-white transition-all duration-300 hover:scale-105 group border border-green-500/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            <span className="font-bold text-sm">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---
const App = () => {
  const [currentSection, setCurrentSection] = useState('beranda');

  // Track scroll sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['beranda', 'tentang', 'arsip'];
      const scrollY = window.scrollY;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 200;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setCurrentSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 overflow-x-hidden w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Import Poppins Font & Custom Scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .pb-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem); }
        }
      `}</style>
      
      <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <Hero />
      <TentangKami />
      <ArsipSection />
      <Footer />
    </div>
  );
};

export default App;
