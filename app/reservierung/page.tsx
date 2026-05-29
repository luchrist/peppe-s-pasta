"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import config from "@/config/restaurant";

export default function KontaktPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    };

    await fetch("/api/reservierung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-bone" style={{ overflowX: "clip" }}>
      <header className="border-b border-ink/10">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-[2px] md:px-10">
          <a href="/" className="group flex items-center gap-3">
            <img
              src="/assets/logo-mark.png"
              alt={`${config.name} Logo`}
              className="h-20 w-20 object-contain md:h-28 md:w-28"
            />
            <span className="font-display text-[22px] tracking-tight text-ink md:text-[28px]">
              {config.name}
            </span>
          </a>
          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink md:text-[11px] md:tracking-[0.22em]"
          >
            ← Zurück
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-[11px] md:tracking-[0.22em]">
              <span className="block h-[6px] w-[6px] rotate-45 bg-rosso-600" />
              <span>Kontakt</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[34px] leading-[1.02] tracking-tight text-ink md:text-[64px] lg:text-[78px]">
              Sag uns
              <br />
              <span className="italic text-basilico-700">Ciao.</span>
            </h1>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink/65 md:text-[17px]">
              Reservierungen sind bei uns nicht nötig. Wer einfach vorbeischauen mag, ist immer willkommen. Für Rückfragen, größere Bestellungen oder ein nettes Wort erreicht ihr uns hier oder direkt am Truck.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-x-8 gap-y-12 md:mt-20 md:gap-x-10 md:gap-y-16">
          {/* Form */}
          <div className="col-span-12 md:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-[28px] tracking-tight text-ink md:text-[36px]">
                  Grazie mille.
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink/70">
                  Eure Nachricht ist angekommen. Wir melden uns so schnell wie möglich zurück.
                </p>
                <a
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] text-rosso-600 transition-colors hover:text-ink"
                >
                  ← Zur Startseite
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <Field label="Name" name="name" type="text" required />
                  <Field label="E-Mail" name="email" type="email" required />
                  <Field label="Telefon (optional)" name="phone" type="tel" />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:mb-2 md:text-[11px] md:tracking-[0.22em]">
                    Nachricht
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full resize-none border-b border-ink/20 bg-transparent py-2.5 font-display text-[17px] tracking-tight text-ink outline-none transition-colors placeholder:text-[15px] placeholder:tracking-normal focus:border-rosso-600 md:py-3 md:text-[20px] md:placeholder:text-[20px]"
                    placeholder="Worum geht's? Bestellung, Catering, Frage zur Karte..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-rosso-600 px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-7 sm:py-4 sm:text-[12px] sm:tracking-[0.22em]"
                >
                  <span className="relative z-10">
                    {loading ? "Wird gesendet..." : "Nachricht senden"}
                  </span>
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </button>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-[11px] md:tracking-[0.22em]">
              Direkt anrufen
            </div>
            <a
              href={`tel:${config.contact.phone.replace(/\s/g, "")}`}
              className="mt-4 block font-display text-[24px] tracking-tight text-ink hover:text-rosso-600 md:text-[28px]"
            >
              {config.contact.phone}
            </a>

            <div className="mt-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-[11px] md:tracking-[0.22em]">
                Standort
              </div>
              <p className="mt-4 font-display text-[20px] leading-snug tracking-tight text-ink md:text-[22px]">
                {config.address.street}
                <br />
                {config.address.city}
              </p>
            </div>

            <div className="mt-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:text-[11px] md:tracking-[0.22em]">
                Öffnungszeiten
              </div>
              <ul className="mt-6 divide-y divide-ink/12">
                {config.openingHours.map((entry) => (
                  <li
                    key={entry.day}
                    className="flex items-center justify-between gap-4 py-2.5 md:py-3"
                  >
                    <span className="shrink-0 font-display text-[16px] tracking-tight text-ink md:text-[18px]">
                      {entry.day}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-right font-mono text-[10px] tracking-[0.02em] text-ink/55 sm:text-[11px] md:text-[12px] md:tracking-[0.05em]">
                      {entry.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:mb-2 md:text-[11px] md:tracking-[0.22em]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-ink/20 bg-transparent py-2.5 font-display text-[17px] tracking-tight text-ink outline-none transition-colors focus:border-rosso-600 md:py-3 md:text-[20px]"
      />
    </div>
  );
}
