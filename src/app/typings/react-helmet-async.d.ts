declare module 'react-helmet-async' {
  export * from 'react-helmet';
  import Helmet, { HelmetData } from 'react-helmet';
  export default Helmet;

  export type FilledContext = {
    helmet: HelmetData;
  };

  type ProviderProps = {
    context?: {};
  };

  export class HelmetProvider extends React.Component<ProviderProps> {}
}
