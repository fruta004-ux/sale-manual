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
    setData(initialData);
    setExpandedTips({});
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

  // 상황별 대응 팁 컴포넌트 - 버그 수정
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

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">
      {/* 왼쪽: 스크롤되는 스크립트 영역 */}
      <div className="flex-1 space-y-6 pb-32">
        {/* 헤더 */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#22d3ee] mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">영업 상담 스크립트</h1>
          <p className="text-[#71717a]">스크롤하면서 상담하고, 오른쪽에 메모하세요</p>
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
                <li>• <strong className="text-white">인건비 개념</strong> - 개발은 전문가 인건비, 양에 따라 비용이 달라짐</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========== STEP 0: 첫 응대 ========== */}
        <section ref={sectionRefs.start} id="start" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📞</span>
              <div>
                <h2 className="text-xl font-bold">전화 받자마자</h2>
                <p className="text-sm text-[#71717a]">첫 인상이 중요해요</p>
              </div>
            </div>
            
            <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl p-4 mb-4">
              <p className="text-sm text-[#a5b4fc] mb-1">💬 기본 인사</p>
              <p className="text-[#e8e8ed]">"안녕하세요! 홈페이지 제작 상담 도와드릴게요. 편하게 말씀해 주세요 😊"</p>
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
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">어떤 사이트를 만들고 싶으세요?</h2>
                <p className="text-sm text-[#71717a]">유형 파악이 첫 번째!</p>
              </div>
            </div>
            
            <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#6ee7b7] mb-1">💬 이렇게 물어보세요</p>
              <p className="text-[#e8e8ed]">"어떤 사이트를 만들고 싶으세요? 회사 소개용인지, 쇼핑몰인지, 예약 사이트인지요?"</p>
            </div>

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
                    onClick={() => updateData({ siteType: option.id })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3
                      ${isSelected 
                        ? "bg-[#10b981]/10 border-[#10b981]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-[#10b981]" : "text-[#71717a]"}`} />
                    <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-[#a1a1aa]"}`}>
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
        </section>

        {/* ========== STEP 2: 기획 상태 ========== */}
        <section ref={sectionRefs.plan} id="plan" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">기획이 되어 있으신가요?</h2>
                <p className="text-sm text-[#71717a]">메뉴 구조 파악</p>
              </div>
            </div>
            
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#fbbf24] mb-1">💬 이렇게 물어보세요</p>
              <p className="text-[#e8e8ed]">"혹시 기획이 되어 있으신가요? 아니면 기획부터 도움이 필요하신가요?"</p>
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
                    className={`flex-1 p-3 rounded-xl border transition-all text-center
                      ${isSelected 
                        ? "bg-[#f59e0b]/10 border-[#f59e0b]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[#71717a] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* 기획 완료 시 */}
            {data.hasPlan === "yes" && (
              <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#6ee7b7] mb-2">✅ 메뉴 구조를 알려달라고 하세요</p>
                <p className="text-xs text-[#71717a] mb-3">"그러면 메뉴 구조 알려주시겠어요? 예를 들어 홈, 회사소개, 서비스, 문의하기 이런 식으로요"</p>
                <textarea
                  value={data.menuStructure}
                  onChange={(e) => updateData({ menuStructure: e.target.value })}
                  placeholder="고객이 알려준 메뉴 구조 메모..."
                  className="input-field text-sm min-h-[60px] resize-none"
                />
              </div>
            )}

            {/* 기획 필요 시 */}
            {(data.hasPlan === "no" || data.hasPlan === "partial") && (
              <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#a5b4fc] mb-2">💡 기본 메뉴 구조 안내해주세요</p>
                <p className="text-xs text-[#71717a] mb-3">"괜찮아요! 보통 {data.siteType === "company" ? "회사소개" : data.siteType || "이런"} 사이트는 이런 메뉴로 구성돼요:"</p>
                
                {data.siteType && defaultMenuStructures[data.siteType] && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {defaultMenuStructures[data.siteType].map((menu, i) => (
                      <span key={i} className="px-3 py-1 bg-[#27272a] rounded-full text-sm text-[#a1a1aa]">
                        {menu}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-[#71717a]">"이 중에서 필요 없는 거 빼거나, 추가하고 싶은 거 있으세요?"</p>
              </div>
            )}

            <SituationTip
              id="no-idea"
              situation="😵 '뭘 넣어야 할지 모르겠어요'"
              icon={HelpCircle}
              color="#22d3ee"
              response={[
                '"괜찮아요! 저희가 같이 정리해드릴게요."',
                '"일단 경쟁사나 비슷한 업종 사이트 보신 적 있으세요? 참고할 만한 사이트 있으면 알려주세요!"'
              ]}
            />
          </div>
        </section>

        {/* ========== STEP 3: 콘텐츠 ========== */}
        <section ref={sectionRefs.content} id="content" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ec4899]/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#ec4899]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">콘텐츠(내용)는 있으신가요?</h2>
                <p className="text-sm text-[#71717a]">각 페이지에 들어갈 내용</p>
              </div>
            </div>
            
            <div className="bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#f472b6] mb-1">💬 이렇게 물어보세요</p>
              <p className="text-[#e8e8ed]">"각 메뉴에 들어갈 내용은 준비되어 있으신가요? 텍스트나 이미지 같은 거요."</p>
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
                    className={`flex-1 p-3 rounded-xl border transition-all text-center
                      ${isSelected 
                        ? "bg-[#ec4899]/10 border-[#ec4899]" 
                        : "bg-[#27272a]/30 border-[#2a2a32] hover:border-[#3a3a42]"
                      }`}
                  >
                    <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#a1a1aa]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[#71717a] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {(data.hasContent === "no" || data.hasContent === "partial") && (
              <div className="bg-[#1a1a1f] rounded-xl p-4">
                <p className="text-sm text-[#f472b6] mb-2">💡 대략적인 내용이라도 파악하세요</p>
                <p className="text-xs text-[#71717a] mb-3">"그러면 대충 각 페이지에 어떤 내용이 들어갈지 말씀해주실 수 있을까요?"</p>
                <textarea
                  value={data.contentNotes}
                  onChange={(e) => updateData({ contentNotes: e.target.value })}
                  placeholder="예: 회사소개 - 연혁, 비전, 팀 소개 / 서비스 - 3가지 서비스 설명..."
                  className="input-field text-sm min-h-[60px] resize-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* ========== STEP 4: 섹션 개념 설명 ========== */}
        <section ref={sectionRefs.section} id="section" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1]/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#6366f1]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">페이지 & 섹션 개념 설명</h2>
                <p className="text-sm text-[#71717a]">견적의 핵심! 꼭 설명해주세요</p>
              </div>
            </div>
            
            {/* 섹션 개념 설명 */}
            <div className="bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#a5b4fc] mb-2">💬 이렇게 설명해주세요</p>
              <div className="text-[#e8e8ed] text-sm space-y-2">
                <p>"잠깐 설명드릴게요. 홈페이지 견적은 <strong className="text-white">페이지 수</strong>랑 <strong className="text-white">섹션 수</strong>로 계산돼요."</p>
                <p>"같은 1페이지라도 섹션이 3개인 거랑 30개인 거랑 작업량이 완전히 다르거든요."</p>
                <p>"그래서 대략적인 구성만 알면 견적 범위를 말씀드릴 수 있어요!"</p>
              </div>
            </div>

            {/* 섹션 샘플 시각화 */}
            <div className="mb-5">
              <p className="text-sm text-[#71717a] mb-3">📏 섹션 길이 예시 (참고용)</p>
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

            {/* 페이지/섹션 입력 */}
            <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
              <p className="text-sm text-[#a5b4fc] mb-3">📝 대략적인 규모 입력</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#71717a] mb-2 block">예상 페이지 수</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateData({ pageCount: Math.max(1, data.pageCount - 1) })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Minus className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <span className="flex-1 text-center text-xl font-bold text-white">{data.pageCount}</span>
                    <button
                      onClick={() => updateData({ pageCount: data.pageCount + 1 })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Plus className="w-4 h-4 text-[#71717a]" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-[#71717a] mb-2 block">예상 총 섹션 수</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateData({ sectionCount: Math.max(1, data.sectionCount - 1) })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Minus className="w-4 h-4 text-[#71717a]" />
                    </button>
                    <span className="flex-1 text-center text-xl font-bold text-white">{data.sectionCount}</span>
                    <button
                      onClick={() => updateData({ sectionCount: data.sectionCount + 1 })}
                      className="p-2 rounded-lg bg-[#27272a] hover:bg-[#3a3a42]"
                    >
                      <Plus className="w-4 h-4 text-[#71717a]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#27272a] rounded-lg">
                <p className="text-sm text-[#71717a]">예상 견적 범위</p>
                <p className="text-xl font-bold text-[#22d3ee]">{estimatedPrice()}</p>
              </div>
            </div>

            <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4">
              <p className="text-sm text-[#6ee7b7] mb-1">💬 견적 안내 멘트</p>
              <p className="text-[#e8e8ed]">"말씀하신 정도라면 평균적으로 <strong className="text-white">{estimatedPrice()}</strong> 정도 예요."</p>
              <p className="text-xs text-[#71717a] mt-2">* 조금 틀려도 괜찮아요. 대략적인 범위를 안내하는 거예요!</p>
            </div>
          </div>
        </section>

        {/* ========== STEP 5: 예산 & 클로징 ========== */}
        <section ref={sectionRefs.budget} id="budget" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#22d3ee]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">예산 확인 & 반응 대응</h2>
                <p className="text-sm text-[#71717a]">고객 반응에 따라 대응하세요</p>
              </div>
            </div>
            
            <div className="bg-[#22d3ee]/10 border border-[#22d3ee]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#67e8f9] mb-1">💬 예산 물어보기</p>
              <p className="text-[#e8e8ed]">"혹시 생각하시는 예산 범위가 있으신가요? 웬만하면 맞춰드리고 싶어서요!"</p>
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
                    className={`p-2 rounded-xl border text-center transition-all
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
              className="input-field text-sm py-2 mb-5"
            />

            {/* 상황별 대응 */}
            <p className="text-sm text-[#71717a] mb-3">🎯 상황별 대응</p>
            <div className="space-y-2">
              <SituationTip
                id="too-expensive"
                situation="😰 '비싸네요...' 반응이 안 좋을 때"
                icon={TrendingDown}
                color="#ef4444"
                response={[
                  '"현재 제가 드릴 수 있는 담당자 할인이 20만원 있어요. 이 정도면 어떠세요?"',
                  '"혹시 예산이 정해져 있으시면 말씀해주세요. 그 안에서 최대한 맞춰드릴게요!"',
                  '"기능을 좀 줄이면 비용도 낮출 수 있어요. 꼭 필요한 것만 먼저 해볼까요?"'
                ]}
              />
              
              <SituationTip
                id="discount"
                situation="🎁 할인 카드 사용하기"
                icon={Gift}
                color="#10b981"
                response={[
                  '"지금 상담해주신 분들께 담당자 할인 20만원 적용해드리고 있어요!"',
                  '"이번 달 프로모션으로 10% 할인 가능해요."',
                  '"계약금 선결제 시 추가 할인 가능합니다!"'
                ]}
              />

              <SituationTip
                id="think-about"
                situation="🤔 '생각해볼게요' 할 때"
                icon={Clock}
                color="#f59e0b"
                response={[
                  '"네, 천천히 생각해보세요! 궁금한 거 있으시면 편하게 연락주세요."',
                  '"혹시 카톡이나 메일로 견적서 보내드릴까요? 참고하시기 편하실 거예요."',
                  '"다른 업체랑 비교해보셔도 좋아요. 저희가 제일 합리적일 거예요 😊"'
                ]}
              />
            </div>
          </div>
        </section>

        {/* ========== STEP 6: 마무리 ========== */}
        <section ref={sectionRefs.closing} id="closing" className="scroll-mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✅</span>
              <div>
                <h2 className="text-xl font-bold">상담 마무리</h2>
                <p className="text-sm text-[#71717a]">다음 단계 안내</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#22d3ee]/10 border border-[#6366f1]/30 rounded-xl p-4 mb-5">
              <p className="text-sm text-[#a5b4fc] mb-1">💬 마무리 멘트</p>
              <p className="text-[#e8e8ed]">"네, 오늘 상담 감사합니다! 말씀하신 내용 정리해서 견적서 보내드릴게요. 😊"</p>
            </div>

            <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-white mb-3">📋 상담 후 할 일</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-xs text-[#6366f1]">1</div>
                  <span>상담 내용 복사해서 노션/슬랙에 기록</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-xs text-[#6366f1]">2</div>
                  <span>견적 계산기로 정확한 견적 산출</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-xs text-[#6366f1]">3</div>
                  <span>24시간 내 견적서 발송</span>
                </div>
              </div>
            </div>

            {/* 추가 메모 */}
            <div>
              <p className="text-sm text-[#71717a] mb-2">📝 추가 메모</p>
              <textarea
                value={data.additionalNotes}
                onChange={(e) => updateData({ additionalNotes: e.target.value })}
                placeholder="기타 메모할 내용..."
                className="input-field text-sm min-h-[80px] resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 오른쪽: 고정된 메모장 */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-4">
          {/* 네비게이션 */}
          <div className="card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#71717a]">진행 상황</span>
              <button onClick={resetAll} className="p-1 rounded hover:bg-[#27272a]" title="초기화">
                <RotateCcw className="w-4 h-4 text-[#71717a]" />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { key: "start", label: "첫 응대", icon: "📞" },
                { key: "sitetype", label: "사이트 유형", icon: "🎯" },
                { key: "plan", label: "기획 상태", icon: "📝" },
                { key: "content", label: "콘텐츠", icon: "🎨" },
                { key: "section", label: "페이지/섹션", icon: "📏" },
                { key: "budget", label: "예산/대응", icon: "💰" },
                { key: "closing", label: "마무리", icon: "✅" },
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

          {/* 메모장 */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote className="w-5 h-5 text-[#fbbf24]" />
              <span className="font-semibold">상담 메모</span>
            </div>
            
            {/* 선택된 항목 요약 */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto text-sm">
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
              {data.menuStructure && (
                <div className="flex items-start gap-2">
                  <span className="text-[#71717a]">📋</span>
                  <span className="text-[#71717a] text-xs line-clamp-2">{data.menuStructure}</span>
                </div>
              )}
              {data.hasContent && (
                <div className="flex items-start gap-2">
                  <span className="text-[#ec4899]">🎨</span>
                  <span className="text-[#a1a1aa]">
                    {data.hasContent === "yes" ? "콘텐츠 있음" : data.hasContent === "partial" ? "일부 있음" : "콘텐츠 필요"}
                  </span>
                </div>
              )}
              {(data.pageCount !== 5 || data.sectionCount !== 15) && (
                <div className="flex items-start gap-2">
                  <span className="text-[#6366f1]">📏</span>
                  <span className="text-[#a1a1aa]">{data.pageCount}페이지, {data.sectionCount}섹션</span>
                </div>
              )}
              {(data.budget || data.customBudget) && (
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">💰</span>
                  <span className="text-[#a1a1aa]">{data.customBudget || 
                    (data.budget === "under100" ? "100만원 미만" :
                     data.budget === "100-200" ? "100~200만원" :
                     data.budget === "200-300" ? "200~300만원" :
                     data.budget === "300-500" ? "300~500만원" :
                     data.budget === "over500" ? "500만원 이상" :
                     data.budget === "undecided" ? "미정" : data.budget)
                  }</span>
                </div>
              )}
            </div>

            {/* 예상 견적 */}
            <div className="bg-gradient-to-r from-[#6366f1]/20 to-[#22d3ee]/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-[#71717a]">예상 견적</p>
              <p className="text-lg font-bold text-white">{estimatedPrice()}</p>
            </div>

            {/* 액션 버튼 */}
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

          {/* 빠른 링크 */}
          <div className="card p-3">
            <p className="text-xs text-[#71717a] mb-2">빠른 이동</p>
            <div className="flex gap-2">
              <a href="/calculator" className="flex-1 text-center py-2 px-3 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] text-xs text-[#a1a1aa]">
                견적 계산기
              </a>
              <a href="/faq" className="flex-1 text-center py-2 px-3 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] text-xs text-[#a1a1aa]">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
