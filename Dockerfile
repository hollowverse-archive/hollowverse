FROM ubuntu:16.04

# Install prerequisites
RUN apt-get update && apt-get install -y curl software-properties-common python-software-properties

# Add certbot source
RUN add-apt-repository -y ppa:certbot/certbot

# Add Node.js source
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

# Add yarn source
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y certbot nodejs yarn

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

RUN yarn client/build

RUN mkdir -p /hollowverse/functions/dist
RUN yarn functions/prepare
RUN yarn functions/build

CMD yarn start
