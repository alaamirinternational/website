import { NextResponse } from "next/server";

export const runtime = "nodejs";
const recipient = "info@alaamir.co";
const limits = new Map<string, number[]>();
const allowed = {
  duration: ["10 دن", "15 دن", "21 دن", "28 دن"],
  flight: ["ڈائریکٹ فلائٹ", "ایک اسٹاپ والی فلائٹ", "کوئی بھی مناسب فلائٹ"],
  airlines: ["سعودی ایئرلائن", "پی آئی اے", "ایئر بلیو", "ایئر سیال", "فلائی جناح", "فلائی ناس", "قطر ایئرویز", "کوئی بھی مناسب ایئرلائن"],
  distance: ["500 میٹر", "800 میٹر", "شٹل سروس", "اپنی پسند کا فاصلہ"],
  room: ["شیئرنگ", "الگ کمرہ"], hotel: ["اکانومی", "اکانومی پلس", "3 اسٹار", "5 اسٹار"],
  companions: ["اکیلے", "فیملی کے ساتھ"], answer: ["جی ہاں", "نہیں"],
  month: ["دسمبر", "جنوری", "فروری", "مارچ (رمضان)", "اپریل"],
};
const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";
const text = (body: Record<string, unknown>, key: string, max = 150) => clean(body[key], max);
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (limits.get(ip) || []).filter(time => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) return fail("براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔", 429);
  recent.push(now); limits.set(ip, recent);
  let body: unknown;
  try { body = await request.json(); } catch { return fail("درج کردہ معلومات درست نہیں ہیں۔"); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("درج کردہ معلومات درست نہیں ہیں۔");
  const data = body as Record<string, unknown>;
  if (clean(data.website, 200)) return NextResponse.json({ ok: true });
  const required = ["name", "fatherName", "city", "phone", "duration", "flight", "makkahDistance", "madinahDistance", "roomType", "hotel", "budget", "companions", "ziyarat", "departureCity", "month"];
  if (required.some(key => !text(data, key))) return fail("براہ کرم تمام ضروری معلومات مکمل کریں۔");
  if (!/^([+]?(92)|0)?3\d{9}$/.test(text(data, "phone", 30).replace(/[\s()-]/g, ""))) return fail("براہ کرم درست پاکستانی موبائل نمبر درج کریں۔");
  const email = text(data, "email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("براہ کرم درست ای میل درج کریں۔");
  const pick = (key: string, options: readonly string[]) => options.includes(text(data, key, 100));
  if (!pick("duration", allowed.duration) || !pick("flight", allowed.flight) || !pick("makkahDistance", allowed.distance) || !pick("madinahDistance", allowed.distance) || !pick("roomType", allowed.room) || !pick("hotel", allowed.hotel) || !pick("companions", allowed.companions) || !pick("ziyarat", allowed.answer) || !pick("month", allowed.month)) return fail("براہ کرم دیے گئے اختیارات میں سے درست انتخاب کریں۔");
  const budget = Number(data.budget);
  if (!Number.isSafeInteger(budget) || budget < 260000 || budget > 100000000) return fail("فی کس کم از کم بجٹ 260,000 پاکستانی روپے ہونا چاہیے۔");
  const selected = Array.isArray(data.airlines) ? data.airlines.map(v => clean(v, 100)) : [];
  if (selected.length < 1 || selected.length > 3 || selected.some(x => !allowed.airlines.includes(x)) || (selected.includes("کوئی بھی مناسب ایئرلائن") && selected.length > 1)) return fail("ایک سے تین درست ایئرلائنز منتخب کریں۔");
  const mismatch = text(data, "hotel") === "5 اسٹار" && ["10 دن", "15 دن"].includes(text(data, "duration")) && !(text(data, "makkahDistance") === "شٹل سروس" && text(data, "madinahDistance") === "800 میٹر");
  if (mismatch && budget < 500000) return fail("5 اسٹار ہوٹل کے لیے 10 یا 15 دن کے سفر میں کم از کم بجٹ 500,000 روپے ہونا چاہیے۔");
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return fail("سروے کی ای میل سروس ابھی ترتیب میں نہیں ہے۔ براہ کرم info@alaamir.co پر رابطہ کریں۔", 503);
  const cleanName = text(data, "name");
  const fields: [string, string][] = [
    ["نام", cleanName], ["والد کا نام", text(data, "fatherName")], ["شہر", text(data, "city")], ["WhatsApp", text(data, "phone")], ["ای میل", email || "درج نہیں کی گئی"],
    ["سفر کی مدت", text(data, "duration")], ["فلائٹ کی پسند", text(data, "flight")], ["ایئرلائنز", selected.join("، ")], ["مکہ کا فاصلہ", `${text(data, "makkahDistance")} ${text(data, "makkahCustom")}`],
    ["مدینہ کا فاصلہ", `${text(data, "madinahDistance")} ${text(data, "madinahCustom")}`], ["رہائش", text(data, "roomType")], ["ہوٹل کیٹیگری", text(data, "hotel")], ["فی کس بجٹ", `PKR ${budget.toLocaleString("en-PK")}`],
    ["سفر کے ساتھی", text(data, "companions")], ["مکہ و مدینہ زیارات", text(data, "ziyarat")], ["دیگر مقامات", text(data, "otherPlaces") || "درج نہیں"], ["روانگی کا شہر", text(data, "departureCity")], ["پسندیدہ مہینہ", text(data, "month")],
  ];
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const submittedAt = new Date().toISOString();
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif"><h2>عمرہ سروے کی نئی درخواست</h2><p>موصول ہونے کا وقت: ${escape(submittedAt)}</p><table style="border-collapse:collapse;width:100%">${fields.map(([label, value]) => `<tr><th style="text-align:right;padding:9px;border:1px solid #ddd">${escape(label)}</th><td style="padding:9px;border:1px solid #ddd">${escape(value)}</td></tr>`).join("")}</table></div>`;
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [recipient], subject: "New Umrah Survey Submission — AlAamir International", html, reply_to: email || undefined }), signal: AbortSignal.timeout(10000) });
    if (!response.ok) return fail("سروے کی ای میل بھیجنے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں یا info@alaamir.co پر رابطہ کریں۔", 502);
    return NextResponse.json({ ok: true });
  } catch {
    return fail("سروے کی ای میل بھیجنے میں عارضی مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔", 502);
  }
}
