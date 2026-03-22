# ClearMedia - deploiement automatise (Windows PowerShell)
# Usage: depuis la racine du projet (apres: winget install GitHub.cli + gh auth login)
#   npm run deploy:script
#   .\scripts\deploy-auto.ps1 -RepoName "clearmedia"
#
# Etapes: commit si besoin -> repo GitHub (gh) -> deploiement Vercel (CLI)
# Premiers lancement: installe GitHub CLI et connecte-toi (gh auth login, vercel login).

param(
  [string]$RepoName = "clearmedia",
  [switch]$SkipGitHub,
  [switch]$SkipVercel
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Find-Git {
  $candidates = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe"
  )
  foreach ($p in $candidates) {
    if (Test-Path $p) { return $p }
  }
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

$git = Find-Git
if (-not $git) {
  Write-Error "Git introuvable. Installe Git for Windows: https://git-scm.com/download/win"
}

if (-not (Test-Path ".git")) {
  & $git init -b main
  & $git config user.email "deploy@clearmedia.local"
  & $git config user.name "ClearMedia"
} else {
  $b = (& $git branch --show-current 2>$null)
  if ($b -eq "master") { & $git branch -M main 2>$null }
}

$status = & $git status --porcelain
if ($status) {
  & $git add -A
  & $git commit -m "chore: sync before deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
  Write-Host "Commit cree."
} else {
  Write-Host "Rien a committer."
}

if (-not $SkipGitHub) {
  $remote = & $git remote get-url origin 2>$null
  if (-not $remote) {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
      Write-Host ""
      Write-Host "Installe GitHub CLI puis reconnecte-toi:" -ForegroundColor Yellow
      Write-Host "  winget install GitHub.cli"
      Write-Host "  gh auth login"
      Write-Host "Puis relance: npm run deploy:script"
      exit 1
    }
    # Cree le depot sur le compte connecte avec gh auth login
    & gh repo create $RepoName --private --source=. --remote=origin --push
    Write-Host "Repo GitHub cree et code pousse."
  } else {
    $branch = (& $git branch --show-current).Trim()
    if (-not $branch) { $branch = "main" }
    & $git push -u origin $branch
    Write-Host "Push vers origin OK."
  }
}

if (-not $SkipVercel) {
  Write-Host ""
  Write-Host "Deploiement Vercel (production)..." -ForegroundColor Cyan
  npx --yes vercel@latest deploy --prod --yes
  Write-Host ""
  Write-Host "Pense a configurer les variables d environnement sur vercel.com si ce n est pas fait." -ForegroundColor Yellow
}
