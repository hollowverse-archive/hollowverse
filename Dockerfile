FROM node:latest

ENV NODE_ENV=production

RUN mkdir /hollowverse /hollowverse/secrets /hollowverse/client /hollowverse/server

# Set working directory to project root so
# all the following commands are run relative to
# it
WORKDIR /hollowverse

# Copy runtime secrets
COPY ./secrets/**/* ./secrets/

# Copy envirnonment file written by deploy.js
COPY env.json ./

# Install shared production dependencies
COPY package.json yarn.lock ./
RUN yarn --prod

# Set up server
COPY ./server/package.json ./server/yarn.lock ./server/
RUN yarn --prod

RUN mkdir ./server/dist
COPY ./server/dist/**/* ./server/dist/

# Set up client
RUN mkdir client/dist
COPY ./client/dist/**/* ./client/dist/

WORKDIR /hollowverse/server
CMD yarn start
