import "server-only";

import { createHash } from "node:crypto";
import nodemailer from "nodemailer";

export const formTypes = [
  "contact",
  "booking",
  "package-enquiry",
  "umrah",
  "hajj",
  "international-tour",
  "enquiry",
  "corporate",
  "class",
  "career",
] as const;

export type FormType = (typeof formTypes)[number];
export type MailField = { label: string; value: string };
export type LeadEmail = {
  formType: FormType;
  formName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerFields?: MailField[];
  enquiryFields: MailField[];
};

const labels: Record<FormType, string> = {
  contact: "Contact Enquiry",
  booking: "Booking Enquiry",
  "package-enquiry": "Package Enquiry",
  umrah: "Umrah Survey Submission",
  hajj: "Hajj Enquiry",
  "international-tour": "International Tour Enquiry",
  enquiry: "Travel Enquiry",
  corporate: "Corporate Travel Enquiry",
  class: "Umrah Class Registration",
  career: "Career Application",
};

const hour = 60 * 60 * 1000;
const duplicateWindow = 60 * 1000;
const perIpSubmissions = new Map<string, number[]>();
const recentFingerprints = new Map<string, number>();
let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

export function sanitizeText(value: unknown, maxLength: number, multiline = false): string {
  if (typeof value !== "string") return "";
  const normalized = value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  return (multiline ? normalized : normalized.replace(/\s+/g, " ")).slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]{2,}$/.test(value);
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function readJsonObject(request: Request, maximumBytes = 24_000): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) return null;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > maximumBytes) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function requestIp(request: Request): string {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

export function reserveSubmission(ip: string, formType: FormType, fingerprintData: unknown): "ok" | "limited" | "duplicate" {
  const now = Date.now();
  for (const [key, time] of recentFingerprints) if (now - time > duplicateWindow) recentFingerprints.delete(key);
  for (const [key, timestamps] of perIpSubmissions) {
    const active = timestamps.filter(time => now - time < hour);
    if (active.length) perIpSubmissions.set(key, active);
    else perIpSubmissions.delete(key);
  }
  if (perIpSubmissions.size > 5000) perIpSubmissions.clear();

  const fingerprint = createHash("sha256").update(JSON.stringify([ip, formType, fingerprintData])).digest("hex");
  const previous = recentFingerprints.get(fingerprint);
  if (previous && now - previous < duplicateWindow) return "duplicate";

  const recent = perIpSubmissions.get(ip) || [];
  if (recent.length >= 5) return "limited";
  recent.push(now);
  perIpSubmissions.set(ip, recent);
  recentFingerprints.set(fingerprint, now);
  return "ok";
}

function smtpConfiguration() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim();
  if (!host || !Number.isInteger(port) || !user || !password || !from || !to) return null;
  if (host !== "smtp.hostinger.com" || port !== 465 || from.toLowerCase() !== user.toLowerCase()) return null;
  if (!isValidEmail(user) || !isValidEmail(from) || !isValidEmail(to)) return null;
  return { host, port, user, password, from, to };
}

export function smtpIsConfigured(): boolean {
  return Boolean(smtpConfiguration());
}

function createTransport() {
  const config = smtpConfiguration();
  if (!config) throw new Error("SMTP_CONFIGURATION_MISSING_OR_INVALID");
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: { user: config.user, pass: config.password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
  }
  return { config, transporter };
}

