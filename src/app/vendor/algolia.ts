import algolia from 'algoliasearch';

const SEARCH_ONLY_API_KEY = '3ea32fd106324e761c148c083df01121';
const APP_ID = '4771KRER1Q';

export const client = algolia(APP_ID, SEARCH_ONLY_API_KEY);

export const notablePeople = client.initIndex('NotablePerson-prod');
