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
  Lightbulb,
  FileSignature,
  Phone,
  Send,
  Image,
  Monitor,
  Smartphone,
  CreditCard,
  ShieldCheck
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
    id: "contract",
    number: 1,
    title: "계약서 작성",
    subtitle: "계약 및 착수금",
    icon: FileSignature,
    color: "#4f46e5",
    duration: "1~2일",
    description: "프로젝트 범위, 금액, 일정을 합의하고 공식 계약서를 작성합니다. 착수금(계약금)을 수령한 후 프로젝트를 시작합니다.",
    tasks: ["계약 범위 및 금액 합의", "계약서 작성 및 서명", "착수금(계약금) 수령 확인", "프로젝트 킥오프 일정 확정", "담당자 연락처 교환"],
    deliverables: ["공식 계약서", "착수금 입금 확인서", "프로젝트 일정표"],
    clientTasks: ["계약서 검토 및 서명", "착수금 입금", "담당자 지정"],
    tips: ["계약 전 범위를 명확히 해야 추후 분쟁을 예방합니다", "착수금은 보통 총 금액의 50%가 일반적입니다"]
  },
  {
    id: "planning",
    number: 2,
    title: "유선 기획 논의",
    subtitle: "전화 또는 줌 미팅",
    icon: Phone,
    color: "#0891b2",
    duration: "1~3일",
    description: "전화 또는 줌 미팅을 통해 각 메뉴 및 섹션별 들어갈 내용을 상세히 논의합니다. 고객의 비전과 요구사항을 구체화합니다.",
    tasks: ["전체 메뉴 구조 확정", "각 메뉴별 들어갈 내용 논의", "섹션별 구성 방향 결정", "필수 기능 정리", "우선순위 결정", "일정 재확인"],
    deliverables: ["미팅 기록 (메뉴/섹션 정리)", "기획 방향 요약서"],
    clientTasks: ["미팅 시간 확보 (1~2시간)", "원하는 방향성 사전 정리", "경쟁사/참고 사이트 공유"],
    tips: ["미팅 내용을 반드시 문서화하여 고객에게 재확인 받으세요", "가능하면 줌 녹화를 해두면 나중에 참고하기 좋습니다"]
  },
  {
    id: "reference",
    number: 3,
    title: "디자인 레퍼런스 전달",
    subtitle: "고객 → 제작사",
    icon: Image,
    color: "#8b5cf6",
    duration: "2~3일",
    description: "고객이 원하는 디자인 방향의 레퍼런스 사이트나 자료를 전달받습니다. 이를 바탕으로 디자인 컨셉을 잡습니다.",
    tasks: ["레퍼런스 사이트 수집", "고객 선호 스타일 분석", "컬러/톤앤매너 방향 정리", "디자인 컨셉 초안 수립"],
    deliverables: ["레퍼런스 모음", "디자인 방향 문서"],
    clientTasks: ["레퍼런스 사이트 3~5개 전달", "좋아하는 디자인 포인트 설명", "로고/CI 등 브랜드 자료 전달"],
    tips: ["레퍼런스가 구체적일수록 디자인 작업이 빨라집니다", "무엇이 좋은지뿐 아니라 무엇이 싫은지도 물어보세요"]
  },
  {
    id: "content",
    number: 4,
    title: "세부 내용 수령",
    subtitle: "텍스트/이미지 소재",
    icon: Send,
    color: "#059669",
    duration: "3~5일",
    description: "사이트에 들어갈 실제 텍스트, 이미지, 영상 등의 콘텐츠 소재를 고객으로부터 수령합니다.",
    tasks: ["페이지별 텍스트 원고 수령", "이미지/사진 소재 수령", "로고, 아이콘 등 그래픽 소재 정리", "콘텐츠 누락 여부 확인", "추가 소재 요청"],
    deliverables: ["콘텐츠 수령 확인서", "소재 정리 목록"],
    clientTasks: ["페이지별 텍스트 원고 작성", "고해상도 이미지/사진 제공", "회사 로고 원본 파일 전달"],
    tips: ["콘텐츠 수급이 지연되면 전체 일정이 밀립니다. 미리 안내하세요", "소재가 없는 경우 스톡 이미지 사용 비용을 별도 안내하세요"]
  },
  {
    id: "design",
    number: 5,
    title: "PC 디자인 작업",
    subtitle: "메인 디자인 착수",
    icon: Monitor,
    color: "#dc2626",
    duration: "영업일 8~10일",
    description: "수령한 콘텐츠와 레퍼런스를 바탕으로 PC 버전 디자인 작업을 착수합니다. 메인 및 서브 페이지를 모두 디자인합니다.",
    tasks: ["메인 페이지 디자인", "서브 페이지 디자인", "섹션별 레이아웃 구성", "타이포그래피 및 컬러 적용", "아이콘/그래픽 요소 제작", "인터랙션 효과 기획"],
    deliverables: ["PC 디자인 시안 (전체 페이지)", "디자인 가이드"],
    clientTasks: ["디자인 진행 중 중간 확인", "방향성 피드백"],
    tips: ["중간에 한 번 메인 페이지 디자인만 먼저 보여주면 방향 수정이 빨라집니다", "디자인 기간 중 고객 소통을 유지하면 만족도가 높아집니다"]
  },
  {
    id: "revision",
    number: 6,
    title: "디자인 컨펌 및 수정",
    subtitle: "피드백 반영",
    icon: Palette,
    color: "#f59e0b",
    duration: "3~5일",
    description: "완성된 PC 디자인 시안을 고객에게 전달하고 피드백을 받아 수정합니다. 수정은 최대 2회까지이며, 단순 텍스트 수정은 포함되지 않습니다.",
    tasks: ["디자인 시안 전달", "고객 피드백 수렴", "1차 수정 반영", "2차 수정 반영 (필요 시)", "최종 디자인 컨펌"],
    deliverables: ["최종 확정 PC 디자인", "디자인 컨펌 확인서"],
    clientTasks: ["수정 요청사항을 1번에 정리하여 전달 (=1회)", "최종 디자인 승인"],
    tips: ["수정은 정리해서 1번에 보내주시는 것을 1회로 산정합니다 (최대 2회)", "텍스트 수정 등 간단한 수정은 횟수에 포함되지 않습니다", "디자인 확정 후 변경은 추가 비용이 발생함을 미리 안내하세요"]
  },
  {
    id: "responsive",
    number: 7,
    title: "모바일 반응형 최적화",
    subtitle: "PC/MO 대응",
    icon: Smartphone,
    color: "#0891b2",
    duration: "3~5일",
    description: "확정된 PC 디자인을 바탕으로 모바일 반응형 최적화 작업을 진행합니다. PC/모바일만 해당되며, 풀 반응형(태블릿 등)은 포함되지 않습니다.",
    tasks: ["모바일 레이아웃 최적화", "터치 인터랙션 적용", "모바일 네비게이션 구현", "이미지/폰트 최적화", "모바일 테스트"],
    deliverables: ["모바일 최적화 완료", "PC/MO 크로스 체크 결과"],
    clientTasks: ["모바일 화면 테스트 참여", "모바일 사용성 피드백"],
    tips: ["PC/MO만 해당이며 풀 반응형은 아님을 사전에 반드시 고지하세요", "풀 반응형(태블릿 포함) 요청 시 추가 견적이 필요합니다"]
  },
  {
    id: "launch",
    number: 8,
    title: "배포/런칭",
    subtitle: "사이트 공개",
    icon: Rocket,
    color: "#059669",
    duration: "1~2일",
    description: "완성된 웹사이트를 실제 서버에 배포합니다. 검색엔진 등록, 도메인 연결 등의 작업을 진행합니다.",
    tasks: ["서버 배포", "도메인 연결", "SSL 인증서 적용", "검색엔진 등록 (네이버/구글)", "분석 도구 설치 (GA 등)", "최종 동작 테스트"],
    deliverables: ["라이브 웹사이트", "접속 정보 (관리자 계정 등)", "운영 가이드"],
    clientTasks: ["도메인 정보 제공", "최종 확인", "런칭 일정 확정"],
    tips: ["런칭 직후 1~2주는 집중 모니터링 기간임을 안내하세요", "검색엔진 등록은 반영까지 시간이 걸릴 수 있음을 설명하세요"]
  },
  {
    id: "payment",
    number: 9,
    title: "잔금 수령 및 이관",
    subtitle: "최종 마무리",
    icon: CreditCard,
    color: "#4f46e5",
    duration: "1~2일",
    description: "잔금을 수령하고 사이트의 모든 관리 권한을 고객에게 이관합니다. 관리자 계정, 서버 접속 정보 등을 인계합니다.",
    tasks: ["잔금 수령 확인", "관리자 계정 인계", "서버/호스팅 접속 정보 전달", "관리 매뉴얼 제공", "프로젝트 완료 보고"],
    deliverables: ["잔금 수령 확인서", "관리 권한 이관 완료", "운영 매뉴얼"],
    clientTasks: ["잔금 입금", "인계 내용 확인", "관리자 계정 테스트"],
    tips: ["잔금 수령 후 이관이 원칙입니다. 순서를 지키세요", "인계 시 고객이 직접 로그인/관리 테스트를 해보시도록 안내하세요"]
  },
  {
    id: "warranty",
    number: 10,
    title: "하자보수",
    subtitle: "6개월 무상 지원",
    icon: ShieldCheck,
    color: "#dc2626",
    duration: "6개월",
    description: "런칭 후 발생하는 버그 및 오류를 수정합니다. 버튼이 안 눌리는 등의 기술적 하자를 6개월간 무상으로 지원합니다.",
    tasks: ["버그/오류 접수 및 수정", "브라우저 호환성 이슈 대응", "긴급 장애 대응", "소소한 텍스트/이미지 수정"],
    deliverables: ["하자보수 이력", "수정 완료 보고"],
    clientTasks: ["버그/오류 발견 시 접수", "재현 방법 설명"],
    tips: ["하자보수는 기술적 오류 수정에 한정됩니다 (디자인 변경/기능 추가 X)", "6개월 이후는 유지보수 계약 전환을 제안하세요", "하자보수와 추가 개발/변경의 경계를 명확히 하세요"]
  }
];

export default function FlowPage() {
  const [activeStep, setActiveStep] = useState<string>("contract");

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
                      Step {String(step.number).padStart(2, '0')}
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
