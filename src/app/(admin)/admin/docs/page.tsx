'use client';

import React, { useEffect, useState } from 'react';
import { Document, Faculty, Category, Department } from '@/types';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function AdminDocsPage() {
  const { user } = useAuthStore();

  const [docs, setDocs] = useState<Document[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [coverInput, setCoverInput] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    author: '',
    publishedYear: new Date().getFullYear(),
    facultyId: '',
    departmentId: '',
    categoryId: '',
    tags: '',
    fileUrl: '',
    coverUrl: '',
  });

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents/backoffice', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });
      setDocs(res.data.data);
      setTotalPages(res.data.meta.totalPages || 1);
      setTotalItems(res.data.meta.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadMeta() {
      try {
        const [facRes, catRes] = await Promise.all([
          api.get('/faculties'),
          api.get('/categories'),
        ]);
        setFaculties(facRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [page, search, statusFilter]);

  // Update departments when faculty changes in form
  const handleFacultyChange = (fId: string) => {
    setFormData((prev) => ({ ...prev, facultyId: fId, departmentId: '' }));
    const selectedFac = faculties.find((f) => f.id === Number(fId));
    setDepartments(selectedFac?.departments || []);
  };

  const handleOpenModal = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setFileInput(null);
      setCoverInput(null);
      setFormData({
        title: doc.title,
        abstract: doc.abstract || '',
        author: doc.author,
        publishedYear: doc.publishedYear || new Date().getFullYear(),
        facultyId: String(doc.facultyId),
        departmentId: doc.departmentId ? String(doc.departmentId) : '',
        categoryId: String(doc.categoryId),
        tags: doc.tags?.join(', ') || '',
        fileUrl: doc.fileUrl,
        coverUrl: doc.coverUrl || '',
      });
      const selectedFac = faculties.find((f) => f.id === doc.facultyId);
      setDepartments(selectedFac?.departments || []);
    } else {
      setEditingDoc(null);
      setFileInput(null);
      setCoverInput(null);
      const defaultFacId = user?.facultyId ? String(user.facultyId) : faculties[0]?.id ? String(faculties[0].id) : '';
      setFormData({
        title: '',
        abstract: '',
        author: user?.role === 'TEACHER' ? `${user.firstName} ${user.lastName}` : '',
        publishedYear: new Date().getFullYear(),
        facultyId: defaultFacId,
        departmentId: '',
        categoryId: categories[0]?.id ? String(categories[0].id) : '',
        tags: '',
        fileUrl: '',
        coverUrl: '',
      });
      if (defaultFacId) {
        const selectedFac = faculties.find((f) => f.id === Number(defaultFacId));
        setDepartments(selectedFac?.departments || []);
      }
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('abstract', formData.abstract);
      payload.append('author', formData.author);
      payload.append('publishedYear', String(formData.publishedYear));
      payload.append('facultyId', String(formData.facultyId));
      if (formData.departmentId) {
        payload.append('departmentId', String(formData.departmentId));
      }
      payload.append('categoryId', String(formData.categoryId));
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
        if (tagsArray.length > 0) {
          payload.append('tags', JSON.stringify(tagsArray));
        }
      }

      if (fileInput) {
        payload.append('file', fileInput);
      } else if (!editingDoc) {
        alert('ກະລຸນາເລືອກໄຟລ໌ເອກະສານ (PDF)');
        setSubmitting(false);
        return;
      }

      if (coverInput) {
        payload.append('cover', coverInput);
      }

      if (editingDoc) {
        await api.patch(`/documents/${editingDoc.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/documents', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalOpen(false);
      fetchDocs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ບັນທຶກເອກະສານບໍ່ສຳເລັດ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (doc: Document) => {
    const nextStatus = doc.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await api.patch(`/documents/${doc.id}/status`, { status: nextStatus });
      fetchDocs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ປ່ຽນສະຖານະບໍ່ສຳເລັດ');
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບເອກະສານ "${doc.title}"?`)) return;
    try {
      await api.delete(`/documents/${doc.id}`);
      fetchDocs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ລຶບເອກະສານບໍ່ສຳເລັດ');
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ຄັງຄຸ້ມຄອງເອກະສານວິຊາການ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຈັດການ, ອັບໂຫຼດ ແລະ ປ່ຽນສະຖານະການເຜີຍແຜ່ເອກະສານ (ທັງໝົດ {totalItems} ລາຍການ)
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>ເພີ່ມເອກະສານໃໝ່</span>
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
            placeholder="ຄົ້ນຫາຫົວຂໍ້, ຊື່ຜູ້ຂຽນ..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-white shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-white shadow-sm"
        >
          <option value="">ທຸກສະຖານະ</option>
          <option value="AVAILABLE">ເປີດໃຫ້ບໍລິການ (AVAILABLE)</option>
          <option value="UNAVAILABLE">ຈຳກັດການເຂົ້າເຖິງ (UNAVAILABLE)</option>
        </select>
      </div>

      {/* Docs Table */}
      <div className="glass-panel rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
              <tr>
                <th className="p-4">ຫົວຂໍ້ເອກະສານ</th>
                <th className="p-4">ຜູ້ຂຽນ / ປີ</th>
                <th className="p-4">ສັງກັດຄະນະ</th>
                <th className="p-4">ໝວດໝູ່</th>
                <th className="p-4">ສະຖານະ</th>
                <th className="p-4 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ກຳລັງໂຫຼດຂໍ້ມູນເອກະສານ...
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    ບໍ່ມີລາຍການເອກະສານ.
                  </td>
                </tr>
              ) : (
                docs.map((d) => (
                  <tr key={d.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-semibold text-[#191c1d] max-w-xs truncate">
                      {d.title}
                    </td>
                    <td className="p-4">
                      {d.author}
                      <span className="text-[#737685] text-[10px] block">ປີ {d.publishedYear || '-'}</span>
                    </td>
                    <td className="p-4 text-slate-600">{d.faculty?.code || d.faculty?.name}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-[#434654] px-2 py-0.5 rounded-full text-[10px]">
                        {d.category?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(d)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          d.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        title="ຄລິກເພື່ອປ່ຽນສະຖານະ"
                      >
                        {d.status === 'AVAILABLE' ? '✓ ເປີດໃຊ້ງານ' : '✕ ຈຳກັດ'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(d)}
                          className="p-1.5 rounded-lg text-[#003d9b] hover:bg-blue-50"
                          title="ແກ້ໄຂເອກະສານ"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(d)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="ລຶບເອກະສານ"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-[#003d9b]">
                {editingDoc ? 'ແກ້ໄຂຂໍ້ມູນເອກະສານ' : 'ອັບໂຫຼດ / ເພີ່ມເອກະສານໃໝ່'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ຫົວຂໍ້ເອກະສານ *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ຕົວຢ່າງ: ການເພີ່ມປະສິດທິພາບໂຄງລ່າງພື້ນຖານ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ຊື່ຜູ້ຂຽນ / ອາຈານ *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="ດຣ. ແສງແກ້ວ ວົງໄຊ"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ປີພິມເຜີຍແຜ່ *</label>
                  <input
                    type="number"
                    required
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ສັງກັດຄະນະ *</label>
                  <select
                    disabled={user?.role === 'TEACHER'}
                    value={formData.facultyId}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  >
                    <option value="">ເລືອກຄະນະ</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ພາກວິຊາ</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                  >
                    <option value="">ເລືອກພາກວິຊາ (ຖ້າມີ)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ໝວດໝູ່ເອກະສານ *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                >
                  <option value="">ເລືອກໝວດໝູ່</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ບົດຄັດຫຍໍ້ (Abstract)</label>
                <textarea
                  rows={4}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="ເນື້ອໃນຫຍໍ້ຂອງບົດວິໄຈ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">
                  ຄຳສັບຫຼັກ (Tags ຄັ່ນດ້ວຍໝາຍຈຸດ ,)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ປັນຍາປະດິດ, ພາສາລາວ, NLP"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ໄຟລ໌ເອກະສານ (PDF) {!editingDoc && '*'}</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#003d9b] hover:file:bg-blue-100"
                  />
                  {editingDoc && editingDoc.fileUrl && (
                    <p className="text-[10px] text-slate-500 mt-1 truncate">ໄຟລ໌ປັດຈຸບັນ: {editingDoc.fileUrl.split('/').pop()}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-[#191c1d] mb-1">ຮູບປົກ (Cover)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverInput(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {editingDoc && editingDoc.coverUrl && (
                    <p className="text-[10px] text-slate-500 mt-1 truncate">ຮູບປົກປັດຈຸບັນ: {editingDoc.coverUrl.split('/').pop()}</p>
                  )}
                </div>
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
                  {submitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກເອກະສານ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
