/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');
const fs = require('fs');

const { API_ENDPOINT = 'https://api.hollowverse.com/graphql' } = process.env;

fetch(API_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
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
  }),
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );

    const data = {
      ...result.data,
      __schema: {
        ...result.data.__schema,
        types: filteredData,
      },
    };

    fs.writeFile(
      './src/app/api/fragmentTypes.json',
      JSON.stringify(data, undefined, 2),
      err => {
        if (err) {
          console.error('Error writing fragmentTypes file', err);
        } else {
          console.log('Fragment types successfully extracted!');
        }
      },
    );
  });
