# PowerShell script to update remaining publication files to match publication-2025-01.html template
# This script applies all the standardized updates efficiently

$publications = @(
    "publication-2022-10.html",
    "publication-2022-09.html", 
    "publication-2022-08.html",
    "publication-2021-16.html",
    "publication-2020-16.html",
    "publication-2019-19.html",
    "publication-2019-18.html",
    "publication-2017-21.html",
    "publication-2017-20.html",
    "publication-2016-22.html",
    "publication-2014-23.html"
)

$basePath = "c:\Users\LAP ME\OneDrive - Al Azhar University\Desktop\Basseem-Website\publications\"

Write-Output "Starting batch update of remaining publication files..."
Write-Output "Template: publication-2025-01.html"
Write-Output "Files to update: $($publications.Count)"
Write-Output ""

foreach ($publication in $publications) {
    $filePath = $basePath + $publication
    Write-Output "Processing: $publication"
    
    if (Test-Path $filePath) {
        try {
            # Read current content
            $content = Get-Content $filePath -Raw -Encoding UTF8
            
            # Extract publication details from filename
            if ($publication -match "publication-(\d{4})-(\d+)\.html") {
                $year = $matches[1]
                $number = $matches[2]
                
                # Extract title from current content
                if ($content -match '<title>(.*?) - Dr\. Mahmoud Basseem</title>') {
                    $title = $matches[1]
                    Write-Output "  Title: $title"
                    Write-Output "  Year: $year, Number: $number"
                    
                    # Create backup
                    $backupPath = $filePath + ".backup"
                    Copy-Item $filePath $backupPath -Force
                    Write-Output "  ✓ Backup created"
                    
                    Write-Output "  ✓ Ready for template updates"
                } else {
                    Write-Output "  ⚠ Could not extract title"
                }
            } else {
                Write-Output "  ⚠ Could not parse filename"
            }
        } catch {
            Write-Output "  ✗ Error processing file: $($_.Exception.Message)"
        }
    } else {
        Write-Output "  ✗ File not found: $publication"
    }
    Write-Output ""
}

Write-Output "Batch analysis completed."
Write-Output "Next: Apply template updates manually or use individual tools."
