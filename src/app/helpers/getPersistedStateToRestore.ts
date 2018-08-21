import * as idbKeyVal from 'idb-keyval';

import { StoreState } from 'store/types';

export const getPersistedStateToRestore = async () => {
  try {
    return await idbKeyVal.get<Partial<StoreState>>('state');
  } catch {
    return undefined;
  }
};
