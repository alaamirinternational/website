"use client";

import { useState, type FormEvent } from "react";
import { enquiryTypes } from "@/data/enquiries";
import type { EnquiryType } from "@/data/enquiries";
import type { FormType } from "@/lib/server/lead-email";

export function ContactForm({ id, title, kind, enquiryType }: { id: string; title: string; kind: FormType; enquiryType: EnquiryType }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSending(true);
    setStatus("");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, formType: kind, formName: title }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your enquiry. Please try again.");
      form.reset();
      setStatus("Thank you. Your enquiry has been received, and our team will review it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const formHeading = kind === "class" ? "Class registration details" : kind === "career" ? "Applicant details" : kind === "booking" || kind === "package-enquiry" ? "Booking and package details" : "Your enquiry details";
  const interestLabel = kind === "career" ? "Role of interest" : "Preferred class";
  const hasEnquiryType = ["enquiry", "contact", "booking", "package-enquiry", "umrah", "hajj", "international-tour", "corporate"].includes(kind);

  return <>
    <form onSubmit={submit} aria-describedby={`${id}-status`}>
      <fieldset disabled={sending}>
        <legend>{formHeading}</legend>
        <div className="form-grid">
          <label htmlFor={`${id}-name`}>Full name<input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} required /></label>
          <label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label htmlFor={`${id}-phone`}>Phone<input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
          {hasEnquiryType ? <label htmlFor={`${id}-type`}>Enquiry type<select id={`${id}-type`} name="enquiryType" defaultValue={kind === "corporate" ? "Corporate Travel" : kind === "booking" ? "Umrah" : enquiryType}>{enquiryTypes.map(type => <option key={type}>{type}</option>)}</select></label> : <label htmlFor={`${id}-interest`}>{interestLabel}<input id={`${id}-interest`} name="interest" maxLength={150} /></label>}
          {kind === "corporate" && <label htmlFor={`${id}-company`}>Organisation<input id={`${id}-company`} name="company" autoComplete="organization" maxLength={150} /></label>}
        </div>
        <label htmlFor={`${id}-message`}>Your requirements<textarea id={`${id}-message`} name="message" rows={5} maxLength={5000} required /></label>
        <div className="honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field empty<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"}</button>
      </fieldset>
    </form>
    <p id={`${id}-status`} className="notice" role="status" aria-live="polite">{status}</p>
  </>;
}
