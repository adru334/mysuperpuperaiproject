import { CallCharacter } from './types';

export const CHARACTERS: CallCharacter[] = [
  {
    id: 'rocket_boss',
    name: 'Рокет Босс (Rocket Boss)',
    avatar: 'rocket_boss',
    dialogueSpeed: 30,
    bleepPitch: 120,
    bleepType: 'sawtooth',
    greetingNodes: [
      {
        id: 'start',
        text: 'Хей-хей, землянин! На связи Рокет Босс!\nЯ только что примарсился и привёз партию свежих Рокет Коинов (РК) по 300₽ за штуку.\nЭто космическое топливо для твоего кошелька! Берёшь?',
        options: [
          { text: ' Купить за 300₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Поторговаться за внеземную скидку', type: 'bargain', nextDialogueId: 'bargain_done' },
          { text: ' Показать приветствие рукой (Вежливо)', type: 'joke', nextDialogueId: 'joke_done', reputationModifier: 15 },
          { text: ' Нагрубить: «Завязывай звонить, зеленая карикатура!»', type: 'hangup', nextDialogueId: 'hang_angry', reputationModifier: -15 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Космически! Сделка закрыта. Ракета заправлена, твои Рокет Коины уже летят на твой счёт!\nДо встречи в космосе, партнёр!',
        options: [{ text: 'Закрыть связь (Конец связи)', type: 'hangup' }]
      },
      {
        id: 'bargain_done',
        text: 'Ох, земные торги... Ладно, мне нравится твоя уверенность.\nСкину цену наполовину! Забирай за 150₽, пока галактический регулятор не видит!',
        options: [
          { text: ' Купить за 150₽', type: 'buy', costModifier: 0.5, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Передумать и отключиться', type: 'hangup' }
        ]
      },
      {
        id: 'joke_done',
        text: 'Ха-ха! Да ты знаешь галактические обычаи! Уважаю настоящую харизму.\nЗа такую крутую жестикуляцию отдаю почти даром — держи за 150₽!',
        options: [
          { text: ' Взять со скидкой за 150₽', type: 'buy', costModifier: 0.5, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Повесить трубку', type: 'hangup' }
        ]
      },
      {
        id: 'hang_angry',
        text: 'Ах так?! Да как ты смеешь оскорблять Межгалактического Босса! Всё, связь заблокирована, репутация твоя в космосе теперь ниже плинтуса!',
        options: [{ text: 'Сбросить вызов', type: 'hangup' }]
      }
    ]
  },
  {
    id: 'zorid',
    name: 'Зорид (Zorid)',
    avatar: 'zorid',
    dialogueSpeed: 50,
    bleepPitch: 85,
    bleepType: 'square',
    greetingNodes: [
      {
        id: 'start',
        text: 'Приветствую, коллега. Я Зорид, децентрализованный майнер.\nПродаю излишки надежного Космо Коина (КК) по 100₽ за лот.\nПрямая поставка с фермы. Интересует?',
        options: [
          { text: ' Купить за 100₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Попросить снизить цену поставщика', type: 'bargain', nextDialogueId: 'bargain_done' },
          { text: ' Пошутить про асики и майнинг', type: 'joke', nextDialogueId: 'joke_done', reputationModifier: 15 },
          { text: ' Нагрубить: «Твои КК — мусор, а сам ты майнинг-болельщик!»', type: 'hangup', nextDialogueId: 'zorid_angry', reputationModifier: -15 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Хеш-сумма совпала. Блоки подписаны, транзакция успешно добавлена в блокчейн.\nХорошего дня и профитных сессий!',
        options: [{ text: 'Отличная сделка! (Конец связи)', type: 'hangup' }]
      },
      {
        id: 'bargain_done',
        text: 'Сложность сети сейчас высока, но для расширения клиентской базы сделаю уступку.\nОтдам лот за 70₽. Договорились?',
        options: [
          { text: ' Купить за 70₽', type: 'buy', costModifier: 0.7, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Нет, спасибо. Отбой', type: 'hangup' }
        ]
      },
      {
        id: 'joke_done',
        text: 'Ха-ха! "Майнер платит дважды: первый раз за ферму, второй за свет!"\nОдобряю юмор. Отдам Космо Коины по себестоимости за 50₽!',
        options: [
          { text: ' Купить за 50₽', type: 'buy', costModifier: 0.5, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Завершить вызов', type: 'hangup' }
        ]
      },
      {
        id: 'zorid_angry',
        text: 'Твои слова доказывают твоё полное невежество в блокчейне. Мои хеш-рейты чисты, а вот твоя карма продавца сильно увяла. Из сетевого кэша удалён.',
        options: [{ text: 'Повесить трубку', type: 'hangup' }]
      }
    ]
  },
  {
    id: 'alex',
    name: 'Алекс (Alex)',
    avatar: 'alex',
    dialogueSpeed: 55,
    bleepPitch: 160,
    bleepType: 'sine',
    greetingNodes: [
      {
        id: 'start',
        text: 'Привет! Я Алекс, криптокран-аналитик.\nТут намечается горячая сделка по Енот Коину (ЕК).\nМогу отлить тебе из резервного фонда по хорошей цене — 120₽ за пак. Что думаешь?',
        options: [
          { text: ' Купить пак за 120₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Сказать, что цена завышена', type: 'bargain', nextDialogueId: 'bargain_done' },
          { text: ' Пошутить про плечи х100', type: 'joke', nextDialogueId: 'snails', reputationModifier: 15 },
          { text: ' Нагрубить: «Аналитик из тебя нулевой, иди торгуй семечками!»', type: 'hangup', nextDialogueId: 'alex_angry', reputationModifier: -15 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Замечательно! Перевод отправлен. Стейкается отлично.\nСледи за индикаторами на экране монитора, рынок сейчас горячий!',
        options: [{ text: 'Спасибо, Алекс! (Конец связи)', type: 'hangup' }]
      },
      {
        id: 'bargain_done',
        text: 'Эх, ладно... Вижу, ты жесткий трейдер. Давай урежем комиссии.\nФинальное предложение: 50₽ за пак. Никаких скрытых сборов.',
        options: [
          { text: ' Забрать за 50₽', type: 'buy', costModifier: 0.41, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Положить трубку', type: 'hangup' }
        ]
      },
      {
        id: 'snails',
        text: 'Ахах! Ликвидация на х100 плече — это классика жанра!\nРад встретить понимающего человека в этой сфере. Держи Енот Коин со скидкой всего за 80₽.',
        options: [
          { text: ' Забрать за 80₽', type: 'buy', costModifier: 0.66, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Отбой связи', type: 'hangup' }
        ]
      },
      {
        id: 'alex_angry',
        text: 'Ого, какие оскорбления! Я вообще-то бесплатно делюсь приватной маржой. В трейдерских чатах уже идёт слушок, твоё реноме упало!',
        options: [{ text: 'Сбросить вызов', type: 'hangup' }]
      }
    ]
  },
  {
    id: 'vortex',
    name: 'Вортекс (Vortex)',
    avatar: 'vortex',
    dialogueSpeed: 40,
    bleepPitch: 200,
    bleepType: 'sawtooth',
    greetingNodes: [
      {
        id: 'start',
        text: 'Коннект установлен! На связи Вортекс, системный аналитик.\nОбнаружил скачок активности хакеров в твоей локальной подсети.\nУ меня есть патч безопасности в виде Тех Коина (ТК) за 50₽. Обновим твой файрвол?',
        options: [
          { text: ' Купить защиту за 50₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Рассказать сисадминский анекдот', type: 'joke', nextDialogueId: 'anime_win', reputationModifier: 15 },
          { text: ' Требовать бесплатную раздачу софта', type: 'bargain', nextDialogueId: 'angry_vortex', reputationModifier: -10 },
          { text: ' Накрутить вентиляторы: «Думаешь, я поверю твоим басням?»', type: 'hangup', nextDialogueId: 'vortex_angry', reputationModifier: -20 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Патч запущен! Статус защиты сети: Оптимальный.\nМодули безопасности обновлены, хакерам теперь будет очень несладко.\nУдачной торговли!',
        options: [{ text: 'Отлично, Вортекс! (Конец звонка)', type: 'hangup' }]
      },
      {
        id: 'anime_win',
        text: 'О, этот анекдот про упавший сервер просто шикарен! Давно так не смеялся.\nЗа отличное профессиональное настроение отдаю брандмауэр-пак БЕСПЛАТНО! Забирай!',
        options: [{ text: ' Принять патч бесплатно (Установить)', type: 'buy', costModifier: 0, nextDialogueId: 'buy_done', reputationModifier: 5 }]
      },
      {
        id: 'angry_vortex',
        text: 'Бесплатно? Поддержка серверов и написание крипто-кода стоят электричества и времени.\nИзвини, бесплатно раздавать софт не могу. Линия защищенного шифрования закрывается.',
        options: [{ text: ' Сбросить звонок', type: 'hangup' }]
      },
      {
        id: 'vortex_angry',
        text: 'Сам ты сказочник! Я рисковал своим сервером, закрывая твои дырявые порты. Делай что хочешь теперь, твоя репутация в ИТ-сообществе мертва.',
        options: [{ text: 'Сбросить вызов', type: 'hangup' }]
      }
    ]
  },
  {
    id: 'kira',
    name: 'Кира (Kira)',
    avatar: 'kira',
    dialogueSpeed: 30,
    bleepPitch: 310,
    bleepType: 'triangle',
    greetingNodes: [
      {
        id: 'start',
        text: 'Приветик! Я Кира, мем-аналитик и амбассадор Мем Коина (МК)!\nИлон снова запостил мем с ракетой, монета готовится улететь на луну!\nХочешь взять сочную партию Мем Коинов за 40₽?',
        options: [
          { text: ' Купить пачку за 40₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Сказать, что мемкоины — это мыльный пузырь', type: 'joke', nextDialogueId: 'college_joke', reputationModifier: -15 },
          { text: ' Сказать приятный комплимент её мем-каналу', type: 'joke', nextDialogueId: 'kira_sweet', reputationModifier: 15 },
          { text: ' Дать щедрый Донат в 100₽', type: 'compromise', nextDialogueId: 'donate_done', reputationModifier: 20 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Ура! Ты настоящий мем-трейдер! Ракета летит ввысь!\nУспешных тебе ионоосферных иксов!',
        options: [{ text: 'Пока, Кира! (Отбой)', type: 'hangup' }]
      },
      {
        id: 'college_joke',
        text: 'Что?! Пузырь?! Мемкоины — это технологическое искусство самовыражения!\nКакая грубость! Я очень сержусь и заношу тебя в черный список! *пип-пип-пип*',
        options: [{ text: ' Ой... (Положить трубку)', type: 'hangup' }]
      },
      {
        id: 'kira_sweet',
        text: 'Ой, как мило! Спасибо огрооомное! Мем-комьюнити — это моя семья. За твою доброту дарю тебе скидку на мем-пак, бери за 20₽!',
        options: [
          { text: ' Купить пак за 20₽', type: 'buy', costModifier: 0.5, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Просто улыбнуться и попрощаться', type: 'hangup' }
        ]
      },
      {
        id: 'donate_done',
        text: 'Ого! Какая шикарная сумма! Ты супер-инвестор!\nОтсыпаю тебе максимальный бонусный пакет мем-коинов прямо на баланс!\nБудем пампить вместе!',
        options: [{ text: 'Отлично! Будем пампить! (Отбой)', type: 'hangup' }]
      }
    ]
  },
  {
    id: 'mark',
    name: 'Марк (Mark)',
    avatar: 'mark',
    dialogueSpeed: 60,
    bleepPitch: 95,
    bleepType: 'triangle',
    greetingNodes: [
      {
        id: 'start',
        text: 'Приветствую. Я Марк, венчурный инвестор.\nУ меня есть лимитированное предложение по Енот Коину (ЕК) из старых запасов.\nМогу передать тебе партию за 200₽. Это сильный и веселый актив.',
        options: [
          { text: ' Купить партию за 200₽', type: 'buy', nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Попросить дисконт на объем', type: 'bargain', nextDialogueId: 'sad_king' },
          { text: ' Утверждать, что традиционные финансы уступят крипте', type: 'joke', nextDialogueId: 'hope_wins', reputationModifier: 15 },
          { text: ' Обозвать динозавром: «Твои советы устарели на 30 лет!»', type: 'hangup', nextDialogueId: 'mark_angry', reputationModifier: -20 }
        ]
      },
      {
        id: 'buy_done',
        text: 'Отличная сделка. Твой портфель теперь выглядит по-настоящему солидно.\nЖелаю стабильного притока ликвидности и удачи.',
        options: [{ text: 'До свидания, Марк (Повесить трубку)', type: 'hangup' }]
      },
      {
        id: 'sad_king',
        text: 'Понимаю, диверсификация рисков важна.\nХорошо, снизим прайс ради успешного партнерства. Забирай за 110₽.',
        options: [
          { text: ' Забрать за 110₽', type: 'buy', costModifier: 0.55, nextDialogueId: 'buy_done', reputationModifier: 5 },
          { text: ' Отказаться вежливо', type: 'hangup' }
        ]
      },
      {
        id: 'hope_wins',
        text: 'Интересный взгляд... Твоя непоколебимая вера в новые технологии вдохновляет.\nЯ уступаю тебе весь пакет бесплатно в качестве жеста доброй воли и поддержки!\nРазвивай индустрию дальше.',
        options: [{ text: ' Принять с уважением (Взять бесплатно)', type: 'buy', costModifier: 0, nextDialogueId: 'buy_done', reputationModifier: 10 }]
      },
      {
        id: 'mark_angry',
        text: 'Бестактно. Терпение и вежливость — залог долгосрочного успеха. Больше я с вами дела иметь не желаю, моя репутационная оценка пойдет вниз.',
        options: [{ text: 'Уйти из эфира', type: 'hangup' }]
      }
    ]
  }
];

export const NEWS_TEMPLATES = [
  {
    text: 'Илон Маск выложил мем с котиком в твиттер! Мем Коин (МК) взрывает чарты!',
    impactType: 'positive',
    impactTokenId: 'mk',
    intensity: 1.8
  },
  {
    text: 'Крупная игровая гильдия объявила, что принимает Космо Коин (КК) для покупок предметов!',
    impactType: 'positive',
    impactTokenId: 'kk',
    intensity: 1.5
  },
  {
    text: 'Завод приостановил сборку двигателей для ракет! Рокет Коин (РК) временно теряет устойчивость.',
    impactType: 'negative',
    impactTokenId: 'rk',
    intensity: 0.6
  },
  {
    text: 'Тех Коин (ТК) переживает небывалый рост из-за релиза масштабного патча шифрования.',
    impactType: 'positive',
    impactTokenId: 'tk',
    intensity: 2.2
  },
  {
    text: 'Таинственная космическая пыль заглушила сигналы спутников. Космо Коин (КК) идет вниз!',
    impactType: 'negative',
    impactTokenId: 'kk',
    intensity: 0.5
  },
  {
    text: 'Обнаружена уязвимость в одной из старых библиотек Тех Коина. Пользователи выводят активы!',
    impactType: 'negative',
    impactTokenId: 'tk',
    intensity: 0.4
  },
  {
    text: 'Грузовик с ценным грузом перевернулся у дата-центра Мем Коина. Сеть перегружена транзакциями!',
    impactType: 'positive',
    impactTokenId: 'mk',
    intensity: 1.4
  },
  {
    text: 'Крупный производитель печенья одобрил Енот Коин (ЕК) в качестве эко-платы!',
    impactType: 'positive',
    impactTokenId: 'ek',
    intensity: 1.6
  },
  {
    text: 'Енот Коин подвергся критике со стороны лесного финансового регулятора за кражу запасов орехов. Курс нестабилен.',
    impactType: 'negative',
    impactTokenId: 'ek',
    intensity: 0.7
  }
];

export interface MarketItemTemplate {
  name: string;
  description: string;
  baseCost: number;
  baseRewards: Record<string, number>;
  iconName: 'usb' | 'disc' | 'package' | 'harddrive' | 'cpu' | 'gift';
  badge?: string;
  color: string;
}

const MARKET_TEMPLATES: MarketItemTemplate[] = [
  {
    name: 'Флешка с Енот Коинами',
    description: 'USB-накопитель из тайника Енотов. Без ведома регуляторов несёт в себе кошелёк с ЕК.',
    baseCost: 1100,
    baseRewards: { ek: 15 },
    iconName: 'usb',
    badge: 'Скидка на ЕК',
    color: '#ef4444',
  },
  {
    name: 'Диск с Рокет Коинами',
    description: 'Лазерный компакт-диск с марсианской гравировкой от Rocket Boss. Хранит секретный мастер-ключ РК.',
    baseCost: 750,
    baseRewards: { rk: 3 },
    iconName: 'disc',
    badge: 'Хит продаж',
    color: '#f43f5e',
  },
  {
    name: 'Джутовый мешок Мем Коинов',
    description: 'Простецкий мешок, набитый Doge-мемами и флешкой с секретным сид-пакетом МК.',
    baseCost: 200,
    baseRewards: { mk: 45 },
    iconName: 'package',
    badge: 'Низкая цена',
    color: '#fb923c',
  },
  {
    name: 'Кристаллический SSD',
    description: 'Предустановленная децентрализованная нода Космо Коинов (КК) на кристаллическом жестком диске.',
    baseCost: 550,
    baseRewards: { kk: 15 },
    iconName: 'harddrive',
    badge: 'Новинка',
    color: '#06b6d4',
  },
  {
    name: 'Комплект Сетевых Тех Коинов',
    description: 'Сетевой модуль из дата-центра. Хранит невостребованный кошелёк ТК.',
    baseCost: 380,
    baseRewards: { tk: 80 },
    iconName: 'cpu',
    badge: 'Оптом',
    color: '#a855f7',
  },
  {
    name: 'Забытый сейф Сатоши',
    description: 'Легендарный запечатанный металлический сейф. Содержит огромный случайный микс всех видов монет!',
    baseCost: 1200,
    baseRewards: {},
    iconName: 'gift',
    badge: 'СУПЕР-ЛУТ',
    color: '#eab308',
  },
  {
    name: 'Пыльный HDD со свалки',
    description: 'Старый жесткий диск, найденный у заброшенной майнинг-фермы. Содержит следы транзакций.',
    baseCost: 450,
    baseRewards: { rk: 1, kk: 5, mk: 25 },
    iconName: 'harddrive',
    badge: 'Винтаж',
    color: '#10b981',
  },
  {
    name: 'Флешка «Легкие Деньги»',
    description: 'Флешка с броским логотипом. Продавец заявляет, что распродает активы после закрытия фирмы.',
    baseCost: 320,
    baseRewards: { mk: 80, tk: 20 },
    iconName: 'usb',
    badge: 'Распродажа',
    color: '#f59e0b',
  },
  {
    name: 'Дискета сисадмина',
    description: 'Старая 3.5-дюймовая дискета. Хранит резервный файл ключей на Тех Коины.',
    baseCost: 180,
    baseRewards: { tk: 45 },
    iconName: 'disc',
    badge: 'Ретро',
    color: '#3b82f6',
  },
  {
    name: 'Подозрительный ZIP-архив',
    description: 'Продавец утверждает, что внутри запароленный архив на 4 Енот Коина. Исход лотереи неясен.',
    baseCost: 300,
    baseRewards: { ek: 4 },
    iconName: 'package',
    badge: 'Риск',
    color: '#ec4899',
  }
];

const REVIEWS_POSITIVE = [
  'Всё супер! Диск пришёл быстро, коины начислили сразу.',
  'Рекомендую продавца, никакого обмана, чистый софт.',
  'Проверил баланс — всё до цента на месте! Спасибо!',
  'Брал рискнуть и не прогадал. Лучший продавец!',
  'Отличный товар, флешка рабочая, упаковка надёжная.',
  'Транзакция прошла за минуту, монеты в кошельке!'
];

const REVIEWS_MIXED = [
  'Носитель поцарапан, но файлы считались. На троечку.',
  'Активировал не с первого раза, но в итоге всё ОК.',
  'Коинов пришло чуть меньше заявленного, но в пределах нормы.',
  'Доставка задержалась на день, а так всё работает.',
  'Нормальный диск, но цена кажется завышенной.',
  'Средний товар, покупать можно на свой страх и риск.'
];

const REVIEWS_NEGATIVE = [
  'СКАМ!!! Не ведитесь, накопитель пустой и не работает!',
  'Потерял все деньги! Продавец — мошенник, админы забаньте!',
  'Прислали сломанный диск вообще без чипа. Ужасно.',
  'Вместо коинов внутри оказался вирус! Осторожно!',
  'Абсолютный развод. Ничего не начислили, продавец молчит!',
  'Пустая болванка, внутри просто текстовый файл со смайликом.'
];

export function generateMarketItems(): import('./types').MarketItem[] {
  // Shuffle and pick 6 items
  const shuffled = [...MARKET_TEMPLATES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 6);

  return selected.map((template, idx) => {
    // Generate a rating: either high, average or low
    // Let's make an equal spread of ratings:
    // 40% chance of positive (80-99%)
    // 30% chance of mixed (50-79%)
    // 30% chance of negative (10-49%)
    const r = Math.random();
    let rating = 50;
    if (r < 0.4) {
      rating = Math.floor(Math.random() * 20) + 80; // 80 to 99
    } else if (r < 0.7) {
      rating = Math.floor(Math.random() * 30) + 50; // 50 to 79
    } else {
      rating = Math.floor(Math.random() * 40) + 10; // 10 to 49
    }

    // Pick 2 random reviews matching the rating category
    let reviewPool = REVIEWS_MIXED;
    if (rating > 50) {
      reviewPool = REVIEWS_POSITIVE;
    } else if (rating < 50) {
      reviewPool = REVIEWS_NEGATIVE;
    } else {
      reviewPool = REVIEWS_MIXED;
    }

    const reviewsShuffled = [...reviewPool].sort(() => 0.5 - Math.random());
    const reviews = [reviewsShuffled[0], reviewsShuffled[1]];

    // Scam chance:
    const scamChance = 100 - rating; // directly 1 to 90 %
    // Roll if this item is actively a scam (randomized at roll time, or set here)
    const isScam = Math.random() * 100 < scamChance;

    // Slight random offset on target cost as well (e.g. ±15%)
    const priceVol = (Math.random() * 0.3 - 0.15) + 1; // 0.85 to 1.15
    const cost = Math.round(template.baseCost * priceVol / 10) * 10;

    return {
      id: `${template.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${idx}`,
      name: template.name,
      description: template.description,
      cost,
      iconName: template.iconName,
      rewards: template.baseRewards,
      badge: template.badge,
      color: template.color,
      rating,
      reviews,
      isScam,
      scamChance
    };
  });
}
