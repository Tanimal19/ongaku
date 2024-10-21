"use client";

import MainPanel from "@/components/main-panel";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="max-h-screen flex flex-col">
      <Header />
      <MainPanel />
    </div>
  );
}
