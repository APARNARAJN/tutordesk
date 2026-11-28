import QRCode from "qrcode";
import { buildUpiUri } from "@/lib/upi";
import { CopyButton } from "./CopyButton";

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
  const { uri, upiId, payeeName } = buildUpiUri(amount, note);
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
          alt={`GPay UPI QR code to pay ₹${amount} to ${payeeName}`}
          width={compact ? 136 : 164}
          height={compact ? 136 : 164}
          className="gpay-qr-img"
        />
      </div>

      <div className="gpay-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          <span className="pill pill-teal">GPay / UPI</span>
          <strong style={{ fontSize: "1rem", color: "var(--ink)" }}>
            ₹{amount}
          </strong>
        </div>
        {title && (
          <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)", marginTop: "0.3rem" }}>
            {title}
          </div>
        )}
        <p style={{ fontSize: "0.8rem", margin: "0.25rem 0 0.5rem", color: "var(--ink-soft)" }}>
          Scan with Google Pay, PhonePe, or any UPI app to pay{" "}
          <strong>{payeeName}</strong>.
        </p>

        <div className="gpay-upi-row">
          <code>{upiId}</code>
          <CopyButton text={upiId} label="Copy UPI" />
        </div>

        <a href={uri} className="btn btn-alt btn-sm" style={{ marginTop: "0.55rem" }}>
          Open GPay / UPI App ↗
        </a>
      </div>
    </div>
  );
}
