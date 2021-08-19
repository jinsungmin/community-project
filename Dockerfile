FROM node:14-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- "localhost:4000/health"

WORKDIR /app

COPY ./package.json ./
RUN npm i --only=prod

COPY ./.env ./
COPY ./build/config ./config
COPY ./build/src ./src

CMD ["sh", "-c", "NODE_ENV=$NODE_ENV node --stack-trace-limit=20 ./src/app.js"]