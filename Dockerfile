FROM node:latest

# Add package.json and yarn.lock before our code so that Docker
# can cache this layer if our dependencies do not change
RUN mkdir /hollowverse
ADD package.json /hollowverse
ADD yarn.lock /hollowverse

RUN node --version
RUN yarn --version

# Set working directory to project root so
# all the following commands are run relative to
# it
WORKDIR /hollowverse

RUN yarn

ADD . .
