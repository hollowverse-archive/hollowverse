FROM node:8.9-alpine

RUN apk update -q && apk add git -q

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

RUN mkdir /hollowverse /hollowverse/secrets /hollowverse/client /hollowverse/server

# Set working directory to project root so
# all the following commands are run relative to
# it
WORKDIR /hollowverse

# Copy runtime secrets
COPY ./secrets/ ./secrets/

# Copy environment file, generated at build time by deploy.js
COPY ./env.json ./

# Install shared production dependencies
COPY package.json yarn.lock ./
RUN yarn --prod

RUN mkdir ./server/dist
COPY ./server/dist ./server/dist/

# Set up client
RUN mkdir client/dist
COPY ./client/dist ./client/dist/

CMD yarn start
