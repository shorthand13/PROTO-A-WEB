# Proto-A-Website — プロジェクト仕様書

## 1. プロジェクト概要 / Project Overview

**Proto-A-Website** は、沖縄県宮古島の中小企業を対象とした DX（デジタルトランスフォーメーション）コンサルティングサービスのウェブサイトです。

### ミッション / Mission

宮古島の起業家やビジネスオーナーが直面するデジタル課題を、地元に根ざした親しみやすいアプローチで解決する。

### 課題 / Problem

宮古島の中小企業は DX の必要性を感じているものの、DX 学校のような大手コンサルティング企業は敷居が高く、島のビジネス環境から乖離していると感じることが多い。

### 解決策 / Solution

地元密着型のバイリンガル（日本語・英語）ウェブサイトを通じて、対面またはオンラインでの DX コンサルティング、ブログ、会員限定の動画ライブラリを提供する。

### 技術スタック / Tech Stack

| Technology     | Version/Detail                          |
| -------------- | --------------------------------------- |
| Framework      | Next.js 16 (App Router)                |
| UI Library     | React 19                                |
| Language       | TypeScript (strict mode)                |
| Styling        | Tailwind CSS v4 (CSS-first approach)    |
| Deployment     | Vercel                                  |

---

## 2. ターゲットオーディエンス / Target Audience

### プライマリ / Primary

宮古島の中小企業オーナー・起業家

- **業種**: 飲食店、ホテル・民宿、ダイビングショップ、お土産店、農業、建設業など
- **年齢層**: 30〜60代
- **デバイス**: スマートフォン中心（モバイルファースト必須）
- **技術リテラシー**: 幅広い（初心者〜中級者）
- **コミュニケーション**: LINE が主流（メールではない）
- **課題**: DX の専門用語に戸惑い、何から始めればいいかわからない

### セカンダリ / Secondary

宮古島在住の英語話者（外国人ビジネスオーナー・国際的な住民）

---

## 3. バリュープロポジション / Value Proposition

### ポジショニングステートメント

> 宮古島でビジネスのデジタル化に悩む中小企業オーナーに対して、Proto-A-Website は地元密着型の IT・DX コンサルティングサービスを提供します。大手の DX 学校とは異なり、地元の専門知識を活かした分かりやすく親しみやすいサポートが特徴です。

### 競合との差別化 / Key Differentiators

| 項目                   | DX 学校（大手）         | Proto-A-Website          |
| ---------------------- | ----------------------- | ------------------------ |
| 対応エリア             | 全国展開                | 宮古島特化               |
| コンサルティング形式   | グループ・画一的        | マンツーマン・オンライン |
| 言語                   | 日本語のみ              | 日本語 + 英語            |
| コミュニケーション     | フォーマル              | フレンドリー             |
| 地元ビジネスの理解     | 限定的                  | 深い地元知識             |

---

## 4. サイトマップ / Site Map

```
/[locale]/                          → ホーム
/[locale]/about                     → 会社概要
/[locale]/services                  → サービス一覧
/[locale]/blog                      → ブログ一覧
/[locale]/blog/[slug]               → ブログ記事
/[locale]/case-studies              → 導入事例一覧
/[locale]/case-studies/[slug]       → 導入事例詳細
/[locale]/membership                → 会員ページ（ランディング）
/[locale]/membership/videos         → 動画ライブラリ（要認証）
/[locale]/membership/videos/[slug]  → 動画再生ページ
/[locale]/contact                   → お問い合わせ
/[locale]/login                     → ログイン
```

Locale: `ja`（デフォルト、プレフィックス省略可）、`en`

### ページ詳細 / Page Descriptions

#### ホーム (`/`)
- ヒーローセクション（キャッチコピー + CTA ボタン）
- サービス紹介カード（3〜4 枚）
- 最新ブログ記事（1〜3 件）
- お客様の声（テスティモニアル）スニペット
- フッターにソーシャルメディアリンク

#### 会社概要 (`/about`)
- 創業者ストーリー・ミッション
- なぜ宮古島なのか
- チーム写真・紹介

