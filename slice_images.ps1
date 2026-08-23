Add-Type -AssemblyName System.Drawing

$monstersDir = "c:\Users\ASUS\Desktop\python\assets\monsters"
$tattoosDir = "c:\Users\ASUS\Desktop\python\assets\tattoos"

if (-not (Test-Path $monstersDir)) { New-Item -ItemType Directory -Path $monstersDir | Out-Null }
if (-not (Test-Path $tattoosDir)) { New-Item -ItemType Directory -Path $tattoosDir | Out-Null }

# 1. Slice Monsters (4 columns x 3 rows)
$mImg = [System.Drawing.Image]::FromFile("c:\Users\ASUS\Desktop\python\assets\monsters_grid.jpg")
$mW = [int]($mImg.Width / 4)
$mH = [int]($mImg.Height / 3)

for ($m = 1; $m -le 12; $m++) {
    $idx = $m - 1
    $col = $idx % 4
    $row = [Math]::Floor($idx / 4)
    
    $srcX = $col * $mW
    $srcY = $row * $mH
    
    $targetBmp = New-Object System.Drawing.Bitmap $mW, $mH
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $mW, $mH
    $srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $mW, $mH
    
    $g.DrawImage($mImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $outPath = Join-Path $monstersDir "month_$m.jpg"
    $targetBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $targetBmp.Dispose()
}
$mImg.Dispose()

# 2. Slice Tattoos (7 columns x 5 rows)
$tImg = [System.Drawing.Image]::FromFile("c:\Users\ASUS\Desktop\python\assets\tattoos_grid.jpg")
$tW = [int]($tImg.Width / 7)
$tH = [int]($tImg.Height / 5)

for ($d = 1; $d -le 31; $d++) {
    $idx = $d - 1
    $col = $idx % 7
    $row = [Math]::Floor($idx / 7)
    
    $srcX = $col * $tW
    $srcY = $row * $tH
    
    $targetBmp = New-Object System.Drawing.Bitmap $tW, $tH
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $tW, $tH
    $srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $tW, $tH
    
    $g.DrawImage($tImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $outPath = Join-Path $tattoosDir "day_$d.jpg"
    $targetBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $targetBmp.Dispose()
}
$tImg.Dispose()

Write-Output "Successfully sliced 12 monsters and 31 tattoos into separate images!"
