import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full bg-blue-600 font-mono">{children}</div>
  );
}
