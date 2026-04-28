import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, Image as ImageIcon, X, ShieldCheck, Zap, AlertCircle, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ScanScreen = () => {
  const { navigateTo } = useApp();
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText) => {
      scanner.clear();
      processQR(decodedText);
    };

    const onScanFailure = (error) => {
      // Ignore failures
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(e => console.error("Scanner clear failed", e));
    };
  }, []);

  const processQR = (data) => {
    // Simulate validation and merchant lookup
    // Simple UPI URI validation: upi://pay?pa=...
    if (data.startsWith('upi://pay') || data.includes('@')) {
      const urlParams = new URLSearchParams(data.split('?')[1]);
      const pa = urlParams.get('pa') || data; // payee address
      const pn = urlParams.get('pn') || 'Verified Merchant'; // payee name
      
      navigateTo('payment', { receiver: pa, merchantName: pn });
    } else {
      setError("Invalid QR Code. Please scan a valid UPI QR.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        processQR(decodedText);
      })
      .catch(err => {
        setError("Could not read QR from image. Try a clearer photo.");
        setTimeout(() => setError(null), 3000);
      });
  };

  return (
    <div className="flex flex-col h-screen bg-premium-dark overflow-hidden relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateTo('home')}
          className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10"
        >
          <ChevronLeft size={24} />
        </motion.button>
        <div className="flex flex-col items-center">
          <h3 className="text-white font-black uppercase tracking-widest text-[10px]">QR Scanner</h3>
          <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Bank Verified V3.1</p>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Scanner Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div id="reader" className="w-full max-w-sm rounded-[3rem] overflow-hidden border-4 border-primary-500/30 shadow-2xl bg-black/40 relative">
          {/* Custom Overlay UI */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary-400/50 rounded-3xl" />
            <motion.div 
              animate={{ top: ['30%', '70%', '30%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-1/2 -translate-x-1/2 w-64 h-0.5 bg-primary-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 px-6 py-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200"
            >
              <AlertCircle size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-10 pb-16 flex justify-around items-center glass-dark border-t border-white/5">
        <div className="flex flex-col items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10"
          >
            <Camera size={28} />
          </motion.button>
          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Flash</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current.click()}
            className="w-20 h-20 blue-gradient rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary-500/40"
          >
            <ImageIcon size={32} />
          </motion.button>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload QR</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10"
          >
            <ShieldCheck size={28} />
          </motion.button>
          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Safe Scan</span>
        </div>
      </div>
    </div>
  );
};

export default ScanScreen;
