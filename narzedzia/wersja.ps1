# Podbija numer wersji przy plikach CSS/JS w index.html (np. style.css?v=202610201530),
# żeby przeglądarki po publikacji od razu pobrały nowe pliki zamiast starych z pamięci.
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$index = Join-Path $root 'index.html'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$v = Get-Date -Format 'yyyyMMddHHmm'
$text = [IO.File]::ReadAllText($index, $utf8)
$text = [regex]::Replace($text, '(href|src)="((?:assets/css/style\.css|assets/js/main\.js|thumbnails\.js))(\?v=\d+)?"', ('$1="$2?v=' + $v + '"'))
[IO.File]::WriteAllText($index, $text, $utf8)
