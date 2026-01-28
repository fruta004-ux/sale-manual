import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required');
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// 편의를 위한 getter (클라이언트 컴포넌트에서 사용)
export const supabase = typeof window !== 'undefined' 
  ? getSupabase() 
  : null as unknown as SupabaseClient;

// 세션 데이터 타입
export interface SessionData {
  // 사이트 유형
  siteType: string;
  customSiteType: string;
  siteTypeMemo: string;        // 고객에게 보이는 메모
  siteTypePrivateMemo: string; // 나만 보는 메모
  
  // 기획 상태
  hasPlan: string;
  menuStructure: string;
  planMemo: string;
  planPrivateMemo: string;
  
  // 콘텐츠
  hasContent: string;
  contentMemo: string;
  contentPrivateMemo: string;
  
  // 규모
  pageCount: number;
  sectionCount: number;
  sizeMemo: string;
  sizePrivateMemo: string;
  
  // 특수 기능
  features: string[];
  customFeature: string;
  featureMemo: string;
  featurePrivateMemo: string;
  
  // 참고 사이트
  referenceUrls: string[];
  referenceMemo: string;
  referencePrivateMemo: string;
  
  // 일정
  deadline: string; // ISO date string
  deadlineFlexible: boolean;
  scheduleMemo: string;
  schedulePrivateMemo: string;
  
  // 예산
  budget: string;
  customBudget: string;
  budgetMemo: string;
  budgetPrivateMemo: string;
  
  // 기타
  additionalMemo: string;
  additionalPrivateMemo: string;
  
  // 상담사 현재 위치 (동기화 시 전송)
  adminSection: string;
}

export interface Session {
  id: string;
  data: SessionData;
  created_at: string;
  updated_at: string;
}

// 초기 데이터
export const initialSessionData: SessionData = {
  siteType: "",
  customSiteType: "",
  siteTypeMemo: "",
  siteTypePrivateMemo: "",
  
  hasPlan: "",
  menuStructure: "",
  planMemo: "",
  planPrivateMemo: "",
  
  hasContent: "",
  contentMemo: "",
  contentPrivateMemo: "",
  
  pageCount: 5,
  sectionCount: 15,
  sizeMemo: "",
  sizePrivateMemo: "",
  
  features: [],
  customFeature: "",
  featureMemo: "",
  featurePrivateMemo: "",
  
  referenceUrls: ["", "", ""],
  referenceMemo: "",
  referencePrivateMemo: "",
  
  deadline: "",
  deadlineFlexible: false,
  scheduleMemo: "",
  schedulePrivateMemo: "",
  
  budget: "",
  customBudget: "",
  budgetMemo: "",
  budgetPrivateMemo: "",
  
  additionalMemo: "",
  additionalPrivateMemo: "",
  
  adminSection: "sitetype",
};

// 세션 생성
export async function createSession(): Promise<string | null> {
  const id = generateSessionId();
  const client = getSupabase();
  
  const { error } = await client
    .from('sessions')
    .insert({
      id,
      data: initialSessionData,
    });

  if (error) {
    console.error('세션 생성 실패:', error);
    return null;
  }

  return id;
}

// 세션 조회
export async function getSession(id: string): Promise<Session | null> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116: 결과가 없는 경우 (세션이 존재하지 않음)
    if (error.code === 'PGRST116') {
      console.log('세션을 찾을 수 없습니다:', id);
      return null;
    }
    console.error('세션 조회 실패:', error.message, error.code, error.details);
    return null;
  }

  // 기존 세션에 새 필드가 없는 경우 기본값으로 병합
  if (data) {
    data.data = {
      ...initialSessionData,
      ...data.data,
    };
  }

  return data;
}

// 세션 업데이트 (동기화)
export async function updateSession(id: string, sessionData: SessionData): Promise<boolean> {
  const client = getSupabase();
  
  const { error } = await client
    .from('sessions')
    .update({
      data: sessionData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('세션 업데이트 실패:', error);
    return false;
  }

  return true;
}

// 모든 세션 목록 조회
export async function getAllSessions(): Promise<Session[]> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('세션 목록 조회 실패:', error);
    return [];
  }

  return data || [];
}

// 세션 삭제
export async function deleteSession(id: string): Promise<boolean> {
  const client = getSupabase();
  
  const { error } = await client
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('세션 삭제 실패:', error);
    return false;
  }

  return true;
}

// 세션 ID 생성 (6자리 랜덤)
function generateSessionId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 헷갈리는 문자 제외
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
