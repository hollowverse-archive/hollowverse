#! /bin/sh
certbot renew

# This directory contains the certificate files, including the private key
cd .certbot/config/live/$DOMAIN/

# Convert private key to GAE-compatible format
openssl rsa -in privkey.pem -out rsa.pem

# Upload fullchain.pem and rsa.pem to GAE
gcloud beta app ssl-certificates update lets-encrypt --certificate ./fullchain.pem --private-key ./rsa.pem

# Use the new certificate for hollowverse.com
gcloud beta app domain-mappings create hollowverse.com --certificate-id lets-encrypt
