if [[ ($TRAVIS_BRANCH == "master") && ($TRAVIS_PULL_REQUEST == "false") ]]; then
  yarn deploy -- --non-interactive --token $FIREBASE_TOKEN;
fi
