@echo off
setlocal
cd /d "%~dp0"

where ollama >nul 2>nul
if errorlevel 1 (
  echo Ollama nao foi encontrado.
  echo Instale o Ollama em https://ollama.com/download e abra este arquivo novamente.
  pause
  exit /b 1
)

echo Baixando o modelo-base Qwen3.5 4B. Isso exige internet e pode levar algum tempo.
ollama pull qwen3.5:4b
if errorlevel 1 (
  echo Nao foi possivel baixar o modelo-base. Confira sua conexao e tente novamente.
  pause
  exit /b 1
)

echo Criando o perfil conversacional do Ideon Chat...
ollama create ideon-chat -f Modelfile
if errorlevel 1 (
  echo Nao foi possivel criar o perfil. Confira a mensagem do Ollama acima.
  pause
  exit /b 1
)

echo.
echo Perfil criado. Para testar no Ollama, execute: ollama run ideon-chat
pause
