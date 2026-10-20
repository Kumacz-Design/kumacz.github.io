# Dodaje nowe miniaturki z folderu thumbnails/ i od razu publikuje stronę.
# 1. zamienia .png/.jpg na lekkie .webp (jeśli jest Python + Pillow), oryginał trafia do portfolio-miniatury-oryginaly
# 2. pyta o tytuł, kategorie i kanał (Enter = wartość domyślna)
# 3. dopisuje pozycję na górę thumbnails.js
# 4. wysyła zmiany na GitHuba (strona odświeża się po ok. minucie)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$manifest = Join-Path $root 'thumbnails.js'
$converter = Join-Path $root 'narzedzia\konwertuj.py'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$text = [IO.File]::ReadAllText($manifest, $utf8)

function Esc([string]$s) { return ($s -replace '\\', '\\' -replace '"', '\"').Trim() }

$canConvert = $false
try { python -c "import PIL" 2>$null; $canConvert = ($LASTEXITCODE -eq 0) } catch { }

$files = Get-ChildItem (Join-Path $root 'thumbnails') -File |
  Where-Object { $_.Extension -match '^\.(webp|jpe?g|png|avif|gif)$' } |
  Sort-Object LastWriteTime

$new = @($files | Where-Object { $text -notmatch [regex]::Escape('"' + $_.Name + '"') })
if (-not $new.Count) {
  Write-Host 'Brak nowych plików w folderze thumbnails/.' -ForegroundColor Yellow
  Write-Host 'Wrzuć tam obrazek i uruchom mnie jeszcze raz.'
  exit 0
}

$added = @()
foreach ($f in $new) {
  Write-Host ''
  Write-Host "Nowa miniaturka: $($f.Name)" -ForegroundColor Cyan
  $defTitle = ($f.BaseName -replace '[-_]+', ' ').Trim()

  $title = Read-Host "  Tytuł [Enter = $defTitle]"
  if (-not $title) { $title = $defTitle }
  $cats = Read-Host '  Kategorie, po przecinku (np. Horror, Gaming) [Enter = Inne]'
  if (-not $cats) { $cats = 'Inne' }
  $channel = Read-Host '  Kanał [Enter = pomiń]'

  $file = $f.Name
  if ($canConvert) {
    $env:PYTHONIOENCODING = 'utf-8'
    $out = python $converter $f.FullName
    if ($LASTEXITCODE -eq 0 -and $out) { $file = ($out | Select-Object -Last 1).Trim() }
  }

  $catList = ($cats -split ',' | ForEach-Object { '"' + (Esc $_) + '"' } | Where-Object { $_ -ne '""' }) -join ', '
  $line = "  { file: `"$file`", title: `"$(Esc $title)`", category: [$catList], channel: `"$(Esc $channel)`" },"
  $text = $text -replace '(window\.THUMBNAILS\s*=\s*\[\r?\n)', ('$1' + $line.Replace('$', '$$') + "`n")
  $added += $title
}

[IO.File]::WriteAllText($manifest, $text, $utf8)
Write-Host ''
Write-Host "Dodano $($added.Count) miniaturek." -ForegroundColor Green

# publikacja (git pisze na stderr, więc nie przerywamy na tym skryptu)
$ErrorActionPreference = 'Continue'
git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Repozytorium nie jest podpięte do GitHuba - zmiany zapisane tylko lokalnie.' -ForegroundColor Yellow
  exit 0
}
Write-Host 'Wysyłam na GitHuba...'
& (Join-Path $root 'narzedzia\wersja.ps1')
git add -A
git commit -q -m ("Nowe miniaturki: " + ($added -join ', '))
git push -q
if ($LASTEXITCODE -eq 0) {
  Write-Host 'Gotowe! Strona odświeży się za ok. minutę.' -ForegroundColor Green
} else {
  Write-Host 'Nie udało się wysłać. Sprawdź internet i uruchom wyslij.bat.' -ForegroundColor Red
}
