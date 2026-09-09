Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('e:\examquest\reference\exam-dashboard.png')
$cropRect = New-Object System.Drawing.Rectangle(760, 310, 230, 150)
$bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save('e:\examquest\reference\nav_crop.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Host "Success"
