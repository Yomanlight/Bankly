# Nettoyage ExploreScreen
$content = Get-Content "screens\ExploreScreen.js" -Raw
$content = $content -replace ",\s*color:\s*Colors\.\w+", ""
$content = $content -replace "color:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*backgroundColor:\s*Colors\.\w+", ""
$content = $content -replace "backgroundColor:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*borderColor:\s*Colors\.\w+", ""
$content = $content -replace "borderColor:\s*Colors\.\w+,?", ""
Set-Content "screens\ExploreScreen.js" -Value $content
Write-Host "ExploreScreen nettoye"

# Nettoyage ProfileScreen
$content = Get-Content "screens\ProfileScreen.js" -Raw
$content = $content -replace ",\s*color:\s*Colors\.\w+", ""
$content = $content -replace "color:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*backgroundColor:\s*Colors\.\w+", ""
$content = $content -replace "backgroundColor:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*borderColor:\s*Colors\.\w+", ""
$content = $content -replace "borderColor:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*borderBottomColor:\s*Colors\.\w+", ""
$content = $content -replace "borderBottomColor:\s*Colors\.\w+,?", ""
$content = $content -replace ",\s*shadowColor:\s*Colors\.\w+", ""
$content = $content -replace "shadowColor:\s*Colors\.\w+,?", ""
Set-Content "screens\ProfileScreen.js" -Value $content
Write-Host "ProfileScreen nettoye"

Write-Host "`nTous les fichiers nettoyes! Relancez: npx expo start --clear"
