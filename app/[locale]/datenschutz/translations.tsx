import type { ReactNode } from 'react';
import { Detail } from '@/components/legal/Legal';

export const VERCEL_PRIVACY = 'https://vercel.com/legal/privacy-policy';
export const VERCEL_DPA = 'https://vercel.com/legal/dpa';
export const link = 'text-link underline underline-offset-4';

// The privacy policy in Polish, Russian and Bangla (#147, the owner's ask on
// #146). Translations of the German, which stays the binding text; each
// page's note above says so. App labels are the app's own (studyMenuReport,
// examSectionSpeaking, myDocumentsTitle in app_<lang>.arb).
export function privacyTranslation(locale: string): ReactNode | undefined {
  const impressum = (
    <a className={link} href={`/${locale}/impressum`}>
      Impressum
    </a>
  );
  const dpa = (
    <a className={link} href={VERCEL_DPA}>
      {VERCEL_DPA}
    </a>
  );
  const vercel = (
    <a className={link} href={VERCEL_PRIVACY}>
      {VERCEL_PRIVACY}
    </a>
  );
  switch (locale) {
    case 'pl':
      return (
        <>
          <p className="text-muted">Stan na: 3 października 2026 r.</p>
          <h2>1. Administrator</h2>
          <p>
            <Detail k="name" label="Imię i nazwisko" />, <Detail k="street" label="Ulica i numer" />
            , <Detail k="postcodeCity" label="Kod pocztowy i miejscowość" />,{' '}
            <Detail k="country" label="Kraj" />. E-mail: <Detail k="email" label="Adres e-mail" />.
            Zob. także {impressum}.
          </p>
          <h2>2. W skrócie</h2>
          <p>
            Ta strona internetowa składa się ze statycznych stron. Nie ustawia plików cookie, nie
            korzysta z narzędzi analitycznych ani śledzących i nie wczytuje niczego od podmiotów
            trzecich; także czcionki udostępniamy sami. Nie ma formularza, który wysyłałby dane.
          </p>
          <h2>3. Hosting</h2>
          <p>
            Stronę udostępnia Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA. Przy
            wywołaniu strony Vercel przetwarza w logach serwera dane niezbędne technicznie: adres
            IP, datę i godzinę, wywołaną stronę, stronę, z której Państwo przyszli (referrer), oraz
            identyfikator przeglądarki (user agent). Podstawą prawną jest art. 6 ust. 1 lit. f RODO:
            nasz prawnie uzasadniony interes w bezpiecznym i niezawodnym udostępnianiu strony.
            Vercel przetwarza te dane w naszym imieniu; przekazywanie danych do USA opiera się na
            zabezpieczeniach z umowy powierzenia przetwarzania danych zawartej z Vercel ({dpa}).
            Więcej w polityce prywatności Vercel: {vercel}.
          </p>
          <h2>4. Co zapisuje Państwa przeglądarka</h2>
          <p>
            Jeśli wybiorą Państwo jasny lub ciemny motyw albo język, przeglądarka zapisuje ten wybór
            lokalnie (localStorage), aby obowiązywał przy następnej wizycie. Te informacje nie
            opuszczają Państwa urządzenia i można je w każdej chwili usunąć w przeglądarce.
            Zapisanie ich jest niezbędne do działania funkcji, o którą Państwo prosili (§ 25 ust. 2
            pkt 2 TDDDG).
          </p>
          <h2>5. Kontakt e-mailowy</h2>
          <p>
            Jeśli Państwo do nas napiszą, przetwarzamy Państwa dane, aby odpowiedzieć (art. 6 ust. 1
            lit. b lub f RODO), i usuwamy je, gdy nie są już do tego potrzebne.
          </p>
          <h2>6. Linki do Google Play</h2>
          <p>
            Przycisk Google Play to zwykły link. Zasady prywatności Google obowiązują dopiero wtedy,
            gdy Państwo w niego klikną. Kod QR powstaje podczas budowania strony i niczego nie
            wczytuje.
          </p>
          <h2>7. Aplikacja</h2>
          <p>
            Niniejsza polityka obejmuje także aplikację Sogda na Androida. Aplikacja nie zbiera
            żadnych danych o Państwu i niczego nie udostępnia: nie ma konta, analityki, reklam ani
            identyfikatora reklamowego. Aplikacja łączy się z internetem tylko wtedy, gdy zrobią
            Państwo coś, co tego wymaga.
          </p>
          <p>
            <strong>Postępy w nauce</strong> pozostają w aplikacji na Państwa urządzeniu. Kopia
            zapasowa Androida i przenoszenie na inne urządzenie są dla aplikacji wyłączone. Eksport
            to plik, który Państwo sami udostępniają.
          </p>
          <p>
            <strong>Państwa dokumenty</strong> (wklejone lub udostępnione teksty, zdjęcia, pliki
            PDF) są odczytywane, rozpoznawane (rozpoznawanie tekstu Google ML Kit, z modelem w
            aplikacji), analizowane i tłumaczone na urządzeniu; nic z tego nie jest wysyłane.
            Statystyki użycia ML Kit są w aplikacji wyłączone. Zdjęcia są zapisywane bez danych o
            lokalizacji i aparacie albo, jeśli Państwo tak ustawią, wcale, a dokumenty mogą same się
            usuwać po 30, 90 lub 365 dniach.
          </p>
          <p>
            <strong>Pobrania uruchamiane przez Państwa:</strong> naturalny głos (Supertonic) i
            tłumacz (Hy-MT2) są pobierane z huggingface.co, domyślnie tylko przez Wi‑Fi. Aplikacja
            wysyła wyłącznie żądanie plików; jak przy każdym żądaniu, Hugging Face otrzymuje Państwa
            adres IP, a dla jego serwerów obowiązuje polityka prywatności Hugging Face.
          </p>
          <p>
            <strong>Mikrofon:</strong> tylko do nagrania w części „Mówienie” egzaminu; nagranie
            pozostaje na urządzeniu.
          </p>
          <p>
            <strong>Powiadomienia:</strong> codzienne przypomnienie, jeśli Państwo je włączą, oraz
            postęp pobierania.
          </p>
          <p>
            <strong>Linki:</strong> dopiero po dotknięciu aplikacja otwiera stronę internetową w
            przeglądarce: „Zgłoś problem” (wstępnie wypełnione zgłoszenie w serwisie GitHub, które
            można wysłać lub nie), słowniki (Duden, DWDS, Wiktionary, Linguee, Google) oraz stronę
            aplikacji w Google Play. Tam obowiązują zasady prywatności danej strony.
          </p>
          <p>
            <strong>Ocena:</strong> po pierwszym zdanym egzaminie próbnym może raz pojawić się karta
            oceny Google Play. Należy ona do aplikacji Sklep Play; Sogda niczego przy tym nie
            wysyła.
          </p>
          <p>Administrator (punkt 1) i Państwa prawa (punkt 8) dotyczą także aplikacji.</p>
          <h2>8. Państwa prawa</h2>
          <p>
            Przysługuje Państwu prawo dostępu do danych (art. 15 RODO), ich sprostowania (art. 16),
            usunięcia (art. 17), ograniczenia przetwarzania (art. 18), przenoszenia danych (art. 20)
            oraz prawo sprzeciwu (art. 21). Mogą Państwo także wnieść skargę do organu nadzorczego
            ds. ochrony danych (art. 77 RODO); właściwy dla nas jest Bawarski Krajowy Urząd Nadzoru
            nad Ochroną Danych (Bayerisches Landesamt für Datenschutzaufsicht, BayLDA), Promenade
            18, 91522 Ansbach. Nie stosujemy zautomatyzowanego podejmowania decyzji ani
            profilowania.
          </p>
        </>
      );
    case 'ru':
      return (
        <>
          <p className="text-muted">По состоянию на 3 октября 2026 г.</p>
          <h2>1. Ответственное лицо</h2>
          <p>
            <Detail k="name" label="Имя" />, <Detail k="street" label="Улица и номер дома" />,{' '}
            <Detail k="postcodeCity" label="Почтовый индекс и город" />,{' '}
            <Detail k="country" label="Страна" />. Эл. почта:{' '}
            <Detail k="email" label="Адрес эл. почты" />. См. также {impressum}.
          </p>
          <h2>2. Коротко</h2>
          <p>
            Этот сайт состоит из статических страниц. Он не устанавливает cookie, не использует
            инструменты аналитики или отслеживания и ничего не загружает со сторонних серверов;
            шрифты мы тоже размещаем на своём сервере. Здесь нет формы, которая отправляла бы
            данные.
          </p>
          <h2>3. Хостинг</h2>
          <p>
            Хостинг сайта обеспечивает Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
            США. При запросе страницы Vercel обрабатывает в журналах сервера технически необходимые
            данные: IP-адрес, дату и время, запрошенную страницу, страницу, с которой вы пришли
            (referrer), и идентификатор вашего браузера (user agent). Правовое основание — ст.
            6(1)(f) GDPR: наш законный интерес в безопасной и надёжной работе сайта. Vercel
            обрабатывает эти данные по нашему поручению; передача данных в США опирается на гарантии
            соглашения Vercel об обработке данных ({dpa}). Подробнее — в политике конфиденциальности
            Vercel: {vercel}.
          </p>
          <h2>4. Что сохраняет ваш браузер</h2>
          <p>
            Если вы выбираете светлую или тёмную тему или язык, браузер сохраняет этот выбор
            локально (localStorage), чтобы он действовал при следующем посещении. Эти данные не
            покидают ваше устройство, и вы можете в любой момент удалить их в браузере. Их
            сохранение строго необходимо для функции, которую вы запросили (§ 25 абз. 2 п. 2 TDDDG).
          </p>
          <h2>5. Связь по электронной почте</h2>
          <p>
            Если вы нам пишете, мы обрабатываем ваши данные, чтобы ответить вам (ст. 6(1)(b) или (f)
            GDPR), и удаляем их, когда они для этого больше не нужны.
          </p>
          <h2>6. Ссылки на Google Play</h2>
          <p>
            Кнопка Google Play — это обычная ссылка. Правила конфиденциальности Google начинают
            действовать, только когда вы по ней переходите. QR-код создаётся при сборке сайта и
            ничего не загружает.
          </p>
          <h2>7. Приложение</h2>
          <p>
            Эта политика распространяется и на приложение Sogda для Android. Приложение не собирает
            данные о вас и ничего не передаёт: нет аккаунта, аналитики, рекламы и рекламного
            идентификатора. Приложение подключается к интернету, только когда вы делаете что-то, что
            этого требует.
          </p>
          <p>
            <strong>Ваш прогресс</strong> хранится в приложении на вашем устройстве. Резервное
            копирование Android и перенос на другое устройство для приложения отключены. Экспорт —
            это файл, которым вы делитесь сами.
          </p>
          <p>
            <strong>Ваши документы</strong> (вставленные или переданные тексты, фото, PDF) читаются,
            распознаются (распознавание текста Google ML Kit с моделью внутри приложения),
            анализируются и переводятся на устройстве; ничего из этого не отправляется. Статистика
            использования ML Kit в приложении отключена. Фото сохраняются без данных о месте съёмки
            и камере или, если вы так настроите, не сохраняются вовсе, а документы могут удаляться
            автоматически через 30, 90 или 365 дней.
          </p>
          <p>
            <strong>Загрузки, которые запускаете вы:</strong> естественный голос (Supertonic) и
            переводчик (Hy-MT2) загружаются с huggingface.co, по умолчанию только по Wi‑Fi.
            Приложение лишь запрашивает файлы; как и при любом запросе, Hugging Face получает ваш
            IP-адрес, а к его серверам применяется политика конфиденциальности Hugging Face.
          </p>
          <p>
            <strong>Микрофон:</strong> только для записи в части экзамена «Говорение»; запись
            остаётся на устройстве.
          </p>
          <p>
            <strong>Уведомления:</strong> ежедневное напоминание, если вы его включите, и ход
            загрузки.
          </p>
          <p>
            <strong>Ссылки:</strong> только после нажатия приложение открывает веб-страницу в
            браузере: «Сообщить о проблеме» (заранее заполненное обращение на GitHub, которое вы
            можете отправить или нет), словари (Duden, DWDS, Wiktionary, Linguee, Google) и страницу
            приложения в Google Play. Там действуют правила конфиденциальности соответствующего
            сайта.
          </p>
          <p>
            <strong>Оценка:</strong> после первого сданного пробного экзамена может один раз
            появиться карточка оценки Google Play. Она относится к приложению Play Маркет; Sogda при
            этом ничего не отправляет.
          </p>
          <p>Ответственное лицо (раздел 1) и ваши права (раздел 8) действуют и для приложения.</p>
          <h2>8. Ваши права</h2>
          <p>
            Вы имеете право на доступ к данным (ст. 15 GDPR), их исправление (ст. 16), удаление (ст.
            17), ограничение обработки (ст. 18), переносимость данных (ст. 20) и право на возражение
            (ст. 21). Вы также можете подать жалобу в надзорный орган по защите данных (ст. 77
            GDPR); для нас компетентно Баварское земельное ведомство по надзору за защитой данных
            (Bayerisches Landesamt für Datenschutzaufsicht, BayLDA), Promenade 18, 91522 Ansbach.
            Автоматизированное принятие решений и профилирование не применяются.
          </p>
        </>
      );
    case 'bn':
      return (
        <>
          <p className="text-muted">সর্বশেষ হালনাগাদ: ৩ অক্টোবর ২০২৬</p>
          <h2>১. নিয়ন্ত্রক (দায়িত্বপ্রাপ্ত ব্যক্তি)</h2>
          <p>
            <Detail k="name" label="নাম" />, <Detail k="street" label="রাস্তা ও বাড়ির নম্বর" />,{' '}
            <Detail k="postcodeCity" label="পোস্টকোড ও শহর" />, <Detail k="country" label="দেশ" />।
            ইমেইল: <Detail k="email" label="ইমেইল ঠিকানা" />। আরও দেখুন {impressum}।
          </p>
          <h2>২. সংক্ষেপে</h2>
          <p>
            এই ওয়েবসাইটটি স্থির (স্ট্যাটিক) পাতা দিয়ে তৈরি। এটি কোনো কুকি সেট করে না, কোনো
            অ্যানালিটিক্স বা ট্র্যাকিং টুল ব্যবহার করে না, এবং তৃতীয় পক্ষের কাছ থেকে কিছু লোড করে
            না; ফন্টগুলোও আমরা নিজেরাই দিই। তথ্য পাঠানোর মতো কোনো ফর্ম এখানে নেই।
          </p>
          <h2>৩. হোস্টিং</h2>
          <p>
            ওয়েবসাইটটি পরিবেশন করে Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA।
            কোনো পাতা চাওয়া হলে Vercel তার সার্ভার লগে প্রযুক্তিগতভাবে প্রয়োজনীয় তথ্য প্রক্রিয়া
            করে: IP ঠিকানা, তারিখ ও সময়, চাওয়া পাতা, আপনি যে পাতা থেকে এসেছেন (রেফারার), এবং আপনার
            ব্রাউজারের পরিচিতি (ইউজার এজেন্ট)। আইনি ভিত্তি হলো Art. 6(1)(f) GDPR: ওয়েবসাইটটি নিরাপদ
            ও নির্ভরযোগ্যভাবে পৌঁছে দেওয়ায় আমাদের বৈধ স্বার্থ। Vercel আমাদের পক্ষে এই তথ্য
            প্রক্রিয়া করে; যুক্তরাষ্ট্রে তথ্য স্থানান্তর Vercel-এর ডেটা প্রসেসিং চুক্তির
            সুরক্ষাব্যবস্থার ওপর নির্ভর করে ({dpa})। আরও জানতে Vercel-এর গোপনীয়তা নীতি দেখুন:{' '}
            {vercel}।
          </p>
          <h2>৪. আপনার ব্রাউজার যা সংরক্ষণ করে</h2>
          <p>
            আপনি হালকা বা গাঢ় থিম, কিংবা কোনো ভাষা বেছে নিলে আপনার ব্রাউজার সেই পছন্দটি
            স্থানীয়ভাবে (localStorage) সংরক্ষণ করে, যাতে পরের বার এলে তা কার্যকর থাকে। এই তথ্য
            আপনার ডিভাইসের বাইরে যায় না, আর আপনি যেকোনো সময় ব্রাউজারে তা মুছে ফেলতে পারেন। আপনি যে
            সুবিধাটি চেয়েছেন, তার জন্য এটি সংরক্ষণ করা একান্ত প্রয়োজনীয় (§ 25(2) no. 2 TDDDG)।
          </p>
          <h2>৫. ইমেইলে যোগাযোগ</h2>
          <p>
            আপনি আমাদের লিখলে, আপনাকে উত্তর দেওয়ার জন্য আমরা আপনার তথ্য প্রক্রিয়া করি (Art.
            6(1)(b) বা (f) GDPR), এবং সেই কাজে আর প্রয়োজন না থাকলে তা মুছে ফেলি।
          </p>
          <h2>৬. Google Play-এর লিংক</h2>
          <p>
            Google Play বোতামটি একটি সাধারণ লিংক। আপনি সেটিতে গেলে তবেই Google-এর গোপনীয়তা শর্ত
            প্রযোজ্য হয়। QR কোডটি ওয়েবসাইট তৈরির সময়েই বানানো হয় এবং কিছু লোড করে না।
          </p>
          <h2>৭. অ্যাপ</h2>
          <p>
            এই নীতি Android-এর জন্য Sogda অ্যাপেও প্রযোজ্য। অ্যাপটি আপনার সম্পর্কে কোনো তথ্য সংগ্রহ
            করে না এবং কারও সঙ্গে শেয়ার করে না: কোনো অ্যাকাউন্ট, অ্যানালিটিক্স, বিজ্ঞাপন বা
            বিজ্ঞাপন আইডি নেই। আপনি এমন কিছু করলে তবেই অ্যাপটি ইন্টারনেটে সংযুক্ত হয়, যার জন্য তা
            প্রয়োজন।
          </p>
          <p>
            <strong>আপনার অগ্রগতি</strong> আপনার ডিভাইসে অ্যাপের ভেতরেই থাকে। অ্যাপটির জন্য Android
            ব্যাকআপ ও ডিভাইস ট্রান্সফার বন্ধ রাখা আছে। এক্সপোর্ট হলো একটি ফাইল, যা আপনি নিজে শেয়ার
            করেন।
          </p>
          <p>
            <strong>আপনার ডকুমেন্ট</strong> (পেস্ট বা শেয়ার করা লেখা, ছবি, PDF) ডিভাইসেই পড়া,
            শনাক্ত করা (Google ML Kit-এর লেখা শনাক্তকরণ, মডেলটি অ্যাপের ভেতরেই), বিশ্লেষণ ও অনুবাদ
            করা হয়; এর কিছুই পাঠানো হয় না। অ্যাপে ML Kit-এর ব্যবহার-পরিসংখ্যান বন্ধ রাখা আছে। ছবি
            রাখা হয় লোকেশন আর ক্যামেরার তথ্য ছাড়া, অথবা আপনি চাইলে একেবারেই রাখা হয় না, আর
            ডকুমেন্ট ৩০, ৯০ বা ৩৬৫ দিন পরে নিজে থেকে মুছে যেতে পারে।
          </p>
          <p>
            <strong>আপনার শুরু করা ডাউনলোড:</strong> স্বাভাবিক ভয়েস (Supertonic) আর অনুবাদক
            (Hy-MT2) huggingface.co থেকে আনা হয়, ডিফল্টভাবে শুধু ওয়াই-ফাইতে। অ্যাপটি কেবল ফাইলগুলো
            চায়; যেকোনো অনুরোধের মতোই Hugging Face আপনার IP ঠিকানা পায়, আর তার সার্ভারের জন্য
            Hugging Face-এর গোপনীয়তা নীতি প্রযোজ্য।
          </p>
          <p>
            <strong>মাইক্রোফোন:</strong> শুধু পরীক্ষার “বলা” অংশের রেকর্ডিংয়ের জন্য; রেকর্ডিং
            ডিভাইসেই থাকে।
          </p>
          <p>
            <strong>নোটিফিকেশন:</strong> প্রতিদিনের রিমাইন্ডার, যদি আপনি তা চালু করেন, আর ডাউনলোডের
            অগ্রগতি।
          </p>
          <p>
            <strong>লিংক:</strong> আপনি ট্যাপ করলে তবেই অ্যাপটি ব্রাউজারে একটি ওয়েব পাতা খোলে:
            “সমস্যা জানান” (GitHub-এ আগে থেকে পূরণ করা একটি ইস্যু, যা আপনি পাঠাতে পারেন বা না-ও
            পাঠাতে পারেন), অভিধান (Duden, DWDS, Wiktionary, Linguee, Google) এবং Google Play-তে
            অ্যাপের পাতা। সেখানে প্রতিটি সাইটের নিজস্ব গোপনীয়তা শর্ত প্রযোজ্য।
          </p>
          <p>
            <strong>রেটিং:</strong> আপনার প্রথম পাস করা মক পরীক্ষার পরে Google Play-এর রেটিং কার্ড
            একবার দেখা যেতে পারে। এটি Play Store অ্যাপের নিজস্ব; Sogda এর সঙ্গে কিছুই পাঠায় না।
          </p>
          <p>নিয়ন্ত্রক (অনুচ্ছেদ ১) আর আপনার অধিকার (অনুচ্ছেদ ৮) অ্যাপের ক্ষেত্রেও প্রযোজ্য।</p>
          <h2>৮. আপনার অধিকার</h2>
          <p>
            আপনার তথ্য জানার (Art. 15 GDPR), সংশোধনের (Art. 16), মুছে ফেলার (Art. 17), প্রক্রিয়াকরণ
            সীমিত করার (Art. 18), তথ্য স্থানান্তরযোগ্যতার (Art. 20) এবং আপত্তি জানানোর (Art. 21)
            অধিকার আছে। আপনি কোনো ডেটা সুরক্ষা তত্ত্বাবধায়ক কর্তৃপক্ষের কাছে অভিযোগও করতে পারেন
            (Art. 77 GDPR); আমাদের জন্য দায়িত্বপ্রাপ্ত হলো বাভারিয়ার ডেটা সুরক্ষা তত্ত্বাবধান
            দপ্তর (Bayerisches Landesamt für Datenschutzaufsicht, BayLDA), Promenade 18, 91522
            Ansbach। কোনো স্বয়ংক্রিয় সিদ্ধান্ত গ্রহণ বা প্রোফাইলিং করা হয় না।
          </p>
        </>
      );
    default:
      return undefined;
  }
}
