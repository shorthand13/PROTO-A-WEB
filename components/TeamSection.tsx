"use client";

import { useState } from "react";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { SiNote } from "react-icons/si";
import { X } from "lucide-react";

type Social = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "linkedin" | "note";
};

type Member = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  socials: Social[];
};

const members: Member[] = [
  {
    name: "砂川 綾香",
    role: "代表 / チーフデザイナー",
    photo: "/ayaka.png",
    bio: "（ダミー）沖縄出身。デザインと経営の両軸でProtoAを牽引。クライアントの課題を深く理解し、本質的な解決策を提案することをモットーとしている。UI/UXデザイン、ブランディング、事業戦略を担当。",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/dummy_ayaka", icon: "instagram" },
      { label: "note", href: "https://note.com/dummy_ayaka", icon: "note" },
    ],
  },
  {
    name: "根間 玄隆",
    role: "コンサルタント",
    photo: "/nema.png",
    bio: "（ダミー）沖縄の中小企業・スタートアップを中心に、業務改善・DX推進のコンサルティングを手がける。現場目線での課題発見と、実行可能な改善提案が強み。",
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/dummy_nema", icon: "facebook" },
    ],
  },
  {
    name: "栗原 元気",
    role: "プロジェクトマネージャー / ビジネスアナリスト / マーケター",
    photo: "/genki.png",
    bio: "（ダミー）プロジェクト管理からデータ分析、マーケティング戦略まで幅広く担当。顧客の成長を数字で捉え、施策に落とし込む。複数のスタートアップ支援経験を持つ。",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/dummy_genki", icon: "linkedin" },
    ],
  },
];

function SocialIcon({ icon, size }: { icon: Social["icon"]; size: number }) {
  if (icon === "instagram") return <FaInstagram size={size} />;
  if (icon === "facebook") return <FaFacebook size={size} />;
  if (icon === "linkedin") return <FaLinkedin size={size} />;
  if (icon === "note") return <SiNote size={size - 2} />;
  return null;
}

export default function TeamSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
        {members.map((member) => (
          <button
            key={member.name}
            onClick={() => setSelected(member)}
            className="rounded-2xl bg-muted p-6 text-center hover:shadow-md hover:bg-muted/80 transition-all cursor-pointer"
          >
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden relative">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-bold text-foreground">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              {member.socials.map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className="text-muted-foreground"
                >
                  <SocialIcon icon={s.icon} size={18} />
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="閉じる"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full overflow-hidden relative">
                <Image
                  src={selected.photo}
                  alt={selected.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">{selected.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selected.role}</p>

              <p className="mt-5 text-sm text-muted-foreground leading-relaxed text-left">
                {selected.bio}
              </p>

              <div className="mt-5 flex items-center gap-4">
                {selected.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <SocialIcon icon={s.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
