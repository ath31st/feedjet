export interface FeedItem {
  title: string;
  link: string;
  description: string;
  image: string;
  category: string;
  author: string;
  pubDate: string;
}

export const mockFeed: FeedItem[] = [
  {
    title:
      'Гравитационно-волновые детекторы засекли самое масштабное столкновение чёрных дыр в истории наблюдений',
    link: 'https://24gadget.ru/1161076879-gravitacionno-volnovye-detektory-zasekli-samoe-masshtabnoe-stolknovenie-chernyh-dyr-v-istorii-nabljudenij.html',
    description:
      'Астрономы сообщили о гравитационно-волновом событии GW 231123, которое буквально разрушает классическую теорию образования чёрных дыр...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752695566_kos.jpg',
    category: 'Интересное',
    author: 'Killer',
    pubDate: '2025-07-17T10:18:16+03:00',
  },
  {
    title:
      'Умные очки для плавания Smart Swim 2 получили датчик пульса и компас (3 фото)',
    link: 'https://24gadget.ru/1161076878-umnye-ochki-dlja-plavanija-smart-swim-2-poluchili-datchik-pulsa-i-kompas-3-foto.html',
    description:
      'Компания Form представила обновлённые умные очки для плавания Smart Swim 2. Новинка оснащена встроенным дисплеем...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752695455_smart-swim-2_03.jpg',
    category: 'Гаджет новости',
    author: 'Killer',
    pubDate: '2025-07-17T09:22:16+03:00',
  },
  {
    title:
      'Зонд NASA Parker сфотографировал Солнце с рекордно близкого расстояния',
    link: 'https://24gadget.ru/1161076877-zond-nasa-parker-sfotografiroval-solnce-s-rekordno-blizkogo-rasstojanija.html',
    description:
      '24 декабря 2024 года зонд NASA Parker Solar Probe в очередной раз приблизился к Солнцу на рекордно близкое расстояние. Космический аппарат вошёл в верхние слои атмосферы звезды, пролетев над её поверхностью на удалении всего 6,11 млн км...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752695405_zond.png',
    category: 'Гаджет новости',
    author: 'Killer',
    pubDate: '2025-07-17T08:08:16+03:00',
  },
  {
    title:
      'Razer выпустила корпус для внешней видеокарты с портом Thunderbolt 5 (6 фото)',
    link: 'https://24gadget.ru/1161076875-razer-vypustila-korpus-dlja-vneshnej-videokarty-s-portom-thunderbolt-5-6-foto.html',
    description:
      'Компания Razer выпустила корпус-док-станцию Core X V2 для внешней видеокарты с поддержкой интерфейса Thunderbolt 5...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752695189_razr1.jpg',
    category: 'Гаджет новости',
    author: 'Killer',
    pubDate: '2025-07-17T06:17:16+03:00',
  },
  {
    title:
      'В Китае создали самую эффективную солнечную ячейку из перовскита и кремния с КПД на грани теоретического предела (2 фото)',
    link: 'https://24gadget.ru/1161076873-v-kitae-sozdali-samuju-jeffektivnuju-solnechnuju-jachejku-iz-perovskita-i-kremnija-s-kpd-na-grani-teoreticheskogo-predela-2-foto.html',
    description:
      'Китайская компания Longi сообщила о достижении самой высокой эффективности тандемной солнечной ячейки...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752652833_sol1.jpg',
    category: 'Интересное',
    author: 'Killer',
    pubDate: '2025-07-16T11:00:14+03:00',
  },
  {
    title:
      'Миллионы Mercedes-Benz, Volkswagen и Škoda оказалось можно взломать по Bluetooth',
    link: 'https://24gadget.ru/1161076874-milliony-mercedes-benz-volkswagen-i-skoda-okazalos-mozhno-vzlomat-po-bluetooth.html',
    description:
      'Исследователи из PCA CyberSecurity обнаружили уязвимость в компьютерных системах автомобилей Mercedes-Benz, Volkswagen и Škoda...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752652947_bt2.jpg',
    category: 'Гаджет новости',
    author: 'Killer',
    pubDate: '2025-07-16T10:35:30+03:00',
  },
  {
    title:
      'Google подтвердила планы объединить ChromeOS и Android в единую платформу',
    link: 'https://24gadget.ru/1161076871-google-podtverdila-plany-obedinit-chromeos-i-android-v-edinuju-platformu.html',
    description:
      'Компания Google подтвердила, что собирается объединить операционные системы ChromeOS и Android...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752652627_chromeos-i-android.jpg',
    category: 'Гаджет новости / Android',
    author: 'Killer',
    pubDate: '2025-07-16T08:25:09+03:00',
  },
  {
    title:
      'Съёмный мотор Kamingo превращает обычный велосипед в электрический (3 фото)',
    link: 'https://24gadget.ru/1161076870-semnyj-motor-kamingo-prevraschaet-obychnyj-velosiped-v-jelektricheskij-3-foto.html',
    description:
      'На выставке Eurobike 2025 показали миниатюрный электродвигатель Kamingo, позволяющий быстро превратить обычный велосипед в электрический...',
    image:
      'https://24gadget.ru/uploads/posts/2025-07/thumbs/1752651832_vel1.png',
    category: 'Гаджет новости',
    author: 'Killer',
    pubDate: '2025-07-16T07:42:39+03:00',
  },
];
