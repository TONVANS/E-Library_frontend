'use client';

import React, { useEffect, useState } from 'react';
import { Document, Faculty, Category, Department } from '@/types';
import { useAuthStore } from '@/store/authStore';
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
  Search,
  FileText,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function AdminDocsPage() {
  const { user } = useAuthStore();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://training-api.edl.com.la/elibrary';

  const getFullUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${apiBase}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  const [docs, setDocs] = useState<Document[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
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
          facultyId: facultyFilter || undefined,
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
  }, [page, search, statusFilter, facultyFilter]);

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
      const defaultFacId = user?.facultyId
        ? String(user.facultyId)
        : faculties[0]?.id
        ? String(faculties[0].id)
        : '';
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
        const tagsArray = formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
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
    <div className="space-y-6 sm:space-y-8 fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#003d9b] bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#003d9b]" />
              ຄັງເອກະສານກາງ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ຄັງຄຸ້ມຄອງເອກະສານວິຊາການ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ຈັດການ, ອັບໂຫຼດ ແລະ ປ່ຽນສະຖານະການເຜີຍແຜ່ເອກະສານ (ທັງໝົດ {totalItems} ລາຍການ)
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md shadow-[#003d9b]/20 flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ເພີ່ມເອກະສານໃໝ່</span>
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
            placeholder="ຄົ້ນຫາຫົວຂໍ້, ຊື່ຜູ້ຂຽນ..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user?.role === 'ADMIN' && (
            <select
              value={facultyFilter}
              onChange={(e) => {
                setFacultyFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20"
            >
              <option value="">ທຸກຄະນະວິຊາ</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs text-[#191c1d] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20"
          >
            <option value="">ທຸກສະຖານະ</option>
            <option value="AVAILABLE">ເປີດໃຫ້ບໍລິການ (AVAILABLE)</option>
            <option value="UNAVAILABLE">ຈຳກັດການເຂົ້າເຖິງ (UNAVAILABLE)</option>
          </select>
        </div>
      </div>

      {/* Docs Table */}
      <div className="glass-panel rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#434654]">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-[#191c1d] uppercase tracking-wider">
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
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="inline-block w-7 h-7 border-4 border-[#003d9b] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs font-semibold">ກຳລັງໂຫຼດຂໍ້ມູນເອກະສານ...</p>
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                    ບໍ່ມີລາຍການເອກະສານຕາມເງື່ອນໄຂຄົ້ນຫາ.
                  </td>
                </tr>
              ) : (
                docs.map((d) => (
                  <tr key={d.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3 max-w-sm sm:max-w-md">
                        <div className="w-9 h-11 rounded-lg bg-blue-50 text-[#003d9b] flex items-center justify-center shrink-0 border border-blue-100/80 overflow-hidden shadow-sm">
                          {d.coverUrl ? (
                            <img
                              src={getFullUrl(d.coverUrl)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-4 h-4 text-[#003d9b]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#191c1d] group-hover:text-[#003d9b] transition-colors truncate">
                            {d.title}
                          </p>
                          {d.department && (
                            <p className="text-[11px] text-[#737685] truncate">
                              ພາກວິຊາ: {d.department.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#191c1d] block">{d.author}</span>
                      <span className="text-[#737685] text-[11px]">ປີ {d.publishedYear || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-[#003d9b] font-semibold text-[11px]">
                        {d.faculty?.code || d.faculty?.name || '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-[11px] font-medium border border-amber-100">
                        {d.category?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(d)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all border shadow-2xs ${
                          d.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="ຄລິກເພື່ອສະຫຼັບສະຖານະ"
                      >
                        {d.status === 'AVAILABLE' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ເປີດໃຊ້ງານ</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>ຈຳກັດ</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(d)}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#003d9b] hover:bg-blue-50 transition-colors"
                          title="ແກ້ໄຂເອກະສານ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(d)}
                            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="ລຶບເອກະສານ"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Create / Edit Modal (Shadcn Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh]">
          <DialogHeader>
            <DialogTitle>
              {editingDoc ? 'ແກ້ໄຂຂໍ້ມູນເອກະສານ' : 'ອັບໂຫຼດ / ເພີ່ມເອກະສານໃໝ່'}
            </DialogTitle>
            <DialogDescription>
              {editingDoc
                ? 'ອັບເດດຂໍ້ມູນລາຍລະອຽດ ຫຼື ປ່ຽນໄຟລ໌ເອກະສານ'
                : 'ຕື່ມຂໍ້ມູນວິຊາການ ແລະ ອັບໂຫຼດໄຟລ໌ PDF ເຂົ້າສູ່ຄັງຫໍສະໝຸດ'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ຫົວຂໍ້ເອກະສານ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ຕົວຢ່າງ: ການເພີ່ມປະສິດທິພາບໂຄງລ່າງພື້ນຖານ..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ຊື່ຜູ້ຂຽນ / ອາຈານ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="ດຣ. ແສງແກ້ວ ວົງໄຊ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ປີພິມເຜີຍແຜ່ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.publishedYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedYear: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ສັງກັດຄະນະ <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={user?.role === 'TEACHER'}
                  value={formData.facultyId}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
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
                <label className="block text-xs font-bold text-[#191c1d] mb-1">ພາກວິຊາ</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
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
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ໝວດໝູ່ເອກະສານ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
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
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ບົດຄັດຫຍໍ້ (Abstract)
              </label>
              <textarea
                rows={3}
                value={formData.abstract}
                onChange={(e) =>
                  setFormData({ ...formData, abstract: e.target.value })
                }
                placeholder="ເນື້ອໃນຫຍໍ້ຂອງບົດວິໄຈ..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191c1d] mb-1">
                ຄຳສັບຫຼັກ (Tags ຄັ່ນດ້ວຍໝາຍຈຸດ ,)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ປັນຍາປະດິດ, ພາສາລາວ, NLP"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ໄຟລ໌ເອກະສານ (PDF) {!editingDoc && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#003d9b] hover:file:bg-blue-100 transition-all cursor-pointer"
                />
                {editingDoc && editingDoc.fileUrl && (
                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    ໄຟລ໌ປັດຈຸບັນ: {editingDoc.fileUrl.replace(/\\/g, '/').split('/').pop()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191c1d] mb-1">
                  ຮູບປົກ (Cover Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverInput(e.target.files?.[0] || null)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs text-[#191c1d] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer"
                />
                {editingDoc && editingDoc.coverUrl && (
                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    ຮູບປົກປັດຈຸບັນ: {editingDoc.coverUrl.replace(/\\/g, '/').split('/').pop()}
                  </p>
                )}
              </div>
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
                {submitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກເອກະສານ'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
