"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import ContactSticker from "@/components/contact/contact-sticker";
import { usePageEntranceReady } from "@/components/providers/page-entrance";
import copy from "@/content/contact";

const fieldClass =
  "w-full rounded-none border-b border-[#293c31]/30 bg-transparent py-3 text-lg text-[#293c31] outline-none transition-colors placeholder:text-[#293c31]/35 focus:border-[#293c31] focus:border-b-2 disabled:opacity-50 sm:text-xl";

export default function ContactForm() {
  const root = useRef<HTMLElement>(null);
  const imageArea = useRef<HTMLElement>(null);
  const imageMotion = useRef<HTMLDivElement>(null);
  const entranceReady = usePageEntranceReady();
  const sending = useRef(false);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  useLayoutEffect(() => {
    if (!entranceReady) return;
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const area = imageArea.current!;
        const image = imageMotion.current!;
        const xTo = gsap.quickTo(image, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(image, "y", {
          duration: 0.8,
          ease: "power3.out",
        });
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = area.getBoundingClientRect();
          const x = Math.max(
            -1,
            Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
          );
          const y = Math.max(
            -1,
            Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
          );
          xTo(x * 16);
          yTo(y * 16);
        };
        const reset = () => {
          xTo(0);
          yTo(0);
        };
        area.addEventListener("pointermove", move, { passive: true });
        area.addEventListener("pointerleave", reset);
        area.addEventListener("pointercancel", reset);
        window.addEventListener("blur", reset);
        return () => {
          area.removeEventListener("pointermove", move);
          area.removeEventListener("pointerleave", reset);
          area.removeEventListener("pointercancel", reset);
          window.removeEventListener("blur", reset);
        };
      },
      root,
    );
    return () => media.revert();
  }, [entranceReady]);

  useLayoutEffect(() => {
    if (!entranceReady) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          root.current!.querySelectorAll("[data-enter]"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, [entranceReady]);

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
      ref={root}
      aria-labelledby="contact-title"
      className="relative isolate grid min-h-svh bg-[#fdf8f4] text-[#222222] lg:grid-cols-[1.05fr_1fr]"
    >
      <div className="relative z-10 flex flex-col justify-center px-6 pb-12 pt-32 sm:px-12 lg:min-h-[800px] lg:px-[clamp(2.5rem,6vw,7rem)] lg:pb-16 lg:pt-36">
        <div className="mx-auto w-full max-w-xl">
          <p
            data-enter
            className="mb-6 text-xs font-medium uppercase tracking-[0.22em]"
          >
            {copy.eyebrow}
          </p>
          <h1
            id="contact-title"
            data-enter
            className="max-w-lg text-[clamp(3.5rem,5.8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.065em]"
          >
            {copy.title}
            <br />
            <span className="font-serif font-normal italic tracking-[-0.06em]">
              {copy.titleAccent}
            </span>
          </h1>
          <p
            data-enter
            className="mt-6 max-w-sm whitespace-pre-line text-sm leading-relaxed text-[#293c31]/65 sm:text-base"
          >
            {copy.description}
          </p>
          <form
            onSubmit={submit}
            aria-busy={status === "sending"}
            className="mt-9 space-y-6"
          >
            <div data-enter>
              <label
                htmlFor="contact-name"
                className="text-xs font-medium uppercase tracking-[0.13em]"
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
            <div data-enter>
              <label
                htmlFor="contact-email"
                className="text-xs font-medium uppercase tracking-[0.13em]"
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
            <div data-enter>
              <label
                htmlFor="contact-message"
                className="text-xs font-medium uppercase tracking-[0.13em]"
              >
                {copy.form.messageLabel}
                <span aria-hidden="true">*</span>
              </label>
              <textarea
                className={`${fieldClass} min-h-24 resize-y`}
                id="contact-message"
                name="message"
                rows={2}
                placeholder={copy.form.messagePlaceholder}
                required
                maxLength={5000}
                disabled={status === "sending"}
              />
            </div>
            <div data-enter className="flex flex-wrap items-center gap-5 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex min-h-14 cursor-pointer items-center gap-10 rounded-full bg-[#293c31] py-2 pl-7 pr-2 text-sm font-medium text-[#fdf8f4] transition-colors hover:bg-[#3d5947] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#293c31] disabled:cursor-wait disabled:opacity-60"
              >
                {status === "sending"
                  ? copy.form.sendingLabel
                  : copy.form.submitLabel}
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-[#d7f991] text-[#293c31] transition-transform group-hover:-rotate-45 motion-reduce:transform-none"
                >
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12h15m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <span className="text-xs text-[#293c31]/55">
                {copy.form.requiredNote}
              </span>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`min-h-6 max-w-md text-sm leading-relaxed ${status === "error" ? "text-[#9c3d2e]" : "text-[#367348]"}`}
            >
              {feedback}
            </p>
          </form>
        </div>
      </div>
      <figure
        ref={imageArea}
        className="relative m-0 min-h-[440px] overflow-hidden bg-[#b3bcaa] sm:min-h-[580px] lg:min-h-full"
      >
        <div ref={imageMotion} className="absolute -inset-6">
          <Image
            src={copy.image.src}
            alt={copy.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 49vw, 100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#162b20]/45 via-transparent to-[#162b20]/10"
        />
        <div
          data-enter
          className="absolute left-6 top-12 w-[min(80%,340px)] rotate-[-5deg] sm:left-10 sm:top-16 lg:left-[-3px] lg:top-[28%] lg:w-[min(95%,420px)]"
        >
          <ContactSticker />
        </div>
        <figcaption className="absolute bottom-7 left-7 right-7 flex items-center justify-between gap-4 border-t border-white/40 pt-4 text-[10px] uppercase tracking-[0.17em] text-white sm:bottom-10 sm:left-10 sm:right-10">
          <span>{copy.captionLeft}</span>
          <span>{copy.captionRight}</span>
        </figcaption>
      </figure>
    </section>
  );
}
