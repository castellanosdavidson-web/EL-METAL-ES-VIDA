"use client";
import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
  className?: string;
}

export default function AdBanner({ dataAdSlot, dataAdFormat, dataFullWidthResponsive, className }: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error", error);
    }
  }, []);

  return (
    <div className={`relative flex justify-center items-center bg-surface-dim border border-outline-variant/30 min-h-[120px] w-full overflow-hidden ${className}`}>
      <span className="absolute font-label-technical text-xs text-on-surface-variant/30 uppercase tracking-widest pointer-events-none">
        Publicidad
      </span>
      <ins
        className="adsbygoogle relative z-10 w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4672043114418419"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}
