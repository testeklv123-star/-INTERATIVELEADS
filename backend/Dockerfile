# Dockerfile para o backend offline-first
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias para better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar código fonte
COPY src-offline-first ./src-offline-first
COPY .env.example ./.env.example

# Criar diretório para o banco de dados
RUN mkdir -p /app/data

# Expor porta
EXPOSE 5000

# Variáveis de ambiente padrão (podem ser sobrescritas)
ENV PORT=5000
ENV SYNC_INTERVAL_SECONDS=30

# Comando para iniciar o servidor
CMD ["node", "src-offline-first/server.js"]

