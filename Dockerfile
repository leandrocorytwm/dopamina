# Imagem mínima baseada em Node Alpine. Copia só o necessário.
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY landing.html ./
COPY qrcode.min.js ./
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=8765
EXPOSE 8765
VOLUME ["/app/data"]
CMD ["node", "server.js"]
