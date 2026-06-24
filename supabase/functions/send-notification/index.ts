import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "jorctraining@gmail.com";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  schema: string;
  old_record: Record<string, unknown> | null;
}

const formLabels: Record<string, string> = {
  contact_messages: "📬 New Contact Message",
  facility_bookings: "📅 New Facility Booking",
  program_registrations: "📋 New Program Registration",
  donation_intents: "❤️ New Donation Intent",
  comments: "💬 New Comment",
};

function formatRecord(table: string, record: Record<string, unknown>): string {
  switch (table) {
    case "contact_messages":
      return [
        `From: ${record.first_name} ${record.last_name}`,
        `Email: ${record.email}`,
        record.phone ? `Phone: ${record.phone}` : null,
        `Subject: ${record.subject}`,
        `Message: ${record.message}`,
      ].filter(Boolean).join("\n");

    case "facility_bookings":
      return [
        `Organization: ${record.org_name}`,
        `Contact: ${record.contact_person}`,
        `Email: ${record.email}`,
        `Phone: ${record.phone}`,
        `Purpose: ${record.purpose}`,
        `Participants: ${record.participants}`,
        `Date: ${record.date}`,
        `Time: ${record.time_slot}`,
        record.additional_info ? `Notes: ${record.additional_info}` : null,
      ].filter(Boolean).join("\n");

    case "program_registrations":
      return [
        `Program: ${record.program}`,
        `Name: ${record.full_name}`,
        `Email: ${record.email}`,
        `Phone: ${record.phone}`,
        record.message ? `Message: ${record.message}` : null,
      ].filter(Boolean).join("\n");

    case "donation_intents":
      return [
        `Name: ${record.first_name} ${record.last_name}`,
        `Email: ${record.email}`,
        record.country ? `Country: ${record.country}` : null,
        record.phone ? `Phone: ${record.phone}` : null,
        `Amount: ₦${Number(record.amount).toLocaleString()}`,
        record.anonymous ? "Anonymous: Yes" : "Anonymous: No",
      ].filter(Boolean).join("\n");

    case "comments":
      return [
        `Post ID: ${record.post_id}`,
        `Author: ${record.author_name}`,
        `Comment: ${record.content}`,
      ].filter(Boolean).join("\n");

    default:
      return JSON.stringify(record, null, 2);
  }
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const payload: WebhookPayload = await req.json();
    const { table, record } = payload;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response("Missing RESEND_API_KEY", { status: 500 });
    }

    const subject = formLabels[table] || `🔔 New ${table} entry`;
    const body = formatRecord(table, record);
    const html = body.replace(/\n/g, "<br>");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "JORC Notifications <notifications@jorc.ng>",
        to: [NOTIFICATION_EMAIL],
        subject,
        html: `<pre style="font-family:sans-serif;font-size:14px;color:#333;">${html}</pre>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(err, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(err.message, { status: 500 });
  }
});
