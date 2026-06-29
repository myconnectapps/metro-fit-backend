FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
#RUN npm ci --only=production
RUN npm install --omit=dev

COPY src/ ./src

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
