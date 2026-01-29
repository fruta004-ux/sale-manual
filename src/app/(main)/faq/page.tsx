"use client";

import { useState } from "react";
import {
  MessageSquareText,
  ChevronDown,
  Copy,
  Check,
  Search,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  MessageCircle
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  situation: string;
  answer: string;
  tips?: string[];
  category: string;
}

const faqs: FAQ[] = [
  // ========== 첫 응대 ==========
  {
    id: "first-1",
    category: "첫 응대",
    question: "전화하자마자 '얼마예요?' 라고 물어볼 때",
    situation: "고객이 인사도 없이 바로 가격을 물어볼 때",
    answer: `네, 견적 문의 주셨군요! 정확한 안내를 위해 몇 가지만 여쭤볼게요.\n\n홈페이지는 전문가분들의 인건비로 제작되다 보니, 어떤 사이트를 만드시느냐에 따라 금액이 달라져요.\n\n간단히 어떤 사이트인지만 알려주시면 대략적인 범위 말씀드릴 수 있어요!`,
    tips: [
      "바로 가격을 말하지 말고 질문으로 전환",
      "인건비 기반임을 자연스럽게 언급",
      "협조적인 톤 유지하며 정보 수집"
    ]
  },
  {
    id: "first-2",
    category: "첫 응대",
    question: "'그냥 대충 얼마인지만 알려주세요'",
    situation: "고객이 구체적인 정보 없이 가격만 요구할 때",
    answer: `물론이죠! 일반적인 회사소개 사이트 기준으로 보통 150~200만원 정도예요.\n\n다만 페이지 수나 기능에 따라 달라지거든요. 혹시 어떤 사이트 생각하고 계세요?\n\n예를 들어 쇼핑몰이면 결제 기능이 들어가서 좀 더 올라가고, 단순 소개 사이트면 그보다 낮을 수도 있어요.`,
    tips: [
      "일단 범위를 제시해서 불안감 해소",
      "바로 역질문으로 정보 파악",
      "예시를 들어 가격 차이 이유 설명"
    ]
  },
  {
    id: "first-3",
    category: "첫 응대",
    question: "기획이 되어 있으신가요?",
    situation: "고객의 준비 상태를 파악할 때",
    answer: `혹시 기획이 되어 있으신가요? 아니면 기획부터 도움이 필요하신가요?\n\n메뉴를 짠 상태라면 메뉴 알려주시면 되고요, 안 짜셨으면 저랑 같이 짜도 됩니다!\n\n보통 회사소개형 메뉴는 [홈 - 회사소개 - 서비스 - 포트폴리오 - 문의하기] 이런 식으로 되어있어요.`,
    tips: [
      "기획 유무에 따라 견적이 달라짐을 인지",
      "기획이 없어도 도와줄 수 있다는 안심 제공",
      "표준 메뉴 구조 예시 제시"
    ]
  },

  // ========== 기능 문의 ==========
  {
    id: "func-1",
    category: "기능 문의",
    question: "이 기능도 들어갈 수 있나요?",
    situation: "고객이 특정 기능 구현 가능 여부를 물어볼 때",
    answer: `네, 가능합니다.\n\n다만 기능의 구체적인 범위와 구현 방법에 따라 개발 시간과 비용이 달라집니다.\n\n예를 들어 로그인, 게시판처럼 기본적인 기능은 표준 개발로 빠르게 진행 가능하지만, 외부 시스템과 연동되거나 특수한 로직이 필요한 경우 추가 소요가 발생합니다.\n\n정확한 견적을 위해 원하시는 기능의 상세 요구사항을 말씀해 주시면 검토 후 안내드리겠습니다.`,
    tips: [
      "무조건 '가능합니다'보다는 조건부 긍정으로 답변",
      "구체적인 요구사항을 역으로 질문하여 범위 파악",
      "비슷한 사례가 있다면 언급하여 신뢰도 상승"
    ]
  },
  {
    id: "func-2",
    category: "기능 문의",
    question: "쇼핑몰 기능도 넣을 수 있나요?",
    situation: "결제/쇼핑 기능을 문의할 때",
    answer: `네, 쇼핑몰 기능 가능합니다!\n\n쇼핑몰은 크게 두 가지 방식이 있어요:\n\n1. 아임웹/카페24 같은 플랫폼 활용: 빠르고 안정적, 150~300만원\n2. 완전 맞춤 개발: 자유도 높음, 500만원 이상\n\n어떤 상품을 판매하시나요? 상품 수나 결제 방식에 따라 최적의 방법을 추천드릴게요.`,
    tips: [
      "플랫폼 vs 맞춤개발 옵션 제시",
      "상품 종류/수량 파악하여 적합한 솔루션 추천",
      "PG사 연동 행정 소요 미리 안내"
    ]
  },
  {
    id: "func-3",
    category: "기능 문의",
    question: "예약 시스템을 넣고 싶어요",
    situation: "예약/스케줄 기능을 요청할 때",
    answer: `예약 시스템 가능합니다!\n\n예약 기능은 복잡도에 따라 달라지는데요:\n\n• 단순 예약 폼 (날짜/시간 선택): +20~30만원\n• 실시간 예약 + 결제 연동: +50~100만원\n• 자원 관리 (룸, 인원 등): +100만원 이상\n\n어떤 서비스 예약인가요? 미용실, 병원, 숙박 등 업종에 따라 최적화된 방식이 달라요.`,
    tips: [
      "예약 복잡도에 따른 가격 차이 설명",
      "업종별 특화 기능 언급",
      "결제 연동 여부 확인"
    ]
  },
  {
    id: "func-4",
    category: "기능 문의",
    question: "회원가입/로그인 기능이 필요해요",
    situation: "회원 시스템을 요청할 때",
    answer: `회원 기능 가능합니다!\n\n회원 시스템 범위에 따라:\n\n• 기본 회원가입/로그인: +30~50만원\n• 소셜 로그인 (카카오/네이버): +10~20만원 추가\n• 마이페이지 + 주문내역: +50만원 추가\n• 등급/포인트 시스템: +100만원 이상\n\n회원들이 어떤 활동을 하게 되나요? 구매, 예약, 커뮤니티 등에 따라 필요한 기능이 달라져요.`,
    tips: [
      "회원 기능 범위 구체화",
      "소셜 로그인 편의성 어필",
      "회원 활동 목적 파악"
    ]
  },

  // ========== 일정 문의 ==========
  {
    id: "time-1",
    category: "일정 문의",
    question: "몇 주/몇 개월 걸리나요?",
    situation: "고객이 제작 기간을 물어볼 때",
    answer: `프로젝트 규모에 따라 다르지만, 일반적인 기준을 말씀드리면:\n\n• 간단한 홈페이지 (5페이지 내외): 2~4주\n• 템플릿 + 커스텀 기능: 4~8주\n• 완전 맞춤 시스템 개발: 8주 이상\n\n다만, 이는 요구사항이 확정된 후 기준이며, 기획 단계나 디자인 수정 횟수에 따라 변동될 수 있습니다.\n\n정확한 일정은 요구사항을 정리한 후 상세 일정표로 안내드리겠습니다.`,
    tips: [
      "범위를 제시하되, 확정이 아님을 명시",
      "고객 측 피드백 속도도 일정에 영향을 준다고 언급",
      "단계별 마일스톤을 제시하면 신뢰도 상승"
    ]
  },
  {
    id: "time-2",
    category: "일정 문의",
    question: "급하게 필요한데, 빨리 할 수 있나요?",
    situation: "촉박한 일정을 요청받을 때",
    answer: `일정이 촉박하시군요. 가능한 범위 내에서 최대한 맞춰드리겠습니다.\n\n다만, 빠른 진행을 위해서는:\n• 요구사항이 명확하게 정리되어야 합니다\n• 피드백을 빠르게 주셔야 합니다\n• 급행 진행 시 추가 비용이 발생할 수 있습니다\n\n희망하시는 런칭일이 언제인가요? 확인 후 가능한 일정과 방법을 제안드리겠습니다.`,
    tips: [
      "무조건 OK보다는 조건을 명시",
      "고객 측 협조가 필요함을 자연스럽게 전달",
      "급행비 가능성을 미리 언급하여 기대치 조정"
    ]
  },
  {
    id: "time-3",
    category: "일정 문의",
    question: "언제부터 시작할 수 있나요?",
    situation: "프로젝트 착수 시점을 물어볼 때",
    answer: `계약 후 바로 시작 가능합니다!\n\n일반적인 진행 순서는:\n1. 계약금 입금 (보통 50%)\n2. 킥오프 미팅 (요구사항 최종 확인)\n3. 기획/디자인 착수\n\n현재 진행 중인 프로젝트 상황에 따라 1~2주 내 착수가 가능하고요, 급하시면 일정 조율도 가능합니다.\n\n혹시 희망하시는 시작일이 있으신가요?`,
    tips: [
      "계약 절차 간단히 안내",
      "현재 가용 상황 투명하게 공유",
      "고객 희망일 먼저 파악"
    ]
  },

  // ========== 비용 문의 ==========
  {
    id: "cost-1",
    category: "비용 문의",
    question: "대략 얼마 정도 드나요?",
    situation: "고객이 예산을 확인하고 싶을 때",
    answer: `기능 범위에 따라 다양한데요, 대략적인 기준을 말씀드리면:\n\n• 기본 홈페이지 (정보형): 150~300만원\n• 기능 추가형 (예약, 게시판 등): 300~500만원\n• 쇼핑몰/회원 시스템: 500~1,000만원\n• 복잡한 맞춤 시스템: 1,000만원 이상\n\n혹시 내부적으로 생각하시는 예산 범위가 있으시면 말씀해 주세요. 그에 맞춰 최적의 구성을 제안드릴 수 있습니다.`,
    tips: [
      "범위를 먼저 제시하고, 역으로 예산을 물어보기",
      "예산에 맞춘 '맞춤 제안'이 가능함을 어필",
      "저가 경쟁보다 가치 제안에 집중"
    ]
  },
  {
    id: "cost-2",
    category: "비용 문의",
    question: "왜 이렇게 비싼가요? / 다른 곳은 더 싸던데요",
    situation: "가격에 대한 저항이 있을 때",
    answer: `좋은 질문입니다. 가격 차이가 나는 이유를 설명드릴게요.\n\n저희는 단순히 템플릿을 적용하는 것이 아니라:\n• 고객사에 맞춘 기획과 UX 설계\n• 검색엔진 최적화(SEO) 기본 적용\n• 반응형 웹 (PC/모바일 최적화)\n• 제작 후 안정화 기간 지원\n\n등을 포함하고 있습니다.\n\n저렴한 곳은 템플릿 그대로 사용하거나, 추후 수정 시 추가 비용이 발생하는 경우가 많습니다.\n\n장기적으로 봤을 때 유지보수와 확장성까지 고려하면 오히려 효율적인 투자가 됩니다.`,
    tips: [
      "방어적이지 않고, 가치를 설명하는 톤 유지",
      "포함된 서비스 항목을 구체적으로 나열",
      "저가 업체의 리스크를 간접적으로 언급"
    ]
  },
  {
    id: "cost-3",
    category: "비용 문의",
    question: "할인 가능한가요?",
    situation: "가격 협상을 요청할 때",
    answer: `네, 상황에 따라 조율 가능합니다!\n\n현재 제가 드릴 수 있는 담당자 할인은 20만원 정도인데요.\n\n추가로:\n• 계약금 선결제 시 추가 할인\n• 장기 유지보수 계약 시 제작비 할인\n• 추천인이 있으시면 소개 할인\n\n등의 방법이 있어요.\n\n혹시 생각하시는 예산이 있으시면 말씀해주세요. 그 안에서 최선의 구성을 맞춰드릴게요!`,
    tips: [
      "담당자 권한 할인 카드 활용",
      "할인 조건을 명확히 제시",
      "예산 역질문으로 협상 주도권 확보"
    ]
  },
  {
    id: "cost-4",
    category: "비용 문의",
    question: "결제는 어떻게 하나요?",
    situation: "결제 방식을 물어볼 때",
    answer: `결제는 보통 3단계로 나눠서 진행해요:\n\n1. 계약금 (50%): 계약 시\n2. 중도금 (30%): 디자인 확정 시\n3. 잔금 (20%): 최종 납품 시\n\n또는 규모가 작으면 계약금 50% + 잔금 50%로 간단히 진행하기도 합니다.\n\n세금계산서 발행도 가능하고요, 카드 결제는 수수료가 추가될 수 있어요.\n\n어떤 방식이 편하신가요?`,
    tips: [
      "단계별 결제로 리스크 분산 설명",
      "세금계산서/카드 옵션 안내",
      "고객 편의에 맞춤 제안"
    ]
  },

  // ========== 유지보수 ==========
  {
    id: "maint-1",
    category: "유지보수",
    question: "완성 후 수정은 어떻게 되나요?",
    situation: "사후 지원에 대해 물어볼 때",
    answer: `제작 완료 후에도 안정화 기간 동안 무상 수정을 지원해드려요.\n\n• 무상 수정 기간: 보통 2~4주\n• 범위: 오류 수정, 텍스트/이미지 교체 등 단순 수정\n\n이후에는 유지보수 계약을 통해 지속적인 관리가 가능합니다:\n• 월 정액제: 월 5~10만원 (소규모 수정 포함)\n• 건별 수정: 수정 내용에 따라 별도 견적\n\n어떤 방식이 편하실 것 같으세요?`,
    tips: [
      "무상 기간과 범위를 명확히",
      "유지보수 계약 자연스럽게 제안",
      "월정액의 편의성 어필"
    ]
  },
  {
    id: "maint-2",
    category: "유지보수",
    question: "직접 수정할 수 있나요?",
    situation: "관리자 페이지/CMS 여부를 물어볼 때",
    answer: `네, 직접 수정하실 수 있도록 관리자 페이지를 제공해드려요!\n\n관리자 페이지에서 가능한 것:\n• 텍스트, 이미지 교체\n• 게시물 작성/수정/삭제\n• 상품 등록 (쇼핑몰의 경우)\n• 예약 관리 (예약 시스템의 경우)\n\n사용법도 간단히 교육해드리고, 매뉴얼도 제공해드립니다.\n\n다만 디자인 레이아웃 변경이나 새 기능 추가는 개발이 필요해요.`,
    tips: [
      "CMS 기능 범위 명확히 설명",
      "교육/매뉴얼 제공 언급",
      "개발 필요 사항 구분"
    ]
  },
  {
    id: "maint-3",
    category: "유지보수",
    question: "호스팅/도메인은 어떻게 되나요?",
    situation: "서버 비용에 대해 물어볼 때",
    answer: `호스팅과 도메인은 별도 비용이에요.\n\n• 도메인: 연 1~3만원 (직접 구매 또는 대행)\n• 호스팅: 월 1~5만원 (트래픽에 따라)\n\n저희가 대행해드릴 수도 있고, 고객님 명의로 직접 구매하셔도 됩니다.\n\n직접 구매하시면 나중에 업체를 바꾸셔도 도메인은 그대로 유지할 수 있어서 추천드려요.\n\n어떤 방식이 편하신가요?`,
    tips: [
      "호스팅/도메인 비용 투명하게 안내",
      "고객 명의 구매 권장 (신뢰도)",
      "대행 옵션도 제공"
    ]
  },

  // ========== 기타 ==========
  {
    id: "etc-1",
    category: "기타",
    question: "포트폴리오/레퍼런스 볼 수 있나요?",
    situation: "이전 작업물을 요청할 때",
    answer: `네, 포트폴리오 보여드릴게요!\n\n[포트폴리오 링크 또는 파일 공유]\n\n업종별로 다양한 사례가 있는데요, 혹시 특별히 참고하고 싶은 스타일이나 업종이 있으시면 말씀해주세요.\n\n비슷한 프로젝트 사례를 중심으로 보여드릴게요.\n\n참고로 일부 프로젝트는 NDA로 인해 공개가 어려운 점 양해 부탁드립니다.`,
    tips: [
      "업종/스타일 맞춤 포트폴리오 제시",
      "NDA 언급으로 신뢰도 상승",
      "고객 니즈에 맞는 사례 선별"
    ]
  },
  {
    id: "etc-2",
    category: "기타",
    question: "계약서는 어떻게 되나요?",
    situation: "계약 절차를 물어볼 때",
    answer: `네, 정식 계약서를 작성합니다.\n\n계약서에 포함되는 내용:\n• 제작 범위 및 기능 명세\n• 일정 및 마일스톤\n• 금액 및 결제 조건\n• 수정 횟수 및 추가 비용 기준\n• 저작권 및 소유권\n• 무상 A/S 기간\n\n계약서 초안을 먼저 보내드리고, 검토 후 서명하시면 됩니다.\n\n전자계약으로 간편하게 진행 가능해요!`,
    tips: [
      "계약서 항목 미리 안내로 전문성 어필",
      "전자계약 편의성 강조",
      "검토 시간 충분히 드림"
    ]
  },
  {
    id: "etc-3",
    category: "기타",
    question: "좀 더 생각해볼게요",
    situation: "고객이 결정을 미룰 때",
    answer: `네, 큰 결정이시니 충분히 고민해보세요!\n\n궁금한 게 생기면 언제든 편하게 연락 주시고요.\n\n참고하실 수 있도록 오늘 상담 내용을 정리해서 견적서와 함께 메일로 보내드릴까요?\n\n다른 업체와 비교해보셔도 좋습니다. 저희가 품질과 사후관리 면에서 가장 자신 있거든요 😊\n\n혹시 결정에 걸리는 부분이 있으시면 말씀해주세요!`,
    tips: [
      "압박하지 않고 여유 제공",
      "견적서 발송으로 연결고리 유지",
      "결정 장애 요인 파악 시도"
    ]
  },
  {
    id: "etc-4",
    category: "기타",
    question: "다른 업체랑 비교 중이에요",
    situation: "경쟁 상황임을 알렸을 때",
    answer: `네, 비교해보시는 게 당연하죠!\n\n저희의 차별점을 말씀드리면:\n\n✓ 담당자 직접 소통 (외주 재하청 없음)\n✓ 제작 후 2주 무상 수정 기간\n✓ 상세한 기획 컨설팅 포함\n✓ 소스코드/저작권 100% 양도\n\n가격만 보시면 저렴한 곳도 있겠지만, 품질과 사후관리까지 고려하시면 저희가 가장 합리적일 거예요.\n\n비교하시다가 궁금한 점 있으시면 언제든 물어봐주세요!`,
    tips: [
      "차별점을 명확하게 어필",
      "저가 업체 리스크 간접 언급",
      "열린 자세로 비교 환영"
    ]
  }
];

