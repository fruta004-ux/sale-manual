"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  ShoppingCart,
  CalendarCheck,
  Image,
  Layers,
  FileText,
  Target,
  Palette,
  DollarSign,
  RefreshCw,
  CheckCircle2,
  Users,
  Settings,
  Globe,
  CreditCard,
  MessageSquare,
  Link2,
  Search,
  Calendar,
  ExternalLink
} from "lucide-react";
import { getSupabase, getSession, SessionData, initialSessionData } from "@/lib/supabase";

// ============================================
// 메인 컴포넌트 (고객용)
// ============================================

export default function ClientPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [data, setData] = useState<SessionData>(initialSessionData);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const sectionRefs = {
    sitetype: useRef<HTMLDivElement>(null),
    plan: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    size: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    reference: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    budget: useRef<HTMLDivElement>(null),
    summary: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const loadData = async () => {
      const session = await getSession(sessionId);
      if (session) setData(session.data);
      setLoading(false);
    };
    loadData();

    const supabase = getSupabase();
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        const newData = payload.new as { data: SessionData };
        setData(newData.data);
        setLastUpdate(new Date());
        if (newData.data.adminSection) {
          const ref = sectionRefs[newData.data.adminSection as keyof typeof sectionRefs];
          if (ref?.current) ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      })
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'));

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const estimatedPrice = () => {
    const workScore = Math.max(data.pageCount, Math.ceil(data.sectionCount / 4));
    if (workScore <= 5) return "100~150만원";
    if (workScore <= 8) return "150~200만원";
    if (workScore <= 12) return "200~300만원";
    return "300만원 이상 (협의)";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-100">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">프로젝트 상담 내역</h1>
        <p className="text-gray-500 font-bold">상담사와 실시간으로 공유되는 문서입니다.</p>
        
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {connected ? 'Live Connected' : 'Disconnected'}
          </span>
          {lastUpdate && <span className="text-xs font-bold text-gray-300">· {lastUpdate.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="space-y-6">
        {/* 요약 카드 (항상 상단) */}
        <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CheckCircle2 className="w-32 h-32" />
          </div>
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Current Summary</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 text-xs font-bold mb-1">예상 규모</p>
              <p className="text-2xl font-black">{data.pageCount}P / {data.sectionCount}S</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold mb-1">예상 견적</p>
              <p className="text-2xl font-black text-indigo-400">{estimatedPrice()}</p>
            </div>
          </div>
        </div>

        {/* 세부 항목들 */}
        {[
          { id: 'sitetype', title: '사이트 유형', icon: Target, value: data.customSiteType || data.siteType, memo: data.siteTypeMemo },
          { id: 'plan', title: '기획 상태', icon: FileText, value: data.hasPlan === "yes" ? "기획 완료" : data.hasPlan === "partial" ? "부분 기획" : "기획 필요", memo: data.planMemo },
          { id: 'content', title: '준비된 자료', icon: Palette, value: data.hasContent === "yes" ? "준비 완료" : "준비 필요", memo: data.contentMemo },
          { id: 'features', title: '필요 기능', icon: Settings, value: (data.features || []).length > 0 ? `${(data.features || []).length}개 항목 선택됨` : "기본 기능", memo: data.featureMemo },
          { id: 'schedule', title: '희망 일정', icon: Calendar, value: data.deadline ? new Date(data.deadline).toLocaleDateString() : "미정", memo: data.scheduleMemo },
          { id: 'budget', title: '희망 예산', icon: DollarSign, value: data.customBudget || data.budget, memo: data.budgetMemo },
        ].map((item) => {
          const Icon = item.icon;
          const isHighlighted = data.adminSection === item.id;
          
          return (
            <section 
              key={item.id}
              ref={sectionRefs[item.id as keyof typeof sectionRefs]}
              className={`bg-white border-2 rounded-3xl p-6 transition-all duration-500 ${isHighlighted ? 'border-indigo-600 shadow-2xl shadow-indigo-50 scale-[1.02]' : 'border-gray-50'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isHighlighted ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{item.title}</h3>
                  <p className="text-xl font-black text-gray-900">{item.value || '미정'}</p>
                  {item.memo && (
                    <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                      <p className="text-sm font-bold text-indigo-900 leading-relaxed">{item.memo}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* 참고 사이트 (별도 디자인) */}
        {data.referenceUrls?.some(u => u) && (
          <section ref={sectionRefs.reference} className={`bg-white border-2 rounded-3xl p-6 transition-all ${data.adminSection === 'reference' ? 'border-indigo-600 shadow-2xl' : 'border-gray-50'}`}>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">참고 사이트</h3>
            <div className="space-y-4">
              {data.referenceUrls.filter(u => u).map((url, i) => (
                <div key={i} className="rounded-[20px] overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 truncate max-w-[200px]">{url}</span>
                    <button onClick={() => window.open(url, '_blank')} className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:underline">
                      OPEN <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="relative bg-white" style={{ height: '300px' }}>
                    <div className="absolute top-0 left-0 origin-top-left" style={{ width: '1440px', height: '750px', transform: 'scale(0.3)' }}>
                      <iframe src={url} className="w-full h-full" sandbox="allow-scripts allow-same-origin" title={`Reference ${i+1}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 마지막 요약 메모 */}
        {data.additionalMemo && (
          <div ref={sectionRefs.summary} className={`bg-indigo-50 rounded-[32px] p-8 border-2 ${data.adminSection === 'summary' ? 'border-indigo-600' : 'border-indigo-100'}`}>
            <h3 className="text-indigo-900 font-black text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> 추가 안내 사항
            </h3>
            <p className="text-indigo-900/80 font-bold leading-relaxed">{data.additionalMemo}</p>
          </div>
        )}
      </div>

      <div className="text-center mt-20">
        <p className="text-gray-300 text-xs font-black uppercase tracking-widest">© 2026 Sales Manual Pro · High Quality Service</p>
      </div>
    </div>
  );
}
