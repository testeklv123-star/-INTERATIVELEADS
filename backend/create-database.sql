-- Script para criar o banco de dados InterativeLeads
-- Execute este script no pgAdmin ou usando psql

-- 1. Criar o banco de dados
CREATE DATABASE interativeleads;

-- 2. Conectar ao banco (no pgAdmin, selecione o banco interativeleads antes de continuar)
\c interativeleads;

-- 3. Confirmar criação
SELECT 'Banco de dados interativeleads criado com sucesso!' AS status;

