param(
    [Parameter(Mandatory = $false)]
    [string]$SourceRoot = 'C:\Y-CARPETA DE DATOS\5-Moca Office\Fundacion\Moca-Colombia',

    [Parameter(Mandatory = $false)]
    [string]$OutputPath = (Join-Path $PSScriptRoot '..\docs\source-inventory.csv')
)

$ErrorActionPreference = 'Stop'

$resolvedSource = (Resolve-Path -LiteralPath $SourceRoot).Path
$resolvedOutputDirectory = (Resolve-Path -LiteralPath (Split-Path -Parent $OutputPath)).Path
$resolvedOutput = Join-Path $resolvedOutputDirectory (Split-Path -Leaf $OutputPath)

Add-Type -AssemblyName System.Drawing

function Get-AssetCategory {
    param([string]$RelativePath)

    if ($RelativePath -like 'Fotografias\Fotografias-originales\*') { return 'master-image' }
    if ($RelativePath -like 'Fotografias\*') { return 'organized-export' }
    if ($RelativePath -like 'Diseno-Illustrator\*\Links\*') { return 'illustrator-link-copy' }
    if ($RelativePath -like 'Diseno-Illustrator\*\Fonts\*') { return 'illustrator-font-copy' }
    if ($RelativePath -like 'Fuentes\*') { return 'font-source' }
    if ($RelativePath -like 'Logos-e-iconos\*') { return 'vector-source' }
    if ($RelativePath -like 'Contenido\*') { return 'content-source' }
    if ([IO.Path]::GetExtension($RelativePath) -eq '.ai') { return 'illustrator-source' }
    if ([IO.Path]::GetExtension($RelativePath) -eq '.zip') { return 'source-archive' }
    return 'other'
}

$rows = foreach ($file in Get-ChildItem -LiteralPath $resolvedSource -Recurse -File -Force | Sort-Object FullName) {
    $relativePath = $file.FullName.Substring($resolvedSource.Length + 1)
    $width = $null
    $height = $null

    if ($file.Extension -match '^\.(png|jpe?g)$') {
        try {
            $image = [System.Drawing.Image]::FromFile($file.FullName)
            try {
                $width = $image.Width
                $height = $image.Height
            }
            finally {
                $image.Dispose()
            }
        }
        catch {
            $width = 'ERROR'
            $height = 'ERROR'
        }
    }

    [PSCustomObject]@{
        category = Get-AssetCategory -RelativePath $relativePath
        relative_path = $relativePath
        extension = $file.Extension.ToLowerInvariant()
        bytes = $file.Length
        width = $width
        height = $height
        sha256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        modified = $file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')
    }
}

$rows | Export-Csv -LiteralPath $resolvedOutput -NoTypeInformation -Encoding utf8
Write-Output "Wrote $($rows.Count) inventory rows to $resolvedOutput"

