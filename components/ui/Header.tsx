import { Menu } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LANGUAGE_NAMES } from './Footer';
import { HeaderShell } from './HeaderShell';
import { LanguageSwitch } from './LanguageSwitch';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';

// The page's sections, in order (BRIEF §3). A link whose section hasn't landed
// yet points nowhere, harmlessly, until it does.
export const NAV = ['day', 'features', 'screens', 'faq'] as const;

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'header' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const links = NAV.map((id) => ({ href: `#${id}`, label: nav(id) }));
  // The site's languages (BRIEF §7): in the bar on wider screens, in the
  // menu on a phone.
  const switcher = (className: string) =>
    routing.locales.length > 1 && (
      <LanguageSwitch
        locale={locale}
        locales={routing.locales}
        names={LANGUAGE_NAMES}
        label={t('language')}
        className={className}
      />
    );
  return (
    <HeaderShell>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Logo locale={locale} label={t('home')} />
        <nav aria-label={t('nav')} className="ml-6 hidden lg:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-3 font-semibold hover:bg-well">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {switcher('hidden sm:inline-flex')}
          <ThemeToggle label={t('darkTheme')} />
          <a href="#get" className="btn hidden sm:inline-flex">
            {t('getApp')}
          </a>
          <button
            type="button"
            popoverTarget="menu"
            className="icon-btn lg:hidden"
            aria-label={t('menu')}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileMenu
        links={[...links, { href: '#get', label: t('getApp') }]}
        label={t('nav')}
        closeLabel={t('closeMenu')}
      >
        {switcher('mt-4 flex sm:hidden')}
      </MobileMenu>
    </HeaderShell>
  );
}
