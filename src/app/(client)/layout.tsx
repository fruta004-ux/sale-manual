import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "홈페이지 상담",
  description: "상담사와 함께 보는 홈페이지 상담 화면",
};

// 고객 화면은 사이드바 없이 깔끔하게 표시
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="min-h-screen bg-[#0f0f12]">
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
