import universal from 'react-universal-component';
import { addLazyEpic } from 'store/store';
import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';

export const LoadableSearchResults = universal(import('./SearchResults'), {
  key: module => module.SearchResults,
  onLoad({ performSearchEpic }, { isServer }) {
    // Inject search epic
    addLazyEpic(performSearchEpic);

    if (!isServer) {
      LoadableNotablePerson.preload();
    }
  },
});
