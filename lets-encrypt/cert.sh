#! /bin/sh

DOMAIN='hollowverse.com'
EMAIL='msafi@msafi.com'

mkdir -p .certbot/config .certbot/work .certbot/logs

certbot certonly \
  --agree-tos \
  --email $EMAIL \
  --config-dir ./.certbot/config \
  --work-dir ./.certbot/work \
  --logs-dir ./.certbot/logs \
  --noninteractive \
  --webroot \
  --webroot-path ./public \
  -d $DOMAIN

# This directory contains the certificate files, including the private key
cd .certbot/config/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

