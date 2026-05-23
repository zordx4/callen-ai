// Dashboard shell - wraps all pages under (app) route group.
// (app) folder name is in parentheses, which means it does NOT appear in the URL.
// So /dashboard, /calls, /agent etc all live inside (app) and share this layout.

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
