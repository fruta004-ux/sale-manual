"use client";

import { motion } from "framer-motion";
import { 
  Target, 
  Users, 
  Zap, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const quickActions = [
  {
    href: "/calculator",
    icon: DollarSign,
    title: "견적 계산하기",
    description: "기능별 예상 비용 산출",
    color: "from-[#6366f1] to-[#818cf8]"
  },
  {
    href: "/checklist",
    icon: CheckCircle2,
    title: "체크리스트 작성",
    description: "고객 요구사항 정리",
    color: "from-[#22d3ee] to-[#67e8f9]"
  },
  {
    href: "/faq",
    icon: Users,
    title: "응대 시나리오",
    description: "자주 묻는 질문 대응",
    color: "from-[#10b981] to-[#34d399]"
  },
  {
    href: "/flow",
    icon: Clock,
    title: "제작 흐름 확인",
    description: "프로젝트 단계별 설명",
    color: "from-[#f59e0b] to-[#fbbf24]"
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
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="max-w-6xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 mb-6">
          <Zap className="w-4 h-4 text-[#6366f1]" />
          <span className="text-sm text-[#a5b4fc]">영업 성공을 돕는 도구</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          홈페이지 제작<br />
          <span className="bg-gradient-to-r from-[#6366f1] to-[#22d3ee] bg-clip-text text-transparent">
            영업 매뉴얼
          </span>
        </h1>
        <p className="text-lg text-[#a1a1aa] max-w-2xl">
          고객과의 대화에서 <strong className="text-white">뭘 물어봐야 하는지</strong>, 
          <strong className="text-white"> 어떤 기능이 필요한지</strong>, 
          <strong className="text-white"> 예상 견적/일정</strong>을 
          빠르고 정확하게 대응할 수 있도록 도와드립니다.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div className="card p-6 h-full group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-[#71717a]">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Key Points */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#6366f1]/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#6366f1]" />
          </span>
          영업 핵심 포인트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keyPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="font-semibold text-white">{point.title}</h3>
                </div>
                <ul className="space-y-3">
                  {point.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Production Methods Comparison */}
      <motion.div variants={fadeInUp} className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#22d3ee]/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#22d3ee]" />
          </span>
          제작 방식 비교
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a32]">
                  <th className="text-left p-4 text-[#71717a] font-medium">방식</th>
                  <th className="text-left p-4 text-[#71717a] font-medium">난이도</th>
                  <th className="text-left p-4 text-[#71717a] font-medium">특징</th>
                  <th className="text-left p-4 text-[#71717a] font-medium">적합한 상황</th>
                  <th className="text-left p-4 text-[#71717a] font-medium">예상 비용</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#2a2a32] hover:bg-[#27272a]/50">
                  <td className="p-4 font-medium text-white">홈페이지 빌더</td>
                  <td className="p-4"><span className="tag tag-success">낮음</span></td>
                  <td className="p-4 text-[#a1a1aa]">템플릿 기반, 빠른 제작</td>
                  <td className="p-4 text-[#a1a1aa]">간단 정보형 사이트</td>
                  <td className="p-4 text-[#a1a1aa]">100~300만원</td>
                </tr>
                <tr className="border-b border-[#2a2a32] hover:bg-[#27272a]/50">
                  <td className="p-4 font-medium text-white">CMS (워드프레스)</td>
                  <td className="p-4"><span className="tag tag-warning">중간</span></td>
                  <td className="p-4 text-[#a1a1aa]">템플릿 + 플러그인</td>
                  <td className="p-4 text-[#a1a1aa]">블로그, 기업용, 예약</td>
                  <td className="p-4 text-[#a1a1aa]">200~500만원</td>
                </tr>
                <tr className="hover:bg-[#27272a]/50">
                  <td className="p-4 font-medium text-white">커스텀 개발</td>
                  <td className="p-4"><span className="tag tag-danger">높음</span></td>
                  <td className="p-4 text-[#a1a1aa]">기능/디자인 완전 맞춤</td>
                  <td className="p-4 text-[#a1a1aa]">복잡 기능, 시스템 연동</td>
                  <td className="p-4 text-[#a1a1aa]">500만원~</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div variants={fadeInUp} className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#6366f1]/10 to-[#22d3ee]/10 border border-[#2a2a32]">
        <p className="text-sm text-[#a1a1aa]">
          💡 <strong className="text-white">Tip:</strong> 이 매뉴얼은 지속적으로 업데이트됩니다. 
          기술 변화나 시장 트렌드, 회사 사례를 반영하여 항상 최신 정보를 유지하세요.
        </p>
      </motion.div>
    </motion.div>
  );
}
