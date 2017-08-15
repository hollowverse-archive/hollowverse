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

To replace or add a new encrypted secret, place the unencrypted secret file in this folder and use OpenSSL to encrypt the file:

1. The following command will encrypt the file `sumo.json`, the encrypted output will be save to `sumo.json.enc`, encoded in base64:
    ```
    openssl aes-256-cbc -p -pass pass:'' -in ./sumo.json -out sumo.json.enc -base64
    ```
    It will also print the components of the key that was used to do the encryption:
    ```
    salt=<salt value>
    key=<key value>
    iv =<IV value>
    ```
2. Save the key and IV values in Travis settings of your project as secure variables. Let's assume they are saved as `ENC_KEY_SUMO` and `ENC_IV_SUMO`. The salt is used to randomize the key, and you don't have to store it because it will be stored by OpenSSL as part of the encrypted file.
3. Add the decryption command to your deploy environment, making sure to use the secure variables instead of exposing the key values directly:
    ```
    openssl aes-256-cbc -in ./sumo.json -out sumo.json.enc -K $ENC_KEY_SUMO -iv $ENC_IV_SUMO -base64
    ```
    Since these are store as secure variables, Travis will make sure they are never displayed in the build logs. They will show up as `[secure]` instead of the actual value.

Repeat the previous steps every time you need to replace the update file.
