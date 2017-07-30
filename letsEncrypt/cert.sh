#! /bin/bash

source ./env.sh

certbot certonly \
  --agree-tos \
  --email $EMAIL \
  --noninteractive \
  --webroot \
  --webroot-path ./public \
  -d $DOMAIN


# This directory contains the certificate files, including the private key
cd /etc/letsencrypt/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

gcloud auth activate-service-account $SERVICE_ACCOUNT --key-file /gae-client-secret.json

# Upload fullchain.pem and rsa.pem to GAE
# Disabled as the certificate is already uploaded in GAE, we just need to update it regularly
# gcloud beta app ssl-certificates create --display-name $CERT_NAME --certificate ./fullchain.pem --private-key ./rsa.pem
