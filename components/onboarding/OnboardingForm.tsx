"use client";

import { useActionState, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { submitOnboarding, type OnboardingState } from "@/lib/actions/onboarding";
import { Building2 } from "lucide-react";

const initialState: OnboardingState = { success: false, error: false };

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

export default function OnboardingForm() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitOnboarding,
    initialState
  );

  const [challenges, setChallenges] = useState<string[]>([]);
  const [dxStatus, setDxStatus] = useState("");
  const [dxBarriers, setDxBarriers] = useState<string[]>([]);
  const [desiredSupport, setDesiredSupport] = useState<string[]>([]);

  useEffect(() => {
    if (state.success) {
      router.push("/membership");
    }
  }, [state.success, router]);

  const industryOptions = [
    { value: "建設", label: t("industries.construction") },
    { value: "製造", label: t("industries.manufacturing") },
    { value: "観光・宿泊", label: t("industries.tourism") },
    { value: "飲食", label: t("industries.food") },
    { value: "小売", label: t("industries.retail") },
    { value: "運輸", label: t("industries.transport") },
    { value: "IT", label: t("industries.it") },
    { value: "農業・漁業", label: t("industries.agriculture") },
    { value: "サロン・美容室", label: t("industries.salon") },
    { value: "その他", label: t("industries.other") },
  ];

  const sizeOptions = [
    { value: "1〜5人", label: t("sizes.xs") },
    { value: "6〜20人", label: t("sizes.small") },
    { value: "21〜50人", label: t("sizes.medium") },
    { value: "51人以上", label: t("sizes.large") },
  ];

  const challengeOptions = [
    { value: "人手不足", label: t("challenges.labor") },
    { value: "売上拡大", label: t("challenges.sales") },
    { value: "集客", label: t("challenges.marketing") },
    { value: "業務効率化（IT・デジタル活用）", label: t("challenges.efficiency") },
    { value: "人材育成", label: t("challenges.training") },
    { value: "資金繰り", label: t("challenges.funding") },
    { value: "その他", label: t("challenges.other") },
  ];

  const dxStatusOptions = [
    { value: "まだ何もしていない", label: t("dxStatus.none") },
    { value: "必要性は感じているが、まだ検討段階", label: t("dxStatus.considering") },
    { value: "一部のツールや業務で導入済み", label: t("dxStatus.partial") },
    { value: "積極的に取り組んでいる", label: t("dxStatus.active") },
  ];

  const dxBarrierOptions = [
    { value: "導入・運用の予算がない", label: t("dxBarriers.budget") },
    { value: "担当できる人材・時間がない", label: t("dxBarriers.resources") },
    { value: "何から始めればいいかわからない", label: t("dxBarriers.direction") },
    { value: "導入後に使いこなせるか不安", label: t("dxBarriers.adoption") },
    { value: "相談できる業者や専門家が身近にいない", label: t("dxBarriers.experts") },
    { value: "従業員やスタッフの理解・協力が得にくい", label: t("dxBarriers.staff") },
    { value: "必要性をあまり感じていない", label: t("dxBarriers.noNeed") },
    { value: "すでに取り組んでいるので特に壁はない", label: t("dxBarriers.noBarrier") },
    { value: "その他", label: t("dxBarriers.other") },
  ];

  const supportOptions = [
    { value: "気軽に相談できる窓口（専門家への相談）", label: t("support.consultation") },
    { value: "自社の課題を整理するセミナー・ワークショップ", label: t("support.seminar") },
    { value: "ツール導入や業務改善を一緒に進める伴走支援", label: t("support.handson") },
    { value: "補助金・助成金の情報や申請サポート", label: t("support.subsidy") },
    { value: "社員向けのデジタル研修・講座", label: t("support.training") },
    { value: "他の企業の事例を学べる機会", label: t("support.cases") },
    { value: "特に必要は感じていない", label: t("support.noNeed") },
    { value: "その他", label: t("support.other") },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-8">
        <Building2 className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden fields for checkbox/radio state */}
        <input type="hidden" name="challenges" value={challenges.join(",")} />
        <input type="hidden" name="dxStatus" value={dxStatus} />
        <input type="hidden" name="dxBarriers" value={dxBarriers.join(",")} />
        <input type="hidden" name="desiredSupport" value={desiredSupport.join(",")} />

        {/* Q0: Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("name")} <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder={t("lastNamePlaceholder")}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder={t("firstNamePlaceholder")}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Q1: Company Name */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">
            {t("company")} <span className="text-accent">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            placeholder={t("companyPlaceholder")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Q2: Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-1">
            {t("industry")} <span className="text-accent">*</span>
          </label>
          <select
            id="industry"
            name="industry"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">{t("selectPlaceholder")}</option>
            {industryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Q3: Company Size */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("companySize")} <span className="text-accent">*</span>
          </label>
          <select
            name="companySize"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">{t("selectPlaceholder")}</option>
            {sizeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Q4: Business Challenges (up to 3) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("challengesLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{t("upTo3")}</p>
          <CheckboxGroup
            options={challengeOptions}
            max={3}
            selected={challenges}
            onChange={setChallenges}
          />
        </div>

        {/* Q5: DX Status (choose 1) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("dxStatusLabel")} <span className="text-accent">*</span>
          </label>
          <RadioGroup
            options={dxStatusOptions}
            selected={dxStatus}
            onChange={setDxStatus}
          />
        </div>

        {/* Q6: DX Barriers (top 3) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("dxBarriersLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{t("top3")}</p>
          <CheckboxGroup
            options={dxBarrierOptions}
            max={3}
            selected={dxBarriers}
            onChange={setDxBarriers}
          />
        </div>

        {/* Q7: Desired Support (up to 3) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("supportLabel")} <span className="text-accent">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">{t("upTo3")}</p>
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
          {isPending ? t("saving") : t("submit")}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          {t("skipNote")}
          <button
            type="button"
            onClick={() => router.push("/membership")}
            className="ml-1 text-primary hover:underline"
          >
            {t("skip")}
          </button>
        </p>
      </form>
    </div>
  );
}
