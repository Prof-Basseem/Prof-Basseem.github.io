# PowerShell Script to Create WebP Version of Images for Better Performance
# Note: This requires imagemagick or similar tool to be installed

$imagePath = "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\assets\img\dr-mahmoud.jpg"
$webpPath = "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\assets\img\dr-mahmoud.webp"

Write-Host "Checking for ImageMagick installation..."

# Check if ImageMagick is installed
try {
    $magickCheck = magick -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "ImageMagick found. Converting image to WebP format..."
        
        # Convert to WebP with quality optimization
        magick convert "$imagePath" -quality 85 -define webp:auto-filter=true "$webpPath"
        
        if (Test-Path $webpPath) {
            Write-Host "WebP image created successfully: $webpPath"
            
            # Get file sizes for comparison
            $originalSize = (Get-Item $imagePath).Length
            $webpSize = (Get-Item $webpPath).Length
            $savings = [math]::Round((($originalSize - $webpSize) / $originalSize) * 100, 2)
            
            Write-Host "Original size: $([math]::Round($originalSize / 1KB, 2)) KB"
            Write-Host "WebP size: $([math]::Round($webpSize / 1KB, 2)) KB"
            Write-Host "Space savings: $savings%"
        } else {
            Write-Host "Failed to create WebP image"
        }
    } else {
        Write-Host "ImageMagick not found. Please install ImageMagick to create WebP images."
        Write-Host "Download from: https://imagemagick.org/script/download.php#windows"
    }
} catch {
    Write-Host "ImageMagick not found. Creating placeholder WebP optimization info..."
    Write-Host "To optimize images to WebP format:"
    Write-Host "1. Install ImageMagick from https://imagemagick.org/"
    Write-Host "2. Run: magick convert 'assets/img/dr-mahmoud.jpg' -quality 85 'assets/img/dr-mahmoud.webp'"
    Write-Host "3. WebP format typically reduces file size by 25-35% compared to JPEG"
}

Write-Host "`nImage optimization check completed."
