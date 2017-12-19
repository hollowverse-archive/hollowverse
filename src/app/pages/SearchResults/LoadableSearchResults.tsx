import universal from 'react-universal-component';
import { epic$ } from 'store/store';

export const LoadableSearchResults = universal(import('./SearchResults'), {
  key: module => module.SearchResults,
  onLoad({ performSearchEpic }) {
    // Inject search epic
    epic$.next(performSearchEpic);
  },
});
