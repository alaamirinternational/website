"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";

const airlines = ["سعودی ایئرلائن", "پی آئی اے", "ایئر بلیو", "ایئر سیال", "فلائی جناح", "فلائی ناس", "قطر ایئرویز", "کوئی بھی مناسب ایئرلائن"];
const faqs = [
  ["سروے کیوں پُر کرنا ضروری ہے؟", "آپ کی ترجیحات، سفر کی مدت، رہائش اور بجٹ سمجھنے میں مدد ملتی ہے تاکہ ہماری ٹیم آپ سے موزوں تجاویز پر بات کر سکے۔"],
  ["کیا سروے جمع کروانے سے بکنگ ہو جاتی ہے؟", "نہیں۔ یہ صرف آپ کی ترجیحات جاننے کا ابتدائی مرحلہ ہے؛ اس سے کوئی بکنگ یا ادائیگی نہیں ہوتی۔"],
  ["کم از کم بجٹ کتنا ہونا چاہیے؟", "سروے میں فی کس عمومی کم از کم بجٹ 260,000 پاکستانی روپے ہے۔ 10 یا 15 دن کے سفر کے ساتھ 5 اسٹار ہوٹل کے لیے کم از کم 500,000 روپے درکار ہیں، مخصوص استثنا کے ساتھ۔"],
  ["کیا میں اپنی پسند کی ایئرلائن منتخب کر سکتا ہوں؟", "جی ہاں، آپ ایک سے تین ایئرلائنز منتخب کر سکتے ہیں یا کوئی بھی مناسب ایئرلائن کا انتخاب کر سکتے ہیں۔"],
  ["کیا مکہ اور مدینہ کے لیے مختلف فاصلے منتخب کیے جا سکتے ہیں؟", "جی ہاں، دونوں شہروں کی رہائش الگ الگ منتخب کی جا سکتی ہے اور اپنی پسند کا فاصلہ بھی الگ لکھ سکتے ہیں۔"],
  ["کیا میں اپنی فیملی کے لیے سروے جمع کروا سکتا ہوں؟", "جی ہاں، سفر کے ساتھیوں میں فیملی کے ساتھ منتخب کریں اور اپنی فیملی کی ترجیحات درج کریں۔"],
  ["سروے جمع کروانے کے بعد کیا ہوگا؟", "آپ کی معلومات ہماری ٹیم کو موصول ہوں گی۔ ٹیم آپ کی ترجیحات کا جائزہ لے کر رابطہ کرے گی؛ یہ بکنگ کی تصدیق نہیں ہے۔"],
  ["رابطہ کیسے کیا جا سکتا ہے؟", "آپ info@alaamir.co پر ای میل یا +92 316 8229288 پر فون کر سکتے ہیں۔"],
];

type Values = Record<string, string | string[]>;
function Field({ label, name, children, required = false }: { label: string; name: string; children?: ReactNode; required?: boolean }) {
  return <label className="field" htmlFor={name}><span>{label}{required && <b aria-hidden="true"> *</b>}</span>{children}</label>;
}
function SelectField({ label, name, options, required = true, onChange }: { label: string; name: string; options: string[]; required?: boolean; onChange?: (value: string) => void }) {
  return <Field label={label} name={name} required={required}><select id={name} name={name} required={required} defaultValue="" onChange={e => onChange?.(e.target.value)}><option value="" disabled>منتخب کریں</option>{options.map(x => <option key={x}>{x}</option>)}</select></Field>;
}
function ChoiceField({ label, name, options, type = "radio", selected = [], onChoice }: { label: string; name: string; options: string[]; type?: "radio" | "checkbox"; selected?: string[]; onChoice?: (value: string, checked: boolean) => void }) {
  return <fieldset className="choice-field"><legend>{label}</legend><div className="choice-grid">{options.map((option, i) => <label className="choice" key={option}><input type={type} name={type === "checkbox" ? `${name}[]` : name} value={option} checked={type === "checkbox" ? selected.includes(option) : undefined} defaultChecked={type === "radio" ? i === 0 : undefined} onChange={e => onChoice?.(option, e.target.checked)} /><span>{option}</span></label>)}</div></fieldset>;
}

