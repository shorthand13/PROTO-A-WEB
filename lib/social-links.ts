export const LINE_ADD_FRIEND_URL = "https://lin.ee/PHXXo4pj";
export const INSTAGRAM_URL = "https://www.instagram.com/ayakasunakawa/";

/** フッター・お問い合わせ共通の LINE QR（public/line-qr.png）。差し替え時は cacheKey を更新 */
export const LINE_QR_CACHE_KEY = "bf15ce8f";
export const LINE_QR_IMAGE_SRC =
  `/line-qr.png?v=${LINE_QR_CACHE_KEY}` as const;
export const INSTAGRAM_QR_IMAGE_SRC = "/instagram-qr.png" as const;
