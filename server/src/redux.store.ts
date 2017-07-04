import { createStore } from 'redux';
import { reducer } from 'client/src/store/reducers';

export const store = createStore(reducer);
