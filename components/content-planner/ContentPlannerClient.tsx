"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, X, Trash2, ChevronRight, ChevronLeft, Calendar } from "lucide-react";

type Platform = "blog" | "instagram" | "note" | "other";
type Status = "idea" | "inProgress" | "ready" | "published";

interface ContentIdea {
  id: string;
  title: string;
  platform: Platform;
  plannedDate: string;
  notes: string;
  status: Status;
  createdAt: string;
}

const STATUSES: Status[] = ["idea", "inProgress", "ready", "published"];

const PLATFORM_COLORS: Record<Platform, string> = {
  blog: "bg-blue-100 text-blue-700",
  instagram: "bg-pink-100 text-pink-700",
  note: "bg-yellow-100 text-yellow-700",
  other: "bg-gray-100 text-gray-600",
};

const STORAGE_KEY = "protoa_content_ideas";

function loadIdeas(): ContentIdea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIdeas(ideas: ContentIdea[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

export default function ContentPlannerClient() {
  const t = useTranslations("ContentPlanner");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formPlatform, setFormPlatform] = useState<Platform>("blog");
  const [formDate, setFormDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    setIdeas(loadIdeas());
  }, []);

  const persistedSetIdeas = (next: ContentIdea[]) => {
    setIdeas(next);
    saveIdeas(next);
  };

  const handleAdd = () => {
    if (!formTitle.trim()) return;
    const newIdea: ContentIdea = {
      id: crypto.randomUUID(),
      title: formTitle.trim(),
      platform: formPlatform,
      plannedDate: formDate,
      notes: formNotes.trim(),
      status: "idea",
      createdAt: new Date().toISOString(),
    };
    persistedSetIdeas([newIdea, ...ideas]);
    setFormTitle("");
    setFormPlatform("blog");
    setFormDate("");
    setFormNotes("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persistedSetIdeas(ideas.filter((i) => i.id !== id));
  };

  const handleMove = (id: string, direction: "forward" | "back") => {
    persistedSetIdeas(
      ideas.map((idea) => {
        if (idea.id !== id) return idea;
        const idx = STATUSES.indexOf(idea.status);
        const nextIdx =
          direction === "forward"
            ? Math.min(idx + 1, STATUSES.length - 1)
            : Math.max(idx - 1, 0);
        return { ...idea, status: STATUSES[nextIdx] };
      })
    );
  };

  const filtered =
    filterPlatform === "all"
      ? ideas
      : ideas.filter((i) => i.platform === filterPlatform);

  const platforms: Array<Platform | "all"> = ["all", "blog", "instagram", "note", "other"];

  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t("totalIdeas")}: <strong>{ideas.length}</strong>
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              {t("addIdea")}
            </button>
          </div>
        </div>

        {/* Add Idea Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">{t("addIdeaTitle")}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.title")}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={t("form.titlePlaceholder")}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.platform")}
                </label>
                <select
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value as Platform)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                >
                  {(["blog", "instagram", "note", "other"] as Platform[]).map((p) => (
                    <option key={p} value={p}>
                      {t(`platforms.${p}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.plannedDate")}
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("form.notes")}
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t("form.notesPlaceholder")}
                  rows={3}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                {t("form.cancel")}
              </button>
              <button
                onClick={handleAdd}
                disabled={!formTitle.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t("form.add")}
              </button>
            </div>
          </div>
        )}

        {/* Platform Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filterPlatform === p
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {p === "all" ? t("filter.all") : t(`platforms.${p}`)}
            </button>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUSES.map((status) => {
            const columnIdeas = filtered.filter((i) => i.status === status);
            return (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t(`statuses.${status}`)}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {columnIdeas.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3 min-h-24">
                  {columnIdeas.length === 0 && (
                    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border h-24 text-xs text-muted-foreground">
                      {t("empty")}
                    </div>
                  )}
                  {columnIdeas.map((idea) => {
                    const statusIdx = STATUSES.indexOf(idea.status);
                    return (
                      <div
                        key={idea.id}
                        className="rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Platform badge */}
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-2 ${
                            PLATFORM_COLORS[idea.platform]
                          }`}
                        >
                          {t(`platforms.${idea.platform}`)}
                        </span>

                        {/* Title */}
                        <p className="text-sm font-medium text-foreground leading-snug mb-2">
                          {idea.title}
                        </p>

                        {/* Date */}
                        {idea.plannedDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Calendar size={11} />
                            <span>
                              {new Date(idea.plannedDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {idea.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {idea.notes}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleMove(idea.id, "back")}
                              disabled={statusIdx === 0}
                              title={t("move")}
                              className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              onClick={() => handleMove(idea.id, "forward")}
                              disabled={statusIdx === STATUSES.length - 1}
                              title={t("move")}
                              className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(idea.id)}
                            title={t("delete")}
                            className="rounded p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
