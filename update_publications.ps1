# PowerShell script to update navbar and footer in publication files

# List of publication files to update (excluding 2025 files which are already correct)
$publicationFiles = @(
    "publication-2014-23.html",
    "publication-2016-22.html", 
    "publication-2017-20.html",
    "publication-2017-21.html",
    "publication-2019-18.html",
    "publication-2019-19.html", 
    "publication-2020-16.html",
    "publication-2021-16.html",
    "publication-2022-08.html",
    "publication-2022-09.html",
    "publication-2022-10.html",
    "publication-2022-11.html",
    "publication-2022-12.html",
    "publication-2022-13.html",
    "publication-2022-14.html",
    "publication-2022-15.html",
    "publication-2023-07.html",
    "publication-2024-03.html",
    "publication-2024-04.html", 
    "publication-2024-05.html"
    # publication-2024-06.html already updated manually
)

$publicationsDir = ".\publications\"

foreach ($file in $publicationFiles) {
    $filePath = Join-Path $publicationsDir $file
    
    if (Test-Path $filePath) {
        Write-Host "Updating $file..."
        
        # Read the file content
        $content = Get-Content $filePath -Raw
        
        # Update navbar - Add missing navigation items
        $oldNavPattern = '(\s+<li class="nav-item">\s+<a class="nav-link" href="\.\./projects\.html">Projects</a>\s+</li>\s+<li class="nav-item">\s+<a class="nav-link" href="\.\./contact\.html">Contact</a>\s+</li>\s+</ul>)'
        $newNavPattern = '                    <li class="nav-item">
                        <a class="nav-link" href="../projects.html">Projects</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../lab-members.html">Lab Members</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../youtube-courses.html">YouTube Courses</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../contact.html">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../assets/files/CV/CV.pdf" target="_blank">
                            <i class="fas fa-file-pdf me-1"></i>CV
                        </a>
                    </li>
                </ul>'
        
        $content = $content -replace $oldNavPattern, $newNavPattern
        
        # Update footer - Add YouTube link if missing
        if ($content -notmatch 'youtube\.com/c/MahmoudBasseem') {
            $oldFooterPattern = '(\s+<a href="https://scholar\.google\.com\.eg/citations\?user=V6_4ZtcAAAAJ&hl" title="Google Scholar" target="_blank">\s+<i class="fas fa-graduation-cap"></i>\s+</a>\s+</div>)'
            $newFooterPattern = '                        <a href="https://scholar.google.com.eg/citations?user=V6_4ZtcAAAAJ&hl" title="Google Scholar" target="_blank">
                            <i class="fas fa-graduation-cap"></i>
                        </a>
                        <a href="https://www.youtube.com/c/MahmoudBasseem" title="YouTube Channel" target="_blank">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>'
            
            $content = $content -replace $oldFooterPattern, $newFooterPattern
        }
        
        # Update footer links styling
        $content = $content -replace 'class="text-decoration-none text-white">', 'class="text-decoration-none text-white" style="transition: color 0.3s;">'
        
        # Write the updated content back to the file
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        
        Write-Host "✓ Updated $file"
    } else {
        Write-Host "✗ File not found: $file"
    }
}

Write-Host "`nUpdate completed!"
