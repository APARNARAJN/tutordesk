export function buildUpiUri(amount: number, note: string) {
  const upiId =
    process.env.OWNER_UPI_ID ||
    process.env.NEXT_PUBLIC_OWNER_UPI_ID ||
    "tutordesk@okicici";
  const payeeName =
    process.env.OWNER_UPI_NAME ||
    process.env.NEXT_PUBLIC_OWNER_UPI_NAME ||
    "TutorDesk";

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });

  return {
    uri: `upi://pay?${params.toString()}`,
    upiId,
    payeeName,
  };
}
