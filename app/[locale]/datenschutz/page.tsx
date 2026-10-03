import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Detail, LegalPage, legalMetadata } from '@/components/legal/Legal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, 'datenschutz');
}

const VERCEL_PRIVACY = 'https://vercel.com/legal/privacy-policy';
const VERCEL_DPA = 'https://vercel.com/legal/dpa';
const link = 'text-link underline underline-offset-4';

// BRIEF §8: a site that collects nothing: static pages, no cookies, no
// analytics, no third-party requests (the fonts are self-hosted); Vercel
// hosts it and keeps server logs. Two choices (theme, language) stay in the
// visitor's own browser. If Vercel Web Analytics is ever added, this changes.
// §7 covers the app too (#145), since Play's privacy form takes this page:
// every point from the app repo (release.md's Data safety and Permissions,
// BR-PRIV-01/02, BR-DOC-01/05, BR-RATE-01).
export default async function Datenschutz({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      locale={locale}
      title="privacy"
      german={
        <>
          <p className="text-muted">Stand: 3. Oktober 2026</p>
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
            Diese Erklärung gilt auch für die Sogda-App für Android. Die App erhebt keine Daten über
            Sie und gibt keine weiter: Es gibt kein Konto, keine Analyse, keine Werbung und keine
            Werbe-ID. Ohne eine Handlung von Ihnen stellt die App keine Verbindung ins Internet her.
          </p>
          <p>
            <strong>Ihr Lernfortschritt</strong> bleibt in der App auf Ihrem Gerät.
            Android-Sicherung und Geräteübertragung sind für die App abgeschaltet. Ein Export ist
            eine Datei, die Sie selbst teilen.
          </p>
          <p>
            <strong>Ihre Dokumente</strong> (eingefügte oder geteilte Texte, Fotos, PDFs) werden auf
            dem Gerät gelesen, erkannt (Texterkennung von Google ML Kit, mit dem Modell in der App),
            ausgewertet und übersetzt; nichts davon wird gesendet. Die Nutzungsstatistik von ML Kit
            ist in der App abgeschaltet. Fotos werden ohne Standort- und Kameradaten gespeichert
            oder, wenn Sie es so einstellen, gar nicht, und Dokumente können sich nach 30, 90 oder
            365 Tagen selbst löschen.
          </p>
          <p>
            <strong>Downloads, die Sie starten:</strong> Die natürliche Stimme (Supertonic) und der
            Übersetzer (Hy-MT2) werden über WLAN von huggingface.co geladen. Die App fragt dabei nur
            die Dateien an; wie bei jedem Abruf erhält Hugging Face Ihre IP-Adresse, und für seine
            Server gilt die Datenschutzerklärung von Hugging Face.
          </p>
          <p>
            <strong>Mikrofon:</strong> nur für die Aufnahme in der Sprechprüfung. Die Aufnahme
            bleibt auf dem Gerät.
          </p>
          <p>
            <strong>Benachrichtigungen:</strong> die tägliche Erinnerung, wenn Sie sie einschalten,
            und der Fortschritt eines Downloads.
          </p>
          <p>
            <strong>Links:</strong> Erst wenn Sie tippen, öffnet die App eine Webseite im Browser:
            „Report a problem“ (ein vorausgefülltes GitHub-Issue, das Sie absenden können oder
            nicht), Wörterbücher (Duden, DWDS, Wiktionary, Linguee, Google) und den Eintrag bei
            Google Play. Dort gelten die Datenschutzbestimmungen der jeweiligen Seite.
          </p>
          <p>
            <strong>Bewertung:</strong> Nach Ihrer ersten bestandenen Probeprüfung kann einmal die
            Bewertungskarte von Google Play erscheinen. Sie gehört zur Play-Store-App; Sogda sendet
            dabei nichts.
          </p>
          <p>
            Der Verantwortliche (Abschnitt 1) und Ihre Rechte (Abschnitt 8) gelten für die App
            ebenso.
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
          <p className="text-muted">As of 3 October 2026</p>
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
            This policy also covers the Sogda app for Android. The app collects no data about you
            and shares none: there is no account, no analytics, no advertising and no advertising
            ID. The app connects to the internet only when you do something that needs it.
          </p>
          <p>
            <strong>Your progress</strong> stays in the app on your device. Android backup and
            device transfer are switched off for the app. An export is a file you share yourself.
          </p>
          <p>
            <strong>Your documents</strong> (texts you paste or share, photos, PDFs) are read,
            recognised (Google ML Kit text recognition, with the model inside the app), analysed and
            translated on the device; none of it is sent. ML Kit&apos;s usage statistics are
            switched off in the app. Photos are kept without their location or camera data, or not
            at all if you choose, and documents can delete themselves after 30, 90 or 365 days.
          </p>
          <p>
            <strong>Downloads you start:</strong> the natural voice (Supertonic) and the translator
            (Hy-MT2) are fetched over Wi-Fi from huggingface.co. The app only requests the files; as
            with any request, Hugging Face receives your IP address, and Hugging Face&apos;s privacy
            policy applies to its servers.
          </p>
          <p>
            <strong>Microphone:</strong> only for the Speaking exam&apos;s recording, which stays on
            the device.
          </p>
          <p>
            <strong>Notifications:</strong> the daily reminder, if you switch it on, and a
            download&apos;s progress.
          </p>
          <p>
            <strong>Links:</strong> only when you tap does the app open a web page in your browser:
            &ldquo;Report a problem&rdquo; (a pre-filled GitHub issue you may send, or not),
            dictionaries (Duden, DWDS, Wiktionary, Linguee, Google) and the Google Play listing.
            Each site&apos;s own privacy terms apply there.
          </p>
          <p>
            <strong>Rating:</strong> after your first passed mock exam, Google Play&apos;s rating
            card may appear once. It belongs to the Play Store app; Sogda sends nothing with it.
          </p>
          <p>The controller (section 1) and your rights (section 8) apply to the app as well.</p>
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
