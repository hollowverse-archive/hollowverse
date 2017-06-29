import { createStore } from 'redux';
import { reducer } from '../../client/src/redux/reducers';

export const store = createStore(reducer);
