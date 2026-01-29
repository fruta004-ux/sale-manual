"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Tag,
  Lightbulb
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

  const groupedItems = filteredItems.reduce((acc, item) => {
    const firstChar = item.term[0].toUpperCase();
    if (!acc[firstChar]) acc[firstChar] = [];
    acc[firstChar].push(item);
    return acc;
  }, {} as Record<string, GlossaryItem[]>);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-100">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">용어 사전</h1>
            <p className="text-gray-500 font-medium">고객에게 쉽게 설명하기 위한 전문 용어 해설집입니다.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="어떤 용어가 궁금하신가요?"
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
                  ? "bg-amber-500 text-white shadow-md shadow-amber-100"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items */}
      <div className="space-y-8">
        {Object.entries(groupedItems).sort().map(([letter, items]) => (
          <div key={letter} className="relative">
            <div className="sticky top-4 z-10 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100">
                {letter}
              </span>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card p-8 hover:border-amber-300 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-black text-gray-900">{item.term}</h3>
                    <span className="tag tag-primary font-black uppercase tracking-widest">{item.category}</span>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-6 leading-relaxed text-lg">
                    {item.definition}
                  </p>

                  {item.example && (
                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest mb-3">
                        <Lightbulb className="w-4 h-4" />
                        쉽게 설명하기
                      </div>
                      <p className="text-gray-800 font-bold leading-relaxed">{item.example}</p>
                    </div>
                  )}

                  {item.relatedTerms && (
                    <div className="flex items-center gap-2 flex-wrap border-t border-gray-50 pt-4">
                      <Tag className="w-4 h-4 text-gray-300" />
                      {item.relatedTerms.map((term) => (
                        <span
                          key={term}
                          className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-400 border border-gray-100"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="card p-20 text-center">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 font-bold text-xl">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
