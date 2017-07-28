#! /bin/sh

mkdir -p ./ssl/.well-known .certbot/config .certbot/work .certbot/logs

certbot certonly \
  --agree-tos \
  --email msafi@msafi.com \
  --config-dir ./.certbot/config \
  --work-dir ./.certbot/work \
  --logs-dir ./.certbot/logs \
  --noninteractive \
  --webroot \
  --webroot-path ./ssl \
  -d hollowverse.com,thehollowverse.com

cd .certbot/work/live/hollowverse.com/

openssl rsa -in privkey.pem -out rsa.pem

