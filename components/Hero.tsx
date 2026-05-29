"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let ctx: gsap.Context | undefined;
    const getScrollDistance = () =>
      window.matchMedia("(min-width: 768px)").matches
        ? window.innerHeight * 1.2
        : window.innerHeight * 0.8;

    const init = () => {
      if (!video.duration || !isFinite(video.duration)) return;
      ctx = gsap.context(() => {
        gsap.to(video, {
          currentTime: video.duration,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scrub: 0.12,
          },
        });
      }, section);
    };

    const onReady = () => {
      video.currentTime = 0.01;
      setVideoReady(true);
      init();
    };

    // readyState >= 2 (HAVE_CURRENT_DATA) = first frame is decoded.
    // loadedmetadata (readyState >= 1) only guarantees metadata — no
    // actual frame data on mobile cold cache.
    if (video.readyState >= 2 && video.duration) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bone">
      <div className="relative h-[100dvh] overflow-hidden">
        {/* Video container — full bleed */}
        <div className="absolute inset-0">
          {/* Poster fallback — sits on top, fades out once the video's
              first frame is actually decoded. Replaces the native poster
              attr which gets yanked by the browser as soon as we seek. */}
          <img
            src="/hero-poster.jpg"
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[60%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-700 md:inset-0 md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:object-cover ${videoReady ? "opacity-0" : "opacity-100"}`}
          />
          <video
            ref={videoRef}
            className="absolute left-1/2 top-1/2 h-[60%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 md:inset-0 md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:object-cover"
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as Record<string, string>)}
          >
            <source src="/hero-scrub.mp4" type="video/mp4" />
          </video>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-bone via-bone to-transparent md:hidden" />

          {/* Bottom fade into bone */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent via-bone to-bone md:h-32" />
        </div>

        {/* Content overlay — top-left, above the pizza */}
        <div className="pointer-events-none absolute inset-0 z-20 flex">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[1400px] items-start px-6 pt-28 md:px-12 md:pt-36 lg:px-14">
            <div className="max-w-md">
              <h1 className="font-display text-[36px] leading-[0.95] tracking-tight text-ink sm:text-[44px] md:text-[58px] lg:text-[68px]">
                Ein Stück Italien
                <br />
                <span className="italic text-rosso-600">am Truck.</span>
              </h1>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/70 md:text-[16px]">
                Pizza und Pasta, frisch zubereitet in der Hofstraße 1. Familiengeführt, ehrlich, mit großen Portionen zum fairen Preis.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <a
                  href="/bestellen"
                  className="inline-flex items-center justify-center rounded-full bg-rosso-600 px-7 py-3 text-[13px] font-medium tracking-wide text-bone transition-colors hover:bg-rosso-700"
                >
                  Online bestellen
                </a>
                <a
                  href="#carta"
                  className="inline-flex items-center justify-center rounded-full border border-ink/25 bg-bone/70 px-7 py-3 text-[13px] font-medium tracking-wide text-ink backdrop-blur-sm transition-colors hover:bg-bone/90"
                >
                  Carta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}