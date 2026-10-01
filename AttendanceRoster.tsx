'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, AttendanceRecord } from '@/lib/store';
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Search,
  Check,
  User,
  Database,
  RefreshCw,
} from 'lucide-react';

export const AttendanceRoster: React.FC = () => {
  const {
    children,
    sections,
    attendance,
    setAttendanceStatus,
    selectedSectionFilter,
    setSelectedSectionFilter,
    role,
    staff,
    currentUser,
    fetchSupabaseData,
    isSupabaseLoading,
    t,
  } = useAppStore();

  const labels = t();

  const [activeNoteInputId, setActiveNoteInputId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  // Lock educator to their own assigned section using currentUser.id
  const currentStaff = role === 'staff' ? staff.find((s) => s.id === currentUser?.id) : null;
  const staffSectionId = currentStaff?.assignedSectionId || null;

  // Filter children — educators only see their section, admin sees all
  const filteredChildren = children.filter((child) => {
    if (role === 'staff') {
      return staffSectionId ? child.sectionId === staffSectionId : false;
    }
    return selectedSectionFilter === 'all' || child.sectionId === selectedSectionFilter;
  });

  // Calculate Attendance Stats for today
  const getChildStatus = (childId: string): AttendanceRecord => {
    const rec = attendance.find((a) => a.childId === childId && a.date === todayStr);
    if (rec) return rec;
    // Default fallback if not logged yet
    return {
      id: `fallback-${childId}`,
      childId,
      date: todayStr,
      status: 'present',
      checkInTime: '08:30',
    };
  };

  const presentCount = filteredChildren.filter((c) => {
    const s = getChildStatus(c.id).status;
    return s === 'present' || s === 'late';
  }).length;

  const absentCount = filteredChildren.filter((c) => getChildStatus(c.id).status === 'absent').length;
  const lateCount = filteredChildren.filter((c) => getChildStatus(c.id).status === 'late').length;
  const excusedCount = filteredChildren.filter((c) => getChildStatus(c.id).status === 'excused').length;

  const handleStatusChange = (childId: string, status: AttendanceRecord['status']) => {
    setAttendanceStatus(childId, status);
  };

  const handleSaveNote = (childId: string) => {
    const currentStatus = getChildStatus(childId).status;
    setAttendanceStatus(childId, currentStatus, noteText);
    setActiveNoteInputId(null);
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck2 className="w-6 h-6 text-nursery-mint" />
              Pointage Quotidien ({todayStr})
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Supabase DB</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registre de présence en direct par classe. 1-clic pour valider l'arrivée.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchSupabaseData()}
            disabled={isSupabaseLoading}
            className="bg-white border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Re-fetch from Supabase DB"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSupabaseLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-nursery-mint" />
            <span>Exporter la Feuille du Jour</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800">Présents</span>
            <p className="text-2xl font-black text-emerald-950 mt-0.5">{presentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-800">En Retard</span>
            <p className="text-2xl font-black text-amber-950 mt-0.5">{lateCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-800">Absents</span>
            <p className="text-2xl font-black text-rose-950 mt-0.5">{absentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-800">Excusés</span>
            <p className="text-2xl font-black text-blue-950 mt-0.5">{excusedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Section Selector Tabs */}
      {role === 'staff' ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
          <span>🔒 Espace Éducatrice — Élèves de votre classe uniquement ({currentStaff?.assignedSectionName || 'Classe Affectée'}): {filteredChildren.length} enfant(s)</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedSectionFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedSectionFilter === 'all'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes les Sections ({children.length})
          </button>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionFilter(sec.id)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedSectionFilter === sec.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec.codeName}
            </button>
          ))}
        </div>
      )}

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-3xl border border-nursery-sand shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Enfant & Section</th>
                <th className="p-4">Statut Quotidien (1-Clic)</th>
                <th className="p-4">Heure d'Arrivée</th>
                <th className="p-4">Observations / Personne d'Apport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredChildren.map((child) => {
                const attRec = getChildStatus(child.id);
                return (
                  <tr key={child.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={child.photo}
                        alt=""
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {child.firstName} {child.lastName}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {child.sectionName}
                        </span>
                      </div>
                    </td>

                    {/* 1-Click Status Toggles */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(child.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                            attRec.status === 'present'
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Présent
                        </button>
                        <button
                          onClick={() => handleStatusChange(child.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                            attRec.status === 'late'
                              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Retard
                        </button>
                        <button
                          onClick={() => handleStatusChange(child.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                            attRec.status === 'absent'
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(child.id, 'excused')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                            attRec.status === 'excused'
                              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          Excusé
                        </button>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="p-4 text-xs font-semibold text-slate-600">
                      {attRec.checkInTime ? (
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                          ⏱️ {attRec.checkInTime}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Note & Observations */}
                    <td className="p-4">
                      {activeNoteInputId === child.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="ex: Amené par sa grand-mère"
                            className="px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveNote(child.id)}
                            className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setActiveNoteInputId(child.id);
                            setNoteText(attRec.note || '');
                          }}
                          className="cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg text-xs text-slate-500 italic flex items-center gap-1"
                        >
                          <span>{attRec.note || 'Cliquer pour ajouter une note...'}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
