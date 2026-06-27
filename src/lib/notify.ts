const BASE = import.meta.env.DEV
  ? "http://localhost:5173"
  : "";

export async function sendEmailNotification(
  formType: string,
  data: Record<string, string | undefined>
) {
  const res = await fetch(`${BASE}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, data }),
  });
  if (!res.ok) console.warn("Email notification failed", await res.text());
}
