import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#141416",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        padding: 40,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 1200,
          height: 630,
          borderRadius: 28,
          border: "3px solid #c03aa8",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 40%), #141416",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            Angel Szymczak
          </h1>

          <h2
            style={{
              marginTop: 32,
              marginBottom: 26,
              color: "#c03aa8",
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: -1,
            }}
          >
            Backend Engineer
          </h2>

          <p
            style={{
              margin: 0,
              color: "#a1a1aa",
              fontSize: 28,
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span>Distributed Systems</span>
            <span style={{ color: "#c03aa8" }}>•</span>
            <span>Ruby</span>
            <span style={{ color: "#c03aa8" }}>•</span>
            <span>TypeScript</span>
            <span style={{ color: "#c03aa8" }}>•</span>
            <span>AWS</span>
          </p>

          <div
            style={{
              marginTop: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              "GitHub",
              "LinkedIn",
              "Twitter",
              "Stack Overflow",
              "Portfolio",
            ].map((label) => (
              <div
                key={label}
                style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 500,
                  padding: "14px 24px",
                  borderRadius: 14,
                  border: "2px solid rgba(192, 58, 168, 0.7)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
