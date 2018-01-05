import * as React from 'react';
import { LogEvent, LogType } from 'store/features/logging/types';
import { log } from 'store/features/logging/actions';
import { connect } from 'react-redux';

type Props = {
  event: LogEvent<LogType>;
  log: typeof log;
  logKey: string;
  children?: undefined;
};

class LogOnMount extends React.PureComponent<Props> {
  log() {
    const { type, payload } = this.props.event;
    this.props.log(type, payload);
  }

  componentDidMount() {
    this.log();
  }

  componentDidUpdate() {
    this.log();
  }

  shouldComponentUpdate(nextProps: Props) {
    return this.props.logKey !== nextProps.logKey;
  }

  render() {
    return null;
  }
}

const ConnectedLogOnMount = connect(undefined, { log })(LogOnMount);

export { ConnectedLogOnMount as LogOnMount };
