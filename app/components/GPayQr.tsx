import QRCode from "qrcode";
import { buildDemoUpiUri } from "@/lib/upi";

export async function GPayQr({
  amount,
  note,
  title,
  compact = false,
}: {
  amount: number;
  note: string;
  title?: string;
  compact?: boolean;
}) {
  const { uri, upiId, payeeName } = buildDemoUpiUri(amount, note);
  const dataUrl = await QRCode.toDataURL(uri, {
    width: compact ? 160 : 200,
    margin: 2,
    color: {
      dark: "#13201f",
      light: "#ffffff",
    },
  });

  return (
    <div className={`gpay-box ${compact ? "gpay-box-compact" : ""}`}>
      <div className="gpay-qr-wrap">
        <img
          src={dataUrl}
          alt={`Sample GPay QR code for ₹${amount}`}
          width={compact ? 136 : 164}
          height={compact ? 136 : 164}
          className="gpay-qr-img"
        />
      </div>

      <div className="gpay-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          <span className="pill pill-teal">GPay QR (Demo)</span>
          <strong style={{ fontSize: "1rem", color: "var(--ink)" }}>
            ₹{amount}
          </strong>
        </div>
        {title && (
          <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginTop: "0.3rem" }}>
            {title}
          </div>
        )}
        <p style={{ fontSize: "0.8rem", margin: "0.25rem 0 0.45rem", color: "var(--ink-soft)" }}>
          Sample Google Pay QR preview for <strong>{payeeName}</strong> (for
          display only — no real payment required).
        </p>
        <code>{upiId}</code>
      </div>
    </div>
  );
}
