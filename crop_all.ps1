Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('e:\examquest\reference\exam-dashboard.png')

function CropAndSave($x, $y, $w, $h, $name) {
    $cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save("e:\examquest\reference\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

# 1. Top Navbar
CropAndSave 0, 0, 1024, 60, "crop_navbar"

# 2. Left Sidebar Top (All Exams & Exam list)
CropAndSave 10, 60, 180, 240, "crop_sidebar_top"

# 3. Left Sidebar Bottom (Daily Challenge)
CropAndSave 10, 480, 180, 200, "crop_sidebar_bottom"

# 4. Question Header & Meta
CropAndSave 180, 60, 570, 160, "crop_question_header"

# 5. Question Options
CropAndSave 180, 210, 570, 220, "crop_question_options"

# 6. Bottom Navigation Buttons
CropAndSave 180, 610, 570, 70, "crop_bottom_nav"

# 7. Right Sidebar Progress Card
CropAndSave 760, 60, 250, 240, "crop_right_progress"

$img.Dispose()
Write-Host "All crops saved"
