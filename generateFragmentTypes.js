/**
 * Apollo needs some information about the schema at runtime in order to validate
 * the return type of a query when that type contains a union type. For example,
 * a `Result` type is a union of `SuccessResult` and `ErrorResult` and
 * without knowing what type a union resolves to, Apollo cannot validate
 * the return type of a query. It's probably not a big deal that it cannot do
 * the validation, but it would just keep complaining in the console about missing
 * fragment type information
 * @see https://www.apollographql.com/docs/react/advanced/fragments.html
 */

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
