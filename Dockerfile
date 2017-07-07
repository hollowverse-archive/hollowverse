FROM ubuntu:16.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update
RUN apt-get -y install curl apt-transport-https build-essential

# Add yarn source
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Add Node.js source
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update

RUN apt-get install -y nodejs yarn

# Add package.json and yarn.lock before our code so that Docker
# can cache this layer if our dependencies do not change
ADD package.json ./
ADD yarn.lock ./

RUN yarn

ADD . ./
