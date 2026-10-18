# Zamienia obraz na lekki .webp 1280x720 z bezpieczną nazwą pliku (bez spacji i polskich znaków).
# Oryginał trafia do folderu ../portfolio-miniatury-oryginaly obok projektu.
# Użycie: python konwertuj.py "sciezka/do/pliku.png"  -> wypisuje nową nazwę pliku
import os, re, shutil, sys, unicodedata
from PIL import Image

src = sys.argv[1]
folder = os.path.dirname(os.path.abspath(src))
base = os.path.splitext(os.path.basename(src))[0]

slug = unicodedata.normalize("NFKD", base.replace("ł", "l").replace("Ł", "L"))
slug = slug.encode("ascii", "ignore").decode().lower()
slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")[:60] or "miniaturka"
name = slug + ".webp"
n = 2
while os.path.exists(os.path.join(folder, name)):
    name = f"{slug}-{n}.webp"
    n += 1

im = Image.open(src).convert("RGB")
if im.size != (1280, 720):
    # dopasuj do 16:9 (przytnij środek) i zmniejsz do 1280x720
    w, h = im.size
    tw, th = (w, round(w * 9 / 16)) if w / h < 16 / 9 else (round(h * 16 / 9), h)
    left, top = (w - tw) // 2, (h - th) // 2
    im = im.crop((left, top, left + tw, top + th)).resize((1280, 720), Image.LANCZOS)
im.save(os.path.join(folder, name), "WEBP", quality=88, method=6)

backup = os.path.join(os.path.dirname(os.path.dirname(folder)), "portfolio-miniatury-oryginaly")
os.makedirs(backup, exist_ok=True)
shutil.move(src, os.path.join(backup, os.path.basename(src)))
print(name)
