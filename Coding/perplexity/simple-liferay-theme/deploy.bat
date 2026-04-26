@echo off
REM Simple Liferay Theme Deployment Script for Windows

echo Building Simple Liferay Theme...

REM Clean and package the theme
call mvn clean package -Dmaven.test.skip=true

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build successful!

REM Set your Liferay deploy directory here
set LIFERAY_DEPLOY_DIR=C:\liferay\deploy

REM Check if deploy directory is set and exists
if "%LIFERAY_DEPLOY_DIR%"=="" (
    echo Please set LIFERAY_DEPLOY_DIR in this script
    pause
    exit /b 1
)

if not exist "%LIFERAY_DEPLOY_DIR%" (
    echo Deploy directory does not exist: %LIFERAY_DEPLOY_DIR%
    pause
    exit /b 1
)

REM Copy the WAR file to Liferay deploy directory
echo Deploying to: %LIFERAY_DEPLOY_DIR%
copy target\simple-liferay-theme-1.0.0.war "%LIFERAY_DEPLOY_DIR%"

if %ERRORLEVEL% EQU 0 (
    echo Theme deployed successfully!
    echo Check Liferay logs for deployment status.
) else (
    echo Deployment failed!
)

pause
