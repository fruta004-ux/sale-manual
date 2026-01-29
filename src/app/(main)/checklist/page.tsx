"use client";

import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Zap,
  Palette,
  FileText,
  Lightbulb,
  DollarSign,
  Clock,
  Building2,
  ShoppingCart,
  CalendarCheck,
  Image,
  Layers,
  StickyNote,
  ChevronDown,
  AlertTriangle,
  Phone,
  HelpCircle,
  Target,
  TrendingDown,
  Gift,
  PlusCircle,
  Minus,
  Plus
} from "lucide-react";

// ============================================
// 데이터 타입
// ============================================

interface StepData {
  siteType: string;
  customSiteType: string;
  hasPlan: string;
  menuStructure: string;
  hasContent: string;
  contentNotes: string;
  pageCount: number;
  sectionCount: number;
  budget: string;
  customBudget: string;
  additionalNotes: string;
}

const initialData: StepData = {
  siteType: "",
  customSiteType: "",
  hasPlan: "",
  menuStructure: "",
  hasContent: "",
  contentNotes: "",
  pageCount: 5,
  sectionCount: 15,
  budget: "",
  customBudget: "",
  additionalNotes: "",
};

// ============================================
// 사이트 유형별 기본 메뉴 구조
// ============================================

const defaultMenuStructures: Record<string, string[]> = {
  company: ["홈", "회사소개", "서비스/제품", "포트폴리오", "문의하기"],
  shopping: ["홈", "상품 카테고리", "베스트", "이벤트", "고객센터", "마이페이지"],
  reservation: ["홈", "서비스 소개", "예약하기", "이용후기", "오시는 길", "문의"],
  portfolio: ["홈", "About", "Works", "Contact"],
  landing: ["(단일 페이지 - 섹션으로 구성)"],
  blog: ["홈", "카테고리별 글", "About", "Contact"],
};

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

