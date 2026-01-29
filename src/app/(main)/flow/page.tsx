"use client";

import { useState } from "react";
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
  AlertCircle,
  Lightbulb
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
    color: "#4f46e5",
    duration: "3~7일",
    description: "프로젝트의 목적, 타깃 고객, 필요 기능을 정의하고 사이트 구조를 설계합니다. 이 단계가 명확해야 이후 과정이 순조롭습니다.",
    tasks: ["목적 및 목표 설정", "타깃 고객 분석", "경쟁사/벤치마킹 사이트 분석", "필요 기능 목록 작성", "사이트맵(페이지 구조) 설계", "콘텐츠 목록 정리"],
    deliverables: ["요구사항 정의서", "사이트맵", "기능 명세서"],
    clientTasks: ["원하는 스타일/레퍼런스 사이트 공유", "회사 소개 자료, 로고 등 제공", "필수 기능 우선순위 결정"],
    tips: ["이 단계에서 요구사항이 명확할수록 이후 수정이 줄어듭니다", "고객에게 레퍼런스 사이트 3~5개를 요청하면 취향 파악에 도움됩니다"]
  },
  {
    id: "design",
    number: 2,
    title: "디자인",
    subtitle: "시각적 설계",
    icon: Palette,
    color: "#0891b2",
    duration: "5~14일",
    description: "와이어프레임으로 구조를 잡고, 실제 디자인 시안을 제작합니다. 고객 피드백을 반영하여 최종 디자인을 확정합니다.",
    tasks: ["와이어프레임 제작", "디자인 컨셉 제안", "메인 페이지 디자인", "서브 페이지 디자인", "반응형(모바일) 디자인", "디자인 수정 및 확정"],
    deliverables: ["와이어프레임", "디자인 시안 (PC/모바일)", "디자인 가이드"],
    clientTasks: ["디자인 시안 검토 및 피드백", "수정 요청사항 정리", "최종 디자인 승인"],
    tips: ["수정 횟수를 미리 협의하세요 (보통 2~3회)", "디자인 확정 후 변경은 추가 비용이 발생할 수 있음을 안내하세요"]
  },
  {
    id: "development",
    number: 3,
    title: "개발",
    subtitle: "기능 구현",
    icon: Code2,
    color: "#059669",
    duration: "7~21일",
    description: "확정된 디자인을 바탕으로 실제 웹사이트를 개발합니다. 프론트엔드(화면)와 백엔드(기능)를 구현합니다.",
    tasks: ["퍼블리싱 (HTML/CSS)", "인터랙션 구현", "기능 개발 (폼, 게시판 등)", "관리자 페이지 개발", "반응형 구현", "외부 서비스 연동"],
    deliverables: ["개발 완료된 웹사이트", "관리자 페이지", "개발 문서"],
    clientTasks: ["중간 점검 참여", "실제 콘텐츠 준비 (텍스트, 이미지)", "테스트 계정 정보 제공 (연동 시)"],
    tips: ["개발 중간에 진행 상황을 공유하면 고객 불안감이 줄어듭니다", "콘텐츠가 늦어지면 일정이 지연될 수 있음을 미리 안내하세요"]
  },
  {
    id: "testing",
    number: 4,
    title: "테스트/QA",
    subtitle: "품질 검증",
    icon: TestTube,
    color: "#8b5cf6",
    duration: "3~5일",
    description: "개발된 웹사이트의 기능, 호환성, 성능을 꼼꼼히 테스트합니다. 발견된 버그를 수정하고 품질을 보장합니다.",
    tasks: ["기능 테스트 (모든 버튼, 폼 동작)", "크로스 브라우저 테스트", "모바일/태블릿 호환성 테스트", "로딩 속도 최적화", "보안 점검", "버그 수정"],
    deliverables: ["테스트 리포트", "버그 수정 완료", "성능 최적화 결과"],
    clientTasks: ["사용자 관점 테스트 참여", "발견된 이슈 리포트", "최종 승인"],
    tips: ["고객에게 직접 테스트해보시라고 권유하세요", "테스트 기간을 충분히 확보해야 런칭 후 문제가 줄어듭니다"]
  },
  {
    id: "launch",
    number: 5,
    title: "배포/런칭",
    subtitle: "사이트 공개",
    icon: Rocket,
    color: "#dc2626",
    duration: "1~3일",
    description: "테스트가 완료된 웹사이트를 실제 서버에 배포하고 도메인을 연결합니다. 검색엔진 등록 등 초기 설정을 진행합니다.",
    tasks: ["서버 환경 설정", "도메인 연결", "SSL 인증서 설치", "최종 데이터 이관", "검색엔진 등록", "분석 도구 설치 (GA 등)"],
    deliverables: ["라이브 웹사이트", "접속 정보 (관리자 계정 등)", "운영 가이드"],
    clientTasks: ["도메인 정보 제공", "최종 콘텐츠 확인", "런칭 일정 확정"],
    tips: ["런칭 직후 1~2주는 집중 모니터링이 필요합니다", "긴급 연락처를 공유해 두세요"]
  },
  {
    id: "maintenance",
    number: 6,
    title: "유지보수",
    subtitle: "운영 지원",
    icon: Settings,
    color: "#f59e0b",
    duration: "계약에 따름",
    description: "런칭 후 안정적인 운영을 위한 지속적인 지원을 제공합니다. 버그 수정, 콘텐츠 업데이트, 기능 추가 등을 진행합니다.",
    tasks: ["정기 백업", "보안 업데이트", "버그/오류 수정", "콘텐츠 업데이트 지원", "성능 모니터링", "기능 추가/개선"],
    deliverables: ["월간 운영 리포트", "백업 파일", "업데이트 내역"],
    clientTasks: ["수정 요청사항 전달", "콘텐츠 제공", "정기 미팅 참여"],
    tips: ["유지보수 계약은 안정적인 수익원입니다", "월 정액 또는 시간당 계약 방식을 제안하세요"]
  }
];

