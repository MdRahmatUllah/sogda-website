import type { ReactNode } from 'react';
import { Detail, hasVatId } from '@/components/legal/Legal';

type Labels = {
  heading: string;
  address: [string, string, string, string];
  contact: string;
  email: [string, string];
  phone: [string, string];
  vat: [string, string, string];
  responsible: string;
  asAbove: string;
};

// The Impressum in Polish, Russian and Bangla (#147): translations of the
// German, which stays binding. Every detail is still the owner's
// (content/legal.json), shown the same way as in the German.
const LABELS: Record<string, Labels> = {
  pl: {
    heading: 'Informacje zgodnie z § 5 DDG (niemiecka ustawa o usługach cyfrowych)',
    address: ['Imię i nazwisko', 'Ulica i numer', 'Kod pocztowy i miejscowość', 'Kraj'],
    contact: 'Kontakt',
    email: ['E-mail', 'Adres e-mail'],
    phone: ['Telefon', 'Numer telefonu'],
    vat: [
      'Numer VAT',
      'Numer identyfikacyjny VAT zgodnie z § 27a niemieckiej ustawy o podatku od towarów i usług',
      'Numer VAT',
    ],
    responsible: 'Odpowiedzialny za treść zgodnie z § 18 ust. 2 MStV',
    asAbove: 'adres jak wyżej.',
  },
  ru: {
    heading: 'Сведения согласно § 5 DDG (Закон Германии о цифровых услугах)',
    address: ['Имя', 'Улица и номер дома', 'Почтовый индекс и город', 'Страна'],
    contact: 'Контакты',
    email: ['Эл. почта', 'Адрес эл. почты'],
    phone: ['Телефон', 'Номер телефона'],
    vat: [
      'Номер плательщика НДС',
      'Идентификационный номер плательщика НДС согласно § 27a Закона Германии о налоге с оборота',
      'Номер НДС',
    ],
    responsible: 'Ответственный за содержание согласно § 18 абз. 2 MStV',
    asAbove: 'адрес см. выше.',
  },
  bn: {
    heading: '§ 5 DDG (জার্মানির ডিজিটাল সেবা আইন) অনুযায়ী তথ্য',
    address: ['নাম', 'রাস্তা ও বাড়ির নম্বর', 'পোস্টকোড ও শহর', 'দেশ'],
    contact: 'যোগাযোগ',
    email: ['ইমেইল', 'ইমেইল ঠিকানা'],
    phone: ['ফোন', 'ফোন নম্বর'],
    vat: [
      'ভ্যাট আইডি',
      'জার্মান মূল্য সংযোজন কর আইনের § 27a অনুযায়ী ভ্যাট শনাক্তকরণ নম্বর',
      'ভ্যাট আইডি',
    ],
    responsible: '§ 18(2) MStV অনুযায়ী বিষয়বস্তুর জন্য দায়ী',
    asAbove: 'ঠিকানা ওপরের মতো।',
  },
};

export function impressumTranslation(locale: string): ReactNode | undefined {
  const l = LABELS[locale];
  if (!l) return undefined;
  return (
    <>
      <h2>{l.heading}</h2>
      <p>
        <Detail k="name" label={l.address[0]} />
        <br />
        <Detail k="street" label={l.address[1]} />
        <br />
        <Detail k="postcodeCity" label={l.address[2]} />
        <br />
        <Detail k="country" label={l.address[3]} />
      </p>
      <h2>{l.contact}</h2>
      <p>
        {l.email[0]}: <Detail k="email" label={l.email[1]} />
        <br />
        {l.phone[0]}: <Detail k="phone" label={l.phone[1]} />
      </p>
      {hasVatId && (
        <>
          <h2>{l.vat[0]}</h2>
          <p>
            {l.vat[1]}: <Detail k="vatId" label={l.vat[2]} />
          </p>
        </>
      )}
      <h2>{l.responsible}</h2>
      <p>
        <Detail k="name" label={l.address[0]} />, {l.asAbove}
      </p>
    </>
  );
}
