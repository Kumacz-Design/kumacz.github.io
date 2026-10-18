# Portfolio — Miniatury YouTube

Statyczna strona (HTML/CSS/JS, bez frameworków) gotowa pod GitHub Pages.

## Pierwsza konfiguracja
Otwórz `thumbnails.js` i na górze wpisz swoje dane: imię, e‑mail, linki do sociali, narzędzia.

## Dodawanie nowych miniatur
1. Wrzuć plik do folderu `thumbnails/` — może być `.png`, `.jpg` albo `.webp`, nazwa dowolna (np. „WRÓCIŁEM DO LASU.png”).
2. Kliknij dwukrotnie **`dodaj-miniatury.bat`**. Skrypt:
   - zamieni `.png`/`.jpg` na lekkie `.webp` 1280×720 z bezpieczną nazwą (bez spacji i polskich znaków),
   - przeniesie oryginał do folderu `portfolio-miniatury-oryginaly` obok projektu (nic nie ginie),
   - dopisze miniaturkę na górę listy, z tytułem wziętym z nazwy pliku.
   Do konwersji potrzebny jest Python z biblioteką Pillow (`pip install pillow`). Bez tego plik zostanie dodany tak, jak jest.
3. W `thumbnails.js` uzupełnij nową pozycję, np.:
   ```js
   { file: "granny.webp", title: "Granny 3", category: ["Horror", "Gaming"], channel: "Kanał XYZ", channelUrl: "https://youtube.com/@kanalxyz" },
   ```
   - `category` — jedna lub kilka kategorii. Każda nowa kategoria = nowy filtr na stronie (tworzy się sam).
   - `channel` — nazwa kanału: widać ją pod miniaturą, w podglądzie i w „Teście w feedzie”. Puste `""` = nie pokazuje.
   - `channelUrl` — opcjonalnie, link do kanału (nazwa staje się klikalna).
   - `client: true` — tylko dla prawdziwych zleceń. Bez tego miniatura ma etykietę „Koncept”, a kanał nie liczy się do statystyki „kanałów-klientów”.
   - `featured: true` — opcjonalnie, miniatura na pełną szerokość siatki.

Kolejność na liście = kolejność na stronie.

## Publikacja na GitHub Pages
1. Załóż repo, np. `portfolio` (albo `twojnick.github.io`, wtedy adres będzie bez końcówki).
2. Wrzuć zawartość tego folderu do repo (GitHub Desktop albo „Add file → Upload files”).
3. **Settings → Pages → Build and deployment → Branch: `main` / `(root)` → Save.**
4. Po chwili strona będzie pod `https://twojnick.github.io/portfolio/`.

Każda kolejna aktualizacja = wrzucasz nowe pliki + zmieniony `thumbnails.js` i commit.

### Po pierwszej publikacji
- W `index.html` podmień `og:image` na pełny adres, np. `https://twojnick.github.io/portfolio/assets/img/share.jpg`. Dzięki temu link wysłany na Discordzie czy Messengerze pokaże podgląd z kolażem miniaturek.
- `404.html` to strona, która pokaże się przy złym linku. GitHub Pages używa jej sam.

## Podgląd lokalny
```bash
python -m http.server 5173
```
i wejdź na http://localhost:5173 (albo po prostu otwórz `index.html` w przeglądarce).
