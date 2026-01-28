"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Check,
  Info,
  Sparkles,
  Clock,
  DollarSign,
  AlertCircle,
  Layers,
  Code2,
  FileText,
  LayoutGrid,
  AlertTriangle,
  CheckCircle2
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
  // 기본 기능
  { id: "wb-form", name: "기본 문의폼", description: "문의폼이 10개 이상 또는 디자인이 필요하면 논의 필요", price: 5, difficulty: "basic", tags: ["문의폼"], selected: false, quantity: 1 },
  { id: "wb-page", name: "페이지 당 가격", description: "기본 페이지 추가", price: 10, difficulty: "basic", tags: ["페이지"], selected: false, quantity: 1 },
  { id: "wb-section", name: "4개 섹션당 추가 비용", description: "4개 섹션 = 10만 (페이지 1개 분량)", price: 10, difficulty: "basic", tags: ["페이지", "섹션"], selected: false, quantity: 1 },
  { id: "wb-mobile", name: "모바일 페이지 비용", description: "+ PC 비용의 60%", price: 0, difficulty: "basic", note: "PC 비용의 60%", selected: false, quantity: 1 },
  
  // 중급 기능
  { id: "wb-reservation", name: "예약 위젯", description: "PG사 연결 및 행정 소요가 많음", price: 20, difficulty: "intermediate", tags: ["예약"], selected: false, quantity: 1 },
  { id: "wb-payment", name: "결제 위젯", description: "PG사 연결 및 행정 소요가 많음", price: 20, difficulty: "intermediate", tags: ["결제"], selected: false, quantity: 1 },
  { id: "wb-member", name: "로그인/회원가입", description: "회원 가입/마이페이지", price: 5, difficulty: "basic", tags: ["회원"], selected: false, quantity: 1 },
  { id: "wb-board", name: "게시판 위젯", description: "게시판", price: 5, difficulty: "basic", tags: ["게시판"], selected: false, quantity: 1 },
  { id: "wb-multilang", name: "다국어 지원", description: "프로젝트 총 비용의 30%, 언어별 메뉴/페이지 세팅", price: 0, difficulty: "intermediate", note: "총 비용의 30%", tags: ["다국어"], selected: false, quantity: 1 },
  
  // 고급 기능
  { id: "wb-animation", name: "애니메이션 효과", description: "레퍼런스 필수로 필요", price: 50, difficulty: "advanced", tags: ["애니메이션", "인터렉션"], selected: false, quantity: 1 },
  
  // 협의 필요
  { id: "wb-api", name: "외부 API 연동", description: "협의 필요 (불가할 가능성이 높음)", price: 100, difficulty: "discuss", requiresDiscussion: true, selected: false, quantity: 1 },
  { id: "wb-erp", name: "ERP/회계 양방향 API", description: "아임웹 한계 초과", price: 0, difficulty: "discuss", note: "협의", requiresDiscussion: true, selected: false, quantity: 1 },
  { id: "wb-filter", name: "상품 필터링", description: "아임웹 기능으로 불가, 고급 코드 연계를 통해 가능", price: 100, difficulty: "advanced", selected: false, quantity: 1 },
  
  // 소셜 로그인
  { id: "wb-naver-login", name: "네이버 로그인", description: "행정 소요 약 1시간", price: 10, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "wb-kakao-login", name: "카카오 로그인", description: "행정 소요 약 1시간", price: 10, difficulty: "intermediate", selected: false, quantity: 1 },
];

// ============================================
// 커스텀 개발 기능 데이터
// ============================================

