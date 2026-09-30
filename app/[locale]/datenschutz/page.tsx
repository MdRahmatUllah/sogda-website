import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Detail, LegalPage, legalMetadata } from '@/components/legal/Legal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, 'privacy');
}

const VERCEL_PRIVACY = 'https://vercel.com/legal/privacy-policy';
const VERCEL_DPA = 'https://vercel.com/legal/dpa';
const link = 'text-link underline underline-offset-4';

// BRIEF §8: a site that collects nothing: static pages, no cookies, no
// analytics, no third-party requests (the fonts are self-hosted); Vercel
// hosts it and keeps server logs. Two choices (theme, language) stay in the
// visitor's own browser. If Vercel Web Analytics is ever added, this changes.
export default async function Datenschutz({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      locale={locale}
      title="privacy"
      german={
        <>
          <p className="text-muted">Stand: 30. September 2026</p>
          <h2>1. Verantwortlicher</h2>
          <p>
            <Detail k="name" label="Name" />, <Detail k="street" label="Straße und Hausnummer" />,{' '}
            <Detail k="postcodeCity" label="PLZ und Ort" />, <Detail k="country" label="Land" />.
            E-Mail: <Detail k="email" label="E-Mail-Adresse" />. Siehe auch das{' '}
            <a className={link} href={`/${locale}/impressum`}>
              Impressum
            </a>
            .
          </p>
          <h2>2. Kurz gesagt</h2>
          <p>
            Diese Website besteht aus statischen Seiten. Sie setzt keine Cookies, verwendet keine
            Analyse- oder Tracking-Werkzeuge und lädt keine Inhalte von Dritten; auch die Schriften
            liefern wir selbst aus. Es gibt kein Formular, das Daten sendet.
          </p>
          <h2>3. Hosting</h2>
          <p>
            Die Website wird von Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA,
            ausgeliefert. Beim Aufruf einer Seite verarbeitet Vercel technisch notwendige Daten in
            Server-Protokollen: IP-Adresse, Datum und Uhrzeit, die aufgerufene Seite, die zuvor
            besuchte Seite (Referrer) und die Kennung Ihres Browsers (User-Agent). Rechtsgrundlage
            ist Art. 6 Abs. 1 lit. f DSGVO: unser berechtigtes Interesse, die Website sicher und
            zuverlässig auszuliefern. Vercel verarbeitet diese Daten in unserem Auftrag;
            Übermittlungen in die USA stützen sich auf die Garantien in Vercels
            Auftragsverarbeitungsvertrag (
            <a className={link} href={VERCEL_DPA}>
              {VERCEL_DPA}
            </a>
            ). Näheres in Vercels Datenschutzerklärung:{' '}
            <a className={link} href={VERCEL_PRIVACY}>
              {VERCEL_PRIVACY}
            </a>
            .
          </p>
          <h2>4. Was Ihr Browser speichert</h2>
          <p>
            Wählen Sie das helle oder dunkle Farbschema oder eine Sprache, speichert Ihr Browser
            diese Wahl lokal (localStorage), damit sie beim nächsten Besuch gilt. Diese Angaben
            verlassen Ihr Gerät nicht, und Sie können sie jederzeit in Ihrem Browser löschen. Die
            Speicherung ist für die von Ihnen gewünschte Funktion unbedingt erforderlich (§ 25 Abs.
            2 Nr. 2 TDDDG).
          </p>
          <h2>5. Kontakt per E-Mail</h2>
          <p>
            Wenn Sie uns schreiben, verarbeiten wir Ihre Angaben, um Ihre Anfrage zu beantworten
            (Art. 6 Abs. 1 lit. b oder f DSGVO), und löschen sie, sobald sie dafür nicht mehr nötig
            sind.
          </p>
          <h2>6. Links zu Google Play</h2>
          <p>
            Die Schaltfläche zu Google Play ist ein einfacher Link. Erst wenn Sie ihm folgen, gelten
            die Datenschutzbestimmungen von Google. Der QR-Code entsteht beim Erstellen der Website
            und lädt nichts nach.
          </p>
          <h2>7. Die App</h2>
          <p>
            Diese Erklärung gilt für die Website. Die Sogda-App funktioniert offline, hat kein
            Konto, und Ihr Lernfortschritt bleibt auf Ihrem Gerät.
          </p>
          <h2>8. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art.
            17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und
            Widerspruch (Art. 21). Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde
            beschweren (Art. 77 DSGVO); für uns zuständig ist das Bayerische Landesamt für
            Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach. Eine automatisierte
            Entscheidungsfindung oder ein Profiling findet nicht statt.
          </p>
        </>
      }
      english={
        <>
          <p className="text-muted">As of 30 September 2026</p>
          <h2>1. Controller</h2>
          <p>
            <Detail k="name" label="Name" />, <Detail k="street" label="Street and number" />,{' '}
            <Detail k="postcodeCity" label="Postcode and city" />,{' '}
            <Detail k="country" label="Country" />. Email:{' '}
            <Detail k="email" label="Email address" />. See also the{' '}
            <a className={link} href={`/${locale}/impressum`}>
              Impressum
            </a>
            .
          </p>
          <h2>2. In short</h2>
          <p>
            This website is made of static pages. It sets no cookies, uses no analytics or tracking
            tools, and loads nothing from third parties; we serve the fonts ourselves too. There is
            no form that sends data.
          </p>
          <h2>3. Hosting</h2>
          <p>
            The website is served by Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
            USA. When a page is requested, Vercel processes technically necessary data in server
            logs: the IP address, the date and time, the page requested, the page you came from
            (referrer) and your browser&apos;s identification (user agent). The legal basis is Art.
            6(1)(f) GDPR: our legitimate interest in delivering the website securely and reliably.
            Vercel processes this data on our behalf; transfers to the USA rely on the safeguards in
            Vercel&apos;s data processing agreement (
            <a className={link} href={VERCEL_DPA}>
              {VERCEL_DPA}
            </a>
            ). More in Vercel&apos;s privacy policy:{' '}
            <a className={link} href={VERCEL_PRIVACY}>
              {VERCEL_PRIVACY}
            </a>
            .
          </p>
          <h2>4. What your browser stores</h2>
          <p>
            If you choose the light or dark theme, or a language, your browser stores that choice
            locally (localStorage) so it applies on your next visit. It never leaves your device,
            and you can delete it in your browser at any time. Storing it is strictly necessary for
            the function you asked for (§ 25(2) no. 2 TDDDG).
          </p>
          <h2>5. Contact by email</h2>
          <p>
            If you write to us, we process your details to answer you (Art. 6(1)(b) or (f) GDPR) and
            delete them once they are no longer needed for that.
          </p>
          <h2>6. Links to Google Play</h2>
          <p>
            The Google Play button is a plain link. Google&apos;s privacy terms apply only once you
            follow it. The QR code is made when the website is built and loads nothing.
          </p>
          <h2>7. The app</h2>
          <p>
            This policy covers the website. The Sogda app works offline, has no account, and your
            progress stays on your device.
          </p>
          <h2>8. Your rights</h2>
          <p>
            You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17),
            restriction of processing (Art. 18), data portability (Art. 20) and objection (Art. 21).
            You can also complain to a data protection supervisory authority (Art. 77 GDPR); the one
            responsible for us is the Bavarian Data Protection Authority (Bayerisches Landesamt für
            Datenschutzaufsicht, BayLDA), Promenade 18, 91522 Ansbach. There is no automated
            decision-making or profiling.
          </p>
        </>
      }
    />
  );
}
