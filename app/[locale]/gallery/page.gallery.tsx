/* eslint-disable @next/next/no-img-element -- the brand icon as a stand-in screen */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { QrCode } from '@/components/ui/QrCode';
import { StoreBadges } from '@/components/ui/StoreBadges';

// Every shared component, for eyes and axe (dev only; see next.config.ts).
export const metadata: Metadata = { robots: { index: false } };

export default function Gallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const screen = <img src="/brand/icon-tiles-full.svg" alt="" className="size-full object-cover" />;
  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">Component gallery</h1>
      <section className="grid gap-4">
        <h2 className="text-xl font-bold">Store: before the Play link</h2>
        <StoreBadges locale={locale} playStoreUrl={null} />
      </section>
      <section className="grid gap-4">
        <h2 className="text-xl font-bold">Store: with the Play link</h2>
        <StoreBadges
          locale={locale}
          playStoreUrl="https://play.google.com/store/apps/details?id=de.sogda.app"
        />
      </section>
      <section className="grid gap-4">
        <h2 className="text-xl font-bold">QR code</h2>
        <QrCode url="https://sogda.de" label="QR code for sogda.de" />
      </section>
      <section className="grid gap-4">
        <h2 className="text-xl font-bold">Buttons and cards</h2>
        <div className="flex flex-wrap items-center gap-4">
          <a className="btn" href="#get">
            Get the app
          </a>
        </div>
        <div className="card max-w-sm p-6">
          <h3 className="font-bold">A card</h3>
          <p className="mt-2 text-muted">2 px outline and a hard offset shadow, as in the app.</p>
        </div>
        <div className="on-lagoon rounded-card bg-lagoon p-6 text-ink">
          <p className="font-bold">A Lagoon band: Ink text, never white.</p>
          <a className="btn mt-4 bg-paper" href="#get">
            On Lagoon
          </a>
        </div>
      </section>
      <section className="grid gap-4">
        <h2 className="text-xl font-bold">Device frames</h2>
        <div className="flex flex-wrap items-end gap-10">
          <DeviceFrame className="w-56">{screen}</DeviceFrame>
          <DeviceFrame kind="tablet" className="w-full max-w-xl">
            {screen}
          </DeviceFrame>
        </div>
      </section>
    </main>
  );
}
