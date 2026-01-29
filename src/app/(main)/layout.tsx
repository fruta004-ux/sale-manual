import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "영업 매뉴얼 | 홈페이지 제작 가이드",
  description: "홈페이지 제작/커스텀 개발 영업을 위한 인터랙티브 매뉴얼",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="flex min-h-screen gradient-mesh">
          <Sidebar />
          <main className="flex-1 ml-[30px] p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
