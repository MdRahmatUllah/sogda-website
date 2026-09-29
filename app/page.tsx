import { routing } from '@/i18n/routing';

const target = `/${routing.defaultLocale}`;

// `/` goes to a locale. #9 makes it pick the visitor's language.
export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <a href={target}>Sogda</a>
      </body>
    </html>
  );
}
