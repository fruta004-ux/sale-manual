"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  {
    id: "1",
    category: "기능 문의",
    question: "이 기능도 들어갈 수 있나요?",
    situation: "고객이 특정 기능 구현 가능 여부를 물어볼 때",
    answer: `네, 가능합니다.

다만 기능의 구체적인 범위와 구현 방법에 따라 개발 시간과 비용이 달라집니다.

예를 들어 로그인, 게시판처럼 기본적인 기능은 표준 개발로 빠르게 진행 가능하지만, 외부 시스템과 연동되거나 특수한 로직이 필요한 경우 추가 소요가 발생합니다.

정확한 견적을 위해 원하시는 기능의 상세 요구사항을 말씀해 주시면 검토 후 안내드리겠습니다.`,
    tips: [
      "무조건 '가능합니다'보다는 조건부 긍정으로 답변",
      "구체적인 요구사항을 역으로 질문하여 범위 파악",
      "비슷한 사례가 있다면 언급하여 신뢰도 상승"
    ]
  },
  {
    id: "2",
    category: "일정 문의",
    question: "몇 주/몇 개월 걸리나요?",
    situation: "고객이 제작 기간을 물어볼 때",
    answer: `프로젝트 규모에 따라 다르지만, 일반적인 기준을 말씀드리면:

• 간단한 홈페이지 (5페이지 내외): 2~4주
• 템플릿 + 커스텀 기능: 4~8주  
• 완전 맞춤 시스템 개발: 8주 이상

다만, 이는 요구사항이 확정된 후 기준이며, 기획 단계나 디자인 수정 횟수에 따라 변동될 수 있습니다.

정확한 일정은 요구사항을 정리한 후 상세 일정표로 안내드리겠습니다.`,
    tips: [
      "범위를 제시하되, 확정이 아님을 명시",
      "고객 측 피드백 속도도 일정에 영향을 준다고 언급",
      "단계별 마일스톤을 제시하면 신뢰도 상승"
    ]
  },
  {
    id: "3",
    category: "비용 문의",
    question: "대략 얼마 정도 드나요?",
    situation: "고객이 예산을 확인하고 싶을 때",
    answer: `기능 범위에 따라 다양한데요, 대략적인 기준을 말씀드리면:

• 기본 홈페이지 (정보형): 150~300만원
• 기능 추가형 (예약, 게시판 등): 300~500만원
• 쇼핑몰/회원 시스템: 500~1,000만원
• 복잡한 맞춤 시스템: 1,000만원 이상

혹시 내부적으로 생각하시는 예산 범위가 있으시면 말씀해 주세요. 그에 맞춰 최적의 구성을 제안드릴 수 있습니다.`,
    tips: [
      "범위를 먼저 제시하고, 역으로 예산을 물어보기",
      "예산에 맞춘 '맞춤 제안'이 가능함을 어필",
      "저가 경쟁보다 가치 제안에 집중"
    ]
  },
  {
    id: "4",
    category: "비용 문의",
    question: "왜 이렇게 비싼가요? / 다른 곳은 더 싸던데요",
    situation: "가격에 대한 저항이 있을 때",
    answer: `좋은 질문입니다. 가격 차이가 나는 이유를 설명드릴게요.

저희는 단순히 템플릿을 적용하는 것이 아니라:
• 고객사에 맞춘 기획과 UX 설계
• 검색엔진 최적화(SEO) 기본 적용
• 반응형 웹 (PC/모바일 최적화)
• 제작 후 안정화 기간 지원

등을 포함하고 있습니다.

저렴한 곳은 템플릿 그대로 사용하거나, 추후 수정 시 추가 비용이 발생하는 경우가 많습니다.

장기적으로 봤을 때 유지보수와 확장성까지 고려하면 오히려 효율적인 투자가 됩니다.`,
    tips: [
      "방어적이지 않고, 가치를 설명하는 톤 유지",
      "포함된 서비스 항목을 구체적으로 나열",
      "저가 업체의 리스크를 간접적으로 언급"
    ]
  },
  {
    id: "5",
    category: "일정 문의",
    question: "급하게 필요한데, 빨리 할 수 있나요?",
    situation: "촉박한 일정을 요청받을 때",
    answer: `일정이 촉박하시군요. 가능한 범위 내에서 최대한 맞춰드리겠습니다.

다만, 빠른 진행을 위해서는:
• 요구사항이 명확하게 정리되어야 합니다
• 피드백을 빠르게 주셔야 합니다
• 급행 진행 시 추가 비용이 발생할 수 있습니다

희망하시는 런칭일이 언제인가요? 확인 후 가능한 일정과 방법을 제안드리겠습니다.`,
    tips: [
      "무조건 OK보다는 조건을 명시",
      "고객 측 협조가 필요함을 자연스럽게 전달",
      "급행비 가능성을 미리 언급하여 기대치 조정"
    ]
  },
  {
    id: "6",
    category: "기능 문의",
    question: "나중에 기능 추가할 수 있나요?",
    situation: "확장성에 대해 물어볼 때",
    answer: `네, 물론입니다. 

저희는 처음부터 확장성을 고려하여 설계합니다. 추후 기능 추가나 페이지 확장이 필요하실 때 기존 구조에 자연스럽게 연결할 수 있습니다.

다만, 초기에 어떤 기능을 추가할 가능성이 있는지 미리 말씀해 주시면, 그에 맞게 기반 구조를 설계해 드릴 수 있어 추후 비용을 절감할 수 있습니다.

혹시 지금은 아니지만 나중에 필요할 것 같은 기능이 있으신가요?`,
    tips: [
      "확장 가능함을 확신 있게 답변",
      "미리 알려주면 비용 절감 가능함을 어필",
      "추가 기능 니즈를 역으로 파악하는 기회로 활용"
    ]
  },
  {
    id: "7",
    category: "유지보수",
    question: "제작 후 수정은 어떻게 하나요?",
    situation: "유지보수 방식을 물어볼 때",
    answer: `제작 완료 후 관리 방식은 두 가지가 있습니다:

1. 직접 관리
   - 관리자 페이지를 통해 텍스트, 이미지 등 기본 콘텐츠를 직접 수정
   - 사용법 교육을 제공해 드립니다

2. 유지보수 계약
   - 월/연 단위 계약으로 수정 요청 시 저희가 처리
   - 긴급 대응, 정기 백업, 보안 업데이트 포함

어떤 방식을 선호하시나요? 회사 내부에 관리 담당자가 계신가요?`,
    tips: [
      "두 가지 옵션을 명확히 제시",
      "유지보수 계약의 장점을 자연스럽게 어필",
      "고객 상황에 맞는 추천으로 연결"
    ]
  },
  {
    id: "8",
    category: "기타",
    question: "다른 업체 견적도 받아보고 있어요",
    situation: "경쟁 상황임을 알릴 때",
    answer: `네, 당연히 비교해 보시는 게 좋습니다.

다만 견적을 비교하실 때 몇 가지 체크해 보시면 좋을 점이 있어요:

• 포함된 서비스 범위가 동일한지 (반응형, SEO 등)
• 수정 횟수나 추가 비용 정책
• 제작 후 유지보수/지원 범위
• 실제 포트폴리오와 레퍼런스

저희는 이런 부분들을 투명하게 안내드리고 있고, 단순 가격보다 결과물의 품질과 사후 지원에 자신 있습니다.

비교 검토 후에도 궁금한 점 있으시면 편하게 연락 주세요.`,
    tips: [
      "경쟁을 부정하지 않고 자연스럽게 수용",
      "비교 시 체크포인트를 제시하여 전문성 어필",
      "마지막에 문을 열어두는 클로징"
    ]
  },
  {
    id: "9",
    category: "비용 문의",
    question: "예산을 먼저 말하기 어려워요",
    situation: "고객이 예산 공개를 꺼릴 때",
    answer: `충분히 이해합니다. 

그러면 이렇게 해보시죠. 제가 몇 가지 구성안을 준비해 드릴게요:

• A안: 필수 기능 중심의 기본 구성
• B안: 추천 기능이 포함된 표준 구성  
• C안: 모든 요청사항이 반영된 풀 구성

각각의 예상 비용과 함께 보여드리면, 그중에서 적절한 범위를 선택하시거나 조합하실 수 있습니다.

이 방식이 괜찮으실까요?`,
    tips: [
      "강요하지 않고 대안을 제시",
      "선택지를 주어 고객이 편하게 결정하도록",
      "A/B/C 구성안은 실제로 준비하면 효과적"
    ]
  },
  {
    id: "10",
    category: "기타",
    question: "레퍼런스/포트폴리오 보여주세요",
    situation: "실적을 확인하고 싶을 때",
    answer: `네, 준비되어 있습니다.

저희가 진행한 프로젝트 중 고객님의 업종이나 원하시는 스타일과 비슷한 사례를 선별해서 보내드릴게요.

혹시 특별히 참고하고 싶은 스타일이나 벤치마킹하고 싶은 사이트가 있으신가요? 있으시면 함께 말씀해 주시면 더 적합한 사례를 안내드릴 수 있습니다.`,
    tips: [
      "바로 보내겠다고 하여 준비성 어필",
      "고객의 취향을 역으로 파악하는 기회로 활용",
      "업종별/스타일별 포트폴리오를 미리 정리해두면 좋음"
    ]
  }
];

