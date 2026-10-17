import { NextResponse } from "next/server";
import { formTypes, isValidEmail, readJsonObject, requestIp, reserveSubmission, sanitizeText, sendLeadEmail, smtpIsConfigured, type FormType, type MailField } from "@/lib/server/lead-email";

export const runtime = "nodejs";

const enquiryTypes = ["Umrah", "Hajj", "International Tour", "Pakistan Tour", "Visa", "Corporate Travel", "Air Ticketing", "Other"];
const response = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });
const phonePattern = /^\+?[0-9][0-9\s().-]{5,24}$/;

export async function POST(request: Request) {
  const data = await readJsonObject(request);
  if (!data) return response("Please submit a valid form.", 400);
  if (sanitizeText(data.website, 200)) return NextResponse.json({ ok: true });

  const formType = sanitizeText(data.formType, 40) as FormType;
  if (!formTypes.includes(formType)) return response("This form could not be processed.", 400);

  const name = sanitizeText(data.name, 100);
  const email = sanitizeText(data.email, 254);
  const phone = sanitizeText(data.phone, 30);
  const message = sanitizeText(data.message, 5000, true);
  const enquiryType = sanitizeText(data.enquiryType, 80);
  const interest = sanitizeText(data.interest, 150);
  const company = sanitizeText(data.company, 150);
  const formName = sanitizeText(data.formName, 120);

  if (!name || !email || !message) return response("Please complete your name, email, and requirements.", 400);
  if (!isValidEmail(email)) return response("Please enter a valid email address.", 400);
  if (phone && !phonePattern.test(phone)) return response("Please enter a valid phone number.", 400);
  if (enquiryType && !enquiryTypes.includes(enquiryType)) return response("Please choose a valid enquiry type.", 400);

  const customerFields: MailField[] = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone / WhatsApp", value: phone || "Not provided" },
  ];
  const enquiryFields: MailField[] = [];
  if (enquiryType || ["enquiry", "contact", "booking", "package-enquiry", "umrah", "hajj", "international-tour", "corporate"].includes(formType)) enquiryFields.push({ label: "Enquiry type", value: enquiryType || "Not provided" });
  if (interest || ["class", "career"].includes(formType)) enquiryFields.push({ label: "Role / class of interest", value: interest || "Not provided" });
  if (company || formType === "corporate") enquiryFields.push({ label: "Organisation", value: company || "Not provided" });
  enquiryFields.push({ label: "Requirements", value: message });

  if (!smtpIsConfigured()) return response("Email service is not configured yet. Please contact us directly.", 503);
  const limited = reserveSubmission(requestIp(request), formType, { name, email: email.toLowerCase(), phone, enquiryType, interest, company, message });
  if (limited === "limited") return response("Too many submissions. Please wait and try again later.", 429);
  if (limited === "duplicate") return response("This enquiry was already submitted. Please wait a moment before trying again.", 409);
  try {
    await sendLeadEmail({ formType, formName, customerName: name, customerEmail: email, customerPhone: phone, customerFields, enquiryFields });
    return NextResponse.json({ ok: true });
  } catch {
    return response("We could not send your enquiry right now. Please try again later.", 502);
  }
}
