# Dockerfile para o frontend web
# Usa nginx para servir arquivos estáticos

FROM nginx:alpine

# Copiar arquivos do frontend para o diretório do nginx
COPY index.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# O nginx já tem um CMD padrão, não precisa especificar

