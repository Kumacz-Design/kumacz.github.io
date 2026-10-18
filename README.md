# Portfolio — Kumacz · miniaturki YouTube

Strona: https://kumacz-design.github.io/kumacz.github.io/

## Dodawanie nowej miniaturki (jedyne, co musisz robić)
1. Wrzuć obrazek do folderu `thumbnails/` (`.png`, `.jpg` albo `.webp`, nazwa dowolna).
2. Kliknij dwukrotnie **`dodaj-miniatury.bat`** i odpowiedz na 3 pytania:
   - tytuł (Enter = nazwa pliku),
   - kategorie po przecinku, np. `Horror, Gaming` (Enter = Inne),
   - kanał (Enter = pomiń).
3. Tyle. Skrypt sam:
   - zamieni obrazek na lekki `.webp` 1280×720 (oryginał ląduje w `Desktop\portfolio-miniatury-oryginaly`),
   - dopisze go na górę strony,
   - wyśle zmiany na GitHuba. Strona odświeży się po ok. minucie.

## Inne zmiany
Jak poprawisz coś ręcznie (teksty w `index.html`, dane w `thumbnails.js`), kliknij **`wyslij.bat`**. Wysyła wszystkie zmiany na GitHuba.

## Opcje w `thumbnails.js`
```js
{ file: "granny.webp", title: "Granny 3", category: ["Horror", "Gaming"], channel: "Kanał XYZ", channelUrl: "https://youtube.com/@kanalxyz" },
```
- `category` — jedna lub kilka kategorii. Każda nowa kategoria = nowy filtr na stronie.
- `channel` / `channelUrl` — nazwa kanału i opcjonalnie link do niego.
- `client: true` — tylko dla prawdziwych zleceń. Bez tego praca ma etykietę „Koncept”.
- `featured: true` — miniaturka na pełną szerokość siatki.

Na górze pliku są Twoje dane: nazwa, e‑mail, sociale, narzędzia i statystyki (wpisuj tylko prawdziwe liczby).

## Podgląd lokalny
```bash
python -m http.server 5173
```
i wejdź na http://localhost:5173.
