"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Link2, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check,
  Users,
  Clock,
  RefreshCw
} from "lucide-react";
import { createSession, getAllSessions, deleteSession, Session } from "@/lib/supabase";

export default function ChecklistV2Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 세션 목록 불러오기
  const loadSessions = async () => {
    setLoading(true);
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // 새 세션 생성
  const handleCreateSession = async () => {
    setCreating(true);
    const id = await createSession();
    if (id) {
      await loadSessions();
    }
    setCreating(false);
  };

  // 세션 삭제
  const handleDeleteSession = async (id: string) => {
    if (confirm('이 상담 링크를 삭제하시겠습니까?')) {
      await deleteSession(id);
      await loadSessions();
    }
  };

  // 링크 복사
  const copyLink = async (id: string, type: 'admin' | 'client') => {
    const baseUrl = window.location.origin;
    const url = type === 'admin' 
      ? `${baseUrl}/checklist-v2/admin/${id}`
      : `${baseUrl}/consultation/${id}`;
    
    await navigator.clipboard.writeText(url);
    setCopiedId(`${id}-${type}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="text-center py-8 mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#6366f1] mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">실시간 상담 (v2)</h1>
        <p className="text-[#71717a]">고객과 함께 보면서 상담하세요</p>
      </div>

      {/* 새 상담 생성 버튼 */}
      <div className="card p-6 mb-6">
        <button
          onClick={handleCreateSession}
          disabled={creating}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
        >
          {creating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              새 상담 링크 생성
            </>
          )}
        </button>
      </div>

      {/* 세션 목록 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#6366f1]" />
            상담 링크 목록
          </h2>
          <button
            onClick={loadSessions}
            className="p-2 rounded-lg hover:bg-[#27272a] transition-colors"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 text-[#71717a] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#71717a]">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            불러오는 중...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>아직 생성된 상담 링크가 없습니다</p>
            <p className="text-sm mt-1">위 버튼을 눌러 새 상담을 시작하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-[#2a2a32] rounded-xl p-4 hover:border-[#3a3a42] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-mono font-bold text-[#6366f1]">
                        #{session.id}
                      </span>
                      {session.data?.siteType && (
                        <span className="text-xs px-2 py-0.5 bg-[#10b981]/20 text-[#6ee7b7] rounded">
                          {session.data.siteType === "company" ? "회사소개" :
                           session.data.siteType === "shopping" ? "쇼핑몰" :
                           session.data.siteType === "reservation" ? "예약" :
                           session.data.siteType === "portfolio" ? "포트폴리오" :
                           session.data.siteType === "landing" ? "랜딩" :
                           session.data.siteType === "blog" ? "블로그" :
                           session.data.customSiteType || "미정"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 rounded-lg hover:bg-[#ef4444]/10 text-[#71717a] hover:text-[#ef4444] transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* 상담사 링크 */}
                  <div className="bg-[#1a1a1f] rounded-lg p-3">
                    <p className="text-xs text-[#71717a] mb-2">👨‍💼 상담사용</p>
                    <div className="flex gap-2">
                      <a
                        href={`/checklist-v2/admin/${session.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        열기
                      </a>
                      <button
                        onClick={() => copyLink(session.id, 'admin')}
                        className="btn-secondary px-3"
                        title="링크 복사"
                      >
                        {copiedId === `${session.id}-admin` ? (
                          <Check className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 고객 링크 */}
                  <div className="bg-[#1a1a1f] rounded-lg p-3">
                    <p className="text-xs text-[#71717a] mb-2">👤 고객용</p>
                    <div className="flex gap-2">
                      <a
                        href={`/consultation/${session.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        열기
                      </a>
                      <button
                        onClick={() => copyLink(session.id, 'client')}
                        className="btn-secondary px-3"
                        title="링크 복사"
                      >
                        {copiedId === `${session.id}-client` ? (
                          <Check className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사용 안내 */}
      <div className="card p-6 mt-6 bg-[#6366f1]/5 border-[#6366f1]/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          💡 사용 방법
        </h3>
        <ol className="text-sm text-[#a1a1aa] space-y-2">
          <li>1. <strong className="text-white">새 상담 링크 생성</strong> 버튼을 눌러 상담 세션을 만드세요</li>
          <li>2. <strong className="text-white">상담사용</strong> 링크로 들어가서 상담을 진행하세요</li>
          <li>3. <strong className="text-white">고객용</strong> 링크를 고객에게 공유하세요</li>
          <li>4. 상담사 화면에서 <strong className="text-white">[동기화]</strong> 버튼을 누르면 고객 화면에 반영됩니다</li>
        </ol>
      </div>
    </div>
  );
}
