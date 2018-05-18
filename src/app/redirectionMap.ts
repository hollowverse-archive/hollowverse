import pathToRegExp from 'path-to-regexp';

/**
 * A map of old slugs to new slugs that are explicitly set to be redirected
 * to the new website.
 */
export const redirectionMap = new Map<string, string>([
  ['/tom-hanks', '/Tom_Hanks'],
  ['/michael-jordan', '/Michael_Jordan'],
  ['/shahid-kapoor', '/Shahid_Kapoor'],
  ['/taylor-swift', '/Taylor_Swift'],
  ['/leonardo-dicaprio', '/Leonardo_DiCaprio'],
  ['/joseph-stalin', '/Joseph_Stalin'],
  ['/will-smith', '/Will_Smith'],
  ['/morgan-freeman', '/Morgan_Freeman'],
  ['/jamie-foxx', '/Jamie_Foxx'],
  ['/robert-downey-jr', '/Robert_Downey_Jr.'],
  ['/jim-carrey', '/Jim_Carrey'],
  ['/mel-gibson', '/Mel_Gibson'],
  ['/paul-newman', '/Paul_Newman'],
  ['/alan-rickman', '/Alan_Rickman'],
  ['/cristiano-ronaldo', '/Cristiano_Ronaldo'],
  ['/bruce-willis', '/Bruce_Willis'],
  ['/brad-pitt', '/Brad_Pitt'],
  ['/bella-thorne', '/Bella_Thorne'],
  ['/al-pacino', '/Al_Pacino'],
  ['/chris-hemsworth', '/Chris_Hemsworth'],
  ['/ed-sheeran', '/Ed_Sheeran'],
  ['/steve-carell', '/Steve_Carell'],
  ['/stan-lee', '/Stan_Lee'],
  ['/zinedine-zidane', '/Zinedine_Zidane'],
  ['/tom-hiddleston', '/Tom_Hiddleston'],
  ['/seth-macfarlane', '/Seth_MacFarlane'],
  ['/dwayne-johnson', '/Dwayne_Johnson'],
  ['/beyonce', '/Beyoncé'],
  ['/terry-crews', '/Terry_Crews'],
  ['/rob-lowe', '/Rob_Lowe'],
  ['/alicia-keys', '/Alicia_Keys'],
  ['/benedict-cumberbatch', '/Benedict_Cumberbatch'],
  ['/trey-parker', '/Trey_Parker'],
  ['/george-clooney', '/George_Clooney'],
  ['/robert-de-niro', '/Robert_De_Niro'],
  ['/phil-mcgraw', '/Phil_McGraw'],
  ['/sylvester-stallone', '/Sylvester_Stallone'],
  ['/kanye-west', '/Kanye_West'],
  ['/eminem', '/Eminem'],
  ['/keanu-reeves', '/Keanu_Reeves'],
  ['/gordon-ramsay', '/Gordon_Ramsay'],
  ['/drake', '/Drake_(musician)'],
]);

export const whitelistedNewPaths = [
  ...Array.from(redirectionMap.values()),
  '/search',
  '/contact',
  '/privacy-policy',
  // tslint:disable-next-line:no-unnecessary-callback-wrapper
].map(path => pathToRegExp(path));

/** Determines whether a page on the new app can be accessed directly via the URL */
export const isWhitelistedPage = (path: string) =>
  whitelistedNewPaths.some(regExp => regExp.test(path));
