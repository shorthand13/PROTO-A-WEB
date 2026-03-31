import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "ProtoA";
  const description = searchParams.get("description") || "中小企業向けDXコンサルティング";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ffffff 0%, #e8f8f5 50%, #f4f4f5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#6b9e9e",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 80px",
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "#6b9e9e",
              color: "white",
              fontSize: "36px",
              fontWeight: 700,
              marginBottom: "32px",
            }}
          >
            CA
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 20 ? "48px" : "56px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
              marginBottom: "16px",
              maxWidth: "900px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              color: "#6b7280",
              lineHeight: 1.5,
              maxWidth: "800px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "20px",
            color: "#6b9e9e",
            fontWeight: 600,
          }}
        >
          protoa.digital
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
