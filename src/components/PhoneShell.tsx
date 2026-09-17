"use client";

import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
};

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="phone-outer flex min-h-screen items-center justify-center bg-[#1a1614] p-0 md:p-8">
      <div className="phone-frame relative mx-auto w-full max-w-[440px] overflow-hidden bg-black md:rounded-[3rem] md:border md:border-white/10 md:shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:[height:min(956px,calc(100vh-4rem))] md:max-h-[956px]">
        <div className="phone-notch pointer-events-none absolute inset-x-0 top-0 z-20 hidden justify-center pt-3 md:flex">
          <div className="h-[34px] w-[126px] rounded-full bg-black/80" />
        </div>

        <div className="phone-scroll h-full overflow-x-hidden bg-cream md:overflow-y-auto md:[-webkit-overflow-scrolling:touch]">
          {children}
        </div>
      </div>
    </div>
  );
}
