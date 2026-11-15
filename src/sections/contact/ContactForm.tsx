"use client";

import SiteIcon from "@/components/ui/site-icon";
import site from "@/content/site";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import copy from "@/content/contact";

const fieldClass =
  "mt-2 w-full rounded-lg border border-[var(--line)] bg-[var(--field)] px-4 py-3 text-base text-[var(--ink)] outline-none placeholder:text-[var(--copy)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-60";

export default function ContactForm() {
  const sending = useRef(false);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setStatus("error");
      setFeedback(copy.form.validationMessage);
      return;
    }
    const service = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !publicKey) {
      setStatus("error");
      setFeedback(copy.form.unavailableMessage);
      return;
    }
    sending.current = true;
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: service,
            template_id: template,
            user_id: publicKey,
            template_params: {
              name,
              email,
              message,
              from_name: name,
              from_email: email,
              reply_to: email,
            },
          }),
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok) throw new Error("Email delivery failed");
      setStatus("success");
      setFeedback(copy.form.successMessage);
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(copy.form.errorMessage);
    } finally {
      sending.current = false;
    }
  }

  return (
    <section
      aria-labelledby="contact-title"
      className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-32 text-[var(--ink)] sm:px-9 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-40"
    >
      <div className="min-w-0">
        <div className="mx-auto w-full max-w-xl">
          <p
            className="mb-4 text-sm font-medium text-[var(--accent)]"
          >
            {copy.eyebrow}
          </p>
          <h1
            id="contact-title"
            className="max-w-lg text-4xl font-semibold leading-[1.15] tracking-[-0.035em] sm:text-5xl"
          >
            {copy.title}{" "}
            <br />
            <span className="font-normal text-[var(--accent)]">
              {copy.titleAccent}
            </span>
          </h1>
          <p
            className="mt-5 max-w-lg whitespace-pre-line text-base leading-relaxed text-[var(--copy)]"
          >
            {copy.description}
          </p>
          <form
            onSubmit={submit}
            aria-busy={status === "sending"}
            className="mt-9 space-y-6"
          >
            <div>
              <label
                htmlFor="contact-name"
                className="text-base font-medium"
              >
                {copy.form.nameLabel}
                <span aria-hidden="true">*</span>
              </label>
              <input
                className={fieldClass}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={copy.form.namePlaceholder}
                required
                pattern=".*\S.*"
                maxLength={100}
                disabled={status === "sending"}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="text-base font-medium"
              >
                {copy.form.emailLabel}
                <span aria-hidden="true">*</span>
              </label>
              <input
                className={fieldClass}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={copy.form.emailPlaceholder}
                required
                maxLength={254}
                disabled={status === "sending"}
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="text-base font-medium"
              >
                {copy.form.messageLabel}
                <span aria-hidden="true">*</span>
              </label>
              <textarea
                className={`${fieldClass} min-h-36 resize-y`}
                id="contact-message"
                name="message"
                rows={5}
                placeholder={copy.form.messagePlaceholder}
                required
                maxLength={5000}
                disabled={status === "sending"}
              />
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-lg bg-[var(--accent)] px-6 py-3 text-base font-medium text-[var(--on-accent)] hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60"
              >
                {status === "sending"
                  ? copy.form.sendingLabel
                  : copy.form.submitLabel}
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center"
                >
                  <SiteIcon name={site.icons.contactSend} className="size-5" />
                </span>
              </button>
              <span className="text-sm text-[var(--copy)]/80">
                {copy.form.requiredNote}
              </span>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`min-h-6 max-w-md text-base leading-relaxed ${status === "error" ? "text-[var(--error)]" : "text-[var(--accent)]"}`}
            >
              {feedback}
            </p>
          </form>
        </div>
      </div>
      <figure className="relative m-0 aspect-[4/5] self-start overflow-hidden rounded-xl bg-[var(--panel)] lg:mt-1">
        <Image src={copy.image.src} alt={copy.image.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-center" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191714]/85 to-transparent px-6 pb-6 pt-16 text-sm leading-relaxed text-white">
          <span className="block">{copy.captionLeft}</span>
          <span className="mt-1 block">{copy.captionRight}</span>
        </figcaption>
      </figure>
    </section>
  );
}
