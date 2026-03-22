"use client";

import { useActionState, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { submitSurvey, type SurveyState } from "@/lib/actions/survey";
import { ClipboardList, CheckCircle } from "lucide-react";

const initialState: SurveyState = { success: false, error: false };

function CheckboxGroup({
  options,
  max,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  max?: number;
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else if (!max || selected.length < max) {
      onChange([...selected, val]);
    }
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
            selected.includes(opt.value)
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/50"
          } ${!selected.includes(opt.value) && max && selected.length >= max ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            disabled={!selected.includes(opt.value) && !!max && selected.length >= max}
            className="accent-primary"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
            selected === opt.value
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/50"
          }`}
        >
          <input
            type="radio"
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function SurveyForm() {
  const t = useTranslations("Survey");
  const router = useRouter();
  const tQ = useTranslations("Onboarding");
  const [state, formAction, isPending] = useActionState(
    submitSurvey,
    initialState
  );

  const [challenges, setChallenges] = useState<string[]>([]);
  const [dxStatus, setDxStatus] = useState("");
  const [dxBarriers, setDxBarriers] = useState<string[]>([]);
  const [desiredSupport, setDesiredSupport] = useState<string[]>([]);

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  const industryOptions = [
    { value: "建設", label: tQ("industries.construction") },
    { value: "製造", label: tQ("industries.manufacturing") },
    { value: "観光・宿泊", label: tQ("industries.tourism") },
    { value: "飲食", label: tQ("industries.food") },
    { value: "小売", label: tQ("industries.retail") },
    { value: "運輸", label: tQ("industries.transport") },
    { value: "IT", label: tQ("industries.it") },
    { value: "農業・漁業", label: tQ("industries.agriculture") },
    { value: "サロン・美容室", label: tQ("industries.salon") },
    { value: "その他", label: tQ("industries.other") },
  ];

  const sizeOptions = [
    { value: "1〜5人", label: tQ("sizes.xs") },
    { value: "6〜20人", label: tQ("sizes.small") },
    { value: "21〜50人", label: tQ("sizes.medium") },
    { value: "51人以上", label: tQ("sizes.large") },
  ];

  const challengeOptions = [
    { value: "人手不足", label: tQ("challenges.labor") },
    { value: "売上拡大", label: tQ("challenges.sales") },
    { value: "集客", label: tQ("challenges.marketing") },
    { value: "業務効率化（IT・デジタル活用）", label: tQ("challenges.efficiency") },
    { value: "人材育成", label: tQ("challenges.training") },
    { value: "資金繰り", label: tQ("challenges.funding") },
    { value: "その他", label: tQ("challenges.other") },
  ];

  const dxStatusOptions = [
    { value: "まだ何もしていない", label: tQ("dxStatus.none") },
    { value: "必要性は感じているが、まだ検討段階", label: tQ("dxStatus.considering") },
    { value: "一部のツールや業務で導入済み", label: tQ("dxStatus.partial") },
    { value: "積極的に取り組んでいる", label: tQ("dxStatus.active") },
  ];

  const dxBarrierOptions = [
    { value: "導入・運用の予算がない", label: tQ("dxBarriers.budget") },
    { value: "担当できる人材・時間がない", label: tQ("dxBarriers.resources") },
    { value: "何から始めればいいかわからない", label: tQ("dxBarriers.direction") },
    { value: "導入後に使いこなせるか不安", label: tQ("dxBarriers.adoption") },
    { value: "相談できる業者や専門家が身近にいない", label: tQ("dxBarriers.experts") },
    { value: "従業員やスタッフの理解・協力が得にくい", label: tQ("dxBarriers.staff") },
    { value: "必要性をあまり感じていない", label: tQ("dxBarriers.noNeed") },
    { value: "すでに取り組んでいるので特に壁はない", label: tQ("dxBarriers.noBarrier") },
    { value: "その他", label: tQ("dxBarriers.other") },
  ];

  const supportOptions = [
    { value: "気軽に相談できる窓口（専門家への相談）", label: tQ("support.consultation") },
    { value: "自社の課題を整理するセミナー・ワークショップ", label: tQ("support.seminar") },
    { value: "ツール導入や業務改善を一緒に進める伴走支援", label: tQ("support.handson") },
    { value: "補助金・助成金の情報や申請サポート", label: tQ("support.subsidy") },
    { value: "社員向けのデジタル研修・講座", label: tQ("support.training") },
    { value: "他の企業の事例を学べる機会", label: tQ("support.cases") },
    { value: "特に必要は感じていない", label: tQ("support.noNeed") },
    { value: "その他", label: tQ("support.other") },
  ];

  if (state.success) {
    return (
      <div className="rounded-2xl border border-border bg-background p-8 shadow-sm text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("thankYou")}</h2>
        <p className="text-muted-foreground mb-4">{t("thankYouMessage")}</p>
        <p className="text-sm text-muted-foreground mb-6">{t("redirecting")}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-8">
        <ClipboardList className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("time")}</p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="challenges" value={challenges.join(",")} />
        <input type="hidden" name="dxStatus" value={dxStatus} />
        <input type="hidden" name="dxBarriers" value={dxBarriers.join(",")} />
        <input type="hidden" name="desiredSupport" value={desiredSupport.join(",")} />

        {/* Name */}
        <div>
          <label htmlFor="survey-name" className="block text-sm font-medium text-foreground mb-1">
            {t("name")} <span className="text-accent">*</span>
          </label>
          <input
            id="survey-name"
            name="name"
            type="text"
            required
            placeholder={t("namePlaceholder")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="survey-email" className="block text-sm font-medium text-foreground mb-1">
            {t("email")} <span className="text-accent">*</span>
          </label>
          <input
            id="survey-email"
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Q1: Company */}
        <div>
          <label htmlFor="survey-company" className="block text-sm font-medium text-foreground mb-1">
            {tQ("company")} <span className="text-accent">*</span>
          </label>
          <input
            id="survey-company"
            name="company"
            type="text"
            required
            placeholder={tQ("companyPlaceholder")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Q2: Industry */}
        <div>
          <label htmlFor="survey-industry" className="block text-sm font-medium text-foreground mb-1">
            {tQ("industry")} <span className="text-accent">*</span>
          </label>
          <select
            id="survey-industry"
            name="industry"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">{tQ("selectPlaceholder")}</option>
            {industryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Q3: Company Size */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {tQ("companySize")} <span className="text-accent">*</span>
          </label>
          <select
            name="companySize"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">{tQ("selectPlaceholder")}</option>
            {sizeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Q4: Challenges */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {tQ("challengesLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{tQ("upTo3")}</p>
          <CheckboxGroup
            options={challengeOptions}
            max={3}
            selected={challenges}
            onChange={setChallenges}
          />
        </div>

        {/* Q5: DX Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {tQ("dxStatusLabel")} <span className="text-accent">*</span>
          </label>
          <RadioGroup
            options={dxStatusOptions}
            selected={dxStatus}
            onChange={setDxStatus}
          />
        </div>

        {/* Q6: DX Barriers */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {tQ("dxBarriersLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{tQ("top3")}</p>
          <CheckboxGroup
            options={dxBarrierOptions}
            max={3}
            selected={dxBarriers}
            onChange={setDxBarriers}
          />
        </div>

        {/* Q7: Desired Support */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {tQ("supportLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{tQ("upTo3")}</p>
          <CheckboxGroup
            options={supportOptions}
            max={3}
            selected={desiredSupport}
            onChange={setDesiredSupport}
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-500">{t("error")}</p>
        )}

        <button
          type="submit"
          disabled={isPending || !challenges.length || !dxStatus || !dxBarriers.length || !desiredSupport.length}
          className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
}
