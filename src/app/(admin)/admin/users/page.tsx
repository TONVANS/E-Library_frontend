'use client';

import React, { useEffect, useState } from 'react';
import { User, Faculty, Role } from '@/types';
import api from '@/lib/axios';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT',
    password: '',
    facultyId: '',
    departmentId: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: {
          page,
          limit: 10,
          role: roleFilter || undefined,
          search: search || undefined,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages || 1);
      setTotalItems(res.data.meta.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadFaculties() {
      try {
        const res = await api.get('/faculties');
        setFaculties(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadFaculties();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, search]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/users', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        role: formData.role,
        password: formData.password || undefined,
        facultyId: formData.facultyId ? Number(formData.facultyId) : undefined,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
      });

      setModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'STUDENT',
        password: '',
        facultyId: '',
        departmentId: '',
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ສ້າງຜູ້ໃຊ້ງານບໍ່ສຳເລັດ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (u: User) => {
    const newPass = prompt(`ປ້ອນລະຫັດຜ່ານໃໝ່ສຳລັບ ${u.firstName} ${u.lastName} (${u.userCode}):`, 'Nuol@1234');
    if (!newPass) return;
    try {
      await api.patch(`/users/${u.id}/reset-password`, { newPassword: newPass });
      alert('ຣີເຊັດລະຫັດຜ່ານສຳເລັດແລ້ວ!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'ຣີເຊັດລະຫັດຜ່ານບໍ່ສຳເລັດ');
    }
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບັນຊີ "${u.firstName} ${u.lastName}" (${u.userCode})?`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ລຶບບັນຊີບໍ່ສຳເລັດ');
    }
  };

  const roleLabelMap: Record<string, string> = {
    ADMIN: 'ຜູ້ດູແລລະບົບ',
    TEACHER: 'ອາຈານສອນ',
    STUDENT: 'ນັກສຶກສາ',
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ລາຍຊື່ຜູ້ໃຊ້ງານລະບົບ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຈັດການບັນຊີອາຈານ, ນັກສຶກສາ ແລະ ຜູ້ດູແລລະບົບ (ທັງໝົດ {totalItems} ບັນຊີ)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>ເພີ່ມບັນຊີຜູ້ໃຊ້ໃໝ່</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ຄົ້ນຫາຊື່, ອີເມວ, ຫຼື ລະຫັດຜູ້ໃຊ້..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-white shadow-sm"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-white shadow-sm"
        >
          <option value="">ທຸກໆສິດ (All Roles)</option>
          <option value="ADMIN">ຜູ້ດູແລລະບົບ (ADMIN)</option>
          <option value="TEACHER">ອາຈານສອນ (TEACHER)</option>
          <option value="STUDENT">ນັກສຶກສາ (STUDENT)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
              <tr>
                <th className="p-4">ລະຫັດຜູ້ໃຊ້</th>
                <th className="p-4">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="p-4">ອີເມວ</th>
                <th className="p-4">ສິດການໃຊ້ງານ</th>
                <th className="p-4">ສັງກັດຄະນະ</th>
                <th className="p-4 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ກຳລັງໂຫຼດຂໍ້ມູນຜູ້ໃຊ້ງານ...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານ.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#003d9b]">{u.userCode}</td>
                    <td className="p-4 font-semibold text-[#191c1d]">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-4 text-slate-500">{u.email || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700'
                            : u.role === 'TEACHER'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {roleLabelMap[u.role] || u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{u.faculty?.code || u.faculty?.name || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleResetPassword(u)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                          title="ຣີເຊັດລະຫັດຜ່ານ"
                        >
                          <span className="material-symbols-outlined text-base">key</span>
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          title="ລຶບບັນຊີ"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
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

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-[#003d9b]">ສ້າງບັນຊີຜູ້ໃຊ້ໃໝ່</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ຊື່ *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="ຄຳຫຼ້າ"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ນາມສະກຸນ *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="ໄຊຍະວົງ"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ອີເມວ (Email)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@nuol.edu.la"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ສິດການໃຊ້ງານ *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                >
                  <option value="STUDENT">ນັກສຶກສາ (STUDENT)</option>
                  <option value="TEACHER">ອາຈານສອນ (TEACHER)</option>
                  <option value="ADMIN">ຜູ້ດູແລລະບົບ (ADMIN)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ສັງກັດຄະນະ</label>
                <select
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                >
                  <option value="">ເລືອກຄະນະ (ບໍ່ບັງຄັບສຳລັບ Admin)</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">
                  ລະຫັດຜ່ານເລີ່ມຕົ້ນ (Default: Nuol@1234)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nuol@1234"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs hover:bg-slate-200"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md shadow-[#003d9b]/25 hover:shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'ກຳລັງສ້າງ...' : 'ສ້າງບັນຊີ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
