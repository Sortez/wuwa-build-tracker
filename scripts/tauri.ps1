# Launches the Tauri CLI with the Visual Studio C++ environment loaded.
#
# On this machine rustc's MSVC auto-detection picks the Visual Studio 2026
# preview install, which ships the compiler but not the Windows SDK, so linking
# fails with "LNK1104: cannot open file 'msvcrt.lib'". Importing the Build Tools
# 2022 vcvars environment up front sidesteps the faulty detection.
#
# Usage: scripts\tauri.ps1 <tauri args>   (for example: dev, build, info)

$ErrorActionPreference = 'Stop'

$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
$vcvars = $null
if (Test-Path $vswhere) {
    $vcvars = & $vswhere -latest -products * `
        -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 `
        -find 'VC\Auxiliary\Build\vcvars64.bat' |
        Select-Object -First 1
}

if ($vcvars -and (Test-Path $vcvars)) {
    cmd /c "`"$vcvars`" >nul 2>&1 && set" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            Set-Item -Path "env:$($matches[1])" -Value $matches[2]
        }
    }
    Write-Host "Loaded MSVC environment from: $vcvars"
}
else {
    Write-Warning 'vcvars64.bat not found; relying on rustc''s own MSVC detection.'
}

$cargoBin = Join-Path $env:USERPROFILE '.cargo\bin'
if (Test-Path $cargoBin) {
    $env:Path = "$cargoBin;$env:Path"
}

# The updater needs every release bundle signed. The key lives outside the
# repo (see scripts\release.ps1) and has no password.
$signingKey = Join-Path $env:USERPROFILE '.tauri\wuwa-build-tracker.key'
if (-not $env:TAURI_SIGNING_PRIVATE_KEY -and (Test-Path $signingKey)) {
    $env:TAURI_SIGNING_PRIVATE_KEY = Get-Content $signingKey -Raw
    $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ''
}

& npx.cmd tauri @args
exit $LASTEXITCODE
