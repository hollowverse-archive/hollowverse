# Encrypted Secrets

This folder contains secrets (private keys, JWT tokens, secret URLs) used for authenticating to various services used by Hollowverse. These files should be decrypted on the CI before deploying the project to Google Cloud Platform. The encryption key components for each file are stored as secure environment variables in Travis settings.

## `gcloud.travis.json.enc`
Key for Google Cloud Platform service account created for deployment tasks, used in Travis to authenticate `gcloud` in order to deploy the project to App Engine.

## `gcloud.letsEncrypt.json.enc`

Key for Google Cloud Platform service account created for the [`lets-encrypt`](../letsEncrypt) tasks, used to authenticate `gcloud` in order to create or update the SSL certificate settings in App Engine.

## `sumo.json.enc`
A JSON file used containing the Colllector ID used to instantiate a `SumoLogger` instance on the server, to send logs to [Sumo Logic](https://www.sumologic.com/). The HTTP collector ID should be treated as a secret since it is publicly accessible and anyone can send logs to the collector endpoint.

This is the structure of the file:

```json
{
  "collectorId": "<part of collector URL after https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/>"
}
```

## How to add or update an encrypted file
The encrypted files should be replaced with new ones when needed.

To replace or add a new encrypted secret, place the unencrypted secret file in this folder and use the [Travis CLI tool](https://github.com/travis-ci/travis.rb) to encrypt the file:

```
travis encrypt-file sumo.json
```

This will output the encrypted file to `sumo.json.enc`. The CLI tool will ask to confirm replace if a file with the same name exists.

Take note of the output of the previous command and update your decryption commands to use the new encryption key values (e.g. `$encrypted_744738cd0ff8_key`, `$encrypted_74f95b343f57_iv`) to decrypt the new file on CI.

Refer to [Travis documentation on encrypting sensitive files](https://docs.travis-ci.com/user/encrypting-files/) for more details.
