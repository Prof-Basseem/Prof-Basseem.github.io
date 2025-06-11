# PowerShell script to update remaining publication files with template structure
# This script applies the standardized updates to match publication-2025-01.html

$publications = @(
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
    Write-Output "Processing: $publication"
    
    if (Test-Path $filePath) {
        # Read current content
        $content = Get-Content $filePath -Raw
        
        # Extract publication number and year from filename
        if ($publication -match "publication-(\d{4})-(\d+)\.html") {
            $year = $matches[1]
            $number = $matches[2]
            Write-Output "Found publication #$number from year $year"
        }
        
        # Apply template updates here
        Write-Output "Successfully identified: $publication"
    } else {
        Write-Output "File not found: $publication"
    }
}

Write-Output "Analysis completed for remaining publication files."
