export function buildDemoUpiUri(amount: number, note: string) {
  const upiId = "tutordesk.demo@okicici";
  const payeeName = "TutorDesk";

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
