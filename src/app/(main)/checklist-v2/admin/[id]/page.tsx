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
    if (confirm("모든 입력을 초기화할까요?")) {
      setData(initialSessionData);
      setExpandedTips({});
      setSynced(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  // 예상 견적 계산
  const estimatedPrice = () => {
    const sectionScore = Math.ceil(data.sectionCount / 4);
    const workScore = Math.max(data.pageCount, sectionScore);
    
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
    color = "#4f46e5",
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
      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:border-indigo-200 transition-all">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTip(id);
          }}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <IconComponent className="w-5 h-5" style={{ color }} />
          </div>
          <span className="flex-1 text-[15px] font-bold text-gray-800">{situation}</span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        <div 
          className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 pb-4 pt-1">
            <div className="bg-gray-50 rounded-xl p-4 border-l-4" style={{ borderLeftColor: color }}>
              <ul className="space-y-3">
                {response.map((r, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
                    <span className="text-gray-300">●</span>
                    <span className="font-medium">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium">상담 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl">🔍</div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">상담을 찾을 수 없습니다</h1>
          <p className="text-gray-500">삭제된 세션이거나 잘못된 링크입니다.</p>
          <p className="text-xs text-gray-400 mt-2 font-mono">ID: {sessionId}</p>
        </div>
        <a 
          href="/checklist-v2" 
          className="btn-primary flex items-center gap-2 h-14 px-8 text-lg"
        >
          상담 목록으로 이동
        </a>
      </div>
    );
  }

  return (
    <div className="flex gap-8 max-w-6xl mx-auto py-4">
      {/* 왼쪽: 스크롤되는 질문 영역 */}
      <div className="flex-1 space-y-10 pb-32">
        {/* 헤더 */}
        <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-black text-xs uppercase tracking-widest mb-6">
            <span className="opacity-50 font-mono">#{sessionId}</span>
            <span className="w-1 h-1 rounded-full bg-indigo-300"></span>
            <span>Admin Console</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">프로젝트 정밀 진단</h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg mx-auto">
            고객과 대화하며 체크리스트를 채워주세요.<br/>
            [실시간 동기화]를 통해 고객 화면에 즉시 반영됩니다.
          </p>
        </div>

        {/* 핵심 원칙 배너 */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-amber-900 text-lg mb-1">영업 핵심 원칙</h3>
            <ul className="text-amber-800/80 text-sm font-medium space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <strong className="text-amber-900">절대 확답 금지</strong>: "정확한 견적은 기획서 확인 후 확정됩니다."
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <strong className="text-amber-900">예산 먼저 파악</strong>: 고객의 예산 범위 내에서 최선의 구성을 제안하세요.
              </li>
            </ul>
          </div>
        </div>

        {/* ========== Q1: 사이트 유형 ========== */}
        <section ref={sectionRefs.sitetype} id="sitetype" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">어떤 사이트를 기획 중이신가요?</h2>
                <p className="text-gray-500 font-medium">유형에 따라 견적의 기본 골격이 결정됩니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: "company", label: "회사/브랜드 소개", icon: Building2 },
                { id: "shopping", label: "쇼핑몰", icon: ShoppingCart },
                { id: "reservation", label: "예약/시설 예약", icon: CalendarCheck },
                { id: "portfolio", label: "포트폴리오/작품", icon: Image },
                { id: "landing", label: "랜딩페이지/홍보", icon: Layers },
                { id: "blog", label: "블로그/커뮤니티", icon: FileText },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = data.siteType === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => updateData({ siteType: option.id, customSiteType: "" })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4
                      ${isSelected 
                        ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                    <span className={`text-lg font-bold ${isSelected ? "text-indigo-900" : "text-gray-600"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={data.customSiteType}
                onChange={(e) => updateData({ customSiteType: e.target.value, siteType: "" })}
                placeholder="기타 유형을 직접 입력하세요..."
                className="input-field pl-12 h-14 text-base font-bold"
              />
            </div>

            <MemoInput
              publicValue={data.siteTypeMemo}
              privateValue={data.siteTypePrivateMemo}
              onPublicChange={(v) => updateData({ siteTypeMemo: v })}
              onPrivateChange={(v) => updateData({ siteTypePrivateMemo: v })}
            />

            <div className="mt-8">
              <SituationTip
                id="vague-site"
                situation="🤷 '그냥 홈페이지요'라고 애매하게 답할 때"
                icon={HelpCircle}
                color="#4f46e5"
                response={[
                  '"혹시 거기서 물건을 직접 판매하시거나 결제가 필요하신가요?"',
                  '"아니면 단순하게 회사나 서비스 정보를 보여주는 용도인가요?"',
                  '"가장 중요하게 생각하시는 기능 한 가지만 꼽는다면 무엇일까요?"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== Q2: 기획 상태 ========== */}
        <section ref={sectionRefs.plan} id="plan" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">현재 어느 단계까지 준비되셨나요?</h2>
                <p className="text-gray-500 font-medium">기획의 완성도는 제작 속도와 직결됩니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "yes", label: "기획 완료", desc: "상세 기획서 보유" },
                { id: "partial", label: "부분 기획", desc: "메뉴 구조만 있음" },
                { id: "no", label: "기획 필요", desc: "아이디어만 있음" },
              ].map((opt) => {
                const isSelected = data.hasPlan === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateData({ hasPlan: opt.id })}
                    className={`p-5 rounded-2xl border-2 transition-all text-center
                      ${isSelected 
                        ? "bg-amber-50 border-amber-500 shadow-md shadow-amber-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <p className={`text-lg font-black ${isSelected ? "text-amber-900" : "text-gray-800"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {data.hasPlan === "yes" && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <p className="text-sm font-black text-indigo-600 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" /> 확인된 메뉴 구조
                </p>
                <textarea
                  value={data.menuStructure}
                  onChange={(e) => updateData({ menuStructure: e.target.value })}
                  placeholder="예: 홈, 회사소개, 서비스, 포트폴리오, 문의하기..."
                  className="input-field min-h-[100px] font-bold text-base bg-white"
                />
              </div>
            )}

            <MemoInput
              publicValue={data.planMemo}
              privateValue={data.planPrivateMemo}
              onPublicChange={(v) => updateData({ planMemo: v })}
              onPrivateChange={(v) => updateData({ planPrivateMemo: v })}
            />

            <div className="mt-8">
              <SituationTip
                id="no-idea"
                situation="😵 '뭘 넣어야 할지 모르겠어요' (무계획)"
                icon={Lightbulb}
                color="#f59e0b"
                response={[
                  '"괜찮습니다! 저희가 업종별 가장 효율적인 표준 메뉴 구성을 제안해드릴게요."',
                  '"혹시 경쟁사나 벤치마킹하고 싶은 사이트가 하나라도 있으실까요?"',
                  '"가장 기본이 되는 회사소개/서비스안내/문의하기 3단 구성부터 시작해보시죠."'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== Q3: 콘텐츠 ========== */}
        <section ref={sectionRefs.content} id="content" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">사이트에 들어갈 자료는 있나요?</h2>
                <p className="text-gray-500 font-medium">이미지, 문구 준비 상태를 확인합니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "yes", label: "준비 완료", desc: "문구/사진 보유" },
                { id: "partial", label: "일부 보유", desc: "정리 중" },
                { id: "no", label: "자료 없음", desc: "제작 필요" },
              ].map((opt) => {
                const isSelected = data.hasContent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateData({ hasContent: opt.id })}
                    className={`p-5 rounded-2xl border-2 transition-all text-center
                      ${isSelected 
                        ? "bg-rose-50 border-rose-500 shadow-md shadow-rose-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <p className={`text-lg font-black ${isSelected ? "text-rose-900" : "text-gray-800"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1">{opt.desc}</p>
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
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">대략적인 규모와 예산을 잡을까요?</h2>
                <p className="text-gray-500 font-medium">페이지와 섹션 수로 작업량을 산정합니다.</p>
              </div>
            </div>

            {/* 🎯 견적 프리셋 */}
            <div className="mb-10">
              <p className="text-sm font-black text-indigo-600 mb-4 uppercase tracking-widest">Quick Presets</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    id: "A",
                    name: "A안 - 미니멀",
                    price: "100~150만원",
                    pages: 3,
                    sections: 12,
                    color: "#10b981",
                    recommend: "소규모 개인사업자, 1인 기업",
                    desc: "회사소개 중심의 컴팩트한 구성",
                    features: ["홈", "서비스 안내", "문의하기"],
                  },
                  {
                    id: "B",
                    name: "B안 - 스탠다드",
                    price: "150~220만원",
                    pages: 5,
                    sections: 25,
                    color: "#4f46e5",
                    recommend: "중소기업, 스타트업",
                    desc: "브랜드 신뢰도를 높이는 표준 구성",
                    features: ["홈", "회사소개", "서비스", "포트폴리오", "문의"],
                  },
                  {
                    id: "C",
                    name: "C안 - 프리미엄",
                    price: "250~400만원",
                    pages: 10,
                    sections: 50,
                    color: "#f59e0b",
                    recommend: "중견기업, 상세 정보 필요",
                    desc: "방대한 콘텐츠와 상세한 서비스 설명",
                    features: ["다국어 가능", "상세 페이지 다수", "커스텀 기능"],
                  }
                ].map((preset) => {
                  const isSelected = data.pageCount === preset.pages && data.sectionCount === preset.sections;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => updateData({ pageCount: preset.pages, sectionCount: preset.sections })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                        ${isSelected 
                          ? `border-indigo-600 shadow-xl shadow-indigo-50` 
                          : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                      style={{ 
                        backgroundColor: isSelected ? `${preset.color}05` : undefined
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 p-2">
                          <Check className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
                            style={{ backgroundColor: preset.color }}
                          >
                            {preset.id}
                          </span>
                          <div>
                            <p className="font-black text-gray-900 text-lg">{preset.name}</p>
                            <p className="text-xs font-bold text-gray-400">{preset.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl tracking-tight" style={{ color: preset.color }}>{preset.price}</p>
                          <p className="text-xs font-bold text-gray-400">{preset.pages}P · {preset.sections}S</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">
                          추천: {preset.recommend}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {preset.features.map((f, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-gray-100 text-gray-400 font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 직접 입력 */}
            <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100 mb-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-sm font-black text-gray-400 mb-4 block uppercase tracking-widest">Total Pages</label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200">
                    <button
                      onClick={() => updateData({ pageCount: Math.max(1, data.pageCount - 1) })}
                      className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{data.pageCount}</span>
                    <button
                      onClick={() => updateData({ pageCount: data.pageCount + 1 })}
                      className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-black text-gray-400 mb-4 block uppercase tracking-widest">Total Sections</label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200">
                    <button
                      onClick={() => updateData({ sectionCount: Math.max(1, data.sectionCount - 1) })}
                      className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{data.sectionCount}</span>
                    <button
                      onClick={() => updateData({ sectionCount: data.sectionCount + 1 })}
                      className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-2xl p-6 text-center shadow-lg shadow-indigo-100">
                <p className="text-indigo-100 text-sm font-bold mb-1">작업량 기준 예상 견적</p>
                <p className="text-3xl font-black text-white">{estimatedPrice()}</p>
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
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Settings className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">특별히 필요한 기능이 있을까요?</h2>
                <p className="text-gray-500 font-medium">난이도 높은 기능은 견적을 조정합니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: "member", label: "회원가입/로그인", icon: Users },
                { id: "payment", label: "결제 시스템", icon: CreditCard },
                { id: "reservation", label: "실시간 예약", icon: CalendarCheck },
                { id: "board", label: "커스텀 게시판", icon: MessageSquare },
                { id: "multilang", label: "다국어 지원", icon: Globe },
                { id: "admin", label: "고급 관리자 기능", icon: Settings },
                { id: "search", label: "정밀 검색 기능", icon: Search },
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
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3
                      ${isSelected 
                        ? "bg-amber-50 border-amber-500 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-amber-600" : "text-gray-400"}`} />
                    <span className={`text-base font-bold ${isSelected ? "text-amber-900" : "text-gray-600"}`}>
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
              placeholder="추가로 필요한 특수 기능을 입력하세요..."
              className="input-field h-14 text-base font-bold mb-6"
            />

            <MemoInput
              publicValue={data.featureMemo || ""}
              privateValue={data.featurePrivateMemo || ""}
              onPublicChange={(v) => updateData({ featureMemo: v })}
              onPrivateChange={(v) => updateData({ featurePrivateMemo: v })}
            />
          </div>
        </section>

        {/* ========== Q6: 참고 사이트 ========== */}
        <section ref={sectionRefs.reference} id="reference" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">벤치마킹하고 싶은 사이트?</h2>
                <p className="text-gray-500 font-medium">눈높이를 맞추면 만족도가 올라갑니다.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {(data.referenceUrls || ["", "", ""]).map((url, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const urls = [...(data.referenceUrls || ["", "", ""])];
                          urls[idx] = e.target.value;
                          updateData({ referenceUrls: urls });
                          setLoadedPreviews(prev => prev.filter(u => u !== url));
                        }}
                        placeholder={`참고 사이트 주소 ${idx + 1}`}
                        className="input-field pl-12 h-14 font-bold text-gray-700"
                      />
                    </div>
                    {url && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (loadedPreviews.includes(url)) {
                              setLoadedPreviews(prev => prev.filter(u => u !== url));
                            } else {
                              setLoadedPreviews(prev => [...prev, url]);
                            }
                          }}
                          className={`px-5 rounded-2xl font-black text-sm transition-all
                            ${loadedPreviews.includes(url) 
                              ? "bg-rose-600 text-white" 
                              : "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                            }`}
                        >
                          {loadedPreviews.includes(url) ? "닫기" : "미리보기"}
                        </button>
                        <button
                          onClick={() => window.open(url, '_blank')}
                          className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {url && loadedPreviews.includes(url) && (
                    <div className="rounded-[24px] overflow-hidden border-2 border-rose-100 shadow-xl">
                      <div className="bg-rose-50 px-5 py-3 flex items-center justify-between border-b border-rose-100">
                        <span className="text-xs font-black text-rose-600 truncate max-w-[400px] uppercase tracking-wider">{url}</span>
                        <span className="text-[10px] font-black bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full uppercase">Desktop View</span>
                      </div>
                      <div className="relative bg-white" style={{ height: '450px' }}>
                        <div 
                          className="absolute top-0 left-0 origin-top-left"
                          style={{ 
                            width: '1440px', 
                            height: '1200px',
                            transform: 'scale(0.35)',
                          }}
                        >
                          <iframe
                            src={url}
                            className="w-full h-full bg-white"
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
              publicPlaceholder="마음에 들어하시는 포인트 (디자인, 기능 등)..."
            />
          </div>
        </section>

        {/* ========== Q7: 일정 ========== */}
        <section ref={sectionRefs.schedule} id="schedule" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">데드라인이 정해져 있으신가요?</h2>
                <p className="text-gray-500 font-medium">일정 압박 정도에 따라 투입 인력을 조절합니다.</p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full h-16 rounded-2xl bg-white border-2 border-gray-100 px-6 flex items-center justify-between hover:border-emerald-300 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                  <span className={`text-xl font-black ${data.deadline ? "text-gray-900" : "text-gray-300"}`}>
                    {data.deadline 
                      ? new Date(data.deadline).toLocaleDateString('ko-KR', { 
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : "희망 완료일을 선택하세요"
                    }
                  </span>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-300 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
              </button>

              {showCalendar && (
                <div className="mt-4 p-6 rounded-[24px] bg-white border-2 border-emerald-100 shadow-2xl">
                  {/* ... 캘린더 내부 로직 유지하되 스타일 라이트 테마로 ... */}
                  {(() => {
                    const today = new Date();
                    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
                    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                    const days: (number | null)[] = [];
                    for (let i = 0; i < firstDay; i++) days.push(null);
                    for (let i = 1; i <= daysInMonth; i++) days.push(i);
                    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <button onClick={() => { if (calendarMonth === 0) { setCalendarYear(calendarYear - 1); setCalendarMonth(11); } else setCalendarMonth(calendarMonth - 1); }} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"><ChevronDown className="rotate-90 text-gray-400" /></button>
                          <span className="text-xl font-black text-gray-900">{calendarYear}년 {monthNames[calendarMonth]}</span>
                          <button onClick={() => { if (calendarMonth === 11) { setCalendarYear(calendarYear + 1); setCalendarMonth(0); } else setCalendarMonth(calendarMonth + 1); }} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"><ChevronDown className="-rotate-90 text-gray-400" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black text-gray-300">
                          {['일','월','화','수','목','금','토'].map(d => <div key={d} className="py-2">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {days.map((day, idx) => {
                            if (day === null) return <div key={`empty-${idx}`} />;
                            const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = data.deadline === dateStr;
                            const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0]);
                            return (
                              <button
                                key={day}
                                onClick={() => { if (!isPast) { updateData({ deadline: dateStr }); setShowCalendar(false); } }}
                                disabled={isPast}
                                className={`h-12 rounded-xl text-base font-bold transition-all
                                  ${isSelected 
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                                    : isPast ? "text-gray-200" : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"}`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                checked={data.deadlineFlexible || false}
                onChange={(e) => updateData({ deadlineFlexible: e.target.checked })}
                className="w-6 h-6 rounded-lg border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700 font-bold">일정은 어느 정도 유동적일 수 있습니다.</span>
            </label>

            <MemoInput
              publicValue={data.scheduleMemo || ""}
              privateValue={data.schedulePrivateMemo || ""}
              onPublicChange={(v) => updateData({ scheduleMemo: v })}
              onPrivateChange={(v) => updateData({ schedulePrivateMemo: v })}
            />
          </div>
        </section>

        {/* ========== Q8: 예산 ========== */}
        <section ref={sectionRefs.budget} id="budget" className="scroll-mt-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">생각하시는 예산 범위가 있나요?</h2>
                <p className="text-gray-500 font-medium">예산 규모에 맞춰 현실적인 기능을 제안합니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "under100", label: "100만원 미만" },
                { id: "100-200", label: "100~200만원" },
                { id: "200-300", label: "200~300만원" },
                { id: "300-500", label: "300~500만원" },
                { id: "over500", label: "500만원 이상" },
                { id: "undecided", label: "아직 미정" },
              ].map((opt) => {
                const isSelected = data.budget === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateData({ budget: opt.id, customBudget: "" })}
                    className={`p-5 rounded-2xl border-2 text-center transition-all font-bold
                      ${isSelected 
                        ? "bg-cyan-50 border-cyan-500 text-cyan-900 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={data.customBudget}
              onChange={(e) => updateData({ customBudget: e.target.value, budget: "" })}
              placeholder="직접 말씀하신 예산을 입력하세요..."
              className="input-field h-14 text-base font-bold mb-6"
            />

            <MemoInput
              publicValue={data.budgetMemo}
              privateValue={data.budgetPrivateMemo}
              onPublicChange={(v) => updateData({ budgetMemo: v })}
              onPrivateChange={(v) => updateData({ budgetPrivateMemo: v })}
            />
          </div>
        </section>
      </div>

      {/* 오른쪽: 고정된 패널 */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-6">
          {/* 동기화 버튼 */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`w-full h-20 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl
              ${synced 
                ? "bg-emerald-600 text-white shadow-emerald-200" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-1"
              } disabled:opacity-50`}
          >
            {syncing ? (
              <RefreshCw className="w-7 h-7 animate-spin" />
            ) : synced ? (
              <>
                <Check className="w-7 h-7" />
                동기화 완료
              </>
            ) : (
              <>
                <Send className="w-7 h-7" />
                실시간 동기화
              </>
            )}
          </button>

          {/* 네비게이션 */}
          <div className="bg-white rounded-[24px] p-2 border border-gray-100 shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-gray-50 mb-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Navigation</span>
              <button onClick={resetAll} className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-gray-300" title="초기화">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { key: "sitetype", label: "사이트 유형", icon: "🎯" },
                { key: "plan", label: "기획 상태", icon: "📝" },
                { key: "content", label: "준비 콘텐츠", icon: "🎨" },
                { key: "size", label: "규모/예산", icon: "📏" },
                { key: "features", label: "특수 기능", icon: "⚙️" },
                { key: "reference", label: "참고 사이트", icon: "🌐" },
                { key: "schedule", label: "제작 일정", icon: "📅" },
                { key: "budget", label: "예산 범위", icon: "💰" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all font-bold
                    ${activeSection === item.key 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <StickyNote className="w-10 h-10 text-gray-50" />
            </div>
            <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              진단 요약
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">유형</span>
                <span className="text-sm font-black text-gray-900 truncate max-w-[120px]">
                   {data.customSiteType || (data.siteType ? "선택됨" : "미정")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">규모</span>
                <span className="text-sm font-black text-gray-900">{data.pageCount}P / {data.sectionCount}S</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">예산</span>
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{estimatedPrice()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyToClipboard}
                className="h-12 bg-gray-900 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "복사됨" : "내용 복사"}
              </button>
              <button
                onClick={() => window.open('/calculator', '_blank')}
                className="h-12 bg-gray-100 text-gray-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all border border-gray-200"
              >
                <Zap className="w-4 h-4" /> 계산기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 메모 입력 컴포넌트
// ============================================

const MemoInput = memo(function MemoInput({
  label,
  publicValue,
  privateValue,
  onPublicChange,
  onPrivateChange,
  publicPlaceholder = "고객에게 보여줄 안내 사항을 적어주세요...",
  privatePlaceholder = "내부에서만 참고할 상담 노트를 적어주세요...",
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
    <div className="space-y-4 mt-8">
      {label && <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{label}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black text-indigo-700">고객 공개 메모</span>
          </div>
          <textarea
            value={publicValue}
            onChange={(e) => onPublicChange(e.target.value)}
            placeholder={publicPlaceholder}
            className="w-full bg-white border border-indigo-100 rounded-xl p-4 text-sm font-medium text-gray-700 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
          />
        </div>
        <div className="bg-amber-50/30 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <EyeOff className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black text-amber-700">상담사 비공개 노트</span>
          </div>
          <textarea
            value={privateValue}
            onChange={(e) => onPrivateChange(e.target.value)}
            placeholder={privatePlaceholder}
            className="w-full bg-white border border-amber-100 rounded-xl p-4 text-sm font-medium text-gray-700 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
});
