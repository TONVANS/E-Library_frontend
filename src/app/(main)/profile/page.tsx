'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchProfile } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'ລະຫັດຜ່ານໃໝ່ທັງສອງຊ່ອງບໍ່ກົງກັນ.' });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ.' });
      return;
    }

    setSubmitting(true);
    setMsg(null);
    try {
      await api.patch('/auth/password', {
        currentPassword,
        newPassword,
      });
      setMsg({ type: 'success', text: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດຮຽບຮ້ອຍແລ້ວ!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'ປ່ຽນລະຫັດຜ່ານບໍ່ສຳເລັດ ກະລຸນາກວດສອບລະຫັດຜ່ານເກົ່າ.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabelMap: Record<string, string> = {
    ADMIN: 'ຜູ້ດູແລລະບົບ (Admin)',
    TEACHER: 'ອາຈານສອນ (Teacher)',
    STUDENT: 'ນັກສຶກສາ (Student)',
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນໂປຣໄຟລ໌...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#003d9b] tracking-tight">
          ບັນຊີຜູ້ໃຊ້ ແລະ ຄວາມປອດໄພ
        </h1>
        <p className="text-xs text-[#737685] mt-1">
          ຈັດການຂໍ້ມູນບັນຊີສະຖາບັນ ມຊ ແລະ ປ່ຽນລະຫັດຜ່ານເຂົ້າໃຊ້ງານ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#003d9b] to-[#0052cc] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#003d9b]/20">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <h2 className="text-base font-bold text-[#191c1d]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-[#737685] mt-0.5">{user.email || 'ບໍ່ມີອີເມວລົງທະບຽນ'}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-[#737685]">ສິດການໃຊ້ງານ:</span>
                <span className="font-bold text-[#003d9b]">{roleLabelMap[user.role] || user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737685]">ລະຫັດຜູ້ໃຊ້:</span>
                <span className="font-semibold text-[#191c1d] font-mono">{user.userCode}</span>
              </div>
              {user.faculty && (
                <div className="flex justify-between">
                  <span className="text-[#737685]">ສັງກັດຄະນະ:</span>
                  <span className="font-medium text-[#191c1d] text-right truncate max-w-[150px]">
                    {user.faculty.code || user.faculty.name}
                  </span>
                </div>
              )}
              {user.department && (
                <div className="flex justify-between">
                  <span className="text-[#737685]">ພາກວິຊາ:</span>
                  <span className="font-medium text-[#191c1d] text-right truncate max-w-[150px]">
                    {user.department.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-[#003d9b] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lock_reset</span>
              ປ່ຽນລະຫັດຜ່ານໃໝ່
            </h3>
            <p className="text-xs text-[#737685] mb-6">
              ແນະນຳໃຫ້ຕັ້ງລະຫັດຜ່ານທີ່ມີຄວາມປອດໄພສູງ ແລະ ບໍ່ເປີດເຜີຍຕໍ່ຜູ້ອື່ນ.
            </p>

            {msg && (
              <div
                className={`mb-6 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  msg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {msg.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1.5 uppercase tracking-wider">
                  ລະຫັດຜ່ານປັດຈຸບັນ *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1.5 uppercase tracking-wider">
                  ລະຫັດຜ່ານໃໝ່ *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1.5 uppercase tracking-wider">
                  ຢືນຢັນລະຫັດຜ່ານໃໝ່ *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {submitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກລະຫັດຜ່ານໃໝ່'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
