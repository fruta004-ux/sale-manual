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

// 플랫폼 타입
export type PlatformType = 'aimweb' | 'cafe24' | 'v0' | 'custom' | '';

// 플랫폼별 정보
export const platformInfo: Record<Exclude<PlatformType, ''>, {
  id: PlatformType;
  name: string;
  nameEn: string;
  description: string;
  recommendFor: string[];
  notRecommendFor: string[];
  priceRange: string;
  timeline: string;
  pros: string[];
  cons: string[];
  warnings: string[];
  tips: string[];
}> = {
  aimweb: {
    id: 'aimweb',
    name: '아임웹',
    nameEn: 'Imweb',
    description: '드래그 앤 드롭 기반의 웹빌더로, 빠르고 쉽게 제작 가능',
    recommendFor: [
      '빠른 제작이 필요한 소상공인/중소기업',
      '브랜드 소개 및 회사 홍보 사이트',
      '랜딩페이지, 원페이지 사이트',
      '포트폴리오 사이트',
      '쇼핑몰 (일반적인 규모)',
      '간단한 예약/문의 기능이 필요한 경우',
      '직접 관리/수정이 필요한 경우',
    ],
    notRecommendFor: [
      '복잡한 회원 권한 체계가 필요한 경우',
      '외부 시스템 연동이 많은 경우',
      '고도화된 검색/필터 기능 필요 시',
    ],
    priceRange: '100~300만원',
    timeline: '1~3주',
    pros: [
      '빠른 제작 속도',
      '직관적인 관리자 페이지',
      '고객이 직접 수정 가능',
      '반응형 모바일 자동 지원',
      '호스팅/SSL 포함',
      '쇼핑몰 기능 지원',
    ],
    cons: [
      '복잡한 기능 구현 제한',
      '커스텀 코드 시 비용 상승',
      '외부 연동 제한적',
    ],
    warnings: [
      '커스텀 코드 개발 시 A등급 이상으로 견적 상승',
    ],
    tips: [
      '"아임웹은 관리가 쉬워서 제작 후 직접 수정하실 수 있어요."',
      '"빠르게 오픈하고 싶으시면 아임웹이 가장 효율적입니다."',
      '"쇼핑몰도 아임웹으로 충분히 가능합니다."',
    ],
  },
  cafe24: {
    id: 'cafe24',
    name: '카페24',
    nameEn: 'Cafe24',
    description: '쇼핑몰 특화 플랫폼, 결제/배송/재고 시스템 기본 내장',
    recommendFor: [
      '쇼핑몰 제작 (의류, 잡화, 식품 등)',
      '유튜버/인플루언서 굿즈샵',
      '네이버페이/카카오페이 연동 필요 시',
      '배송/재고 관리가 필요한 경우',
      '상품 수가 많은 경우',
    ],
    notRecommendFor: [
      '단순 회사 소개 사이트 (아임웹 권장)',
      '포트폴리오/작품 사이트 (아임웹 권장)',
      '비용이 제한적인 경우',
    ],
    priceRange: '150~500만원',
    timeline: '2~4주',
    pros: [
      '쇼핑몰 기능 완벽 지원',
      '다양한 PG사 연동',
      '네이버/카카오 결제 연동',
      '배송사 연동 용이',
      '다양한 스킨 선택 가능',
    ],
    cons: [
      '디자인 자유도 상대적 낮음',
      '스킨 외 커스텀 시 비용 상승',
      '전부 코드로 작업해야 함',
    ],
    warnings: [
      '스킨을 처음부터 만드는 것은 비용이 매우 높음 (비추천)',
      '기존 스킨 구입 후 수정하는 방식을 권장',
      '스킨을 직접 만드는 경우는 판매 목적이 대부분',
    ],
    tips: [
      '"쇼핑몰이면 카페24가 가장 안정적이에요."',
      '"유튜브 운영하시면서 굿즈샵 생각하시면 카페24 좋아요."',
      '"스킨은 구입해서 커스텀하는 게 비용 대비 효율적입니다."',
    ],
  },
  v0: {
    id: 'v0',
    name: 'v0',
    nameEn: 'v0 (AI-based)',
    description: 'AI 기반 빠른 프론트엔드 제작, 소개형 사이트 전용',
    recommendFor: [
      '빠른 시안/프로토타입이 필요한 경우',
      '소개형 사이트 (회사소개, 서비스 안내)',
      '랜딩페이지, 이벤트 페이지',
      '예산이 제한적인 경우',
      '디자인 시안을 빠르게 확인하고 싶은 경우',
    ],
    notRecommendFor: [
      '게시판/댓글 등 데이터 저장 기능 필요 시 ❌',
      '회원가입/로그인 기능 필요 시 ❌',
      '쇼핑몰 (결제, 장바구니) ❌',
      '관리자 페이지가 필요한 경우 ❌',
      '복잡한 인터랙션/애니메이션 필요 시',
    ],
    priceRange: '페이지당 10만원',
    timeline: '1~2주',
    pros: [
      'AI 기반 빠른 제작',
      '비용 효율적',
      '최신 디자인 트렌드 반영',
      '반응형 자동 지원',
    ],
    cons: [
      '데이터 저장 기능 불가',
      '백엔드 연동 별도',
      '복잡한 기능 구현 한계',
      '커스텀 효과는 별도 상담 필요',
    ],
    warnings: [
      '⚠️ 게시판, 댓글, 문의 저장 등 DB 저장 기능 불가',
      '⚠️ 쇼핑몰/결제 기능 불가',
      '⚠️ 회원가입/로그인 기능 불가',
      '소개형(정적) 사이트만 가능',
    ],
    tips: [
      '"소개 목적의 사이트라면 v0로 빠르고 저렴하게 가능해요."',
      '"복잡한 효과나 애니메이션은 별도 상담이 필요합니다."',
      '"v0는 페이지당 약 10만원 정도로 예상하시면 됩니다."',
    ],
  },
  custom: {
    id: 'custom',
    name: '독립형 (커스텀)',
    nameEn: 'Custom Development',
    description: '완전한 맞춤 개발, 기능/디자인 제한 없음. 상담 내용을 AI로 분석하여 1차 견적을 산출합니다.',
    recommendFor: [
      '복잡한 회원/권한 시스템이 필요한 경우',
      '외부 API 연동이 다수인 경우',
      '고급 관리자 기능이 필요한 경우',
      '특수한 비즈니스 로직이 있는 경우',
      '대규모 트래픽 대응이 필요한 경우',
      '자체 서버 운영을 원하는 경우',
    ],
    notRecommendFor: [
      '빠른 제작이 필요한 경우 (아임웹 권장)',
      '예산이 제한적인 경우',
      '단순 소개 사이트',
    ],
    priceRange: 'AI 분석 후 산출',
    timeline: '4~12주+',
    pros: [
      '기능/디자인 제한 없음',
      '완전한 커스텀 가능',
      '확장성 높음',
      '자체 서버 운영 가능',
    ],
    cons: [
      '비용이 높음',
      '제작 기간이 김',
      '별도 유지보수 필요',
    ],
    warnings: [
      '정확한 견적은 상담 내용을 AI로 분석 후 산출됩니다',
      '명확한 기획서가 있으면 더 정확한 견적이 가능합니다',
      '유지보수 계약 별도 협의 필요',
      '서버/인프라 비용 별도',
    ],
    tips: [
      '"커스텀 개발은 요구사항이 다양해서, 말씀하신 내용을 정리한 뒤 AI 분석을 통해 1차 견적을 보내드릴게요."',
      '"기획서나 참고 자료가 있으시면 더 정확한 견적이 가능합니다."',
      '"복잡한 기능이 많으시면 독립형 개발이 오히려 효율적이에요."',
    ],
  },
};

// 세션 데이터 타입
export interface SessionData {
  // 플랫폼 선택
  platform: PlatformType;
  
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
  
  // 커스텀 개발 전용 필드
  customDevNote: string; // 커스텀 개발 상담 내용 (AI 견적용)
  
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
  platform: "",
  
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
  
  customDevNote: "",
  
  adminSection: "sitetype",
};

// 세션 생성 (플랫폼 포함)
export async function createSession(platform: PlatformType = ''): Promise<string | null> {
  const id = generateSessionId();
  const client = getSupabase();
  
  const sessionData: SessionData = {
    ...initialSessionData,
    platform,
  };
  
  const { error } = await client
    .from('sessions')
    .insert({
      id,
      data: sessionData,
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
