@echo off
echo Setting up STINGTEC environment variables...
echo.

echo Please enter your email settings to enable contact form notifications:
echo.

set /p SENDER_EMAIL="Enter your email address (default: stingteczambiasales@gmail.com): "
if "%SENDER_EMAIL%"=="" set SENDER_EMAIL=stingteczambiasales@gmail.com

set /p SENDER_PASSWORD="Enter your app password (will not be displayed): "

echo.
echo Setting environment variables...
set SMTP_SERVER=smtp.gmail.com
set SMTP_PORT=587

echo.
echo Environment variables set:
echo SENDER_EMAIL: %SENDER_EMAIL%
echo SMTP_SERVER: %SMTP_SERVER%
echo SMTP_PORT: %SMTP_PORT%
echo.

echo Starting the STINGTEC backend server...
cd /d "c:\Users\Computer\Documents\STINGTEC CONSULTANTANCY SERVICES\backend"
set SENDER_EMAIL=%SENDER_EMAIL%
set SENDER_PASSWORD=%SENDER_PASSWORD%
set SMTP_SERVER=%SMTP_SERVER%
set SMTP_PORT=%SMTP_PORT%

echo.
echo Server starting on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

py -3 app.py