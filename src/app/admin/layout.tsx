import React from "react";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] opacity-70">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Operations Console</h1>
          </div>
          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap gap-3 text-sm"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-dark/20 px-3 py-1.5 underline-offset-4 hover:underline dark:border-light/20"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mt-6">{children}</div>
    </section>
  );
}