function emailTemplate(input: LeadEmail, submittedAt: string) {
  const label = labels[input.formType];
  const rows = (fields: MailField[]) => fields.map(({ label: fieldLabel, value }) => `
    <tr>
      <th align="left" valign="top" style="padding:12px 14px;border-bottom:1px solid #e8e8e3;color:#53625d;font-size:13px;font-weight:600;width:34%;">${escapeHtml(fieldLabel)}</th>
      <td align="left" valign="top" style="padding:12px 14px;border-bottom:1px solid #e8e8e3;color:#1b2d28;font-size:14px;line-height:1.65;word-break:break-word;white-space:pre-wrap;">${escapeHtml(value || "—")}</td>
    </tr>`).join("");
  const customerFields = input.customerFields?.length ? input.customerFields : [
    { label: "Name", value: input.customerName || "—" },
    { label: "Email", value: input.customerEmail || "—" },
    { label: "Phone / WhatsApp", value: input.customerPhone || "—" },
  ];
  const safeName = sanitizeText(input.customerName, 100);
  const subject = `New ${label}${safeName ? ` — ${safeName}` : ""} | AlAamir International`.slice(0, 180);
  const text = [
    `New ${label} | AlAamir International`,
    `Submitted: ${submittedAt}`,
    "",
    "CUSTOMER INFORMATION",
    ...customerFields.map(field => `${field.label}: ${field.value || "—"}`),
    "",
    input.formName ? `FORM: ${input.formName}` : "",
    "SUBMISSION DETAILS",
    ...input.enquiryFields.map(field => `${field.label}: ${field.value || "—"}`),
  ].filter(Boolean).join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f2f4f2;color:#1b2d28;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f2f4f2;padding:24px 10px;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;background:#ffffff;border:1px solid #e1e5e1;border-radius:8px;overflow:hidden;">
          <tr><td style="background:#142b25;padding:24px 28px;border-bottom:4px solid #c5a267;">
            <p style="margin:0;color:#e0c98f;font-size:12px;letter-spacing:1.5px;font-weight:700;">ALAAMIR INTERNATIONAL</p>
            <h1 style="margin:10px 0 0;color:#ffffff;font-size:23px;line-height:1.35;font-weight:700;">New ${escapeHtml(label)}</h1>
          </td></tr>
          <tr><td style="padding:24px 28px 8px;">
            <p style="margin:0 0 8px;color:#61716b;font-size:13px;">Submitted on</p>
            <p style="margin:0;color:#1b2d28;font-size:15px;font-weight:600;">${escapeHtml(submittedAt)}</p>
            ${input.formName ? `<p style="margin:8px 0 0;color:#61716b;font-size:13px;">Form: ${escapeHtml(sanitizeText(input.formName, 120))}</p>` : ""}
          </td></tr>
          <tr><td style="padding:16px 28px 8px;">
            <h2 style="margin:0 0 10px;color:#142b25;font-size:16px;line-height:1.4;">Customer information</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e8e8e3;border-collapse:collapse;">${rows(customerFields)}</table>
          </td></tr>
          <tr><td style="padding:18px 28px 26px;">
            <h2 style="margin:0 0 10px;color:#142b25;font-size:16px;line-height:1.4;">Submission details</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e8e8e3;border-collapse:collapse;">${rows(input.enquiryFields)}</table>
          </td></tr>
          <tr><td style="background:#f7f7f3;padding:16px 28px;color:#65716c;font-size:12px;line-height:1.6;">
            This notification was generated by the AlAamir International website. SMTP acceptance confirms the message was accepted by the mail server; it does not confirm inbox placement.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
  return { subject, text, html };
}

export async function sendLeadEmail(input: LeadEmail): Promise<void> {
  const { config, transporter: mailer } = createTransport();
  const replyTo = input.customerEmail?.trim();
  if (replyTo && !isValidEmail(replyTo)) throw new Error("INVALID_REPLY_TO");
  const submittedAt = new Intl.DateTimeFormat("en-PK", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Asia/Karachi",
  }).format(new Date());
  const message = emailTemplate(input, submittedAt);
  try {
    const result = await mailer.sendMail({
      from: { name: "AlAamir International", address: config.from },
      to: config.to,
      replyTo: replyTo || undefined,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    const recipientAccepted = result.accepted.some((address: string) => address.toLowerCase() === config.to.toLowerCase());
    if (!recipientAccepted) throw Object.assign(new Error("SMTP_RECIPIENT_NOT_ACCEPTED"), { code: "SMTP_RECIPIENT_NOT_ACCEPTED" });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code).slice(0, 40) : "SMTP_SEND_ERROR";
    console.error("[lead-email] SMTP message was not accepted", { code });
    throw new Error("SMTP_SEND_FAILED");
  }
}
