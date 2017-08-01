#! /bin/node
const shelljs = require('shelljs');

const { EMAIL, DOMAIN, CERT_NAME, SERVICE_ACCOUNT } = require('./config');

shelljs.exec(`
  certbot certonly \
    --agree-tos \
    --email ${EMAIL} \
    --noninteractive \
    --webroot \
    --webroot-path ./public \
    -d ${DOMAIN} \
`);

// This directory contains the certificate files, including the private key
shelljs.cd(`/etc/letsencrypt/live/${DOMAIN}/`);

// Convert private key to GAE-compatible format
shelljs.exec('openssl rsa -in privkey.pem -out rsa.pem');

// Authenticate to Google Cloud Platform
shelljs.exec(
  `gcloud auth activate-service-account ${SERVICE_ACCOUNT} --key-file /gae-client-secret.json`,
);

// Find the certificate ID that matches the certificate display name
const CERT_ID = shelljs
  .exec(`gcloud beta app ssl-certificates list --filter ${CERT_NAME} --limit 1`)
  .stdout.split('\n')[1] // Take the second line of output (the first one is column headings)
  .match(/^([0-9]+)\s/i)[1] // Get the certificate ID
  .trim();

// Upload fullchain.pem and rsa.pem to GAE
if (CERT_ID.length === 0) {
  // Create a new certificate if no matching certificate ID is found
  shelljs.exec(`
    gcloud beta app ssl-certificates create \
    --display-name ${CERT_NAME} \
    --certificate ./fullchain.pem \
    --private-key ./rsa.pem 
  `);
} else {
  // Otherwise, update the existing one
  shelljs.exec(`
    gcloud beta app ssl-certificates update ${CERT_ID} \
    --certificate ./fullchain.pem \
    --private-key ./rsa.pem
  `);
}
