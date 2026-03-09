@echo off
set JAVA_HOME=C:\Users\Lovel\.jdks\openjdk-20.0.2
cd /d "c:\Users\Lovel\OneDrive\Pictures\credighana\android"
"%JAVA_HOME%\bin\java" -Xmx2048m -jar gradle\wrapper\gradle-wrapper.jar assembleDebug

