import { routing } from '@/i18n/routing';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center p-6 text-center">
        <main>
          <h1 className="text-2xl font-extrabold">Page not found</h1>
          <p className="mt-4">
            <a className="underline" href={`/${routing.defaultLocale}`}>
              Go to Sogda
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
