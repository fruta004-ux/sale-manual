"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Check,
  Info,
  Sparkles,
  DollarSign,
  Layers,
  Code2,
  FileText,
  LayoutGrid,
  AlertTriangle,
  ChevronDown
} from "lucide-react";

// ============================================
// 타입 정의
// ============================================

type DevelopmentMode = "webbuilder" | "custom";
type Difficulty = "basic" | "intermediate" | "advanced" | "discuss";
type Grade = "C" | "B" | "A" | "S";

interface FeatureItem {
  id: string;
  name: string;
  description: string;
  price: number;
  difficulty: Difficulty;
  note?: string;
  tags?: string[];
  requiresDiscussion?: boolean;
  selected: boolean;
  quantity: number;
}

interface GradeInfo {
  grade: Grade;
  minPrice: number;
  maxPrice: number;
  description: string;
  color: string;
}

// ============================================
// 웹빌더(아임웹) 기능 데이터
// ============================================

const webbuilderFeatures: FeatureItem[] = [
  { id: "wb-form", name: "기본 문의폼", description: "문의폼이 10개 이상 또는 디자인이 필요하면 논의 필요", price: 5, difficulty: "basic", tags: ["문의폼"], selected: false, quantity: 1 },
  { id: "wb-page", name: "페이지 당 가격", description: "기본 페이지 추가", price: 10, difficulty: "basic", tags: ["페이지"], selected: false, quantity: 1 },
  { id: "wb-section", name: "4개 섹션당 추가 비용", description: "4개 섹션 = 10만 (페이지 1개 분량)", price: 10, difficulty: "basic", tags: ["페이지", "섹션"], selected: false, quantity: 1 },
  { id: "wb-mobile", name: "모바일 페이지 비용", description: "+ PC 비용의 60%", price: 0, difficulty: "basic", note: "PC 비용의 60%", selected: false, quantity: 1 },
  { id: "wb-reservation", name: "예약 위젯", description: "PG사 연결 및 행정 소요가 많음", price: 20, difficulty: "intermediate", tags: ["예약"], selected: false, quantity: 1 },
  { id: "wb-payment", name: "결제 위젯", description: "PG사 연결 및 행정 소요가 많음", price: 20, difficulty: "intermediate", tags: ["결제"], selected: false, quantity: 1 },
  { id: "wb-member", name: "로그인/회원가입", description: "회원 가입/마이페이지", price: 5, difficulty: "basic", tags: ["회원"], selected: false, quantity: 1 },
  { id: "wb-board", name: "게시판 위젯", description: "게시판", price: 5, difficulty: "basic", tags: ["게시판"], selected: false, quantity: 1 },
  { id: "wb-multilang", name: "다국어 지원", description: "프로젝트 총 비용의 30%, 언어별 메뉴/페이지 세팅", price: 0, difficulty: "intermediate", note: "총 비용의 30%", tags: ["다국어"], selected: false, quantity: 1 },
  { id: "wb-animation", name: "애니메이션 효과", description: "레퍼런스 필수로 필요", price: 50, difficulty: "advanced", tags: ["애니메이션", "인터렉션"], selected: false, quantity: 1 },
  { id: "wb-api", name: "외부 API 연동", description: "협의 필요 (불가할 가능성이 높음)", price: 100, difficulty: "discuss", requiresDiscussion: true, selected: false, quantity: 1 },
  { id: "wb-erp", name: "ERP/회계 양방향 API", description: "아임웹 한계 초과", price: 0, difficulty: "discuss", note: "협의", requiresDiscussion: true, selected: false, quantity: 1 },
  { id: "wb-filter", name: "상품 필터링", description: "아임웹 기능으로 불가, 고급 코드 연계를 통해 가능", price: 100, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "wb-naver-login", name: "네이버 로그인", description: "행정 소요 약 1시간", price: 10, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "wb-kakao-login", name: "카카오 로그인", description: "행정 소요 약 1시간", price: 10, difficulty: "intermediate", selected: false, quantity: 1 },
];

