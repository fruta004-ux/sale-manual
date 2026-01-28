"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ExternalLink,
  Tag
} from "lucide-react";

interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  example?: string;
  category: string;
  relatedTerms?: string[];
}

const glossaryItems: GlossaryItem[] = [
  // 기본 용어
  {
    id: "1",
    term: "반응형 웹 (Responsive Web)",
    definition: "PC, 태블릿, 모바일 등 다양한 화면 크기에 맞춰 레이아웃이 자동으로 조정되는 웹사이트입니다. 하나의 웹사이트로 모든 기기에서 최적화된 화면을 제공합니다.",
    example: "고객이 스마트폰으로 접속해도 PC와 동일한 콘텐츠를 보기 편한 형태로 볼 수 있습니다.",
    category: "기본 용어",
    relatedTerms: ["모바일 퍼스트", "미디어 쿼리"]
  },
  {
    id: "2",
    term: "CMS (Content Management System)",
    definition: "콘텐츠 관리 시스템. 프로그래밍 지식 없이도 웹사이트의 텍스트, 이미지 등을 쉽게 수정할 수 있는 관리 도구입니다.",
    example: "워드프레스, 아임웹 등이 대표적인 CMS입니다. 관리자 페이지에서 블로그 글을 작성하듯이 콘텐츠를 수정할 수 있습니다.",
    category: "기본 용어",
    relatedTerms: ["워드프레스", "관리자 페이지"]
  },
  {
    id: "3",
    term: "도메인 (Domain)",
    definition: "웹사이트의 고유 주소입니다. 사람들이 웹사이트에 접속할 때 사용하는 인터넷 주소로, 매년 갱신 비용이 발생합니다.",
    example: "www.example.com에서 'example.com'이 도메인입니다. .com, .co.kr, .net 등 다양한 확장자가 있습니다.",
    category: "기본 용어",
    relatedTerms: ["호스팅", "DNS", "SSL"]
  },
  {
    id: "4",
    term: "호스팅 (Hosting)",
    definition: "웹사이트 파일을 저장하고 인터넷에 공개하기 위한 서버 공간을 임대하는 서비스입니다. 웹사이트가 24시간 접속 가능하도록 해줍니다.",
    example: "호스팅이 없으면 웹사이트를 만들어도 다른 사람이 접속할 수 없습니다. 월/연 단위로 비용이 발생합니다.",
    category: "기본 용어",
    relatedTerms: ["서버", "클라우드", "도메인"]
  },
  {
    id: "5",
    term: "SSL 인증서",
    definition: "웹사이트와 방문자 간의 데이터를 암호화하여 보안을 강화하는 인증서입니다. 주소창에 자물쇠 아이콘과 https://로 표시됩니다.",
    example: "SSL이 없으면 브라우저에서 '안전하지 않음' 경고가 표시되어 고객 신뢰도가 떨어집니다. 특히 결제나 회원가입이 있는 사이트에는 필수입니다.",
    category: "기본 용어",
    relatedTerms: ["HTTPS", "보안"]
  },

  // 기능 용어
  {
    id: "6",
    term: "API (Application Programming Interface)",
    definition: "서로 다른 프로그램이나 시스템이 데이터를 주고받을 수 있게 해주는 연결 통로입니다.",
    example: "카카오 지도 API를 연동하면 웹사이트에 지도를 표시할 수 있고, 결제 API를 연동하면 온라인 결제가 가능해집니다.",
    category: "기능 용어",
    relatedTerms: ["연동", "PG사", "외부 시스템"]
  },
  {
    id: "7",
    term: "PG (Payment Gateway)",
    definition: "온라인 결제를 처리해주는 결제 대행 서비스입니다. 신용카드, 계좌이체, 간편결제 등 다양한 결제 수단을 지원합니다.",
    example: "KG이니시스, 토스페이먼츠, NHN KCP 등이 대표적인 PG사입니다. 쇼핑몰 구축 시 필수적으로 연동해야 합니다.",
    category: "기능 용어",
    relatedTerms: ["결제 연동", "API"]
  },
  {
    id: "8",
    term: "게시판 (Board)",
    definition: "사용자들이 글을 작성하고, 읽고, 댓글을 달 수 있는 기능입니다. 공지사항, Q&A, 자유게시판 등 다양한 형태로 활용됩니다.",
    example: "회사 공지사항, 고객 문의 게시판, 상품 리뷰 등에 활용됩니다.",
    category: "기능 용어",
    relatedTerms: ["댓글", "관리자 기능"]
  },
  {
    id: "9",
    term: "관리자 페이지 (Admin Panel)",
    definition: "웹사이트 운영자가 콘텐츠를 관리하고, 회원/주문/통계 등을 확인할 수 있는 별도의 관리 화면입니다.",
    example: "상품 등록, 주문 확인, 회원 관리, 문의 답변 등을 관리자 페이지에서 처리합니다.",
    category: "기능 용어",
    relatedTerms: ["CMS", "대시보드"]
  },

  // 디자인/UX 용어
  {
    id: "10",
    term: "UI (User Interface)",
    definition: "사용자가 보고 상호작용하는 화면의 시각적 요소들입니다. 버튼, 메뉴, 입력창 등 화면에 보이는 모든 것을 포함합니다.",
    example: "버튼의 색상, 크기, 위치, 메뉴의 배치 등이 UI에 해당합니다.",
    category: "디자인/UX",
    relatedTerms: ["UX", "디자인"]
  },
  {
    id: "11",
    term: "UX (User Experience)",
    definition: "사용자가 웹사이트를 이용하면서 느끼는 전체적인 경험입니다. 편리함, 직관성, 만족도 등을 포함합니다.",
    example: "원하는 정보를 쉽게 찾을 수 있는지, 결제 과정이 복잡하지 않은지 등이 UX에 해당합니다.",
    category: "디자인/UX",
    relatedTerms: ["UI", "사용성"]
  },
  {
    id: "12",
    term: "와이어프레임 (Wireframe)",
    definition: "웹사이트의 구조와 레이아웃을 간단한 선과 도형으로 표현한 설계도입니다. 디자인 전 단계에서 구조를 확정하는 데 사용됩니다.",
    example: "색상이나 이미지 없이 '여기에 로고', '여기에 메뉴', '여기에 본문' 등으로 위치만 표시한 것입니다.",
    category: "디자인/UX",
    relatedTerms: ["프로토타입", "목업"]
  },
  {
    id: "13",
    term: "목업 (Mockup)",
    definition: "실제 디자인이 적용된 시안입니다. 와이어프레임에 색상, 이미지, 폰트 등이 적용된 상태로, 완성된 모습을 미리 보여줍니다.",
    example: "디자인 시안, 시안 컨펌 등에서 말하는 것이 목업입니다.",
    category: "디자인/UX",
    relatedTerms: ["와이어프레임", "시안"]
  },

  // 개발 용어
  {
    id: "14",
    term: "프론트엔드 (Frontend)",
    definition: "사용자가 직접 보고 상호작용하는 웹사이트의 화면 부분입니다. HTML, CSS, JavaScript 등으로 구현됩니다.",
    example: "버튼을 클릭했을 때의 애니메이션, 메뉴가 펼쳐지는 효과 등이 프론트엔드 영역입니다.",
    category: "개발 용어",
    relatedTerms: ["백엔드", "풀스택"]
  },
  {
    id: "15",
    term: "백엔드 (Backend)",
    definition: "사용자 눈에 보이지 않는 서버 측 처리를 담당하는 부분입니다. 데이터 저장, 로그인 처리, 결제 처리 등을 담당합니다.",
    example: "회원가입 시 정보를 데이터베이스에 저장하거나, 주문 내역을 관리하는 것이 백엔드 영역입니다.",
    category: "개발 용어",
    relatedTerms: ["프론트엔드", "서버", "데이터베이스"]
  },
  {
    id: "16",
    term: "데이터베이스 (Database)",
    definition: "웹사이트의 모든 데이터를 체계적으로 저장하고 관리하는 저장소입니다.",
    example: "회원 정보, 상품 정보, 주문 내역, 게시글 등 모든 데이터가 데이터베이스에 저장됩니다.",
    category: "개발 용어",
    relatedTerms: ["백엔드", "서버"]
  },

  // 마케팅/SEO 용어
  {
    id: "17",
    term: "SEO (Search Engine Optimization)",
    definition: "검색엔진 최적화. 구글, 네이버 등 검색엔진에서 웹사이트가 상위에 노출되도록 하는 작업입니다.",
    example: "적절한 제목 태그, 메타 설명, 이미지 대체 텍스트, 사이트 속도 개선 등이 SEO 작업에 포함됩니다.",
    category: "마케팅/SEO",
    relatedTerms: ["메타 태그", "키워드"]
  },
  {
    id: "18",
    term: "메타 태그 (Meta Tag)",
    definition: "웹페이지의 정보를 검색엔진과 SNS에 알려주는 보이지 않는 태그입니다.",
    example: "카카오톡에 링크를 공유했을 때 나오는 제목, 설명, 이미지가 메타 태그로 설정됩니다.",
    category: "마케팅/SEO",
    relatedTerms: ["SEO", "OG 태그"]
  },
  {
    id: "19",
    term: "GA (Google Analytics)",
    definition: "구글에서 제공하는 무료 웹사이트 분석 도구입니다. 방문자 수, 유입 경로, 체류 시간 등을 분석할 수 있습니다.",
    example: "어떤 페이지가 인기 있는지, 방문자가 어디서 오는지, 모바일/PC 비율 등을 확인할 수 있습니다.",
    category: "마케팅/SEO",
    relatedTerms: ["분석", "트래킹"]
  },
  {
    id: "20",
    term: "픽셀 (Pixel)",
    definition: "페이스북/인스타그램 광고 성과를 추적하기 위해 웹사이트에 설치하는 추적 코드입니다.",
    example: "광고를 보고 웹사이트에 방문한 사람이 실제로 구매까지 했는지 추적할 수 있습니다.",
    category: "마케팅/SEO",
    relatedTerms: ["리타겟팅", "전환 추적"]
  }
];

