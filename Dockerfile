FROM node:21-alpine

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD node ./dist/server/entry.mjs


