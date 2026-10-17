import { NextResponse } from "next/server";
import { isValidEmail, readJsonObject, requestIp, reserveSubmission, sanitizeText, sendLeadEmail, smtpIsConfigured, type MailField } from "@/lib/server/lead-email";

export const runtime = "nodejs";

const allowed = {
  duration: ["10 دن", "15 دن", "21 دن", "28 دن"],
  flight: ["ڈائریکٹ فلائٹ", "ایک اسٹاپ والی فلائٹ", "کوئی بھی مناسب فلائٹ"],
  airlines: ["سعودی ایئرلائن", "پی آئی اے", "ایئر بلیو", "ایئر سیال", "فلائی جناح", "فلائی ناس", "قطر ایئرویز", "کوئی بھی مناسب ایئرلائن"],
  distance: ["500 میٹر", "800 میٹر", "شٹل سروس", "اپنی پسند کا فاصلہ"],
  room: ["شیئرنگ", "الگ کمرہ"], hotel: ["اکانومی", "اکانومی پلس", "3 اسٹار", "5 اسٹار"],
  companions: ["اکیلے", "فیملی کے ساتھ"], answer: ["جی ہاں", "نہیں"],
  month: ["دسمبر", "جنوری", "فروری", "مارچ (رمضان)", "اپریل"],
} as const;

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const text = (body: Record<string, unknown>, key: string, max = 150) => sanitizeText(body[key], max);

export async function POST(request: Request) {
  const data = await readJsonObject(request);
  if (!data) return fail("درج کردہ معلومات درست نہیں ہیں۔");
  if (text(data, "website", 200)) return NextResponse.json({ ok: true });

  const required = ["name", "fatherName", "city", "phone", "duration", "flight", "makkahDistance", "madinahDistance", "roomType", "hotel", "companions", "ziyarat", "departureCity", "month"];
  if (required.some(key => !text(data, key))) return fail("براہ کرم تمام ضروری معلومات مکمل کریں۔");
  const name = text(data, "name");
  const fatherName = text(data, "fatherName");
  const city = text(data, "city");
  const phone = text(data, "phone", 30);
  if (!/^([+]?(92)|0)?3\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) return fail("براہ کرم درست پاکستانی موبائل نمبر درج کریں۔");
  const email = text(data, "email", 254);
  if (email && !isValidEmail(email)) return fail("براہ کرم درست ای میل درج کریں۔");

  const pick = (key: string, options: readonly string[]) => options.includes(text(data, key, 100));
  if (!pick("duration", allowed.duration) || !pick("flight", allowed.flight) || !pick("makkahDistance", allowed.distance) || !pick("madinahDistance", allowed.distance) || !pick("roomType", allowed.room) || !pick("hotel", allowed.hotel) || !pick("companions", allowed.companions) || !pick("ziyarat", allowed.answer) || !pick("month", allowed.month)) return fail("براہ کرم دیے گئے اختیارات میں سے درست انتخاب کریں۔");

  const budget = Number(data.budget);
  if (!Number.isSafeInteger(budget) || budget < 260000 || budget > 100000000) return fail("فی کس کم از کم بجٹ 260,000 پاکستانی روپے ہونا چاہیے۔");
  const airlines = Array.isArray(data.airlines) ? data.airlines.map(value => sanitizeText(value, 100)) : [];
  if (airlines.length < 1 || airlines.length > 3 || airlines.some(value => !allowed.airlines.includes(value as typeof allowed.airlines[number])) || (airlines.includes("کوئی بھی مناسب ایئرلائن") && airlines.length > 1)) return fail("ایک سے تین درست ایئرلائنز منتخب کریں۔");

  const makkahDistance = text(data, "makkahDistance");
  const madinahDistance = text(data, "madinahDistance");
  const duration = text(data, "duration");
  const hotel = text(data, "hotel");
  const specialException = makkahDistance === "شٹل سروس" && madinahDistance === "800 میٹر";
  if (hotel === "5 اسٹار" && ["10 دن", "15 دن"].includes(duration) && budget < 500000 && !specialException) return fail("5 اسٹار ہوٹل کے لیے 10 یا 15 دن کے سفر میں کم از کم بجٹ 500,000 روپے ہونا چاہیے۔");

  const makCustom = text(data, "makkahCustom", 300);
  const madCustom = text(data, "madinahCustom", 300);
  const budgetDisplay = `PKR ${budget.toLocaleString("en-PK")}`;
  const customerFields: MailField[] = [
    { label: "نام", value: name }, { label: "والد کا نام", value: fatherName }, { label: "شہر", value: city },
    { label: "WhatsApp", value: phone }, { label: "ای میل", value: email || "درج نہیں کی گئی" },
  ];
  const enquiryFields: MailField[] = [
    { label: "سفر کی مدت", value: duration }, { label: "فلائٹ کی پسند", value: text(data, "flight") }, { label: "ایئرلائنز", value: airlines.join("، ") },
    { label: "مکہ کا فاصلہ", value: [makkahDistance, makCustom].filter(Boolean).join(" — ") }, { label: "مدینہ کا فاصلہ", value: [madinahDistance, madCustom].filter(Boolean).join(" — ") },
    { label: "رہائش", value: text(data, "roomType") }, { label: "ہوٹل کیٹیگری", value: hotel }, { label: "فی کس بجٹ", value: budgetDisplay },
    { label: "سفر کے ساتھی", value: text(data, "companions") }, { label: "مکہ و مدینہ زیارات", value: text(data, "ziyarat") },
    { label: "دیگر مقامات", value: text(data, "otherPlaces", 500) || "درج نہیں" }, { label: "روانگی کا شہر", value: text(data, "departureCity") },
    { label: "پسندیدہ مہینہ", value: text(data, "month") },
  ];

  if (!smtpIsConfigured()) return fail("ای میل سروس ابھی ترتیب میں نہیں ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔", 503);
  const rate = reserveSubmission(requestIp(request), "umrah", {
    name, fatherName, city, phone, email, duration, flight: text(data, "flight"), airlines, makkahDistance, makCustom,
    madinahDistance, madCustom, roomType: text(data, "roomType"), hotel, budget, companions: text(data, "companions"),
    ziyarat: text(data, "ziyarat"), otherPlaces: text(data, "otherPlaces", 500), departureCity: text(data, "departureCity"), month: text(data, "month"),
  });
  if (rate === "limited") return fail("براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔", 429);
  if (rate === "duplicate") return fail("یہ سروے ابھی جمع کروایا گیا ہے۔ دوبارہ بھیجنے سے پہلے کچھ دیر انتظار کریں۔", 409);
  try {
    await sendLeadEmail({ formType: "umrah", formName: "عمرہ ترجیحات کا سروے", customerName: name, customerEmail: email || undefined, customerPhone: phone, customerFields, enquiryFields });
    return NextResponse.json({ ok: true });
  } catch {
    return fail("سروے کی ای میل بھیجنے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔", 502);
  }
}
