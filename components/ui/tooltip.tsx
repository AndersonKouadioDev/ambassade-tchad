// components/ui/tooltip.tsx
'use client';
import * as React from 'react';

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function TooltipContent({ children }: { children: React.ReactNode, side?: string }) {
  return (
    <div className="z-50 px-2 py-1 rounded bg-black text-white text-xs absolute left-full ml-2 top-1/2 -translate-y-1/2 shadow">
      {children}
    </div>
  );
} 