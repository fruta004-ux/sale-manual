"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  FileSearch,
  Palette,
  Code2,
  TestTube,
  Rocket,
  Settings,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FlowStep {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration: string;
  description: string;
  tasks: string[];
  deliverables: string[];
  clientTasks: string[];
  tips: string[];
}

const flowSteps: FlowStep[] = [
  {
    id: "planning",
    number: 1,
    title: "기획 및 분석",
    subtitle: "요구사항 정의",
    icon: FileSearch,
    color: "#6366f1",
    duration: "3~7일",
    description: "프로젝트의 목적, 타깃 고객, 필요 기능을 정의하고 사이트 구조를 설계합니다. 이 단계가 명확해야 이후 과정이 순조롭습니다.",
    tasks: [
      "목적 및 목표 설정",
      "타깃 고객 분석",
      "경쟁사/벤치마킹 사이트 분석",
      "필요 기능 목록 작성",
      "사이트맵(페이지 구조) 설계",
      "콘텐츠 목록 정리"
    ],
    deliverables: [
      "요구사항 정의서",
      "사이트맵",
      "기능 명세서"
    ],
    clientTasks: [
      "원하는 스타일/레퍼런스 사이트 공유",
      "회사 소개 자료, 로고 등 제공",
      "필수 기능 우선순위 결정"
    ],
    tips: [
      "이 단계에서 요구사항이 명확할수록 이후 수정이 줄어듭니다",
      "고객에게 레퍼런스 사이트 3~5개를 요청하면 취향 파악에 도움됩니다"
    ]
  },
  {
    id: "design",
    number: 2,
    title: "디자인",
    subtitle: "시각적 설계",
    icon: Palette,
    color: "#22d3ee",
    duration: "5~14일",
    description: "와이어프레임으로 구조를 잡고, 실제 디자인 시안을 제작합니다. 고객 피드백을 반영하여 최종 디자인을 확정합니다.",
    tasks: [
      "와이어프레임 제작",
      "디자인 컨셉 제안",
      "메인 페이지 디자인",
      "서브 페이지 디자인",
      "반응형(모바일) 디자인",
      "디자인 수정 및 확정"
    ],
    deliverables: [
      "와이어프레임",
      "디자인 시안 (PC/모바일)",
      "디자인 가이드"
    ],
    clientTasks: [
      "디자인 시안 검토 및 피드백",
      "수정 요청사항 정리",
      "최종 디자인 승인"
    ],
    tips: [
      "수정 횟수를 미리 협의하세요 (보통 2~3회)",
      "디자인 확정 후 변경은 추가 비용이 발생할 수 있음을 안내하세요"
    ]
  },
  {
    id: "development",
    number: 3,
    title: "개발",
    subtitle: "기능 구현",
    icon: Code2,
    color: "#10b981",
    duration: "7~21일",
    description: "확정된 디자인을 바탕으로 실제 웹사이트를 개발합니다. 프론트엔드(화면)와 백엔드(기능)를 구현합니다.",
    tasks: [
      "퍼블리싱 (HTML/CSS)",
      "인터랙션 구현",
      "기능 개발 (폼, 게시판 등)",
      "관리자 페이지 개발",
      "반응형 구현",
      "외부 서비스 연동"
    ],
    deliverables: [
      "개발 완료된 웹사이트",
      "관리자 페이지",
      "개발 문서"
    ],
    clientTasks: [
      "중간 점검 참여",
      "실제 콘텐츠 준비 (텍스트, 이미지)",
      "테스트 계정 정보 제공 (연동 시)"
    ],
    tips: [
      "개발 중간에 진행 상황을 공유하면 고객 불안감이 줄어듭니다",
      "콘텐츠가 늦어지면 일정이 지연될 수 있음을 미리 안내하세요"
    ]
  },
  {
    id: "testing",
    number: 4,
    title: "테스트",
    subtitle: "품질 검증",
    icon: TestTube,
    color: "#f59e0b",
    duration: "3~7일",
    description: "개발된 웹사이트의 기능, 디자인, 호환성을 검증합니다. 발견된 오류를 수정하고 최종 품질을 확보합니다.",
    tasks: [
      "기능 테스트",
      "크로스 브라우저 테스트",
      "모바일 기기 테스트",
      "속도/성능 테스트",
      "보안 점검",
      "버그 수정"
    ],
    deliverables: [
      "테스트 보고서",
      "수정 완료 보고"
    ],
    clientTasks: [
      "테스트 환경에서 직접 확인",
      "발견된 문제 피드백",
      "최종 승인"
    ],
    tips: [
      "다양한 기기와 브라우저에서 테스트해야 합니다",
      "고객에게도 테스트 참여를 요청하면 만족도가 높아집니다"
    ]
  },
  {
    id: "launch",
    number: 5,
    title: "배포/런칭",
    subtitle: "사이트 공개",
    icon: Rocket,
    color: "#ef4444",
    duration: "1~3일",
    description: "테스트가 완료된 웹사이트를 실제 서버에 배포하고 도메인을 연결합니다. 검색엔진 등록 등 초기 설정을 진행합니다.",
    tasks: [
      "서버 환경 설정",
      "도메인 연결",
      "SSL 인증서 설치",
      "최종 데이터 이관",
      "검색엔진 등록",
      "분석 도구 설치 (GA 등)"
    ],
    deliverables: [
      "라이브 웹사이트",
      "접속 정보 (관리자 계정 등)",
      "운영 가이드"
    ],
    clientTasks: [
      "도메인 정보 제공",
      "최종 콘텐츠 확인",
      "런칭 일정 확정"
    ],
    tips: [
      "런칭 직후 1~2주는 집중 모니터링이 필요합니다",
      "긴급 연락처를 공유해 두세요"
    ]
  },
  {
    id: "maintenance",
    number: 6,
    title: "유지보수",
    subtitle: "운영 지원",
    icon: Settings,
    color: "#8b5cf6",
    duration: "지속",
    description: "런칭 후 안정화 기간을 거쳐 지속적인 유지보수를 진행합니다. 콘텐츠 업데이트, 기능 추가, 보안 업데이트 등을 지원합니다.",
    tasks: [
      "버그 수정",
      "콘텐츠 업데이트 지원",
      "보안 업데이트",
      "백업 관리",
      "성능 모니터링",
      "기능 추가/개선"
    ],
    deliverables: [
      "월간 리포트 (선택)",
      "백업 파일",
      "업데이트 내역"
    ],
    clientTasks: [
      "수정 요청 전달",
      "콘텐츠 제공",
      "정기 미팅 참여"
    ],
    tips: [
      "유지보수 계약 범위를 명확히 해두세요",
      "긴급 대응과 일반 요청의 처리 시간을 구분하세요"
    ]
  }
];

