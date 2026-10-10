# Servidor estático mínimo para medir Vértice en el navegador integrado (solo localhost).
#   /           la app (vertice-app\vertice-app)
#   /docs/      los documentos reales de Descargas
#   /mejora/    el medidor, lo esperado y el historial del ciclo de mejora
param([int]$Port = 8765)
$mounts = [ordered]@{
  '/docs/'    = 'C:\Users\ariel\Downloads\'
  '/esc/'     = 'C:\Users\ariel\OneDrive\Escritorio\Primera Landing page\'
  '/mejora/'  = 'C:\Users\ariel\Downloads\vertice-app\mejora\'
  '/'         = 'C:\Users\ariel\Downloads\vertice-app\vertice-app\'
}
$mime = @{ '.html'='text/html; charset=utf-8'; '.js'='application/javascript; charset=utf-8'; '.mjs'='application/javascript; charset=utf-8';
  '.wasm'='application/wasm'; '.css'='text/css'; '.json'='application/json'; '.webmanifest'='application/manifest+json';
  '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.woff2'='font/woff2'; '.pdf'='application/pdf';
  '.gz'='application/octet-stream'; '.txt'='text/plain; charset=utf-8'; '.csv'='text/csv'; '.md'='text/plain; charset=utf-8' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Output "Sirviendo en http://localhost:$Port/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $res = $ctx.Response
  try {
    $p = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    $file = $null
    foreach ($k in $mounts.Keys) { if ($p.StartsWith($k)) { $file = Join-Path $mounts[$k] ($p.Substring($k.Length) -replace '/', '\'); break } }
    if ($file -and (Test-Path -LiteralPath $file -PathType Container)) { $file = Join-Path $file 'index.html' }
    if ($file -and ($file -notmatch '\.\.') -and (Test-Path -LiteralPath $file -PathType Leaf)) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $res.Headers.Add('Cache-Control', 'no-store')
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $res.StatusCode = 404 }
  } catch { $res.StatusCode = 500 } finally { $res.OutputStream.Close() }
}
