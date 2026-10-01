@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
title WuWa Build Tracker  (close this window to stop)

if not exist "node_modules" (
  echo Installing dependencies, this may take a minute...
  call npm.cmd install
)

echo Starting WuWa Build Tracker...
echo The browser will open automatically. Close this window to stop the server.
call npm.cmd run dev

echo.
echo Server stopped.
pause
