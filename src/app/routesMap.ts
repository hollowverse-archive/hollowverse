import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';
import { LoadableAbout } from 'pages/About/LoadableAbout';
import { LoadablePrivacyPolicy } from 'pages/PrivacyPolicy/LoadablePrivacyPolicy';
import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableHome } from 'pages/Home/LoadableHome';
import { AppRoutesMap } from 'components/App/App';

export const routesMap: AppRoutesMap = {
  '/search': LoadableSearchResults,
  '/about': LoadableAbout,
  '/privacy-policy': LoadablePrivacyPolicy,
  '/:slug': LoadableNotablePerson,
  default: LoadableHome,
};
