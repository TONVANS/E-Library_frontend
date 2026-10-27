'use client';

import React, { useEffect, useState } from 'react';
import { UserActivity } from '@/types';
import api from '@/lib/axios';
import {
  BarChart3,
  Download,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  FileText,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [actionType, setActionType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/activities', {
        params: {
          page,
          limit: 15,
          actionType: actionType || undefined,
        },
      });
      setActivities(res.data.data);
      setTotalPages(res.data.meta.totalPages || 1);
      setTotalItems(res.data.meta.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, actionType]);

  const roleLabelMap: Record<string, string> = {
    ADMIN: 'ຜູ້ດູແລລະບົບ',
    TEACHER: 'ອາຈານສອນ',
    STUDENT: 'ນັກສຶກສາ',
  };

  return (
    <div className="space-y-6 sm:space-y-8 fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#003d9b] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-[#003d9b]" />
              ບັນທຶກການເຄື່ອນໄຫວ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ລາຍງານ ແລະ ປະຫວັດການເຄື່ອນໄຫວ (Audit Logs)
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ບັນທຶກປະຫວັດການເຂົ້າເບິ່ງ ແລະ ດາວໂຫຼດເອກະສານຂອງນັກສຶກສາ ແລະ ອາຈານ (ທັງໝົດ {totalItems} ລາຍການ)
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={actionType}
            onChange={(e) => {
              setActionType(e.target.value);
              setPage(1);
            }}
            className="p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20"
          >
            <option value="">ທຸກໆປະເພດການເຄື່ອນໄຫວ</option>
            <option value="VIEW">👁️ ການເຂົ້າເບິ່ງ (VIEW)</option>
            <option value="DOWNLOAD">⬇️ ການດາວໂຫຼດໄຟລ໌ (DOWNLOAD)</option>
          </select>
        </div>
      </div>

      {/* Activities Table */}
      <div className="glass-panel rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
              <tr>
                <th className="p-4">ວັນທີ ແລະ ເວລາ</th>
                <th className="p-4">ປະເພດການກະທຳ</th>
                <th className="p-4">ຊື່ຜູ້ໃຊ້ງານ</th>
                <th className="p-4">ສິດ</th>
                <th className="p-4">ເອກະສານວິຊາການ</th>
                <th className="p-4">ສັງກັດຄະນະ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="inline-block w-7 h-7 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs font-semibold">ກຳລັງໂຫຼດບັນທຶກປະຫວັດ...</p>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                    ບໍ່ມີປະຫວັດການເຄື່ອນໄຫວຕາມເງື່ອນໄຂ.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(act.createdAt).toLocaleString('lo-LA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          act.actionType === 'DOWNLOAD'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {act.actionType === 'DOWNLOAD' ? (
                          <>
                            <Download className="w-3 h-3" />
                            <span>ດາວໂຫຼດ</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>ເຂົ້າເບິ່ງ</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-[#003d9b] flex items-center justify-center text-[10px] font-bold">
                          {act.user?.firstName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#191c1d]">
                            {act.user?.firstName} {act.user?.lastName}
                          </p>
                          <p className="text-[10px] text-[#737685] font-mono">
                            {act.user?.userCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-[#737685]">
                        {roleLabelMap[act.user?.role || ''] || act.user?.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#003d9b] max-w-xs truncate group-hover:text-[#0052cc]">
                      <span className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{act.document?.title || '-'}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {act.document?.faculty?.name || act.user?.faculty?.name || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 shadow-sm flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ກ່ອນໜ້າ</span>
          </button>
          <span className="text-xs font-semibold text-[#434654] px-3">
            ໜ້າ {page} ຈາກ {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 shadow-sm flex items-center gap-1 transition-colors"
          >
            <span>ຖັດໄປ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
