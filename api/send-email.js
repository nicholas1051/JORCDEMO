import { Resend } from "resend";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY not set in Vercel env" });
  }

  const resend = new Resend(apiKey);
  const { formType, data } = req.body;

  let subject = "";
  let html = "";

  const fields = (Object.entries(data || {}))
    .map(([k, v]) => `<tr><td style="font-weight:600;padding:6px 12px;border-bottom:1px solid #e5e7eb;white-space:nowrap">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${v || "-"}</td></tr>`)
    .join("");

  const baseHtml = (title) => `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1A472A;padding:24px;text-align:center">
        <h1 style="color:#FFCE1B;margin:0;font-size:20px">JONAH OTUNLA RESOURCE CENTER</h1>
      </div>
      <div style="padding:24px">
        <h2 style="color:#1A472A;margin:0 0 16px">${title}</h2>
        <table style="width:100%;border-collapse:collapse">${fields}</table>
        <p style="color:#6b7280;font-size:12px;margin-top:24px">Sent from jorcenter.org</p>
      </div>
    </div>
  `;

  const titles = {
    contact: "New Contact Form Submission",
    facility: "New Facility Booking Request",
    programs: "New Program Registration",
    community: "New Community Post",
    donate: "New Donation Interest",
  };

  subject = titles[formType] || `New ${formType || "Form"} Submission`;
  html = baseHtml(subject);

  const { error } = await resend.emails.send({
    from: "JORC Website <onboarding@resend.dev>",
    to: "copag1000@gmail.com",
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: error.message || "Resend failed" });
  }

  res.status(200).json({ success: true });
}