export default function ChecklistPage() {
  const [data, setData] = useState<StepData>(initialData);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("start");
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});
  
  const sectionRefs = {
    start: useRef<HTMLDivElement>(null),
    sitetype: useRef<HTMLDivElement>(null),
    plan: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    section: useRef<HTMLDivElement>(null),
    budget: useRef<HTMLDivElement>(null),
    closing: useRef<HTMLDivElement>(null),
  };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateData = (updates: Partial<StepData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetAll = () => {
    if (confirm("모든 내용을 초기화할까요?")) {
      setData(initialData);
      setExpandedTips({});
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

  // 예상 견적 계산
  const estimatedPrice = () => {
    const pageScore = data.pageCount;
    const sectionScore = Math.ceil(data.sectionCount / 4);
    const total = Math.max(pageScore, sectionScore);
    
    if (total <= 5) return "100~150만원";
    if (total <= 8) return "150~200만원";
    if (total <= 12) return "200~300만원";
    return "300만원 이상";
  };

  // 요약 생성
  const generateSummary = () => {
    let summary = "📋 고객 상담 내용 정리\n━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    if (data.siteType || data.customSiteType) {
      const typeLabel = data.customSiteType || 
        (data.siteType === "company" ? "회사/브랜드 소개" :
         data.siteType === "shopping" ? "쇼핑몰" :
         data.siteType === "reservation" ? "예약 사이트" :
         data.siteType === "portfolio" ? "포트폴리오" :
         data.siteType === "landing" ? "랜딩페이지" :
         data.siteType === "blog" ? "블로그/매거진" : data.siteType);
      summary += `【사이트 유형】 ${typeLabel}\n\n`;
    }
    
    if (data.hasPlan) {
      const planText = data.hasPlan === "yes" ? "기획 완료" : data.hasPlan === "partial" ? "부분 기획" : "기획 필요";
      summary += `【기획 상태】 ${planText}\n`;
      if (data.menuStructure) summary += `  메뉴: ${data.menuStructure}\n`;
      summary += "\n";
    }
    
    if (data.hasContent) {
      const contentText = data.hasContent === "yes" ? "콘텐츠 있음" : data.hasContent === "partial" ? "일부 있음" : "콘텐츠 필요";
      summary += `【콘텐츠】 ${contentText}\n`;
      if (data.contentNotes) summary += `  메모: ${data.contentNotes}\n`;
      summary += "\n";
    }
    
    summary += `【규모】\n`;
    summary += `  • 페이지: 약 ${data.pageCount}페이지\n`;
    summary += `  • 섹션: 약 ${data.sectionCount}섹션\n`;
    summary += `  • 예상 견적: ${estimatedPrice()}\n\n`;
    
    if (data.budget || data.customBudget) {
      const budgetLabel = data.customBudget || 
        (data.budget === "under100" ? "100만원 미만" :
         data.budget === "100-200" ? "100~200만원" :
         data.budget === "200-300" ? "200~300만원" :
         data.budget === "300-500" ? "300~500만원" :
         data.budget === "over500" ? "500만원 이상" : "미정");
      summary += `【고객 예산】 ${budgetLabel}\n\n`;
    }
    
    if (data.additionalNotes) {
      summary += `【추가 메모】\n${data.additionalNotes}\n\n`;
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

  const SituationTip = ({ 
    id, 
    situation, 
    response, 
    color = "#4f46e5",
    icon: IconComponent = Lightbulb 
  }: any) => {
    const isExpanded = expandedTips[id] || false;
    
    return (
      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm mb-2">
        <button
          type="button"
          onClick={() => toggleTip(id)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-all"
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <IconComponent className="w-4 h-4" style={{ color }} />
          </div>
          <span className="flex-1 text-sm font-black text-gray-700">{situation}</span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 animate-fade-in-up">
            <div className="bg-gray-50 rounded-xl p-4 border-l-4" style={{ borderColor: color }}>
              <ul className="space-y-2">
                {response.map((r: any, i: number) => (
                  <li key={i} className="text-sm text-gray-600 font-bold leading-relaxed flex items-start gap-2">
                    <span className="text-gray-300 mt-1">●</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6 max-w-6xl mx-auto py-4">
      {/* 왼쪽: 스크롤되는 스크립트 영역 */}
      <div className="flex-1 space-y-10 pb-32">
        {/* 헤더 */}
        <div className="text-center py-12 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">영업 상담 가이드</h1>
          <p className="text-gray-500 font-medium">고객의 니즈를 정확히 파악하고 신뢰를 확보하세요.</p>
        </div>

        {/* 핵심 원칙 배너 */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-black text-amber-900 mb-1">핵심 유의사항</h3>
            <ul className="text-sm font-bold text-amber-800/70 space-y-1">
              <li>• 견적 확답 금지 (기획 확정 후 안내)</li>
              <li>• 고객 예산 먼저 파악</li>
              <li>• 제작 범위에 따른 인건비 개념 설명</li>
            </ul>
          </div>
        </div>

        {/* ========== STEP 0: 첫 응대 ========== */}
        <section ref={sectionRefs.start} id="start" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">📞</span> 첫 인사 및 응대
            </h2>
            
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">기본 멘트</p>
              <p className="text-indigo-900 font-black text-lg">"안녕하세요! 무엇을 도와드릴까요? 제작하시려는 사이트에 대해 몇 가지만 여쭤봐도 될까요?"</p>
            </div>

            <div className="space-y-2">
              <SituationTip
                id="price-first"
                situation="🚨 대뜸 '얼마예요?' 라고 물어볼 때"
                icon={DollarSign}
                color="#ef4444"
                response={[
                  '"네, 견적 문의 주셨군요! 정확한 안내를 위해 몇 가지만 여쭤볼게요."',
                  '"홈페이지는 전문가분들의 인건비로 제작되다 보니, 어떤 사이트를 만드시느냐에 따라 금액이 달라져요."',
                  '"간단히 어떤 사이트인지만 알려주시면 대략적인 범위 말씀드릴 수 있어요!"'
                ]}
              />
              
              <SituationTip
                id="just-price"
                situation="😤 '그냥 대충 얼마인지만 알려주세요'"
                icon={AlertTriangle}
                color="#f59e0b"
                response={[
                  '"물론이죠! 일반적인 회사소개 사이트 기준으로 보통 150~200만원 정도 예요."',
                  '"다만 페이지 수나 기능에 따라 달라지거든요. 혹시 어떤 사이트 생각하고 계세요?"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== STEP 1: 사이트 유형 ========== */}
        <section ref={sectionRefs.sitetype} id="sitetype" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Target className="w-7 h-7 text-indigo-600" /> 사이트 유형 파악
            </h2>
            
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
              <p className="text-indigo-900 font-black text-lg">"어떤 사이트를 만들고 싶으세요? 회사 소개용인지, 쇼핑몰인지, 예약 사이트인지요?"</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
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
                    onClick={() => updateData({ siteType: option.id })}
                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4
                      ${isSelected 
                        ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                    <span className={`text-lg font-black ${isSelected ? "text-indigo-900" : "text-gray-600"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={data.customSiteType}
              onChange={(e) => updateData({ customSiteType: e.target.value, siteType: "" })}
              placeholder="기타 유형을 직접 입력하세요..."
              className="input-field h-14 font-black text-lg mb-6"
            />

            <SituationTip
              id="vague-site"
              situation="🤷 '그냥 홈페이지요' 라고 애매하게 답할 때"
              icon={HelpCircle}
              color="#4f46e5"
              response={[
                '"혹시 거기서 물건을 파시거나, 예약을 받으실 건가요?"',
                '"아니면 회사나 서비스를 소개하는 용도인가요?"'
              ]}
            />
          </div>
        </section>

        {/* ========== STEP 2: 기획 상태 ========== */}
        <section ref={sectionRefs.plan} id="plan" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-7 h-7 text-indigo-600" /> 기획 상태 확인
            </h2>
            
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
              <p className="text-indigo-900 font-black text-lg">"혹시 기획이 되어 있으신가요? 아니면 기획부터 도움이 필요하신가요?"</p>
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
                        ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <p className={`text-lg font-black ${isSelected ? "text-indigo-900" : "text-gray-800"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* 기획 완료 시 */}
            {data.hasPlan === "yes" && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <p className="text-sm font-black text-indigo-600 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 확인된 메뉴 구조
                </p>
                <textarea
                  value={data.menuStructure}
                  onChange={(e) => updateData({ menuStructure: e.target.value })}
                  placeholder="예: 홈, 회사소개, 서비스, 포트폴리오, 문의하기..."
                  className="input-field min-h-[100px] font-bold text-base bg-white"
                />
              </div>
            )}

            {/* 기획 필요 시 */}
            {(data.hasPlan === "no" || data.hasPlan === "partial") && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <p className="text-sm font-black text-amber-600 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> 추천 메뉴 구조
                </p>
                
                {data.siteType && defaultMenuStructures[data.siteType] && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {defaultMenuStructures[data.siteType].map((menu, i) => (
                      <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 shadow-sm">
                        {menu}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-sm font-bold text-gray-400 italic">"이 중에서 필요 없는 거 빼거나, 추가하고 싶은 거 있으세요?"</p>
              </div>
            )}

            <SituationTip
              id="no-idea"
              situation="😵 '뭘 넣어야 할지 모르겠어요'"
              icon={HelpCircle}
              color="#4f46e5"
              response={[
                '"괜찮아요! 저희가 같이 정리해드릴게요."',
                '"일단 경쟁사나 비슷한 업종 사이트 보신 적 있으세요? 참고할 만한 사이트 있으면 알려주세요!"'
              ]}
            />
          </div>
        </section>

        {/* ========== STEP 3: 콘텐츠 ========== */}
        <section ref={sectionRefs.content} id="content" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Palette className="w-7 h-7 text-indigo-600" /> 콘텐츠 준비 상태
            </h2>
            
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
              <p className="text-indigo-900 font-black text-lg">"각 메뉴에 들어갈 내용은 준비되어 있으신가요? 텍스트나 이미지 같은 거요."</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "yes", label: "준비 완료", desc: "텍스트/사진 있음" },
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
                        ? "bg-indigo-50 border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <p className={`text-lg font-black ${isSelected ? "text-indigo-900" : "text-gray-800"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {(data.hasContent === "no" || data.hasContent === "partial") && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-sm font-black text-indigo-600 mb-3 flex items-center gap-2">
                  <StickyNote className="w-4 h-4" /> 콘텐츠 관련 메모
                </p>
                <textarea
                  value={data.contentNotes}
                  onChange={(e) => updateData({ contentNotes: e.target.value })}
                  placeholder="예: 회사소개 - 연혁, 비전 / 서비스 - 3가지 설명 등..."
                  className="input-field min-h-[100px] font-bold text-base bg-white"
                />
              </div>
            )}
          </div>
        </section>

        {/* ========== STEP 4: 섹션 개념 설명 ========== */}
        <section ref={sectionRefs.section} id="section" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Layers className="w-7 h-7 text-indigo-600" /> 견적 산정 기준 설명
            </h2>
            
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">중요 설명 멘트</p>
              <div className="text-indigo-900 font-black text-lg space-y-3 leading-relaxed">
                <p>"홈페이지 견적은 <span className="text-indigo-600 underline underline-offset-4 decoration-2">페이지 수</span>와 <span className="text-indigo-600 underline underline-offset-4 decoration-2">섹션 수</span>로 결정돼요."</p>
                <p>"같은 1페이지라도 섹션이 3개인 것과 30개인 것은 작업량이 완전히 다르거든요."</p>
                <p>"대략적인 구성만 정해지면 정확한 견적 범위를 말씀드릴 수 있습니다!"</p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-sm font-black text-gray-400 mb-4 uppercase tracking-widest">📏 섹션 길이 참고 (작업량 기준)</p>
              <div className="space-y-4">
                {sectionSamples.map((sample, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-black text-gray-600">{sample.name}</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-xl overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 flex items-center justify-end pr-3 transition-all duration-1000"
                        style={{ width: `${Math.min(sample.sections * 5, 100)}%` }}
                      >
                        <span className="text-xs text-white font-black">{sample.sections}S</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100 mb-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Estimated Pages</label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                    <button onClick={() => updateData({ pageCount: Math.max(1, data.pageCount - 1) })} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Minus className="w-6 h-6"/></button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{data.pageCount}</span>
                    <button onClick={() => updateData({ pageCount: data.pageCount + 1 })} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Plus className="w-6 h-6"/></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Total Sections</label>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                    <button onClick={() => updateData({ sectionCount: Math.max(1, data.sectionCount - 1) })} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Minus className="w-6 h-6"/></button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{data.sectionCount}</span>
                    <button onClick={() => updateData({ sectionCount: data.sectionCount + 1 })} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Plus className="w-6 h-6"/></button>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-2xl p-6 text-center shadow-xl shadow-indigo-100">
                <p className="text-indigo-100 text-sm font-bold mb-1">작업 규모에 따른 예상 견적</p>
                <p className="text-3xl font-black text-white">{estimatedPrice()}</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
              <p className="text-emerald-900 font-black text-lg">"말씀하신 정도라면 평균적으로 <span className="text-emerald-600 underline decoration-2">{estimatedPrice()}</span> 내외로 제작 가능합니다!"</p>
            </div>
          </div>
        </section>

        {/* ========== STEP 5: 예산 & 대응 ========== */}
        <section ref={sectionRefs.budget} id="budget" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-indigo-600" /> 예산 파악 및 반응 대응
            </h2>
            
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-6">
              <p className="text-indigo-900 font-black text-lg">"혹시 생각하시는 예산 범위가 있으신가요? 최대한 예산 내에서 최적의 구성을 맞춰드리고 싶어서요!"</p>
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
                    className={`p-5 rounded-2xl border-2 transition-all font-black
                      ${isSelected 
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200 text-gray-500"
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
              placeholder="별도의 예산을 직접 입력하세요..."
              className="input-field h-14 font-black text-lg mb-8"
            />

            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">🎯 상황별 대응 시나리오</p>
              
              <SituationTip
                id="too-expensive"
                situation="😰 '비싸네요...' 반응이 좋지 않을 때"
                icon={TrendingDown}
                color="#ef4444"
                response={[
                  '"현재 제가 드릴 수 있는 담당자 특별 할인 20만원을 바로 적용해드릴 수 있어요!"',
                  '"정해진 예산이 있으시면 말씀해주세요. 그 안에서 가장 효율적인 기능들로만 다시 구성해드릴게요."',
                  '"기능을 단계별로 나눠서 먼저 꼭 필요한 것만 오픈하고 나중에 확장하는 방법도 있습니다."'
                ]}
              />
              
              <SituationTip
                id="discount"
                situation="🎁 할인 카드로 설득하기"
                icon={Gift}
                color="#10b981"
                response={[
                  '"지금 상담해주신 분들께 담당자 권한으로 20만원 즉시 할인이 가능합니다."',
                  '"이번 달 프로모션 기간이라 10% 추가 할인을 받으실 수 있는 좋은 기회예요."',
                  '"계약금 선결제 시 추가 혜택을 드릴 수 있습니다!"'
                ]}
              />

              <SituationTip
                id="think-about"
                situation="🤔 '좀 더 생각해볼게요' 라고 할 때"
                icon={Clock}
                color="#f59e0b"
                response={[
                  '"네, 큰 결정이시니 충분히 고민해보세요! 궁금한 게 생기면 언제든 편하게 연락 주시고요."',
                  '"참고하실 수 있도록 오늘 상담 내용을 정리해서 견적서와 함께 메일로 보내드릴까요?"',
                  '"다른 업체와 비교해보셔도 좋습니다. 저희가 품질과 사후관리 면에서 가장 자신 있거든요 😊"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== STEP 6: 마무리 ========== */}
        <section ref={sectionRefs.closing} id="closing" className="scroll-mt-8">
          <div className="card p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">✅</span> 상담 마무리 및 후속 조치
            </h2>
            
            <div className="bg-indigo-600 p-6 rounded-[24px] shadow-xl shadow-indigo-100 mb-8">
              <p className="text-indigo-100 font-black text-lg">"오늘 상담 감사합니다! 말씀하신 내용 꼼꼼히 정리해서 24시간 내에 견적서 보내드릴게요. 😊"</p>
            </div>

            <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100 mb-8">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Next Steps for You</h3>
              <div className="space-y-4">
                {[
                  "상담 내용을 복사해서 내부 채널(슬랙/노션)에 즉시 기록",
                  "견적 계산기를 사용하여 더 세밀한 최종 견적 산출",
                  "상담 종료 후 24시간 내에 공식 견적서 발송"
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-black text-indigo-600">{i + 1}</div>
                    <span className="text-gray-700 font-black">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">📝 추가 상담 메모</p>
              <textarea
                value={data.additionalNotes}
                onChange={(e) => updateData({ additionalNotes: e.target.value })}
                placeholder="고객의 특이사항이나 기억해야 할 내용을 적어주세요..."
                className="input-field min-h-[120px] font-bold text-base"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 오른쪽: 고정된 네비게이션 및 진단 결과 */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-6">
          {/* 단계 네비게이션 */}
          <div className="bg-white rounded-[24px] p-2 border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultation Flow</span>
              <button onClick={resetAll} className="p-2 hover:bg-rose-50 text-gray-300 hover:text-rose-600 rounded-xl transition-all" title="초기화">
                <RotateCcw className="w-5 h-5"/>
              </button>
            </div>
            <div className="space-y-1">
              {[
                { key: "start", label: "첫 인사 및 응대", icon: "📞" },
                { key: "sitetype", label: "사이트 유형 파악", icon: "🎯" },
                { key: "plan", label: "기획 상태 확인", icon: "📝" },
                { key: "content", label: "콘텐츠 준비 상태", icon: "🎨" },
                { key: "section", label: "규모 및 견적 설명", icon: "📏" },
                { key: "budget", label: "예산 및 반응 대응", icon: "💰" },
                { key: "closing", label: "상담 마무리", icon: "✅" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl font-black text-sm transition-all
                    ${activeSection === item.key 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 진단 결과 카드 */}
          <div className="card p-8 bg-gray-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <StickyNote className="w-20 h-20" />
            </div>
            <h3 className="font-black text-xl mb-8 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              실시간 진단
            </h3>
            
            <div className="space-y-6 mb-10">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Quote</p>
                <p className="text-3xl font-black text-indigo-400 tracking-tighter">{estimatedPrice()}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-black">규모</span>
                  <span className="text-white font-black">{data.pageCount}P / {data.sectionCount}S</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-black">유형</span>
                  <span className="text-white font-black truncate max-w-[120px]">{data.customSiteType || data.siteType || "미정"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={copyToClipboard} 
                className="w-full h-14 bg-white text-gray-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-lg"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />} 
                {copied ? "Copied!" : "상담 내용 복사"}
              </button>
              <button 
                onClick={() => window.open('/calculator', '_blank')}
                className="w-full h-14 bg-gray-800 text-gray-400 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-700 hover:text-white transition-all border border-white/5"
              >
                <Zap className="w-5 h-5 text-indigo-400" /> 상세 계산기 열기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
