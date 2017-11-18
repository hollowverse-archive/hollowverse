import universal from 'react-universal-component';

export default universal(import('./TestPage'), {
  key: m => m.TestPage,
});
