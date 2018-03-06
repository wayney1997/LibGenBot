if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd "C:\Users\wayne\Desktop\Discord\bot coding"

start /min cmd /C "node bot.js"
goto :EOF
:minimized