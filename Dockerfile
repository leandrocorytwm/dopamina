# Imagem mínima baseada em Node Alpine. Copia o jogo + PWA.
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY landing.html ./
COPY qrcode.min.js ./
COPY manifest.webmanifest ./
COPY sw.js ./
COPY icon-512.png ./
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=8765
EXPOSE 8765
VOLUME ["/app/data"]
CMD ["node", "server.js"]
