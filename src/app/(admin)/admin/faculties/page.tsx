'use client';

import React, { useEffect, useState } from 'react';
import { Faculty } from '@/types';
import api from '@/lib/axios';

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  // Faculty Modal
  const [facModalOpen, setFacModalOpen] = useState(false);
  const [facName, setFacName] = useState('');
  const [facCode, setFacCode] = useState('');
  const [editingFac, setEditingFac] = useState<Faculty | null>(null);

  // Dept Modal
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [selectedFacForDept, setSelectedFacForDept] = useState<Faculty | null>(null);
  const [deptName, setDeptName] = useState('');

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

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFac) {
        await api.patch(`/faculties/${editingFac.id}`, { name: facName, code: facCode });
      } else {
        await api.post('/faculties', { name: facName, code: facCode });
      }
      setFacModalOpen(false);
      setFacName('');
      setFacCode('');
      setEditingFac(null);
      fetchFaculties();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ບັນທຶກຄະນະບໍ່ສຳເລັດ');
    }
  };

  const handleDeleteFaculty = async (f: Faculty) => {
    if (!confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ "${f.name}"? ພາກວິຊາທີ່ກ່ຽວຂ້ອງທັງໝົດຈະຖືກລຶບນຳ.`)) return;
    try {
      await api.delete(`/faculties/${f.id}`);
      fetchFaculties();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ລຶບຄະນະບໍ່ສຳເລັດ');
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacForDept) return;
    try {
      await api.post(`/faculties/${selectedFacForDept.id}/departments`, { name: deptName });
      setDeptModalOpen(false);
      setDeptName('');
      fetchFaculties();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ເພີ່ມພາກວິຊາບໍ່ສຳເລັດ');
    }
  };

  const handleDeleteDept = async (deptId: number) => {
    if (!confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບພາກວິຊານີ້?')) return;
    try {
      await api.delete(`/faculties/departments/${deptId}`);
      fetchFaculties();
    } catch (err: any) {
      alert(err.response?.data?.message || 'ລຶບພາກວິຊາບໍ່ສຳເລັດ');
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
            ຄຸ້ມຄອງໂຄງສ້າງ ຄະນະ ແລະ ພາກວິຊາ
          </h1>
          <p className="text-xs text-[#737685] mt-0.5">
            ກຳນົດໂຄງສ້າງຄະນະວິຊາ ແລະ ພາກວິຊາຕ່າງໆ ພາຍໃນມະຫາວິທະຍາໄລແຫ່ງຊາດ
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFac(null);
            setFacName('');
            setFacCode('');
            setFacModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>ເພີ່ມຄະນະໃໝ່</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 py-12 text-center">ກຳລັງໂຫຼດຂໍ້ມູນຄະນະວິຊາ...</p>
      ) : faculties.length === 0 ? (
        <p className="text-xs text-slate-400 py-12 text-center">ຍັງບໍ່ມີຂໍ້ມູນຄະນະວິຊາ.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faculties.map((fac) => (
            <div
              key={fac.id}
              className="glass-panel p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold bg-blue-50 text-[#003d9b] px-2 py-0.5 rounded-full uppercase">
                      ລະຫັດ: {fac.code || 'N/A'}
                    </span>
                    <h2 className="text-base font-bold text-[#191c1d] mt-1.5">{fac.name}</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFac(fac);
                        setFacName(fac.name);
                        setFacCode(fac.code || '');
                        setFacModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-[#003d9b] hover:bg-blue-50"
                      title="ແກ້ໄຂຄະນະ"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(fac)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="ລຶບຄະນະ"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                {/* Departments List */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-[#737685] uppercase tracking-wider">
                      ລາຍຊື່ພາກວິຊາ ({fac.departments?.length || 0})
                    </p>
                    <button
                      onClick={() => {
                        setSelectedFacForDept(fac);
                        setDeptName('');
                        setDeptModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-[#0052cc] hover:underline flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      ເພີ່ມພາກວິຊາ
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {fac.departments && fac.departments.length > 0 ? (
                      fac.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-50 text-xs text-[#434654]"
                        >
                          <span className="truncate pr-2">{dept.name}</span>
                          <button
                            onClick={() => handleDeleteDept(dept.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="ລຶບພາກວິຊາ"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400 italic py-1">ຍັງບໍ່ມີພາກວິຊາສັງກັດ.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-[#737685]">
                <span>{fac._count?.documents || 0} ເອກະສານ</span>
                <span>{fac._count?.users || 0} ຜູ້ໃຊ້ງານ</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty Modal */}
      {facModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h2 className="text-base font-bold text-[#003d9b] mb-4">
              {editingFac ? 'ແກ້ໄຂຂໍ້ມູນຄະນະ' : 'ເພີ່ມຄະນະວິຊາໃໝ່'}
            </h2>
            <form onSubmit={handleSaveFaculty} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ຊື່ຄະນະວິຊາ *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ຄະນະວິສະວະກຳສາດ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">
                  ລະຫັດຫຍໍ້ຄະນະ (Code ເຊັ່ນ: FE, FEB, FNS)
                </label>
                <input
                  type="text"
                  value={facCode}
                  onChange={(e) => setFacCode(e.target.value)}
                  placeholder="FE"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFacModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dept Modal */}
      {deptModalOpen && selectedFacForDept && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h2 className="text-base font-bold text-[#003d9b] mb-2">ເພີ່ມພາກວິຊາໃໝ່</h2>
            <p className="text-xs text-[#737685] mb-4">ສັງກັດ: {selectedFacForDept.name}</p>
            <form onSubmit={handleAddDept} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191c1d] mb-1">ຊື່ພາກວິຊາ *</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ພາກວິຊາວິສະວະກຳຄອມພິວເຕີ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#191c1d]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-[#434654] font-semibold text-xs"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-semibold text-xs shadow-md"
                >
                  ເພີ່ມພາກວິຊາ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
