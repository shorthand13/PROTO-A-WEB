"use client";

import { useState, useEffect } from "react";
import { Link2, Check } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LineIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .348-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .349-.281.63-.63.63h-2.386c-.345 0-.627-.281-.627-.63V8.108c0-.345.282-.627.627-.627h2.386c.349 0 .63.281.63.63 0 .346-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.627-.631.627-.346 0-.626-.283-.626-.627V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.627.63-.627.345 0 .63.282.63.627v4.771zm-5.741 0c0 .344-.282.627-.631.627-.345 0-.627-.283-.627-.627V8.108c0-.345.282-.627.627-.627.349 0 .631.282.631.627v4.771zm-2.466.627H4.917c-.345 0-.63-.283-.63-.627V8.108c0-.345.285-.627.63-.627.348 0 .63.282.63.627v4.141h1.756c.348 0 .629.283.629.63 0 .346-.281.631-.629.631M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

export default function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    setVisible(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareOnInstagram = () => {
    window.open("https://www.instagram.com/protoa.dx/", "_blank");
  };

  const shareOnLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#5a8a8a]/70 border-t border-[#4a7a7a]/20">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-4 sm:gap-8 px-4 py-3 sm:py-5">
          <button
            onClick={shareOnInstagram}
            className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-[#5a8a8a] hover:bg-white/80 transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon size={18} />
          </button>
          <button
            onClick={shareOnLine}
            className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-[#5a8a8a] hover:bg-white/80 transition-colors"
            aria-label="Share on LINE"
          >
            <LineIcon size={22} />
          </button>
          <button
            onClick={copyLink}
            className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-[#5a8a8a] hover:bg-white/80 transition-colors"
            aria-label="Copy link"
          >
            {copied ? <Check size={18} /> : <Link2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