const categories = ["전체", "기본 용어", "기능 용어", "디자인/UX", "개발 용어", "마케팅/SEO"];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredItems = glossaryItems.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by first letter for alphabet navigation
  const groupedItems = filteredItems.reduce((acc, item) => {
    const firstChar = item.term[0].toUpperCase();
    if (!acc[firstChar]) acc[firstChar] = [];
    acc[firstChar].push(item);
    return acc;
  }, {} as Record<string, GlossaryItem[]>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">용어 사전</h1>
            <p className="text-[#71717a]">비기술 담당자도 이해할 수 있는 용어 해설</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="용어 검색..."
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
                  ? "bg-[#f59e0b] text-white"
                  : "bg-[#27272a] text-[#a1a1aa] hover:bg-[#3a3a42]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).sort().map(([letter, items]) => (
          <div key={letter}>
            <div className="sticky top-0 z-10 py-2 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#6366f1] text-white font-bold">
                {letter}
              </span>
            </div>
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{item.term}</h3>
                    <span className="tag tag-primary">{item.category}</span>
                  </div>
                  
                  <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                    {item.definition}
                  </p>

                  {item.example && (
                    <div className="p-4 bg-[#27272a]/50 rounded-xl mb-4">
                      <div className="text-xs text-[#71717a] mb-2">💡 쉬운 설명</div>
                      <p className="text-sm text-[#e8e8ed]">{item.example}</p>
                    </div>
                  )}

                  {item.relatedTerms && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-[#71717a]" />
                      {item.relatedTerms.map((term) => (
                        <span
                          key={term}
                          className="px-3 py-1 bg-[#27272a] rounded-full text-xs text-[#a1a1aa]"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-[#71717a] mx-auto mb-4" />
            <p className="text-[#a1a1aa]">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
