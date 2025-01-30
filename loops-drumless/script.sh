#!/bin/bash

# Lista todos os arquivos de áudio (wav ou mp3) na pasta atual.
for file in *.wav *.mp3; do
  # Verifica se o arquivo é um diretório.
  if [ -f "$file" ]; then
    # Extrai o nome do arquivo sem a extensão.
    filename=$(basename -- "$file")
    foldername="${filename%.*}"

    # Cria uma pasta com o nome do arquivo de áudio se não existir.
    if [ ! -d "$foldername" ]; then
      mkdir "$foldername"
    fi

    # Move o arquivo de áudio para a pasta correspondente.
    mv "$file" "$foldername/sound.${file##*.}"
  fi
done

# Gera o arquivo JSON.
index=$(jq -n '[]')

for folder in */; do
  foldername=$(basename -- "$folder")
  index=$(echo "$index" | jq --arg foldername "$foldername" '. + [{"name": $foldername, "path": $foldername}]')
done

# Salva o JSON em um arquivo index.json.
echo "$index" >index.json

echo "Todas as tarefas foram concluídas com sucesso!"
