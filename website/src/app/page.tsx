import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "David Jackson",
  description: "Contact details and professional links for David Jackson.",
};

const links = [
  {
    label: "Resume",
    href: "https://ca.linkedin.com/in/davidjackson123",
  },
  {
    label: "GitHub",
    href: "https://github.com/iamdavidjackson",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center bg-zinc-950 px-6 py-16 text-zinc-100 selection:bg-amber-300 selection:text-zinc-950">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-5 font-mono text-sm uppercase tracking-[0.24em] text-amber-300">
          Toronto, Canada
        </p>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          David Jackson
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
          Frontend architect and engineering leader working at the intersection
          of product, design, and technology.
        </p>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <p className="text-sm text-zinc-500">Get in touch</p>
          <a
            className="mt-2 inline-block text-xl underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-amber-300 hover:decoration-amber-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            href="mailto:davidjackson123@gmail.com"
          >
            davidjackson123@gmail.com
          </a>
        </div>

        <nav
          className="mt-12 flex flex-wrap gap-x-8 gap-y-4"
          aria-label="Professional links"
        >
          {links.map((link) => (
            <a
              key={link.label}
              className="group inline-flex items-center gap-2 text-base font-medium text-zinc-300 transition-colors hover:text-amber-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
