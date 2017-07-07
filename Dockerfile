FROM ubuntu:16.04

RUN apt-get update
RUN apt-get -y install curl

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
ENV NVM_DIR "$HOME/.nvm"
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use latest version of Node.js
RUN nvm use node

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install yarn

# Add package.json and yarn.lock before our code so that Docker
# can cache this layer if our dependencies do not change
ADD package.json
ADD yarn.lock

RUN yarn

ADD .
