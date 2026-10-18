/* =========================================================================
   TWOJE DANE — zmień wartości poniżej na swoje
   ========================================================================= */
window.PORTFOLIO = {
  name: "Kumacz",              // imię / pseudonim (logo + stopka)
  role: "Grafik · Miniatury YouTube",
  email: "kumaczdesign@gmail.com",
  available: true,                 // false = ukrywa "Przyjmuję zlecenia"
  tools: ["Adobe Photoshop", "Blender"],      // dopisz inne, jeśli używasz
  // Statystyki w sekcji "Dlaczego ja". Liczba miniatur, nisz i kanałów liczy się SAMA z listy niżej.
  // Tu dopisz tylko PRAWDZIWE liczby (np. z YouTube Studio klientów). Puste value = nie pokazuje się.
  stats: [
    { value: "", label: "lat doświadczenia" },          // np. "3+"
    { value: "", label: "wyświetleń filmów z moimi miniaturami" }, // np. "12 mln+"
  ],
  socials: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "X / Twitter", url: "https://x.com/" },
    { label: "Discord", url: "https://discord.com/" },
  ],
};

/* =========================================================================
   MINIATURY
   1. Wrzuć plik (.webp / .jpg / .png) do folderu  thumbnails/
   2. Dopisz linijkę NA GÓRZE listy (najnowsze pierwsze)
      - category   -> jedna lub kilka kategorii: ["Horror", "Gaming"]
                      każda kategoria tworzy automatycznie swój filtr
      - channel    -> (opcjonalnie) nazwa kanału, np. "Kanał XYZ"
      - channelUrl -> (opcjonalnie) link do kanału, np. "https://youtube.com/@kanal"
      - featured   -> (opcjonalnie) true = miniatura na pełną szerokość
      - client     -> (opcjonalnie) true = PRAWDZIWE zlecenie od tego kanału.
                      Bez tego praca ma etykietę "Koncept" (zrobiona dla zabawy / treningu).
   Albo po prostu uruchom  dodaj-miniatury.bat  — dopisze nowe pliki sam.
   ========================================================================= */
window.THUMBNAILS = [
  { file: "gta-przez-cala-mape.webp", title: "GTA V - PRZEZ CAŁĄ MAPĘ na CHAOS MOD CHALLENGE! 💥☄️", category: ["Gaming"], channel: "Kaluch" },
  { file: "szkola-breaking-bad.webp", title: "SZKOŁA - ''BREAKING BAD'' PO ROKU W POLSCE XD", category: ["Paradokumenty"], channel: "Yoshi OG" },
  { file: "ladowanie-na-ksiezycu.webp", title: "LĄDOWANIE NA KSIĘŻYCU TO FEJK!", category: ["Commentary"], channel: "LakarnumTV" },
  { file: "scritchy-scratchy.webp", title: "ZOSTAŁEM ZDRAPKOWYM LORDEM?! 🤯 (SCRITCHY SCRATCHY)", category: ["Gaming"], channel: "AwizoTV GAMING" },
  { file: "szpital-magda-wspolpraca.webp", title: "SZPITAL - TYPOWA INFLUENCERKA", category: ["Paradokumenty"], channel: "Yoshi OG" },
  { file: "ukryta-prawda-chcieli-go-zabic.webp", title: "UKRYTA PRAWDA - ALE TO NAJGORSZA RANDKA…💀", category: ["Paradokumenty"], channel: "Lakarnum" },
  { file: "jeffrey-dahmer.webp", title: "Niepokojąca sprawa Jeffreya Dahmera", category: ["True Crime"], channel: "Ossos Perdidos" },
  { file: "motyl-samoobrona-bulwary.webp", title: "MOTYL UCZY SAMOOBRONY NA BULWARACH!", category: ["Sport"], channel: "WarszawskiKoks" },
  { file: "granny-nowy-ending.webp", title: "BABCIA MA ŁÓDŹ PODWODNĄ! 🤿| GRANNY 3 *NOWY ENDING*", category: ["Horror", "Gaming"], channel: "Dizowskyy" },
  { file: "99-nocy-w-lesie.webp", title: "WRÓCIŁEM DO 99 NOCY W LESIE... (to był błąd)", category: ["Horror", "Gaming"], channel: "" },
  { file: "szkola-ewa-jest-wsciekla.webp", title: "🏳️‍🌈 SZKOŁA - NATSU & CHŁOPAK GEJ 🏳️‍🌈", category: ["Paradokumenty"], channel: "Yoshi OG" },
  { file: "on-mowi.webp", title: "TA GRA NAS SŁYSZY... I ODPOWIADA! 🎙️| Threshold *DOSTAŁEM BAN NA CZAT*", category: ["Horror", "Gaming"], channel: "Dizowskyy" },
  { file: "cos-pod-lozkiem.webp", title: "GOŁODUPIEC MNIE GONI PO DOMU O 2 W NOCY", category: ["Horror", "Gaming"], channel: "Dizowskyy" },
  { file: "minecraft-verity.webp", title: "Nie wpuszczaj go na swój świat... | Minecraft Verity #1", category: ["Minecraft", "Gaming", "Horror"], channel: "dealereq" },
];
