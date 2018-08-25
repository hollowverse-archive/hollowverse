import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';
import { LoadableContactUs } from 'pages/ContactUs/LoadableContactUs';
import { LoadablePrivacyPolicy } from 'pages/PrivacyPolicy/LoadablePrivacyPolicy';
import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableHome } from 'pages/Home/LoadableHome';
import { Moderation } from 'pages/Moderation/Moderation';
import { AppRoutesMap } from 'components/App/App';

export const routesMap: AppRoutesMap = {
  '/search': LoadableSearchResults,
  '/contact': LoadableContactUs,
  '/privacy-policy': LoadablePrivacyPolicy,
  '/:slug': LoadableNotablePerson,
  '/moderation': Moderation,
  default: LoadableHome,
};
