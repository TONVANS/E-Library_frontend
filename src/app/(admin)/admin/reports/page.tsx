'use client';

import React, { useEffect, useState } from 'react';
import { UserActivity } from '@/types';
import api from '@/lib/axios';

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
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ລາຍງານ ແລະ ປະຫວັດການເຄື່ອນໄຫວ (Audit Logs)
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ບັນທຶກປະຫວັດການເຂົ້າເບິ່ງ ແລະ ດາວໂຫຼດເອກະສານຂອງນັກສຶກສາ ແລະ ອາຈານ (ທັງໝົດ {totalItems} ລາຍການ)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={actionType}
            onChange={(e) => {
              setActionType(e.target.value);
              setPage(1);
            }}
            className="p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-white shadow-sm"
          >
            <option value="">ທຸກໆປະເພດການເຄື່ອນໄຫວ</option>
            <option value="VIEW">👁️ ການເຂົ້າເບິ່ງ (VIEW)</option>
            <option value="DOWNLOAD">⬇️ ການດາວໂຫຼດໄຟລ໌ (DOWNLOAD)</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
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
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ກຳລັງໂຫຼດບັນທຶກປະຫວັດ...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ບໍ່ມີປະຫວັດການເຄື່ອນໄຫວ.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(act.createdAt).toLocaleString('lo-LA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.actionType === 'DOWNLOAD'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {act.actionType === 'DOWNLOAD' ? '⬇️ ດາວໂຫຼດ' : '👁️ ເຂົ້າເບິ່ງ'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#191c1d]">
                      {act.user?.firstName} {act.user?.lastName}
                      <span className="text-[#737685] text-[10px] block font-mono">
                        {act.user?.userCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-[#737685]">
                        {roleLabelMap[act.user?.role || ''] || act.user?.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#003d9b] max-w-xs truncate">
                      {act.document?.title}
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
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 shadow-sm"
          >
            ກ່ອນໜ້າ
          </button>
          <span className="text-xs font-semibold text-[#434654] px-3">
            ໜ້າ {page} ຈາກ {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#191c1d] disabled:opacity-40 hover:bg-slate-50 shadow-sm"
          >
            ຖັດໄປ
          </button>
        </div>
      )}
    </div>
  );
}
