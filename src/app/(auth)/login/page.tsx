'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (codeToUse?: string, passToUse?: string) => {
    const finalCode = (codeToUse || userCode).trim();
    const finalPass = passToUse || password;

    if (!finalCode || !finalPass) {
      setError('ກະລຸນາປ້ອນ ລະຫັດຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ ໃຫ້ຄົບຖ້ວນ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', {
        userCode: finalCode,
        password: finalPass,
      });

      setAuth(res.data.user, res.data.accessToken);

      if (res.data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ ກະລຸນາກວດສອບລະຫັດຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານຄືນໃໝ່.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (code: string, pass: string) => {
    setUserCode(code);
    setPassword(pass);
    handleLogin(code, pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#003d9b]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#cba72f]/15 blur-3xl" />

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-white/80 bg-white/80 relative z-10 fade-in-up">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#003d9b] to-[#0052cc] text-white flex items-center justify-center shadow-lg shadow-[#003d9b]/20">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#003d9b] tracking-tight">ຫໍສະໝຸດດິຈິຕອນ ມຊ</h1>
          <p className="text-xs text-[#737685] mt-1">
            ລະບົບຄັງເອກະສານວິຊາການ ແລະ ບົດຄົ້ນຄວ້າ ມະຫາວິທະຍາໄລແຫ່ງຊາດ
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5 uppercase tracking-wider">
              ລະຫັດຜູ້ໃຊ້ງານ (User Code ເຊັ່ນ: AD001, TC001, ST001)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                badge
              </span>
              <input
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="ST001"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 focus:border-[#0052cc]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5 uppercase tracking-wider">
              ລະຫັດຜ່ານ (Password)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 focus:border-[#0052cc]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-sm shadow-md shadow-[#003d9b]/25 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ເຂົ້າສູ່ລະບົບຫໍສະໝຸດ</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Presets */}
        <div className="mt-8 pt-6 border-t border-slate-200/80">
          <p className="text-[11px] font-bold text-[#737685] uppercase tracking-wider mb-2.5 text-center">
            ທົດລອງເຂົ້າສູ່ລະບົບຕາມສິດ (1-Click Login)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('AD001', 'admin123')}
              className="p-2 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-100 text-center transition-all"
            >
              <span className="block text-[11px] font-bold text-[#003d9b]">ແອັດມິນ</span>
              <span className="text-[10px] text-slate-500 font-mono">AD001</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('TC001', 'teacher123')}
              className="p-2 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-100 text-center transition-all"
            >
              <span className="block text-[11px] font-bold text-amber-800">ອາຈານ</span>
              <span className="text-[10px] text-slate-500 font-mono">TC001</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('ST001', 'student123')}
              className="p-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-100 text-center transition-all"
            >
              <span className="block text-[11px] font-bold text-emerald-800">ນັກສຶກສາ</span>
              <span className="text-[10px] text-slate-500 font-mono">ST001</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-[#003d9b] hover:underline font-medium">
            ← ກັບຄືນສູ່ໜ້າຫຼັກຫໍສະໝຸດ
          </Link>
        </div>
      </div>
    </div>
  );
}
