#! /bin/sh

DOMAIN='hollowverse.com'
EMAIL='msafi@msafi.com'

certbot certonly \
  --agree-tos \
  --email $EMAIL \
  --noninteractive \
  --webroot \
  --webroot-path ./public \
  -d $DOMAIN

# This directory contains the certificate files, including the private key
cd .certbot/config/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

# TODO: upload fullchain.pem and privkey.pem to GAE

# TODO: update SSL configuration to use this certificate if needed
