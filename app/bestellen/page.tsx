"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "@/config/restaurant.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CartItem {
  name: string;
  price: number;
  qty: number;
  category: string;
}

type MenuItem = { name: string; description?: string; price: string };
type MenuCategory = { category: string; subtitle?: string; items: MenuItem[] };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** "10,50 €" → 10.5 */
function parsePrice(raw: string): number {
  const n = parseFloat(String(raw).replace(/[^\d,.]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** 10.5 → "10,50 €" */
function fmtPrice(n: number): string {
  return n.toFixed(2).replace(".", ",") + " €";
}

const FREE_DELIVERY_MIN = 25; // euro
const BELIEBTESTE_LABEL = "Beliebteste";

/* Category classification is derived from the live menu so the page works for
   any restaurant: drinks and desserts are detected by their category name,
   everything else counts as a "main" dish that can trigger an upsell. */
const DRINK_RE = /getr(ä|a)nk|drink|bibite|beverage|trinken|softdrink|durst|wein|bier|cocktail/i;
const DESSERT_RE = /dolc|dessert|nachtisch|s(ü|u)(ß|ss)speise|sweet|gelat|\beis\b|tiramis/i;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BestellenPage() {
  const menu = useMemo<MenuCategory[]>(
    () => (Array.isArray(config.menu) ? (config.menu as unknown as MenuCategory[]) : []),
    []
  );

  const drinkCat = useMemo(
    () => menu.find((c) => DRINK_RE.test(c.category || "")),
    [menu]
  );
  const dessertCat = useMemo(
    () =>
      menu.find(
        (c) => DESSERT_RE.test(c.category || "") && !DRINK_RE.test(c.category || "")
      ),
    [menu]
  );

  const isMainCategory = useCallback(
    (name: string) =>
      name === BELIEBTESTE_LABEL ||
      (!DRINK_RE.test(name || "") && !DESSERT_RE.test(name || "")),
    []
  );

  /* "Beliebteste" — a curated cross-section of the main dishes, built by
     round-robin across the main categories so the tab always has content. */
  const beliebteste = useMemo<MenuCategory>(() => {
    const mainCats = menu.filter((c) => isMainCategory(c.category));
    const items: MenuItem[] = [];
    for (let round = 0; round < 12 && items.length < 12; round++) {
      for (const cat of mainCats) {
        const item = cat.items?.[round];
        if (item) items.push(item);
        if (items.length >= 12) break;
      }
    }
    return { category: BELIEBTESTE_LABEL, subtitle: "Das wird am meisten bestellt", items };
  }, [menu, isMainCategory]);

  const categories: MenuCategory[] = useMemo(
    () => (beliebteste.items.length > 0 ? [beliebteste, ...menu] : menu),
    [beliebteste, menu]
  );
  const [active, setActive] = useState(0);
  const current = categories[active] ?? { category: "", subtitle: "", items: [] };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    type: "drink" | "dessert";
    item: MenuItem;
  } | null>(null);

  /* derived */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const remaining = Math.max(0, FREE_DELIVERY_MIN - subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_MIN);

  /* cart helpers */
  const addToCart = useCallback(
    (
      name: string,
      price: number,
      category: string,
      showSuggestion = true
    ) => {
      setCart((prev) => {
        const idx = prev.findIndex((i) => i.name === name);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { name, price, qty: 1, category }];
      });

      /* show suggestion when adding a main dish */
      if (showSuggestion && isMainCategory(category)) {
        const hasDrink = drinkCat
          ? cart.some((i) => i.category === drinkCat.category)
          : true;
        const hasDessert = dessertCat
          ? cart.some((i) => i.category === dessertCat.category)
          : true;

        if (!hasDrink && drinkCat && drinkCat.items.length > 0) {
          const pick =
            drinkCat.items[Math.floor(Math.random() * drinkCat.items.length)];
          setSuggestion({ type: "drink", item: pick });
          return;
        }
        if (!hasDessert && dessertCat && dessertCat.items.length > 0) {
          const pick =
            dessertCat.items[Math.floor(Math.random() * dessertCat.items.length)];
          setSuggestion({ type: "dessert", item: pick });
          return;
        }
      }
    },
    [cart, drinkCat, dessertCat, isMainCategory]
  );

  const changeQty = useCallback((name: string, delta: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.name === name);
      if (idx === -1) return prev;
      const newQty = prev[idx].qty + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== idx);
      const next = [...prev];
      next[idx] = { ...next[idx], qty: newQty };
      return next;
    });
  }, []);

  /* close suggestion after 6s */
  useEffect(() => {
    if (!suggestion) return;
    const t = setTimeout(() => setSuggestion(null), 6000);
    return () => clearTimeout(t);
  }, [suggestion]);

  return (
    <main className="min-h-screen bg-bone pb-36 md:pb-10">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-ink/10">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-10 md:py-4">
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
            &larr; Zur&uuml;ck
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-10 md:py-10">
        {/* ── Live delivery time ───────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.06em] text-ink/70 md:text-[12px]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basilico-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-basilico-500" />
            </span>
            Aktuelle Lieferzeit ca. 30 – 45 Min.
          </div>
          <a
            href={`tel:${(config.contact?.phone || "").replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink md:text-[12px]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Einfach anrufen: {config.contact?.phone}
          </a>
        </div>

        {/* ── Main grid: menu + cart ───────────────────────────── */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 md:gap-x-10">
          {/* LEFT: menu browser */}
          <div className="col-span-12 lg:col-span-8">
            {/* Category tabs */}
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 md:mx-0 md:flex-wrap md:gap-2.5 md:px-0">
              {categories.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.category}
                    onClick={() => setActive(i)}
                    className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-all md:text-[11px] md:tracking-[0.2em] ${
                      isActive
                        ? "border-ink bg-ink text-bone"
                        : "border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {c.category}
                  </button>
                );
              })}
            </div>

            {/* Subtitle */}
            {current.subtitle && (
              <p className="mt-6 text-[13px] leading-relaxed text-ink/50">
                {current.subtitle}
              </p>
            )}

            {/* Items list */}
            <AnimatePresence mode="wait">
              <motion.ul
                key={current.category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4 divide-y divide-ink/10"
              >
                {current.items.map((item) => {
                  const inCart = cart.find((c) => c.name === item.name);
                  return (
                    <li
                      key={item.name}
                      className="flex items-center gap-4 py-5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-display text-[18px] tracking-tight text-ink md:text-[20px]">
                            {item.name}
                          </h3>
                          {inCart && (
                            <span className="shrink-0 rounded-full bg-rosso-600 px-2 py-0.5 font-mono text-[10px] text-bone">
                              {inCart.qty}x
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-1 text-[13px] leading-relaxed text-ink/50">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-mono text-[14px] tracking-[0.03em] text-ink/70">
                        {item.price}
                      </span>
                      <button
                        onClick={() =>
                          addToCart(
                            item.name,
                            parsePrice(item.price),
                            current.category
                          )
                        }
                        className="group relative shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink/60 transition-all hover:border-ink hover:bg-ink hover:text-bone active:scale-[0.92]"
                        aria-label={`${item.name} hinzufügen`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="transition-transform group-hover:scale-110"
                        >
                          <path
                            d="M7 1v12M1 7h12"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* RIGHT: cart (desktop) */}
          <div className="col-span-12 hidden lg:col-span-4 lg:block">
            <Cart
              cart={cart}
              subtotal={subtotal}
              remaining={remaining}
              progress={progress}
              totalItems={totalItems}
              changeQty={changeQty}
              freeDeliveryMin={FREE_DELIVERY_MIN}
            />
          </div>
        </div>
      </div>

      {/* ── Suggestion toast ───────────────────────────────────── */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-4 right-4 z-30 mx-auto max-w-md rounded-2xl border border-ink/10 bg-bone px-5 py-4 shadow-xl md:bottom-8 md:left-auto md:right-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-[22px]">
                {suggestion.type === "drink" ? "🥤" : "🍰"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  {suggestion.type === "drink"
                    ? "Dazu ein Getränk?"
                    : "Noch ein Nachtisch?"}
                </p>
                <p className="mt-0.5 truncate font-display text-[16px] tracking-tight text-ink">
                  {suggestion.item.name}{" "}
                  <span className="font-mono text-[12px] text-ink/50">
                    {suggestion.item.price}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  addToCart(
                    suggestion.item.name,
                    parsePrice(suggestion.item.price),
                    suggestion.type === "drink"
                      ? drinkCat?.category ?? ""
                      : dessertCat?.category ?? "",
                    false
                  );
                  setSuggestion(null);
                }}
                className="shrink-0 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone transition-transform hover:scale-[1.04] active:scale-[0.96]"
              >
                Ja, dazu
              </button>
              <button
                onClick={() => setSuggestion(null)}
                className="shrink-0 text-ink/35 transition-colors hover:text-ink"
                aria-label="Schließen"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile cart bar ─────────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-bone/95 px-5 pb-[env(safe-area-inset-bottom,0px)] pt-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setShowCart(true)}
            className="flex w-full items-center justify-between rounded-full bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rosso-600 text-[10px]">
                {totalItems}
              </span>
              Warenkorb anzeigen
            </span>
            <span>{fmtPrice(subtotal)}</span>
          </button>
        </div>
      )}

      {/* ── Mobile cart sheet ──────────────────────────────────── */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 z-40 bg-ink/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.05}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 80 || info.velocity.y > 300) {
                  setShowCart(false);
                }
              }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-bone px-5 pb-[env(safe-area-inset-bottom,16px)] pt-6"
              style={{ touchAction: "none" }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15" />
              <Cart
                cart={cart}
                subtotal={subtotal}
                remaining={remaining}
                progress={progress}
                totalItems={totalItems}
                changeQty={changeQty}
                freeDeliveryMin={FREE_DELIVERY_MIN}
                onClose={() => setShowCart(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart sub-component                                                 */
/* ------------------------------------------------------------------ */

function Cart({
  cart,
  subtotal,
  remaining,
  progress,
  totalItems,
  changeQty,
  freeDeliveryMin,
  onClose,
}: {
  cart: CartItem[];
  subtotal: number;
  remaining: number;
  progress: number;
  totalItems: number;
  changeQty: (name: string, delta: number) => void;
  freeDeliveryMin: number;
  onClose?: () => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white/50 p-8 text-center">
        <p className="font-display text-[22px] tracking-tight text-ink/30">
          Dein Warenkorb ist leer
        </p>
        <p className="mt-2 text-[13px] text-ink/40">
          W&auml;hle Gerichte aus der Karte links aus.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/50 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[22px] tracking-tight text-ink">
          Warenkorb
          <span className="ml-2 font-mono text-[12px] text-ink/40">
            ({totalItems})
          </span>
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-ink/40 transition-colors hover:text-ink"
            aria-label="Schließen"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Items */}
      <ul className="mt-5 divide-y divide-ink/8">
        {cart.map((item) => (
          <li key={item.name} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="truncate text-[14px] font-medium text-ink">
                {item.name}
              </p>
              <p className="font-mono text-[12px] text-ink/45">
                {fmtPrice(item.price)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => changeQty(item.name, -1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-[14px] text-ink/50 transition-colors hover:border-ink/40 hover:text-ink"
                aria-label="Weniger"
              >
                &minus;
              </button>
              <span className="w-7 text-center font-mono text-[13px] text-ink">
                {item.qty}
              </span>
              <button
                onClick={() => changeQty(item.name, 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-[14px] text-ink/50 transition-colors hover:border-ink/40 hover:text-ink"
                aria-label="Mehr"
              >
                +
              </button>
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-[13px] text-ink">
              {fmtPrice(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      {/* Delivery threshold */}
      <div className="mt-5 rounded-xl bg-ink/[0.04] px-4 py-3">
        {remaining > 0 ? (
          <>
            <p className="text-[12px] text-ink/60">
              Noch{" "}
              <span className="font-medium text-ink">{fmtPrice(remaining)}</span>{" "}
              bis zur kostenlosen Lieferung
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                className="h-full rounded-full bg-rosso-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </>
        ) : (
          <p className="flex items-center gap-2 text-[12px] font-medium text-basilico-700">
            <span className="block h-2 w-2 rounded-full bg-basilico-500" />
            Kostenlose Lieferung!
          </p>
        )}
      </div>

      {/* Subtotal */}
      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
          Zwischensumme
        </span>
        <span className="font-display text-[22px] tracking-tight text-ink">
          {fmtPrice(subtotal)}
        </span>
      </div>

      {/* Order button */}
      <button
        onClick={() => {
          /* noch nicht aktiv */
        }}
        className="group relative mt-5 w-full overflow-hidden rounded-full bg-rosso-600 px-6 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-bone transition-transform active:scale-[0.98]"
      >
        <span className="relative z-10">Bestellen</span>
        <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </button>
    </div>
  );
}
