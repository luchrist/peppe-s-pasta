import { InstagramLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";
import config from "@/config/restaurant.json";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/peppes_pasta/", Icon: InstagramLogo },
  { label: "Facebook",  href: "https://www.facebook.com/p/Restaurant-Pizzeria-Tutto-Pasta-Ludwigshafen-am-Rhein-100078728535806", Icon: FacebookLogo  }
];

export function Footer() {
  return (
    <footer className="relative bg-bone pb-10 pt-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-12 border-t border-ink/15 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/assets/logo-mark.png"
              alt={`${config.name} Logo`}
              className="h-16 w-16 object-contain md:h-24 md:w-24"
            />
            <div className="font-display text-[40px] leading-none tracking-tight text-ink md:text-[72px]">
              {config.name}
              <span className="text-rosso-600">.</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:flex md:items-end md:gap-12">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">Telefono</div>
              <a href={`tel:${config.contact.phone.replace(/\s/g, "")}`} className="mt-3 block font-mono text-[12px] tracking-[0.05em] text-ink hover:text-rosso-600">
                {config.contact.phone}
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">{config.address.city}</div>
              <div className="mt-3 font-mono text-[12px] tracking-[0.05em] text-ink">{config.address.street}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">Sociale</div>
              <ul className="mt-3 flex items-center gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-bone active:scale-[0.94]"
                    >
                      <Icon size={14} weight="regular" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/45 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {config.name}. Tutti i diritti riservati.</span>
          <span className="flex gap-3">
            <a href="/impressum" className="transition-colors hover:text-ink">Impressum</a>
            <span>·</span>
            <a href="/datenschutz" className="transition-colors hover:text-ink">Datenschutz</a>
          </span>
          <span>
            Website &amp; Design von{" "}
            <a
              href="mailto:luca@creatare.de"
              className="normal-case tracking-normal text-rosso-600 transition-colors hover:text-ink"
            >
              Luca Christ
            </a>
          </span>
        </div>
      </div>

      {/* Italian flag stripe */}
      <div className="mt-10 flex h-2">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#CE2B37]" />
      </div>
    </footer>
  );
}
