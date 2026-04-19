import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Sparkles, ShoppingBag, PhoneCall, User, 
  Moon, Sun, Eye, EyeOff, ChevronLeft, ChevronRight, 
  ShoppingCart, X, MapPin, Search, ArrowRight, Menu, Maximize,
  Check, Trash2, Plus, Minus, AlertCircle
} from 'lucide-react';

// --- CONFIGURATION ---
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxeh5M6LA3vyy3agTyIjH4iwibNIMey_XwBIVJ9zXpGJmb5VYreAYFoBwnL4K6rdm2l/exec';
const LOGO_URL = 'https://yellow-ruby-32.tiiny.site/Screenshot-2026-04-18-220340.svg';

// --- HELPER FUNCTIONS ---
const getRawNumber = (angka) => {
  if (!angka) return 0;
  const numString = angka.toString().replace(/[^0-9]/g, '');
  return parseInt(numString, 10) || 0;
};

const formatRupiah = (angka) => {
  if (!angka) return "Rp 0";
  const numberString = angka.toString().replace(/[^0-9]/g, '');
  if (!numberString) return angka;
  const val = parseInt(numberString, 10);
  
  if (val >= 1000000) {
    const juta = val / 1000000;
    const textJuta = juta % 1 === 0 ? juta.toString() : juta.toFixed(1).replace('.', ',');
    return `Rp ${textJuta} Juta`;
  }
  
  const sisa = numberString.length % 3;
  let rupiah = numberString.substr(0, sisa);
  const ribuan = numberString.substr(sisa).match(/\d{3}/g);
  
  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  return `Rp ${rupiah}`;
};

const formatRupiahKecil = (angka) => {
  const numberString = angka.toString().replace(/[^0-9]/g, '');
  const sisa = numberString.length % 3;
  let rupiah = numberString.substr(0, sisa);
  const ribuan = numberString.substr(sisa).match(/\d{3}/g);
  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  return `Rp ${rupiah}`;
};

// --- CUSTOM CSS (Injected) ---
const customStyles = `
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #4c1d95, #0ea5e9); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #5b21b6, #0284c7); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-on-load { animation: fadeIn 0.8s ease-out forwards; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
`;

