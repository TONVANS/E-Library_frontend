'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import api from '@/lib/axios';
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
  Tags,
  BookOpen,
  FolderPlus,
  Sparkles,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingCat) {
        await api.patch(`/categories/${editingCat.id}`, { name: name.trim() });
      } else {
        await api.post('/categories', { name: name.trim() });
      }
      setName('');
      setEditingCat(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ບັນທຶກໝວດໝູ່ບໍ່ສຳເລັດ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ "${c.name}"?`)) return;
    try {
      await api.delete(`/categories/${c.id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ລຶບໝວດໝູ່ບໍ່ສຳເລັດ');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 fade-in-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#003d9b] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Tags className="w-3 h-3 text-[#003d9b]" />
              ໝວດໝູ່ວິຊາການ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ໝວດໝູ່ ແລະ ປະເພດເອກະສານ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຈັດໝວດໝູ່ບົດວິໄຈ, ບົດວິທະຍານິພົນ, ວາລະສານ ແລະ ສິ່ງພິມວິຊາການ (ທັງໝົດ {categories.length} ໝວດໝູ່)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ເພີ່ມໝວດໝູ່ໃໝ່</span>
        </button>
      </div>

      {/* Categories Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories List Cards */}
        <div className="md:col-span-3">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#191c1d] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#003d9b]" />
                <span>ລາຍການໝວດໝູ່ທັງໝົດ</span>
              </h2>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-semibold text-[#737685]">ກຳລັງໂຫຼດຂໍ້ມູນໝວດໝູ່...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-[#737685]">ຍັງບໍ່ມີໝວດໝູ່ເອກະສານ.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-50/70 hover:bg-blue-50/40 border border-slate-200/80 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-xs text-[#003d9b] group-hover:text-[#0052cc] transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-[#737685] mt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>{c._count?.documents || 0} ເອກະສານ</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-[#003d9b] hover:bg-white transition-colors"
                        title="ແກ້ໄຂໝວດໝູ່"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
                        title="ລຶບໝວດໝູ່"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal (Shadcn Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCat ? 'ແກ້ໄຂໝວດໝູ່ເອກະສານ' : 'ເພີ່ມໝວດໝູ່ໃໝ່'}
            </DialogTitle>
            <DialogDescription>
              {editingCat
                ? 'ອັບເດດຊື່ໝວດໝູ່ເອກະສານວິຊາການ'
                : 'ສ້າງໝວດໝູ່ໃໝ່ເພື່ອຈັດປະເພດເອກະສານໃຫ້ເປັນລະບົບ'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1.5">
                ຊື່ໝວດໝູ່ເອກະສານ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ຕົວຢ່າງ: ບົດວິທະຍານິພົນປະລິນຍາໂທ"
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md shadow-[#003d9b]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {submitting ? 'ກຳລັງບັນທຶກ...' : editingCat ? 'ອັບເດດ' : 'ເພີ່ມໝວດໝູ່'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
