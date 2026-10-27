'use client';

import React, { useEffect, useState } from 'react';
import { Faculty } from '@/types';
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
  Plus,
  Edit2,
  Trash2,
  GitFork,
  BookOpen,
  Users,
  Building2,
  Sparkles,
  X,
  Layers,
} from 'lucide-react';

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  // Faculty Modal
  const [facModalOpen, setFacModalOpen] = useState(false);
  const [facName, setFacName] = useState('');
  const [facCode, setFacCode] = useState('');
  const [editingFac, setEditingFac] = useState<Faculty | null>(null);
  const [facSubmitting, setFacSubmitting] = useState(false);

  // Dept Modal
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [selectedFacForDept, setSelectedFacForDept] = useState<Faculty | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptSubmitting, setDeptSubmitting] = useState(false);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculties');
      setFaculties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleOpenAddFaculty = () => {
    setEditingFac(null);
    setFacName('');
    setFacCode('');
    setFacModalOpen(true);
  };

  const handleOpenEditFaculty = (fac: Faculty) => {
    setEditingFac(fac);
    setFacName(fac.name);
    setFacCode(fac.code || '');
    setFacModalOpen(true);
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) return;
    setFacSubmitting(true);
    try {
      if (editingFac) {
        await api.patch(`/faculties/${editingFac.id}`, {
          name: facName.trim(),
          code: facCode.trim() || undefined,
        });
        toast.success('ແກ້ໄຂຄະນະສຳເລັດ', facName.trim());
      } else {
        await api.post('/faculties', {
          name: facName.trim(),
          code: facCode.trim() || undefined,
        });
        toast.success('ເພີ່ມຄະນະສຳເລັດ', facName.trim());
      }
      setFacModalOpen(false);
      setFacName('');
      setFacCode('');
      setEditingFac(null);
      fetchFaculties();
    } catch (err: any) {
      toast.apiError(err, 'ບັນທຶກຄະນະບໍ່ສຳເລັດ');
    } finally {
      setFacSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (f: Faculty) => {
    if (
      !confirm(
        `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ "${f.name}"? ພາກວິຊາ ແລະ ຂໍ້ມູນທີ່ກ່ຽວຂ້ອງຈະຖືກລຶບອອກ.`
      )
    )
      return;
    try {
      await api.delete(`/faculties/${f.id}`);
      toast.success('ລຶບຄະນະສຳເລັດ', f.name);
      fetchFaculties();
    } catch (err: any) {
      toast.apiError(err, 'ລຶບຄະນະບໍ່ສຳເລັດ');
    }
  };

  const handleOpenAddDept = (fac: Faculty) => {
    setSelectedFacForDept(fac);
    setDeptName('');
    setDeptModalOpen(true);
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacForDept || !deptName.trim()) return;
    setDeptSubmitting(true);
    try {
      await api.post(`/faculties/${selectedFacForDept.id}/departments`, {
        name: deptName.trim(),
      });
      toast.success('ເພີ່ມພາກວິຊາສຳເລັດ', `${deptName.trim()} · ${selectedFacForDept.name}`);
      setDeptModalOpen(false);
      setDeptName('');
      fetchFaculties();
    } catch (err: any) {
      toast.apiError(err, 'ເພີ່ມພາກວິຊາບໍ່ສຳເລັດ');
    } finally {
      setDeptSubmitting(false);
    }
  };

  const handleDeleteDept = async (deptId: number) => {
    if (!confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບພາກວິຊານີ້?')) return;
    try {
      await api.delete(`/faculties/departments/${deptId}`);
      toast.success('ລຶບພາກວິຊາສຳເລັດ');
      fetchFaculties();
    } catch (err: any) {
      toast.apiError(err, 'ລຶບພາກວິຊາບໍ່ສຳເລັດ');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#003d9b] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#003d9b]" />
              ໂຄງສ້າງການສຶກສາ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ຄຸ້ມຄອງໂຄງສ້າງ ຄະນະ ແລະ ພາກວິຊາ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ກຳນົດໂຄງສ້າງຄະນະວິຊາ ແລະ ພາກວິຊາຕ່າງໆ ພາຍໃນມະຫາວິທະຍາໄລແຫ່ງຊາດ (ທັງໝົດ {faculties.length} ຄະນະ)
          </p>
        </div>

        <button
          onClick={handleOpenAddFaculty}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ເພີ່ມຄະນະໃໝ່</span>
        </button>
      </div>

      {/* Grid of Faculty Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນຄະນະວິຊາ...</p>
        </div>
      ) : faculties.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl bg-white border border-slate-200/80">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#191c1d] mb-1">ຍັງບໍ່ມີຂໍ້ມູນຄະນະວິຊາ</h3>
          <p className="text-xs text-[#737685] mb-4">ກົດປຸ່ມດ້ານເທິງເພື່ອເພີ່ມຄະນະວິຊາທຳອິດ</p>
          <button
            onClick={handleOpenAddFaculty}
            className="px-4 py-2 rounded-xl bg-[#003d9b] text-white text-xs font-semibold"
          >
            ເພີ່ມຄະນະໃໝ່
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faculties.map((fac) => (
            <div
              key={fac.id}
              className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="text-[10px] font-extrabold bg-blue-50 text-[#003d9b] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100/80">
                      ລະຫັດ: {fac.code || 'N/A'}
                    </span>
                    <h2 className="text-base font-bold text-[#191c1d] mt-2 group-hover:text-[#003d9b] transition-colors leading-snug">
                      {fac.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditFaculty(fac)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#003d9b] hover:bg-blue-50 transition-colors"
                      title="ແກ້ໄຂຄະນະ"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(fac)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="ລຶບຄະນະ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Departments Section */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-[#737685] uppercase tracking-wider flex items-center gap-1.5">
                      <GitFork className="w-3.5 h-3.5 text-[#0052cc]" />
                      <span>ພາກວິຊາ ({fac.departments?.length || 0})</span>
                    </p>
                    <button
                      onClick={() => handleOpenAddDept(fac)}
                      className="text-xs font-bold text-[#0052cc] hover:text-[#003d9b] hover:underline flex items-center gap-1 bg-blue-50/80 px-2.5 py-1 rounded-xl transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ເພີ່ມພາກວິຊາ</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {fac.departments && fac.departments.length > 0 ? (
                      fac.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 text-xs text-[#434654] transition-colors"
                        >
                          <span className="truncate pr-2 font-medium">{dept.name}</span>
                          <button
                            onClick={() => handleDeleteDept(dept.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                            title="ລຶບພາກວິຊາ"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400 italic py-2">
                        ຍັງບໍ່ມີພາກວິຊາສັງກັດໃນຄະນະນີ້.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center text-[11px] text-[#737685]">
                <span className="flex items-center gap-1 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {fac._count?.documents || 0} ເອກະສານ
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {fac._count?.users || 0} ຜູ້ໃຊ້ງານ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty Modal (Shadcn Dialog) */}
      <Dialog open={facModalOpen} onOpenChange={setFacModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFac ? 'ແກ້ໄຂຂໍ້ມູນຄະນະວິຊາ' : 'ເພີ່ມຄະນະວິຊາໃໝ່'}
            </DialogTitle>
            <DialogDescription>
              {editingFac
                ? 'ອັບເດດຊື່ ຫຼື ລະຫັດຫຍໍ້ຂອງຄະນະວິຊາ'
                : 'ປ້ອນຊື່ ແລະ ລະຫັດຫຍໍ້ເພື່ອສ້າງຄະນະວິຊາໃໝ່ໃນລະບົບ'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveFaculty} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1.5">
                ຊື່ຄະນະວິຊາ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={facName}
                onChange={(e) => setFacName(e.target.value)}
                placeholder="ຕົວຢ່າງ: ຄະນະວິສະວະກຳສາດ"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1.5">
                ລະຫັດຫຍໍ້ຄະນະ (Code ເຊັ່ນ: FE, FEB, FNS, FES)
              </label>
              <input
                type="text"
                value={facCode}
                onChange={(e) => setFacCode(e.target.value)}
                placeholder="FE"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setFacModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={facSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md shadow-[#003d9b]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {facSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກຄະນະ'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Department Modal (Shadcn Dialog) */}
      <Dialog open={deptModalOpen} onOpenChange={setDeptModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ເພີ່ມພາກວິຊາໃໝ່</DialogTitle>
            <DialogDescription>
              ສັງກັດ: <strong className="text-[#003d9b]">{selectedFacForDept?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDept} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1.5">
                ຊື່ພາກວິຊາ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="ຕົວຢ່າງ: ພາກວິຊາວິສະວະກຳຄອມພິວເຕີ"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setDeptModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={deptSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md shadow-[#003d9b]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {deptSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ເພີ່ມພາກວິຊາ'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
