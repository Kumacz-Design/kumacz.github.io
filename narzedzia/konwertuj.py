# Przygotowuje miniaturkę na stronę:
#  - .png/.jpg -> lekki .webp 1280x720 z bezpieczną nazwą (bez spacji i polskich znaków),
#    oryginał trafia do folderu portfolio-miniatury-oryginaly (nie jest wysyłany na GitHuba),
#  - zawsze robi też małą wersję 800x450 w thumbnails/sm/ (szybsze ładowanie na telefonie).
# Użycie: python konwertuj.py "sciezka/do/pliku.png"  -> wypisuje nazwę pliku do wpisania w thumbnails.js
# Bez argumentu: tworzy brakujące małe wersje dla wszystkich plików w thumbnails/.
import os, re, shutil, sys, unicodedata
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THUMBS = os.path.join(ROOT, "thumbnails")
SMALL = os.path.join(THUMBS, "sm")
BACKUP = os.path.join(ROOT, "portfolio-miniatury-oryginaly")


def fit_16x9(im):
    w, h = im.size
    if (w, h) == (1280, 720):
        return im
    tw, th = (w, round(w * 9 / 16)) if w / h < 16 / 9 else (round(h * 16 / 9), h)
    left, top = (w - tw) // 2, (h - th) // 2
    return im.crop((left, top, left + tw, top + th)).resize((1280, 720), Image.LANCZOS)


def make_small(name):
    os.makedirs(SMALL, exist_ok=True)
    im = Image.open(os.path.join(THUMBS, name)).convert("RGB")
    im.resize((800, 450), Image.LANCZOS).save(os.path.join(SMALL, name), "WEBP", quality=82, method=6)


def slugify(base):
    s = unicodedata.normalize("NFKD", base.replace("ł", "l").replace("Ł", "L"))
    s = re.sub(r"[^a-z0-9]+", "-", s.encode("ascii", "ignore").decode().lower()).strip("-")
    return s[:60] or "miniaturka"


def prepare(src):
    src = os.path.abspath(src)
    name = os.path.basename(src)
    if name.lower().endswith(".webp"):
        im = Image.open(src)
        if im.size != (1280, 720):
            fit_16x9(im.convert("RGB")).save(src, "WEBP", quality=88, method=6)
    else:
        slug = slugify(os.path.splitext(name)[0])
        name, n = slug + ".webp", 2
        while os.path.exists(os.path.join(THUMBS, name)):
            name, n = f"{slug}-{n}.webp", n + 1
        fit_16x9(Image.open(src).convert("RGB")).save(os.path.join(THUMBS, name), "WEBP", quality=88, method=6)
        os.makedirs(BACKUP, exist_ok=True)
        shutil.move(src, os.path.join(BACKUP, os.path.basename(src)))
    make_small(name)
    return name


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(prepare(sys.argv[1]))
    else:
        for f in sorted(os.listdir(THUMBS)):
            if f.lower().endswith(".webp") and not os.path.exists(os.path.join(SMALL, f)):
                make_small(f)
                print("sm/" + f)