export function SurveyLanding() {
  const [values, setValues] = useState<Values>({});
  const [mak, setMak] = useState("500 میٹر");
  const [mad, setMad] = useState("500 میٹر");
  const [hotel, setHotel] = useState("اکانومی");
  const [duration, setDuration] = useState("10 دن");
  const [budget, setBudget] = useState("");
  const [travellingWith, setTravellingWith] = useState("");
  const [airlineChoices, setAirlineChoices] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const budgetNumber = Number(budget);
  const specialException = mak === "شٹل سروس" && mad === "800 میٹر";
  const hotelMismatch = hotel === "5 اسٹار" && ["10 دن", "15 دن"].includes(duration) && budgetNumber > 0 && budgetNumber < 500000 && !specialException;
  const budgetError = budget !== "" && budgetNumber < 260000 ? "فی کس کم از کم بجٹ 260,000 پاکستانی روپے ہونا چاہیے۔" : hotelMismatch ? "آپ کا منتخب کردہ ہوٹل اور بجٹ آپ کی توقعات کے مطابق نہ بھی ہو سکتے ہیں۔ بہتر نتائج کے لیے اپنا بجٹ بڑھائیں یا ہوٹل کیٹیگری تبدیل کریں۔" : "";
  const navLinks = useMemo(() => [["ہمارا طریقۂ کار", "#about"], ["سروے", "#survey"], ["پیکیجز", "#packages"], ["سوالات", "#faq"]], []);

  function update(name: string, value: string) { setValues(prev => ({ ...prev, [name]: value })); }
  function toggleAirline(value: string, checked: boolean) {
    setAirlineChoices(current => {
      if (value === "کوئی بھی مناسب ایئرلائن" && checked) return [value];
      if (value === "کوئی بھی مناسب ایئرلائن") return current.filter(v => v !== value);
      const next = checked ? [...current.filter(v => v !== "کوئی بھی مناسب ایئرلائن"), value] : current.filter(v => v !== value);
      if (next.length > 3) return current;
      return next;
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || budgetError || airlineChoices.length < 1) {
      if (airlineChoices.length < 1) setStatus("براہ کرم کم از کم ایک ایئرلائن منتخب کریں۔");
      return;
    }
    setSending(true); setStatus("");
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "website") continue;
      if (key.endsWith("[]")) { const clean = key.slice(0, -2); payload[clean] = [...(payload[clean] as string[] | undefined || []), String(value)]; }
      else payload[key] = value;
    }
    payload.airlines = airlineChoices;
    try {
      const response = await fetch("/api/umrah-survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "سروے بھیجنے میں مسئلہ پیش آیا۔");
      setStatus("آپ کا سروے موصول ہو گیا ہے۔ ہماری ٹیم آپ کی ترجیحات کا جائزہ لے کر آپ سے رابطہ کرے گی۔ یہ بکنگ کی تصدیق نہیں ہے۔");
        form.reset(); setValues({}); setAirlineChoices([]); setBudget(""); setMak("500 میٹر"); setMad("500 میٹر"); setHotel("اکانومی"); setDuration("10 دن"); setTravellingWith("");
    } catch (error) { setStatus(error instanceof Error ? error.message : "سروے بھیجنے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔"); }
    finally { setSending(false); }
  }

  return <>
    <a className="skip-link" href="#main-content">مرکزی مواد پر جائیں</a>
    <header className="topbar"><div className="topbar-inner"><a className="wordmark" href="#top" aria-label="AlAamir International ہوم"><Image src="/assets/main-logo.png" alt="AlAamir International" width={190} height={190} priority /></a><nav aria-label="مرکزی نیویگیشن">{navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a className="button button-gold header-cta" href="#survey">سروے شروع کریں <span>←</span></a></div></header>
    <main id="main-content" tabIndex={-1}>
      <span id="top" className="anchor-target" aria-hidden="true"/>
      <section className="hero"><div className="hero-photo" aria-hidden="true"/><div className="hero-content"><div className="eyebrow"><span/> سفرِ حرمین شریفین، آپ کی ترجیحات کے مطابق</div><h1>آپ کا عمرہ،<br/><em>آپ کی پسند</em></h1><p>اپنے بجٹ، پسندیدہ ایئرلائن اور رہائش کے مطابق عمرہ پلان کرنے کے لیے مختصر سروے مکمل کریں۔</p><div className="hero-actions"><a className="button button-gold" href="#survey">سروے شروع کریں <span>←</span></a><a className="button button-glass" href="#packages">پیکیجز دیکھیں</a></div></div></section>

      <section className="intro-wrap" id="about"><div className="intro-art"><div className="intro-image"/></div><div className="intro-copy"><div className="eyebrow gold-eyebrow">خلوص سے، آپ کے لیے</div><h2>آپ کے سفر کی منصوبہ بندی</h2><p>ہم آپ کی سفری ترجیحات، رہائش کی ضرورت اور بجٹ کو سمجھ کر عمرہ سفر کے موزوں انتخاب پر رہنمائی کرتے ہیں۔ سروے آپ کی ضرورت سے گفتگو شروع کرنے میں مدد دیتا ہے۔</p><a className="text-link" href="#survey">اپنی ترجیحات بتائیں <span>←</span></a></div></section>

      <section className="survey-section" id="survey"><div className="section-heading"><div className="eyebrow gold-eyebrow">آپ کا سفر، آپ کی شرائط</div><h2>عمرہ ترجیحات کا سروے</h2><p>چند سوالات کے جواب دیں۔ آپ کی فراہم کردہ معلومات ہماری ٹیم کو آپ کی ترجیحات سمجھنے میں مدد دیں گی۔</p></div><form className="survey-form" onSubmit={submit} noValidate>
        <div className="form-section"><div className="form-title"><span>01</span><div><h3>ذاتی معلومات</h3><p>ہم آپ سے کس طرح رابطہ کریں؟</p></div></div><div className="form-grid">
          <Field label="نام" name="name" required><input id="name" name="name" autoComplete="name" required maxLength={100} value={values.name as string || ""} onChange={e => update("name", e.target.value)} /></Field>
          <Field label="والد کا نام" name="fatherName" required><input id="fatherName" name="fatherName" required maxLength={100} value={values.fatherName as string || ""} onChange={e => update("fatherName", e.target.value)} /></Field>
          <Field label="شہر" name="city" required><input id="city" name="city" required maxLength={100} value={values.city as string || ""} onChange={e => update("city", e.target.value)} /></Field>
          <Field label="رابطہ نمبر (WhatsApp)" name="phone" required><input dir="ltr" className="ltr-input" id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+92 300 1234567" required pattern="(?:\+?92|0)?3[0-9]{9}" title="پاکستانی موبائل نمبر درج کریں، مثلاً +92 300 1234567" value={values.phone as string || ""} onChange={e => update("phone", e.target.value)} /></Field>
          <Field label="ای میل (اختیاری)" name="email"><input dir="ltr" className="ltr-input" id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="name@example.com" value={values.email as string || ""} onChange={e => update("email", e.target.value)} /></Field>
        </div></div>

        <div className="form-section"><div className="form-title"><span>02</span><div><h3>سفر کی ترجیحات</h3><p>اپنے سفر کی تفصیل منتخب کریں</p></div></div><div className="form-grid">
          <SelectField label="آپ کتنے دن کے لیے عمرہ پر جانا چاہتے ہیں؟" name="duration" options={["10 دن", "15 دن", "21 دن", "28 دن"]} onChange={setDuration}/>
          <SelectField label="آپ کس قسم کی فلائٹ پسند کریں گے؟" name="flight" options={["ڈائریکٹ فلائٹ", "ایک اسٹاپ والی فلائٹ", "کوئی بھی مناسب فلائٹ"]}/>
          <ChoiceField label="اپنی پسند کی زیادہ سے زیادہ 3 ایئرلائنز منتخب کریں" name="airlines" options={airlines} type="checkbox" selected={airlineChoices} onChoice={toggleAirline}/>
          <SelectField label="مکہ مکرمہ میں رہائش حرم سے کتنے فاصلے پر ہو؟" name="makkahDistance" options={["500 میٹر", "800 میٹر", "شٹل سروس", "اپنی پسند کا فاصلہ"]} onChange={setMak}/>
          {mak === "اپنی پسند کا فاصلہ" && <Field label="مکہ مکرمہ میں مطلوبہ فاصلہ یا تفصیل" name="makkahCustom"><input id="makkahCustom" name="makkahCustom" maxLength={300} value={values.makkahCustom as string || ""} onChange={e => update("makkahCustom", e.target.value)} /></Field>}
          <SelectField label="مدینہ منورہ میں رہائش مسجد نبوی ﷺ سے کتنے فاصلے پر ہو؟" name="madinahDistance" options={["500 میٹر", "800 میٹر", "شٹل سروس", "اپنی پسند کا فاصلہ"]} onChange={setMad}/>
          {mad === "اپنی پسند کا فاصلہ" && <Field label="مدینہ منورہ میں مطلوبہ فاصلہ یا تفصیل" name="madinahCustom"><input id="madinahCustom" name="madinahCustom" maxLength={300} value={values.madinahCustom as string || ""} onChange={e => update("madinahCustom", e.target.value)} /></Field>}
          <SelectField label="رہائش کیسی ہونی چاہیے؟" name="roomType" options={["شیئرنگ", "الگ کمرہ"]}/>
          <SelectField label="ہوٹل کیٹیگری" name="hotel" options={["اکانومی", "اکانومی پلس", "3 اسٹار", "5 اسٹار"]} onChange={setHotel}/>
          <Field label="فی کس کم از کم بجٹ (پاکستانی روپے)" name="budget" required><div className="money-input"><span dir="ltr">PKR</span><input id="budget" name="budget" type="number" dir="ltr" min="260000" step="1000" inputMode="numeric" placeholder="260,000" required value={budget} onChange={e => setBudget(e.target.value)} /></div></Field>
          <SelectField label="آپ کس کے ساتھ سفر کرنا چاہتے ہیں؟" name="companions" options={["اکیلے", "فیملی کے ساتھ"]} onChange={value => {
            setTravellingWith(value);
            if (value !== "فیملی کے ساتھ") setValues(prev => ({ ...prev, familyMembers: "", adults: "", children: "" }));
          }}/>
          {travellingWith === "فیملی کے ساتھ" && <>
            <Field label="Family Members کی کل تعداد" name="familyMembers" required><input id="familyMembers" name="familyMembers" type="number" dir="ltr" min="1" max="100" step="1" inputMode="numeric" required value={values.familyMembers as string || ""} onChange={e => update("familyMembers", e.target.value)} /></Field>
            <Field label="Adults کی تعداد" name="adults"><input id="adults" name="adults" type="number" dir="ltr" min="1" max="100" step="1" inputMode="numeric" value={values.adults as string || ""} onChange={e => update("adults", e.target.value)} /></Field>
            <Field label="بچوں کی تعداد" name="children"><input id="children" name="children" type="number" dir="ltr" min="1" max="100" step="1" inputMode="numeric" value={values.children as string || ""} onChange={e => update("children", e.target.value)} /></Field>
          </>}
          <SelectField label="کیا آپ مکہ مکرمہ اور مدینہ منورہ کی زیارات کرنا چاہتے ہیں؟" name="ziyarat" options={["جی ہاں", "نہیں"]}/>
          <Field label="دیگر مقامات کی زیارت (اختیاری)" name="otherPlaces"><input id="otherPlaces" name="otherPlaces" placeholder="طائف، خیبر، تبوک یا دیگر" maxLength={500} value={values.otherPlaces as string || ""} onChange={e => update("otherPlaces", e.target.value)} /></Field>
          <Field label="آپ پاکستان کے کس شہر سے روانہ ہوں گے؟" name="departureCity" required><input id="departureCity" name="departureCity" required maxLength={100} value={values.departureCity as string || ""} onChange={e => update("departureCity", e.target.value)} /></Field>
          <SelectField label="آپ کس مہینے میں عمرہ پر جانا چاہتے ہیں؟" name="month" options={["December", "January", "February / Ramadan", "March / Shawwal"]}/>
        </div>
        </div>
        {budgetError && <div className="validation-note" role="alert"><span>!</span><div>{budgetError}</div></div>}
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">ویب سائٹ</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="form-submit"><p>آپ کی معلومات صرف آپ کی ترجیحات پر گفتگو کے لیے استعمال ہوں گی۔ سروے جمع کروانے سے بکنگ نہیں ہوتی۔</p><button className="button button-gold submit-button" type="submit" disabled={sending || Boolean(budgetError)}>{sending ? "سروے بھیجا جا رہا ہے…" : "اپنا سروے جمع کروائیں"}<span>←</span></button><div className="form-status" role="status" aria-live="polite">{status}</div></div>
      </form></section>

      <section className="packages-section" id="packages"><div className="section-heading"><div className="eyebrow gold-eyebrow">حج ۱۴۴۸ھ</div><h2>حج پیکیجز</h2><p>حج کے دستیاب پیکیجز کی بنیادی تفصیلات ملاحظہ کریں۔</p></div><div className="package-grid">{[
        {name:"اکانومی حج پیکیج", duration:"14 سے 17 دن", price:"14,00,000", image:"https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80"},
        {name:"اسٹینڈرڈ حج پیکیج", duration:"16 سے 17 دن", price:"29,00,000", image:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80"},
        {name:"پریمیم حج پیکیج", duration:"16 سے 17 دن", price:"35,00,000", image:"https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=900&q=80"},
      ].map((pkg, i) => <article className="package-card" key={pkg.name}><div className="package-photo" style={{backgroundImage:`linear-gradient(0deg,#17140f88,transparent 70%), url('${pkg.image}')`}}><span className="package-number">۰{i+1}</span></div><div className="package-body"><div className="package-title"><div><h3>{pkg.name}</h3><p>دورانیہ: {pkg.duration}</p></div><div className="price"><small>فی کس</small><strong><bdi dir="ltr">PKR {pkg.price}</bdi></strong></div></div><ul><li>رہائش: شیئرنگ</li><li>شامل نہیں: قربانی اور ایئر ٹکٹ</li></ul><a className="text-link" href="https://wa.me/923168229288?text=Hajj%20package%20information">مزید معلومات <span>←</span></a></div></article>)}</div><p className="package-note">تمام قیمتیں فی کس ہیں۔ قربانی اور ایئر ٹکٹ شامل نہیں ہیں۔ حتمی تفصیلات اور دستیابی کے لیے رابطہ کریں۔</p></section>

      <section className="faq-section" id="faq"><div className="section-heading"><div className="eyebrow gold-eyebrow">آپ کے سوالات</div><h2>اکثر پوچھے گئے سوالات</h2><p>سروے اور اگلے مرحلے کے بارے میں واضح معلومات۔</p></div><div className="faq-list">{faqs.map(([q,a], i) => <details className="faq-item" key={q}><summary><span className="faq-number">۰{i+1}</span><span>{q}</span><b>＋</b></summary><p>{a}</p></details>)}</div></section>

      <section className="final-cta"><div className="eyebrow">آپ کے سفر کی ابتدا ایک گفتگو سے</div><h2>اپنی عمرہ ترجیحات ہمارے ساتھ شیئر کریں</h2><p>اپنی ضروریات بتائیں، ہم رہنمائی کے لیے آپ سے رابطہ کریں گے۔</p><a className="button button-gold" href="#survey">سروے مکمل کریں <span>←</span></a></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="wordmark" href="#top" aria-label="AlAamir International"><Image src="/assets/main-logo.png" alt="AlAamir International" width={170} height={170} /></a><p>آپ کے عمرہ اور حج کے سفر کی منصوبہ بندی میں مخلصانہ رہنمائی۔</p></div><div className="footer-col"><h3>اہم روابط</h3><a href="#about">ہمارا طریقۂ کار</a><a href="#survey">عمرہ سروے</a><a href="#packages">حج پیکیجز</a><a href="#faq">اکثر سوالات</a></div><div className="footer-col"><h3>رابطہ</h3><a href="https://wa.me/923168229288">واٹس ایپ پر رابطہ کریں</a><a dir="ltr" href="https://wa.me/923168229288">+92 316 8229288 · واٹس ایپ</a><a dir="ltr" href="https://wa.me/923010813465">+92 301 0813465 · واٹس ایپ</a><a dir="ltr" href="https://wa.me/923085080810">+92 308 5080810 · واٹس ایپ</a></div><div className="footer-col address"><h3>ہمارا دفتر</h3><address dir="ltr">Center-Point Plaza, Main Allahabad Road, Westridge III, Allahabad, Rawalpindi, Pakistan.</address></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AlAamir International. جملہ حقوق محفوظ ہیں۔</span><span className="footer-credit">Design &amp; Development by <a href="https://dynamgalaxy.com/" target="_blank" rel="noopener noreferrer">Dynam Galaxy</a></span></div></footer>
  </>;
}