#### サービス一覧 (`/services`)
- サービスカード一覧:
  - マンツーマン DX コンサルティング
  - オンライン業務改善サポート
  - IT ツール選定支援
  - ワークフローデジタル化
- 各サービスに「お問い合わせ」CTA

#### ブログ一覧 (`/blog`)
- ページネーション付き記事リスト
- タグ/カテゴリフィルター
- 各記事カード: タイトル、抜粋、日付、カバー画像

#### ブログ記事 (`/blog/[slug]`)
- Markdown レンダリング
- 著者情報、公開日、タグ
- 関連記事リンク

#### 導入事例 (`/case-studies`)
- グリッド表示のケーススタディカード
- 業種ラベル、成果サマリー

#### 導入事例詳細 (`/case-studies/[slug]`)
- 課題 → 解決策 → 成果のフォーマット
- クライアントの声（匿名可）

#### 会員ページ (`/membership`)
- 会員特典の説明
- ログイン/新規登録 CTA
- 将来的な料金プラン情報

#### 動画ライブラリ (`/membership/videos`)
- フィルター機能付き動画グリッド
  - カテゴリ別（LINE 公式アカウント設定、Google ビジネスプロフィール、POS システムなど）
  - 難易度別（初級 / 中級 / 上級）
  - 言語別（日本語 / 英語）
- 未認証時: プレビュー + ログイン促進

#### 動画再生ページ (`/membership/videos/[slug]`)
- 動画プレーヤー
- 説明文、カテゴリ、難易度
- 関連動画リスト

#### お問い合わせ (`/contact`)
- フォーム: 名前、会社名、電話番号、メール、メッセージ
- LINE 公式アカウント QR コード（目立つ配置）
- 営業時間

#### ログイン (`/login`)
- Google ログインボタン
- LINE ログインボタン

---

## 5. 機能仕様 / Feature Specifications

### 5.1 国際化 (i18n)

| 項目               | 仕様                                              |
| ------------------ | ------------------------------------------------- |
| ライブラリ         | `next-intl`                                       |
| デフォルトロケール | `ja`                                              |
| 対応ロケール       | `ja`, `en`                                        |
| URL 戦略           | ロケールプレフィックス (`/ja/...`, `/en/...`)      |
| UI 翻訳ファイル    | `messages/ja.json`, `messages/en.json`             |
| ブログコンテンツ   | ロケール別ディレクトリ (`content/blog/ja/`, `content/blog/en/`) |
| ロケール検出       | ブラウザの `Accept-Language` ヘッダー → Cookie 保存 |
| 言語切替           | ヘッダーに言語スイッチャーコンポーネント            |

### 5.2 ブログシステム（Markdown ベース）

**コンテンツ保存先**: `content/blog/ja/` および `content/blog/en/` ディレクトリ内の `.md` / `.mdx` ファイル

**Frontmatter スキーマ**:
```yaml
---
title: "記事タイトル"
date: "2026-03-21"
author: "著者名"
tags: ["DX", "LINE"]
locale: "ja"
excerpt: "記事の抜粋..."
coverImage: "/images/blog/cover.jpg"
published: true
---
```

**技術スタック**:
- `gray-matter` — Frontmatter パース
- `next-mdx-remote` — Markdown/MDX レンダリング
- Next.js `<Image>` による画像最適化
- `generateStaticParams` による静的生成

**機能**:
- タグ/カテゴリフィルタリング
- 日付順ソート
- RSS フィード生成 (`/feed.xml`)

### 5.3 認証（ソーシャルログイン）

| 項目             | 仕様                                                    |
| ---------------- | ------------------------------------------------------- |
| ライブラリ       | `next-auth` v5 (Auth.js) — App Router 対応              |
| プロバイダー     | Google OAuth, LINE Login (OpenID Connect)                |
| セッション戦略   | JWT（初期段階ではデータベースセッション不要）            |
| ユーザーDB       | MVP: SQLite (`better-sqlite3`) / 本番: Supabase 等検討  |
| 保護ルート       | `/membership/*` — 認証必須                              |
| ミドルウェア     | `middleware.ts` で認証チェック                           |
| UI               | `/login` ページにソーシャルログインボタン               |

