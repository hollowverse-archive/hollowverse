#! /bin/bash

source ./env.sh

certbot renew

# This directory contains the certificate files, including the private key
cd /etc/letsencrypt/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

# Upload fullchain.pem and rsa.pem to GAE
gcloud beta app ssl-certificates update $CERT_ID --certificate ./fullchain.pem --private-key ./rsa.pem
