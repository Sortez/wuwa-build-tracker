# Publishes a new desktop release that installed apps pick up via the updater.
#
# Usage: npm run release -- 0.2.0 ["Optional release notes"]
#
# Steps: bump the version in package.json / tauri.conf.json / Cargo.toml,
# build the signed NSIS installer, write latest.json, commit + push, and
# create the GitHub release (tag v<version>) with gh.
#
# Needs: the signing key at %USERPROFILE%\.tauri\wuwa-build-tracker.key,
# a git remote "origin" on GitHub, and `gh auth login` done once.

param(
    [Parameter(Mandatory = $true)][string]$Version,
    [string]$Notes = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    throw "Version must look like 1.2.3, got '$Version'."
}
if (-not $Notes) { $Notes = "WuWa Build Tracker $Version" }

$remote = git remote get-url origin
if ($remote -notmatch 'github\.com[:/](?<slug>[^/]+/[^/.]+?)(\.git)?$') {
    throw "origin is not a GitHub remote: $remote"
}
$slug = $matches.slug
$tag = "v$Version"

$gh = (Get-Command gh -ErrorAction SilentlyContinue).Source
if (-not $gh) { $gh = Join-Path $env:ProgramFiles 'GitHub CLI\gh.exe' }
if (-not (Test-Path $gh)) { throw 'GitHub CLI (gh) not found - install it with: winget install GitHub.cli' }

# 1. Bump versions (all three must match or the updater compares the wrong one).
function Set-JsonVersion($path) {
    $text = Get-Content $path -Raw
    $text = [regex]::Replace($text, '"version":\s*"[^"]+"', "`"version`": `"$Version`"", 1)
    [IO.File]::WriteAllText((Join-Path $root $path), $text)
}
Set-JsonVersion 'package.json'
Set-JsonVersion 'src-tauri/tauri.conf.json'
$cargo = Get-Content 'src-tauri/Cargo.toml' -Raw
$cargo = [regex]::Replace($cargo, '(?m)^version = "[^"]+"', "version = `"$Version`"", 1)
[IO.File]::WriteAllText((Join-Path $root 'src-tauri/Cargo.toml'), $cargo)

# 2. Build the signed installer.
npm.cmd run desktop:build
if ($LASTEXITCODE -ne 0) { throw 'desktop:build failed.' }

$bundleDir = Join-Path $root 'src-tauri/target/release/bundle/nsis'
$setup = Get-ChildItem $bundleDir -Filter "*_${Version}_x64-setup.exe" | Select-Object -First 1
if (-not $setup) { throw "No installer for $Version found in $bundleDir." }
$sigPath = "$($setup.FullName).sig"
if (-not (Test-Path $sigPath)) { throw 'Installer signature (.sig) missing - is the signing key present?' }

# GitHub turns spaces in asset names into dots, so upload under a fixed name.
$releaseDir = Join-Path $root 'release'
New-Item -ItemType Directory -Force $releaseDir | Out-Null
Get-ChildItem $releaseDir | Remove-Item -Force
$assetName = "WuWa-Build-Tracker_${Version}_x64-setup.exe"
$asset = Join-Path $releaseDir $assetName
Copy-Item $setup.FullName $asset

# 3. latest.json, the feed the installed apps poll.
$manifest = [ordered]@{
    version   = $Version
    notes     = $Notes
    pub_date  = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    platforms = [ordered]@{
        'windows-x86_64' = [ordered]@{
            signature = (Get-Content $sigPath -Raw).Trim()
            url       = "https://github.com/$slug/releases/download/$tag/$assetName"
        }
    }
}
$latest = Join-Path $releaseDir 'latest.json'
[IO.File]::WriteAllText($latest, ($manifest | ConvertTo-Json -Depth 5))

# 4. Commit, push, publish.
git add -A
git commit -m "Release $tag"
if ($LASTEXITCODE -ne 0) { throw 'git commit failed.' }
git push origin HEAD
if ($LASTEXITCODE -ne 0) { throw 'git push failed.' }

& $gh release create $tag $asset $latest --repo $slug --title $tag --notes $Notes
if ($LASTEXITCODE -ne 0) { throw 'gh release create failed.' }

Write-Host "Published $tag - installed apps will offer the update on next start."