**LINE Login 設定要件**:
- LINE Developers Console でチャネル作成
- LINE Login チャネル設定
- OpenID Connect プロトコル使用

### 5.4 会員制・動画ライブラリ

**動画ホスティング**: 外部サービス利用（自前ホスティングしない）
- 候補: YouTube（限定公開）、Vimeo OTT、Bunny.net Stream

**動画メタデータ**: `content/videos/` 内の Markdown または JSON ファイル

```yaml
---
title: "LINE 公式アカウントの始め方"
description: "初心者向けに LINE 公式アカウントの作成手順を解説"
category: "LINE"
difficulty: "beginner"
locale: "ja"
videoUrl: "https://..."
thumbnailUrl: "/images/videos/line-setup.jpg"
duration: "12:30"
publishedAt: "2026-03-01"
memberOnly: true
---
```

**フィルタリング**: クライアントサイドでの絞り込み
- カテゴリ（LINE、Google、POS、業務改善など）
- 難易度（初級 / 中級 / 上級）
- 言語（日本語 / 英語）

**アクセス制御**: Server Component で認証チェック → 未認証時はプレビュー + ログイン促進

### 5.5 ソーシャルメディア連携

- **フッター・お問い合わせページ**: LINE 公式アカウント、Instagram、Facebook、X (Twitter)、YouTube
- **LINE 公式アカウント**: QR コード目立つ配置 + モバイルディープリンク
- **OGP**: 全ページに Open Graph / Twitter Card メタタグ

---

## 6. 技術アーキテクチャ / Technical Architecture

### 6.1 ディレクトリ構成

```
app/
  [locale]/
    layout.tsx                # ロケール対応ルートレイアウト
    page.tsx                  # ホーム
    about/page.tsx
    services/page.tsx
    blog/
      page.tsx                # ブログ一覧
      [slug]/page.tsx         # ブログ記事
    case-studies/
      page.tsx
      [slug]/page.tsx
    membership/
      page.tsx                # 会員ランディング
      videos/
        page.tsx              # 動画ライブラリ
        [slug]/page.tsx       # 動画再生
    contact/page.tsx
    login/page.tsx
components/
  ui/                         # 再利用可能な UI プリミティブ
  layout/                     # Header, Footer, Navigation, LanguageSwitcher
  blog/                       # BlogCard, BlogList, TagFilter
  video/                      # VideoCard, VideoGrid, VideoFilter, VideoPlayer
  auth/                       # LoginButton, UserMenu, AuthProvider
lib/
  blog.ts                     # Markdown パース、ブログユーティリティ
  videos.ts                   # 動画メタデータ読み込み
  auth.ts                     # 認証設定
  i18n.ts                     # i18n 設定
content/
  blog/
    ja/                       # 日本語ブログ記事 (.md)
    en/                       # 英語ブログ記事 (.md)
  videos/                     # 動画メタデータ (.md / .json)
messages/
  ja.json                     # 日本語 UI 翻訳
  en.json                     # 英語 UI 翻訳
public/
  images/
  og/                         # Open Graph 画像
```

### 6.2 レンダリング戦略

| ページ                    | 戦略                                      |
| ------------------------- | ----------------------------------------- |
| Home, About, Services     | SSG (静的生成)                            |
| Blog 一覧・記事           | SSG + ISR (`generateStaticParams`)        |
| Case Studies              | SSG + ISR                                 |
| Membership / Videos       | Server Components + 動的レンダリング（認証チェック） |
| Contact フォーム          | Client Component (フォーム) + Server Action (送信) |

### 6.3 フォント

- **メイン**: Noto Sans JP (Google Fonts via `next/font/google`)
- 現在の Geist フォントから置き換え
- CSS 変数 `--font-noto-sans-jp` で管理

### 6.4 スタイリング方針

- Tailwind CSS v4 の CSS-first アプローチを継続
- `globals.css` 内の CSS 変数でブランドカラー定義
- **カラーパレット方向性**: 宮古島をイメージした温かみのある配色
  - オーシャンブルー、コーラル、サンセットオレンジ、サンドベージュ
  - コーポレートブルーは避ける