const categories = ["전체", "기능 문의", "일정 문의", "비용 문의", "유지보수", "기타"];

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center">
            <MessageSquareText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">FAQ & 응대 시나리오</h1>
            <p className="text-[#71717a]">자주 받는 질문과 모범 답변 가이드</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="질문이나 키워드로 검색..."
            className="input-field pl-12"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${selectedCategory === category
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#27272a] text-[#a1a1aa] hover:bg-[#3a3a42]"
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
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card overflow-hidden"
          >
            {/* Question Header */}
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full p-6 text-left flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag tag-primary">{faq.category}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <p className="text-sm text-[#71717a] mt-1">{faq.situation}</p>
                  </div>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-[#71717a] transition-transform ${expandedId === faq.id ? "rotate-180" : ""}`}
              />
            </button>

            {/* Answer Content */}
            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 border-t border-[#2a2a32]">
                    {/* Answer */}
                    <div className="mt-4 p-4 bg-[#27272a]/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-[#10b981]">
                          <ThumbsUp className="w-4 h-4" />
                          모범 답변
                        </div>
                        <button
                          onClick={() => copyAnswer(faq)}
                          className="flex items-center gap-1 text-sm text-[#a1a1aa] hover:text-white transition-colors"
                        >
                          {copiedId === faq.id ? (
                            <>
                              <Check className="w-4 h-4 text-[#10b981]" />
                              <span className="text-[#10b981]">복사됨!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>복사</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-[#e8e8ed] whitespace-pre-line leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>

                    {/* Tips */}
                    {faq.tips && (
                      <div className="mt-4 p-4 bg-[#f59e0b]/10 rounded-xl border border-[#f59e0b]/30">
                        <div className="flex items-center gap-2 mb-3 text-sm text-[#fbbf24]">
                          <Lightbulb className="w-4 h-4" />
                          응대 팁
                        </div>
                        <ul className="space-y-2">
                          {faq.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                              <span className="text-[#fbbf24]">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="card p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-[#71717a] mx-auto mb-4" />
            <p className="text-[#a1a1aa]">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
