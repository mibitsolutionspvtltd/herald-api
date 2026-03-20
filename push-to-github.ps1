# PowerShell script to push code to GitHub
# Student Herald API - GitHub Push Script

Write-Host "`n🚀 Student Herald API - GitHub Push Script`n" -ForegroundColor Cyan
Write-Host "=" * 60

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win"
    exit 1
}

# Check if repository is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository initialized" -ForegroundColor Green

# Check remote
try {
    $remote = git remote -v
    if ($remote -match "github.com") {
        Write-Host "✅ GitHub remote configured" -ForegroundColor Green
        Write-Host $remote
    } else {
        Write-Host "⚠️  No GitHub remote found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check remote" -ForegroundColor Yellow
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "`n⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $status
    $commit = Read-Host "`nDo you want to commit these changes? (y/n)"
    if ($commit -eq "y") {
        git add -A
        $message = Read-Host "Enter commit message"
        git commit -m $message
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
}

Write-Host "`n" + "=" * 60
Write-Host "`n📤 Ready to push to GitHub!`n" -ForegroundColor Cyan

Write-Host "Choose authentication method:`n"
Write-Host "1. Use GitHub Desktop (Recommended)" -ForegroundColor Green
Write-Host "2. Use Personal Access Token"
Write-Host "3. Use SSH Key"
Write-Host "4. Try default push (may prompt for credentials)"
Write-Host "5. Cancel"

$choice = Read-Host "`nEnter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n📱 Opening GitHub Desktop instructions..." -ForegroundColor Cyan
        Write-Host "`nSteps:"
        Write-Host "1. Download GitHub Desktop: https://desktop.github.com/"
        Write-Host "2. Install and open GitHub Desktop"
        Write-Host "3. File → Add Local Repository"
        Write-Host "4. Select this folder: $PWD"
        Write-Host "5. Sign in with your GitHub account"
        Write-Host "6. Click 'Publish repository' or 'Push origin'"
        Write-Host "`nPress any key to open GitHub Desktop download page..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Start-Process "https://desktop.github.com/"
    }
    "2" {
        Write-Host "`n🔑 Using Personal Access Token..." -ForegroundColor Cyan
        Write-Host "`nTo create a token:"
        Write-Host "1. Go to: https://github.com/settings/tokens"
        Write-Host "2. Generate new token (classic)"
        Write-Host "3. Select 'repo' scope"
        Write-Host "4. Copy the token"
        
        $token = Read-Host "`nEnter your Personal Access Token (or press Enter to open GitHub)"
        
        if ($token) {
            Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
            try {
                git push https://${token}@github.com/surfw291/herald_api.git main
                Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
                Write-Host "View at: https://github.com/surfw291/herald_api"
            } catch {
                Write-Host "`n❌ Push failed. Please check your token and try again." -ForegroundColor Red
            }
        } else {
            Start-Process "https://github.com/settings/tokens"
            Write-Host "`nOpening GitHub tokens page..."
        }
    }
    "3" {
        Write-Host "`n🔐 Using SSH Key..." -ForegroundColor Cyan
        
        # Check if SSH key exists
        if (Test-Path "$env:USERPROFILE\.ssh\id_ed25519.pub") {
            Write-Host "✅ SSH key found" -ForegroundColor Green
            
            # Change remote to SSH
            git remote set-url origin git@github.com:surfw291/herald_api.git
            Write-Host "✅ Remote URL changed to SSH" -ForegroundColor Green
            
            Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
            try {
                git push -u origin main
                Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
            } catch {
                Write-Host "`n❌ Push failed. Make sure your SSH key is added to GitHub." -ForegroundColor Red
                Write-Host "Add key at: https://github.com/settings/keys"
            }
        } else {
            Write-Host "⚠️  No SSH key found. Generating new key..." -ForegroundColor Yellow
            Write-Host "`nFollow these steps:"
            Write-Host "1. Run: ssh-keygen -t ed25519 -C 'your_email@example.com'"
            Write-Host "2. Press Enter to accept default location"
            Write-Host "3. Add key to GitHub: https://github.com/settings/keys"
            Write-Host "4. Run this script again"
        }
    }
    "4" {
        Write-Host "`n📤 Attempting default push..." -ForegroundColor Yellow
        Write-Host "You may be prompted for credentials..."
        try {
            git push -u origin main
            Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host "View at: https://github.com/surfw291/herald_api"
        } catch {
            Write-Host "`n❌ Push failed." -ForegroundColor Red
            Write-Host "Try one of the other authentication methods."
        }
    }
    "5" {
        Write-Host "`n❌ Cancelled" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "`n❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n" + "=" * 60
Write-Host "`n✨ Done!`n" -ForegroundColor Cyan
