ARG NODE_VERSION=20.5.0

FROM node:${NODE_VERSION}-slim

ENV NODE_ENV production 

WORKDIR /app

USER node

EXPOSE 3000

COPY dist/* .

CMD node index.js