const categories = ["전체", "첫 응대", "기능 문의", "일정 문의", "비용 문의", "유지보수", "기타"];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyAnswer = async (faq: FAQ) => {
    await navigator.clipboard.writeText(faq.answer);
    setCopiedId(faq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <MessageSquareText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">FAQ & 응대 가이드</h1>
            <p className="text-gray-500 font-medium">실제 상담에서 자주 나오는 질문과 모범 답변입니다.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="질문이나 키워드로 검색..."
            className="w-full h-14 bg-white border border-gray-200 rounded-xl pl-12 pr-4 font-bold text-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-black transition-all
                ${selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="card overflow-hidden"
          >
            {/* Question Header */}
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full p-6 text-left flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag tag-primary font-black uppercase tracking-widest">{faq.category}</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{faq.question}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1.5">{faq.situation}</p>
                  </div>
                </div>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-gray-300 transition-transform mt-2 ${expandedId === faq.id ? "rotate-180" : ""}`}
              />
            </button>

            {/* Answer Content */}
            {expandedId === faq.id && (
              <div className="px-6 pb-6 border-t border-gray-50 animate-fade-in-up">
                {/* Answer */}
                <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest">
                      <ThumbsUp className="w-4 h-4" />
                      Best Response
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyAnswer(faq); }}
                      className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-indigo-600 transition-all"
                    >
                      {copiedId === faq.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 font-black">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>COPY RESPONSE</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-gray-700 font-medium whitespace-pre-line leading-relaxed text-lg">
                    {faq.answer}
                  </div>
                </div>

                {/* Tips */}
                {faq.tips && (
                  <div className="mt-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-4 text-xs font-black text-amber-600 uppercase tracking-widest">
                      <Lightbulb className="w-4 h-4" />
                      Sales Tips
                    </div>
                    <ul className="space-y-3">
                      {faq.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-amber-900/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="card p-20 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 font-bold text-xl">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