const customFeatures: FeatureItem[] = [
  { id: "ct-landing", name: "랜딩페이지 (1페이지)", description: "전환 최적화 단일 페이지", price: 100, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-basic-5p", name: "기본 홈페이지 (5페이지)", description: "메인, 소개, 서비스, 갤러리, 연락처", price: 200, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-basic-10p", name: "기본 홈페이지 (10페이지)", description: "확장된 페이지 구성", price: 350, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-form", name: "문의 폼", description: "이메일 발송 포함", price: 30, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-reservation", name: "예약/달력 시스템", description: "날짜/시간 선택, 관리자 확인", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-member", name: "회원 기능", description: "가입, 로그인, 마이페이지", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-board", name: "게시판", description: "글쓰기, 댓글, 관리", price: 80, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-blog", name: "블로그/뉴스 CMS", description: "콘텐츠 관리 시스템", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-gallery", name: "포트폴리오/갤러리", description: "이미지 업로드, 카테고리", price: 60, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-search", name: "검색 기능", description: "사이트 내 검색", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-multilang", name: "다국어 지원 (2개 언어)", description: "언어 전환, 콘텐츠 관리", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-shop", name: "쇼핑몰 기본", description: "상품 등록, 장바구니, 주문", price: 400, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-payment", name: "결제 연동 (PG)", description: "카드, 계좌이체, 간편결제", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-coupon", name: "쿠폰/할인 시스템", description: "할인 코드, 자동 적용", price: 60, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-review", name: "상품 리뷰", description: "별점, 사진 리뷰", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-api-basic", name: "외부 API 연동 (기본)", description: "지도, SNS 등 단순 연동", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-api-complex", name: "외부 API 연동 (복잡)", description: "ERP, CRM 등 시스템 연동", price: 250, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-admin", name: "관리자 대시보드", description: "통계, 회원/주문 관리", price: 300, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-chat", name: "실시간 채팅", description: "1:1 문의, 채팅봇", price: 200, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-responsive", name: "반응형 웹", description: "PC/태블릿/모바일 최적화", price: 80, difficulty: "basic", note: "기본 포함 권장", selected: false, quantity: 1 },
  { id: "ct-animation", name: "인터랙티브 애니메이션", description: "스크롤 효과, 모션", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-seo", name: "SEO 최적화", description: "검색엔진 최적화", price: 50, difficulty: "basic", selected: false, quantity: 1 },
];

const gradeInfoMap: Record<Grade, GradeInfo> = {
  C: { grade: "C", minPrice: 50, maxPrice: 150, description: "기본형", color: "#10b981" },
  B: { grade: "B", minPrice: 150, maxPrice: 300, description: "표준형", color: "#4f46e5" },
  A: { grade: "A", minPrice: 300, maxPrice: 500, description: "프리미엄", color: "#f59e0b" },
  S: { grade: "S", minPrice: 500, maxPrice: 1000, description: "전문개발", color: "#ef4444" },
};

const getDifficultyLabel = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "basic": return { label: "기본", color: "#10b981" };
    case "intermediate": return { label: "중급", color: "#f59e0b" };
    case "advanced": return { label: "고급", color: "#ef4444" };
    case "discuss": return { label: "협의필요", color: "#8b5cf6" };
  }
};

const getDifficultyScore = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "basic": return 1;
    case "intermediate": return 2;
    case "advanced": return 3;
    case "discuss": return 5;
  }
};

