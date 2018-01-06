import * as React from 'react';
import { LogEvent, LogType } from 'store/features/logging/types';
import { log } from 'store/features/logging/actions';
import { connect } from 'react-redux';

type Props = {
  event: LogEvent<LogType>;
  log: typeof log;
  logKey: string;
  children: JSX.Element | null;
};

class LogOnMount extends React.PureComponent<Props> {
  log() {
    const { type, payload } = this.props.event;
    this.props.log(type, payload);
  }

  componentDidMount() {
    this.log();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.logKey !== this.props.logKey) {
      this.log();
    }
  }

  render() {
    return this.props.children;
  }
}

const ConnectedLogOnMount = connect(undefined, { log })(LogOnMount);

export { ConnectedLogOnMount as LogOnMount };
