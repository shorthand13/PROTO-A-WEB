"use client";

import { useState, useActionState, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Camera, ImagePlus, Trash2 } from "lucide-react";
import { submitFeedback, type FeedbackState } from "@/lib/actions/feedback";

const initialState: FeedbackState = { success: false, error: false };

const RATING_EMOJIS = ["😞", "😐", "🙂", "😊", "🤩"];

export default function FeedbackWidget() {
  const t = useTranslations("Feedback");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitFeedback,
    initialState
  );

  function canScreenCapture() {
    return typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      "getDisplayMedia" in navigator.mediaDevices;
  }

  async function captureScreenshot() {
    setCapturing(true);
    const panel = document.getElementById("feedback-overlay");
    if (panel) panel.style.display = "none";

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        preferCurrentTab: true,
      } as DisplayMediaStreamOptions);

      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")!.drawImage(video, 0, 0);

      stream.getTracks().forEach((t) => t.stop());

      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      setScreenshot(dataUrl);
    } catch (err) {
      console.error("Screenshot capture failed:", err);
    } finally {
      if (panel) panel.style.display = "";
      setCapturing(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Resize to keep payload small
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setScreenshot(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleClose() {
    setOpen(false);
    if (state.success) {
      setRating(null);
      setScreenshot(null);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-primary/90 transition-colors"
        aria-label={t("button")}
      >
        <MessageSquare size={18} />
        <span className="hidden sm:inline">{t("button")}</span>
      </button>

      {/* Feedback panel */}
      {open && (
        <div
          id="feedback-overlay"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {state.success ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-4xl">🎉</div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t("thankYou")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("thankYouMessage")}
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-1 text-lg font-bold text-foreground">
                  {t("title")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("subtitle")}
                </p>

                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="page" value={pathname} />
                  <input
                    type="hidden"
                    name="rating"
                    value={rating ?? ""}
                  />
                  <input
                    ref={screenshotInputRef}
                    type="hidden"
                    name="screenshot"
                    value={screenshot ?? ""}
                  />

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("rating")}
                    </label>
                    <div className="flex gap-2">
                      {RATING_EMOJIS.map((emoji, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i + 1)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors ${
                            rating === i + 1
                              ? "bg-primary/15 ring-2 ring-primary"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="fb-category"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      {t("category")}
                    </label>
                    <select
                      id="fb-category"
                      name="category"
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="usability">{t("categories.usability")}</option>
                      <option value="services">{t("categories.services")}</option>
                      <option value="content">{t("categories.content")}</option>
                      <option value="other">{t("categories.other")}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="fb-message"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      {t("message")}
                    </label>
                    <textarea
                      id="fb-message"
                      name="message"
                      required
                      rows={3}
                      placeholder={t("messagePlaceholder")}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                  </div>

                  {/* Screenshot */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("screenshot")}
                    </label>
                    {screenshot ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <img
                          src={screenshot}
                          alt="Screenshot"
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshot(null)}
                          className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white shadow transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {canScreenCapture() && (
                          <button
                            type="button"
                            onClick={captureScreenshot}
                            disabled={capturing}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                          >
                            <Camera size={16} />
                            {capturing ? t("capturing") : t("captureScreenshot")}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <ImagePlus size={16} />
                          {t("uploadImage")}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {state.error && (
                    <p className="text-sm text-red-500">{t("error")}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending || rating === null}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {isPending ? t("sending") : t("submit")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
