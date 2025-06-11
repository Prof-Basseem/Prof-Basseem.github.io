# PowerShell Script to Update All HTML Files with Theme and Accessibility Support

$files = @(
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\contact.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\research.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\teaching.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\publications.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\lab-members.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\youtube-courses.html",
    "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\projects.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Replace the script section to include theme-accessibility.js
        $oldPattern = '    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Modern Custom JS -->
    <script src="js/main-modern.js"></script>
    <!-- Enhanced Image Loader -->
    <script src="js/enhanced-image-loader.js"></script>'
        
        $newPattern = '    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Theme and Accessibility Manager -->
    <script src="js/theme-accessibility.js"></script>
    <!-- Enhanced Image Loader -->
    <script src="js/enhanced-image-loader.js"></script>
    <!-- Modern Custom JS -->
    <script src="js/main-modern.js"></script>'
        
        $content = $content -replace [regex]::Escape($oldPattern), $newPattern
        
        # Write the updated content back to the file
        Set-Content $file -Value $content -NoNewline
        
        Write-Host "Updated $file successfully."
    } else {
        Write-Host "File $file not found."
    }
}

Write-Host "All files updated with theme and accessibility support."
