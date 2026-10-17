import nextEnv from "@next/env";
import nodemailer from "nodemailer";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "MAIL_TO"];
const missing = required.filter(name => !process.env[name]?.trim());
if (missing.length) {
  console.error(`SMTP verification unavailable. Configure: ${missing.join(", ")}`);
  process.exit(1);
}

if (process.env.SMTP_HOST !== "smtp.hostinger.com" || Number(process.env.SMTP_PORT) !== 465 || process.env.MAIL_FROM?.toLowerCase() !== process.env.SMTP_USER?.toLowerCase()) {
  console.error("SMTP settings must use Hostinger SSL/TLS on port 465 and the authenticated mailbox as MAIL_FROM.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

try {
  await transporter.verify();
  console.log("Hostinger SMTP connection verified. No email was sent.");
} catch (error) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code).slice(0, 40) : "SMTP_VERIFY_ERROR";
  console.error("Hostinger SMTP verification failed.", { code });
  process.exitCode = 1;
} finally {
  transporter.close();
}
