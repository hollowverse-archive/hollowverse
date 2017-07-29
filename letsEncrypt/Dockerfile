FROM ubuntu:16.04

# Install prerequisites
RUN apt-get update && apt-get install -y curl software-properties-common python-software-properties

# Add certbot source
RUN add-apt-repository -y ppa:certbot/certbot

# Add Node.js source, needed to spin up a simple static file server
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update && apt-get install -y certbot nodejs cron at

RUN npm install -g http-server

# This directory will contain domain vertification files
RUN mkdir -p ./public

# Add the certificate genenration script and crontab file to the container
ADD . .

# Schedule certificate generation 30 minutes from now to make sure
# the service is deployed before running the command
RUN echo './cert.sh' | at now + 30 minutes

# Schedule renewal using a cron job
RUN crontab crontab-update-cert

# Serve public files to allow Let's Encrypt to verify domain ownership
CMD http-server ./public -p 8080
