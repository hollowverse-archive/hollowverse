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
cd .certbot/config/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

gcloud auth activate-service-account $SERVICE_ACCOUNT --key-file gae-client-secret.json

# Upload fullchain.pem and rsa.pem to GAE
gcloud beta app ssl-certificates create --display-name $CERT_NAME --certificate ./fullchain.pem --private-key ./rsa.pem

# Use the new certificate for hollowverse.com
gcloud beta app domain-mappings create $DOMAIN --certificate-id lets-encrypt
