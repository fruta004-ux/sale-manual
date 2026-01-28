import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "영업 매뉴얼",
  description: "홈페이지 제작/커스텀 개발 영업을 위한 인터랙티브 매뉴얼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