// --- HELPER COMPONENTS ---
const GradientText = ({ children, className = "" }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-sky-500 dark:from-purple-400 dark:to-sky-300 font-bold ${className}`}>
    {children}
  </span>
);

const Badge = ({ children }) => (
  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-900 to-purple-600 rounded-md shadow-sm whitespace-nowrap">
    {children}
  </span>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals & States
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('beranda');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  
  // Toast Notification
  const [toast, setToast] = useState({ visible: false, productName: "", qty: 1 });
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    const fetchProducts = async () => {
      try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        const cleanedData = data.map(item => {
          let mainImage = item['Link Gambar Utama Produk'] || '';
          if (mainImage.includes(',')) mainImage = mainImage.split(',')[0].trim();
          return { ...item, cleanImage: mainImage };
        });
        
        setProducts(cleanedData);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setError("Gagal memuat data produk. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };

    fetchProducts();
    return () => document.head.removeChild(styleSheet);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleAddToCart = (product) => {
    let currentQty = 1;
    setCart(prev => {
      const existing = prev.find(item => item.product['ID Produk'] === product['ID Produk']);
      if (existing) {
        currentQty = existing.qty + 1;
        return prev.map(item => item.product['ID Produk'] === product['ID Produk'] ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    
    if (toastTimeout) clearTimeout(toastTimeout);
    setToast({ visible: true, productName: product['Nama Produk'], qty: currentQty });
    // Mengubah durasi otomatis hilang menjadi 5 detik (5000 ms)
    const timer = setTimeout(() => setToast({ visible: false, productName: "", qty: 1 }), 5000);
    setToastTimeout(timer);
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product['ID Produk'] === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product['ID Produk'] !== productId));
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const pinnedProducts = products.filter(p => p['isPinnedProduct'] === 'Ya' || p['isPinnedProduct'] === true || p['isPinnedProduct'] === 'TRUE');
  const regularProducts = products.filter(p => p['isPinnedProduct'] !== 'Ya' && p['isPinnedProduct'] !== true && p['isPinnedProduct'] !== 'TRUE');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300 pb-20 md:pb-0 pt-0 md:pt-20">
      
      {/* Toast Notification Baru (Gradien Hijau Tua - Hijau dengan tombol X) */}
      <div className={`fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500 min-w-[300px] relative pr-12">
          <div className="bg-white/20 px-3 py-2 md:px-4 md:py-3 rounded-xl font-black text-lg md:text-xl shadow-inner text-white">
            {toast.qty}x
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-sm md:text-base leading-tight drop-shadow-sm mb-1 text-white">{toast.productName}</span>
            <span className="text-xs md:text-sm text-white flex items-center gap-1.5 font-bold">
              <span className="bg-white text-emerald-700 rounded-full p-0.5 shadow-sm"><Check className="w-3 h-3" /></span>
              Sukses Masuk di Keranjang!
            </span>
          </div>
          {/* Tombol Tutup (X) */}
          <button 
            onClick={() => {
              if (toastTimeout) clearTimeout(toastTimeout);
              setToast({ visible: false, productName: "", qty: 1 });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/30 rounded-full transition-colors text-white"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* HEADER */}
      <header className="fixed z-40 w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-all duration-300
        bottom-0 md:top-0 md:bottom-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo (Desktop) - Hanya Logo */}
            <div className="hidden md:flex items-center cursor-pointer" onClick={() => scrollTo('beranda')}>
              <img src={LOGO_URL} alt="Logo" className="h-10 md:h-12 object-contain drop-shadow-sm" />
            </div>

            {/* Navigation (Mobile & Desktop) */}
            <nav className="flex w-full md:w-auto justify-between md:justify-center items-center gap-1 md:gap-4 lg:gap-6 text-xs md:text-sm font-medium px-2 md:px-0">
              <NavButton icon={<Home className="w-5 h-5 md:w-4 md:h-4" />} label="Beranda" onClick={() => scrollTo('beranda')} isActive={activeSection === 'beranda'} />
              <NavButton icon={<Sparkles className="w-5 h-5 md:w-4 md:h-4" />} label="Unggulan" onClick={() => scrollTo('unggulan')} isActive={activeSection === 'unggulan'} />
              <NavButton icon={<ShoppingBag className="w-5 h-5 md:w-4 md:h-4" />} label="Produk" onClick={() => scrollTo('produk')} isActive={activeSection === 'produk'} />
              
              {/* Keranjang Menu Nav */}
              <div className="relative">
                <NavButton 
                  icon={<ShoppingCart className="w-5 h-5 md:w-4 md:h-4" />} 
                  label="Keranjang" 
                  onClick={() => setCartModalOpen(true)} 
                  isActive={cartModalOpen} 
                />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-1 md:-top-1 md:-right-1 bg-red-500 text-white text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce pointer-events-none">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>

              <NavButton icon={<PhoneCall className="w-5 h-5 md:w-4 md:h-4" />} label="Kontak" onClick={() => scrollTo('kontak')} isActive={activeSection === 'kontak'} />
              
              <div className="hidden md:block w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
              
              {/* Login Button (Hanya tampil di Header Desktop) */}
              <button 
                onClick={() => setLoginModalOpen(true)}
                className="hidden md:flex flex-row items-center gap-1.5 p-2 md:px-4 md:py-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors md:bg-purple-50 md:dark:bg-purple-900/30 md:rounded-full font-semibold"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>

              {/* Theme Toggle (Hanya Desktop) */}
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors hidden md:block">
                {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Floating Icons for Mobile (Light/Dark Mode & Login) di Pojok Kanan Atas */}
      <div className="md:hidden fixed top-4 right-4 z-40 flex items-center gap-2">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 transition-transform active:scale-95"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => setLoginModalOpen(true)}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 transition-transform active:scale-95"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-12 md:pt-0">
        
        {/* BERANDA SECTION */}
        <section id="beranda" className="min-h-[60vh] flex flex-col justify-center items-center text-center py-10 md:py-16 animate-on-load">
          {/* Mobile Logo Fallback */}
          <div className="md:hidden mb-4 drop-shadow-xl bg-white dark:bg-slate-900 p-3 rounded-3xl">
            <img src={LOGO_URL} alt="POKTAN Logo" className="h-16 object-contain" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            POKTAN <GradientText>TANI AGUNG</GradientText>
          </h1>
          
          {/* Deskripsi (Tanpa Box) */}
          <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-4xl px-2 mb-6">
            POKTAN TANI AGUNG merupakan sebuah usaha produk hasil pertanian dan peternakan dari Kelompok Tani yang berlokasi di Desa Dumajah, Kecamatan Tanah Merah, Kabupaten Bangkalan.
          </p>
          
          {/* Highlight Gradient */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-lg md:text-xl font-bold mb-8 w-full px-4">
            <span className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-sky-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/20">
              100% Organik
            </span>
            <span className="hidden sm:inline text-slate-400">&bull;</span>
            <span className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-sky-500/20">
              100% Buatan UMKM
            </span>
          </div>

          <button 
            onClick={() => scrollTo('unggulan')}
            className="group px-8 py-3.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            Lihat Produk Kami 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* SECTION UNGGULAN KAMI */}
        <section id="unggulan" className="py-16 animate-on-load" style={{animationDelay: '0.2s'}}>
          <SectionTitle title="Unggulan Kami" subtitle="Produk pilihan terbaik dan terlaris dari kelompok tani kami." />
          {loading ? (
            <LoadingIndicator />
          ) : error ? (
            <div className="py-10 text-center text-red-500 font-bold">{error}</div>
          ) : (
            <PaginatedGrid products={pinnedProducts} onProductClick={setSelectedProduct} onAddToCart={handleAddToCart} isPinned={true} />
          )}
        </section>

        {/* SECTION PRODUK KAMI */}
        <section id="produk" className="py-16 animate-on-load" style={{animationDelay: '0.4s'}}>
          <SectionTitle title="Produk Kami" subtitle="Jelajahi berbagai macam produk pertanian dan peternakan organik." />
          {loading ? (
            <LoadingIndicator />
          ) : error ? (
            <div className="py-10 text-center text-red-500 font-bold">{error}</div>
          ) : (
            <PaginatedGrid products={regularProducts} onProductClick={setSelectedProduct} onAddToCart={handleAddToCart} isPinned={false} />
          )}
        </section>
        
      </main>

      {/* FOOTER & KONTAK */}
      <footer id="kontak" className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-10 border-t-4 border-purple-600 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Info */}
            <div>
              {/* Logo di Footer */}
              <div className="flex items-center gap-3 mb-5 bg-white/95 p-3.5 rounded-xl w-fit shadow-md border border-slate-700">
                <img src={LOGO_URL} alt="Logo Asli POKTAN" className="h-10 object-contain drop-shadow-sm" />
              </div>
              <p className="mb-6 leading-relaxed text-sm">
                Kelompok Tani (POKTAN) Tani Agung yang terletak di Desa Dumajah, menyediakan berbagai produk pertanian dan peternakan 100% Organik dan 100% Buatan UMKM.
              </p>
              <div className="flex gap-4">
                <SocialLink href="https://facebook.com/binti.choiriyah.9237" icon={<FacebookIcon />} color="bg-blue-600" title="Facebook" />
                <SocialLink href="https://www.instagram.com/poktania.dumajah/" icon={<InstagramIcon />} color="bg-pink-600" title="Instagram" />
                <SocialLink href="intent://send?phone=6283134644375#Intent;scheme=whatsapp;package=com.whatsapp;end" fallbackHref="https://wa.me/6283134644375" icon={<WhatsAppIcon />} color="bg-green-500" title="WhatsApp" />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Alamat Lengkap</h3>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/?q=-7.079227,112.852076" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm leading-relaxed hover:text-purple-400 transition-colors block"
                  title="Buka di Peta"
                >
                  Kampung Legung, Desa Dumajah,<br/>
                  Kecamatan Tanah Merah,<br/>
                  Kabupaten Bangkalan,<br/>
                  Provinsi Jawa Timur 69172
                </a>
              </div>
            </div>

            {/* Google Map (Tanpa filter grayscale agar berwarna) */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Lokasi Kami</h3>
              <div className="w-full h-48 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group">
                <iframe 
                  title="Google Maps POKTAN TANI AGUNG"
                  src="https://maps.google.com/maps?q=-7.079227,112.852076&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
                <a 
                  href="https://maps.google.com/?q=-7.079227,112.852076" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-sm border border-slate-600 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <MapPin className="w-3 h-3 text-red-500" /> Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} POKTAN TANI AGUNG - Desa Dumajah. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />}
      {cartModalOpen && <CartModal cart={cart} onClose={() => setCartModalOpen(false)} updateQty={updateCartQty} removeItem={removeFromCart} />}

    </div>
  );
}

