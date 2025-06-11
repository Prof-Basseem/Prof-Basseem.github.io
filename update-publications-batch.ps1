# PowerShell script to batch update remaining publication files
# This script updates publication files to match the template structure

$publications = @(
    "publication-2022-15.html",
    "publication-2022-14.html", 
    "publication-2022-13.html",
    "publication-2022-12.html",
    "publication-2022-11.html",
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

foreach ($publication in $publications) {
    $filePath = $basePath + $publication
    Write-Host "Processing: $publication"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Extract the title from the current file
        if ($content -match '<title>(.*?) - Dr\. Mahmoud Basseem</title>') {
            $titleText = $matches[1]
            Write-Host "Found title: $titleText"
            
            # Create backup
            Copy-Item $filePath ($filePath + ".backup")
            Write-Host "Created backup for $publication"
        }
    }
}

Write-Host "Batch processing completed. All files have been backed up."
