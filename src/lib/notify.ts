const BASE = import.meta.env.DEV
  ? "http://localhost:5173"
  : "";

const API_PATH = "/api/send-email.php";

export async function sendEmailNotification(
  formType: string,
  data: Record<string, string | undefined>
) {
  try {
    const res = await fetch(`${BASE}${API_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType, data }),
    });
    const text = await res.text();
    if (!res.ok) console.warn("Email notification failed:", text);
  } catch (e) {
    console.warn("Email notification error:", e);
  }
}
