FROM node:latest

ENV NODE_ENV=production

EXPOSE 8080

RUN mkdir /hollowverse /hollowverse/secrets /hollowverse/client /hollowverse/server

# Set working directory to project root so
# all the following commands are run relative to
# it
WORKDIR /hollowverse

# Copy runtime secrets
COPY ./secrets/ ./secrets/

# Install shared production dependencies
COPY package.json yarn.lock ./
RUN yarn --prod

RUN mkdir ./server/dist
COPY ./server/dist ./server/dist/

# Set up client
RUN mkdir client/dist
COPY ./client/dist ./client/dist/

# Copy environment file, generated at build time by deploy.js
COPY ./env.json ./

CMD yarn start
