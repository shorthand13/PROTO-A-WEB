"use client";

import { useEffect, useState } from "react";

export function HeroSideTile({
  eventName,
  children,
  className = "",
}: {
  eventName: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName]);

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out ${className}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

export default function HeroSideTiles({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 flex flex-col gap-6 pt-[52px]">
      {children}
    </div>
  );
}
