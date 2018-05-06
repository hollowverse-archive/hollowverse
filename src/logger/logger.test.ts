import { convertObjectsToLines } from './logger';
import { LoggedAction } from './types';

describe('Logger', () => {
  it('should work', () => {
    const loggedActions: LoggedAction[] = [
      {
        type: 'UNHANDLED_ERROR_THROWN',
        payload: {
          message: 'Unknown error',
          column: 0,
          line: 0,
        },
        timestamp: '2018-05-05T18:51:07.908Z',
      },
      {
        type: 'PAGE_LOAD_FAILED',
        payload: '/Tom_Hanks',
        timestamp: '2018-05-05T19:18:49.053Z',
      },
      {
        type: 'PAGE_LOAD_SUCCEEDED',
        payload: '/Tom_Hanks',
        timestamp: '2018-05-05T19:18:49.053Z',
      },
    ];

    for (const action of loggedActions) {
      expect(
        convertObjectsToLines({ branch: 'master', commit: '123456' })(action),
      ).toMatchSnapshot();
    }
  });
});
