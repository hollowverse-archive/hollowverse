FROM ubuntu:16.04

# Install prerequisites
RUN apt-get update && apt-get install -y curl software-properties-common python-software-properties

# Add certbot source
RUN add-apt-repository -y ppa:certbot/certbot

# Add Node.js source, needed to spin up a simple static file server
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

# Add the Cloud SDK distribution URI as a package source
RUN \
  export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" \
  && \
  echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | \
    tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud public key
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

RUN apt-get update && apt-get install -y certbot nodejs cron at google-cloud-sdk

# Launch at daemon to run tasks scheduled using at
RUN atd

RUN npm install -g http-server

# This directory will contain domain vertification files
RUN mkdir -p ./public

# Add the certificate genenration and update scripts and crontab file to the container
ADD . .

# Add service account key required to update the certificate
#
# NOTE: Although the decrypted key is not stored in the repository,
# it will be available at deploy time.
# This is added explicitly so the build fails early if
# the file does not exist
ADD ./gae-client-secret.json .

# Schedule certificate generation 30 minutes from now to make sure
# the service is deployed before running the command
RUN echo './cert.sh' | at now + 30 minutes

# Schedule renewal using a cron job
RUN crontab crontab-update-cert

# Serve public files to allow Let's Encrypt to verify domain ownership
CMD http-server ./public -p 8080
