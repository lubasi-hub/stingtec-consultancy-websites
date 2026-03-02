@echo off
echo Starting STINGTEC BUSINESS CONSULTANTS Application...
echo.

echo Make sure you have installed the required dependencies:
echo - Python 3.x
echo - Flask, Flask-CORS, Flask-JWT-Extended
echo.

echo Starting backend server...
echo.

cd /d "c:\Users\Computer\Documents\STINGTEC CONSULTANTANCY SERVICES\backend"

echo Server will be available at http://localhost:5000
echo.

echo To enable email notifications, set these environment variables:
echo - SENDER_EMAIL: your email address
echo - SENDER_PASSWORD: your app password
echo - SMTP_SERVER: your SMTP server (default: smtp.gmail.com)
echo - SMTP_PORT: your SMTP port (default: 587)
echo.

echo Starting Flask backend...
py -3 app.py