const customFeatures: FeatureItem[] = [
  // 기본 구성
  { id: "ct-landing", name: "랜딩페이지 (1페이지)", description: "전환 최적화 단일 페이지", price: 100, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-basic-5p", name: "기본 홈페이지 (5페이지)", description: "메인, 소개, 서비스, 갤러리, 연락처", price: 200, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-basic-10p", name: "기본 홈페이지 (10페이지)", description: "확장된 페이지 구성", price: 350, difficulty: "basic", selected: false, quantity: 1 },
  
  // 기능 추가
  { id: "ct-form", name: "문의 폼", description: "이메일 발송 포함", price: 30, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-reservation", name: "예약/달력 시스템", description: "날짜/시간 선택, 관리자 확인", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-member", name: "회원 기능", description: "가입, 로그인, 마이페이지", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-board", name: "게시판", description: "글쓰기, 댓글, 관리", price: 80, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-blog", name: "블로그/뉴스 CMS", description: "콘텐츠 관리 시스템", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-gallery", name: "포트폴리오/갤러리", description: "이미지 업로드, 카테고리", price: 60, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-search", name: "검색 기능", description: "사이트 내 검색", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-multilang", name: "다국어 지원 (2개 언어)", description: "언어 전환, 콘텐츠 관리", price: 150, difficulty: "intermediate", selected: false, quantity: 1 },
  
  // 쇼핑몰 기능
  { id: "ct-shop", name: "쇼핑몰 기본", description: "상품 등록, 장바구니, 주문", price: 400, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-payment", name: "결제 연동 (PG)", description: "카드, 계좌이체, 간편결제", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-coupon", name: "쿠폰/할인 시스템", description: "할인 코드, 자동 적용", price: 60, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-review", name: "상품 리뷰", description: "별점, 사진 리뷰", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  
  // 연동/고급
  { id: "ct-api-basic", name: "외부 API 연동 (기본)", description: "지도, SNS 등 단순 연동", price: 50, difficulty: "basic", selected: false, quantity: 1 },
  { id: "ct-api-complex", name: "외부 API 연동 (복잡)", description: "ERP, CRM 등 시스템 연동", price: 250, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-admin", name: "관리자 대시보드", description: "통계, 회원/주문 관리", price: 300, difficulty: "advanced", selected: false, quantity: 1 },
  { id: "ct-chat", name: "실시간 채팅", description: "1:1 문의, 채팅봇", price: 200, difficulty: "advanced", selected: false, quantity: 1 },
  
  // 디자인/기타
  { id: "ct-responsive", name: "반응형 웹", description: "PC/태블릿/모바일 최적화", price: 80, difficulty: "basic", note: "기본 포함 권장", selected: false, quantity: 1 },
  { id: "ct-animation", name: "인터랙티브 애니메이션", description: "스크롤 효과, 모션", price: 100, difficulty: "intermediate", selected: false, quantity: 1 },
  { id: "ct-seo", name: "SEO 최적화", description: "검색엔진 최적화", price: 50, difficulty: "basic", selected: false, quantity: 1 },
];

// ============================================
// 등급 정보
// ============================================

const gradeInfoMap: Record<Grade, GradeInfo> = {
  C: { grade: "C", minPrice: 50, maxPrice: 150, description: "기본형", color: "#10b981" },
  B: { grade: "B", minPrice: 150, maxPrice: 300, description: "표준형", color: "#6366f1" },
  A: { grade: "A", minPrice: 300, maxPrice: 500, description: "프리미엄", color: "#f59e0b" },
  S: { grade: "S", minPrice: 500, maxPrice: 1000, description: "독립개발 권장", color: "#ef4444" },
};

// ============================================
// 유틸리티 함수
// ============================================

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

// ============================================
// 메인 컴포넌트
// ============================================

export default function CalculatorPage() {
  const [mode, setMode] = useState<DevelopmentMode>("webbuilder");
  const [copied, setCopied] = useState(false);
  
  // 웹빌더 상태
  const [wbFeatures, setWbFeatures] = useState<FeatureItem[]>(webbuilderFeatures);
  const [pageCount, setPageCount] = useState(5);
  const [sectionCount, setSectionCount] = useState(4);
  const [includeMobile, setIncludeMobile] = useState(true);
  
  // 커스텀 개발 상태
  const [ctFeatures, setCtFeatures] = useState<FeatureItem[]>(customFeatures);

  // 현재 모드에 따른 기능 목록
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
    if (mode === "webbuilder") {
      setWbFeatures(webbuilderFeatures);
      setPageCount(5);
      setSectionCount(4);
      setIncludeMobile(true);
    } else {
      setCtFeatures(customFeatures);
    }
  };

  const selectedFeatures = useMemo(() => 
    currentFeatures.filter(f => f.selected), 
    [currentFeatures]
  );

  // 웹빌더 등급 계산
  const webbuilderCalculation = useMemo(() => {
    // 페이지 점수 계산
    let pageScore = 0;
    if (pageCount <= 5) pageScore = 1;
    else if (pageCount <= 15) pageScore = 2;
    else pageScore = 3;

    // 섹션 점수 계산 (4개 섹션 = 1페이지)
    const extraPages = Math.ceil(Math.max(0, sectionCount - 4) / 4);
    const sectionScore = extraPages;

    // 기능 점수 계산
    let maxDifficulty: Difficulty = "basic";
    let hasDiscussion = false;
    selectedFeatures.forEach(f => {
      if (f.requiresDiscussion) hasDiscussion = true;
      if (getDifficultyScore(f.difficulty) > getDifficultyScore(maxDifficulty)) {
        maxDifficulty = f.difficulty;
      }
    });

    let functionScore = getDifficultyScore(maxDifficulty);
    
    // 총점 계산
    const totalScore = pageScore + sectionScore + functionScore;

    // 등급 결정
    let grade: Grade;
    if (hasDiscussion || totalScore >= 8) grade = "S";
    else if (totalScore >= 6) grade = "A";
    else if (totalScore >= 4) grade = "B";
    else grade = "C";

    // 기본 비용 계산
    let basePrice = 0;
    
    // 페이지 비용 (페이지당 10만원)
    basePrice += pageCount * 10;
    
    // 섹션 추가 비용 (4개 초과시 4개당 10만원)
    basePrice += extraPages * 10;
    
    // 선택된 기능 비용
    selectedFeatures.forEach(f => {
      if (f.price > 0) {
        basePrice += f.price * f.quantity;
      }
    });

    // 모바일 비용 (PC 비용의 60%)
    const mobilePrice = includeMobile ? Math.round(basePrice * 0.6) : 0;
    
    // 다국어 비용 (총 비용의 30%)
    const hasMultilang = selectedFeatures.some(f => f.id === "wb-multilang");
    const multilangPrice = hasMultilang ? Math.round((basePrice + mobilePrice) * 0.3) : 0;

    const totalPrice = basePrice + mobilePrice + multilangPrice;

    return {
      pageScore,
      sectionScore,
      functionScore,
      totalScore,
      grade,
      basePrice,
      mobilePrice,
      multilangPrice,
      totalPrice,
      hasDiscussion,
      extraPages
    };
  }, [pageCount, sectionCount, selectedFeatures, includeMobile]);

  // 커스텀 개발 비용 계산
  const customCalculation = useMemo(() => {
    let totalPrice = 0;
    let hasAdvanced = false;
    
    selectedFeatures.forEach(f => {
      totalPrice += f.price * f.quantity;
      if (f.difficulty === "advanced") hasAdvanced = true;
    });

    let grade: Grade;
    if (totalPrice >= 500) grade = "S";
    else if (totalPrice >= 300 || hasAdvanced) grade = "A";
    else if (totalPrice >= 150) grade = "B";
    else grade = "C";

    return { totalPrice, grade };
  }, [selectedFeatures]);

  const currentCalculation = mode === "webbuilder" ? webbuilderCalculation : customCalculation;

  const generateSummary = () => {
    if (mode === "webbuilder") {
      let summary = "📋 웹빌더(아임웹) 견적 요약\n";
      summary += "━━━━━━━━━━━━━━━━━━━━━\n\n";
      summary += `📄 페이지: ${pageCount}개\n`;
      summary += `📦 섹션: ${sectionCount}개 (추가 환산: +${webbuilderCalculation.extraPages}페이지)\n`;
      summary += `📱 모바일: ${includeMobile ? "포함" : "미포함"}\n\n`;
      
      if (selectedFeatures.length > 0) {
        summary += "【선택된 기능】\n";
        selectedFeatures.forEach(f => {
          const qty = f.quantity > 1 ? ` x${f.quantity}` : "";
          const priceText = f.price > 0 ? `+${f.price * f.quantity}만원` : f.note || "";
          summary += `  • ${f.name}${qty}: ${priceText}\n`;
        });
        summary += "\n";
      }
      
      summary += "━━━━━━━━━━━━━━━━━━━━━\n";
      summary += `🏷️ 등급: ${webbuilderCalculation.grade}등급 (${gradeInfoMap[webbuilderCalculation.grade].description})\n`;
      summary += `💰 예상 비용: 약 ${webbuilderCalculation.totalPrice}만원\n`;
      if (webbuilderCalculation.hasDiscussion) {
        summary += `⚠️ 협의 필요 항목이 포함되어 있습니다.\n`;
      }
      summary += "\n※ 실제 비용은 상세 요구사항에 따라 변동될 수 있습니다.";
      
      return summary;
    } else {
      let summary = "📋 커스텀 개발 견적 요약\n";
      summary += "━━━━━━━━━━━━━━━━━━━━━\n\n";
      
      if (selectedFeatures.length > 0) {
        summary += "【선택된 기능】\n";
        selectedFeatures.forEach(f => {
          const qty = f.quantity > 1 ? ` x${f.quantity}` : "";
          summary += `  • ${f.name}${qty}: ${f.price * f.quantity}만원\n`;
        });
        summary += "\n";
      }
      
      summary += "━━━━━━━━━━━━━━━━━━━━━\n";
      summary += `🏷️ 등급: ${customCalculation.grade}등급 (${gradeInfoMap[customCalculation.grade].description})\n`;
      summary += `💰 예상 비용: 약 ${customCalculation.totalPrice}만원\n`;
      summary += "\n※ 실제 비용은 상세 요구사항에 따라 변동될 수 있습니다.";
      
      return summary;
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 카테고리별 그룹핑
  const webbuilderCategories = [
    { name: "기본 기능", ids: ["wb-form", "wb-page", "wb-section", "wb-mobile", "wb-member", "wb-board"] },
    { name: "중급 기능", ids: ["wb-reservation", "wb-payment", "wb-multilang", "wb-naver-login", "wb-kakao-login"] },
    { name: "고급/협의 필요", ids: ["wb-animation", "wb-api", "wb-erp", "wb-filter"] },
  ];

  const customCategories = [
    { name: "기본 구성", ids: ["ct-landing", "ct-basic-5p", "ct-basic-10p"] },
    { name: "기능 추가", ids: ["ct-form", "ct-reservation", "ct-member", "ct-board", "ct-blog", "ct-gallery", "ct-search", "ct-multilang"] },
    { name: "쇼핑몰", ids: ["ct-shop", "ct-payment", "ct-coupon", "ct-review"] },
    { name: "연동/고급", ids: ["ct-api-basic", "ct-api-complex", "ct-admin", "ct-chat"] },
    { name: "디자인/기타", ids: ["ct-responsive", "ct-animation", "ct-seo"] },
  ];

  const categories = mode === "webbuilder" ? webbuilderCategories : customCategories;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">견적 계산기</h1>
            <p className="text-[#71717a]">개발 방식에 맞는 예상 비용을 계산합니다</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-[#27272a] rounded-xl w-fit">
          <button
            onClick={() => setMode("webbuilder")}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${mode === "webbuilder" 
                ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white shadow-lg" 
                : "text-[#a1a1aa] hover:text-white"
              }
            `}
          >
            <Layers className="w-5 h-5" />
            웹빌더 (아임웹)
          </button>
          <button
            onClick={() => setMode("custom")}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${mode === "custom" 
                ? "bg-gradient-to-r from-[#22d3ee] to-[#67e8f9] text-white shadow-lg" 
                : "text-[#a1a1aa] hover:text-white"
              }
            `}
          >
            <Code2 className="w-5 h-5" />
            커스텀 개발
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Feature Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🎯 견적 프리셋 */}
          {mode === "webbuilder" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                🎯 빠른 견적 프리셋
              </h2>
              <p className="text-sm text-[#71717a] mb-4">클릭하면 페이지/섹션이 자동 입력됩니다</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: "A",
                    name: "A안 - 심플",
                    price: "80~120만원",
                    pages: 3,
                    sections: 4,
                    color: "#10b981",
                    recommend: "소규모 사업자, 명함형",
                    desc: "회사소개 + 서비스 + 문의",
                  },
                  {
                    id: "B",
                    name: "B안 - 스탠다드",
                    price: "150~200만원",
                    pages: 5,
                    sections: 5,
                    color: "#6366f1",
                    recommend: "일반 기업, 브랜드",
                    desc: "메인 + 소개 + 서비스 + 포폴 + 문의",
                  },
                  {
                    id: "C",
                    name: "C안 - 프리미엄",
                    price: "250~350만원",
                    pages: 8,
                    sections: 6,
                    color: "#f59e0b",
                    recommend: "중견기업, 상세 정보",
                    desc: "풀 구성 + 서브페이지 다수",
                  },
                  {
                    id: "D",
                    name: "D안 - 엔터프라이즈",
                    price: "400만원~",
                    pages: 12,
                    sections: 6,
                    color: "#ec4899",
                    recommend: "대기업, 복잡한 기능",
                    desc: "커스텀 기능 + 대규모",
                  },
                ].map((preset) => {
                  const isSelected = pageCount === preset.pages && sectionCount === preset.sections;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setPageCount(preset.pages);
                        setSectionCount(preset.sections);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all
                        ${isSelected 
                          ? `border-2` 
                          : "border-[#2a2a32] hover:border-[#3a3a42]"
                        }`}
                      style={{ 
                        borderColor: isSelected ? preset.color : undefined,
                        backgroundColor: isSelected ? `${preset.color}15` : '#1a1a1f'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: preset.color }}
                          >
                            {preset.id}
                          </span>
                          <span className="font-semibold text-white">{preset.name}</span>
                        </div>
                        <span className="font-bold" style={{ color: preset.color }}>{preset.price}</span>
                      </div>
                      <p className="text-xs text-[#71717a] mb-1">{preset.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                          👤 {preset.recommend}
                        </span>
                        <span className="text-xs text-[#52525b]">{preset.pages}p · {preset.sections}섹션/p</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 웹빌더 전용: 페이지/섹션 설정 */}
          {mode === "webbuilder" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#6366f1]" />
                페이지 & 섹션 직접 설정
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 페이지 수 */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    페이지 수
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPageCount(Math.max(1, pageCount - 1))}
                      className="w-10 h-10 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field w-20 text-center text-lg font-bold"
                    />
                    <button
                      onClick={() => setPageCount(pageCount + 1)}
                      className="w-10 h-10 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-[#71717a] text-sm">페이지</span>
                  </div>
                  <div className="mt-2 text-xs text-[#71717a]">
                    {pageCount <= 5 ? "소규모 (1~5p)" : pageCount <= 15 ? "중규모 (6~15p)" : "대규모 (16p+)"}
                  </div>
                </div>

                {/* 섹션 수 */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">
                    <Layers className="w-4 h-4 inline mr-1" />
                    평균 섹션 수 (페이지당)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSectionCount(Math.max(0, sectionCount - 1))}
                      className="w-10 h-10 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={sectionCount}
                      onChange={(e) => setSectionCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="input-field w-20 text-center text-lg font-bold"
                    />
                    <button
                      onClick={() => setSectionCount(sectionCount + 1)}
                      className="w-10 h-10 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-[#71717a] text-sm">섹션</span>
                  </div>
                  <div className="mt-2 text-xs text-[#71717a]">
                    4섹션 초과 시 +{webbuilderCalculation.extraPages}페이지 환산
                  </div>
                </div>
              </div>

              {/* 모바일 포함 여부 */}
              <div className="mt-4 pt-4 border-t border-[#2a2a32]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMobile}
                    onChange={(e) => setIncludeMobile(e.target.checked)}
                    className="checkbox-custom"
                  />
                  <span className="text-[#e8e8ed]">모바일 페이지 포함</span>
                  <span className="text-xs text-[#71717a]">(+PC 비용의 60%)</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* 커스텀 개발 프리셋 */}
          {mode === "custom" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#22d3ee]" />
                🎯 빠른 견적 프리셋
              </h2>
              <p className="text-sm text-[#71717a] mb-4">클릭하면 관련 기능이 자동 선택됩니다</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    id: "A",
                    name: "A안 - 랜딩페이지",
                    price: "100~150만원",
                    color: "#10b981",
                    recommend: "이벤트, 프로모션",
                    desc: "단일 페이지 + 문의폼",
                    featureIds: ["ct-landing", "ct-form", "ct-responsive"],
                  },
                  {
                    id: "B",
                    name: "B안 - 기업 홈페이지",
                    price: "200~300만원",
                    color: "#6366f1",
                    recommend: "일반 기업, 스타트업",
                    desc: "5페이지 + 문의 + 갤러리",
                    featureIds: ["ct-basic-5p", "ct-form", "ct-gallery", "ct-responsive", "ct-seo"],
                  },
                  {
                    id: "C",
                    name: "C안 - 회원제 사이트",
                    price: "400~550만원",
                    color: "#f59e0b",
                    recommend: "커뮤니티, 서비스",
                    desc: "10페이지 + 회원 + 게시판",
                    featureIds: ["ct-basic-10p", "ct-member", "ct-board", "ct-responsive", "ct-seo", "ct-admin"],
                  },
                  {
                    id: "D",
                    name: "D안 - 쇼핑몰",
                    price: "600만원~",
                    color: "#ec4899",
                    recommend: "이커머스, 온라인 판매",
                    desc: "쇼핑몰 풀 기능",
                    featureIds: ["ct-basic-10p", "ct-member", "ct-shop", "ct-payment", "ct-coupon", "ct-review", "ct-responsive", "ct-admin"],
                  },
                ].map((preset) => {
                  const selectedCount = preset.featureIds.filter(id => 
                    currentFeatures.find(f => f.id === id)?.selected
                  ).length;
                  const isSelected = selectedCount === preset.featureIds.length;
                  
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        // 해당 프리셋의 기능들을 선택
                        setCtFeatures(prev => prev.map(f => ({
                          ...f,
                          selected: preset.featureIds.includes(f.id)
                        })));
                      }}
                      className={`p-4 rounded-xl border text-left transition-all
                        ${isSelected 
                          ? `border-2` 
                          : "border-[#2a2a32] hover:border-[#3a3a42]"
                        }`}
                      style={{ 
                        borderColor: isSelected ? preset.color : undefined,
                        backgroundColor: isSelected ? `${preset.color}15` : '#1a1a1f'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: preset.color }}
                          >
                            {preset.id}
                          </span>
                          <span className="font-semibold text-white">{preset.name}</span>
                        </div>
                        <span className="font-bold" style={{ color: preset.color }}>{preset.price}</span>
                      </div>
                      <p className="text-xs text-[#71717a] mb-1">{preset.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]">
                          👤 {preset.recommend}
                        </span>
                        <span className="text-xs text-[#52525b]">{preset.featureIds.length}개 기능</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Feature Categories */}
          <AnimatePresence mode="wait">
            {categories.map((category, catIndex) => (
              <motion.div
                key={`${mode}-${category.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: catIndex * 0.1 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#6366f1]" />
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {currentFeatures
                    .filter(f => category.ids.includes(f.id))
                    .map((feature) => {
                      const diffInfo = getDifficultyLabel(feature.difficulty);
                      return (
                        <div
                          key={feature.id}
                          className={`
                            p-4 rounded-xl border transition-all cursor-pointer
                            ${feature.selected 
                              ? "bg-[#6366f1]/10 border-[#6366f1]" 
                              : "bg-[#27272a]/50 border-[#2a2a32] hover:border-[#3a3a42]"
                            }
                            ${feature.requiresDiscussion ? "border-l-4 border-l-[#f59e0b]" : ""}
                          `}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={feature.selected}
                                onChange={() => {}}
                                className="checkbox-custom mt-1"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-white">{feature.name}</span>
                                  <span 
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{ backgroundColor: `${diffInfo.color}20`, color: diffInfo.color }}
                                  >
                                    {diffInfo.label}
                                  </span>
                                  {feature.requiresDiscussion && (
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#f59e0b]/20 text-[#fbbf24]">
                                      ⚠️ 협의필요
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-[#71717a] mt-1">{feature.description}</div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  {feature.price > 0 ? (
                                    <span className="text-[#a5b4fc]">
                                      <DollarSign className="w-3 h-3 inline mr-1" />
                                      +{feature.price}만원
                                    </span>
                                  ) : feature.note ? (
                                    <span className="text-[#fbbf24]">
                                      <Info className="w-3 h-3 inline mr-1" />
                                      {feature.note}
                                    </span>
                                  ) : null}
                                  {feature.tags && feature.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-[#27272a] rounded text-[#71717a]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {feature.selected && feature.price > 0 && (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => updateQuantity(feature.id, -1)}
                                  className="w-8 h-8 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{feature.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(feature.id, 1)}
                                  className="w-8 h-8 rounded-lg bg-[#27272a] hover:bg-[#3a3a42] flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Panel - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            {/* Grade Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
              style={{ borderColor: `${gradeInfoMap[currentCalculation.grade].color}50` }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#6366f1]" />
                예상 견적
              </h3>

              {/* Grade Display */}
              <div className="text-center mb-6">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-4xl font-bold mb-2"
                  style={{ 
                    backgroundColor: `${gradeInfoMap[currentCalculation.grade].color}20`,
                    color: gradeInfoMap[currentCalculation.grade].color 
                  }}
                >
                  {currentCalculation.grade}
                </div>
                <div className="text-[#a1a1aa]">{gradeInfoMap[currentCalculation.grade].description}</div>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5 mb-4">
                <div className="text-sm text-[#a1a1aa] mb-1">예상 비용</div>
                <div className="text-3xl font-bold text-white">
                  {mode === "webbuilder" 
                    ? webbuilderCalculation.totalPrice.toLocaleString()
                    : customCalculation.totalPrice.toLocaleString()
                  }
                  <span className="text-lg font-normal text-[#a1a1aa] ml-1">만원</span>
                </div>
              </div>

              {/* 웹빌더 상세 내역 */}
              {mode === "webbuilder" && (
                <div className="space-y-2 text-sm border-t border-[#2a2a32] pt-4 mb-4">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>기본 비용 (페이지+기능)</span>
                    <span className="text-white">{webbuilderCalculation.basePrice}만원</span>
                  </div>
                  {includeMobile && (
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>모바일 (+60%)</span>
                      <span className="text-white">+{webbuilderCalculation.mobilePrice}만원</span>
                    </div>
                  )}
                  {webbuilderCalculation.multilangPrice > 0 && (
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>다국어 (+30%)</span>
                      <span className="text-white">+{webbuilderCalculation.multilangPrice}만원</span>
                    </div>
                  )}
                </div>
              )}

              {/* Score Breakdown (웹빌더) */}
              {mode === "webbuilder" && (
                <div className="p-3 bg-[#27272a]/50 rounded-xl mb-4">
                  <div className="text-xs text-[#71717a] mb-2">점수 산정</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-[#a1a1aa]">페이지</div>
                      <div className="text-white font-bold">{webbuilderCalculation.pageScore}점</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1aa]">섹션</div>
                      <div className="text-white font-bold">{webbuilderCalculation.sectionScore}점</div>
                    </div>
                    <div>
                      <div className="text-[#a1a1aa]">기능</div>
                      <div className="text-white font-bold">{webbuilderCalculation.functionScore}점</div>
                    </div>
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-[#3a3a42]">
                    <span className="text-[#a1a1aa]">총점: </span>
                    <span className="text-white font-bold">{webbuilderCalculation.totalScore}점</span>
                  </div>
                </div>
              )}

              {/* Selected Features */}
              {selectedFeatures.length > 0 && (
                <div className="border-t border-[#2a2a32] pt-4 mb-4">
                  <div className="text-sm text-[#71717a] mb-2">선택된 기능 ({selectedFeatures.length}개)</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFeatures.map(f => (
                      <div key={f.id} className="flex justify-between text-sm">
                        <span className="text-[#a1a1aa] truncate mr-2">{f.name}</span>
                        <span className="text-white whitespace-nowrap">
                          {f.price > 0 ? `+${f.price * f.quantity}만` : f.note || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              {mode === "webbuilder" && webbuilderCalculation.hasDiscussion && (
                <div className="p-3 bg-[#f59e0b]/10 rounded-xl mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0" />
                  <p className="text-xs text-[#fbbf24]">
                    협의 필요 항목이 포함되어 있습니다. 아임웹에서 구현이 어려울 수 있습니다.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "복사됨!" : "복사"}
                </button>
                <button
                  onClick={resetAll}
                  className="btn-secondary px-4"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Grade Reference */}
            <div className="card p-4">
              <h4 className="text-sm font-medium text-[#71717a] mb-3">등급 기준표</h4>
              <div className="space-y-2">
                {(["C", "B", "A", "S"] as Grade[]).map(grade => (
                  <div 
                    key={grade}
                    className={`
                      flex items-center justify-between text-sm p-2 rounded-lg
                      ${currentCalculation.grade === grade ? "bg-[#27272a]" : ""}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
                        style={{ 
                          backgroundColor: `${gradeInfoMap[grade].color}20`,
                          color: gradeInfoMap[grade].color 
                        }}
                      >
                        {grade}
                      </span>
                      <span className={currentCalculation.grade === grade ? "text-white" : "text-[#71717a]"}>
                        {gradeInfoMap[grade].description}
                      </span>
                    </div>
                    <span className={currentCalculation.grade === grade ? "text-white" : "text-[#71717a]"}>
                      {gradeInfoMap[grade].minPrice}~{gradeInfoMap[grade].maxPrice}만
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="card p-4 bg-[#27272a]/50">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-[#a1a1aa]">
                  <p className="mb-2">
                    <strong className="text-white">
                      {mode === "webbuilder" ? "웹빌더 견적 기준" : "커스텀 개발 안내"}
                    </strong>
                  </p>
                  <ul className="space-y-1 text-xs">
                    {mode === "webbuilder" ? (
                      <>
                        <li>• 4섹션 초과 시 페이지로 환산</li>
                        <li>• 모바일은 PC 비용의 60%</li>
                        <li>• 다국어는 총 비용의 30%</li>
                        <li>• 협의필요 항목은 별도 상담</li>
                      </>
                    ) : (
                      <>
                        <li>• 기능 복잡도에 따라 비용 변동</li>
                        <li>• 반응형 웹은 기본 포함 권장</li>
                        <li>• 유지보수 비용은 별도</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
