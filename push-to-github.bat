@echo off
REM Student Herald API - GitHub Push Script (Batch)

echo.
echo ========================================
echo Student Herald API - GitHub Push
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed
echo.

REM Check for uncommitted changes
git status --short
if errorlevel 1 (
    echo ERROR: Not a git repository
    pause
    exit /b 1
)

echo.
echo Choose authentication method:
echo.
echo 1. Use GitHub Desktop (Recommended)
echo 2. Use Personal Access Token
echo 3. Try default push
echo 4. Cancel
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Opening GitHub Desktop download page...
    echo.
    echo Steps:
    echo 1. Download and install GitHub Desktop
    echo 2. File - Add Local Repository
    echo 3. Select this folder
    echo 4. Sign in and push
    echo.
    start https://desktop.github.com/
    pause
) else if "%choice%"=="2" (
    echo.
    echo To create a Personal Access Token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Generate new token (classic)
    echo 3. Select 'repo' scope
    echo 4. Copy the token
    echo.
    set /p token="Enter your token: "
    if not "%token%"=="" (
        echo Pushing to GitHub...
        git push https://%token%@github.com/surfw291/herald_api.git main
        if errorlevel 1 (
            echo ERROR: Push failed
        ) else (
            echo SUCCESS: Pushed to GitHub!
            echo View at: https://github.com/surfw291/herald_api
        )
    )
) else if "%choice%"=="3" (
    echo.
    echo Attempting to push...
    git push -u origin main
    if errorlevel 1 (
        echo ERROR: Push failed
        echo Try using GitHub Desktop or Personal Access Token
    ) else (
        echo SUCCESS: Pushed to GitHub!
    )
) else (
    echo Cancelled
)

echo.
pause
