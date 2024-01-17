FROM node:21-alpine

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build
RUN yarn index-db

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD node ./dist/server/entry.mjs


