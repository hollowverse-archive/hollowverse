# Encrypted Secrets

This folder contains secrets (private keys, JWT tokens, secret URLs) used for authenticating to various services used by Hollowverse. These files should be decrypted on the CI before deploying the project to Google Cloud Platform. The encryption key components for each file are stored as secure environment variables in Travis settings.

## `gcloud.travis.json.enc`
Key for Google Cloud Platform service account created for deployment tasks, used in Travis to authenticate `gcloud` in order to deploy the project to App Engine.

## `gcloud.letsEncrypt.json.enc`

Key for Google Cloud Platform service account created for the [`lets-encrypt`](../letsEncrypt) App Engine service, used to authenticate `gcloud` in order to create or update the SSL certificate settings in App Engine.

## `sumo.json.enc`
A JSON file used containing the [Colllector ID](https://help.sumologic.com/Start-Here/02Getting-Started/Glossary#section_2) used to instantiate a `SumoLogger` instance on the server, to send logs to [Sumo Logic](https://www.sumologic.com/). The HTTP collector ID should be treated as a secret since it is publicly accessible and anyone can send logs to the collector endpoint.

This is the structure of the file:

```json
{
  "collectorId": "<part of collector URL after https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/>"
}
```

## How to add or update an encrypted file
The encrypted files should be replaced with new ones when needed.

To replace or add a new encrypted secret, place the unencrypted secret file in this folder and use OpenSSL to encrypt the file:

1. Generate a long, random password or passphrase, preferably using a password manager.
2. The following command will encrypt the file `sumo.json`, the encrypted output will be saved to `sumo.json.enc`, encoded in base64 (replace <password> with the value generated in the previous step):
    ```
    openssl aes-256-cbc -pass pass:'<password>' -in ./sumo.json -out sumo.json.enc -base64
    ```
    .
2. Save the password in Travis settings of your project as a secure variable. Let's assume it is saved as `ENC_PASS_SUMO`.
3. Add the decryption command to your deploy environment, making sure to use the secure variables instead of exposing the password directly:
    ```
    openssl aes-256-cbc -in ./sumo.json.enc -out sumo.json -base64 -d -pass pass:'$password'
    ```
    Since the password is stored as secure variables, Travis will make sure it is never displayed in the build logs. It will show up as `[secure]` instead of the actual value.

Repeat the previous steps every time you need to update a secret file.

### Why we are not using Travis CLI to encrypt files
A previous implementation used Travis CLI to do the encryption.

Travis CLI has [a documented issue](https://github.com/travis-ci/travis.rb/issues/239) with multiple encrypted files: whenever a new file is encrypted, the key values of a previously encrypted file are overwritten, even if the files are unrelated. So this will cause the decryption of previously encrypted files to fail since the key values have changed.

One [documented workaround](http://docs.travis-ci.com/user/encrypting-files/#Encrypting-multiple-files) is to create a zipped file containing all the files we wish to encrypt. But that means we will have to re-encrypt every sensitive file every time we update or add a single file. Which means we will need to keep the unencrypted files around on development machines to re-encrypt them later.

We think it is better to have a separate encryption key for each file, because it allows us to add secrets without having to re-encrypt the previously encrypted files, which means we do not have to keep an encrypted copy of each secret on our machines. Once the values of each key are stored in Travis, we can safely remove the unencrypted copies.
