"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calculator, 
  CheckSquare, 
  HelpCircle, 
  BookOpen, 
  GitMerge,
  LayoutDashboard
} from "lucide-react";

const menuItems = [
  { name: "홈", href: "/", icon: Home },
  { name: "견적 계산기", href: "/calculator", icon: Calculator },
  { name: "체크리스트", href: "/checklist", icon: CheckSquare },
  { name: "체크리스트 v2", href: "/checklist-v2", icon: LayoutDashboard },
  { name: "FAQ / 응대 가이드", href: "/faq", icon: HelpCircle },
  { name: "용어 사전", href: "/glossary", icon: BookOpen },
  { name: "작업 프로세스", href: "/flow", icon: GitMerge },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          영업 매뉴얼
        </h2>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-1">현재 버전</p>
          <p className="text-sm text-gray-900 font-bold">v2.1.0</p>
        </div>
      </div>
    </aside>
  );
}
