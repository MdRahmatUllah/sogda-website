import { routing } from '@/i18n/routing';

// `/` (BRIEF §7): the visitor's remembered choice, else the first of the
// browser's languages the site speaks, else English. A tiny inline script
// (hashed into the page's CSP); without JS, /en.
const pick = `(function(){var L=${JSON.stringify(routing.locales)},p;try{p=localStorage.getItem('locale')}catch(e){}if(L.indexOf(p)<0){p='${routing.defaultLocale}';var n=navigator.languages||[navigator.language||''];for(var i=0;i<n.length;i++){var c=String(n[i]).toLowerCase().split('-')[0];if(L.indexOf(c)>=0){p=c;break}}}location.replace('/'+p+location.hash)})()`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <title>Sogda</title>
        <script dangerouslySetInnerHTML={{ __html: pick }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=/${routing.defaultLocale}`} />
        </noscript>
        {routing.locales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`/${routing.defaultLocale}`} />
      </head>
      <body>
        <ul>
          {routing.locales.map((l) => (
            <li key={l}>
              <a href={`/${l}`} lang={l}>
                Sogda ({l})
              </a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
