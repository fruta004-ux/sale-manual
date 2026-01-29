"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Check, 
  Users, 
  LayoutDashboard,
  Clock,
  ArrowRight
} from "lucide-react";
import { createSession, getAllSessions, deleteSession, Session } from "@/lib/supabase";
import Link from "next/link";

export default function ChecklistV2Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchText] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    setCreating(true);
    const id = await createSession();
    if (id) {
      await loadSessions();
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("상담 내역을 삭제하시겠습니까?")) {
      const success = await deleteSession(id);
      if (success) loadSessions();
    }
  };

  const copyLink = async (id: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/consultation/${id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-3">
            <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center">
              <LayoutDashboard className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em]">Sales Console</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">상담 관리</h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            고객별 맞춤 견적과 상담 내용을 실시간으로 관리하고 공유하세요.
          </p>
        </div>
        
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center justify-center gap-3 h-16 px-10 bg-indigo-600 text-white rounded-2xl text-lg font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50"
        >
          {creating ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
          상담 시작하기
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-12 group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-6 h-6" />
        </div>
        <input 
          type="text" 
          placeholder="세션 ID 검색..."
          className="w-full h-16 pl-16 pr-6 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 font-bold text-lg outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 group-hover:border-gray-200 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-gray-50 rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
            <Clock className="w-10 h-10" />
          </div>
          <p className="text-gray-400 font-bold text-xl mb-4">표시할 상담 내역이 없습니다.</p>
          <button onClick={handleCreate} className="text-indigo-600 font-black hover:underline">첫 상담을 생성해보세요 →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Session</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{session.id}</h3>
                </div>
                <button 
                  onClick={() => handleDelete(session.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-medium">상담 시작일</span>
                  <span className="text-gray-900 font-bold">{new Date(session.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-medium">최종 동기화</span>
                  <span className="text-gray-900 font-bold">{new Date(session.updated_at).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Link
                  href={`/checklist-v2/admin/${session.id}`}
                  className="flex items-center justify-center gap-2 h-14 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all"
                >
                  상담 관리자 입장
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => copyLink(session.id)}
                  className={`flex items-center justify-center gap-2 h-14 rounded-2xl font-bold border-2 transition-all
                    ${copiedId === session.id 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                      : "bg-white border-gray-100 text-gray-700 hover:border-gray-200"
                    }`}
                >
                  {copiedId === session.id ? <Check className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  고객용 링크 {copiedId === session.id ? "복사됨" : "복사하기"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
