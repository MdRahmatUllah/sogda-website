/* eslint-disable @next/next/no-img-element -- Google's badge artwork, served unmodified */
import { Bell, Play, Smartphone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { site } from '@/site.config';
import { QrCode } from './QrCode';

export function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 font-semibold text-ink">
      {icon}
      {children}
    </span>
  );
}

// Google Play first; iPhone is coming soon (CLAUDE.md, Hard rules):
// - no Play URL yet: a "Coming soon to Google Play" chip, and no QR code;
// - with one: Google's official badge, unmodified, and on wide screens a QR
//   code (useless on the phone that would scan it).
// Apple's badge is never shown before the app is listed.
export async function StoreBadges({
  locale,
  qr = true,
  playStoreUrl = site.playStoreUrl,
  className = '',
}: {
  locale: string;
  qr?: boolean;
  className?: string;
  /** Only the component gallery passes it, to show the live state early. */
  playStoreUrl?: string | null;
}) {
  const t = await getTranslations({ locale, namespace: 'store' });
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {playStoreUrl ? (
        <>
          <a href={playStoreUrl} className="rounded-lg">
            <img
              src={`/badges/google-play-${locale}.png`}
              alt={t('googlePlay')}
              width={646}
              height={250}
              className="h-[4.5rem] w-auto"
            />
          </a>
          {qr && (
            <div className="hidden lg:block">
              <QrCode url={playStoreUrl} label={t('qr')} />
            </div>
          )}
        </>
      ) : (
        <>
          <Chip icon={<Play aria-hidden="true" className="size-5" />}>{t('googlePlaySoon')}</Chip>
          {/* #62, the owner's O4 (#56): until the Play link exists, a visitor
              can ask to be told. A mailto only: the site posts nothing. */}
          {site.contactEmail && (
            <a
              href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(t('notifySubject'))}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 font-semibold text-paper"
            >
              <Bell aria-hidden="true" className="size-5" />
              {t('notify')}
            </a>
          )}
        </>
      )}
      {site.appStore === 'coming-soon' && (
        <Chip icon={<Smartphone aria-hidden="true" className="size-5" />}>{t('iphoneSoon')}</Chip>
      )}
    </div>
  );
}
