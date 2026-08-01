/* IAIDO.SEC — данные для страниц арсенала. Все ссылки ведут на официальные
   сайты/документацию/публичные площадки с реальными отчётами — ничего не выдумано. */
window.IAIDO_TOOLS = {

  nmap: {
    name: 'Nmap', category: 'Разведка', categoryJp: '斥候',
    tagline: 'Сканирование портов и сервисов — стандарт индустрии с 1997 года.',
    official: 'https://nmap.org/',
    description: 'Nmap (Network Mapper) определяет, какие хосты доступны в сети, какие порты открыты, какие сервисы и версии ПО на них отвечают, а часто — и какая операционная система установлена. Атакующие используют его на этапе разведки; защитники — чтобы найти забытые открытые порты в собственной инфраструктуре раньше, чем это сделает кто-то другой.',
    legal: 'Сканирование чужой сети без разрешения владельца может быть уголовно наказуемо. Проверяйте только свою инфраструктуру или системы, на которые есть письменное разрешение.',
    install: 'apt install nmap  ·  brew install nmap  ·  Windows: nmap.org/download',
    commands: [
      { cmd: 'nmap -sV -sC 192.168.1.1', note: 'Определение версий сервисов + стандартные NSE-скрипты разведки' },
      { cmd: 'nmap -p- -T4 target.com', note: 'Полное сканирование всех 65535 портов' },
      { cmd: 'nmap -O target.com', note: 'Попытка определить операционную систему' },
      { cmd: 'nmap -A -oN report.txt target.com', note: 'Агрессивный режим (ОС + версии + скрипты) с сохранением отчёта в файл' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://nmap.org/book/man.html' },
      { label: 'Исходный код на GitHub', url: 'https://github.com/nmap/nmap' },
      { label: 'NSE Script Library', url: 'https://nmap.org/nsedoc/' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity — публичные отчёты пентестеров', url: 'https://hackerone.com/hacktivity', note: 'Большинство отчётов начинается с разведки именно этим инструментом' }
    ]
  },

  amass: {
    name: 'Amass', category: 'Разведка', categoryJp: '斥候',
    tagline: 'Картирование поверхности атаки и enumeration поддоменов.',
    official: 'https://github.com/owasp-amass/amass',
    description: 'Проект OWASP, который строит карту поверхности атаки организации: перечисляет поддомены через десятки источников (DNS brute-force, сертификаты Certificate Transparency, поисковые API) и строит граф связей активов. Стандартный первый шаг охотников за bug bounty перед тем, как вообще начинать искать уязвимости.',
    legal: 'Пассивный сбор из открытых источников обычно легален, но активное сканирование (zone transfer, брутфорс DNS) — только на своих или явно разрешённых доменах.',
    install: 'brew install amass  ·  Docker: docker run caffix/amass',
    commands: [
      { cmd: 'amass enum -d example.com', note: 'Базовое перечисление поддоменов из открытых источников' },
      { cmd: 'amass enum -active -d example.com', note: 'Активный режим: DNS-резолвинг и попытки zone transfer' },
      { cmd: "amass intel -org 'Example Inc'", note: 'Поиск ASN и сетевых блоков компании по названию' }
    ],
    resources: [
      { label: 'GitHub-репозиторий и wiki', url: 'https://github.com/owasp-amass/amass' },
      { label: 'OWASP-страница проекта', url: 'https://owasp.org/www-project-amass/' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity', note: 'Отчёты, где enumeration поддоменов — первый шаг' }
    ]
  },

  shodan: {
    name: 'Shodan', category: 'Разведка', categoryJp: '斥候',
    tagline: 'Поисковик по устройствам, подключённым к интернету.',
    official: 'https://www.shodan.io/',
    description: 'Поисковик, индексирующий баннеры ответов миллионов устройств в интернете — от веб-серверов до промышленных контроллеров и камер видеонаблюдения. Показывает, что атакующий (и защитник) видит про инфраструктуру компании без единого пакета, отправленного напрямую цели.',
    legal: 'Сам поиск по индексу Shodan легален (это чужие уже опубликованные баннеры), но подключение к найденным устройствам без разрешения — нет.',
    install: 'pip install shodan  →  shodan init YOUR_API_KEY',
    commands: [
      { cmd: 'shodan host 1.1.1.1', note: 'Информация об известном Shodan хосте' },
      { cmd: 'shodan search "apache country:RU"', note: 'Поиск устройств по баннеру и стране' },
      { cmd: 'shodan stats --facets port apache', note: 'Статистика распределения по портам' }
    ],
    resources: [
      { label: 'shodan.io', url: 'https://www.shodan.io/' },
      { label: 'Документация API', url: 'https://developer.shodan.io/' },
      { label: 'Справочный центр', url: 'https://help.shodan.io/' }
    ],
    reports: [
      { label: 'Shodan Blog', url: 'https://blog.shodan.io/', note: 'Официальные разборы интересных находок в индексе' }
    ]
  },

  burp: {
    name: 'Burp Suite', category: 'Веб', categoryJp: '網',
    tagline: 'Перехват и манипуляция HTTP-трафиком, основной инструмент веб-пентестера.',
    official: 'https://portswigger.net/burp',
    description: 'Связка прокси-перехватчика и набора инструментов для тестирования веб-приложений — де-факто стандарт индустрии. Позволяет перехватывать, изменять и повторно отправлять HTTP(S)-запросы, автоматически сканировать на уязвимости (в Pro-версии) и брутфорсить параметры через модуль Intruder.',
    legal: 'Тестируйте только приложения, которыми владеете или на которые есть письменное разрешение (в т.ч. программы bug bounty с чётко описанным scope).',
    install: 'Community Edition бесплатна: portswigger.net/burp/communitydownload',
    commands: [
      { cmd: 'Proxy → задать 127.0.0.1:8080 в браузере', note: 'Перехват трафика браузера через Burp' },
      { cmd: 'Proxy → Options → Import CA Certificate', note: 'Установка сертификата Burp для перехвата HTTPS' },
      { cmd: 'Repeater', note: 'Ручное изменение и повторная отправка отдельных запросов' },
      { cmd: 'Intruder', note: 'Автоматизированный перебор значений параметра (fuzzing)' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://portswigger.net/burp/documentation' },
      { label: 'Web Security Academy (бесплатное обучение)', url: 'https://portswigger.net/web-security' }
    ],
    reports: [
      { label: 'PortSwigger — Top 10 web hacking techniques', url: 'https://portswigger.net/research', note: 'Ежегодный разбор лучших публичных исследований веб-уязвимостей' },
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
    ]
  },

  zap: {
    name: 'OWASP ZAP', category: 'Веб', categoryJp: '網',
    tagline: 'Бесплатный сканер уязвимостей веб-приложений с открытым кодом.',
    official: 'https://www.zaproxy.org/',
    description: 'Бесплатный опенсорсный аналог Burp Suite, разрабатываемый сообществом OWASP, — автоматический и ручной сканер уязвимостей веб-приложений. Хороший первый инструмент для новичка: полностью бесплатен и включает встроенные обучающие сценарии.',
    legal: 'Сканируйте только собственные приложения или системы с явным разрешением владельца.',
    install: 'zaproxy.org/download — доступен как GUI, Docker-образ и CLI',
    commands: [
      { cmd: 'zap.sh -daemon -port 8080', note: 'Запуск в фоновом (headless) режиме' },
      { cmd: 'zap-cli quick-scan --self-contained target', note: 'Быстрое автоматическое сканирование через CLI' },
      { cmd: 'docker run -t zaproxy/zap-stable zap-baseline.py -t https://target.com', note: 'Базовое сканирование в CI/CD-пайплайне' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://www.zaproxy.org/docs/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/zaproxy/zaproxy' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
    ]
  },

  sqlmap: {
    name: 'sqlmap', category: 'Веб', categoryJp: '網',
    tagline: 'Автоматизированное обнаружение и эксплуатация SQL-инъекций.',
    official: 'https://sqlmap.org/',
    description: 'Автоматизирует обнаружение и эксплуатацию SQL-инъекций — от определения уязвимого параметра до дампа таблиц базы данных. Один из самых известных инструментов класса «дай URL — получи базу»: важно понимать, что происходит за автоматизацией, а не запускать его вслепую.',
    legal: 'Эксплуатация SQL-инъекции на чужой базе данных без разрешения — уголовное преступление почти везде. Используйте только на своих стендах и в разрешённых программах.',
    install: 'git clone https://github.com/sqlmapproject/sqlmap.git',
    commands: [
      { cmd: "sqlmap -u 'http://target.com/page?id=1' --batch", note: 'Базовая проверка параметра id на инъекцию' },
      { cmd: "sqlmap -u '...' --dbs", note: 'Перечислить базы данных при найденной инъекции' },
      { cmd: "sqlmap -u '...' -D dbname --tables", note: 'Список таблиц в конкретной базе' }
    ],
    resources: [
      { label: 'Официальный сайт', url: 'https://sqlmap.org/' },
      { label: 'Wiki с полным списком опций', url: 'https://github.com/sqlmapproject/sqlmap/wiki' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity', note: 'Публичные отчёты об SQL-инъекциях' }
    ]
  },

  wireshark: {
    name: 'Wireshark', category: 'Сеть', categoryJp: '流',
    tagline: 'Глубокий анализ сетевых пакетов, эталон для форензики трафика.',
    official: 'https://www.wireshark.org/',
    description: 'Графический анализатор сетевых пакетов: перехватывает трафик и показывает его послойно — от Ethernet до прикладного протокола. Незаменим при расследовании инцидентов, отладке сетевых проблем и просто при изучении того, как реально устроены протоколы, которые мы привыкли считать «магией».',
    legal: 'Перехват чужого сетевого трафика без разрешения нарушает законы о тайне связи почти во всех юрисдикциях. Анализируйте только свой трафик или трафик сетей, которыми управляете.',
    install: 'wireshark.org/download.html — Windows/macOS/Linux',
    commands: [
      { cmd: 'tcp.port == 443', note: 'Фильтр отображения: только TLS-трафик' },
      { cmd: 'http.request.method == "POST"', note: 'Только HTTP POST-запросы' },
      { cmd: 'ip.addr == 10.0.0.5', note: 'Весь трафик конкретного хоста' }
    ],
    resources: [
      { label: 'Wireshark User Guide', url: 'https://www.wireshark.org/docs/wsug_html_chunked/' },
      { label: 'Wiki с примерами захватов', url: 'https://wiki.wireshark.org/' }
    ],
    reports: [
      { label: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/', note: 'Ежедневные реальные разборы инцидентов на основе packet capture' }
    ]
  },

  tcpdump: {
    name: 'tcpdump', category: 'Сеть', categoryJp: '流',
    tagline: 'Лёгкий консольный перехват трафика для серверов и CI.',
    official: 'https://www.tcpdump.org/',
    description: 'Консольный брат Wireshark: перехват трафика без GUI, идеален для серверов и автоматизации. Использует тот же синтаксис фильтров BPF (Berkeley Packet Filter), что и Wireshark, поэтому знания переносятся в обе стороны.',
    legal: 'Те же ограничения, что и для Wireshark: только свой трафик или явно разрешённый.',
    install: 'обычно уже установлен в Linux/macOS; apt install tcpdump',
    commands: [
      { cmd: 'tcpdump -i eth0 -w capture.pcap', note: 'Запись трафика интерфейса в файл для анализа в Wireshark' },
      { cmd: 'tcpdump -i eth0 port 443', note: 'Фильтр по порту' },
      { cmd: "tcpdump -A -i eth0 'tcp port 80'", note: 'Вывод содержимого пакетов в ASCII' }
    ],
    resources: [
      { label: 'Официальная документация / man-страница', url: 'https://www.tcpdump.org/manpages/tcpdump.1.html' }
    ],
    reports: [
      { label: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/' }
    ]
  },

  hashcat: {
    name: 'Hashcat', category: 'Пароли', categoryJp: '鍵',
    tagline: 'GPU-ускоренный взлом хешей для аудита стойкости паролей.',
    official: 'https://hashcat.net/hashcat/',
    description: 'GPU-ускоренный инструмент восстановления паролей по хешу — используется для аудита стойкости паролей организации (проверить, что сотрудники не используют «Password123») и в законном пентесте с уже полученными хешами. Самый быстрый инструмент такого рода в мире.',
    legal: 'Взлом хешей, полученных без разрешения (украденных, слитых без вашего ведома), — преступление. Используйте только свои хеши или хеши, полученные легально в рамках теста.',
    install: 'apt install hashcat  ·  brew install hashcat',
    commands: [
      { cmd: 'hashcat -m 0 -a 0 hashes.txt rockyou.txt', note: 'Атака по словарю на MD5-хеши' },
      { cmd: 'hashcat -m 1000 -a 3 hash.txt ?a?a?a?a?a?a', note: 'Брутфорс NTLM-хеша по маске (6 произвольных символов)' },
      { cmd: 'hashcat --show hashes.txt', note: 'Показать уже взломанные хеши' }
    ],
    resources: [
      { label: 'Официальный сайт', url: 'https://hashcat.net/hashcat/' },
      { label: 'Wiki со списком режимов (-m)', url: 'https://hashcat.net/wiki/' }
    ],
    reports: [
      { label: 'Форум Hashcat', url: 'https://hashcat.net/forum/', note: 'Публичные разборы реальных наборов хешей от сообщества' }
    ]
  },

  john: {
    name: 'John the Ripper', category: 'Пароли', categoryJp: '鍵',
    tagline: 'Классический инструмент подбора паролей и аудита политик.',
    official: 'https://www.openwall.com/john/',
    description: 'Классический (с 1996 года) инструмент подбора паролей — автоматически определяет формат хеша и поддерживает десятки форматов. Часто именно на нём учатся базовым принципам аудита паролей, прежде чем переходить к более специализированному Hashcat.',
    legal: 'Те же ограничения, что и для Hashcat: только собственные или легально полученные хеши.',
    install: 'apt install john  ·  сборка из исходников: github.com/openwall/john',
    commands: [
      { cmd: 'john --wordlist=rockyou.txt hashes.txt', note: 'Атака по словарю' },
      { cmd: 'john --show hashes.txt', note: 'Показать взломанные пароли' },
      { cmd: 'john --format=nt hashes.txt', note: 'Явно указать формат хеша (NTLM)' }
    ],
    resources: [
      { label: 'Официальный сайт', url: 'https://www.openwall.com/john/' },
      { label: 'GitHub (John the Ripper Jumbo)', url: 'https://github.com/openwall/john' }
    ],
    reports: [
      { label: 'Openwall — публичные объявления и исследования', url: 'https://www.openwall.com/lists/announce/' }
    ]
  },

  maltego: {
    name: 'Maltego', category: 'OSINT', categoryJp: '影',
    tagline: 'Визуальный граф связей для расследований и разведки по открытым источникам.',
    official: 'https://www.maltego.com/',
    description: 'Визуальный инструмент построения графов связей: вводишь email, домен или имя, а «трансформы» автоматически подтягивают связанные сущности из десятков источников, превращая разрозненные данные в наглядную карту связей для расследования.',
    legal: 'Сбор данных из открытых источников (OSINT) обычно легален, но помните о законах о персональных данных при работе с информацией о людях.',
    install: 'Community Edition бесплатна с ограничением на число трансформов в день',
    commands: [
      { cmd: 'Новый граф → добавить сущность (домен/email/имя)', note: 'Отправная точка расследования' },
      { cmd: 'Правый клик → Run Transform', note: 'Запуск трансформа для поиска связанных сущностей' }
    ],
    resources: [
      { label: 'Официальный сайт', url: 'https://www.maltego.com/' },
      { label: 'Документация', url: 'https://docs.maltego.com/' }
    ],
    reports: [
      { label: 'OSINT Framework', url: 'https://osintframework.com/', note: 'Каталог реальных источников и техник OSINT-расследований' }
    ]
  },

  spiderfoot: {
    name: 'SpiderFoot', category: 'OSINT', categoryJp: '影',
    tagline: 'Автоматизированный сбор OSINT из десятков источников сразу.',
    official: 'https://github.com/smicallef/spiderfoot',
    description: 'Автоматизированный OSINT-разведчик: один запуск опрашивает более 200 источников (WHOIS, соцсети, утечки, DNS, поисковики) и строит единый отчёт по цели. Открытый код, есть бесплатная версия и коммерческий SpiderFoot HX.',
    legal: 'Как и с любым OSINT — собираемые данные публичны, но соблюдайте законы о персональных данных вашей юрисдикции.',
    install: 'pip install spiderfoot  ·  Docker: docker run smicallef/spiderfoot',
    commands: [
      { cmd: 'spiderfoot -l 127.0.0.1:5001', note: 'Запуск веб-интерфейса на localhost:5001' },
      { cmd: 'spiderfoot -s example.com -m sfp_dnsresolve,sfp_whois', note: 'Запуск конкретных модулей из CLI' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/smicallef/spiderfoot' },
      { label: 'spiderfoot.net', url: 'https://www.spiderfoot.net/' }
    ],
    reports: [
      { label: 'OSINT Framework', url: 'https://osintframework.com/' }
    ]
  },

  autopsy: {
    name: 'Autopsy', category: 'Форензика', categoryJp: '検死',
    tagline: 'Цифровая криминалистика дисков и файловых систем.',
    official: 'https://www.autopsy.com/',
    description: 'Графическая оболочка над The Sleuth Kit — стандарт цифровой криминалистики с открытым кодом: анализ образов дисков, восстановление удалённых файлов, построение таймлайна событий файловой системы, извлечение артефактов браузера и реестра.',
    legal: 'Анализируйте только устройства, на исследование которых у вас есть законное право (собственные, или по официальному запросу в рамках расследования).',
    install: 'autopsy.com/download — Windows/Linux',
    commands: [
      { cmd: 'Add Data Source → образ диска (dd / E01 / raw)', note: 'Загрузка образа для анализа' },
      { cmd: 'Ingest Modules → выбрать нужные (Timeline, Hash Lookup, Keyword Search)', note: 'Автоматический анализ загруженного образа' }
    ],
    resources: [
      { label: 'Официальный сайт', url: 'https://www.autopsy.com/' },
      { label: 'The Sleuth Kit', url: 'https://www.sleuthkit.org/' }
    ],
    reports: [
      { label: 'SANS DFIR', url: 'https://www.sans.org/digital-forensics-incident-response/', note: 'Реальные разборы расследований и методик цифровой криминалистики' }
    ]
  },

  volatility: {
    name: 'Volatility 3', category: 'Форензика', categoryJp: '検死',
    tagline: 'Анализ дампов оперативной памяти при расследовании инцидентов.',
    official: 'https://github.com/volatilityfoundation/volatility3',
    description: 'Фреймворк анализа дампов оперативной памяти: восстанавливает список процессов, сетевые соединения и даже инжектированный код — после того как система уже выключена. Стандарт при расследовании инцидентов, где важно то, что происходило именно в памяти, а не то, что осталось на диске.',
    legal: 'Анализируйте только дампы памяти систем, на которые у вас есть законное право доступа.',
    install: 'pip install volatility3',
    commands: [
      { cmd: 'vol -f memory.dmp windows.pslist', note: 'Список процессов на момент снятия дампа' },
      { cmd: 'vol -f memory.dmp windows.netscan', note: 'Активные и завершённые сетевые соединения' },
      { cmd: 'vol -f memory.dmp windows.malfind', note: 'Поиск признаков инжектированного вредоносного кода' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/volatilityfoundation/volatility3' },
      { label: 'Volatility Foundation', url: 'https://volatilityfoundation.org/' }
    ],
    reports: [
      { label: 'SANS DFIR', url: 'https://www.sans.org/digital-forensics-incident-response/' }
    ]
  },

  metasploit: {
    name: 'Metasploit', category: 'Red Team', categoryJp: '突',
    tagline: 'Фреймворк для разработки и запуска эксплойтов в разрешённых тестах.',
    official: 'https://www.metasploit.com/',
    description: 'Фреймворк для разработки, тестирования и запуска эксплойтов — крупнейшая в мире открытая база готовых модулей эксплуатации, полезных нагрузок (payloads) и вспомогательных модулей разведки. Используется как атакующими исследователями, так и защитниками для проверки, закрыта ли у них конкретная уязвимость.',
    legal: 'Использовать эксплойты можно только против систем, на которые есть письменное разрешение владельца. Несанкционированная эксплуатация — уголовное преступление практически везде.',
    install: 'curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb | bash',
    commands: [
      { cmd: 'msfconsole', note: 'Запуск интерактивной консоли' },
      { cmd: 'search type:exploit platform:windows smb', note: 'Поиск подходящего эксплойта' },
      { cmd: 'use exploit/... ; set RHOSTS target ; run', note: 'Выбор модуля, настройка цели и запуск' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://docs.metasploit.com/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/rapid7/metasploit-framework' }
    ],
    reports: [
      { label: 'Rapid7 Blog', url: 'https://www.rapid7.com/blog/', note: 'Технические разборы уязвимостей и модулей от разработчиков фреймворка' }
    ]
  },

  cobaltstrike: {
    name: 'Cobalt Strike', category: 'Red Team', categoryJp: '突',
    tagline: 'Коммерческая платформа эмуляции противника для зрелых red-team операций.',
    official: 'https://www.cobaltstrike.com/',
    description: 'Коммерческая платформа эмуляции противника (adversary simulation) для зрелых red-team операций: управление «маяками» (beacons) на скомпрометированных хостах, имитация тактик реальных APT-групп для проверки готовности blue-team к настоящей атаке.',
    legal: 'Лицензируется только проверенным компаниям после верификации легитимности бизнеса — именно из-за мощности это один из самых часто злоупотребляемых легитимных инструментов в руках реальных атакующих. Используется исключительно в санкционированных red-team контрактах.',
    resources: [
      { label: 'Официальный сайт', url: 'https://www.cobaltstrike.com/' }
    ],
    reports: [
      { label: 'MITRE ATT&CK — техники и обнаружение', url: 'https://attack.mitre.org/software/S0154/', note: 'Как устроены атаки с Cobalt Strike и как их детектировать' }
    ]
  },

  wazuh: {
    name: 'Wazuh', category: 'Blue Team', categoryJp: '盾',
    tagline: 'SIEM/XDR с открытым кодом для мониторинга и обнаружения угроз.',
    official: 'https://wazuh.com/',
    description: 'Открытый SIEM/XDR: собирает логи и события с хостов через агентов, сопоставляет их с правилами обнаружения, ловит аномалии и проверяет соответствие стандартам (PCI DSS, CIS). Бесплатная альтернатива дорогим коммерческим SIEM-платформам.',
    legal: 'Разворачивайте только на инфраструктуре, которой владеете или которую вам поручено защищать.',
    install: 'docker-compose (быстрый старт) — полная инструкция в официальной документации',
    commands: [
      { cmd: 'curl -sO https://packages.wazuh.com/4.x/wazuh-install.sh && bash wazuh-install.sh -a', note: 'Установка «всё в одном» для быстрого старта' },
      { cmd: 'Агент устанавливается на защищаемые хосты и подключается к менеджеру', note: 'Сбор логов и телеметрии' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://documentation.wazuh.com/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/wazuh/wazuh' }
    ],
    reports: [
      { label: 'Wazuh Blog — кейсы использования', url: 'https://wazuh.com/blog/', note: 'Официальные разборы обнаружения реальных угроз' }
    ]
  },

  suricata: {
    name: 'Suricata', category: 'Blue Team', categoryJp: '盾',
    tagline: 'IDS/IPS реального времени для сетевого трафика.',
    official: 'https://suricata.io/',
    description: 'IDS/IPS реального времени: анализирует сетевой трафик по сигнатурам (совместимым с правилами Snort) и эвристикам, ловит эксплойты, командные C2-каналы и аномальные протоколы прямо на проводе.',
    legal: 'Мониторинг трафика — только в сетях, которыми вы управляете.',
    install: 'apt install suricata',
    commands: [
      { cmd: 'suricata -c /etc/suricata/suricata.yaml -i eth0', note: 'Запуск в режиме мониторинга сетевого интерфейса' },
      { cmd: 'suricata-update', note: 'Обновление наборов сигнатур обнаружения' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://docs.suricata.io/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/OISF/suricata' }
    ],
    reports: [
      { label: 'Suricata Blog', url: 'https://suricata.io/blog/' }
    ]
  },

  yara: {
    name: 'YARA', category: 'Blue Team', categoryJp: '盾',
    tagline: 'Написание сигнатур для обнаружения и классификации вредоносного ПО.',
    official: 'https://virustotal.github.io/yara/',
    description: '«Язык регулярных выражений для вредоносного ПО»: пишешь правила, описывающие паттерны (строки, байты, структуры PE-файла), характерные для конкретной малвари, и сканируешь ими файлы или память. Стандарт индустрии для классификации угроз и threat hunting, поддерживается VirusTotal.',
    legal: 'Само сканирование своих файлов правилами YARA не имеет юридических ограничений — это инструмент защиты.',
    install: 'apt install yara  ·  brew install yara',
    commands: [
      { cmd: 'yara rule.yar suspicious_file.exe', note: 'Проверить файл на соответствие правилу' },
      { cmd: 'yara -r rules_dir/ /path/to/scan/', note: 'Рекурсивное сканирование директории набором правил' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://yara.readthedocs.io/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/VirusTotal/yara' },
      { label: 'Awesome YARA — коллекция готовых правил', url: 'https://github.com/InQuest/awesome-yara' }
    ],
    reports: [
      { label: 'Awesome YARA', url: 'https://github.com/InQuest/awesome-yara', note: 'Реальные правила, написанные по итогам расследования конкретных семейств малвари' }
    ]
  },

  semgrep: {
    name: 'Semgrep', category: 'DevSecOps', categoryJp: '鍛',
    tagline: 'Статический анализ кода на уязвимости прямо в pull request.',
    official: 'https://semgrep.dev/',
    description: 'Статический анализатор кода (SAST) с человекочитаемыми правилами: находит небезопасные паттерны (SQL-конкатенацию, hardcoded секреты, небезопасную десериализацию) прямо в pull request, поддерживает 30+ языков программирования.',
    legal: 'Ограничений нет — сканирование собственного кода является защитной практикой.',
    install: 'pip install semgrep  ·  brew install semgrep',
    commands: [
      { cmd: 'semgrep --config=auto .', note: 'Сканирование текущей директории с автоматическим набором правил' },
      { cmd: 'semgrep --config=p/owasp-top-ten .', note: 'Сканирование по правилам OWASP Top 10' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://semgrep.dev/docs/' },
      { label: 'Публичный реестр правил', url: 'https://semgrep.dev/r' }
    ],
    reports: [
      { label: 'GitHub Security Lab', url: 'https://securitylab.github.com/', note: 'Реальные разборы уязвимостей в open source проектах' }
    ]
  },

  trivy: {
    name: 'Trivy', category: 'DevSecOps', categoryJp: '鍛',
    tagline: 'Сканер уязвимостей в контейнерах, IaC и зависимостях.',
    official: 'https://trivy.dev/',
    description: 'Сканер уязвимостей для контейнеров, файловых систем, IaC-конфигураций (Terraform, Kubernetes) и зависимостей проекта — один бинарник, легко встраивается в CI/CD и находит известные CVE в слоях Docker-образа за секунды.',
    legal: 'Ограничений нет — сканирование собственных образов и зависимостей является защитной практикой.',
    install: 'brew install trivy  ·  apt install trivy',
    commands: [
      { cmd: 'trivy image nginx:latest', note: 'Сканирование Docker-образа на известные уязвимости' },
      { cmd: 'trivy fs .', note: 'Сканирование файловой системы и файлов зависимостей проекта' },
      { cmd: 'trivy config .', note: 'Проверка IaC-конфигураций (Terraform, Kubernetes-манифестов)' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://trivy.dev/latest/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/aquasecurity/trivy' }
    ],
    reports: [
      { label: 'Aqua Security Blog', url: 'https://www.aquasec.com/blog/', note: 'Реальные разборы уязвимостей в контейнерах и supply chain' }
    ]
  },

  theharvester: {
    name: 'theHarvester', category: 'Разведка', categoryJp: '斥候',
    tagline: 'Сбор email, поддоменов и сотрудников из открытых источников одной командой.',
    official: 'https://github.com/laramies/theHarvester',
    description: 'theHarvester собирает email-адреса, поддомены, хосты, имена сотрудников и IP-адреса из открытых источников — поисковых систем, DNS, PGP-серверов и специализированных API. Классический первый шаг OSINT-разведки перед пентестом, входит в стандартный набор Kali Linux.',
    legal: 'Собираемые данные публичны, но при работе с информацией о сотрудниках соблюдайте законы о персональных данных.',
    install: 'pip install theHarvester  ·  предустановлен в Kali Linux',
    commands: [
      { cmd: 'theHarvester -d example.com -b google,bing', note: 'Поиск email и поддоменов через поисковые системы' },
      { cmd: 'theHarvester -d example.com -b all -l 500', note: 'Поиск по всем доступным источникам с лимитом результатов' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/laramies/theHarvester' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
    ]
  },

  reconng: {
    name: 'Recon-ng', category: 'Разведка', categoryJp: '斥候',
    tagline: 'Модульный фреймворк веб-разведки с интерфейсом в стиле Metasploit.',
    official: 'https://github.com/lanmaster53/recon-ng',
    description: 'Recon-ng — модульный фреймворк веб-разведки на Python: сотни модулей автоматизируют сбор данных о цели из открытых источников (DNS, соцсети, утечки, поисковики) внутри единой консоли, похожей на msfconsole. Хорош для тех, кто уже знаком с Metasploit и хочет применить те же навыки к OSINT.',
    legal: 'Как и с любым OSINT — соблюдайте законы о персональных данных при работе с информацией о людях.',
    install: 'pip install recon-ng  ·  git clone github.com/lanmaster53/recon-ng',
    commands: [
      { cmd: 'recon-ng', note: 'Запуск интерактивной консоли' },
      { cmd: 'marketplace install all', note: 'Установка всех доступных модулей' },
      { cmd: 'modules load recon/domains-hosts/hackertarget', note: 'Загрузка конкретного модуля разведки' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/lanmaster53/recon-ng' }
    ],
    reports: [
      { label: 'OSINT Framework', url: 'https://osintframework.com/' }
    ]
  },

  nuclei: {
    name: 'Nuclei', category: 'Веб', categoryJp: '網',
    tagline: 'Быстрый шаблонный сканер уязвимостей нового поколения.',
    official: 'https://github.com/projectdiscovery/nuclei',
    description: 'Nuclei — сверхбыстрый сканер уязвимостей на основе YAML-шаблонов от ProjectDiscovery: тысячи готовых шаблонов сообщества покрывают CVE, неверные конфигурации, утечки и многое другое. Стал стандартом де-факто в современном bug bounty благодаря скорости и открытой библиотеке шаблонов.',
    legal: 'Многие шаблоны активно проверяют наличие уязвимостей, а не просто пассивно наблюдают — сканируйте только системы, на которые есть разрешение.',
    install: 'go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest',
    commands: [
      { cmd: 'nuclei -u https://target.com', note: 'Сканирование цели всеми актуальными шаблонами' },
      { cmd: 'nuclei -u https://target.com -t cves/', note: 'Сканирование только по шаблонам известных CVE' },
      { cmd: 'nuclei -list urls.txt -o report.txt', note: 'Массовое сканирование списка целей с сохранением отчёта' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/projectdiscovery/nuclei' },
      { label: 'Документация ProjectDiscovery', url: 'https://docs.projectdiscovery.io/' }
    ],
    reports: [
      { label: 'Библиотека шаблонов nuclei-templates', url: 'https://github.com/projectdiscovery/nuclei-templates', note: 'Сообщество публикует шаблоны по следам реальных находок и CVE' }
    ]
  },

  nikto: {
    name: 'Nikto', category: 'Веб', categoryJp: '網',
    tagline: 'Быстрая проверка веб-сервера на опасные файлы и устаревшее ПО.',
    official: 'https://github.com/sullo/nikto',
    description: 'Nikto — консольный сканер веб-серверов, проверяющий более 7000 потенциально опасных файлов и программ, устаревших версий серверного ПО и специфичных для версий проблем конфигурации. Простой и быстрый первый скан перед более глубоким ручным тестированием.',
    legal: 'Активно опрашивает сервер множеством запросов — сканируйте только свои системы или системы с явным разрешением.',
    install: 'apt install nikto  ·  git clone github.com/sullo/nikto',
    commands: [
      { cmd: 'nikto -h https://target.com', note: 'Базовое сканирование веб-сервера' },
      { cmd: 'nikto -h target.com -p 80,443,8080', note: 'Сканирование нескольких портов' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/sullo/nikto' },
      { label: 'cirt.net', url: 'https://cirt.net/Nikto2' }
    ],
    reports: [
      { label: 'HackerOne Hacktivity', url: 'https://hackerone.com/hacktivity' }
    ]
  },

  zeek: {
    name: 'Zeek', category: 'Сеть', categoryJp: '流',
    tagline: 'Мониторинг сети с глубоким протокольным анализом для расследований.',
    official: 'https://zeek.org/',
    description: 'Zeek (ранее Bro) — фреймворк мониторинга сетевой безопасности, который не просто ловит совпадения по сигнатурам, а разбирает трафик по протоколам и генерирует подробные структурированные логи каждого соединения, DNS-запроса, файла и сертификата. Основа многих SOC-конвейеров для расследований и охоты за угрозами.',
    legal: 'Разворачивайте только в сетях, которыми управляете.',
    install: 'apt install zeek  ·  сборка из исходников на zeek.org',
    commands: [
      { cmd: 'zeek -i eth0', note: 'Запуск мониторинга сетевого интерфейса в реальном времени' },
      { cmd: 'zeek -r capture.pcap', note: 'Анализ ранее записанного pcap-файла' }
    ],
    resources: [
      { label: 'Официальная документация', url: 'https://docs.zeek.org/' },
      { label: 'zeek.org', url: 'https://zeek.org/' }
    ],
    reports: [
      { label: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/' }
    ]
  },

  hydra: {
    name: 'Hydra', category: 'Пароли', categoryJp: '鍵',
    tagline: 'Быстрый перебор учётных данных для десятков сетевых протоколов.',
    official: 'https://github.com/vanhauser-thc/thc-hydra',
    description: 'THC-Hydra — инструмент для перебора логинов и паролей по сети, поддерживающий более 50 протоколов: SSH, FTP, RDP, HTTP-формы, базы данных и многое другое. Один из самых быстрых и универсальных брутфорсеров, обязательный пункт в любом курсе по пентесту.',
    legal: 'Подбор паролей к чужим учётным записям без разрешения — преступление. Используйте только на своих системах или в рамках разрешённого теста.',
    install: 'apt install hydra',
    commands: [
      { cmd: 'hydra -l admin -P rockyou.txt ssh://target.com', note: 'Перебор пароля SSH по словарю для известного логина' },
      { cmd: 'hydra -L users.txt -P passwords.txt ftp://target.com', note: 'Перебор логина и пароля одновременно для FTP' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/vanhauser-thc/thc-hydra' }
    ],
    reports: [
      { label: 'Форум Hashcat', url: 'https://hashcat.net/forum/', note: 'Обсуждения реальных методик перебора учётных данных' }
    ]
  },

  cewl: {
    name: 'CeWL', category: 'Пароли', categoryJp: '鍵',
    tagline: 'Генератор словарей паролей на основе содержимого сайта.',
    official: 'https://github.com/digininja/CeWL',
    description: 'CeWL обходит (crawl) сайт и собирает уникальные слова со страниц, создавая целевой словарь для последующей атаки перебором — логика в том, что сотрудники компании часто используют в паролях термины из корпоративного сайта, названия продуктов, имена. Простой, но эффективный инструмент для целевых атак по словарю.',
    legal: 'Само создание словаря из публичного сайта легально; использование словаря для перебора паролей — только на своих системах.',
    install: 'apt install cewl  ·  git clone github.com/digininja/CeWL',
    commands: [
      { cmd: 'cewl https://target.com -w wordlist.txt', note: 'Собрать словарь слов с сайта в файл' },
      { cmd: 'cewl https://target.com -d 3 -m 5 -w wordlist.txt', note: 'Обход на глубину 3 ссылки, слова от 5 символов' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/digininja/CeWL' },
      { label: 'digi.ninja', url: 'https://digi.ninja/projects/cewl.php' }
    ],
    reports: [
      { label: 'Форум Hashcat', url: 'https://hashcat.net/forum/' }
    ]
  },

  sherlock: {
    name: 'Sherlock', category: 'OSINT', categoryJp: '影',
    tagline: 'Поиск профилей по имени пользователя в сотнях соцсетей сразу.',
    official: 'https://github.com/sherlock-project/sherlock',
    description: 'Sherlock проверяет наличие заданного имени пользователя на сотнях социальных сетей и сайтов одновременно — классический инструмент для быстрой первичной разведки личности по нику в OSINT-расследовании или проверке собственного цифрового следа.',
    legal: 'Проверяет только публичную доступность профилей — легально, но соблюдайте этику при расследовании реальных людей.',
    install: 'pip install sherlock-project',
    commands: [
      { cmd: 'sherlock username', note: 'Проверить имя пользователя на всех поддерживаемых площадках' },
      { cmd: 'sherlock username --timeout 5 --print-found', note: 'Ограничить таймаут и показывать только найденные совпадения' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/sherlock-project/sherlock' }
    ],
    reports: [
      { label: 'OSINT Framework', url: 'https://osintframework.com/' }
    ]
  },

  ftkimager: {
    name: 'FTK Imager', category: 'Форензика', categoryJp: '検死',
    tagline: 'Индустриальный стандарт создания судебных образов диска.',
    official: 'https://www.exterro.com/ftk-imager',
    description: 'FTK Imager от Exterro — бесплатный инструмент для создания точных криминалистических образов носителей (с хешированием для доказательства целостности), просмотра содержимого дисков и извлечения файлов без изменения оригинальных данных. Первый шаг практически любого расследования, где есть физический носитель.',
    legal: 'Снимайте образы только устройств, на исследование которых у вас есть законное право.',
    install: 'Бесплатная загрузка после регистрации на exterro.com/ftk-imager',
    commands: [
      { cmd: 'Create Disk Image → выбрать источник → формат E01 / dd', note: 'Создание побитового образа с хешем для доказательства целостности' }
    ],
    resources: [
      { label: 'Официальная страница', url: 'https://www.exterro.com/ftk-imager' }
    ],
    reports: [
      { label: 'SANS DFIR', url: 'https://www.sans.org/digital-forensics-incident-response/' }
    ]
  },

  kape: {
    name: 'KAPE', category: 'Форензика', categoryJp: '検死',
    tagline: 'Быстрый сбор и разбор криминалистических артефактов.',
    official: 'https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape',
    description: 'KAPE (Kroll Artifact Parser and Extractor) стремительно собирает нужные криминалистические артефакты (реестр, журналы событий, историю браузера и десятки других) с живой системы или образа и сразу прогоняет их через парсеры — то, на что раньше уходили часы, KAPE делает за минуты. Стандарт современного incident response, разработан Эриком Циммерманом.',
    legal: 'Используйте только на системах, к которым у вас есть законный доступ.',
    install: 'Бесплатная загрузка после регистрации на сайте Kroll',
    commands: [
      { cmd: 'kape.exe --tsource C: --target !SANS_Triage --tdest C:\\out', note: 'Сбор стандартного набора триаж-артефактов SANS с диска C:' }
    ],
    resources: [
      { label: 'Официальная страница KAPE', url: 'https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape' }
    ],
    reports: [
      { label: 'SANS DFIR', url: 'https://www.sans.org/digital-forensics-incident-response/' }
    ]
  },

  bloodhound: {
    name: 'BloodHound', category: 'Red Team', categoryJp: '突',
    tagline: 'Граф скрытых путей атаки в Active Directory.',
    official: 'https://github.com/SpecterOps/BloodHound',
    description: 'BloodHound использует теорию графов, чтобы выявить неочевидные пути эскалации привилегий в Active Directory и Azure AD — связи, которые ни один администратор не увидит вручную, но которые злоумышленник находит за минуты. Показывает защитникам ровно то, что видит атакующий, ещё до того, как атака произошла.',
    legal: 'Собирает данные о структуре домена — используйте только в своей организации или с разрешением.',
    install: 'github.com/SpecterOps/BloodHound (Community Edition, self-hosted)',
    commands: [
      { cmd: 'SharpHound.exe -c All', note: 'Сбор данных о домене на стороне цели' },
      { cmd: 'Импорт собранных данных в интерфейс BloodHound', note: 'Визуализация путей атаки на графе связей' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/SpecterOps/BloodHound' }
    ],
    reports: [
      { label: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', note: 'Техники атак на Active Directory, которые визуализирует BloodHound' }
    ]
  },

  empire: {
    name: 'Empire', category: 'Red Team', categoryJp: '突',
    tagline: 'Фреймворк постэксплуатации и эмуляции противника.',
    official: 'https://github.com/BC-SECURITY/Empire',
    description: 'Empire — фреймворк постэксплуатации с агентами на PowerShell и Python: управление скомпрометированными хостами, выполнение задач без записи на диск, эмуляция реальных техник APT-группировок из MITRE ATT&CK. Поддерживается сообществом BC Security после того как оригинальный проект был закрыт.',
    legal: 'Использование только в санкционированных red-team операциях с письменным разрешением.',
    install: 'git clone https://github.com/BC-SECURITY/Empire',
    commands: [
      { cmd: './ps-empire server', note: 'Запуск сервера Empire' },
      { cmd: 'listeners; uselistener http; execute', note: 'Настройка листенера для приёма подключений агентов' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/BC-SECURITY/Empire' },
      { label: 'Документация', url: 'https://bc-security.gitbook.io/empire-wiki' }
    ],
    reports: [
      { label: 'MITRE ATT&CK', url: 'https://attack.mitre.org/' }
    ]
  },

  ossec: {
    name: 'OSSEC', category: 'Blue Team', categoryJp: '盾',
    tagline: 'Хостовая система обнаружения вторжений с открытым кодом.',
    official: 'https://www.ossec.net/',
    description: 'OSSEC — открытая HIDS (Host-based Intrusion Detection System): анализ логов, проверка целостности файлов, мониторинг реестра Windows, обнаружение руткитов и оповещения в реальном времени. Работает через агентов на защищаемых хостах — один из самых долгоживущих открытых blue-team инструментов.',
    legal: 'Разворачивайте только на своей инфраструктуре.',
    install: 'github.com/ossec/ossec-hids или пакет из репозитория дистрибутива',
    commands: [
      { cmd: '/var/ossec/bin/ossec-control start', note: 'Запуск агента или менеджера OSSEC' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/ossec/ossec-hids' },
      { label: 'ossec.net', url: 'https://www.ossec.net/' }
    ],
    reports: [
      { label: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/' }
    ]
  },

  misp: {
    name: 'MISP', category: 'Blue Team', categoryJp: '盾',
    tagline: 'Платформа обмена индикаторами компрометации между организациями.',
    official: 'https://www.misp-project.org/',
    description: 'MISP (Malware Information Sharing Platform) — открытая платформа для сбора, хранения и обмена индикаторами компрометации (IOC) и информацией об угрозах между организациями, CERT-командами и сообществами. Позволяет автоматически обогащать собственные системы обнаружения свежими данными об актуальных угрозах.',
    legal: 'Ограничений нет — это инфраструктура защиты; обмен данными регулируется соглашениями сообществ обмена (протокол TLP).',
    install: 'Docker-образ для быстрого старта — инструкции на misp-project.org',
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/MISP/MISP' },
      { label: 'misp-project.org', url: 'https://www.misp-project.org/' }
    ],
    reports: [
      { label: 'Публичные фиды MISP', url: 'https://www.misp-project.org/feeds/', note: 'Реальные индикаторы компрометации, которыми можно обогатить свои системы' }
    ]
  },

  dependencycheck: {
    name: 'OWASP Dependency-Check', category: 'DevSecOps', categoryJp: '鍛',
    tagline: 'Поиск известных уязвимостей в зависимостях проекта (SCA).',
    official: 'https://owasp.org/www-project-dependency-check/',
    description: 'OWASP Dependency-Check сверяет использованные в проекте библиотеки с базой известных уязвимостей (NVD) и показывает, какие из зависимостей содержат публично раскрытые CVE. Один из первых и самых известных open-source инструментов класса Software Composition Analysis (SCA).',
    legal: 'Ограничений нет — сканирование собственных зависимостей является защитной практикой.',
    install: 'brew install dependency-check  ·  плагин для Maven/Gradle',
    commands: [
      { cmd: 'dependency-check.sh --project MyApp --scan ./', note: 'Сканирование директории проекта на уязвимые зависимости' }
    ],
    resources: [
      { label: 'Страница проекта OWASP', url: 'https://owasp.org/www-project-dependency-check/' },
      { label: 'GitHub-репозиторий', url: 'https://github.com/jeremylong/DependencyCheck' }
    ],
    reports: [
      { label: 'GitHub Security Lab', url: 'https://securitylab.github.com/', note: 'Реальные разборы уязвимостей в открытых зависимостях' }
    ]
  },

  gitleaks: {
    name: 'Gitleaks', category: 'DevSecOps', categoryJp: '鍛',
    tagline: 'Поиск случайно закоммиченных секретов и ключей в git-репозиториях.',
    official: 'https://github.com/gitleaks/gitleaks',
    description: 'Gitleaks сканирует git-историю на предмет случайно закоммиченных секретов — API-ключей, паролей, приватных токенов. Легко встраивается как pre-commit хук или шаг CI, чтобы секрет не попал в публичный репозиторий, а если уже попал — чтобы найти его во всей истории коммитов, а не только в текущем состоянии.',
    legal: 'Ограничений нет — сканирование собственных репозиториев является защитной практикой.',
    install: 'brew install gitleaks',
    commands: [
      { cmd: 'gitleaks detect --source . -v', note: 'Сканирование всей истории git-репозитория на секреты' },
      { cmd: 'gitleaks protect --staged', note: 'Проверка перед коммитом (pre-commit хук)' }
    ],
    resources: [
      { label: 'GitHub-репозиторий', url: 'https://github.com/gitleaks/gitleaks' }
    ],
    reports: [
      { label: 'Issues проекта Gitleaks', url: 'https://github.com/gitleaks/gitleaks/issues', note: 'Реальные примеры находок и обсуждение эдж-кейсов от сообщества' }
    ]
  }

};
