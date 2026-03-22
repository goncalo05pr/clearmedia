# ClearMedia - deploiement automatise (Windows PowerShell)
# Usage: depuis la racine du projet
#   .\scripts\deploy-auto.ps1
#   .\scripts\deploy-auto.ps1 -GitHubUser "monuser" -RepoName "clearmedia"
#
# Etapes: commit si besoin -> repo GitHub (gh) -> deploiement Vercel (CLI)
# Premiers lancement: installe GitHub CLI et connecte-toi (gh auth login, vercel login).

param(
  [string]$GitHubUser = "",
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
    if (-not $GitHubUser) {
      Write-Host ""
      Write-Host "Pas de remote 'origin'. Options:" -ForegroundColor Yellow
      Write-Host "  1) Installe GitHub CLI: winget install GitHub.cli"
      Write-Host "  2) Relance: .\scripts\deploy-auto.ps1 -GitHubUser TON_USER"
      Write-Host "  Ou ajoute manuellement: git remote add origin https://github.com/USER/REPO.git"
      Write-Host "  Puis: git push -u origin main"
      exit 1
    }
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
      Write-Error "GitHub CLI (gh) introuvable. winget install GitHub.cli puis gh auth login"
    }
    & gh repo create "$RepoName" --private --source=. --remote=origin --push
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