export default function CalculatorPage() {
  const [mode, setMode] = useState<DevelopmentMode>("webbuilder");
  const [copied, setCopied] = useState(false);
  
  const [wbFeatures, setWbFeatures] = useState<FeatureItem[]>(webbuilderFeatures);
  const [pageCount, setPageCount] = useState(5);
  const [sectionCount, setSectionCount] = useState(4);
  const [includeMobile, setIncludeMobile] = useState(true);
  
  const [ctFeatures, setCtFeatures] = useState<FeatureItem[]>(customFeatures);

  const currentFeatures = mode === "webbuilder" ? wbFeatures : ctFeatures;
  const setCurrentFeatures = mode === "webbuilder" ? setWbFeatures : setCtFeatures;

  const toggleFeature = (id: string) => {
    setCurrentFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, selected: !f.selected } : f
    ));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCurrentFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, quantity: Math.max(1, f.quantity + delta) } : f
    ));
  };

  const resetAll = () => {
    if (confirm("모든 입력을 초기화할까요?")) {
      if (mode === "webbuilder") {
        setWbFeatures(webbuilderFeatures);
        setPageCount(5);
        setSectionCount(4);
        setIncludeMobile(true);
      } else {
        setCtFeatures(customFeatures);
      }
    }
  };

  const selectedFeatures = useMemo(() => 
    currentFeatures.filter(f => f.selected), 
    [currentFeatures]
  );

  const webbuilderCalculation = useMemo(() => {
    let pageScore = pageCount <= 5 ? 1 : pageCount <= 15 ? 2 : 3;
    const extraPages = Math.ceil(Math.max(0, sectionCount - 4) / 4);
    const sectionScore = extraPages;

    let maxDifficulty: Difficulty = "basic";
    let hasDiscussion = false;
    selectedFeatures.forEach(f => {
      if (f.requiresDiscussion) hasDiscussion = true;
      if (getDifficultyScore(f.difficulty) > getDifficultyScore(maxDifficulty)) {
        maxDifficulty = f.difficulty;
      }
    });

    let functionScore = getDifficultyScore(maxDifficulty);
    const totalScore = pageScore + sectionScore + functionScore;

    let grade: Grade;
    if (hasDiscussion || totalScore >= 8) grade = "S";
    else if (totalScore >= 6) grade = "A";
    else if (totalScore >= 4) grade = "B";
    else grade = "C";

    let basePrice = pageCount * 10 + extraPages * 10;
    selectedFeatures.forEach(f => { if (f.price > 0) basePrice += f.price * f.quantity; });

    const mobilePrice = includeMobile ? Math.round(basePrice * 0.6) : 0;
    const hasMultilang = selectedFeatures.some(f => f.id === "wb-multilang");
    const multilangPrice = hasMultilang ? Math.round((basePrice + mobilePrice) * 0.3) : 0;

    return { totalScore, grade, basePrice, mobilePrice, multilangPrice, totalPrice: basePrice + mobilePrice + multilangPrice, hasDiscussion, extraPages };
  }, [pageCount, sectionCount, selectedFeatures, includeMobile]);

  const customCalculation = useMemo(() => {
    let totalPrice = 0;
    let hasAdvanced = false;
    selectedFeatures.forEach(f => {
      totalPrice += f.price * f.quantity;
      if (f.difficulty === "advanced") hasAdvanced = true;
    });
    let grade: Grade = totalPrice >= 500 ? "S" : (totalPrice >= 300 || hasAdvanced) ? "A" : totalPrice >= 150 ? "B" : "C";
    return { totalPrice, grade };
  }, [selectedFeatures]);

  const currentCalculation = mode === "webbuilder" ? webbuilderCalculation : customCalculation;

  const copyToClipboard = async () => {
    let summary = mode === "webbuilder" ? "📋 웹빌더(아임웹) 견적 요약\n" : "📋 커스텀 개발 견적 요약\n";
    summary += "━━━━━━━━━━━━━━━━━━━━━\n\n";
    if (mode === "webbuilder") {
      summary += `📄 페이지: ${pageCount}개\n📦 섹션: ${sectionCount}개\n📱 모바일: ${includeMobile ? "포함" : "미포함"}\n\n`;
    }
    if (selectedFeatures.length > 0) {
      summary += "【선택된 기능】\n";
      selectedFeatures.forEach(f => {
        const priceText = f.price > 0 ? `+${f.price * f.quantity}만원` : f.note || "";
        summary += `  • ${f.name}${f.quantity > 1 ? ` x${f.quantity}` : ""}: ${priceText}\n`;
      });
      summary += "\n";
    }
    summary += "━━━━━━━━━━━━━━━━━━━━━\n";
    summary += `💰 예상 비용: 약 ${currentCalculation.totalPrice.toLocaleString()}만원\n\n※ 실제 비용은 상세 상담 후 확정됩니다.`;
    
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = mode === "webbuilder" 
    ? [
        { name: "기본 기능", ids: ["wb-form", "wb-page", "wb-section", "wb-mobile", "wb-member", "wb-board"] },
        { name: "중급 기능", ids: ["wb-reservation", "wb-payment", "wb-multilang", "wb-naver-login", "wb-kakao-login"] },
        { name: "고급/협의 필요", ids: ["wb-animation", "wb-api", "wb-erp", "wb-filter"] },
      ]
    : [
        { name: "기본 구성", ids: ["ct-landing", "ct-basic-5p", "ct-basic-10p"] },
        { name: "주요 기능", ids: ["ct-form", "ct-reservation", "ct-member", "ct-board", "ct-blog", "ct-gallery", "ct-search", "ct-multilang"] },
        { name: "커머스", ids: ["ct-shop", "ct-payment", "ct-coupon", "ct-review"] },
        { name: "고급 개발", ids: ["ct-api-basic", "ct-api-complex", "ct-admin", "ct-chat", "ct-responsive", "ct-animation", "ct-seo"] },
      ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
            <Calculator className="w-4 h-4" />
            <span>Estimation Tool</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">견적 계산기</h1>
          <p className="text-gray-500 font-medium mt-2">제작 방식과 필요 기능에 따라 예상 비용을 투명하게 확인하세요.</p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200 shadow-inner">
          <button
            onClick={() => setMode("webbuilder")}
            className={`px-8 py-3.5 rounded-xl font-black transition-all flex items-center gap-2 ${mode === "webbuilder" ? "bg-white text-indigo-600 shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Layers className="w-5 h-5" /> 웹빌더 (아임웹)
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`px-8 py-3.5 rounded-xl font-black transition-all flex items-center gap-2 ${mode === "custom" ? "bg-white text-indigo-600 shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Code2 className="w-5 h-5" /> 커스텀 개발
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🎯 견적 프리셋 (Quick Presets) */}
          <div className="card p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              Quick Presets
            </h2>
            <p className="text-gray-500 font-medium mb-6">자주 사용되는 견적 패키지를 빠르게 선택하세요.</p>
            
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
                const isSelected = pageCount === preset.pages && sectionCount === Math.ceil(preset.sections / preset.pages);
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setPageCount(preset.pages);
                      setSectionCount(Math.ceil(preset.sections / preset.pages));
                    }}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden
                      ${isSelected 
                        ? `border-indigo-600 shadow-xl shadow-indigo-50` 
                        : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                    style={{ 
                      backgroundColor: isSelected ? `${preset.color}08` : undefined
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

          {mode === "webbuilder" && (
            <div className="card p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                <LayoutGrid className="w-6 h-6 text-indigo-600" />
                기본 규모 설정
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Total Pages</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <button onClick={() => setPageCount(Math.max(1, pageCount - 1))} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"><Minus className="w-6 h-6"/></button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{pageCount}</span>
                    <button onClick={() => setPageCount(pageCount + 1)} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"><Plus className="w-6 h-6"/></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Sections per Page</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <button onClick={() => setSectionCount(Math.max(0, sectionCount - 1))} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"><Minus className="w-6 h-6"/></button>
                    <span className="flex-1 text-center text-3xl font-black text-gray-900">{sectionCount}</span>
                    <button onClick={() => setSectionCount(sectionCount + 1)} className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all text-gray-400"><Plus className="w-6 h-6"/></button>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 cursor-pointer">
                <input type="checkbox" checked={includeMobile} onChange={(e) => setIncludeMobile(e.target.checked)} className="w-6 h-6 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-black text-indigo-900">모바일 페이지 제작 포함 (PC 견적의 60% 추가)</span>
              </label>
            </div>
          )}

          {categories.map((category) => (
            <div key={category.name} className="card p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight uppercase">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                {category.name}
              </h2>
              <div className="space-y-3">
                {currentFeatures.filter(f => category.ids.includes(f.id)).map((feature) => {
                  const diff = getDifficultyLabel(feature.difficulty);
                  return (
                    <div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${feature.selected ? "bg-indigo-50 border-indigo-600 shadow-md" : "bg-white border-gray-100 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${feature.selected ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 group-hover:border-gray-300 bg-white"}`}>
                            {feature.selected && <Check className="w-4 h-4 font-black" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className={`font-black text-lg ${feature.selected ? "text-indigo-900" : "text-gray-700"}`}>{feature.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest" style={{ backgroundColor: `${diff.color}15`, color: diff.color }}>{diff.label}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-400 mt-1">{feature.description}</p>
                          </div>
                        </div>
                        {feature.selected && feature.price > 0 && (
                          <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-indigo-100" onClick={e => e.stopPropagation()}>
                            <button onClick={() => updateQuantity(feature.id, -1)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Minus className="w-4 h-4"/></button>
                            <span className="w-8 text-center font-black text-gray-900">{feature.quantity}</span>
                            <button onClick={() => updateQuantity(feature.id, 1)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"><Plus className="w-4 h-4"/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Result */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="card p-8 border-t-8 border-t-indigo-600 shadow-2xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Estimated Quote</h3>
              
              <div className="text-center mb-10">
                <div className="w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-indigo-100" style={{ backgroundColor: `${gradeInfoMap[currentCalculation.grade].color}15`, color: gradeInfoMap[currentCalculation.grade].color }}>
                  {currentCalculation.grade}
                </div>
                <div className="text-lg font-black text-gray-900">{gradeInfoMap[currentCalculation.grade].description}</div>
                <p className="text-xs font-bold text-gray-400 mt-1">프로젝트 난이도/규모 종합 점수</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
                <p className="text-xs font-black text-gray-400 uppercase mb-2">Total Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">{currentCalculation.totalPrice.toLocaleString()}</span>
                  <span className="text-xl font-black text-gray-400">만원</span>
                </div>
              </div>

              {selectedFeatures.length > 0 && (
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Breakdown</p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {selectedFeatures.map(f => (
                      <div key={f.id} className="flex justify-between text-sm font-bold">
                        <span className="text-gray-500 truncate mr-4">{f.name}{f.quantity > 1 ? ` x${f.quantity}` : ""}</span>
                        <span className="text-gray-900 flex-shrink-0">{f.price > 0 ? `${(f.price * f.quantity).toLocaleString()}만` : f.note || "무료"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <button onClick={copyToClipboard} className="h-14 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest">
                  {copied ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
                  {copied ? "Copied" : "Copy Quote"}
                </button>
                <button onClick={resetAll} className="h-14 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black flex items-center justify-center gap-2 hover:border-gray-200 hover:text-gray-600 transition-all">
                  <RotateCcw className="w-5 h-5"/> Reset
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-start gap-4">
              <Info className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-1 uppercase tracking-tight">상담 시 유의사항</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">위 견적은 표준 작업량 기준이며, 디자인 난이도나 세부 기능 요구사항에 따라 실제 견적은 변동될 수 있습니다. 정확한 견적은 기획서 검토 후 확정됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
