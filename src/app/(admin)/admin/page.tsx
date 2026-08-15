'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/cards/StatsCard';
import { useAuthStore } from '@/store/authStore';
import { DashboardStats } from '@/types';
import api from '@/lib/axios';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/reports/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນສະຖິຕິລະບົບ...</p>
      </div>
    );
  }

  const { overview, popularDocuments, recentActivities } = stats;

  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ກະດານຄວບຄຸມສະຖິຕິຫໍສະໝຸດ (Dashboard)
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຍິນດີຕ້ອນຮັບ, {user?.firstName} {user?.lastName} • ພາບລວມການເຄື່ອນໄຫວ ແລະ ຄັງເອກະສານ ມຊ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/docs"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>ອັບໂຫຼດເອກະສານໃໝ່</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="ເອກະສານທັງໝົດ"
          value={overview.totalDocuments}
          icon="description"
          subtitle={`${overview.availableDocuments} ພ້ອມໃຫ້ບໍລິການ`}
          colorVariant="blue"
        />
        <StatsCard
          title="ຜູ້ໃຊ້ງານໃນລະບົບ"
          value={overview.totalUsers}
          icon="group"
          subtitle={`${overview.totalStudents} ນັກສຶກສາ • ${overview.totalTeachers} ອາຈານ`}
          colorVariant="gold"
        />
        <StatsCard
          title="ຍອດການເຂົ້າເບິ່ງ"
          value={overview.totalViews}
          icon="visibility"
          subtitle="ຈຳນວນຄັ້ງທີ່ອ່ານເອກະສານ"
          colorVariant="purple"
        />
        <StatsCard
          title="ຍອດການດາວໂຫຼດ"
          value={overview.totalDownloads}
          icon="download"
          subtitle="ຈຳນວນຄັ້ງທີ່ດາວໂຫຼດໄຟລ໌"
          colorVariant="green"
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Documents */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-[#003d9b] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-amber-500">trending_up</span>
              ເອກະສານວິຊາການຍອດນິຍົມ
            </h2>
            <Link href="/admin/docs" className="text-xs text-[#0052cc] font-semibold hover:underline">
              ເບິ່ງທັງໝົດ
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {popularDocuments.map((doc, idx) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 truncate">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-[#003d9b] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#191c1d] truncate">{doc.title}</p>
                    <p className="text-[11px] text-[#737685] truncate">
                      {doc.author} • {doc.faculty?.code || doc.faculty?.name}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#003d9b] shrink-0 bg-blue-50 px-2.5 py-1 rounded-full">
                  {doc._count?.userActivities || 0} ຄັ້ງ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-[#003d9b] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-emerald-500">history</span>
              ປະຫວັດການເຄື່ອນໄຫວຫຼ້າສຸດ
            </h2>
            <Link href="/admin/reports" className="text-xs text-[#0052cc] font-semibold hover:underline">
              ບັນທຶກເຕັມ
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-semibold text-[#191c1d]">
                    {act.user?.firstName} {act.user?.lastName}{' '}
                    <span className="text-[#737685] font-normal">
                      ({act.user?.role} • {act.user?.userCode})
                    </span>
                  </p>
                  <p className="text-[11px] text-[#434654] truncate max-w-xs">
                    {act.actionType === 'DOWNLOAD' ? '⬇️ ດາວໂຫຼດ' : '👁️ ເຂົ້າເບິ່ງ'}{' '}
                    <span className="font-medium text-[#003d9b]">{act.document?.title}</span>
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    act.actionType === 'DOWNLOAD'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {act.actionType === 'DOWNLOAD' ? 'ດາວໂຫຼດ' : 'ເຂົ້າເບິ່ງ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
