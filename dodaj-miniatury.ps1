# Dopisuje do thumbnails.js wszystkie obrazy z folderu thumbnails/, których jeszcze nie ma na liście.
# Jeśli masz Pythona z biblioteką Pillow, pliki .png/.jpg są automatycznie zamieniane na lekkie .webp
# (oryginały lądują w folderze portfolio-miniatury-oryginaly obok projektu).
# Nowe pozycje trafiają na górę (najnowsze pierwsze). Tytuł = nazwa pliku — popraw go potem w thumbnails.js.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Join-Path $root 'thumbnails.js'
$converter = Join-Path $root 'narzedzia\konwertuj.py'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$text = [IO.File]::ReadAllText($manifest, $utf8)

$canConvert = $false
try { python -c "import PIL" 2>$null; $canConvert = ($LASTEXITCODE -eq 0) } catch { }
if (-not $canConvert) { Write-Host 'Brak Pythona/Pillow - pliki zostana dodane bez konwersji.' -ForegroundColor DarkYellow }

$files = Get-ChildItem (Join-Path $root 'thumbnails') -File |
  Where-Object { $_.Extension -match '^\.(webp|jpe?g|png|avif|gif)$' } |
  Sort-Object LastWriteTime

$added = @()
foreach ($f in $files) {
  if ($text -match [regex]::Escape('"' + $f.Name + '"')) { continue }
  $title = ($f.BaseName -replace '[-_]+', ' ').Trim()
  if ($title.Length) { $title = $title.Substring(0, 1).ToUpper() + $title.Substring(1) }
  $title = $title -replace '"', '\"'
  $file = $f.Name
  if ($canConvert -and $f.Extension -ne '.webp') {
    $env:PYTHONIOENCODING = 'utf-8'
    $out = python $converter $f.FullName
    if ($LASTEXITCODE -eq 0 -and $out) { $file = ($out | Select-Object -Last 1).Trim() }
  }
  $line = "  { file: `"$file`", title: `"$title`", category: [`"Inne`"], channel: `"`" },"
  $text = $text -replace '(window\.THUMBNAILS\s*=\s*\[\r?\n)', ('$1' + $line + "`n")
  $added += $file
}

if ($added.Count) {
  [IO.File]::WriteAllText($manifest, $text, $utf8)
  Write-Host "Dodano $($added.Count):" -ForegroundColor Green
  $added | ForEach-Object { Write-Host "  + $_" }
  Write-Host "`nOtworz thumbnails.js i popraw tytul / kategorie nowych pozycji." -ForegroundColor Yellow
} else {
  Write-Host 'Brak nowych plikow w folderze thumbnails/.'
}
