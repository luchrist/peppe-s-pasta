"use client";

import { motion } from "framer-motion";
import config from "@/config/restaurant.json";

const chapters = [
  {
    n: "01",
    title: "Familie am Truck",
    body: "Peppe und seine Familie stehen selbst am Truck. Wer bestellt, schaut beim Kochen zu und kommt fast immer mit einem netten Gespräch wieder heraus."
  },
  {
    n: "02",
    title: "Frisch zubereitet, nichts vorgekocht",
    body: "Pasta wird auf Bestellung gekocht, die Pizza geht direkt in den Ofen. Frische Zutaten, kleine Karte, jede Portion einzeln gemacht."
  },
  {
    n: "03",
    title: "Ehrlich und fair",
    body: "Pizza ab 5 €, Pasta ab 6 € – richtig große Portionen, ohne Aufpreis-Tricks. So bleibt Peppe's Pasta das, was unsere Gäste seit Tag eins schätzen."
  }
];

export function Storia() {
  return (
    <section id="storia" className="relative overflow-hidden bg-bone py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
              <span className="marker" />
              <span>Am Truck</span>
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display text-[40px] leading-[1.02] tracking-tight text-ink md:text-[64px] lg:text-[78px]">
              Ein Foodtruck,
              <br />
              <span className="italic text-basilico-700">eine</span> Familie.
            </h2>
            <p className="mt-8 max-w-[58ch] text-[17px] leading-relaxed text-ink/65">
              {config.intro}
            </p>
          </div>
        </div>

        {/* Chapters */}
        <div className="mt-24 grid grid-cols-1 gap-y-20 md:grid-cols-12 md:gap-x-12">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 100, damping: 22, delay: i * 0.08 }}
              className={
                i === 0
                  ? "md:col-span-7 md:col-start-2"
                  : i === 1
                  ? "md:col-span-5 md:col-start-7"
                  : "md:col-span-6 md:col-start-3"
              }
            >
              <div className="flex items-baseline gap-4 border-t border-ink/15 pt-6">
                <span className="font-mono text-[12px] tracking-[0.2em] text-rosso-600">
                  {ch.n}
                </span>
                <h3 className="font-display text-[26px] leading-tight tracking-tight text-ink md:text-[32px]">
                  {ch.title}
                </h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/60 md:max-w-[44ch]">
                {ch.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
