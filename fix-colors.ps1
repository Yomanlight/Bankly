# Script pour supprimer toutes les références Colors des styles
$files = @(
    "screens/HomeScreen.js",
    "screens/ExploreScreen.js",
    "screens/ProfileScreen.js"
)

foreach ($file in $files) {
    $path = "c:\Users\beyod\Documents\BankUP\$file"
    Write-Host "Nettoyage de $file..."
    
    $content = Get-Content $path -Raw
    
    # Supprimer les propriétés de couleur des StyleSheets
    $content = $content -replace ",\s*color:\s*Colors\.\w+", ""
    $content = $content -replace "color:\s*Colors\.\w+,?", ""
    $content = $content -replace ",\s*backgroundColor:\s*Colors\.\w+", ""
    $content = $content -replace "backgroundColor:\s*Colors\.\w+,?", ""
    $content = $content -replace ",\s*borderColor:\s*Colors\.\w+", ""
    $content = $content -replace "borderColor:\s*Colors\.\w+,?", ""
    $content = $content -replace ",\s*shadowColor:\s*Colors\.\w+", ""
    $content = $content -replace "shadowColor:\s*Colors\.\w+,?", ""
    $content = $content -replace ",\s*borderBottomColor:\s*Colors\.\w+", ""
    $content = $content -replace "borderBottomColor:\s*Colors\.\w+,?", ""
    
    Set-Content $path -Value $content
    Write-Host "✓ $file nettoyé"
}

Write-Host "`n✅ Tous les fichiers ont été nettoyés!"
Write-Host "Relancez maintenant: npx expo start --clear"
