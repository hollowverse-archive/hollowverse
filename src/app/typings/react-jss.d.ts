declare module 'react-jss/lib/JssProvider' {
  import { JSS, GenerateClassName } from 'jss';

  type Props = {
    jss: JSS;
    generateClassName: GenerateClassName;
  };

  const JssProvider: (props: Props) => JSX.Element;
  export = JssProvider;
}
