#! /bin/bash

source ./env.sh

# Exit early on any command failure
set -e

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

# Find the certificate ID that matches the certificate display name
CERT_ID=$(gcloud beta app ssl-certificates list --filter $CERT_NAME --limit 1 | tail -n 1 | cut -f 1 -d ' ' | tr -d '[:space:]')

# Upload fullchain.pem and rsa.pem to GAE
if [[ -z $CERT_ID ]]; then
  # Create a new certificate if no matching certificate ID is found
  gcloud beta app ssl-certificates create --display-name $CERT_NAME --certificate ./fullchain.pem --private-key ./rsa.pem;
else
  # Otherwise, update the existing one
  gcloud beta app ssl-certificates update $CERT_ID --certificate ./fullchain.pem --private-key ./rsa.pem
fi

