'use client';

import React, { useEffect, useState } from 'react';
import { User, Faculty, Role } from '@/types';
import api from '@/lib/axios';
import { toast } from '@/store/toastStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  UserPlus,
  Search,
  KeyRound,
  Trash2,
  Users,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Create User Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as Role,
    password: '',
    facultyId: '',
    departmentId: '',
  });

  // Reset Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('Nuol@1234');
  const [resetting, setResetting] = useState(false);

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
      const res = await api.post('/users', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        role: formData.role,
        password: formData.password || undefined,
        facultyId: formData.facultyId ? Number(formData.facultyId) : undefined,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
      });
      toast.success(
        'ສ້າງບັນຊີຜູ້ໃຊ້ສຳເລັດ',
        `ລະຫັດຜູ້ໃຊ້: ${res.data.userCode}` +
          (res.data.defaultPasswordUsed ? ` · ລະຫັດຜ່ານເລີ່ມຕົ້ນ: ${res.data.defaultPasswordUsed}` : ''),
      );

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
      toast.apiError(err, 'ສ້າງຜູ້ໃຊ້ງານບໍ່ສຳເລັດ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenResetModal = (u: User) => {
    setSelectedUserForReset(u);
    setNewPassword('Nuol@1234');
    setResetModalOpen(true);
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || !newPassword.trim()) return;
    setResetting(true);
    try {
      await api.patch(`/users/${selectedUserForReset.id}/reset-password`, {
        newPassword: newPassword.trim(),
      });
      toast.success(
        'ຣີເຊັດລະຫັດຜ່ານສຳເລັດແລ້ວ',
        `${selectedUserForReset.firstName} ${selectedUserForReset.lastName} (${selectedUserForReset.userCode})`,
      );
      setResetModalOpen(false);
    } catch (err: any) {
      toast.apiError(err, 'ຣີເຊັດລະຫັດຜ່ານບໍ່ສຳເລັດ');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (
      !confirm(
        `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບັນຊີ "${u.firstName} ${u.lastName}" (${u.userCode})?`
      )
    )
      return;
    try {
      await api.delete(`/users/${u.id}`);
      toast.success('ລຶບບັນຊີສຳເລັດ', `${u.firstName} ${u.lastName} (${u.userCode})`);
      fetchUsers();
    } catch (err: any) {
      toast.apiError(err, 'ລຶບບັນຊີບໍ່ສຳເລັດ');
    }
  };

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
              <Users className="w-3 h-3 text-[#003d9b]" />
              ບັນຊີສະມາຊິກ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ລາຍຊື່ຜູ້ໃຊ້ງານລະບົບ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຈັດການບັນຊີອາຈານ, ນັກສຶກສາ ແລະ ຜູ້ດູແລລະບົບ (ທັງໝົດ {totalItems} ບັນຊີ)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>ເພີ່ມບັນຊີຜູ້ໃຊ້ໃໝ່</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ຄົ້ນຫາຊື່, ອີເມວ, ຫຼື ລະຫັດຜູ້ໃຊ້..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="py-2 px-3 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20"
        >
          <option value="">ທຸກໆສິດ (All Roles)</option>
          <option value="ADMIN">ຜູ້ດູແລລະບົບ (ADMIN)</option>
          <option value="TEACHER">ອາຈານສອນ (TEACHER)</option>
          <option value="STUDENT">ນັກສຶກສາ (STUDENT)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
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
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="inline-block w-7 h-7 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs font-semibold">ກຳລັງໂຫຼດຂໍ້ມູນຜູ້ໃຊ້ງານ...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                    ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານຕາມເງື່ອນໄຂຄົ້ນຫາ.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 font-mono font-bold text-[#003d9b]">
                      <span className="bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100/80">
                        {u.userCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#003d9b] to-[#0052cc] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                          {u.firstName?.[0]}
                          {u.lastName?.[0]}
                        </div>
                        <span className="font-bold text-[#191c1d] group-hover:text-[#003d9b] transition-colors">
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{u.email || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          u.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : u.role === 'TEACHER'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {u.role === 'ADMIN' ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : u.role === 'TEACHER' ? (
                          <GraduationCap className="w-3 h-3" />
                        ) : (
                          <Briefcase className="w-3 h-3" />
                        )}
                        <span>{roleLabelMap[u.role] || u.role}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {u.faculty?.code || u.faculty?.name || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenResetModal(u)}
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="ຣີເຊັດລະຫັດຜ່ານ"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="ລຶບບັນຊີ"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create User Modal (Shadcn Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ສ້າງບັນຊີຜູ້ໃຊ້ໃໝ່</DialogTitle>
            <DialogDescription>
              ປ້ອນຂໍ້ມູນອາຈານ ຫຼື ນັກສຶກສາເພື່ອສ້າງບັນຊີເຂົ້າໃຊ້ລະບົບຫໍສະໝຸດ
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ຊື່ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="ຄຳຫຼ້າ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ນາມສະກຸນ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="ໄຊຍະວົງ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1">ອີເມວ (Email)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@nuol.edu.la"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ສິດການໃຊ້ງານ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as Role })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              >
                <option value="STUDENT">ນັກສຶກສາ (STUDENT)</option>
                <option value="TEACHER">ອາຈານສອນ (TEACHER)</option>
                <option value="ADMIN">ຜູ້ດູແລລະບົບ (ADMIN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1">ສັງກັດຄະນະ</label>
              <select
                value={formData.facultyId}
                onChange={(e) =>
                  setFormData({ ...formData, facultyId: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
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
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ລະຫັດຜ່ານເລີ່ມຕົ້ນ (Default: Nuol@1234)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Nuol@1234"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md shadow-[#003d9b]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {submitting ? 'ກຳລັງສ້າງ...' : 'ສ້າງບັນຊີ'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal (Shadcn Dialog) */}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#003d9b]">
              <Lock className="w-5 h-5 text-amber-500" />
              <span>ຣີເຊັດລະຫັດຜ່ານ</span>
            </DialogTitle>
            <DialogDescription>
              ຣີເຊັດລະຫັດຜ່ານໃຫ້ແກ່:{' '}
              <strong className="text-[#191c1d]">
                {selectedUserForReset?.firstName} {selectedUserForReset?.lastName}
              </strong>{' '}
              ({selectedUserForReset?.userCode})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmResetPassword} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1.5">
                ລະຫັດຜ່ານໃໝ່ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nuol@1234"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] font-mono focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
              <p className="text-[11px] text-[#737685] mt-1.5">
                ລະຫັດຜ່ານມາດຕະຖານແນະນຳ: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#003d9b]">Nuol@1234</code>
              </p>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={resetting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {resetting ? 'ກຳລັງຣີເຊັດ...' : 'ຢືນຢັນຣີເຊັດລະຫັດຜ່ານ'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
