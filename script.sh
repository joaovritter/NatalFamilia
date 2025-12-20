#!/bin/bash

echo "---------------------------------------"
echo "1. Iniciando o build do projeto..."
echo "---------------------------------------"

npm run build 

if [ $? -eq 0 ]; then 
    echo "Build concluído com sucesso!"
    echo "---------------------------------------"
    echo "Movendo arquivos para o Nginx..."
    echo "---------------------------------------"



    sudo rm -rf /var/www/alcefamily/*

    sudo cp -r dist/* /var/www/alcefamily/

    echo "Arquivos movidos com sucesso!"
    echo "---------------------------------------"

    sudo chmod -R 755 /var/www/alcefamily


    sudo systemctl restart nginx


    echo "---------------------------------------"
    echo "Deploy concluído com sucesso!"
    echo "---------------------------------------"

else
    echo "---------------------------------------"
    echo "2. Falha no build do projeto."
    echo "---------------------------------------"
    exit 1
fi