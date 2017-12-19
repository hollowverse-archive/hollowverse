import universal from 'react-universal-component';
import { epic$ } from 'store/store';
import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';

export const LoadableSearchResults = universal(import('./SearchResults'), {
  key: module => module.SearchResults,
  onLoad({ performSearchEpic }, { isServer }) {
    // Inject search epic
    epic$.next(performSearchEpic);

    if (!isServer) {
      LoadableNotablePerson.preload();
    }
  },
});
