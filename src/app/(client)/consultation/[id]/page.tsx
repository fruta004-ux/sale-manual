"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  ShoppingCart,
  CalendarCheck,
  Image,
  Layers,
  FileText,
  Target,
  Palette,
  DollarSign,
  RefreshCw,
  CheckCircle2,
  Users,
  Settings,
  Globe,
  CreditCard,
  MessageSquare,
  Link2,
  Search,
  Calendar,
  ExternalLink
} from "lucide-react";
import { getSupabase, getSession, SessionData, initialSessionData } from "@/lib/supabase";

// ============================================
// 섹션 샘플 데이터
// ============================================

const sectionSamples = [
  { name: "간단한 소개", sections: 3 },
  { name: "일반적인 회사소개", sections: 5 },
  { name: "보통 랜딩페이지", sections: 8 },
  { name: "상세한 서비스", sections: 12 },
  { name: "풀 스크롤 사이트", sections: 20 },
];

// ============================================
// 메인 컴포넌트 (고객용)
// ============================================

export default function ClientPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [data, setData] = useState<SessionData>(initialSessionData);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const sectionRefs = {
    sitetype: useRef<HTMLDivElement>(null),
    plan: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    size: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    reference: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    budget: useRef<HTMLDivElement>(null),
    summary: useRef<HTMLDivElement>(null),
  };

  // 초기 데이터 로드 및 Realtime 구독
  useEffect(() => {
    const loadData = async () => {
      const session = await getSession(sessionId);
      if (session) {
        setData(session.data);
      }
      setLoading(false);
    };
    loadData();

    // Supabase Realtime 구독
    const supabase = getSupabase();
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          const newData = payload.new as { data: SessionData };
          setData(newData.data);
          setLastUpdate(new Date());
          
          // 상담사 위치로 스크롤
          if (newData.data.adminSection) {
            const ref = sectionRefs[newData.data.adminSection as keyof typeof sectionRefs];
            if (ref?.current) {
              ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // 예상 견적 계산 (페이지 수 × 페이지당 평균 섹션 수 기반)
  const estimatedPrice = () => {
    // 섹션 4개 = 1페이지 점수로 환산
    const sectionScore = Math.ceil(data.sectionCount / 4);
    
    // 페이지 점수와 섹션 점수 중 큰 값 사용 (작업량 기준)
    const workScore = Math.max(data.pageCount, sectionScore);
    
    if (workScore <= 5) return "100~150만원";
    if (workScore <= 8) return "150~200만원";
    if (workScore <= 12) return "200~300만원";
    if (workScore <= 15) return "300~400만원";
    return "400만원 이상 (협의)";
  };

  // 섹션 하이라이트 체크
  const isHighlighted = (sectionKey: string) => {
    return data.adminSection === sectionKey;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#6366f1]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* 헤더 */}
      <div className="text-center py-8 mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#6366f1] mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">홈페이지 상담</h1>
        <p className="text-[#71717a] text-sm">상담사와 함께 보고 계신 화면입니다</p>
        
        {/* 연결 상태 */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#10b981] animate-pulse' : 'bg-[#ef4444]'}`} />
          <span className="text-xs text-[#71717a]">
            {connected ? '실시간 연결됨' : '연결 중...'}
          </span>
          {lastUpdate && (
            <span className="text-xs text-[#52525b]">
              · {lastUpdate.toLocaleTimeString('ko-KR')}
            </span>
          )}
        </div>
      </div>

      {/* ========== Q1: 사이트 유형 ========== */}
      <section 
        ref={sectionRefs.sitetype} 
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('sitetype') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#10b981]/20 mb-2">
            <Target className="w-5 h-5 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-bold">어떤 사이트를 만들고 싶으세요?</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "company", label: "회사/브랜드 소개", icon: Building2 },
            { id: "shopping", label: "쇼핑몰", icon: ShoppingCart },
            { id: "reservation", label: "예약 사이트", icon: CalendarCheck },
            { id: "portfolio", label: "포트폴리오", icon: Image },
            { id: "landing", label: "랜딩페이지", icon: Layers },
            { id: "blog", label: "블로그/매거진", icon: FileText },
          ].map((option) => {
            const Icon = option.icon;
            const isSelected = data.siteType === option.id;
            return (
              <div
                key={option.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all
                  ${isSelected 
                    ? "bg-[#10b981]/10 border-[#10b981]" 
                    : "bg-[#27272a]/30 border-[#2a2a32]"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-[#10b981]" : "text-[#71717a]"}`} />
                <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
                  {option.label}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#10b981] ml-auto" />}
              </div>
            );
          })}
        </div>

        {data.customSiteType && (
          <div className="mt-3 p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]">
            <span className="text-sm text-white">{data.customSiteType}</span>
          </div>
        )}

        {data.siteTypeMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.siteTypeMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q2: 기획 상태 ========== */}
      <section 
        ref={sectionRefs.plan}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('plan') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#f59e0b]/20 mb-2">
            <FileText className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <h2 className="text-xl font-bold">기획이 되어 있으신가요?</h2>
        </div>

        <div className="flex gap-2">
          {[
            { id: "yes", label: "기획 완료" },
            { id: "partial", label: "대략적으로" },
            { id: "no", label: "기획 필요" },
          ].map((opt) => {
            const isSelected = data.hasPlan === opt.id;
            return (
              <div
                key={opt.id}
                className={`flex-1 p-3 rounded-xl border text-center transition-all
                  ${isSelected 
                    ? "bg-[#f59e0b]/10 border-[#f59e0b]" 
                    : "bg-[#27272a]/30 border-[#2a2a32]"
                  }`}
              >
                <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                  {opt.label}
                </p>
              </div>
            );
          })}
        </div>

        {data.menuStructure && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f]">
            <p className="text-xs text-[#71717a] mb-1">메뉴 구조</p>
            <p className="text-sm text-[#a1a1aa]">{data.menuStructure}</p>
          </div>
        )}

        {data.planMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.planMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q3: 콘텐츠 ========== */}
      <section 
        ref={sectionRefs.content}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('content') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ec4899]/20 mb-2">
            <Palette className="w-5 h-5 text-[#ec4899]" />
          </div>
          <h2 className="text-xl font-bold">콘텐츠는 준비되어 있으신가요?</h2>
        </div>

        <div className="flex gap-2">
          {[
            { id: "yes", label: "있어요" },
            { id: "partial", label: "일부만" },
            { id: "no", label: "없어요" },
          ].map((opt) => {
            const isSelected = data.hasContent === opt.id;
            return (
              <div
                key={opt.id}
                className={`flex-1 p-3 rounded-xl border text-center transition-all
                  ${isSelected 
                    ? "bg-[#ec4899]/10 border-[#ec4899]" 
                    : "bg-[#27272a]/30 border-[#2a2a32]"
                  }`}
              >
                <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                  {opt.label}
                </p>
              </div>
            );
          })}
        </div>

        {data.contentMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.contentMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q4: 규모 ========== */}
      <section 
        ref={sectionRefs.size}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('size') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#6366f1]/20 mb-2">
            <Layers className="w-5 h-5 text-[#6366f1]" />
          </div>
          <h2 className="text-xl font-bold">대략적인 규모</h2>
        </div>

        {/* 견적 프리셋 - 선택된 것만 표시 */}
        {(() => {
          const presets = [
            { id: "A", name: "A안 - 심플", price: "80~120만원", pages: 3, sections: 12, color: "#10b981", recommend: "소규모 사업자, 명함형 홈페이지" },
            { id: "B", name: "B안 - 스탠다드", price: "150~200만원", pages: 5, sections: 25, color: "#6366f1", recommend: "일반 기업, 브랜드 사이트" },
            { id: "C", name: "C안 - 프리미엄", price: "250~350만원", pages: 8, sections: 45, color: "#f59e0b", recommend: "중견기업, 상세한 정보 필요" },
            { id: "D", name: "D안 - 엔터프라이즈", price: "400만원~", pages: 12, sections: 70, color: "#ec4899", recommend: "대기업, 복잡한 기능 필요" },
          ];
          const selected = presets.find(p => p.pages === data.pageCount && p.sections === data.sectionCount);
          
          if (selected) {
            return (
              <div 
                className="mb-5 p-4 rounded-xl border-2"
                style={{ borderColor: selected.color, backgroundColor: `${selected.color}10` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: selected.color }}
                    >
                      {selected.id}
                    </span>
                    <span className="font-semibold text-white">{selected.name}</span>
                  </div>
                  <span className="font-bold text-lg" style={{ color: selected.color }}>{selected.price}</span>
                </div>
                <p className="text-xs text-[#a1a1aa]">👤 {selected.recommend}</p>
              </div>
            );
          }
          return null;
        })()}

        {/* 섹션 샘플 */}
        <div className="mb-5">
          <p className="text-sm text-[#71717a] mb-3 text-center">📏 섹션 길이 참고</p>
          <div className="space-y-2">
            {sectionSamples.map((sample, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-28 text-xs text-[#a1a1aa]">{sample.name}</div>
                <div className="flex-1 h-5 bg-[#27272a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6366f1] to-[#22d3ee] rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(sample.sections * 5, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{sample.sections}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#1a1a1f] rounded-xl p-4 text-center">
            <p className="text-xs text-[#71717a] mb-1">예상 페이지 수</p>
            <p className="text-3xl font-bold text-white">{data.pageCount}</p>
          </div>
          <div className="bg-[#1a1a1f] rounded-xl p-4 text-center">
            <p className="text-xs text-[#71717a] mb-1">예상 섹션 수</p>
            <p className="text-3xl font-bold text-white">{data.sectionCount}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#6366f1]/20 to-[#22d3ee]/20 rounded-xl p-4 text-center">
          <p className="text-sm text-[#71717a] mb-1">예상 견적 범위</p>
          <p className="text-2xl font-bold text-white">{estimatedPrice()}</p>
        </div>

        {data.sizeMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.sizeMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q5: 특수 기능 ========== */}
      <section 
        ref={sectionRefs.features}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('features') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#f59e0b]/20 mb-2">
            <Settings className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <h2 className="text-xl font-bold">필요한 기능</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "member", label: "회원가입/로그인", icon: Users },
            { id: "payment", label: "결제 기능", icon: CreditCard },
            { id: "reservation", label: "예약 시스템", icon: CalendarCheck },
            { id: "board", label: "게시판", icon: MessageSquare },
            { id: "multilang", label: "다국어", icon: Globe },
            { id: "admin", label: "관리자 페이지", icon: Settings },
            { id: "search", label: "검색 기능", icon: Search },
            { id: "api", label: "외부 API 연동", icon: Link2 },
          ].map((opt) => {
            const isSelected = data.features?.includes(opt.id);
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all
                  ${isSelected 
                    ? "bg-[#f59e0b]/10 border-[#f59e0b]" 
                    : "bg-[#27272a]/30 border-[#2a2a32]"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#f59e0b]" : "text-[#71717a]"}`} />
                <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
                  {opt.label}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#f59e0b] ml-auto" />}
              </div>
            );
          })}
        </div>

        {data.customFeature && (
          <div className="mt-3 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]">
            <span className="text-sm text-white">{data.customFeature}</span>
          </div>
        )}

        {data.featureMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.featureMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q6: 참고 사이트 ========== */}
      <section 
        ref={sectionRefs.reference}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('reference') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ec4899]/20 mb-2">
            <Globe className="w-5 h-5 text-[#ec4899]" />
          </div>
          <h2 className="text-xl font-bold">참고 사이트</h2>
        </div>

        {(data.referenceUrls || []).filter(u => u).length > 0 ? (
          <div className="space-y-3">
            {(data.referenceUrls || []).filter(u => u).map((url, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-[#2a2a32]">
                <div className="bg-[#1a1a1e] px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#71717a] truncate max-w-[150px]">{url}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/20 text-[#a5b4fc]">PC 미리보기</span>
                  </div>
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="text-xs text-[#ec4899] hover:underline flex items-center gap-1"
                  >
                    열기 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                {/* PC 화면 비율로 보여주기 */}
                <div className="relative bg-[#f5f5f5] overflow-hidden" style={{ height: '350px' }}>
                  <div 
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ 
                      width: '1440px', 
                      height: '900px',
                      transform: 'scale(0.4)',
                    }}
                  >
                    <iframe
                      src={url}
                      className="w-full h-full bg-white"
                      style={{ width: '1440px', height: '900px' }}
                      sandbox="allow-scripts allow-same-origin"
                      title={`참고 사이트 ${idx + 1}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#52525b]">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">참고 사이트가 없습니다</p>
          </div>
        )}

        {data.referenceMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.referenceMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q7: 일정 ========== */}
      <section 
        ref={sectionRefs.schedule}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('schedule') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#10b981]/20 mb-2">
            <Calendar className="w-5 h-5 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-bold">희망 일정</h2>
        </div>

        {data.deadline ? (
          <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {new Date(data.deadline).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
            {(() => {
              const days = Math.ceil((new Date(data.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <p className={`text-sm ${days < 14 ? 'text-[#ef4444]' : 'text-[#71717a]'}`}>
                  {days < 14 ? '⚠️ ' : ''}약 {days}일 후
                </p>
              );
            })()}
            {data.deadlineFlexible && (
              <p className="text-xs text-[#71717a] mt-2">📌 일정 유동적</p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-[#52525b]">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">일정 미정</p>
          </div>
        )}

        {data.scheduleMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.scheduleMemo}</p>
          </div>
        )}
      </section>

      {/* ========== Q8: 예산 ========== */}
      <section 
        ref={sectionRefs.budget}
        className={`card p-6 mb-4 transition-all duration-500 ${isHighlighted('budget') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#22d3ee]/20 mb-2">
            <DollarSign className="w-5 h-5 text-[#22d3ee]" />
          </div>
          <h2 className="text-xl font-bold">생각하시는 예산</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "under100", label: "100만원 미만" },
            { id: "100-200", label: "100~200만원" },
            { id: "200-300", label: "200~300만원" },
            { id: "300-500", label: "300~500만원" },
            { id: "over500", label: "500만원 이상" },
            { id: "undecided", label: "미정" },
          ].map((opt) => {
            const isSelected = data.budget === opt.id;
            return (
              <div
                key={opt.id}
                className={`p-2 rounded-xl border text-center transition-all
                  ${isSelected 
                    ? "bg-[#22d3ee]/10 border-[#22d3ee]" 
                    : "bg-[#27272a]/30 border-[#2a2a32]"
                  }`}
              >
                <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>

        {data.customBudget && (
          <div className="mt-3 p-3 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]">
            <span className="text-sm text-white">{data.customBudget}</span>
          </div>
        )}

        {data.budgetMemo && (
          <div className="mt-3 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-sm text-[#a1a1aa]">{data.budgetMemo}</p>
          </div>
        )}
      </section>

      {/* ========== 요약 ========== */}
      <section 
        ref={sectionRefs.summary}
        className={`card p-6 transition-all duration-500 ${isHighlighted('summary') ? 'ring-2 ring-[#6366f1] shadow-lg shadow-[#6366f1]/20' : ''}`}
      >
        <div className="text-center mb-5">
          <span className="text-4xl">✅</span>
          <h2 className="text-xl font-bold mt-2">상담 요약</h2>
        </div>

        <div className="space-y-2 text-sm">
          {(data.siteType || data.customSiteType) && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1f]">
              <span className="text-[#10b981]">🎯</span>
              <span className="text-[#a1a1aa]">
                {data.customSiteType || 
                  (data.siteType === "company" ? "회사/브랜드 소개" :
                   data.siteType === "shopping" ? "쇼핑몰" :
                   data.siteType === "reservation" ? "예약 사이트" :
                   data.siteType === "portfolio" ? "포트폴리오" :
                   data.siteType === "landing" ? "랜딩페이지" :
                   data.siteType === "blog" ? "블로그/매거진" : data.siteType)
                }
              </span>
            </div>
          )}
          {data.hasPlan && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1f]">
              <span className="text-[#f59e0b]">📝</span>
              <span className="text-[#a1a1aa]">
                {data.hasPlan === "yes" ? "기획 완료" : data.hasPlan === "partial" ? "부분 기획" : "기획 필요"}
              </span>
            </div>
          )}
          {data.hasContent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1f]">
              <span className="text-[#ec4899]">🎨</span>
              <span className="text-[#a1a1aa]">
                콘텐츠 {data.hasContent === "yes" ? "있음" : data.hasContent === "partial" ? "일부" : "필요"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1f]">
            <span className="text-[#6366f1]">📏</span>
            <span className="text-[#a1a1aa]">{data.pageCount}페이지, {data.sectionCount}섹션</span>
          </div>
          {(data.features?.length > 0 || data.customFeature) && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#1a1a1f]">
              <span className="text-[#f59e0b]">⚙️</span>
              <span className="text-[#a1a1aa]">
                {[
                  ...(data.features || []).map(f => {
                    const labels: Record<string, string> = {
                      member: "회원가입", payment: "결제", reservation: "예약",
                      board: "게시판", multilang: "다국어", admin: "관리자",
                      search: "검색", api: "API연동"
                    };
                    return labels[f] || f;
                  }),
                  ...(data.customFeature ? [data.customFeature] : [])
                ].join(", ")}
              </span>
            </div>
          )}
          {data.deadline && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1f]">
              <span className="text-[#10b981]">📅</span>
              <span className="text-[#a1a1aa]">
                {new Date(data.deadline).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}까지
                {data.deadlineFlexible && " (유동적)"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-[#6366f1]/20 to-[#22d3ee]/20">
            <span className="text-[#22d3ee]">💰</span>
            <span className="text-white font-medium">예상 견적: {estimatedPrice()}</span>
          </div>
        </div>

        {data.additionalMemo && (
          <div className="mt-4 p-3 rounded-xl bg-[#1a1a1f] border-l-2 border-[#6366f1]">
            <p className="text-xs text-[#71717a] mb-1">추가 안내</p>
            <p className="text-sm text-[#a1a1aa]">{data.additionalMemo}</p>
          </div>
        )}
      </section>

      {/* 하단 안내 */}
      <div className="text-center mt-8 text-xs text-[#52525b]">
        <p>상담사가 내용을 업데이트하면 자동으로 반영됩니다</p>
      </div>
    </div>
  );
}
