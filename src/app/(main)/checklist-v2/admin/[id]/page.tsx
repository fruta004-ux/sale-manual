"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useParams } from "next/navigation";
import {
  Copy,
  Check,
  RotateCcw,
  Zap,
  DollarSign,
  Clock,
  Building2,
  ShoppingCart,
  CalendarCheck,
  Image,
  Layers,
  FileText,
  StickyNote,
  ChevronDown,
  AlertTriangle,
  HelpCircle,
  Target,
  TrendingDown,
  Gift,
  PlusCircle,
  Minus,
  Plus,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
  Lightbulb,
  Palette,
  Calendar,
  ExternalLink,
  Link2,
  Globe,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
  Search
} from "lucide-react";
import { getSession, updateSession, SessionData, initialSessionData } from "@/lib/supabase";

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
// 메인 컴포넌트
// ============================================

export default function AdminPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [data, setData] = useState<SessionData>(initialSessionData);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [activeSection, setActiveSection] = useState("sitetype");
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [loadedPreviews, setLoadedPreviews] = useState<string[]>([]); // 로드된 미리보기 URL
  const [showCalendar, setShowCalendar] = useState(false); // 캘린더 표시 여부
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [notFound, setNotFound] = useState(false); // 세션을 찾을 수 없음
  
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

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      const session = await getSession(sessionId);
      if (session) {
        setData(session.data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    loadData();
  }, [sessionId]);

  // 스크롤 감지 (throttle 적용)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 200;
          
          Object.entries(sectionRefs).forEach(([key, ref]) => {
            if (ref.current) {
              const { offsetTop, offsetHeight } = ref.current;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(prev => prev !== key ? key : prev);
              }
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateData = useCallback((updates: Partial<SessionData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setSynced(false);
  }, []);

  const resetAll = () => {
    setData(initialSessionData);
    setExpandedTips({});
    setSynced(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (key: string) => {
    const ref = sectionRefs[key as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleTip = (id: string) => {
    setExpandedTips(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 동기화 (DB에 저장)
  const handleSync = async () => {
    setSyncing(true);
    const dataWithSection = { ...data, adminSection: activeSection };
    const success = await updateSession(sessionId, dataWithSection);
    setSyncing(false);
    if (success) {
      setSynced(true);
      setTimeout(() => setSynced(false), 2000);
    }
  };

  // 예상 견적 계산 (페이지 수 × 페이지당 평균 섹션 수 기반)
  const estimatedPrice = () => {
    // 페이지당 평균 섹션 수
    const avgSectionsPerPage = data.pageCount > 0 ? data.sectionCount / data.pageCount : 0;
    
    // 섹션 4개 = 1페이지 점수로 환산
    const sectionScore = Math.ceil(data.sectionCount / 4);
    
    // 페이지 점수와 섹션 점수 중 큰 값 사용 (작업량 기준)
    const workScore = Math.max(data.pageCount, sectionScore);
    
    // 견적 범위 (대략적인 기준)
    // 5페이지 이하 & 섹션 20개 이하: 100~150만원
    // 8페이지 이하 & 섹션 32개 이하: 150~200만원
    // 12페이지 이하 & 섹션 48개 이하: 200~300만원
    // 그 이상: 300만원 이상
    
    if (workScore <= 5) return "100~150만원";
    if (workScore <= 8) return "150~200만원";
    if (workScore <= 12) return "200~300만원";
    if (workScore <= 15) return "300~400만원";
    return "400만원 이상 (협의)";
  };

  // 요약 생성
  const generateSummary = () => {
    let summary = "📋 고객 상담 내용 정리\n";
    summary += "━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    if (data.siteType || data.customSiteType) {
      const typeLabel = data.customSiteType || 
        (data.siteType === "company" ? "회사/브랜드 소개" :
         data.siteType === "shopping" ? "쇼핑몰" :
         data.siteType === "reservation" ? "예약 사이트" :
         data.siteType === "portfolio" ? "포트폴리오" :
         data.siteType === "landing" ? "랜딩페이지" :
         data.siteType === "blog" ? "블로그/매거진" : data.siteType);
      summary += `【사이트 유형】 ${typeLabel}\n`;
      if (data.siteTypeMemo) summary += `  메모: ${data.siteTypeMemo}\n`;
      summary += "\n";
    }
    
    if (data.hasPlan) {
      const planText = data.hasPlan === "yes" ? "기획 완료" : data.hasPlan === "partial" ? "부분 기획" : "기획 필요";
      summary += `【기획 상태】 ${planText}\n`;
      if (data.menuStructure) summary += `  메뉴: ${data.menuStructure}\n`;
      if (data.planMemo) summary += `  메모: ${data.planMemo}\n`;
      summary += "\n";
    }
    
    if (data.hasContent) {
      const contentText = data.hasContent === "yes" ? "콘텐츠 있음" : data.hasContent === "partial" ? "일부 있음" : "콘텐츠 필요";
      summary += `【콘텐츠】 ${contentText}\n`;
      if (data.contentMemo) summary += `  메모: ${data.contentMemo}\n`;
      summary += "\n";
    }
    
    summary += `【규모】\n`;
    summary += `  • 페이지: 약 ${data.pageCount}페이지\n`;
    summary += `  • 섹션: 약 ${data.sectionCount}섹션\n`;
    summary += `  • 예상 견적: ${estimatedPrice()}\n`;
    if (data.sizeMemo) summary += `  메모: ${data.sizeMemo}\n`;
    summary += "\n";
    
    if (data.budget || data.customBudget) {
      const budgetLabel = data.customBudget || 
        (data.budget === "under100" ? "100만원 미만" :
         data.budget === "100-200" ? "100~200만원" :
         data.budget === "200-300" ? "200~300만원" :
         data.budget === "300-500" ? "300~500만원" :
         data.budget === "over500" ? "500만원 이상" : "미정");
      summary += `【고객 예산】 ${budgetLabel}\n`;
      if (data.budgetMemo) summary += `  메모: ${data.budgetMemo}\n`;
      summary += "\n";
    }
    
    if (data.additionalMemo) {
      summary += `【추가 메모】\n${data.additionalMemo}\n\n`;
    }
    
    summary += "━━━━━━━━━━━━━━━━━━━━━\n";
    summary += `📅 상담일: ${new Date().toLocaleDateString('ko-KR')}`;
    
    return summary;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 상황별 대응 팁 컴포넌트
  const SituationTip = ({ 
    id, 
    situation, 
    response, 
    color = "#6366f1",
    icon: IconComponent = Lightbulb 
  }: { 
    id: string;
    situation: string; 
    response: string[];
    color?: string;
    icon?: React.ElementType;
  }) => {
    const isExpanded = expandedTips[id] || false;
    
    return (
      <div className="border border-[#2a2a32] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTip(id);
          }}
          className="w-full p-3 flex items-center gap-3 text-left hover:bg-[#27272a]/50 transition-colors"
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent className="w-4 h-4" style={{ color }} />
          </div>
          <span className="flex-1 text-sm text-[#e8e8ed]">{situation}</span>
          <ChevronDown 
            className={`w-4 h-4 text-[#71717a] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        <div 
          className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 pb-4 pt-1">
            <div className="bg-[#1a1a1f] rounded-lg p-3 border-l-2" style={{ borderColor: color }}>
              <ul className="space-y-2">
                {response.map((r, i) => (
                  <li key={i} className="text-sm text-[#a1a1aa] flex items-start gap-2">
                    <span className="text-[#71717a]">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 메모 입력 컴포넌트는 파일 하단에 memo로 분리

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#6366f1]" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold">세션을 찾을 수 없습니다</h1>
        <p className="text-[#71717a]">세션 ID: <span className="font-mono text-[#a1a1aa]">{sessionId}</span></p>
        <p className="text-sm text-[#52525b]">세션이 삭제되었거나 잘못된 링크일 수 있습니다.</p>
        <a 
          href="/checklist-v2" 
          className="mt-4 btn-primary"
        >
          ← 목록으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">
      {/* 왼쪽: 스크롤되는 질문 영역 */}
      <div className="flex-1 space-y-6 pb-32">
        {/* 헤더 */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6366f1]/20 rounded-full text-sm text-[#a5b4fc] mb-4">
            <span className="font-mono">#{sessionId}</span>
            <span className="text-[#71717a]">|</span>
            <span>상담사 화면</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">고객 상담</h1>
          <p className="text-[#71717a]">질문하고, 메모하고, [동기화]로 고객에게 공유하세요</p>
        </div>

        {/* 핵심 원칙 배너 */}
        <div className="card p-4 border-l-4 border-[#f59e0b] bg-[#f59e0b]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#fbbf24] mb-1">💡 핵심 원칙</p>
              <ul className="text-sm text-[#a1a1aa] space-y-1">
                <li>• <strong className="text-white">확답 금지</strong> - "정확한 금액은 기획 확정 후 안내드릴게요"</li>
                <li>• <strong className="text-white">예산 먼저</strong> - 고객 예산을 먼저 파악하면 맞춤 제안 가능</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========== Q1: 사이트 유형 ========== */}
        <section ref={sectionRefs.sitetype} id="sitetype" className="scroll-mt-8">
          <div className="card p-6">
            {/* 질문 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#10b981]/20 mb-3">
                <Target className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">어떤 사이트를 만들고 싶으세요?</h2>
              <p className="text-sm text-[#71717a]">유형에 따라 필요한 기능과 예상 비용이 달라져요</p>
            </div>

            {/* 선택지 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
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
                  <button
                    key={option.id}
                    onClick={() => updateData({ siteType: option.id, customSiteType: "" })}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3
                      ${isSelected 
                        ? "bg-[#10b981]/10 border-[#10b981]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-[#10b981]" : "text-[#71717a]"}`} />
                    <span className={`font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                value={data.customSiteType}
                onChange={(e) => updateData({ customSiteType: e.target.value, siteType: "" })}
                placeholder="기타 유형 직접 입력..."
                className="input-field flex-1 text-sm py-2"
              />
            </div>

            {/* 메모 */}
            <MemoInput
              publicValue={data.siteTypeMemo}
              privateValue={data.siteTypePrivateMemo}
              onPublicChange={(v) => updateData({ siteTypeMemo: v })}
              onPrivateChange={(v) => updateData({ siteTypePrivateMemo: v })}
            />

            {/* 팁 */}
            <div className="mt-4 space-y-2">
              <SituationTip
                id="vague-site"
                situation="🤷 '그냥 홈페이지요' 라고 애매하게 답할 때"
                icon={HelpCircle}
                color="#6366f1"
                response={[
                  '"혹시 거기서 물건을 파시거나, 예약을 받으실 건가요?"',
                  '"아니면 회사나 서비스를 소개하는 용도인가요?"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== Q2: 기획 상태 ========== */}
        <section ref={sectionRefs.plan} id="plan" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f59e0b]/20 mb-3">
                <FileText className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">기획이 되어 있으신가요?</h2>
              <p className="text-sm text-[#71717a]">메뉴 구조나 페이지 구성이 정해져 있나요?</p>
            </div>

            <div className="flex gap-2 mb-4">
              {[
                { id: "yes", label: "기획 완료", desc: "메뉴/페이지 구조 있음" },
                { id: "partial", label: "대략적으로", desc: "감은 있는데 정리 안됨" },
                { id: "no", label: "기획 필요", desc: "뭘 넣어야 할지 모름" },
              ].map((opt) => {
                const isSelected = data.hasPlan === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateData({ hasPlan: opt.id })}
                    className={`flex-1 p-4 rounded-xl border transition-all text-center
                      ${isSelected 
                        ? "bg-[#f59e0b]/10 border-[#f59e0b]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <p className={`font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[#71717a] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {data.hasPlan === "yes" && (
              <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#6ee7b7] mb-2">메뉴 구조 입력</p>
                <textarea
                  value={data.menuStructure}
                  onChange={(e) => updateData({ menuStructure: e.target.value })}
                  placeholder="예: 홈, 회사소개, 서비스, 포트폴리오, 문의하기"
                  className="input-field text-sm min-h-[60px] resize-none"
                />
              </div>
            )}

            <MemoInput
              publicValue={data.planMemo}
              privateValue={data.planPrivateMemo}
              onPublicChange={(v) => updateData({ planMemo: v })}
              onPrivateChange={(v) => updateData({ planPrivateMemo: v })}
            />

            <div className="mt-4">
              <SituationTip
                id="no-idea"
                situation="😵 '뭘 넣어야 할지 모르겠어요'"
                icon={HelpCircle}
                color="#22d3ee"
                response={[
                  '"괜찮아요! 저희가 같이 정리해드릴게요."',
                  '"비슷한 업종 사이트 참고할 만한 거 있으면 알려주세요!"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== Q3: 콘텐츠 ========== */}
        <section ref={sectionRefs.content} id="content" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#ec4899]/20 mb-3">
                <Palette className="w-6 h-6 text-[#ec4899]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">콘텐츠는 준비되어 있으신가요?</h2>
              <p className="text-sm text-[#71717a]">텍스트, 이미지 등 사이트에 들어갈 내용이요</p>
            </div>

            <div className="flex gap-2 mb-4">
              {[
                { id: "yes", label: "있어요", desc: "텍스트/이미지 준비됨" },
                { id: "partial", label: "일부만", desc: "몇 개는 있음" },
                { id: "no", label: "없어요", desc: "다 만들어야 함" },
              ].map((opt) => {
                const isSelected = data.hasContent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateData({ hasContent: opt.id })}
                    className={`flex-1 p-4 rounded-xl border transition-all text-center
                      ${isSelected 
                        ? "bg-[#ec4899]/10 border-[#ec4899]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <p className={`font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[#71717a] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            <MemoInput
              publicValue={data.contentMemo}
              privateValue={data.contentPrivateMemo}
              onPublicChange={(v) => updateData({ contentMemo: v })}
              onPrivateChange={(v) => updateData({ contentPrivateMemo: v })}
            />
          </div>
        </section>

        {/* ========== Q4: 규모 ========== */}
        <section ref={sectionRefs.size} id="size" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6366f1]/20 mb-3">
                <Layers className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">대략적인 규모가 어떻게 되세요?</h2>
              <p className="text-sm text-[#71717a]">페이지 수와 각 페이지의 길이(섹션)로 견적이 결정돼요</p>
            </div>

            {/* 🎯 견적 프리셋 */}
            <div className="mb-6">
              <p className="text-sm text-[#71717a] mb-3">🎯 대표 견적 프리셋 (클릭하면 자동 입력)</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "A",
                    name: "A안 - 심플",
                    price: "80~120만원",
                    pages: 3,
                    sections: 12,
                    color: "#10b981",
                    recommend: "소규모 사업자, 명함형 홈페이지",
                    desc: "회사소개 + 서비스 + 문의",
                    features: ["기본 3페이지", "페이지당 4섹션", "반응형", "문의폼"],
                  },
                  {
                    id: "B",
                    name: "B안 - 스탠다드",
                    price: "150~200만원",
                    pages: 5,
                    sections: 25,
                    color: "#6366f1",
                    recommend: "일반 기업, 브랜드 사이트",
                    desc: "메인 + 회사소개 + 서비스 + 포트폴리오 + 문의",
                    features: ["5페이지", "페이지당 5섹션", "반응형", "갤러리", "문의폼"],
                  },
                  {
                    id: "C",
                    name: "C안 - 프리미엄",
                    price: "250~350만원",
                    pages: 8,
                    sections: 45,
                    color: "#f59e0b",
                    recommend: "중견기업, 상세한 정보 필요",
                    desc: "풀 구성 + 서브페이지 다수",
                    features: ["8페이지 이상", "상세 콘텐츠", "반응형", "관리자 기능", "SEO"],
                  },
                  {
                    id: "D",
                    name: "D안 - 엔터프라이즈",
                    price: "400만원~",
                    pages: 12,
                    sections: 70,
                    color: "#ec4899",
                    recommend: "대기업, 복잡한 기능 필요",
                    desc: "커스텀 기능 + 대규모 콘텐츠",
                    features: ["10페이지 이상", "회원 시스템", "결제/예약", "다국어", "API 연동"],
                  },
                ].map((preset) => {
                  const isSelected = data.pageCount === preset.pages && data.sectionCount === preset.sections;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => updateData({ pageCount: preset.pages, sectionCount: preset.sections })}
                      className={`p-4 rounded-xl border text-left transition-all
                        ${isSelected 
                          ? `border-2` 
                          : "border-[#2a2a32] hover:border-[#3a3a42]"
                        }`}
                      style={{ 
                        borderColor: isSelected ? preset.color : undefined,
                        backgroundColor: isSelected ? `${preset.color}10` : '#1a1a1f'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: preset.color }}
                          >
                            {preset.id}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{preset.name}</p>
                            <p className="text-xs text-[#71717a]">{preset.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: preset.color }}>{preset.price}</p>
                          <p className="text-xs text-[#71717a]">{preset.pages}페이지 · {preset.sections}섹션</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#27272a] text-[#a1a1aa]">
                          👤 {preset.recommend}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {preset.features.map((f, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#71717a]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 섹션 샘플 */}
            <div className="mb-5">
              <p className="text-sm text-[#71717a] mb-3">📏 섹션 길이 참고</p>
              <div className="space-y-2">
                {sectionSamples.map((sample, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-[#a1a1aa]">{sample.name}</div>
                    <div className="flex-1 h-6 bg-[#27272a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#6366f1] to-[#22d3ee] rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(sample.sections * 5, 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium">{sample.sections}섹션</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 직접 입력 */}
            <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#71717a] mb-2 block">예상 페이지 수</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateData({ pageCount: Math.max(1, data.pageCount - 1) })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Minus className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-white">{data.pageCount}</span>
                    <button
                      onClick={() => updateData({ pageCount: data.pageCount + 1 })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Plus className="w-4 h-4 text-[#71717a]" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-[#71717a] mb-2 block">예상 총 섹션 수</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateData({ sectionCount: Math.max(1, data.sectionCount - 1) })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Minus className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-white">{data.sectionCount}</span>
                    <button
                      onClick={() => updateData({ sectionCount: data.sectionCount + 1 })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Plus className="w-4 h-4 text-[#71717a]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-[#6366f1]/20 to-[#22d3ee]/20 rounded-lg text-center">
                <p className="text-sm text-[#71717a]">예상 견적 범위</p>
                <p className="text-2xl font-bold text-white">{estimatedPrice()}</p>
              </div>
            </div>

            <MemoInput
              publicValue={data.sizeMemo}
              privateValue={data.sizePrivateMemo}
              onPublicChange={(v) => updateData({ sizeMemo: v })}
              onPrivateChange={(v) => updateData({ sizePrivateMemo: v })}
            />
          </div>
        </section>

        {/* ========== Q5: 특수 기능 ========== */}
        <section ref={sectionRefs.features} id="features" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f59e0b]/20 mb-3">
                <Settings className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">특별히 필요한 기능이 있으신가요?</h2>
              <p className="text-sm text-[#71717a]">기능에 따라 견적이 달라질 수 있어요</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
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
                  <button
                    key={opt.id}
                    onClick={() => {
                      const current = data.features || [];
                      const updated = isSelected
                        ? current.filter((f) => f !== opt.id)
                        : [...current, opt.id];
                      updateData({ features: updated });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2
                      ${isSelected 
                        ? "bg-[#f59e0b]/10 border-[#f59e0b]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#f59e0b]" : "text-[#71717a]"}`} />
                    <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={data.customFeature || ""}
              onChange={(e) => updateData({ customFeature: e.target.value })}
              placeholder="기타 기능 직접 입력..."
              className="input-field text-sm py-2 mb-4"
            />

            <MemoInput
              publicValue={data.featureMemo || ""}
              privateValue={data.featurePrivateMemo || ""}
              onPublicChange={(v) => updateData({ featureMemo: v })}
              onPrivateChange={(v) => updateData({ featurePrivateMemo: v })}
            />

            <SituationTip
              id="feature-cost"
              situation="💡 기능별 비용 안내"
              icon={Lightbulb}
              color="#f59e0b"
              response={[
                '"회원가입/결제 기능은 별도 개발이 필요해서 추가 비용이 있어요"',
                '"다국어는 페이지당 30% 추가 비용이 발생합니다"',
                '"기본 게시판은 포함, 커스텀 게시판은 별도예요"'
              ]}
            />
          </div>
        </section>

        {/* ========== Q6: 참고 사이트 ========== */}
        <section ref={sectionRefs.reference} id="reference" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#ec4899]/20 mb-3">
                <Globe className="w-6 h-6 text-[#ec4899]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">참고하고 싶은 사이트가 있으신가요?</h2>
              <p className="text-sm text-[#71717a]">비슷한 느낌으로 만들어드릴게요</p>
            </div>

            <div className="space-y-3 mb-4">
              {(data.referenceUrls || ["", "", ""]).map((url, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const urls = [...(data.referenceUrls || ["", "", ""])];
                          urls[idx] = e.target.value;
                          updateData({ referenceUrls: urls });
                          // URL 변경 시 미리보기 제거
                          setLoadedPreviews(prev => prev.filter(u => u !== url));
                        }}
                        placeholder={`참고 사이트 URL ${idx + 1}`}
                        className="input-field text-sm py-2 pl-10"
                      />
                    </div>
                    {url && (
                      <>
                        <button
                          onClick={() => {
                            if (loadedPreviews.includes(url)) {
                              setLoadedPreviews(prev => prev.filter(u => u !== url));
                            } else {
                              setLoadedPreviews(prev => [...prev, url]);
                            }
                          }}
                          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm
                            ${loadedPreviews.includes(url) 
                              ? "bg-[#ec4899] text-white" 
                              : "bg-[#ec4899]/20 text-[#ec4899] hover:bg-[#ec4899]/30"
                            }`}
                          title={loadedPreviews.includes(url) ? "미리보기 닫기" : "미리보기 열기"}
                        >
                          {loadedPreviews.includes(url) ? "닫기" : "미리보기"}
                        </button>
                        <button
                          onClick={() => window.open(url, '_blank')}
                          className="px-3 py-2 rounded-lg bg-[#27272a] text-[#a1a1aa] hover:bg-[#3a3a42] transition-all"
                          title="새 창에서 열기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* 개별 미리보기 - PC 버전으로 크게 */}
                  {url && loadedPreviews.includes(url) && (
                    <div className="rounded-xl overflow-hidden border border-[#2a2a32]">
                      <div className="bg-[#1a1a1e] px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#71717a] truncate max-w-[200px]">{url}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/20 text-[#a5b4fc]">PC 미리보기</span>
                        </div>
                        <button
                          onClick={() => window.open(url, '_blank')}
                          className="text-xs text-[#ec4899] hover:underline flex items-center gap-1"
                        >
                          새 창 <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      {/* PC 화면 비율로 보여주기: 1440px 너비를 축소 */}
                      <div className="relative bg-[#f5f5f5] overflow-hidden" style={{ height: '400px' }}>
                        <div 
                          className="absolute top-0 left-0 origin-top-left"
                          style={{ 
                            width: '1440px', 
                            height: '900px',
                            transform: 'scale(0.35)',
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
                  )}
                </div>
              ))}
            </div>

            <MemoInput
              publicValue={data.referenceMemo || ""}
              privateValue={data.referencePrivateMemo || ""}
              onPublicChange={(v) => updateData({ referenceMemo: v })}
              onPrivateChange={(v) => updateData({ referencePrivateMemo: v })}
              publicPlaceholder="참고 사이트에서 마음에 드는 점..."
              privatePlaceholder="내부 메모..."
            />
          </div>
        </section>

        {/* ========== Q7: 일정 ========== */}
        <section ref={sectionRefs.schedule} id="schedule" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#10b981]/20 mb-3">
                <Calendar className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">언제까지 완성되면 좋으실까요?</h2>
              <p className="text-sm text-[#71717a]">일정에 맞춰 진행해드릴게요</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[#a1a1aa] mb-2">희망 완료일</label>
              
              {/* 날짜 선택 버튼 */}
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full input-field text-sm py-3 text-left flex items-center justify-between"
              >
                <span className={data.deadline ? "text-white" : "text-[#71717a]"}>
                  {data.deadline 
                    ? new Date(data.deadline).toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      })
                    : "날짜를 선택하세요"
                  }
                </span>
                <Calendar className="w-5 h-5 text-[#10b981]" />
              </button>

              {/* 커스텀 캘린더 */}
              {showCalendar && (
                <div className="mt-2 p-4 rounded-xl bg-[#1a1a1f] border border-[#2a2a32]">
                  {(() => {
                    const today = new Date();
                    
                    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
                    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                    const days: (number | null)[] = [];
                    
                    // 빈 칸 채우기
                    for (let i = 0; i < firstDay; i++) {
                      days.push(null);
                    }
                    // 날짜 채우기
                    for (let i = 1; i <= daysInMonth; i++) {
                      days.push(i);
                    }
                    
                    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                    
                    return (
                      <>
                        {/* 월 네비게이션 */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => {
                              if (calendarMonth === 0) {
                                setCalendarYear(calendarYear - 1);
                                setCalendarMonth(11);
                              } else {
                                setCalendarMonth(calendarMonth - 1);
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-[#27272a] transition-all"
                          >
                            <ChevronDown className="w-5 h-5 rotate-90" />
                          </button>
                          <span className="font-semibold text-white">
                            {calendarYear}년 {monthNames[calendarMonth]}
                          </span>
                          <button
                            onClick={() => {
                              if (calendarMonth === 11) {
                                setCalendarYear(calendarYear + 1);
                                setCalendarMonth(0);
                              } else {
                                setCalendarMonth(calendarMonth + 1);
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-[#27272a] transition-all"
                          >
                            <ChevronDown className="w-5 h-5 -rotate-90" />
                          </button>
                        </div>
                        
                        {/* 요일 헤더 */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day, i) => (
                            <div key={day} className={`text-center text-xs py-1 ${i === 0 ? 'text-[#ef4444]' : i === 6 ? 'text-[#6366f1]' : 'text-[#71717a]'}`}>
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* 날짜 그리드 */}
                        <div className="grid grid-cols-7 gap-1">
                          {days.map((day, idx) => {
                            if (day === null) {
                              return <div key={`empty-${idx}`} className="h-9" />;
                            }
                            
                            const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = data.deadline === dateStr;
                            const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0]);
                            const isToday = dateStr === today.toISOString().split('T')[0];
                            const dayOfWeek = new Date(dateStr).getDay();
                            
                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  if (!isPast) {
                                    updateData({ deadline: dateStr });
                                    setShowCalendar(false);
                                  }
                                }}
                                disabled={isPast}
                                className={`h-9 rounded-lg text-sm transition-all
                                  ${isSelected 
                                    ? "bg-[#10b981] text-white font-semibold" 
                                    : isPast
                                      ? "text-[#3a3a42] cursor-not-allowed"
                                      : isToday
                                        ? "bg-[#27272a] text-white"
                                        : dayOfWeek === 0 
                                          ? "text-[#ef4444] hover:bg-[#27272a]"
                                          : dayOfWeek === 6
                                            ? "text-[#6366f1] hover:bg-[#27272a]"
                                            : "text-[#a1a1aa] hover:bg-[#27272a]"
                                  }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* 빠른 선택 */}
                        <div className="mt-4 pt-4 border-t border-[#2a2a32]">
                          <p className="text-xs text-[#71717a] mb-2">빠른 선택</p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "2주 후", days: 14 },
                              { label: "1개월 후", days: 30 },
                              { label: "2개월 후", days: 60 },
                              { label: "3개월 후", days: 90 },
                            ].map(({ label, days: d }) => {
                              const date = new Date();
                              date.setDate(date.getDate() + d);
                              const dateStr = date.toISOString().split('T')[0];
                              return (
                                <button
                                  key={label}
                                  onClick={() => {
                                    updateData({ deadline: dateStr });
                                    setShowCalendar(false);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-[#27272a] text-xs text-[#a1a1aa] hover:bg-[#3a3a42] transition-all"
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {data.deadline && (
              <div className="mb-4 p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">
                      📅 선택한 날짜: <span className="font-semibold text-[#10b981]">
                        {new Date(data.deadline).toLocaleDateString('ko-KR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </span>
                    </p>
                    {(() => {
                      const days = Math.ceil((new Date(data.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <p className={`text-xs mt-1 ${days < 14 ? 'text-[#ef4444]' : 'text-[#71717a]'}`}>
                          {days < 14 ? '⚠️ ' : ''}약 {days}일 후 ({days < 14 ? '급한 일정' : days < 30 ? '보통' : '여유로움'})
                        </p>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => updateData({ deadline: "" })}
                    className="text-xs text-[#71717a] hover:text-[#ef4444] transition-all"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={data.deadlineFlexible || false}
                onChange={(e) => updateData({ deadlineFlexible: e.target.checked })}
                className="w-4 h-4 rounded border-[#3a3a42] bg-[#27272a] text-[#10b981] focus:ring-[#10b981]"
              />
              <span className="text-sm text-[#a1a1aa]">일정은 유동적이에요</span>
            </label>

            <MemoInput
              publicValue={data.scheduleMemo || ""}
              privateValue={data.schedulePrivateMemo || ""}
              onPublicChange={(v) => updateData({ scheduleMemo: v })}
              onPrivateChange={(v) => updateData({ schedulePrivateMemo: v })}
              publicPlaceholder="일정 관련 메모..."
              privatePlaceholder="내부 메모 (급한 이유 등)..."
            />

            <SituationTip
              id="urgent"
              situation="⏰ 급한 일정일 때"
              icon={Clock}
              color="#ef4444"
              response={[
                '"2주 이내는 급행 비용이 추가될 수 있어요"',
                '"빠른 진행을 위해 자료를 미리 준비해주시면 좋아요"',
                '"일정이 촉박하면 기능을 단계별로 나눠서 진행할 수도 있어요"'
              ]}
            />
          </div>
        </section>

        {/* ========== Q8: 예산 ========== */}
        <section ref={sectionRefs.budget} id="budget" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#22d3ee]/20 mb-3">
                <DollarSign className="w-6 h-6 text-[#22d3ee]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">생각하시는 예산이 있으신가요?</h2>
              <p className="text-sm text-[#71717a]">예산에 맞춰 최적의 제안을 드릴게요</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
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
                  <button
                    key={opt.id}
                    onClick={() => updateData({ budget: opt.id, customBudget: "" })}
                    className={`p-3 rounded-xl border text-center transition-all
                      ${isSelected 
                        ? "bg-[#22d3ee]/10 border-[#22d3ee]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={data.customBudget}
              onChange={(e) => updateData({ customBudget: e.target.value, budget: "" })}
              placeholder="기타 예산 직접 입력..."
              className="input-field text-sm py-2 mb-4"
            />

            <MemoInput
              publicValue={data.budgetMemo}
              privateValue={data.budgetPrivateMemo}
              onPublicChange={(v) => updateData({ budgetMemo: v })}
              onPrivateChange={(v) => updateData({ budgetPrivateMemo: v })}
            />

            {/* 팁 */}
            <div className="mt-4 space-y-2">
              <SituationTip
                id="too-expensive"
                situation="😰 '비싸네요...' 반응이 안 좋을 때"
                icon={TrendingDown}
                color="#ef4444"
                response={[
                  '"담당자 할인 20만원 적용해드릴 수 있어요!"',
                  '"예산 말씀해주시면 그 안에서 최대한 맞춰드릴게요"',
                  '"기능 줄이면 비용도 낮출 수 있어요"'
                ]}
              />
              
              <SituationTip
                id="discount"
                situation="🎁 할인 카드 사용하기"
                icon={Gift}
                color="#10b981"
                response={[
                  '"담당자 할인 20만원 적용 가능해요!"',
                  '"계약금 선결제 시 추가 할인 가능합니다"'
                ]}
              />

              <SituationTip
                id="think-about"
                situation="🤔 '생각해볼게요' 할 때"
                icon={Clock}
                color="#f59e0b"
                response={[
                  '"천천히 생각해보세요! 궁금한 거 있으시면 연락주세요"',
                  '"견적서 메일로 보내드릴까요?"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== 요약 ========== */}
        <section ref={sectionRefs.summary} id="summary" className="scroll-mt-8">
          <div className="card p-6">
            <div className="text-center mb-6">
              <span className="text-4xl">✅</span>
              <h2 className="text-2xl font-bold mt-3 mb-2">상담 요약</h2>
            </div>

            <MemoInput
              label="추가 메모"
              publicValue={data.additionalMemo}
              privateValue={data.additionalPrivateMemo}
              onPublicChange={(v) => updateData({ additionalMemo: v })}
              onPrivateChange={(v) => updateData({ additionalPrivateMemo: v })}
              publicPlaceholder="고객에게 전달할 추가 내용..."
              privatePlaceholder="내부 메모 (고객에게 안 보임)..."
            />
          </div>
        </section>
      </div>

      {/* 오른쪽: 고정된 패널 */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-4">
          {/* 동기화 버튼 */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all
              ${synced 
                ? "bg-[#10b981] text-white" 
                : "bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white hover:opacity-90"
              }`}
          >
            {syncing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                동기화 중...
              </>
            ) : synced ? (
              <>
                <Check className="w-5 h-5" />
                동기화 완료!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                고객 화면에 동기화
              </>
            )}
          </button>

          {/* 네비게이션 */}
          <div className="card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#71717a]">질문 목록</span>
              <button onClick={resetAll} className="p-1 rounded hover:bg-[#27272a]" title="초기화">
                <RotateCcw className="w-4 h-4 text-[#71717a]" />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { key: "sitetype", label: "사이트 유형", icon: "🎯" },
                { key: "plan", label: "기획 상태", icon: "📝" },
                { key: "content", label: "콘텐츠", icon: "🎨" },
                { key: "size", label: "규모", icon: "📏" },
                { key: "budget", label: "예산", icon: "💰" },
                { key: "summary", label: "요약", icon: "✅" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all
                    ${activeSection === item.key 
                      ? "bg-[#6366f1]/20 text-white" 
                      : "text-[#71717a] hover:bg-[#27272a]"
                    }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote className="w-5 h-5 text-[#fbbf24]" />
              <span className="font-semibold">현재 상태</span>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              {(data.siteType || data.customSiteType) && (
                <div className="flex items-start gap-2">
                  <span className="text-[#10b981]">🎯</span>
                  <span className="text-[#a1a1aa]">{data.customSiteType || 
                    (data.siteType === "company" ? "회사/브랜드 소개" :
                     data.siteType === "shopping" ? "쇼핑몰" :
                     data.siteType === "reservation" ? "예약 사이트" :
                     data.siteType === "portfolio" ? "포트폴리오" :
                     data.siteType === "landing" ? "랜딩페이지" :
                     data.siteType === "blog" ? "블로그/매거진" : data.siteType)
                  }</span>
                </div>
              )}
              {data.hasPlan && (
                <div className="flex items-start gap-2">
                  <span className="text-[#f59e0b]">📝</span>
                  <span className="text-[#a1a1aa]">
                    {data.hasPlan === "yes" ? "기획 완료" : data.hasPlan === "partial" ? "부분 기획" : "기획 필요"}
                  </span>
                </div>
              )}
              {data.hasContent && (
                <div className="flex items-start gap-2">
                  <span className="text-[#ec4899]">🎨</span>
                  <span className="text-[#a1a1aa]">
                    콘텐츠 {data.hasContent === "yes" ? "있음" : data.hasContent === "partial" ? "일부" : "필요"}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-[#6366f1]">📏</span>
                <span className="text-[#a1a1aa]">{data.pageCount}페이지, {data.sectionCount}섹션</span>
              </div>
              {(data.budget || data.customBudget) && (
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">💰</span>
                  <span className="text-[#a1a1aa]">{data.customBudget || 
                    (data.budget === "under100" ? "100만원 미만" :
                     data.budget === "100-200" ? "100~200만원" :
                     data.budget === "200-300" ? "200~300만원" :
                     data.budget === "300-500" ? "300~500만원" :
                     data.budget === "over500" ? "500만원 이상" : "미정")
                  }</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-[#6366f1]/20 to-[#22d3ee]/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-[#71717a]">예상 견적</p>
              <p className="text-lg font-bold text-white">{estimatedPrice()}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "복사됨!" : "복사"}
              </button>
              <button
                onClick={() => window.open('/calculator', '_blank')}
                className="btn-secondary px-3"
                title="견적 계산기"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 메모 입력 컴포넌트 (memo로 최적화)
// ============================================

const MemoInput = memo(function MemoInput({
  label,
  publicValue,
  privateValue,
  onPublicChange,
  onPrivateChange,
  publicPlaceholder = "고객에게 보이는 메모...",
  privatePlaceholder = "나만 보는 메모...",
}: {
  label?: string;
  publicValue: string;
  privateValue: string;
  onPublicChange: (value: string) => void;
  onPrivateChange: (value: string) => void;
  publicPlaceholder?: string;
  privatePlaceholder?: string;
}) {
  return (
    <div className="space-y-2 mt-4">
      {label && <p className="text-xs text-[#71717a]">{label}</p>}
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <Eye className="w-3 h-3 text-[#6366f1]" />
            <span className="text-xs text-[#6366f1]">공개 메모</span>
          </div>
          <textarea
            value={publicValue}
            onChange={(e) => onPublicChange(e.target.value)}
            placeholder={publicPlaceholder}
            className="input-field text-sm min-h-[60px] resize-none"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <EyeOff className="w-3 h-3 text-[#f59e0b]" />
            <span className="text-xs text-[#f59e0b]">비공개 메모</span>
          </div>
          <textarea
            value={privateValue}
            onChange={(e) => onPrivateChange(e.target.value)}
            placeholder={privatePlaceholder}
            className="input-field text-sm min-h-[60px] resize-none border-[#f59e0b]/30"
          />
        </div>
      </div>
    </div>
  );
});
