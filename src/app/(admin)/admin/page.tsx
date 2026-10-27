'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/cards/StatsCard';
import { useAuthStore } from '@/store/authStore';
import { DashboardStats } from '@/types';
import api from '@/lib/axios';
import {
  Upload,
  TrendingUp,
  History,
  FileText,
  ArrowRight,
  Sparkles,
  Download,
  Eye,
} from 'lucide-react';

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
      <div className="py-24 text-center">
        <div className="inline-block w-9 h-9 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນສະຖິຕິລະບົບ...</p>
      </div>
    );
  }

  const { overview, popularDocuments, recentActivities } = stats;

  return (
    <div className="space-y-6 sm:space-y-8 fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white via-white to-blue-50/60 p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#003d9b] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#cba72f]" />
              ພາບລວມຄັງຄວາມຮູ້
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ກະດານຄວບຄຸມສະຖິຕິຫໍສະໝຸດ (Dashboard)
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຍິນດີຕ້ອນຮັບ, <strong className="text-[#191c1d]">{user?.firstName} {user?.lastName}</strong> • ຕິດຕາມການເຄື່ອນໄຫວ ແລະ ຄັງເອກະສານວິຊາການ ມຊ
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/docs"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>ອັບໂຫຼດເອກະສານໃໝ່</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Analytics Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Documents */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#003d9b] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>ເອກະສານວິຊາການຍອດນິຍົມ</span>
              </h2>
              <Link
                href="/admin/docs"
                className="text-xs text-[#0052cc] font-semibold hover:underline flex items-center gap-1"
              >
                <span>ເບິ່ງທັງໝົດ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {popularDocuments.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center italic">ຍັງບໍ່ມີຂໍ້ມູນເອກະສານ.</p>
              ) : (
                popularDocuments.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50/70 rounded-2xl px-2.5 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 truncate min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 shadow-sm ${
                          idx === 0
                            ? 'bg-amber-400 text-amber-950'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-700 text-amber-50'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate min-w-0">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="text-xs font-bold text-[#191c1d] group-hover:text-[#003d9b] transition-colors truncate block"
                        >
                          {doc.title}
                        </Link>
                        <p className="text-[11px] text-[#737685] truncate mt-0.5">
                          {doc.author} • {doc.faculty?.code || doc.faculty?.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#003d9b] shrink-0 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#0052cc]" />
                      <span>{doc._count?.userActivities || 0} ຄັ້ງ</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#003d9b] flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" />
                <span>ປະຫວັດຫຼ້າສຸດ</span>
              </h2>
              <Link
                href="/admin/reports"
                className="text-xs text-[#0052cc] font-semibold hover:underline flex items-center gap-1"
              >
                <span>ບັນທຶກເຕັມ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center italic">ຍັງບໍ່ມີປະຫວັດການເຄື່ອນໄຫວ.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="py-3 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-[#191c1d] truncate">
                        {act.user?.firstName} {act.user?.lastName}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                          act.actionType === 'DOWNLOAD'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {act.actionType === 'DOWNLOAD' ? (
                          <>
                            <Download className="w-2.5 h-2.5" />
                            <span>ດາວໂຫຼດ</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>ເຂົ້າເບິ່ງ</span>
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#434654] truncate">
                      <span className="font-medium text-[#003d9b]">{act.document?.title || 'ເອກະສານ'}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
