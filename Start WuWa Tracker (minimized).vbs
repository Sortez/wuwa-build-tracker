Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
Set shell = CreateObject("WScript.Shell")
' 7 = start minimized, so the console stays out of the way (it still runs the server).
' Find it on the taskbar / Task Manager to close it and stop the server.
shell.Run "cmd.exe /c """ & folder & "\start-wuwa.cmd""", 7, False
