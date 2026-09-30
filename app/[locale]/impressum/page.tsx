import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Detail, hasVatId, LegalPage, legalMetadata } from '@/components/legal/Legal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, 'impressum');
}

// § 5 DDG. Every detail comes from content/legal.json (the owner's); until
// then each shows as a placeholder, and a production build refuses to run.
export default async function Impressum({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const address = (labels: [string, string, string, string]) => (
    <p>
      <Detail k="name" label={labels[0]} />
      <br />
      <Detail k="street" label={labels[1]} />
      <br />
      <Detail k="postcodeCity" label={labels[2]} />
      <br />
      <Detail k="country" label={labels[3]} />
    </p>
  );
  return (
    <LegalPage
      locale={locale}
      title="impressum"
      german={
        <>
          <h2>Angaben gemäß § 5 DDG</h2>
          {address(['Name', 'Straße und Hausnummer', 'PLZ und Ort', 'Land'])}
          <h2>Kontakt</h2>
          <p>
            E-Mail: <Detail k="email" label="E-Mail-Adresse" />
            <br />
            Telefon: <Detail k="phone" label="Telefonnummer" />
          </p>
          {hasVatId && (
            <>
              <h2>Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:{' '}
                <Detail k="vatId" label="USt-IdNr." />
              </p>
            </>
          )}
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            <Detail k="name" label="Name" />, Anschrift wie oben.
          </p>
        </>
      }
      english={
        <>
          <h2>Information according to § 5 DDG (German Digital Services Act)</h2>
          {address(['Name', 'Street and number', 'Postcode and city', 'Country'])}
          <h2>Contact</h2>
          <p>
            Email: <Detail k="email" label="Email address" />
            <br />
            Phone: <Detail k="phone" label="Phone number" />
          </p>
          {hasVatId && (
            <>
              <h2>VAT ID</h2>
              <p>
                VAT identification number under § 27a of the German VAT Act:{' '}
                <Detail k="vatId" label="VAT ID" />
              </p>
            </>
          )}
          <h2>Responsible for the content under § 18(2) MStV</h2>
          <p>
            <Detail k="name" label="Name" />, address as above.
          </p>
        </>
      }
    />
  );
}
