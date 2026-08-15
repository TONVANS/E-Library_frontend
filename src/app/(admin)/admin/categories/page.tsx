'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import api from '@/lib/axios';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
    <div className="space-y-6 fade-in-up max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
          ໝວດໝູ່ ແລະ ປະເພດເອກະສານ
        </h1>
        <p className="text-xs text-[#737685] mt-0.5">
          ຈັດໝວດໝູ່ບົດວິໄຈ, ບົດວິທະຍານິພົນ, ວາລະສານ ແລະ ສິ່ງພິມວິຊາການ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h2 className="text-sm font-bold text-[#003d9b] mb-4">
              {editingCat ? 'ແກ້ໄຂໝວດໝູ່' : 'ເພີ່ມໝວດໝູ່ໃໝ່'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ຊື່ໝວດໝູ່ເອກະສານ *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ຕົວຢ່າງ: ບົດວິທະຍານິພົນປະລິນຍາໂທ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div className="flex gap-2">
                {editingCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(null);
                      setName('');
                    }}
                    className="w-1/2 py-2 rounded-xl bg-slate-100 font-semibold text-xs text-slate-600"
                  >
                    ຍົກເລີກ
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md"
                >
                  {submitting ? 'ກຳລັງບັນທຶກ...' : editingCat ? 'ອັບເດດ' : 'ເພີ່ມໝວດໝູ່'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Card */}
        <div className="md:col-span-2">
          <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h2 className="text-sm font-bold text-[#191c1d] mb-4">ລາຍການໝວດໝູ່ທັງໝົດ</h2>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">ກຳລັງໂຫຼດຂໍ້ມູນໝວດໝູ່...</p>
              ) : categories.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">ຍັງບໍ່ມີໝວດໝູ່ເອກະສານ.</p>
              ) : (
                categories.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-[#003d9b]">{c.name}</p>
                      <p className="text-[11px] text-[#737685]">
                        {c._count?.documents || 0} ເອກະສານໃນໝວດນີ້
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCat(c);
                          setName(c.name);
                        }}
                        className="p-1.5 rounded-lg text-[#003d9b] hover:bg-blue-50"
                        title="ແກ້ໄຂໝວດໝູ່"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        title="ລຶບໝວດໝູ່"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
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
