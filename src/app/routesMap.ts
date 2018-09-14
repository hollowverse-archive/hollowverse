import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';
import { LoadableContactUs } from 'pages/ContactUs/LoadableContactUs';
import { LoadablePrivacyPolicy } from 'pages/PrivacyPolicy/LoadablePrivacyPolicy';
import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableHome } from 'pages/Home/LoadableHome';
import { LoadableModeration } from 'pages/Moderation/LoadableModeration';
import { AppRoutesMap } from 'components/App/App';

export const routesMap: AppRoutesMap = {
  '/search': LoadableSearchResults,
  '/contact': LoadableContactUs,
  '/privacy-policy': LoadablePrivacyPolicy,
  '/:slug': LoadableNotablePerson,
  '/moderation': LoadableModeration,
  default: LoadableHome,
};
