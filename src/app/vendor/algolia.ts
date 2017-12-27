import algolia from 'algoliasearch';

const SEARCH_ONLY_API_KEY = 'd970947e688348297451c41746235cd5';
const APP_ID = '33DEXZ8MDK';

export const client = algolia(APP_ID, SEARCH_ONLY_API_KEY);

export const notablePeople = client.initIndex('NotablePerson-dev');