// --- SUB COMPONENTS ---

const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-16 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mb-4 shadow-lg shadow-purple-600/20"></div>
    <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse tracking-wide">Sedang Mengambil Produk...</p>
  </div>
);

const NavButton = ({ icon, label, onClick, isActive }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 p-2 md:px-3 md:py-2 rounded-xl transition-colors
      ${isActive 
        ? 'text-purple-600 dark:text-purple-400' 
        : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300'}`}
  >
    {icon}
    <span className="text-[9px] md:text-sm font-semibold">{label}</span>
  </button>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
    <div>
      <h2 className="text-3xl md:text-4xl font-black mb-2 text-slate-800 dark:text-white flex items-center">
        <span className="bg-gradient-to-r from-purple-600 to-sky-500 w-2 h-8 inline-block mr-3 rounded-full"></span>
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const SocialLink = ({ href, fallbackHref, icon, color, title }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color} hover:opacity-80 transition-opacity shadow-lg`}
    title={title}
    onClick={(e) => {
      if (fallbackHref && window.innerWidth > 768) {
        e.preventDefault();
        window.open(fallbackHref, '_blank');
      }
    }}
  >
    {icon}
  </a>
);

// --- PRODUCT CARD UI ---
const ProductCard = ({ product, onClick, onAddToCart }) => {
  let firstTag = "";
  if (product['Tag Produk']) firstTag = product['Tag Produk'].split(',')[0].trim();

  return (
    <div 
      onClick={() => onClick(product)}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
        <img 
          src={product.cleanImage || '/api/placeholder/400/400'} 
          alt={product['Nama Produk']} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {product['Kategori Produk'] && (
            <span className="bg-slate-700 dark:bg-slate-800 text-white text-[9px] md:text-[10px] px-2 py-1 rounded-md shadow-sm">
              {product['Kategori Produk']}
            </span>
          )}
          {firstTag && (
            <span className="bg-purple-600 text-white text-[9px] md:text-[10px] px-2 py-1 rounded-md shadow-sm">
              {firstTag}
            </span>
          )}
        </div>

        <div className="mb-auto">
          <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold truncate">
            POKTAN TANI AGUNG
          </p>
          <h3 className="font-bold text-slate-800 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem] text-sm md:text-base">
            {product['Nama Produk']}
          </h3>
        </div>
        
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="font-black text-sm md:text-lg text-purple-700 dark:text-purple-400 tracking-tight">
            {formatRupiah(product['Harga Produk'])}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="bg-sky-100 text-sky-700 dark:bg-purple-900/50 dark:text-purple-300 p-1.5 md:p-2 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-colors flex-shrink-0 ml-2"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PAGINATED GRID ---
const PaginatedGrid = ({ products, onProductClick, onAddToCart, isPinned }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isPinned ? 5 : 10);
  const [maxPagesToShow, setMaxPagesToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isPinned) setItemsPerPage(isMobile ? 2 : 5);
      else setItemsPerPage(isMobile ? 8 : 10);
      setMaxPagesToShow(isMobile ? 3 : 5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPinned]);

  if (!products.length) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  
  const currentData = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-stretch">
        {currentData.map((product, idx) => (
          <div key={product['ID Produk'] || idx} className="h-full">
            <ProductCard product={product} onClick={onProductClick} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {startPage > 1 && (
            <>
              <button onClick={() => setCurrentPage(1)} className="w-10 h-10 rounded-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">1</button>
              {startPage > 2 && <span className="text-slate-400">...</span>}
            </>
          )}

          {pages.map(pageNum => (
            <button 
              key={pageNum} 
              onClick={() => setCurrentPage(pageNum)} 
              className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border-blue-600' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {pageNum}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-slate-400">...</span>}
              <button onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 rounded-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">{totalPages}</button>
            </>
          )}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages} 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- PRODUCT FULL PREVIEW MODAL ---
const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  }, []);

  const tags = product['Tag Produk'] ? product['Tag Produk'].split(',').map(t => t.trim()) : [];
  const komposisi = product['Komposisi Produk'] ? product['Komposisi Produk'].split(',').map(k => k.trim()) : [];

  // Logika Kustomisasi Judul Komposisi (Jenis Ternak, Tools Kandang, atau Komposisi)
  let labelKomposisi = "Komposisi";
  const categoryStr = (product['Kategori Produk'] || '').toLowerCase();
  
  const ternakCategories = ["sapi potong", "sapi perah", "sapi", "kambing potong", "kambing perah", "kambing", "ayam kampung super", "ayam kampung pedaging", "ayam kampung petelur", "ayam kampung", "ayam broiler", "ayam petelur", "ayam", "itik", "itik pedaging", "itik petelur", "bebek pedaging", "bebek petelur", "domba pejantan", "domba perah", "domba", "unta", "kuda", "unggas lainnya"];
  const toolsCategories = ["kandang", "semen", "batu", "cangkul", "meteran", "penggaris siku", "pensil tukang", "gergaji kayu", "gergaji besi", "gunting baja ringan", "palu", "obeng", "bor listrik", "tang", "sarung tangan", "kacamata pelindung", "kayu reng", "bambu", "baja ringan", "kawat ram", "wire mesh", "paku kayu", "baut roofing", "semen", "pasir", "batu bata", "seng", "asbes", "genteng", "terpal", "lampu bohlam", "kabel listrik", "wadah pakan", "wadah minum"];

  if (ternakCategories.includes(categoryStr)) {
    labelKomposisi = "Jenis Ternak";
  } else if (toolsCategories.includes(categoryStr)) {
    labelKomposisi = "Tools Kandang";
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm animate-on-load" 
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
          onClick={(e) => e.stopPropagation()}
        >
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-[60] w-10 h-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-700 shadow-md"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-0 min-h-[300px] md:min-h-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-hidden relative group cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreenImage(true);
            }}
          >
             <button 
               className="absolute top-4 left-4 z-10 bg-black/60 hover:bg-black/80 text-white text-[10px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-md backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg border border-white/20"
               onClick={(e) => {
                 e.stopPropagation();
                 setIsFullScreenImage(true);
               }}
             >
               <Maximize className="w-3 h-3 md:w-4 md:h-4" /> Gambar Asli Penuh
             </button>
             <img 
              src={product.cleanImage} 
              alt={product['Nama Produk']} 
              className="w-full h-full object-cover md:object-contain drop-shadow-xl group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex-grow">
              <div className="mb-2 flex gap-2 flex-wrap mt-2 md:mt-0">
                 {product['Kategori Produk'] && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-semibold">
                    {product['Kategori Produk']}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
                {product['Nama Produk']}
              </h2>
              
              <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-6 tracking-tight">
                {formatRupiah(product['Harga Produk'])}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Deskripsi</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                    {product['Deskripsi Produk']}
                  </p>
                </div>

                {komposisi.length > 0 && komposisi[0] !== "" && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{labelKomposisi}</h4>
                    <div className="flex flex-wrap gap-2">
                      {komposisi.map((item, idx) => (
                        <Badge key={idx}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Stok Tersedia</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">{product['Jumlah Stok']}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Terjual</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">{product['Jumlah Pembelian']}+</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Min. Beli</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">{product['Jumlah Minimum Pembelian']} item</span>
                  </div>
                   <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">Penerbit</span>
                    <span className="font-bold text-slate-800 dark:text-white truncate">POKTAN TANI AGUNG</span>
                  </div>
                </div>

                {tags.length > 0 && tags[0] !== "" && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" /> Masukkan Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY GAMBAR ASLI PENUH (LIGHTBOX) */}
      {isFullScreenImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-2 md:p-6 cursor-zoom-out animate-on-load backdrop-blur-lg" 
          style={{ animationDuration: '0.2s' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFullScreenImage(false);
          }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreenImage(false);
            }} 
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-red-500/80 border border-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={product.cleanImage} 
            alt="Full Size Preview" 
            className="max-w-full max-h-full object-contain cursor-default drop-shadow-2xl rounded-md" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};

// --- CART / CHECKOUT MODAL ---
const CartModal = ({ cart, onClose, updateQty, removeItem }) => {
  const [formData, setFormData] = useState({ nama: '', alamat: '', telepon: '', kurir: '', pembayaran: '' });
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  }, []);

  const totalRawPrice = cart.reduce((acc, item) => {
    return acc + (getRawNumber(item.product['Harga Produk']) * item.qty);
  }, 0);

  const kurirOptions = ['SPX', 'J&T', 'JNE', 'NinjaExpress', 'Kurir Lokal'];
  const paymentOptions = ['QRIS', 'BTN', 'MANDIRI', 'BANK JATIM', 'DANA', 'SEABANK'];

  const handleCheckout = () => {
    if (!formData.nama || !formData.alamat || !formData.telepon) {
      alert("Mohon lengkapi Nama Asli, Alamat Lengkap, dan Nomor Telepon terlebih dahulu.");
      return;
    }
    if (!formData.kurir) {
      alert("Silakan pilih kurir pengiriman.");
      return;
    }
    if (!formData.pembayaran) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }

    let message = `Halo POKTAN TANI AGUNG, saya ingin memesan:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product['Nama Produk']} - ${item.qty}x\n`;
    });
    message += `\n*Total Belanja (Belum Ongkir): ${formatRupiah(totalRawPrice)}*\n\n`;
    message += `*Data Pengiriman:*\nNama: ${formData.nama}\nTelepon: ${formData.telepon}\nAlamat: ${formData.alamat}\nKurir: ${formData.kurir}\nPembayaran: ${formData.pembayaran}\n\nMohon informasi total beserta ongkos kirimnya. Terima kasih.`;
    
    const waUrl = `https://wa.me/6283134644375?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-2 md:p-6 bg-slate-900/90 backdrop-blur-md animate-on-load" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* LEFT COL: Cart Items */}
        <div className="w-full md:w-1/2 flex flex-col p-4 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 h-1/2 md:h-auto overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-6">
            <ShoppingCart className="text-purple-600 dark:text-purple-400" /> Keranjang Belanja
          </h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-slate-500 h-full flex flex-col items-center justify-center text-center">
                <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                <p>Keranjang Anda masih kosong.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 md:p-4 flex gap-4 relative group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.cleanImage} alt={item.product['Nama Produk']} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="pr-8">
                      <h4 className="font-bold text-sm md:text-base leading-tight text-slate-800 dark:text-slate-200 line-clamp-1">{item.product['Nama Produk']}</h4>
                      <p className="text-purple-600 dark:text-purple-400 font-black mt-1 text-sm">{formatRupiahKecil(item.product['Harga Produk'])}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Jumlah:</span>
                      <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button onClick={() => updateQty(item.product['ID Produk'], -1)} className="p-1 text-slate-500 hover:text-purple-600 dark:hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="px-3 font-bold text-sm text-slate-800 dark:text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.product['ID Produk'], 1)} className="p-1 text-slate-500 hover:text-purple-600 dark:hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product['ID Produk'])}
                    className="absolute top-3 right-3 md:top-4 md:right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Subtotal</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalRawPrice)}</span>
          </div>
        </div>

        {/* RIGHT COL: Checkout Form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col h-1/2 md:h-auto overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl md:text-2xl font-bold mb-6 hidden md:block">Konfirmasi Pembeli</h2>
          
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-xs md:text-sm text-red-700 dark:text-red-300">
              Total harga tersebut <strong>belum termasuk ongkos kirim (Ongkir)</strong>. Ongkir akan diinformasikan lebih lanjut oleh Admin melalui WhatsApp.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nama Asli *</label>
              <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm" placeholder="Nama Lengkap Anda" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Nomor Telepon *</label>
              <input type="tel" value={formData.telepon} onChange={e => setFormData({...formData, telepon: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm" placeholder="08xx..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Alamat Lengkap *</label>
              <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} rows="2" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm" placeholder="Jalan, RT/RW, Desa, Kecamatan, Kota, Kode Pos" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Pilihan Kurir</label>
              <div className="grid grid-cols-3 gap-2">
                {kurirOptions.map(k => (
                  <button key={k} onClick={() => setFormData({...formData, kurir: k})} className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${formData.kurir === k ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-400 dark:hover:border-slate-500'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map(p => (
                  <button key={p} onClick={() => setFormData({...formData, pembayaran: p})} className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${formData.pembayaran === p ? 'bg-sky-600 border-sky-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-400 dark:hover:border-slate-500'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proses di WhatsApp <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

// --- LOGIN MODAL ---
const LoginModal = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'LOGIN', username: formData.username, password: formData.password })
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        setSuccess(result.message);
        setTimeout(() => onClose(), 1500);
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-on-load"
        style={{ animationDuration: '0.2s' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors z-10"><X className="w-6 h-6" /></button>
        <div className="p-8">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Logo" className="h-16 mx-auto mb-4 object-contain drop-shadow-md" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Login Admin</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masuk untuk mengelola POKTAN TANI AGUNG</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email / No. Telepon</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" placeholder="Masukkan email atau nomor HP"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-12" placeholder="Masukkan password"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            {error && <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm font-semibold">{success}</div>}
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center disabled:opacity-70 mt-4">
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
