# PowerShell script to fix script tags in members.html and referrals.html

# Fix members.html
$membersPath = "c:\Users\User\vibe coding\EverShine\members.html"
$membersContent = Get-Content $membersPath -Raw

# Replace the script section in members.html
$membersContent = $membersContent -replace '(?s)(<script src="js/starry-background-unified\.js"></script>\s*<script src="js/components\.js"></script>\s*<script src="js/category-mapping\.js"></script>\s*<script src="js/main\.js"></script>\s*<script src="js/scroll-progress\.js"></script>)', '<script src="js/components.js?v=20250125" defer></script>
    <script src="js/starry-background-unified.js?v=20250125" defer></script>
    <script src="js/category-mapping.js?v=20250125" defer></script>
    <script src="js/main.js?v=20250125" defer></script>
    <script src="js/scroll-progress.js?v=20250125" defer></script>'

Set-Content -Path $membersPath -Value $membersContent -NoNewline

# Fix referrals.html
$referralsPath = "c:\Users\User\vibe coding\EverShine\referrals.html"
$referralsContent = Get-Content $referralsPath -Raw

# Replace the script section in referrals.html
$referralsContent = $referralsContent -replace '(?s)(<script src="js/components\.js"></script>\s*<script src="js/main\.js"></script>\s*<script src="js/scroll-progress\.js"></script>)', '<script src="js/components.js?v=20250125" defer></script>
    <script src="js/starry-background-unified.js?v=20250125" defer></script>
    <script src="js/main.js?v=20250125" defer></script>
    <script src="js/scroll-progress.js?v=20250125" defer></script>'

Set-Content -Path $referralsPath -Value $referralsContent -NoNewline

Write-Host "✅ Script tags updated successfully in both files!"
