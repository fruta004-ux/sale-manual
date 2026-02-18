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
  ArrowRight,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShoppingCart,
  Globe,
  Code2
} from "lucide-react";
import { createSession, getAllSessions, deleteSession, Session, PlatformType, platformInfo } from "@/lib/supabase";
import Link from "next/link";

export default function ChecklistV2Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchText] = useState("");
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setSelectedPlatform("");
    setShowPlatformModal(true);
  };

  const handleCreate = async (platform: PlatformType) => {
    setCreating(true);
    setShowPlatformModal(false);
    const id = await createSession(platform);
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
          onClick={openCreateModal}
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

      {/* 플랫폼 선택 모달 */}
      {showPlatformModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* 모달 헤더 */}
            <div className="p-8 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">플랫폼 선택</h2>
                <p className="text-gray-500 font-medium">고객 요구에 맞는 플랫폼을 선택해주세요.</p>
              </div>
              <button
                onClick={() => setShowPlatformModal(false)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* 플랫폼 선택 영역 */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* 플랫폼 선택 가이드 */}
              <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 mb-2">플랫폼 선택 가이드</h4>
                    <ul className="text-sm text-amber-800/80 space-y-1.5 font-medium">
                      <li><strong className="text-amber-900">일반 소개 사이트</strong> → 아임웹 권장 (빠르고 관리 쉬움)</li>
                      <li><strong className="text-amber-900">쇼핑몰/굿즈샵</strong> → 카페24 (결제/배송 시스템 기본 내장)</li>
                      <li><strong className="text-amber-900">빠른 시안/저예산 소개</strong> → v0 (페이지당 10만원, 소개형만 가능)</li>
                      <li><strong className="text-amber-900">복잡한 시스템/회원권한</strong> → 독립형 커스텀 개발</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 플랫폼 카드 그리드 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 아임웹 */}
                <button
                  onClick={() => setSelectedPlatform('aimweb')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                    ${selectedPlatform === 'aimweb' 
                      ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  {selectedPlatform === 'aimweb' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">아임웹</h3>
                      <p className="text-sm text-gray-400 font-medium">Imweb</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{platformInfo.aimweb.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-bold">{platformInfo.aimweb.priceRange}</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">{platformInfo.aimweb.timeline}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>브랜드 소개, 랜딩, 쇼핑몰 모두 가능</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>직접 관리/수정 가능</span>
                    </div>
                  </div>
                </button>

                {/* 카페24 */}
                <button
                  onClick={() => setSelectedPlatform('cafe24')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                    ${selectedPlatform === 'cafe24' 
                      ? 'border-orange-500 bg-orange-50 shadow-xl shadow-orange-100' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  {selectedPlatform === 'cafe24' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">카페24</h3>
                      <p className="text-sm text-gray-400 font-medium">Cafe24</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{platformInfo.cafe24.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 font-bold">{platformInfo.cafe24.priceRange}</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">{platformInfo.cafe24.timeline}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>쇼핑몰, 유튜버 굿즈샵에 최적</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-amber-600">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>스킨 구입 후 수정 권장 (처음부터 제작 비추)</span>
                    </div>
                  </div>
                </button>

                {/* v0 */}
                <button
                  onClick={() => setSelectedPlatform('v0')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                    ${selectedPlatform === 'v0' 
                      ? 'border-violet-500 bg-violet-50 shadow-xl shadow-violet-100' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  {selectedPlatform === 'v0' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-violet-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">v0</h3>
                      <p className="text-sm text-gray-400 font-medium">AI-based</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{platformInfo.v0.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 font-bold">{platformInfo.v0.priceRange}</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">{platformInfo.v0.timeline}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>빠른 시안, 저예산 소개 사이트</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-rose-600">
                      <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>게시판/쇼핑몰/회원기능 불가</span>
                    </div>
                  </div>
                </button>

                {/* 독립형 */}
                <button
                  onClick={() => setSelectedPlatform('custom')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                    ${selectedPlatform === 'custom' 
                      ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  {selectedPlatform === 'custom' && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">독립형 (커스텀)</h3>
                      <p className="text-sm text-gray-400 font-medium">Custom Development</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{platformInfo.custom.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold">🤖 AI 분석 후 산출</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">{platformInfo.custom.timeline}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>복잡한 회원/권한, 외부 API 연동</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-violet-600">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>상담 내용 → AI 분석 → 1차 견적</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* 선택된 플랫폼 상세 정보 */}
              {selectedPlatform && platformInfo[selectedPlatform] && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-indigo-600"></span>
                    {platformInfo[selectedPlatform].name} 상세 안내
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* 추천 상황 */}
                    <div>
                      <p className="text-xs font-black text-emerald-600 mb-2 uppercase tracking-wider">✓ 이런 경우 추천</p>
                      <ul className="space-y-1.5">
                        {platformInfo[selectedPlatform].recommendFor.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* 비추천 상황 */}
                    <div>
                      <p className="text-xs font-black text-rose-600 mb-2 uppercase tracking-wider">✗ 이런 경우 비추천</p>
                      <ul className="space-y-1.5">
                        {platformInfo[selectedPlatform].notRecommendFor.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-rose-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 주의사항 */}
                  {platformInfo[selectedPlatform].warnings.length > 0 && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-xs font-black text-amber-700 mb-2">⚠️ 주의사항</p>
                      <ul className="space-y-1">
                        {platformInfo[selectedPlatform].warnings.map((item, i) => (
                          <li key={i} className="text-sm text-amber-800">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => setShowPlatformModal(false)}
                className="px-8 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                취소
              </button>
              <button
                onClick={() => selectedPlatform && handleCreate(selectedPlatform)}
                disabled={!selectedPlatform}
                className="px-10 h-14 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {selectedPlatform ? `${platformInfo[selectedPlatform].name}으로 상담 시작` : '플랫폼을 선택해주세요'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button onClick={openCreateModal} className="text-indigo-600 font-black hover:underline">첫 상담을 생성해보세요 →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => {
            const platform = session.data?.platform as PlatformType;
            const platformData = platform && platformInfo[platform];
            const platformColors: Record<string, { bg: string; text: string; border: string }> = {
              aimweb: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
              cafe24: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
              v0: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
              custom: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
            };
            const colors = platform ? platformColors[platform] : null;
            
            return (
            <div key={session.id} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start mb-6">
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

              {/* 플랫폼 표시 */}
              {platformData && colors && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${colors.bg} ${colors.border} border`}>
                  {platform === 'aimweb' && <Globe className={`w-4 h-4 ${colors.text}`} />}
                  {platform === 'cafe24' && <ShoppingCart className={`w-4 h-4 ${colors.text}`} />}
                  {platform === 'v0' && <Sparkles className={`w-4 h-4 ${colors.text}`} />}
                  {platform === 'custom' && <Code2 className={`w-4 h-4 ${colors.text}`} />}
                  <span className={`text-xs font-black ${colors.text}`}>{platformData.name}</span>
                </div>
              )}

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
          );
          })}
        </div>
      )}
    </div>
  );
}