export default function FlowPage() {
  const [activeStep, setActiveStep] = useState<string>("planning");

  const currentStep = flowSteps.find(s => s.id === activeStep) || flowSteps[0];
  const Icon = currentStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">프로젝트 제작 흐름</h1>
            <p className="text-[#71717a]">홈페이지 제작의 단계별 진행 과정</p>
          </div>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="card p-6 mb-8 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {flowSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = step.id === activeStep;
            const isPast = flowSteps.findIndex(s => s.id === activeStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`
                    flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all
                    ${isActive ? "bg-[#27272a]" : "hover:bg-[#27272a]/50"}
                  `}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-all
                      ${isActive 
                        ? `bg-gradient-to-br from-[${step.color}] to-[${step.color}]/70` 
                        : isPast 
                          ? "bg-[#27272a] border-2 border-[#10b981]"
                          : "bg-[#27272a]"
                      }
                    `}
                    style={isActive ? { background: `linear-gradient(135deg, ${step.color}, ${step.color}99)` } : {}}
                  >
                    <StepIcon className={`w-5 h-5 ${isActive ? "text-white" : isPast ? "text-[#10b981]" : "text-[#71717a]"}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${isActive ? "text-white" : "text-[#71717a]"}`}>
                      STEP {step.number}
                    </div>
                    <div className={`text-sm font-medium ${isActive ? "text-white" : "text-[#a1a1aa]"}`}>
                      {step.title}
                    </div>
                  </div>
                </button>
                {index < flowSteps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-[#3a3a42] mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail */}
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}99)` }}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#71717a]">STEP {currentStep.number}</div>
                <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                <p className="text-[#a1a1aa]">{currentStep.subtitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#27272a] rounded-xl">
                <Clock className="w-4 h-4 text-[#6366f1]" />
                <span className="text-sm font-medium">{currentStep.duration}</span>
              </div>
            </div>
            <p className="text-[#a1a1aa] leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Tasks */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" style={{ color: currentStep.color }} />
              주요 작업
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStep.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#27272a]/50 rounded-xl"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: currentStep.color }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-[#e8e8ed]">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Tasks */}
          <div className="card p-6 border-[#f59e0b]/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#f59e0b]" />
              고객 협조 사항
            </h3>
            <div className="space-y-3">
              {currentStep.clientTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[#f59e0b]/10 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#e8e8ed]">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deliverables */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">📦 산출물</h3>
            <div className="space-y-2">
              {currentStep.deliverables.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-[#a1a1aa]"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStep.color }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6 bg-gradient-to-br from-[#6366f1]/10 to-transparent">
            <h3 className="text-lg font-semibold mb-4">💡 영업 팁</h3>
            <div className="space-y-3">
              {currentStep.tips.map((tip, index) => (
                <p key={index} className="text-sm text-[#a1a1aa] leading-relaxed">
                  • {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="card p-4">
            <h4 className="text-sm font-medium text-[#71717a] mb-3">전체 일정 요약</h4>
            <div className="space-y-2">
              {flowSteps.map((step) => (
                <div
                  key={step.id}
                  className={`
                    flex items-center justify-between text-sm p-2 rounded-lg
                    ${step.id === activeStep ? "bg-[#27272a]" : ""}
                  `}
                >
                  <span className={step.id === activeStep ? "text-white" : "text-[#71717a]"}>
                    {step.title}
                  </span>
                  <span className={step.id === activeStep ? "text-white" : "text-[#71717a]"}>
                    {step.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