- **モバイルファースト**: 375px ベース
- **タッチターゲット**: 大きめに確保
- **フォントサイズ**: 本文 16px 以上

### 6.5 デプロイ

- **ホスティング**: Vercel
- **ドメイン**: `.jp` ドメインまたは `.com`（日本語 SEO 考慮）
- **環境変数**: 認証シークレット、API キー等

---

## 7. デザイン方針 / Design Direction

| 項目               | 方針                                                  |
| ------------------ | ----------------------------------------------------- |
| ブランドパーソナリティ | 親しみやすい、地元密着、信頼感、フレンドリー          |
| カラー             | 宮古島の自然をモチーフ（海、珊瑚、夕焼け、砂浜）     |
| タイポグラフィ     | 見出し: 丸みのあるサンセリフ / 本文: 高い可読性       |
| 写真               | 宮古島の実際の写真（ストックフォトは避ける）          |
| アイコン           | シンプルなラインスタイル（`lucide-react`）            |
| レスポンシブ       | モバイルファースト（375px〜）                         |
| アクセシビリティ   | WCAG 2.1 AA 準拠（コントラスト比に特に注意）          |

---

## 8. フェーズ計画 / Phased Delivery

### Phase 1 — MVP

- [x] 全コアページ（ホーム、会社概要、サービス、お問い合わせ）バイリンガル対応
- [x] Markdown ベースのブログシステム
- [x] Google + LINE ソーシャルログイン
- [x] 基本的な会員制動画ライブラリ（5〜10 本の初期コンテンツ）
- [x] カテゴリ・難易度・言語フィルター
- [x] 導入事例ページ（2〜3 件）
- [x] レスポンシブ・モバイルファーストデザイン
- [x] SEO 基盤（メタタグ、OGP、サイトマップ）
- [x] LINE 公式アカウント連携（QR コード、リンク）

### Phase 2 — 拡張

- [ ] 有料会員プラン（Stripe 連携）
- [ ] ブログコメント機能
- [ ] ニュースレター/メール購読
- [ ] ソーシャルメディアフィード埋め込み
- [ ] サイト内検索（ブログ + 動画）
- [ ] 管理者向けアナリティクスダッシュボード

### Phase 3 — 高度な機能

- [ ] 管理画面（コンテンツ管理）
- [ ] コンサルティング予約/スケジューリングシステム
- [ ] チャットウィジェット（LINE またはカスタム）
- [ ] コミュニティフォーラム
- [ ] コース/ラーニングパス（動画コンテンツ）
- [ ] AI チャットボット（基本的な DX 質問対応）

---

## 9. 依存パッケージ / Dependencies

| パッケージ         | 用途                           |
| ------------------ | ------------------------------ |
| `next-intl`        | i18n (App Router 対応)         |
| `next-auth`        | 認証 (Google, LINE)            |
| `gray-matter`      | Markdown frontmatter パース    |
| `next-mdx-remote`  | Markdown/MDX レンダリング      |
| `react-player`     | 動画埋め込み                   |
| `zod`              | スキーマバリデーション         |
| `lucide-react`     | アイコンライブラリ             |

---

## 10. SEO・パフォーマンス / SEO & Performance

### SEO

- `<html lang="ja">` 属性の適切な設定
- `hreflang` タグ（`ja` / `en` ページ間の相互リンク）
- 構造化データ (JSON-LD):
  - `Organization` — 会社情報
  - `LocalBusiness` — 地域ビジネス情報
  - `BlogPosting` — ブログ記事
  - `FAQPage` — よくある質問（該当する場合）
- サイトマップ自動生成
- `robots.txt` 設定

### パフォーマンス目標

| 指標  | 目標値    |
| ----- | --------- |
| LCP   | < 2.5 秒  |
| CLS   | < 0.1     |
| INP   | < 200 ms  |

### 最適化手法

- 全画像を Next.js `<Image>` コンポーネントで最適化（WebP フォーマット）
- フォントの最適化 (`next/font/google`)
- コード分割（App Router のデフォルト動作を活用）
