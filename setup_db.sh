#!/bin/bash

# Defina as variáveis
CONTAINER_NAME="my_postgres"
DB_USER="test"
DB_PASS="teste123"
DB_NAME="memory"
MIGRATION_FILE="migration-create-memory-table.sql"
MIGRATION_PATH="./migrations/migration-create-memory-table.sql"

# Iniciar o Docker e o contêiner PostgreSQL
echo "Iniciando o Docker e o contêiner PostgreSQL..."

# Verificar se o Docker está rodando, caso contrário, iniciar
if ! docker info > /dev/null 2>&1; then
  echo "Docker não está rodando. Iniciando Docker..."
  sudo systemctl start docker
fi

# Iniciar o contêiner PostgreSQL, caso não esteja rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "Iniciando contêiner PostgreSQL..."
  docker-compose up -d
else
  echo "Contêiner PostgreSQL já está rodando."
fi

# Aguardar alguns segundos para garantir que o banco de dados esteja pronto
echo "Aguardando 5 segundos para garantir que o banco de dados esteja pronto..."
sleep 5

# Verificar se o contêiner PostgreSQL está rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "Erro: O contêiner PostgreSQL não está rodando. Verifique os logs."
  exit 1
fi

# Copiar o arquivo de migration para dentro do contêiner
echo "Copiando o arquivo de migration para o contêiner..."
docker cp "$MIGRATION_PATH" "$CONTAINER_NAME:/migration-create-memory-table.sql"

# Executar o script de migration dentro do contêiner
echo "Executando a migration para criar a tabela 'memory'..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /migration-create-memory-table.sql

# Confirmar se a tabela foi criada
echo "Verificando se a tabela 'memory' foi criada..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT * FROM memory LIMIT 1;"

echo "Setup do banco de dados concluído com sucesso!"
