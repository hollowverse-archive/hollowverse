import { connect } from 'react-redux';
import { log } from 'store/features/logging/actions';

type ConnectableChildProps = { log: typeof log };

type ConnectableProps = {
  log: typeof log;
  children(childProps: ConnectableChildProps): JSX.Element | null;
};

const Loggable = ({ children, ...rest }: ConnectableProps) => {
  return children(rest);
};

const ConnectedLoggable = connect(undefined, { log })(Loggable);

export { ConnectedLoggable as Loggable };
