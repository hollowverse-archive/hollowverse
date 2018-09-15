/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle,no-console */
/* tslint:disable no-console */
const got = require('got');
const fs = require('fs-extra');

const { API_ENDPOINT = 'https://api.hollowverse.com/graphql' } = process.env;

(async () => {
  try {
    const {
      body: { data },
    } = await got.post(API_ENDPOINT, {
      json: true,
      body: {
        variables: {},
        operationName: '',
        query: `
          {
            __schema {
              types {
                kind
                name
                possibleTypes {
                  name
                }
              }
            }
          }
        `,
      },
    });

    // Here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );

    const result = {
      ...data,
      __schema: {
        ...data.__schema,
        types: filteredData,
      },
    };

    await fs.writeFile(
      './src/app/api/fragmentTypes.json',
      JSON.stringify(result, undefined, 2),
    );

    console.log('Fragment types successfully extracted!');
  } catch (error) {
    console.error('Error writing fragmentTypes file', error);
  }
})();
