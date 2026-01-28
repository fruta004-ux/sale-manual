"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calculator, 
  ClipboardCheck, 
  MessageSquareText, 
  BookOpen, 
  Home,
  Layers,
  Sparkles,
  Users
} from "lucide-react";

const menuItems = [
  { href: "/", label: "홈", icon: Home, description: "매뉴얼 소개" },
  { href: "/calculator", label: "견적 계산기", icon: Calculator, description: "빠른 견적 산출" },
  { href: "/checklist", label: "체크리스트", icon: ClipboardCheck, description: "고객 니즈 파악" },
  { href: "/checklist-v2", label: "실시간 상담 v2", icon: Users, description: "고객과 함께 보기" },
  { href: "/faq", label: "FAQ & 응대", icon: MessageSquareText, description: "자주 묻는 질문" },
  { href: "/glossary", label: "용어 사전", icon: BookOpen, description: "기술 용어 해설" },
  { href: "/flow", label: "제작 흐름", icon: Layers, description: "프로젝트 단계" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#18181d]/90 backdrop-blur-xl border-r border-[#2a2a32] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a2a32]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">영업 매뉴얼</h1>
            <p className="text-xs text-[#71717a]">홈페이지 제작 가이드</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-transparent border-l-2 border-[#6366f1] text-white" 
                  : "text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#6366f1]" : ""}`} />
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-[#71717a]">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a2a32]">
        <div className="card p-4 bg-gradient-to-br from-[#6366f1]/10 to-[#22d3ee]/10">
          <p className="text-xs text-[#a1a1aa] mb-2">💡 팁</p>
          <p className="text-xs text-[#71717a]">
            견적 계산기로 빠르게 예상 비용을 산출하고, 
            체크리스트로 고객 요구사항을 정리하세요.
          </p>
        </div>
      </div>
    </aside>
  );
}