export default function FlowPage() {
  const [activeStep, setActiveStep] = useState<string>("planning");

  const currentStep = flowSteps.find(s => s.id === activeStep) || flowSteps[0];
  const Icon = currentStep.icon;

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">제작 프로세스</h1>
            <p className="text-gray-500 font-medium">기획부터 런칭까지, 표준 제작 일정을 확인하세요.</p>
          </div>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="card p-4 mb-10 overflow-x-auto bg-gray-50/50">
        <div className="flex items-center min-w-max gap-2">
          {flowSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = step.id === activeStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`
                    flex flex-col items-center gap-2 px-6 py-4 rounded-[20px] transition-all
                    ${isActive ? "bg-white shadow-xl shadow-indigo-100 border border-indigo-100" : "hover:bg-gray-100"}
                  `}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "bg-gray-100 text-gray-400"
                      }
                    `}
                    style={isActive ? { backgroundColor: step.color } : {}}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                      Step 0{step.number}
                    </div>
                    <div className={`text-sm font-black ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                      {step.title}
                    </div>
                  </div>
                </button>
                {index < flowSteps.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-gray-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5" style={{ color: currentStep.color }}>
               <Icon className="w-40 h-40" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: currentStep.color }}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-[0.2em] mb-1" style={{ color: currentStep.color }}>Phase {currentStep.number}</div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{currentStep.title}</h2>
                <p className="text-gray-500 font-bold text-lg">{currentStep.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-lg font-black text-gray-900">{currentStep.duration}</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Tasks */}
          <div className="card p-10">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7" style={{ color: currentStep.color }} />
              핵심 작업 리스트
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStep.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-100 transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm"
                    style={{ backgroundColor: currentStep.color }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-bold text-base">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Tasks */}
          <div className="card p-8 border-amber-100 bg-amber-50/30">
            <h3 className="text-lg font-black text-amber-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" />
              고객 협조 사항
            </h3>
            <div className="space-y-4">
              {currentStep.clientTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-amber-100 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-amber-900 font-bold text-sm leading-relaxed">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="card p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              Deliverables
            </h3>
            <div className="space-y-3">
              {currentStep.deliverables.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-600 font-bold text-sm"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStep.color }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Sales Tip
            </h3>
            <div className="space-y-4">
              {currentStep.tips.map((tip, index) => (
                <p key={index} className="text-sm font-bold leading-relaxed opacity-90">
                  • {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
