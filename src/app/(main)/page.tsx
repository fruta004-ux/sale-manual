"use client";

import { 
  Target, 
  Users, 
  Zap, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  LayoutDashboard,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    href: "/checklist-v2",
    icon: LayoutDashboard,
    title: "상담 시작하기",
    description: "새 상담 세션 생성 및 공유",
    color: "bg-indigo-600",
    shadow: "shadow-indigo-100"
  },
  {
    href: "/calculator",
    icon: DollarSign,
    title: "견적 계산기",
    description: "제작 방식별 자동 견적 산출",
    color: "bg-emerald-600",
    shadow: "shadow-emerald-100"
  },
  {
    href: "/faq",
    icon: Users,
    title: "응대 시나리오",
    description: "자주 묻는 질문 모범 답변",
    color: "bg-amber-500",
    shadow: "shadow-amber-100"
  },
  {
    href: "/flow",
    icon: Clock,
    title: "제작 프로세스",
    description: "단계별 작업 흐름 및 산출물",
    color: "bg-rose-500",
    shadow: "shadow-rose-100"
  }
];

const keyPoints = [
  {
    icon: Target,
    title: "목적 파악",
    items: ["브랜딩용인지, 문의 유도인지, 판매 목적인지 확인", "타깃 고객층 분석", "경쟁사 사이트 참고"]
  },
  {
    icon: Zap,
    title: "기능 확인",
    items: ["문의 폼, 예약, 회원, 쇼핑 기능 필요 여부", "외부 시스템 연동 필요 여부", "관리 방식 (직접/위탁)"]
  },
  {
    icon: TrendingUp,
    title: "예산/일정",
    items: ["예산 범위 파악", "희망 런칭 일정 확인", "유지보수 계획 논의"]
  }
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Sales Assistant Pro</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
          영업 성공을 위한<br />
          <span className="text-indigo-600">스마트 매뉴얼</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          고객에게 필요한 질문을 던지고, 정확한 견적을 산출하며,<br/>
          실시간으로 상담 내용을 공유하여 신뢰를 얻으세요.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group">
              <div className="card p-8 h-full bg-white hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-6 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                </h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Key Points */}
      <div className="mb-20">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <div className="w-1.5 h-7 bg-indigo-600 rounded-full"></div>
          영업 핵심 포인트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keyPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="card p-8 bg-gray-50/50 border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">{point.title}</h3>
                </div>
                <ul className="space-y-4">
                  {point.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-500">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-8 rounded-[32px] bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Target className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-black mb-2 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-400" />
              업데이트 알림
            </h4>
            <p className="text-gray-400 font-bold max-w-xl">
              이 매뉴얼은 실제 영업 사례를 바탕으로 계속 진화합니다. 
              상담 중 발견된 새로운 사례나 필요한 기능이 있다면 언제든 업데이트하세요.
            </p>
          </div>
          <Link href="/checklist-v2" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl">
            지금 상담 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
